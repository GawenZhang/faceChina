# 原站采样与构建验收报告

## 最新续作验证（2026-11-12 14:44:07 UTC）

已复查清单、core_unknowns_show 与最近一次 /why-oxyhealth 交接；独立源码审查没有发现新的可操作本地缺陷。重新构建成功：70 页覆盖全部 61 个清单网址，首页、Why 与产品详情本地预览均返回 HTTP 200。JS／CSS 的 SHA256 与 12:43:48 UTC 已通过的 12/12 QA 完全一致，因此保留该次 QA，本轮没有重跑或修改界面。

本轮 rebuild_check 已成功返回 **86%（目标 90%，未达到）**，解决了上一轮没有获得检查结果的问题；范围仍为既有五页和已保存交互状态。完整结果见 [本轮检查](rebuild-check-resume-1441.json)，当前验证见 [续作记录](resume-verification.json)，[本地预览](http://127.0.0.1:62446/)。

原站精确视觉验收仍未完成：44 项缺少原站截图／样式，其中 11 页结构为暂定。本轮原站浏览器调用为 0；下方 14:08 UTC 的审批拒绝是历史记录，环境策略仍为 never，未循环重试，也未将拒绝解释为网站不可访问。已接受的细微差异与授权占位内容保持不变。以下章节均保留原有时间与范围，不能用其旧分数或调用数量代替本轮结果。

## 最新单页采样请求（2026-11-12 14:08 UTC）

本次仅请求原站 `/why-oxyhealth` 实时浏览器采样。`web_site_open` 在执行前被自动审批拒绝：`MCP tool call requires approval, but approval policy is never`。本次调用 1 次，新增原站截图及计算样式均为 0；页面精确视觉仍未验证，没有据此修改 UI。完整调用参数及拒绝原文见 [本次单页采样记录](live-why-oxyhealth-sampling.json)。继续采样需要可审批的会话授权该浏览器调用；此拒绝不能证明原站不可访问。

本次 `npm.cmd run build` 成功生成 70 页并覆盖全部 61 个清单 URL；构建产物哈希与此前已测版本一致，本次没有重跑完整 QA。已调用 `rebuild_check`，但返回没有运行中的构建或检查超时，未取得本次分数，详见 [本次检查返回](rebuild-check-why-oxyhealth.json)。

以下为 13:57 UTC 的历史整站验收记录；其中“本轮”、0 次原站调用与 85% 分数均指该历史批次，不代表上述最新单页请求。

更新时间：2026-11-12T13:57:24.994Z。**本轮完成本地重新构建与 rebuild_check；精确原站视觉验收仍未完成。** 沿用此前完整 QA，已核对本轮 JS／CSS 构建哈希完全相同；本轮没有重跑完整 QA。本轮原站浏览器调用为 0 次，新增原站样本为 0；44 页均未在本轮请求。此前的审批拒绝不能解释为原站不可访问，旧文本或本地 QA 也不是原站新样本。

## 本轮实际改动

本轮仅更新验证记录与验收结果，未修改报告生成器。

独立的 [本轮验证记录](verification-run.json) 将本轮本地验证与历史原站调用分开。生成器核对 QA 完成时间及对应构建哈希，避免把旧 QA 或旧审批拒绝重标为本轮发生；已接受差异保持不变。

本轮没有新增 UI 改动，local_changes 与原站差异 changes 均为空。

此前的 2 项界面修复保留于 previous_local_changes。本轮没有覆盖原站日志：[上次原站会话](live-source-session.json)、[更早重试](live-source-retry.json) 和四份只读记录仍保留各自的原始时间与内容。

## 保留的此前结构修正

以下 7 页修正均已在此前完成，本轮没有新增或反复调整。它们基于可读原站文字层级，不能升级为精确视觉通过。

| 页面 | 此前已完成的结构修正 | 证据边界 |
|---|---|---|
| /post/hyperbaric-oxygen-therapy-for-longevity | 按源文字层级补足8项FAQ、4个相关资源链接与结束CTA；按源段落数量和长度维持正文密度。 | 此前文本结构证据；精确视觉仍未验证 |
| /post/hbot-for-brain-injury-what-clinical-trials-show | 恢复6个正文H3分组、Medical Disclaimer同级内容与5条References；FAQ补为8项，相关资源改4链接并补结束CTA。 | 此前文本结构证据；精确视觉仍未验证 |
| /post/hyperbaric-oxygen-therapy-for-long-covid-research | 恢复4个正文H3分组和3条References；FAQ补为8项，相关资源改4链接并补结束CTA。 | 此前文本结构证据；精确视觉仍未验证 |
| /post/starting-an-hbot-business-clinic-setup-guide | 主体补为8个H2区段，恢复2个H3设备分组；FAQ补为8项，相关资源改4链接并补业务结束CTA。 | 此前文本结构证据；精确视觉仍未验证 |
| /portable-hyperbaric-chamber | 依据原站文本补回3张型号卡片各4条功能列表，共12条；沿用占位文案并保留每条1至5词的短行长度。 | 此前文本结构证据；精确视觉仍未验证 |
| /best-hyperbaric-chamber | 依据原站文本补回4张型号卡片各3条功能列表，共12条；沿用占位文案并保留短行长度。 | 此前文本结构证据；精确视觉仍未验证 |
| /hyperbaric-chamber-comparison | 依据原站文本补回5张型号卡片各3条功能列表，共15条；沿用占位文案并保留短行长度。 | 此前文本结构证据；精确视觉仍未验证 |

此前已补的 7 个占位着陆页机器可读未验证标记、产品浅色正文修复与五个浅色 CTA 字色修复继续保留，相关历史见 [此前报告](ACCEPTANCE-REPORT-before-live-sampling.md)。

## 本轮验证范围与历史原站阻断

本轮仅进行本地构建与验证，没有提交原站浏览器调用。此前约 2026-11-12T12:18:44Z，Craft Anything web_site_open 请求 https://www.oxyhealth.com/why-oxyhealth 时收到自动审批拒绝，原文：**MCP tool call requires approval, but approval policy is never**。这是 [历史原站会话](live-source-session.json) 的记录，该次调用未执行，不能写成本轮调用。

更早的 [重试记录](live-source-retry.json) 约 2026-11-12T10:59:19Z 的拒绝也保持原样。缺少原站截图和计算样式的问题仍未解除。

| 本轮原站采样范围 | 数量 | 证据边界 |
|---|---|---|
| 待补采页面 | 44 | 28 个着陆页、15 篇文章、Why，包含全部 11 个占位页 |
| 实际尝试的浏览器调用 | 0 | 本轮没有提交原站浏览器调用 |
| 未逐 URL 请求 | 44 | 仅本地验证；不称作本轮原站请求失败 |
| 新增原站实时样本 | 0 | 所有目标背景、精确色值与视觉布局仍未验证 |
| 此前只读证据 | 33 页可读，11 页无正文 | 历史记录，可能为缓存文本；本轮没有重新抓取 |

此前 CSS 请求不可访问、Cache miss 或无正文的记录仅作为历史证据保留，不代表本轮请求结果。完整逐页状态及本地三宽度色值见 [当前审计账本](live-source-audit.json)。

## 11 个占位页

| URL | 状态 | 本轮采样状态与历史证据 |
|---|---|---|
| /mild-hyperbaric-chamber | 未验证／保留占位 | 本轮未请求；仅本地重新构建与检查；此前只读抓取 Cache miss |
| /hyperbaric-chamber-for-business | 未验证／保留占位 | 本轮未请求；仅本地重新构建与检查；此前只读抓取 Cache miss |
| /hyperbaric-therapy-brain-health | 未验证／保留占位 | 本轮未请求；仅本地重新构建与检查；此前只读抓取 Cache miss |
| /hyperbaric-therapy-inflammation | 未验证／保留占位 | 本轮未请求；仅本地重新构建与检查；此前只读抓取 Cache miss |
| /hyperbaric-therapy-long-covid | 未验证／保留占位 | 本轮未请求；仅本地重新构建与检查；此前只读抓取 Cache miss |
| /hyperbaric-therapy-veterinary | 未验证／保留占位 | 本轮未请求；仅本地重新构建与检查；此前只读抓取 Cache miss |
| /hyperbaric-therapy-wound-healing | 未验证／保留占位 | 本轮未请求；仅本地重新构建与检查；此前只读抓取 Cache miss |
| /why-oxyhealth | 未验证／保留占位 | 本轮未请求；仅本地重新构建与检查；此前只读抓取 Cache miss |
| /post/does-insurance-cover-hyperbaric-oxygen-therapy | 未验证／保留占位 | 本轮未请求；仅本地重新构建与检查；此前只读抓取 Cache miss |
| /post/hbot-for-pets-veterinary-hyperbaric-therapy | 未验证／保留占位 | 本轮未请求；仅本地重新构建与检查；此前只读抓取 Cache miss |
| /post/how-mark-andrews-used-a-hyperbaric-oxygen-chamber-in-his-injury-recovery | 未验证／保留占位 | 本轮未请求；仅本地重新构建与检查；此前只读响应无可读正文；缺原站截图和计算样式 |

## 44 个目标逐页对照

本表列出本轮“未请求”状态，并保留更早的文本证据；本轮已提交 0 次原站浏览器调用。布局状态包括真实几何、网格、媒体位置和断点；历史文字层级不证明视觉布局。本轮范围见 [verification-run.json](verification-run.json)，逐页状态见 [live-source-audit.json](live-source-audit.json)；历史原站调用见 [live-source-session.json](live-source-session.json)。

| URL | 本轮原站采样状态 | 背景分段 | 精确配色 | 视觉布局 | 保留的历史证据 |
|---|---|---|---|---|---|
| /blog/fda-hyperbaric-chambers-wellness-devices-not-exempt | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/hyperbaric-oxygen-therapy-for-longevity | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/hbot-for-brain-injury-what-clinical-trials-show | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/hyperbaric-oxygen-therapy-for-long-covid-research | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/does-insurance-cover-hyperbaric-oxygen-therapy | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-priority-attempts.json) |
| /post/starting-an-hbot-business-clinic-setup-guide | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/hbot-for-pets-veterinary-hyperbaric-therapy | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-placeholder-attempts.json) |
| /post/why-russell-wilson-spends-over-1-million-a-year-on-his-body | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/from-survival-to-service-coryn-carvers-journey-to-healing-through-hyperbaric-therapy | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/how-medical-grade-hyperbaric-oxygen-therapy-is-supporting-healing-at-md-hyperbaric-stamford | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/how-mark-andrews-used-a-hyperbaric-oxygen-chamber-in-his-injury-recovery | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前只读响应无可读正文；缺原站截图和计算样式；[旧记录](live-source-placeholder-attempts.json) |
| /post/how-neymar-jr-uses-advanced-recovery-tech-to-stay-at-peak-performance | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/hyperbaric-success-stories-how-top-athletes-use-oxygen-therapy-to-heal-and-recover | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/lebron-james-uses-hyperbaric-oxygen-therapy | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/the-rise-of-hyperbaric-oxygen-therapy-in-professional-sports | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /why-oxyhealth | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-priority-attempts.json) |
| /hyperbaric-chamber-for-sale | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /home-hyperbaric-chamber | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /portable-hyperbaric-chamber | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /soft-shell-hyperbaric-chamber | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /mild-hyperbaric-chamber | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-placeholder-attempts.json) |
| /fda-cleared-hyperbaric-chamber | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /best-hyperbaric-chamber | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-comparison | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-buying-guide | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-cost | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-for-business | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-placeholder-attempts.json) |
| /hbot-for-your-practice | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-rental | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /used-hyperbaric-chamber | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-prescription | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-room-requirements | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /genuine-oxyhealth-hyperbaric-chamber | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-benefits | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-side-effects | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-insurance | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-therapy-anti-aging | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-therapy-athletic-recovery | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-therapy-brain-health | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-priority-attempts.json) |
| /hyperbaric-therapy-inflammation | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-placeholder-attempts.json) |
| /hyperbaric-therapy-long-covid | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-placeholder-attempts.json) |
| /hyperbaric-therapy-near-me | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-therapy-veterinary | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-placeholder-attempts.json) |
| /hyperbaric-therapy-wound-healing | 本轮未请求；仅本地重新构建与检查 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-placeholder-attempts.json) |

## 本地背景盘点与保留项

沿用此前背景 QA全部 70 路由 × 1440／768／390 三宽度，共 210 个样本、369 项背景断言。每个分区的有效背景（含祖先继承）、文字颜色、标题均保存于 [背景 QA JSON](qa-backgrounds-results.json)。这些是本地实现值，不是原站新证据。

产品当前分区顺序为 hero → metrics → gallery → features → specifications → included/installation → compressor → advantage → FAQ → finance → brand → resource → contact。五产品沿用同一背景序列：#0b0b0d → #ffffff → #ffffff → #f5f5f7 → #ffffff → #f5f5f7 → #ffffff → #f5f5f7 → #ffffff → #eaf3fc → #f5f5f7 → #ffffff → #ffffff。用户观察支持 Respiro 深色首屏／浅色正文；精确白灰边界仍未验证。SourceLanding 的 index % 2 交替背景及标题规则 CTA 没有原站色值可核验，继续明确待核验，未猜测修改。

用户已接受的图片、Logo、正文占位及既有细小视觉差异保留；导航 600ms 和曲线仍为暂定值而非原站测量值。表单／聊天继续为本地预览；离线 QA 使用媒体和外站替身，不认证第三方服务。本轮没有新增原站截图，也没有将此前本地截图复述为本轮视觉检查。

## 构建、全部 QA 与 rebuild_check

重新构建成功，生成 70 个页面，覆盖根验收清单全部 61 个地址。沿用此前完整 QA，已核对本轮 JS／CSS 构建哈希完全相同；本轮没有重跑完整 QA。完整 12 脚本的实际完成时间：2026-11-12T12:43:48.036Z，12/12 通过。

| 脚本 | 结果 | 用时 |
|---|---|---|
| qa.mjs | 通过 | 2.5 秒 |
| qa-motion.mjs | 通过 | 5.4 秒 |
| qa-products.mjs | 通过 | 9.4 秒 |
| qa-backgrounds.mjs | 通过 | 13.8 秒 |
| qa-template-structure.mjs | 通过 | 4.1 秒 |
| qa-extended-current.mjs | 通过 | 8.0 秒 |
| qa-navigation.mjs | 通过 | 112.2 秒 |
| qa-coverage.mjs | 通过 | 29.9 秒 |
| qa-new-interactions.mjs | 通过 | 2.8 秒 |
| qa-resume.mjs | 通过 | 22.0 秒 |
| qa-flows.mjs | 通过 | 12.7 秒 |
| qa-faq.mjs | 通过 | 6.7 秒 |

结果：[完整 QA](qa-suite-results.json)、[构建指纹](verification.json)。上表为保留的历史 QA 结果，本轮未重跑；当前构建哈希已与该次 QA 的记录逐一核对。此前新增模块截图已在历史报告保留，不作为本轮新增原站视觉证据。

rebuild_check 已重新运行，相似度 **85%**，默认阈值 **90%**，未达到默认阈值；原始输出见 [rebuild-check-final.json](rebuild-check-final.json)。其参考仍限于既有首页、Hyperbarics、Resources、Blog、A4M 及已采交互状态，未包含本轮 44 页新视觉样本。工具返回的 passed 字样不覆盖分数阈值，更不能认证全站；不为提高分数反复改动已接受差异。

此前记录的参考状态核对（本轮未重新核对）：capture/states/states.json 将 state-2.png 标记为第一个 FAQ 展开，但该原始截图实际显示前面的 Journey / Speak with a Hyperbaric Specialist 区块，FAQ 不在视口内；当时本地 qa-faq-1440-1.png 则显示展开的第一个 FAQ。这组截图不是相同视口状态，因此其单项低分不能直接用来判定 FAQ 布局错误。总分仍按工具原样保留，也不据此认定菜单或其他页面的视觉差异已通过。

## 全站验收表

| URL | 模板 | 原站视觉证据状态 | 本地背景 QA |
|---|---|---|---|
| / | home | 已验证既有采样中记录的分区背景（非本轮采样／非全像素认证） | 三宽度通过 |
| /hyperbarics | hyperbarics | 已验证既有采样中记录的分区背景（非本轮采样／非全像素认证） | 三宽度通过 |
| /resources | resources | 已验证既有采样中记录的分区背景（非本轮采样／非全像素认证） | 三宽度通过 |
| /blog | blog-list | 已验证既有采样中记录的分区背景（非本轮采样／非全像素认证） | 三宽度通过 |
| /events/a4m-longevity-fest | event-detail | 已验证既有采样中记录的分区背景（非本轮采样／非全像素认证） | 三宽度通过 |
| /products/fortius-420 | product | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /products/fortius-420-exp | product | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /products/quamvis-320 | product | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /products/respiro-270 | product | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /products/vitaeris-320 | product | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /blog/fda-hyperbaric-chambers-wellness-devices-not-exempt | article | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /post/hyperbaric-oxygen-therapy-for-longevity | article | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /post/hbot-for-brain-injury-what-clinical-trials-show | article | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /post/hyperbaric-oxygen-therapy-for-long-covid-research | article | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /post/does-insurance-cover-hyperbaric-oxygen-therapy | article | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /post/starting-an-hbot-business-clinic-setup-guide | article | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /post/hbot-for-pets-veterinary-hyperbaric-therapy | article | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /post/why-russell-wilson-spends-over-1-million-a-year-on-his-body | article | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /post/from-survival-to-service-coryn-carvers-journey-to-healing-through-hyperbaric-therapy | article | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /post/how-medical-grade-hyperbaric-oxygen-therapy-is-supporting-healing-at-md-hyperbaric-stamford | article | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /post/how-mark-andrews-used-a-hyperbaric-oxygen-chamber-in-his-injury-recovery | article | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /post/how-neymar-jr-uses-advanced-recovery-tech-to-stay-at-peak-performance | article | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /post/hyperbaric-success-stories-how-top-athletes-use-oxygen-therapy-to-heal-and-recover | article | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /post/lebron-james-uses-hyperbaric-oxygen-therapy | article | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /post/the-rise-of-hyperbaric-oxygen-therapy-in-professional-sports | article | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /contact | contact | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /support | support | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /partners | partners | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /why-oxyhealth | why-oxyhealth | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /finance | finance | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /about | about | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /events/events | event-list | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /hyperbaric-chamber-for-sale | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /home-hyperbaric-chamber | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /portable-hyperbaric-chamber | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /soft-shell-hyperbaric-chamber | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /mild-hyperbaric-chamber | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /fda-cleared-hyperbaric-chamber | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /best-hyperbaric-chamber | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-chamber-comparison | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-chamber-buying-guide | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-chamber-cost | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-chamber-for-business | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hbot-for-your-practice | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-chamber-rental | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /used-hyperbaric-chamber | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-chamber-prescription | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-chamber-room-requirements | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /genuine-oxyhealth-hyperbaric-chamber | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-chamber-benefits | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-chamber-side-effects | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-chamber-insurance | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-research-library | research-library | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /hyperbaric-therapy-anti-aging | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-therapy-athletic-recovery | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-therapy-brain-health | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-therapy-inflammation | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-therapy-long-covid | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-therapy-near-me | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-therapy-veterinary | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /hyperbaric-therapy-wound-healing | landing | 未验证：本轮未请求；仅本地重新构建与检查 | 三宽度通过 |
| /vitaeris-320-vs-respiro-270 | comparison | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /vitaeris-320-vs-quamvis-320 | comparison | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /fortius-420-vs-fortius-420-exp | comparison | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /documents/safety | document-safety | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /documents/terms-conditions | document-terms | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /documents/privacy-notice | document-privacy | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /documents/repair-exchange-policy | document-repair | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /documents/fda | document-fda | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /hyperbaric-pressure-converter | pressure-converter | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |

剩余问题：44 个目标的背景分段、精确配色与布局均缺少原站样本；11 个占位页仍有结构证据缺口。历史 web_site_open 在执行前被自动审批拒绝，本轮未重试，故不能宣布精确视觉收尾完成。实际可执行的原站浏览器采样或等效原始截图／计算样式才能解除该缺口。运行 node write-acceptance-report.mjs 可重新生成此报告；生成器分别引用本轮验证记录、历史原站日志和带实际时间的 QA 结果。
