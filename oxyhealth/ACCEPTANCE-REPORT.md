# 验收报告 — 2026-11-13 实时采样收尾

本轮原站采样权限已恢复：44/44 个目标均实时打开并保存 1440、768、390 三种屏宽的截图、完整 DOM、分区布局与颜色记录，共 132 张原站截图。44 = 28 个着陆页 + 15 篇文章 + /why-oxyhealth；此前 11 个占位页是其中的子集（7 个着陆页、3 篇文章、Why），不重复计数。

当前逐项结果：**已验证 44/44，待修复 0/44**。这里“已验证”指本次要求的背景分段、配色、布局、尺寸与文字层级核对；素材占位、此前已接受差异保持原协议，不宣称全像素一致。完整 QA 15/15，70 个静态页构建成功，61 个清单 URL 全覆盖。

## 修改与依据

- 28 个着陆页恢复各自原站内容分段、背景顺序、网格、容器宽度、响应断点和标题/正文层级，替换此前猜测模板；咨询按钮、FAQ、cost 表单及 practice 原生弹窗保持本地可用。
- 15 篇文章逐页恢复封面/正文/FAQ/引用/相关链接/结尾 CTA 的实际结构，保留文字行数和媒体比例；验证 48 个按钮 FAQ、9 个原生折叠区与目录锚点。
- Why 恢复 9 个分区、黑金配色、5 段时间线、19,000 计数、6 张资质滚动卡、7 项 FAQ 和 CTA，并检查桌面滚动与减弱动画分支。
- 样式仅作用于新采样页面，原公共导航、页脚及已接受差异不反复改动；原站脚本、跟踪与外部提交不随 DOM 导入。

原站总索引：[live-captures-20261113.json](live-captures-20261113.json)。实施阶段核对快照：[着陆页](landing-review.json)、[文章](article-review.json)、[Why](inspection/live-20261113/why-review.json)；其中的“等待最终 QA”描述属于实施阶段，最终状态以 [closeout-verification.json](closeout-verification.json) 的构建指纹及逐项结果为准。历史报告保存在 [ACCEPTANCE-REPORT-before-20261113.md](ACCEPTANCE-REPORT-before-20261113.md)，其中“审批阻断/未验证”是历史状态。

## 44 个目标逐项核销

| # | URL | 类型 | 原占位页 | 背景/配色 | 布局/层级 | 核销结果 | 实时依据 |
|---|---|---|---|---|---|---|---|
| 1 | /blog/fda-hyperbaric-chambers-wellness-devices-not-exempt | article | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/blog__fda-hyperbaric-chambers-wellness-devices-not-exempt/capture.json) |
| 2 | /post/hyperbaric-oxygen-therapy-for-longevity | article | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/post__hyperbaric-oxygen-therapy-for-longevity/capture.json) |
| 3 | /post/hbot-for-brain-injury-what-clinical-trials-show | article | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/post__hbot-for-brain-injury-what-clinical-trials-show/capture.json) |
| 4 | /post/hyperbaric-oxygen-therapy-for-long-covid-research | article | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/post__hyperbaric-oxygen-therapy-for-long-covid-research/capture.json) |
| 5 | /post/does-insurance-cover-hyperbaric-oxygen-therapy | article | 是，已补齐源结构 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/post__does-insurance-cover-hyperbaric-oxygen-therapy/capture.json) |
| 6 | /post/starting-an-hbot-business-clinic-setup-guide | article | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/post__starting-an-hbot-business-clinic-setup-guide/capture.json) |
| 7 | /post/hbot-for-pets-veterinary-hyperbaric-therapy | article | 是，已补齐源结构 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/post__hbot-for-pets-veterinary-hyperbaric-therapy/capture.json) |
| 8 | /post/why-russell-wilson-spends-over-1-million-a-year-on-his-body | article | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/post__why-russell-wilson-spends-over-1-million-a-year-on-his-body/capture.json) |
| 9 | /post/from-survival-to-service-coryn-carvers-journey-to-healing-through-hyperbaric-therapy | article | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/post__from-survival-to-service-coryn-carvers-journey-to-healing-through-hyperbaric-therapy/capture.json) |
| 10 | /post/how-medical-grade-hyperbaric-oxygen-therapy-is-supporting-healing-at-md-hyperbaric-stamford | article | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/post__how-medical-grade-hyperbaric-oxygen-therapy-is-supporting-healing-at-md-hyperbaric-stamford/capture.json) |
| 11 | /post/how-mark-andrews-used-a-hyperbaric-oxygen-chamber-in-his-injury-recovery | article | 是，已补齐源结构 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/post__how-mark-andrews-used-a-hyperbaric-oxygen-chamber-in-his-injury-recovery/capture.json) |
| 12 | /post/how-neymar-jr-uses-advanced-recovery-tech-to-stay-at-peak-performance | article | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/post__how-neymar-jr-uses-advanced-recovery-tech-to-stay-at-peak-performance/capture.json) |
| 13 | /post/hyperbaric-success-stories-how-top-athletes-use-oxygen-therapy-to-heal-and-recover | article | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/post__hyperbaric-success-stories-how-top-athletes-use-oxygen-therapy-to-heal-and-recover/capture.json) |
| 14 | /post/lebron-james-uses-hyperbaric-oxygen-therapy | article | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/post__lebron-james-uses-hyperbaric-oxygen-therapy/capture.json) |
| 15 | /post/the-rise-of-hyperbaric-oxygen-therapy-in-professional-sports | article | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/post__the-rise-of-hyperbaric-oxygen-therapy-in-professional-sports/capture.json) |
| 16 | /why-oxyhealth | why-oxyhealth | 是，已补齐源结构 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/why-oxyhealth/capture.json) |
| 17 | /hyperbaric-chamber-for-sale | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-chamber-for-sale/capture.json) |
| 18 | /home-hyperbaric-chamber | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/home-hyperbaric-chamber/capture.json) |
| 19 | /portable-hyperbaric-chamber | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/portable-hyperbaric-chamber/capture.json) |
| 20 | /soft-shell-hyperbaric-chamber | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/soft-shell-hyperbaric-chamber/capture.json) |
| 21 | /mild-hyperbaric-chamber | landing | 是，已补齐源结构 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/mild-hyperbaric-chamber/capture.json) |
| 22 | /fda-cleared-hyperbaric-chamber | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/fda-cleared-hyperbaric-chamber/capture.json) |
| 23 | /best-hyperbaric-chamber | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/best-hyperbaric-chamber/capture.json) |
| 24 | /hyperbaric-chamber-comparison | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-chamber-comparison/capture.json) |
| 25 | /hyperbaric-chamber-buying-guide | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-chamber-buying-guide/capture.json) |
| 26 | /hyperbaric-chamber-cost | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-chamber-cost/capture.json) |
| 27 | /hyperbaric-chamber-for-business | landing | 是，已补齐源结构 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-chamber-for-business/capture.json) |
| 28 | /hbot-for-your-practice | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hbot-for-your-practice/capture.json) |
| 29 | /hyperbaric-chamber-rental | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-chamber-rental/capture.json) |
| 30 | /used-hyperbaric-chamber | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/used-hyperbaric-chamber/capture.json) |
| 31 | /hyperbaric-chamber-prescription | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-chamber-prescription/capture.json) |
| 32 | /hyperbaric-chamber-room-requirements | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-chamber-room-requirements/capture.json) |
| 33 | /genuine-oxyhealth-hyperbaric-chamber | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/genuine-oxyhealth-hyperbaric-chamber/capture.json) |
| 34 | /hyperbaric-chamber-benefits | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-chamber-benefits/capture.json) |
| 35 | /hyperbaric-chamber-side-effects | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-chamber-side-effects/capture.json) |
| 36 | /hyperbaric-chamber-insurance | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-chamber-insurance/capture.json) |
| 37 | /hyperbaric-therapy-anti-aging | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-therapy-anti-aging/capture.json) |
| 38 | /hyperbaric-therapy-athletic-recovery | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-therapy-athletic-recovery/capture.json) |
| 39 | /hyperbaric-therapy-brain-health | landing | 是，已补齐源结构 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-therapy-brain-health/capture.json) |
| 40 | /hyperbaric-therapy-inflammation | landing | 是，已补齐源结构 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-therapy-inflammation/capture.json) |
| 41 | /hyperbaric-therapy-long-covid | landing | 是，已补齐源结构 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-therapy-long-covid/capture.json) |
| 42 | /hyperbaric-therapy-near-me | landing | 否 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-therapy-near-me/capture.json) |
| 43 | /hyperbaric-therapy-veterinary | landing | 是，已补齐源结构 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-therapy-veterinary/capture.json) |
| 44 | /hyperbaric-therapy-wound-healing | landing | 是，已补齐源结构 | 三宽通过 | 三宽通过 | 已验证 | [原站证据](inspection/live-20261113/hyperbaric-therapy-wound-healing/capture.json) |

## 完整 QA 与构建

QA 开始：2026-11-13T05:03:45.840Z；完成：2026-11-13T05:09:44.738Z。以下均为本轮重新运行，不沿用旧 QA。

| 脚本 | 结果 | 耗时 |
|---|---|---|
| qa.mjs | 通过 | 2.9 秒 |
| qa-motion.mjs | 通过 | 8.5 秒 |
| qa-products.mjs | 通过 | 10.4 秒 |
| qa-backgrounds.mjs | 通过 | 26.3 秒 |
| qa-template-structure.mjs | 通过 | 13.2 秒 |
| qa-extended-current.mjs | 通过 | 16.5 秒 |
| qa-live-source.mjs | 通过 | 15.0 秒 |
| qa-captured-geometry.mjs | 通过 | 7.0 秒 |
| qa-why-live.mjs | 通过 | 19.7 秒 |
| qa-navigation.mjs | 通过 | 142.1 秒 |
| qa-coverage.mjs | 通过 | 46.4 秒 |
| qa-new-interactions.mjs | 通过 | 4.9 秒 |
| qa-resume.mjs | 通过 | 24.4 秒 |
| qa-flows.mjs | 通过 | 14.1 秒 |
| qa-faq.mjs | 通过 | 7.4 秒 |

[完整 QA 输出](qa-suite-results.json)；[44 页 × 三宽实采分区、背景、padding、宽度、字号与层级对照](qa-live-source-results.json)；[原始 CSS 对隔离 CSS 的逐元素几何及颜色对照](qa-captured-geometry-results.json)。全部页面导航、刷新、返回及已有交互回归保留，源目录与 FAQ 测试已从旧占位模板改为当前原站真实语义。

## rebuild_check

本轮重新运行，分数 **86%**，默认目标 **90%**，未达到默认目标；原始输出：[rebuild-check-20261113.json](rebuild-check-20261113.json)。该工具仍只对既有首页、Hyperbarics、Resources、Blog、A4M 与保存的交互状态评分；新 44 页由上面的实时证据及独立三宽 QA 核对。工具分数不替代逐项验收，也不据此反复修改用户已接受差异。

## 验证边界与素材规则

原站完整 DOM 与计算布局覆盖页面尾部，但截图工具最高保存 20,000 像素，以下 15 页的 390 宽长截图被截断：/blog/fda-hyperbaric-chambers-wellness-devices-not-exempt、/post/does-insurance-cover-hyperbaric-oxygen-therapy、/post/starting-an-hbot-business-clinic-setup-guide、/post/hbot-for-pets-veterinary-hyperbaric-therapy、/soft-shell-hyperbaric-chamber、/mild-hyperbaric-chamber、/fda-cleared-hyperbaric-chamber、/best-hyperbaric-chamber、/hyperbaric-chamber-comparison、/hyperbaric-chamber-buying-guide、/hyperbaric-chamber-for-business、/hyperbaric-chamber-side-effects、/hyperbaric-chamber-insurance、/hyperbaric-therapy-long-covid、/hyperbaric-therapy-veterinary。这些页的尾部分区继续由完整 DOM、实采布局记录和源样式三宽几何对照核对；截图裁切不是页面缺失。原站的滚入动画会让未滚入区块在单张截图中暂时不可见，本地静态内容保持可读，Why 专门恢复滚动状态。

几何对照使用同一份净化 DOM，比较原始 CSS 与隔离 CSS 在相同离线媒体环境中的表现，证明样式隔离保留几何与配色；它不是完整应用对实时原站的逐像素比较。实采布局 QA 独立比对分区、背景、padding、宽度、标题字号及层级，未逐项断言所有分区高度/y 坐标和每段实际行数；这些由原站 DOM、原样式与媒体比例保留，并进行代表截图检查。

离线 QA 对图片使用等比例占位，对字体采用一致环境，核对布局而非媒体内容；原站 Windows 滚动条与本地 overlay 滚动条可能有最多 15px 内容宽度差及少量换行差。图片/Logo/文字允许占位，布局尺寸、层级、行数及必要媒体比例保留。表单为本地预览；此前已接受的公共组件差异保持不变。

## 本轮范围外页面（不冒充新增核销）

| URL | 保留状态 |
|---|---|
| / | 已验证既有分区背景；保留用户已接受差异 |
| /hyperbarics | 已验证既有分区背景；保留用户已接受差异 |
| /resources | 已验证既有分区背景；保留用户已接受差异 |
| /blog | 已验证既有分区背景；保留用户已接受差异 |
| /events/a4m-longevity-fest | 已验证既有分区背景；保留用户已接受差异 |
| /products/fortius-420 | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /products/fortius-420-exp | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /products/quamvis-320 | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /products/respiro-270 | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /products/vitaeris-320 | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /contact | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /support | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /partners | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /finance | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /about | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /events/events | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /hyperbaric-research-library | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /vitaeris-320-vs-respiro-270 | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /vitaeris-320-vs-quamvis-320 | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /fortius-420-vs-fortius-420-exp | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /documents/safety | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /documents/terms-conditions | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /documents/privacy-notice | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /documents/repair-exchange-policy | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /documents/fda | 未增加原站实采；保留上轮证据状态，不由本轮核销 |
| /hyperbaric-pressure-converter | 未增加原站实采；保留上轮证据状态，不由本轮核销 |

可运行 node write-acceptance-report.mjs 用当前实采与最终检查重新生成本报告；该入口不再回写旧的审批阻断记录。
