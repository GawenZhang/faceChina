import fs from 'node:fs';let s=fs.readFileSync('app/AI接入说明.md','utf8');
s=s.replace('当前只提供统一服务接口基础；原站后台 AI 功能尚未取得登录后采样，不能据此声称原站生成、检测、分析页面或流程已经复刻。此文件没有编造原站页面、路由、字段或结果。','已采样后台 AI 页面并在 admin-runtime.js 接入统一服务。默认是明确返回未配置状态的空壳；真实模型服务和原站付费流程没有接入。');
s=s.replace('这些是本地接入约定，尚未与原站功能逐项映射。','这些是本地服务端接口的操作约定，页面映射见文末。');
s=s.replace('调用示例（页面字段需按实际采样结果接入）：','调用示例：');
s=s.slice(0,s.indexOf('## 仍需后续采样的映射'))+`## 已接入的页面映射

| 页面/按钮 | 操作 | 本地调用 |
| --- | --- | --- |
| /user/analyze_v2/add 与 /user/analyze/add 的品牌全网分析 .pingpai_jiexi | analyze | admin-runtime.js 的 callAI |
| 同页创建AI诊断 .query-button | detect | 同一 callAI |
| /user/ai_image/add 的生成表单、AI写作/爆文任务表单 | generate | localSubmit → callAI |
| 拓词及相关AI工具 | generate 或 analyze | 根据页面类型由 aiMode 映射 |

UI请求参数为 { page: pageKey, fields: 表单字段对象 }，不包含密码、隐藏令牌或文件内容。后台代理应按 page 和 operation 分发；新页面可复用同一入口，不要各自硬编码供应商请求。

本轮浏览器证据为 ../capture/admin/local-ai-generate/、local-ai-detect/、local-ai-analyze/；三类操作均展示了统一 not_configured 反馈。npm.cmd run test:browser 校验保存的浏览器结果，15项独立服务测试覆盖取消、超时和异常。逐页采样与差异见验收说明.md。
`;fs.writeFileSync('app/AI接入说明.md',s);
