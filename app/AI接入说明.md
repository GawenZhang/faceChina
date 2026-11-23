# AI 服务接入点

已采样后台 AI 页面并在 admin-runtime.js 接入统一服务。默认是明确返回未配置状态的空壳；真实模型服务和原站付费流程没有接入。

## 文件与调用约定

- `ai-config.js`：公开浏览器配置，默认 `mode: 'stub'`。不得填写供应商密钥。
- `services/ai-service.js`：统一 `window.GeoAI.request(operation, input, options)`。支持操作标识 `generate`（生成）、`detect`（检测）、`analyze`（分析）；这些是本地服务端接口的操作约定，页面映射见文末。
- `check-ai.mjs`：用 `node check-ai.mjs` 检查 stub、代理协议、取消、超时及错误分支；这是服务层测试，不是原站或浏览器 UI 验收。

页面按顺序加载 `/ai-config.js` 和 `/services/ai-service.js`。方法返回 Promise，始终返回结构化结果：

```js
{
  ok: false,
  status: 'not_configured',
  operation: 'generate',
  data: null,
  error: { code: 'not_configured', message: 'AI 服务尚未接入，请先配置服务接口。' }
}
```

`status` 为 `success`、`not_configured`、`error` 或 `cancelled`。调用时通过 `onStateChange(status)` 先通知 `loading`，再通知最终状态。stub 默认延迟 350ms，所有操作均明确返回 `not_configured`，不联网、不生成假文章、假评分或假分析。输入仅保存在单次调用内，不写入日志或浏览器存储。

调用示例：

```js
var aborter = new AbortController();
GeoAI.request('generate', { topic: '用户输入' }, {
  signal: aborter.signal,
  onStateChange: function (status) {
    submitButton.disabled = status === 'loading';
  }
}).then(function (result) {
  if (!result.ok) {
    feedback.textContent = result.error.message;
    return;
  }
  output.textContent = result.data.text || '';
});
// 用户关闭弹窗或点击取消时：aborter.abort();
```

显示结果和错误请使用 `textContent`，或遵循对应 UI 组件的文本转义方式。一次调用仅通知一次最终状态，超时或取消后晚到的数据不会覆盖页面。

## 接入自己的 AI API

1. 在自己的服务端提供同源 `POST /api/ai`，由服务端读取环境变量中的供应商密钥并转发请求。纯静态构建本身不提供代理服务。
2. 将 `ai-config.js` 的 `mode` 改为 `proxy`，按需要修改 `endpoint`、`timeoutMs` 和 `operations` 的服务端操作名称，然后重新构建。
3. 服务端接收 `Content-Type: application/json`，请求格式为 `{ "operation": "generate", "input": { ... } }`。
4. 成功时返回 HTTP 2xx、JSON `{ "ok": true, "data": { ... } }`；失败返回非 2xx 或 `{ "ok": false }`。`data` 不可缺失或为 `null`，具体字段由接入页面与服务端约定。

服务只接受与当前页面同源的 HTTP(S) 地址，拒绝外站地址、含用户名密码或锚点的地址，并禁止重定向。凭据设置为 `same-origin`，可使用自有后端的 HttpOnly 会话；不支持在前端配置 API Key、Authorization 头或任意请求头。默认超时 30 秒，含响应 JSON 读取时间。后台需要按自身鉴权与 CSRF 规则实现接口。

HTTP、网络、格式、服务失败分别返回 `http_error`、`network_error`、`invalid_response`、`service_error`；超时返回 `timeout`，取消返回 `cancelled`。客户端不会显示服务端任意错误正文，避免把内部诊断或 HTML 当作业务结果。需要适配不同供应商协议时，在自己的代理中转换为上述统一格式即可。

## 已接入的页面映射

| 页面/按钮 | 操作 | 本地调用 |
| --- | --- | --- |
| /user/analyze_v2/add 与 /user/analyze/add 的品牌全网分析 .pingpai_jiexi | analyze | admin-runtime.js 的 callAI |
| 同页创建AI诊断 .query-button | detect | 同一 callAI |
| /user/ai_image/add 的生成表单、AI写作/爆文任务表单 | generate | localSubmit → callAI |
| 拓词及相关AI工具 | generate 或 analyze | 根据页面类型由 aiMode 映射 |

UI请求参数为 { page: pageKey, fields: 表单字段对象 }，不包含密码、隐藏令牌或文件内容。后台代理应按 page 和 operation 分发；新页面可复用同一入口，不要各自硬编码供应商请求。

本轮浏览器证据为 ../capture/admin/local-ai-generate/、local-ai-detect/、local-ai-analyze/；三类操作均展示了统一 not_configured 反馈。npm.cmd run test:browser 校验保存的浏览器结果，15项独立服务测试覆盖取消、超时和异常。逐页采样与差异见验收说明.md。
