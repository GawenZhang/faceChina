# 实时补采与精确视觉复核验收报告

更新时间：2026-11-12T10:36:16.326Z。**本轮补查已执行，但原站实时渲染仍被环境拒绝，精确视觉验收未完成。** 用户已明确允许实时浏览器和代码执行（allow-run），当前工具审批门仍返回拒绝；不能将本地 QA、可读文本或旧截图判为新增页面精确视觉通过。

## 本轮实际改动

在 app/ 按可读原站层级补齐型号列表和研究／指南文章遗漏模块，保留获准占位文案和既有配色。7 个缺少原站内容的占位着陆页补上与 Why／占位文章相同的机器可读未验证标记；现有 QA 加入对应断言。新增逐页补采账本、背景／配色／布局分别记录的验收表及报告生成器，更新构建指纹和本轮检查结果。未取得可证实的新色值，因此没有凭猜测调整配色或背景分段，也未反复修改用户已接受差异。

| 页面 | 本轮结构修正 | 证据边界 |
|---|---|---|
| /post/hyperbaric-oxygen-therapy-for-longevity | 按源文字层级补足8项FAQ、4个相关资源链接与结束CTA；按源段落数量和长度维持正文密度。 | 文本结构证据；精确视觉未验证 |
| /post/hbot-for-brain-injury-what-clinical-trials-show | 恢复6个正文H3分组、Medical Disclaimer同级内容与5条References；FAQ补为8项，相关资源改4链接并补结束CTA。 | 文本结构证据；精确视觉未验证 |
| /post/hyperbaric-oxygen-therapy-for-long-covid-research | 恢复4个正文H3分组和3条References；FAQ补为8项，相关资源改4链接并补结束CTA。 | 文本结构证据；精确视觉未验证 |
| /post/starting-an-hbot-business-clinic-setup-guide | 主体补为8个H2区段，恢复2个H3设备分组；FAQ补为8项，相关资源改4链接并补业务结束CTA。 | 文本结构证据；精确视觉未验证 |
| /portable-hyperbaric-chamber | 依据原站文本补回3张型号卡片各4条功能列表，共12条；沿用占位文案并保留每条1至5词的短行长度。 | 文本结构证据；精确视觉未验证 |
| /best-hyperbaric-chamber | 依据原站文本补回4张型号卡片各3条功能列表，共12条；沿用占位文案并保留短行长度。 | 文本结构证据；精确视觉未验证 |
| /hyperbaric-chamber-comparison | 依据原站文本补回5张型号卡片各3条功能列表，共15条；沿用占位文案并保留短行长度。 | 文本结构证据；精确视觉未验证 |

上轮已修复的产品整页深色泄漏、五个浅色 CTA 白字继续保留；原始原因与修复记录见 [上轮报告](ACCEPTANCE-REPORT-before-live-sampling.md)。本轮新增的是补采结果与证据状态收尾，不将上轮修复冒充本轮新增。

## 补采方法与阻断原因

Craft Anything deep 模式可用，但在 /why-oxyhealth 调用 web_site_open 时被自动审批拒绝，原文：**MCP tool call requires approval, but approval policy is never**。这是工具执行前的会话级限制，不能据此判定原站故障；没有规避该限制启动其他浏览器。原站既有 CSS /assets/index-B-QwO5R2.css 在只读网页工具中也返回 not accessible。

随后逐 URL 用只读网页渠道补查 44 页：28 个着陆页、15 篇文章、Why，包含全部 11 个占位页；33 页返回可读文本，11 页未获取正文。文本服务可能返回缓存／历史爬取内容，**不是实时浏览器 HTML/CSS、截图或计算样式**。读取失败不是 404 结论。每页请求结果、原因及本地三宽度逐段色值见 [完整补采账本](live-source-audit.json)；原始逐族记录保留在账本 source_files 中。

## 11 个占位页

| URL | 状态 | 本轮原因 |
|---|---|---|
| /mild-hyperbaric-chamber | 未验证／保留占位 | 只读抓取 Cache miss |
| /hyperbaric-chamber-for-business | 未验证／保留占位 | 只读抓取 Cache miss |
| /hyperbaric-therapy-brain-health | 未验证／保留占位 | 只读抓取 Cache miss |
| /hyperbaric-therapy-inflammation | 未验证／保留占位 | 只读抓取 Cache miss |
| /hyperbaric-therapy-long-covid | 未验证／保留占位 | 只读抓取 Cache miss |
| /hyperbaric-therapy-veterinary | 未验证／保留占位 | 只读抓取 Cache miss |
| /hyperbaric-therapy-wound-healing | 未验证／保留占位 | 只读抓取 Cache miss |
| /why-oxyhealth | 未验证／保留占位 | 只读抓取 Cache miss |
| /post/does-insurance-cover-hyperbaric-oxygen-therapy | 未验证／保留占位 | 只读抓取 Cache miss |
| /post/hbot-for-pets-veterinary-hyperbaric-therapy | 未验证／保留占位 | 只读抓取 Cache miss |
| /post/how-mark-andrews-used-a-hyperbaric-oxygen-chamber-in-his-injury-recovery | 未验证／保留占位 | 只读响应无可读正文；缺原站截图和计算样式 |

## 44 个目标逐页对照

“布局未验证”指原站实际几何、网格、图片位置和断点；已读文字层级不能证明布局。各原站背景序列、精确色值均未拿到，所以不能填写推测色值或“通过”。

| URL | 本轮文本渠道 | 背景分段 | 精确配色 | 视觉布局 | 原因与证据 |
|---|---|---|---|---|---|
| /blog/fda-hyperbaric-chambers-wellness-devices-not-exempt | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-articles.json) |
| /post/hyperbaric-oxygen-therapy-for-longevity | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-articles.json) |
| /post/hbot-for-brain-injury-what-clinical-trials-show | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-articles.json) |
| /post/hyperbaric-oxygen-therapy-for-long-covid-research | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-articles.json) |
| /post/does-insurance-cover-hyperbaric-oxygen-therapy | 未获取正文 | 未验证 | 未验证 | 未验证 | 只读抓取 Cache miss；[记录](live-source-priority-attempts.json) |
| /post/starting-an-hbot-business-clinic-setup-guide | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-articles.json) |
| /post/hbot-for-pets-veterinary-hyperbaric-therapy | 未获取正文 | 未验证 | 未验证 | 未验证 | 只读抓取 Cache miss；[记录](live-source-placeholder-attempts.json) |
| /post/why-russell-wilson-spends-over-1-million-a-year-on-his-body | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-articles.json) |
| /post/from-survival-to-service-coryn-carvers-journey-to-healing-through-hyperbaric-therapy | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-articles.json) |
| /post/how-medical-grade-hyperbaric-oxygen-therapy-is-supporting-healing-at-md-hyperbaric-stamford | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-articles.json) |
| /post/how-mark-andrews-used-a-hyperbaric-oxygen-chamber-in-his-injury-recovery | 未获取正文 | 未验证 | 未验证 | 未验证 | 只读响应无可读正文；缺原站截图和计算样式；[记录](live-source-placeholder-attempts.json) |
| /post/how-neymar-jr-uses-advanced-recovery-tech-to-stay-at-peak-performance | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-articles.json) |
| /post/hyperbaric-success-stories-how-top-athletes-use-oxygen-therapy-to-heal-and-recover | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-articles.json) |
| /post/lebron-james-uses-hyperbaric-oxygen-therapy | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-articles.json) |
| /post/the-rise-of-hyperbaric-oxygen-therapy-in-professional-sports | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-articles.json) |
| /why-oxyhealth | 未获取正文 | 未验证 | 未验证 | 未验证 | 只读抓取 Cache miss；[记录](live-source-priority-attempts.json) |
| /hyperbaric-chamber-for-sale | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /home-hyperbaric-chamber | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /portable-hyperbaric-chamber | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /soft-shell-hyperbaric-chamber | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /mild-hyperbaric-chamber | 未获取正文 | 未验证 | 未验证 | 未验证 | 只读抓取 Cache miss；[记录](live-source-placeholder-attempts.json) |
| /fda-cleared-hyperbaric-chamber | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /best-hyperbaric-chamber | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /hyperbaric-chamber-comparison | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /hyperbaric-chamber-buying-guide | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /hyperbaric-chamber-cost | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /hyperbaric-chamber-for-business | 未获取正文 | 未验证 | 未验证 | 未验证 | 只读抓取 Cache miss；[记录](live-source-placeholder-attempts.json) |
| /hbot-for-your-practice | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /hyperbaric-chamber-rental | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /used-hyperbaric-chamber | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /hyperbaric-chamber-prescription | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /hyperbaric-chamber-room-requirements | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /genuine-oxyhealth-hyperbaric-chamber | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /hyperbaric-chamber-benefits | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /hyperbaric-chamber-side-effects | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /hyperbaric-chamber-insurance | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /hyperbaric-therapy-anti-aging | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /hyperbaric-therapy-athletic-recovery | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /hyperbaric-therapy-brain-health | 未获取正文 | 未验证 | 未验证 | 未验证 | 只读抓取 Cache miss；[记录](live-source-priority-attempts.json) |
| /hyperbaric-therapy-inflammation | 未获取正文 | 未验证 | 未验证 | 未验证 | 只读抓取 Cache miss；[记录](live-source-placeholder-attempts.json) |
| /hyperbaric-therapy-long-covid | 未获取正文 | 未验证 | 未验证 | 未验证 | 只读抓取 Cache miss；[记录](live-source-placeholder-attempts.json) |
| /hyperbaric-therapy-near-me | 文本可读 | 未验证 | 未验证 | 未验证 | 仅可读文本；缺原站截图和计算样式；[记录](live-source-landings.json) |
| /hyperbaric-therapy-veterinary | 未获取正文 | 未验证 | 未验证 | 未验证 | 只读抓取 Cache miss；[记录](live-source-placeholder-attempts.json) |
| /hyperbaric-therapy-wound-healing | 未获取正文 | 未验证 | 未验证 | 未验证 | 只读抓取 Cache miss；[记录](live-source-placeholder-attempts.json) |

## 本地背景盘点与保留项

本轮重新检查全部 70 路由 × 1440／768／390 三宽度，共 210 个样本、369 项背景断言。每个分区的有效背景（含祖先继承）、文字颜色、标题均保存于 [背景 QA JSON](qa-backgrounds-results.json)。这些是本地实现值，不是原站新证据。

产品当前分区顺序为 hero → metrics → gallery → features → specifications → included/installation → compressor → advantage → FAQ → finance → brand → resource → contact。五产品沿用同一背景序列：#0b0b0d → #ffffff → #ffffff → #f5f5f7 → #ffffff → #f5f5f7 → #ffffff → #f5f5f7 → #ffffff → #eaf3fc → #f5f5f7 → #ffffff → #ffffff。用户观察支持 Respiro 深色首屏／浅色正文；精确白灰边界仍未验证。SourceLanding 的 index % 2 交替背景及标题规则 CTA 没有原站色值可核验，继续明确待核验，未猜测修改。

用户已接受的图片、Logo、正文占位及既有细小视觉差异保留；导航 600ms 和曲线仍为暂定值而非原站测量值。表单／聊天继续为本地预览；离线 QA 使用媒体和外站替身，不认证第三方服务。

## 构建、全部 QA 与 rebuild_check

重新构建成功，生成 70 个页面，覆盖根验收清单全部 61 个地址。完整 12 脚本完成时间：2026-11-12T10:36:07.187Z，12/12 通过。

| 脚本 | 结果 | 用时 |
|---|---|---|
| qa.mjs | 通过 | 2.9 秒 |
| qa-motion.mjs | 通过 | 8.3 秒 |
| qa-products.mjs | 通过 | 10.2 秒 |
| qa-backgrounds.mjs | 通过 | 19.9 秒 |
| qa-template-structure.mjs | 通过 | 5.9 秒 |
| qa-extended-current.mjs | 通过 | 11.1 秒 |
| qa-navigation.mjs | 通过 | 143.3 秒 |
| qa-coverage.mjs | 通过 | 39.4 秒 |
| qa-new-interactions.mjs | 通过 | 4.1 秒 |
| qa-resume.mjs | 通过 | 21.6 秒 |
| qa-flows.mjs | 通过 | 13.6 秒 |
| qa-faq.mjs | 通过 | 7.3 秒 |

结果：[完整 QA](qa-suite-results.json)、[构建指纹](verification.json)。已查看新增模块的本地局部截图：[桌面 FAQ](qa-source-longevity-faq-1440.png)、[桌面参考列表](qa-source-brain-references-1440.png)、[手机相关资源](qa-source-longevity-related-390.png)、[手机结尾 CTA](qa-source-brain-cta-390.png)，无新增文字溢出，既有悬浮页头／聊天壳层保留；这些截图只用于本地渲染检查。

rebuild_check 已重新运行，相似度 **86%**，默认阈值 **90%**，未达到默认阈值；原始输出见 [rebuild-check-final.json](rebuild-check-final.json)。其参考仍限于既有首页、Hyperbarics、Resources、Blog、A4M 及已采交互状态，未包含本轮 44 页新视觉样本。工具返回的 passed 字样不覆盖分数阈值，更不能认证全站；不为提高分数反复改动已接受差异。

## 全站验收表

| URL | 模板 | 原站视觉证据状态 | 本地背景 QA |
|---|---|---|---|
| / | home | 已验证既有采样中记录的分区背景（非全像素认证） | 三宽度通过 |
| /hyperbarics | hyperbarics | 已验证既有采样中记录的分区背景（非全像素认证） | 三宽度通过 |
| /resources | resources | 已验证既有采样中记录的分区背景（非全像素认证） | 三宽度通过 |
| /blog | blog-list | 已验证既有采样中记录的分区背景（非全像素认证） | 三宽度通过 |
| /events/a4m-longevity-fest | event-detail | 已验证既有采样中记录的分区背景（非全像素认证） | 三宽度通过 |
| /products/fortius-420 | product | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /products/fortius-420-exp | product | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /products/quamvis-320 | product | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /products/respiro-270 | product | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /products/vitaeris-320 | product | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /blog/fda-hyperbaric-chambers-wellness-devices-not-exempt | article | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /post/hyperbaric-oxygen-therapy-for-longevity | article | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /post/hbot-for-brain-injury-what-clinical-trials-show | article | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /post/hyperbaric-oxygen-therapy-for-long-covid-research | article | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /post/does-insurance-cover-hyperbaric-oxygen-therapy | article | 未验证：只读抓取 Cache miss | 三宽度通过 |
| /post/starting-an-hbot-business-clinic-setup-guide | article | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /post/hbot-for-pets-veterinary-hyperbaric-therapy | article | 未验证：只读抓取 Cache miss | 三宽度通过 |
| /post/why-russell-wilson-spends-over-1-million-a-year-on-his-body | article | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /post/from-survival-to-service-coryn-carvers-journey-to-healing-through-hyperbaric-therapy | article | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /post/how-medical-grade-hyperbaric-oxygen-therapy-is-supporting-healing-at-md-hyperbaric-stamford | article | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /post/how-mark-andrews-used-a-hyperbaric-oxygen-chamber-in-his-injury-recovery | article | 未验证：只读响应无可读正文；缺原站截图和计算样式 | 三宽度通过 |
| /post/how-neymar-jr-uses-advanced-recovery-tech-to-stay-at-peak-performance | article | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /post/hyperbaric-success-stories-how-top-athletes-use-oxygen-therapy-to-heal-and-recover | article | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /post/lebron-james-uses-hyperbaric-oxygen-therapy | article | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /post/the-rise-of-hyperbaric-oxygen-therapy-in-professional-sports | article | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /contact | contact | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /support | support | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /partners | partners | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /why-oxyhealth | why-oxyhealth | 未验证：只读抓取 Cache miss | 三宽度通过 |
| /finance | finance | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /about | about | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /events/events | event-list | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /hyperbaric-chamber-for-sale | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /home-hyperbaric-chamber | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /portable-hyperbaric-chamber | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /soft-shell-hyperbaric-chamber | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /mild-hyperbaric-chamber | landing | 未验证：只读抓取 Cache miss | 三宽度通过 |
| /fda-cleared-hyperbaric-chamber | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /best-hyperbaric-chamber | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /hyperbaric-chamber-comparison | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /hyperbaric-chamber-buying-guide | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /hyperbaric-chamber-cost | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /hyperbaric-chamber-for-business | landing | 未验证：只读抓取 Cache miss | 三宽度通过 |
| /hbot-for-your-practice | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /hyperbaric-chamber-rental | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /used-hyperbaric-chamber | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /hyperbaric-chamber-prescription | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /hyperbaric-chamber-room-requirements | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /genuine-oxyhealth-hyperbaric-chamber | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /hyperbaric-chamber-benefits | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /hyperbaric-chamber-side-effects | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /hyperbaric-chamber-insurance | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /hyperbaric-research-library | research-library | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /hyperbaric-therapy-anti-aging | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /hyperbaric-therapy-athletic-recovery | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /hyperbaric-therapy-brain-health | landing | 未验证：只读抓取 Cache miss | 三宽度通过 |
| /hyperbaric-therapy-inflammation | landing | 未验证：只读抓取 Cache miss | 三宽度通过 |
| /hyperbaric-therapy-long-covid | landing | 未验证：只读抓取 Cache miss | 三宽度通过 |
| /hyperbaric-therapy-near-me | landing | 未验证：仅可读文本；缺原站截图和计算样式 | 三宽度通过 |
| /hyperbaric-therapy-veterinary | landing | 未验证：只读抓取 Cache miss | 三宽度通过 |
| /hyperbaric-therapy-wound-healing | landing | 未验证：只读抓取 Cache miss | 三宽度通过 |
| /vitaeris-320-vs-respiro-270 | comparison | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /vitaeris-320-vs-quamvis-320 | comparison | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /fortius-420-vs-fortius-420-exp | comparison | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /documents/safety | document-safety | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /documents/terms-conditions | document-terms | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /documents/privacy-notice | document-privacy | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /documents/repair-exchange-policy | document-repair | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /documents/fda | document-fda | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /hyperbaric-pressure-converter | pressure-converter | 未验证：沿用上轮文本／用户观察，无新增视觉样本 | 三宽度通过 |

剩余问题：仍需实际可执行的原站浏览器采样（或等效原始截图和计算样式）才能完成上述 44 页及上轮其他未验证模板的精确视觉比对。11 页结构缺口也保留，不能宣布全站完成。已有旧源截图与本轮本地截图分别存放，未混用。可运行 node write-acceptance-report.mjs 重新生成当前报告；不会再恢复上轮措辞。
