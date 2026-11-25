# 恢复构建与验收报告

更新时间：2026-11-12T11:58:01.445Z。**本轮恢复本地构建、完整 QA 与 rebuild_check；精确原站视觉验收仍未完成。** 本轮没有重新提交原站浏览器调用。此前 /why-oxyhealth 的一次调用被自动审批拒绝，其余 43 页未逐 URL 请求；当前审批策略仍为 never，按交接记录不重复被拒操作。此前拒绝不能解释为原站不可访问，旧文本或本地 QA 也不是原站新样本。

## 本轮实际改动

本轮没有页面 UI、背景、配色或布局变更。检查验收清单与 core_unknowns_show，重新构建并运行全部验证；修正报告生成器，将此前的 1 次拒绝及 43 页未请求状态明确标为历史记录，避免更新报告时间时误称本轮重新采样。保留已有修正和已接受差异。

此前报告和审计账本分别归档为 [重试前报告](ACCEPTANCE-REPORT-before-restart-retry.md) 与 [重试前账本](live-source-audit-before-restart-retry.json)；四份原始只读记录未覆盖。此前拒绝的原始记录见 [重启后重试记录](live-source-retry.json)，其时间和内容未改写。

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

## 此前原站重试与尚未解除的阻断

此前用户已授权原站实时采样，并说明 Codex 已重启及注册修复。约 2026-11-12T10:59:19Z，Craft Anything web_site_open 请求 https://www.oxyhealth.com/why-oxyhealth（1440 × 900，等待 2000 ms，超时 60 秒）仍收到自动审批拒绝，原文：**MCP tool call requires approval, but approval policy is never**。该历史调用未执行，新增原站 HTML／截图／计算样式均为 0；本轮没有重复该调用或换用其他浏览器规避限制。时间为此前拒绝后记录的近似时间。

| 历史原站重试范围 | 数量 | 证据边界 |
|---|---|---|
| 待补采页面 | 44 | 28 个着陆页、15 篇文章、Why，包含全部 11 个占位页 |
| 实际尝试的浏览器调用 | 1 | /why-oxyhealth；审批拒绝，未执行 |
| 未逐 URL 再次请求 | 43 | 包括保险文章和 brain-health；沿用会话策略阻断状态，不称作请求失败 |
| 新增原站实时样本 | 0 | 所有目标背景、精确色值与视觉布局仍未验证 |
| 此前只读证据 | 33 页可读，11 页无正文 | 历史记录，可能为缓存文本；本轮没有重新抓取 |

此前 CSS 请求不可访问、Cache miss 或无正文的记录仅作为历史证据保留，不代表本轮请求结果。完整逐页状态及本地三宽度色值见 [当前审计账本](live-source-audit.json)。

## 11 个占位页

| URL | 状态 | 此前采样状态与历史证据 |
|---|---|---|
| /mild-hyperbaric-chamber | 未验证／保留占位 | 此前未逐 URL 请求；会话审批策略阻断；此前只读抓取 Cache miss |
| /hyperbaric-chamber-for-business | 未验证／保留占位 | 此前未逐 URL 请求；会话审批策略阻断；此前只读抓取 Cache miss |
| /hyperbaric-therapy-brain-health | 未验证／保留占位 | 此前未逐 URL 请求；会话审批策略阻断；此前只读抓取 Cache miss |
| /hyperbaric-therapy-inflammation | 未验证／保留占位 | 此前未逐 URL 请求；会话审批策略阻断；此前只读抓取 Cache miss |
| /hyperbaric-therapy-long-covid | 未验证／保留占位 | 此前未逐 URL 请求；会话审批策略阻断；此前只读抓取 Cache miss |
| /hyperbaric-therapy-veterinary | 未验证／保留占位 | 此前未逐 URL 请求；会话审批策略阻断；此前只读抓取 Cache miss |
| /hyperbaric-therapy-wound-healing | 未验证／保留占位 | 此前未逐 URL 请求；会话审批策略阻断；此前只读抓取 Cache miss |
| /why-oxyhealth | 未验证／保留占位 | 此前已尝试；执行前审批拒绝；此前只读抓取 Cache miss |
| /post/does-insurance-cover-hyperbaric-oxygen-therapy | 未验证／保留占位 | 此前未逐 URL 请求；会话审批策略阻断；此前只读抓取 Cache miss |
| /post/hbot-for-pets-veterinary-hyperbaric-therapy | 未验证／保留占位 | 此前未逐 URL 请求；会话审批策略阻断；此前只读抓取 Cache miss |
| /post/how-mark-andrews-used-a-hyperbaric-oxygen-chamber-in-his-injury-recovery | 未验证／保留占位 | 此前未逐 URL 请求；会话审批策略阻断；此前只读响应无可读正文；缺原站截图和计算样式 |

## 44 个目标逐页对照

本表保留此前“拒绝／未请求”状态与更早的文本证据；本轮原站请求数为 0。布局状态包括真实几何、网格、媒体位置和断点；历史文字层级不证明视觉布局。此前每页重试记录见 [live-source-retry.json](live-source-retry.json)。

| URL | 此前原站采样状态 | 背景分段 | 精确配色 | 视觉布局 | 保留的历史证据 |
|---|---|---|---|---|---|
| /blog/fda-hyperbaric-chambers-wellness-devices-not-exempt | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/hyperbaric-oxygen-therapy-for-longevity | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/hbot-for-brain-injury-what-clinical-trials-show | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/hyperbaric-oxygen-therapy-for-long-covid-research | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/does-insurance-cover-hyperbaric-oxygen-therapy | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-priority-attempts.json) |
| /post/starting-an-hbot-business-clinic-setup-guide | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/hbot-for-pets-veterinary-hyperbaric-therapy | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-placeholder-attempts.json) |
| /post/why-russell-wilson-spends-over-1-million-a-year-on-his-body | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/from-survival-to-service-coryn-carvers-journey-to-healing-through-hyperbaric-therapy | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/how-medical-grade-hyperbaric-oxygen-therapy-is-supporting-healing-at-md-hyperbaric-stamford | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/how-mark-andrews-used-a-hyperbaric-oxygen-chamber-in-his-injury-recovery | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前只读响应无可读正文；缺原站截图和计算样式；[旧记录](live-source-placeholder-attempts.json) |
| /post/how-neymar-jr-uses-advanced-recovery-tech-to-stay-at-peak-performance | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/hyperbaric-success-stories-how-top-athletes-use-oxygen-therapy-to-heal-and-recover | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/lebron-james-uses-hyperbaric-oxygen-therapy | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /post/the-rise-of-hyperbaric-oxygen-therapy-in-professional-sports | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-articles.json) |
| /why-oxyhealth | 此前已尝试；执行前审批拒绝 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-priority-attempts.json) |
| /hyperbaric-chamber-for-sale | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /home-hyperbaric-chamber | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /portable-hyperbaric-chamber | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /soft-shell-hyperbaric-chamber | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /mild-hyperbaric-chamber | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-placeholder-attempts.json) |
| /fda-cleared-hyperbaric-chamber | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /best-hyperbaric-chamber | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-comparison | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-buying-guide | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-cost | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-for-business | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-placeholder-attempts.json) |
| /hbot-for-your-practice | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-rental | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /used-hyperbaric-chamber | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-prescription | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-room-requirements | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /genuine-oxyhealth-hyperbaric-chamber | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-benefits | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-side-effects | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-chamber-insurance | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-therapy-anti-aging | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-therapy-athletic-recovery | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-therapy-brain-health | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-priority-attempts.json) |
| /hyperbaric-therapy-inflammation | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-placeholder-attempts.json) |
| /hyperbaric-therapy-long-covid | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-placeholder-attempts.json) |
| /hyperbaric-therapy-near-me | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前仅可读文本；缺原站截图和计算样式；[旧记录](live-source-landings.json) |
| /hyperbaric-therapy-veterinary | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-placeholder-attempts.json) |
| /hyperbaric-therapy-wound-healing | 此前未逐 URL 请求；会话审批策略阻断 | 未验证 | 未验证 | 未验证 | 此前只读抓取 Cache miss；[旧记录](live-source-placeholder-attempts.json) |

## 本地背景盘点与保留项

本轮重新检查全部 70 路由 × 1440／768／390 三宽度，共 210 个样本、369 项背景断言。每个分区的有效背景（含祖先继承）、文字颜色、标题均保存于 [背景 QA JSON](qa-backgrounds-results.json)。这些是本地实现值，不是原站新证据。

产品当前分区顺序为 hero → metrics → gallery → features → specifications → included/installation → compressor → advantage → FAQ → finance → brand → resource → contact。五产品沿用同一背景序列：#0b0b0d → #ffffff → #ffffff → #f5f5f7 → #ffffff → #f5f5f7 → #ffffff → #f5f5f7 → #ffffff → #eaf3fc → #f5f5f7 → #ffffff → #ffffff。用户观察支持 Respiro 深色首屏／浅色正文；精确白灰边界仍未验证。SourceLanding 的 index % 2 交替背景及标题规则 CTA 没有原站色值可核验，继续明确待核验，未猜测修改。

用户已接受的图片、Logo、正文占位及既有细小视觉差异保留；导航 600ms 和曲线仍为暂定值而非原站测量值。表单／聊天继续为本地预览；离线 QA 使用媒体和外站替身，不认证第三方服务。本轮没有新增原站截图，也没有将此前本地截图复述为本轮视觉检查。

## 构建、全部 QA 与 rebuild_check

重新构建成功，生成 70 个页面，覆盖根验收清单全部 61 个地址。完整 12 脚本完成时间：2026-11-12T11:57:29.846Z，12/12 通过。

| 脚本 | 结果 | 用时 |
|---|---|---|
| qa.mjs | 通过 | 2.5 秒 |
| qa-motion.mjs | 通过 | 5.1 秒 |
| qa-products.mjs | 通过 | 9.4 秒 |
| qa-backgrounds.mjs | 通过 | 12.6 秒 |
| qa-template-structure.mjs | 通过 | 3.9 秒 |
| qa-extended-current.mjs | 通过 | 7.1 秒 |
| qa-navigation.mjs | 通过 | 108.1 秒 |
| qa-coverage.mjs | 通过 | 27.5 秒 |
| qa-new-interactions.mjs | 通过 | 3.1 秒 |
| qa-resume.mjs | 通过 | 20.0 秒 |
| qa-flows.mjs | 通过 | 12.7 秒 |
| qa-faq.mjs | 通过 | 6.9 秒 |

结果：[完整 QA](qa-suite-results.json)、[构建指纹](verification.json)。本轮仅重跑本地回归；此前新增模块截图已在历史报告保留，不作为本轮新增原站视觉证据。

rebuild_check 已重新运行，相似度 **86%**，默认阈值 **90%**，未达到默认阈值；原始输出见 [rebuild-check-final.json](rebuild-check-final.json)。其参考仍限于既有首页、Hyperbarics、Resources、Blog、A4M 及已采交互状态，未包含本轮 44 页新视觉样本。工具返回的 passed 字样不覆盖分数阈值，更不能认证全站；不为提高分数反复改动已接受差异。

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
| /blog/fda-hyperbaric-chambers-wellness-devices-not-exempt | article | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /post/hyperbaric-oxygen-therapy-for-longevity | article | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /post/hbot-for-brain-injury-what-clinical-trials-show | article | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /post/hyperbaric-oxygen-therapy-for-long-covid-research | article | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /post/does-insurance-cover-hyperbaric-oxygen-therapy | article | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /post/starting-an-hbot-business-clinic-setup-guide | article | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /post/hbot-for-pets-veterinary-hyperbaric-therapy | article | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /post/why-russell-wilson-spends-over-1-million-a-year-on-his-body | article | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /post/from-survival-to-service-coryn-carvers-journey-to-healing-through-hyperbaric-therapy | article | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /post/how-medical-grade-hyperbaric-oxygen-therapy-is-supporting-healing-at-md-hyperbaric-stamford | article | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /post/how-mark-andrews-used-a-hyperbaric-oxygen-chamber-in-his-injury-recovery | article | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /post/how-neymar-jr-uses-advanced-recovery-tech-to-stay-at-peak-performance | article | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /post/hyperbaric-success-stories-how-top-athletes-use-oxygen-therapy-to-heal-and-recover | article | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /post/lebron-james-uses-hyperbaric-oxygen-therapy | article | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /post/the-rise-of-hyperbaric-oxygen-therapy-in-professional-sports | article | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /contact | contact | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /support | support | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /partners | partners | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /why-oxyhealth | why-oxyhealth | 未验证：此前已尝试；执行前审批拒绝 | 三宽度通过 |
| /finance | finance | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /about | about | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /events/events | event-list | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /hyperbaric-chamber-for-sale | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /home-hyperbaric-chamber | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /portable-hyperbaric-chamber | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /soft-shell-hyperbaric-chamber | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /mild-hyperbaric-chamber | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /fda-cleared-hyperbaric-chamber | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /best-hyperbaric-chamber | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-chamber-comparison | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-chamber-buying-guide | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-chamber-cost | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-chamber-for-business | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hbot-for-your-practice | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-chamber-rental | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /used-hyperbaric-chamber | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-chamber-prescription | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-chamber-room-requirements | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /genuine-oxyhealth-hyperbaric-chamber | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-chamber-benefits | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-chamber-side-effects | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-chamber-insurance | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-research-library | research-library | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /hyperbaric-therapy-anti-aging | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-therapy-athletic-recovery | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-therapy-brain-health | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-therapy-inflammation | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-therapy-long-covid | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-therapy-near-me | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-therapy-veterinary | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /hyperbaric-therapy-wound-healing | landing | 未验证：此前未逐 URL 请求；会话审批策略阻断 | 三宽度通过 |
| /vitaeris-320-vs-respiro-270 | comparison | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /vitaeris-320-vs-quamvis-320 | comparison | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /fortius-420-vs-fortius-420-exp | comparison | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /documents/safety | document-safety | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /documents/terms-conditions | document-terms | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /documents/privacy-notice | document-privacy | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /documents/repair-exchange-policy | document-repair | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /documents/fda | document-fda | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |
| /hyperbaric-pressure-converter | pressure-converter | 未验证：沿用此前文本／用户观察，无新增视觉样本 | 三宽度通过 |

剩余问题：44 个目标的背景分段、精确配色与布局均未获得实时原站样本；11 个占位页仍有结构证据缺口。此前 web_site_open 已被自动审批拒绝，当前审批策略未改变，故不能宣布精确视觉收尾完成。实际可执行的原站浏览器采样或等效原始截图／计算样式才能解除该缺口。运行 node write-acceptance-report.mjs 可重新生成此报告；生成器保留历史重试记录，并与本轮本地验证结果分开。
