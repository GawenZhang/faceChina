# 背景分区修复验收报告

更新时间：2026-11-12T10:13:38.023Z。本轮已修复五个产品页的整页深色泄漏，以及五个指南页浅色 CTA 的白底白字。构建与本地背景回归结果如下；**全站逐页原站背景一致性尚未完成，不得标为全站视觉验收通过。**

## 根因

1. `product-page.css` 原来的 `.pd-page` 把 `background:#000`、浅色 `--pd-ink`、深底专用 `--pd-muted` 设置在整页上，将“hero 深色”错误扩展到全部正文。统计条、`.pd-tinted`、规格卡、附件卡、finance、resource、contact 还各自硬编码了深色；只改外层背景无法修复这些区域。
2. 新模板只依据原站文字结构和首屏观察设计，没有逐区建立原站深浅背景序列。旧 `qa-products.mjs` 仅断言 hero 背景及白标题，没有检查统计、Gallery、正文或下半页文字，因此整页黑色仍能通过旧 QA。
3. 同类作用域问题出现在五个 compact 指南：CTA 已改浅底，`.ex-button-outline` 却继续继承深色 CTA 的白字，导致电话按钮不可读。本轮补上浅区深字及深底 hover 白字。
4. 全站排查还发现未能证实的风险：`SourceLanding.jsx` 用 `index % 2` 自动白/灰交替、用标题正则选择深色 CTA；独立页、对比和法务模板也使用人工指定的区块色。这些规则本身不是原站证据；在未取得源样式时没有猜测重排。

## 五个产品页

深色背景和浅色文本变量仅在 `.pd-hero` 内生效；页面默认白底深字。统计、Gallery（含其前正文）、规格、压缩机、FAQ、资源区、联系区白底；原有交替区改为浅灰；finance 为浅蓝。内部卡片、分隔线、说明文字、次按钮和链接同步适配浅底。全部十三个分区加入稳定标记供回归测试。未改布局尺寸、标题层级、文案行数、导航、媒体占位及已接受微差。

下表为**当前实现**，不是新抓取的原站色值；除用户明确的 Respiro hero/正文/统计/Gallery 深浅关系外，其他型号和白/灰/浅蓝边界仍待原站截图/CSS 逐段确认。

| URL | 当前分区背景（从 hero 到 contact） | 检查 |
|---|---|---|
| /products/fortius-420 | #0b0b0d → #ffffff → #ffffff → #f5f5f7 → #ffffff → #f5f5f7 → #ffffff → #f5f5f7 → #ffffff → #eaf3fc → #f5f5f7 → #ffffff → #ffffff | 三宽度通过；原站精确分界未验证 |
| /products/fortius-420-exp | #0b0b0d → #ffffff → #ffffff → #f5f5f7 → #ffffff → #f5f5f7 → #ffffff → #f5f5f7 → #ffffff → #eaf3fc → #f5f5f7 → #ffffff → #ffffff | 三宽度通过；原站精确分界未验证 |
| /products/quamvis-320 | #0b0b0d → #ffffff → #ffffff → #f5f5f7 → #ffffff → #f5f5f7 → #ffffff → #f5f5f7 → #ffffff → #eaf3fc → #f5f5f7 → #ffffff → #ffffff | 三宽度通过；原站精确分界未验证 |
| /products/respiro-270 | #0b0b0d → #ffffff → #ffffff → #f5f5f7 → #ffffff → #f5f5f7 → #ffffff → #f5f5f7 → #ffffff → #eaf3fc → #f5f5f7 → #ffffff → #ffffff | 三宽度通过；原站精确分界未验证 |
| /products/vitaeris-320 | #0b0b0d → #ffffff → #ffffff → #f5f5f7 → #ffffff → #f5f5f7 → #ffffff → #f5f5f7 → #ffffff → #eaf3fc → #f5f5f7 → #ffffff → #ffffff | 三宽度通过；原站精确分界未验证 |

分区顺序：hero → metrics → gallery/正文 → features → specifications → included（便携）或 installation（临床）→ compressor → advantage → FAQ → finance → brand → resource → contact。详见 [产品根因与来源记录](inspection/backgrounds-products/audit.json)。

## 全站排查与证据边界

覆盖 70 个路由、1440/768/390 三个宽度，共 210 个页面样本、369 项断言。逐段保存有效背景（含透明祖先继承）、文字颜色和标题。五个已有原站页面通过 `capture/**/capture.json` 逐宽度逐分区比较；其明确记录的背景均一致，未改动这些页面。原截图仍在根目录 capture/，首页渲染 HTML 为 capture/page.html。

| 模板 | 排查结果 | 原站对照状态 |
|---|---|---|
| 首页、Hyperbarics、Resources、Blog 列表、A4M 活动 | 5 页既有源记录的分区背景一致 | 有既有截图/计算样式；未重新抓取 |
| 产品详情 | 五页已修整页深色；三宽度全区回归通过 | Respiro 用户验收观察；各页既有文字结构。精确源分界未验证 |
| 文章详情 | 15 页容器及正文均浅底深字，Related 浅灰；未发现全页黑底泄漏 | 新原站背景证据缺失，不能判为一致 |
| 独立页 | 7 页均为浅色页面容器；hero/部分 CTA/Partners 深段显式配置 | 新原站背景证据缺失，保留现有分区并待核验 |
| 着陆页矩阵、对比、法务、工具/研究库 | 38 页逐路由盘点；修复 5 个浅色 CTA 电话按钮 | 新原站背景证据缺失，自动交替规则仍待核验 |

五个 CTA 修复地址：/hyperbaric-chamber-rental、/used-hyperbaric-chamber、/hyperbaric-chamber-prescription、/hyperbaric-chamber-room-requirements、/genuine-oxyhealth-hyperbaric-chamber。修前/修后截图与颜色数据见 [扩展模板审计](inspection/backgrounds-extended/README.md)、[扩展逐页 JSON](inspection/backgrounds-extended/audit.json)、[文章和独立页 JSON](inspection/backgrounds-independent/audit.json)。本轮 QA 截图 `local-respiro-*.png` 为本地离线占位图，不能冒充原站截图。

本次按要求用 Python urllib 尝试直接抓取原站产品 HTML，返回 WinError 10013（套接字访问被拒绝）；Craft `web_site_open` 被自动审批拒绝，原文为 “MCP tool call requires approval, but approval policy is never”。只读网页工具能读取 Respiro 正文结构，但无法读取既有 HTML 引用的 `/assets/index-B-QwO5R2.css`。故没有新增原站原始 HTML/CSS 或产品/其他新模板截图，不能把“文本可读”“本地 QA 通过”写成“原站背景比对通过”。此前 Logo 成功下载不代表当前进程有网络权限。

仍需完成：取得五个产品及其余 60 个页面的原站截图/HTML/CSS，确认每页精确白/灰/深色序列，尤其 landing 的机械交替和独立/法务/对比深色首段；按证据修正后再验收。这是本轮明确的未完成项。

## 构建与 QA

`npm.cmd run build` 成功，生成 70 个静态页面，覆盖根验收清单全部 61 个地址。完整 `npm.cmd run qa` 已重跑，完成时间 2026-11-12T10:13:24.671Z，12/12 个脚本通过。新增 `qa-backgrounds.mjs` 检查整段有效底色、产品深浅文字、关键白区、CTA 对比度和已有源背景序列，避免旧测试只看首屏。

| 脚本 | 结果 | 用时 |
|---|---|---|
| qa.mjs | 通过 | 3 秒 |
| qa-motion.mjs | 通过 | 7 秒 |
| qa-products.mjs | 通过 | 10 秒 |
| qa-backgrounds.mjs | 通过 | 19 秒 |
| qa-template-structure.mjs | 通过 | 6 秒 |
| qa-extended-current.mjs | 通过 | 11 秒 |
| qa-navigation.mjs | 通过 | 155 秒 |
| qa-coverage.mjs | 通过 | 38 秒 |
| qa-new-interactions.mjs | 通过 | 4 秒 |
| qa-resume.mjs | 通过 | 21 秒 |
| qa-flows.mjs | 通过 | 13 秒 |
| qa-faq.mjs | 通过 | 7 秒 |

结果：[完整 QA](qa-suite-results.json)、[背景专项及全部逐页计算色](qa-backgrounds-results.json)、[构建指纹](verification.json)。本地测试替代远程媒体/字体，表单保持原有本地预览行为。

## rebuild_check

最终构建后已运行；相似度 86%，工具默认阈值 90%，未达到默认阈值。比较范围仍是既有五页与交互状态，未包含新增产品或其他模板原站截图，因此不据此认证全站背景。没有为追分调整获准占位素材和已接受的微差。原始结果：[rebuild-check-final.json](rebuild-check-final.json)。

## 逐页验收状态

“本地检查通过”只表示页面渲染/背景回归条件通过；原站比对范围以第三列为准，绝非全站一致性结论。每页完整色序列见背景专项 JSON。

| URL | 模板 | 本轮背景状态 | 三宽度本地检查 |
|---|---|---|---|
| / | home | 已对照既有原站计算背景；未改分区 | 通过 |
| /hyperbarics | hyperbarics | 已对照既有原站计算背景；未改分区 | 通过 |
| /resources | resources | 已对照既有原站计算背景；未改分区 | 通过 |
| /blog | blog-list | 已对照既有原站计算背景；未改分区 | 通过 |
| /events/a4m-longevity-fest | event-detail | 已对照既有原站计算背景；未改分区 | 通过 |
| /products/fortius-420 | product | 已修深色作用域；按用户观察回归，精确白/灰边界待原站复核 | 通过 |
| /products/fortius-420-exp | product | 已修深色作用域；按用户观察回归，精确白/灰边界待原站复核 | 通过 |
| /products/quamvis-320 | product | 已修深色作用域；按用户观察回归，精确白/灰边界待原站复核 | 通过 |
| /products/respiro-270 | product | 已修深色作用域；按用户观察回归，精确白/灰边界待原站复核 | 通过 |
| /products/vitaeris-320 | product | 已修深色作用域；按用户观察回归，精确白/灰边界待原站复核 | 通过 |
| /blog/fda-hyperbaric-chambers-wellness-devices-not-exempt | article | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /post/hyperbaric-oxygen-therapy-for-longevity | article | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /post/hbot-for-brain-injury-what-clinical-trials-show | article | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /post/hyperbaric-oxygen-therapy-for-long-covid-research | article | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /post/does-insurance-cover-hyperbaric-oxygen-therapy | article | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /post/starting-an-hbot-business-clinic-setup-guide | article | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /post/hbot-for-pets-veterinary-hyperbaric-therapy | article | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /post/why-russell-wilson-spends-over-1-million-a-year-on-his-body | article | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /post/from-survival-to-service-coryn-carvers-journey-to-healing-through-hyperbaric-therapy | article | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /post/how-medical-grade-hyperbaric-oxygen-therapy-is-supporting-healing-at-md-hyperbaric-stamford | article | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /post/how-mark-andrews-used-a-hyperbaric-oxygen-chamber-in-his-injury-recovery | article | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /post/how-neymar-jr-uses-advanced-recovery-tech-to-stay-at-peak-performance | article | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /post/hyperbaric-success-stories-how-top-athletes-use-oxygen-therapy-to-heal-and-recover | article | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /post/lebron-james-uses-hyperbaric-oxygen-therapy | article | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /post/the-rise-of-hyperbaric-oxygen-therapy-in-professional-sports | article | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /contact | contact | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /support | support | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /partners | partners | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /why-oxyhealth | why-oxyhealth | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /finance | finance | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /about | about | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /events/events | event-list | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-chamber-for-sale | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /home-hyperbaric-chamber | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /portable-hyperbaric-chamber | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /soft-shell-hyperbaric-chamber | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /mild-hyperbaric-chamber | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /fda-cleared-hyperbaric-chamber | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /best-hyperbaric-chamber | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-chamber-comparison | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-chamber-buying-guide | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-chamber-cost | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-chamber-for-business | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hbot-for-your-practice | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-chamber-rental | landing | 已修浅色 CTA 白字；原站背景序列未验证 | 通过 |
| /used-hyperbaric-chamber | landing | 已修浅色 CTA 白字；原站背景序列未验证 | 通过 |
| /hyperbaric-chamber-prescription | landing | 已修浅色 CTA 白字；原站背景序列未验证 | 通过 |
| /hyperbaric-chamber-room-requirements | landing | 已修浅色 CTA 白字；原站背景序列未验证 | 通过 |
| /genuine-oxyhealth-hyperbaric-chamber | landing | 已修浅色 CTA 白字；原站背景序列未验证 | 通过 |
| /hyperbaric-chamber-benefits | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-chamber-side-effects | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-chamber-insurance | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-research-library | research-library | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-therapy-anti-aging | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-therapy-athletic-recovery | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-therapy-brain-health | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-therapy-inflammation | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-therapy-long-covid | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-therapy-near-me | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-therapy-veterinary | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-therapy-wound-healing | landing | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /vitaeris-320-vs-respiro-270 | comparison | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /vitaeris-320-vs-quamvis-320 | comparison | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /fortius-420-vs-fortius-420-exp | comparison | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /documents/safety | document-safety | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /documents/terms-conditions | document-terms | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /documents/privacy-notice | document-privacy | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /documents/repair-exchange-policy | document-repair | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /documents/fda | document-fda | 已盘点本地分区；原站背景序列未验证 | 通过 |
| /hyperbaric-pressure-converter | pressure-converter | 已盘点本地分区；原站背景序列未验证 | 通过 |

此前导航和模板结构验收记录已归档：[上轮完整报告](ACCEPTANCE-REPORT-before-backgrounds.md)。其中旧有“未验证”项目仍然有效，本轮未改变动画暂定参数或正文结构验收边界。
