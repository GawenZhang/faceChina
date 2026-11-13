import fs from 'node:fs/promises';
import {allRoutes} from './route-manifest.mjs';
const read=async p=>JSON.parse((await fs.readFile(p,'utf8')).replace(/^\uFEFF/,''));
const p=await read('inspection/products-current/audit.json'),i=await read('inspection/independent-current/audit.json'),e=await read('evidence-extended-current/audit.json');
const q=await read('qa-suite-results.json'),n=await read('qa-navigation-results.json'),r=await read('rebuild-check-final.json');
const missing=new Set(['/mild-hyperbaric-chamber','/hyperbaric-chamber-for-business','/hyperbaric-therapy-brain-health','/hyperbaric-therapy-inflammation','/hyperbaric-therapy-long-covid','/hyperbaric-therapy-veterinary','/hyperbaric-therapy-wound-healing',...i.pages.filter(x=>x.status==='unverified-placeholder').map(x=>x.path)]);
const checked=new Set([...p.pages.map(x=>new URL(x.url).pathname),...i.pages.map(x=>x.path),...e.routes.map(x=>x.path)]);
const scores=r.report.match(/(\d+)% alike \(needs (\d+)%\)/);
const rows=allRoutes.map(x=>`| ${x.path} | ${x.template} | ${!checked.has(x.path)?'沿用既有抓取':missing.has(x.path)?'未获取，保留占位':'原站文本结构已核对；视觉未验证'} | ${q.passed?'本地 QA 通过':'详见 QA 结果'} |`).join('\n');
const qa=q.scripts.map(x=>`| ${x.script} | ${x.passed?'通过':'失败'} | ${Math.round(x.duration_ms/1000)} 秒 |`).join('\n');
await fs.writeFile('ACCEPTANCE-REPORT.md',`# 本轮导航与模板验收报告

更新时间：${new Date().toISOString()}。主要结构差异已修复；**完整原站视觉验收尚未完成，不能标为全站一致性通过。**

## 证据与执行限制

Craft 会话确认处于 deep 模式。本轮逐 URL 请求 65 个新增页面：5 产品、15 文章、7 独立页、38 扩展页。54 个取得原站文本结构，11 个无法获取。web_site_open 与 web_page_show 均被自动审批拒绝，返回 requires approval, but approval policy is never；直接 HTTP 请求为 EACCES，网页工具也不能读取原站 JS/CSS。因此没有新增原站渲染截图、计算样式或动画时间线。本地 QA 截图绝不是原站视觉证据。

Respiro 首屏采用用户提供的深色、蓝标签、白标题和按钮视觉观察；其他页面只修正文本证据能支持的结构。精确颜色、字号、间距、图片比例、断点和下半页视觉未验证。图片、Logo、正文和尺寸图继续采用获准占位，未反复修改已接受的微小视觉差异。

## 根因

1. 导航：main.jsx 原先仅按 pathname 渲染，新文档没有入场动画。capture/page.html 确认加载 framer-motion，**库名不能证明具体时长与曲线**。
2. 产品：旧 product-article-reference.json 留有一个代表产品的文本检查，不能断言“从未访问任何产品页”；可证实的是缺少渲染证据却设计了浅色面包屑首屏，并把临床安装步骤外推给便携型号。
3. 其他模板：28 个着陆页共用五型号模板，人物故事被套成长文与 FAQ，各页特有的图片、表格、表单和内容顺序遗漏。旧的 URL/交互验证不等于原站布局验证。

## 模板修复

| 类别 | 已实施 | 证据边界 |
|---|---|---|
| 导航 | 内部真实链接入场向上滑动渐显；保留整页导航、历史、刷新、修饰键、新标签、下载、锚点与减弱动画偏好 | 40px→0、600ms、cubic-bezier(0.22,1,0.36,1) 为暂定参数，原站精确参数未验证 |
| 产品详情 | 深色首屏，双蓝标签，完整白色多行标题，正文，蓝 Call/深色 Quote/金框 Why，右侧产品图；分型号指标、FAQ、规格与尺寸图；便携附件与临床安装流程分开 | 五页逐一读取；[证据](inspection/products-current/audit.json)；其他型号配色及全部精确尺寸未验证 |
| 文章 | 分离编辑长文、研究文章、人物故事；恢复目录/展开块/参考区域，移除错误封面/面包屑及人物故事强加的章节和 FAQ | 12 篇结构可读，3 篇占位；[证据](inspection/independent-current/audit.json) |
| 独立页 | 补 Support 图片、Partners 引言/照片/清单/实施顺序、About 正文层级；文本顺序一致的部分保留 | 6 页结构可读，Why 占位；原站精确视觉未验证 |
| 着陆页/指南 | 21 个可读页面按逐路由结构改造：Home 两型号，运动恢复数据条/故事，Cost 报价表单，紧凑指南与表格；诊所推广页独立 Logo/电话页头 | 7 页占位；推广页原站页脚无证据，保留旧页脚并标未验证；[证据](evidence-extended-current/audit.json) |
| 对比 | 三页恢复完整标题、10 行规格与型号对应差异组 | 三页原站结构已读，视觉未验证 |
| 法务 | 五类按各自内容组与目录，移除无证据面包屑，FDA 文档项数量修正 | 五类代表页已读，文案占位不作为正式法务文本 |
| 工具/研究库 | 换算器恢复六项结果，保留校验/重置；研究库保留筛选与阅读列表 | 原站结构已读，本地行为已测，研究数据继续占位 |

## 未获取原站的页面

以下 11 页保持占位，不凭推测重做；标记为原站未验证：

${[...missing].map(x=>'- '+x).join('\n')}

其余新模板有文本结构证据但仍未取得原站视觉测量。后续仍需原站浏览器深度抓取、动画时间线及上述 11 页实际内容，才能完成视觉验收。

## 构建和 QA

构建生成 70 个静态页面，覆盖根清单全部 61 个地址。构建错误已修复。整套 QA：**${q.passed?'通过':'未通过'}**。专项阶段产品 15 项、过渡 18 项、文章/独立页 66 项、扩展模板 132 项；最终输出以下表与 JSON 为准。

导航检查：${n.scans.length} 次页面扫描、${n.entries.length} 次整页跳转/刷新/返回、${n.fragments.length} 次片段目标、${n.externalEntries.length} 次站外打开。离线测试替代图片、字体和外部服务，未真实提交表单；询价、聊天、表单仍为本地预览。

| 脚本 | 结果 | 用时 |
|---|---|---|
${qa}

结果：[qa-suite-results.json](qa-suite-results.json)、[qa-motion-results.json](qa-motion-results.json)、[qa-products-results.json](qa-products-results.json)、[qa-template-structure-results.json](qa-template-structure-results.json)、[qa-extended-current-results.json](qa-extended-current-results.json)。本地截图在 qa-products-respiro-*、qa-template-* 和 qa-extended-*，不冒充原站截图。

## rebuild_check

导航/产品阶段、模板合并后和最终构建后已重跑。首个一分钟等待超时，后台稍后写出真实结果；后续正常返回。阶段记录见 inspection/navigation-current/ 与 rebuild-check-template-checkpoint.json。

最终 ${scores?.[1]||'未知'}%，默认要求 ${scores?.[2]||90}%：**未达到默认视觉阈值**。比较范围仍为旧首页、Hyperbarics、Resources、Blog、A4M 与交互状态，没有新产品/其他模板参考图，不能据此把新模板标为视觉一致性通过。保留用户接受的素材和细小差异，不为追分反复调整。详见 [rebuild-check-final.json](rebuild-check-final.json)。

## 逐页验收

“本地 QA 通过”仅表示结构、URL、布局边界和交互工作；不等于原站视觉一致。

| URL | 模板 | 原站证据状态 | 本地结果 |
|---|---|---|---|
${rows}

旧记录归档：[inspection/acceptance-report-before-template-audit.md](inspection/acceptance-report-before-template-audit.md)。旧“已验证”不得解释为本轮原站视觉一致性结论。
`);
console.log('Acceptance report: 70 routes, 54 retrieved source outlines, 11 explicit placeholders; original visual verification incomplete.');
