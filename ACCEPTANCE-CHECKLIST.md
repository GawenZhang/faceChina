# 验收清单与页面交互清单（用户验收协议 v1）

> 本文件是用户验收协议 + 从 `capture/page.html` 提取的原站真实链接清单。
> builder 必须按此执行并在交付时回报验收表。
>
> 素材规则（用户已确认）：图片、Logo、文字内容**可以占位**，但必须保留相应的布局、尺寸、文字层级和合理行数。
> 已接受的微小视觉偏差**不再反复修改**。抓取不到的素材用占位符，禁止循环重试。
> 用户已确认拥有该网站的完全授权。

## 一、原站真实页面清单（来源：capture/page.html 全量链接提取）

### 导航（header，6 项 + Products 下拉）
- /hyperbarics · /resources · /blog · /finance · /about · /events/events
- Products 下拉 → 5 个产品详情页（见下）

### 产品详情页（同一模板 ×5）
- /products/fortius-420
- /products/fortius-420-exp
- /products/quamvis-320
- /products/respiro-270
- /products/vitaeris-320
- **入口规则：首页/列表的产品卡是 "Learn more >" 链接 → 跳转详情页（完整页面），不是弹窗**

### 博客（列表 + 详情两种模板）
- 列表：/blog
- 文章详情（同一模板 ×7）：
  - /blog/fda-hyperbaric-chambers-wellness-devices-not-exempt
  - /post/does-insurance-cover-hyperbaric-oxygen-therapy
  - /post/hbot-for-brain-injury-what-clinical-trials-show
  - /post/hbot-for-pets-veterinary-hyperbaric-therapy
  - /post/hyperbaric-oxygen-therapy-for-long-covid-research
  - /post/hyperbaric-oxygen-therapy-for-longevity
  - /post/starting-an-hbot-business-clinic-setup-guide
  - 列表卡片必须链到对应文章详情 URL，不得全部指向同一页面或用弹窗代替

### 独立页面（各自模板，需逐页核对）
- /contact · /support · /partners · /why-oxyhealth · /finance · /about
- /events/events（活动列表）与 /events/a4m-longevity-fest（活动详情）是**两种不同模板**

### 页脚 SEO 着陆页矩阵（约 30 个，主体为同一着陆页模板）
/hyperbaric-chamber-for-sale · /home-hyperbaric-chamber · /portable-hyperbaric-chamber ·
/soft-shell-hyperbaric-chamber · /mild-hyperbaric-chamber · /fda-cleared-hyperbaric-chamber ·
/best-hyperbaric-chamber · /hyperbaric-chamber-comparison · /hyperbaric-chamber-buying-guide ·
/hyperbaric-chamber-cost · /hyperbaric-chamber-for-business · /hbot-for-your-practice ·
/why-oxyhealth · /hyperbaric-chamber-rental · /used-hyperbaric-chamber ·
/hyperbaric-chamber-prescription · /hyperbaric-chamber-room-requirements ·
/genuine-oxyhealth-hyperbaric-chamber · /hyperbaric-chamber-benefits · /hyperbaric-chamber-side-effects ·
/hyperbaric-chamber-insurance · /hyperbaric-research-library · /hyperbaric-pressure-converter（**交互工具页，独特模板**）·
/hyperbaric-therapy-anti-aging · /hyperbaric-therapy-athletic-recovery · /hyperbaric-therapy-brain-health ·
/hyperbaric-therapy-inflammation · /hyperbaric-therapy-long-covid · /hyperbaric-therapy-near-me ·
/hyperbaric-therapy-veterinary · /hyperbaric-therapy-wound-healing

### 对比页（同一模板 ×3）
/vitaeris-320-vs-respiro-270 · /vitaeris-320-vs-quamvis-320 · /fortius-420-vs-fortius-420-exp

### 法务文档 ×5
/documents/safety · /documents/terms-conditions · /documents/privacy-notice ·
/documents/repair-exchange-policy · /documents/fda

## 二、当前实现状态与早期缺失记录

最新续作（2026-11-12 14:44:07 UTC）：重新构建 70 页成功，全部 61 个清单网址已覆盖；产物与此前通过的 12/12 QA 哈希一致，保留历史 QA，没有重复运行。rebuild_check 本轮成功返回 86%（目标 90%，未达到），当前结果见 [续作验证](app/resume-verification.json) 和 [本轮检查](app/rebuild-check-resume-1441.json)。/why-oxyhealth 独立审查未发现新的本地缺陷；原站视觉 44 项及暂定结构 11 项仍未验证，历史浏览器审批阻断未解除。下方 13:57 UTC 内容为历史结果。

当前已生成 70 个静态页面，覆盖第一节全部 61 个非首页网址；产品、文章、活动详情与列表、独立页、着陆页、对比页、法务页及压力换算工具均已建立。产品和文章入口已改为各自的完整详情页链接。最新逐页与交互检查结果见 [验收报告](app/ACCEPTANCE-REPORT.md) 和 [验证记录](app/verification.json)。

2026-11-12 13:57 UTC 续作验证：70 页重新构建成功，JS／CSS 哈希与 12:43:48 UTC 已通过的 12/12 QA 构建完全一致，故沿用该次 QA，未重复运行。新的 rebuild_check 仍为 85%，低于 90% 默认阈值；独立源码复查未发现新的本地缺陷，首页及产品详情预览均返回正常响应。本轮更新验证记录与验收结果，未修改界面或报告生成器；此前 Products 菜单悬停／点击修复和支持表单重置修复均保留。本轮未新增原站采样，44 项原站视觉与 11 项暂定结构仍未验证。

尚未完成的原站验收：44 个页面缺少精确背景、配色和布局比对，其中 11 页结构仍为暂定；原站浏览器采样此前被自动审批拒绝。页面已建立不等于原站视觉已验证，未验证项不得记为通过。

### 早期检查快照（保留历史，以下不是当前缺失清单）

**已建**：/（首页）、/hyperbarics、/resources、/blog、/events/a4m-longevity-fest
**缺失**：
- 产品详情页 ×5（首页产品卡当前用报价弹窗，原站是详情页跳转 → **交互方式错误，必须改**）
- 文章详情页模板（博客卡片当前无详情跳转）
- 独立页：contact、support、partners、why-oxyhealth、finance、about、events/events
- 着陆页矩阵（可共用同一模板 + 占位正文，但每个 URL 必须可达且结构正确）
- 对比页 ×3、法务页 ×5、压力换算工具页

## 三、执行要求（用户协议原文要点）

1. **先建立页面与交互清单**：入口所在页面 → 点击对象 → 目标网址/状态 → 页面类型 → 复刻实现 → 验证结果。不得只凭首页和最先抓取的几个页面认定网站结构完整。
2. **覆盖所有页面类型**：区分列表/详情；同模板文章可共用详情模板 + 占位正文；不同模板分别检查。每种模板先验证代表页面。
3. **保持原站打开方式**：原站跳完整页的必须完整页；只有原站用弹窗的才用弹窗。不得用摘要卡/弹窗代替详情页，不得把不同文章链到同一无关页。缺少参考资料时明确记录"缺少证据/未实现"，不得自行简化后当作完成。
4. **验证完整使用路径**：列表点击进详情 → URL 正确 → 结构正确 → 直接访问与刷新正常 → 浏览器返回正常。同时验证桌面与手机的菜单、FAQ、轮播、弹窗等实际交互状态。"按钮能点击、没有报错"≠ 与原站一致。
5. **验收顺序**：先查页面缺失、错误跳转、交互方式错误；再查模块遗漏、明显错位、内容隐藏、溢出；最后查字体、间距。复用已有有效证据，只补采缺失页面和状态。
6. **完成条件**：交付预览地址 + 页面与交互验收表（每项标记：已验证 / 用户已接受差异 / 待修复 / 未验证）+ 剩余问题与未验证项。未验证不得记作通过；不得仅凭截图相似度、构建成功或部分检查通过宣布完成。存在页面缺失、错误跳转或交互不一致时，不得标记完成。
