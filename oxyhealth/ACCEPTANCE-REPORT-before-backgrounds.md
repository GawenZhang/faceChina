# 本轮导航与模板验收报告

更新时间：2026-11-12T09:27:14.520Z。主要结构差异已修复；**完整原站视觉验收尚未完成，不能标为全站一致性通过。**

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

- /mild-hyperbaric-chamber
- /hyperbaric-chamber-for-business
- /hyperbaric-therapy-brain-health
- /hyperbaric-therapy-inflammation
- /hyperbaric-therapy-long-covid
- /hyperbaric-therapy-veterinary
- /hyperbaric-therapy-wound-healing
- /why-oxyhealth
- /post/does-insurance-cover-hyperbaric-oxygen-therapy
- /post/hbot-for-pets-veterinary-hyperbaric-therapy
- /post/how-mark-andrews-used-a-hyperbaric-oxygen-chamber-in-his-injury-recovery

其余新模板有文本结构证据但仍未取得原站视觉测量。后续仍需原站浏览器深度抓取、动画时间线及上述 11 页实际内容，才能完成视觉验收。

## 构建和 QA

构建生成 70 个静态页面，覆盖根清单全部 61 个地址。构建错误已修复。整套 QA：**通过**。专项阶段产品 15 项、过渡 18 项、文章/独立页 66 项、扩展模板 132 项；最终输出以下表与 JSON 为准。

导航检查：140 次页面扫描、148 次整页跳转/刷新/返回、52 次片段目标、34 次站外打开。离线测试替代图片、字体和外部服务，未真实提交表单；询价、聊天、表单仍为本地预览。

| 脚本 | 结果 | 用时 |
|---|---|---|
| qa.mjs | 通过 | 3 秒 |
| qa-motion.mjs | 通过 | 8 秒 |
| qa-products.mjs | 通过 | 10 秒 |
| qa-template-structure.mjs | 通过 | 5 秒 |
| qa-extended-current.mjs | 通过 | 11 秒 |
| qa-navigation.mjs | 通过 | 139 秒 |
| qa-coverage.mjs | 通过 | 37 秒 |
| qa-new-interactions.mjs | 通过 | 4 秒 |
| qa-resume.mjs | 通过 | 21 秒 |
| qa-flows.mjs | 通过 | 13 秒 |
| qa-faq.mjs | 通过 | 7 秒 |

结果：[qa-suite-results.json](qa-suite-results.json)、[qa-motion-results.json](qa-motion-results.json)、[qa-products-results.json](qa-products-results.json)、[qa-template-structure-results.json](qa-template-structure-results.json)、[qa-extended-current-results.json](qa-extended-current-results.json)。本地截图在 qa-products-respiro-*、qa-template-* 和 qa-extended-*，不冒充原站截图。

## rebuild_check

导航/产品阶段、模板合并后和最终构建后已重跑。首个一分钟等待超时，后台稍后写出真实结果；后续正常返回。阶段记录见 inspection/navigation-current/ 与 rebuild-check-template-checkpoint.json。

最终 86%，默认要求 90%：**未达到默认视觉阈值**。比较范围仍为旧首页、Hyperbarics、Resources、Blog、A4M 与交互状态，没有新产品/其他模板参考图，不能据此把新模板标为视觉一致性通过。保留用户接受的素材和细小差异，不为追分反复调整。详见 [rebuild-check-final.json](rebuild-check-final.json)。

## 逐页验收

“本地 QA 通过”仅表示结构、URL、布局边界和交互工作；不等于原站视觉一致。

| URL | 模板 | 原站证据状态 | 本地结果 |
|---|---|---|---|
| / | home | 沿用既有抓取 | 本地 QA 通过 |
| /hyperbarics | hyperbarics | 沿用既有抓取 | 本地 QA 通过 |
| /resources | resources | 沿用既有抓取 | 本地 QA 通过 |
| /blog | blog-list | 沿用既有抓取 | 本地 QA 通过 |
| /events/a4m-longevity-fest | event-detail | 沿用既有抓取 | 本地 QA 通过 |
| /products/fortius-420 | product | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /products/fortius-420-exp | product | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /products/quamvis-320 | product | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /products/respiro-270 | product | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /products/vitaeris-320 | product | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /blog/fda-hyperbaric-chambers-wellness-devices-not-exempt | article | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /post/hyperbaric-oxygen-therapy-for-longevity | article | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /post/hbot-for-brain-injury-what-clinical-trials-show | article | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /post/hyperbaric-oxygen-therapy-for-long-covid-research | article | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /post/does-insurance-cover-hyperbaric-oxygen-therapy | article | 未获取，保留占位 | 本地 QA 通过 |
| /post/starting-an-hbot-business-clinic-setup-guide | article | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /post/hbot-for-pets-veterinary-hyperbaric-therapy | article | 未获取，保留占位 | 本地 QA 通过 |
| /post/why-russell-wilson-spends-over-1-million-a-year-on-his-body | article | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /post/from-survival-to-service-coryn-carvers-journey-to-healing-through-hyperbaric-therapy | article | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /post/how-medical-grade-hyperbaric-oxygen-therapy-is-supporting-healing-at-md-hyperbaric-stamford | article | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /post/how-mark-andrews-used-a-hyperbaric-oxygen-chamber-in-his-injury-recovery | article | 未获取，保留占位 | 本地 QA 通过 |
| /post/how-neymar-jr-uses-advanced-recovery-tech-to-stay-at-peak-performance | article | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /post/hyperbaric-success-stories-how-top-athletes-use-oxygen-therapy-to-heal-and-recover | article | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /post/lebron-james-uses-hyperbaric-oxygen-therapy | article | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /post/the-rise-of-hyperbaric-oxygen-therapy-in-professional-sports | article | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /contact | contact | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /support | support | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /partners | partners | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /why-oxyhealth | why-oxyhealth | 未获取，保留占位 | 本地 QA 通过 |
| /finance | finance | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /about | about | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /events/events | event-list | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /hyperbaric-chamber-for-sale | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /home-hyperbaric-chamber | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /portable-hyperbaric-chamber | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /soft-shell-hyperbaric-chamber | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /mild-hyperbaric-chamber | landing | 未获取，保留占位 | 本地 QA 通过 |
| /fda-cleared-hyperbaric-chamber | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /best-hyperbaric-chamber | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /hyperbaric-chamber-comparison | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /hyperbaric-chamber-buying-guide | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /hyperbaric-chamber-cost | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /hyperbaric-chamber-for-business | landing | 未获取，保留占位 | 本地 QA 通过 |
| /hbot-for-your-practice | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /hyperbaric-chamber-rental | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /used-hyperbaric-chamber | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /hyperbaric-chamber-prescription | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /hyperbaric-chamber-room-requirements | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /genuine-oxyhealth-hyperbaric-chamber | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /hyperbaric-chamber-benefits | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /hyperbaric-chamber-side-effects | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /hyperbaric-chamber-insurance | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /hyperbaric-research-library | research-library | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /hyperbaric-therapy-anti-aging | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /hyperbaric-therapy-athletic-recovery | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /hyperbaric-therapy-brain-health | landing | 未获取，保留占位 | 本地 QA 通过 |
| /hyperbaric-therapy-inflammation | landing | 未获取，保留占位 | 本地 QA 通过 |
| /hyperbaric-therapy-long-covid | landing | 未获取，保留占位 | 本地 QA 通过 |
| /hyperbaric-therapy-near-me | landing | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /hyperbaric-therapy-veterinary | landing | 未获取，保留占位 | 本地 QA 通过 |
| /hyperbaric-therapy-wound-healing | landing | 未获取，保留占位 | 本地 QA 通过 |
| /vitaeris-320-vs-respiro-270 | comparison | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /vitaeris-320-vs-quamvis-320 | comparison | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /fortius-420-vs-fortius-420-exp | comparison | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /documents/safety | document-safety | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /documents/terms-conditions | document-terms | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /documents/privacy-notice | document-privacy | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /documents/repair-exchange-policy | document-repair | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /documents/fda | document-fda | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |
| /hyperbaric-pressure-converter | pressure-converter | 原站文本结构已核对；视觉未验证 | 本地 QA 通过 |

旧记录归档：[inspection/acceptance-report-before-template-audit.md](inspection/acceptance-report-before-template-audit.md)。旧“已验证”不得解释为本轮原站视觉一致性结论。
