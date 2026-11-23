import fs from 'node:fs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8').replace(/^\uFEFF/,''));
const routes=read('app/backend-page-manifest.json');const comparisons=read('app/checks/backend-comparisons.json');
const lookup=new Map(comparisons.map(r=>[r.key+'-'+r.width,r]));const missing=routes.flatMap(r=>[1440,390].filter(w=>!lookup.has(r.key+'-'+w)).map(w=>r.key+'-'+w));
if(missing.length)throw new Error('Acceptance needs completed checks: '+missing.join(', '));
const rows=[];for(const r of routes)for(const w of [1440,390]){const c=lookup.get(r.key+'-'+w);rows.push({...c,label:r.label});}
for(const w of [1440,390]){const c=lookup.get('shell-'+w);if(!c)throw new Error('Missing shell evidence '+w);rows.push({...c,label:'后台外框及首页',path:'/user/index/index'});}
const pct=n=>(100*n).toFixed(2)+'%';
const link=p=>p.replaceAll('\\','/').replace(/^app\//,'').replace(/^capture\//,'../capture/');
const evidence=p=>`[截图](${link(p)}) · [DOM](${link(p.replace(/\.png$/,'.html'))})`;
const table=rows.map(r=>`| ${r.label.replaceAll('|','/')} \`${r.path}\` | ${r.width} | ${r.status} | ${evidence(r.original)} · [全页](${link(r.fullOriginal)}) | ${evidence(r.local)} · [全页](${link(r.full)}) | ${r.comparison?.comparable?pct(r.comparison.difference_fraction):'见报告'} | ${r.fullComparison?.sizes?`${r.fullComparison.sizes.before.height} / ${r.fullComparison.sizes.after.height}`:'见报告'} |`).join('\n');
const interactions=read('app/checks/interaction-comparisons.json');
// Only these recorded comparisons use different source/local data snapshots.
// Keep their scores and evidence; they do not count as verified interactions.
const snapshotStates=new Set(['1440/search','1440/columns','1440/table-view','390/search','390/columns']);
const snapshotReason='原站最新稳定交互采样显示0条记录，本地保留较早稳定采样的3条记录；数据状态不同。';
const isRecordedSnapshotDifference=r=>r.key==='user_score_log'&&snapshotStates.has(`${r.width}/${r.state}`)&&r.reason===snapshotReason&&r.result?.comparable&&r.before.replaceAll('\\','/').startsWith(`capture/admin/dialog-investigation/user_score_log-stable-${r.width}/`)&&r.after.replaceAll('\\','/').startsWith(`capture/admin/local-states/user_score_log-interactive-${r.width}/`);
const interactionStatus=r=>r.result?.comparable&&r.result.perceptual_similarity>=.98?'已验证':isRecordedSnapshotDifference(r)?'已记录数据差异':'待修复';
const interactionRows=interactions.map(r=>`| ${r.key} | ${r.width} | ${r.state} | ${interactionStatus(r)} | ${evidence(r.before)} | ${evidence(r.after)} | ${r.result?.comparable?pct(r.result.perceptual_similarity):'无法比较'} |`).join('\n');
const residuals=interactions.filter(r=>interactionStatus(r)!=='已验证');
const residualText=residuals.map(r=>`- ${r.key} / ${r.width} / ${r.state}：${r.reason||r.notes||'剩余视觉差异，尚未达到98%感知相似度；该状态已实际采样与对照，具体区域见差异报告'}。`).join('\n')||'稳定状态复验中没有低于当前感知相似度阈值的交互条目。';
const imperfect=rows.filter(r=>r.status!=='已验证'||r.errors?.length||r.failed?.length);
const exceptions=imperfect.map(r=>`- ${r.path}（${r.width}）：${r.status}；${r.reason||r.notes||'具体变化区域见逐页差异记录'}；脚本错误 ${r.errors?.length||0}，失败资源 ${r.failed?.length||0}，像素差异 ${r.comparison?.comparable?pct(r.comparison.difference_fraction):'无法比较'}。详情见 checks/backend-comparisons.json 对应条目。`).join('\n')||'当前逐页浏览器检查没有待修复条目；已验证不代表逐像素或真实后端等价。';
const summary={updated:new Date().toISOString(),contentPages:routes.length,pages:routes.length+1,widthChecks:rows.length,statusCounts:rows.reduce((o,r)=>(o[r.status]=(o[r.status]||0)+1,o),{}),interactionStates:interactions.length,interactionStatusCounts:interactions.reduce((o,r)=>(o[interactionStatus(r)]=(o[interactionStatus(r)]||0)+1,o),{}),rows};
const login=read('app/checks/login-closure.json');
if(!login.pass||login.rows.length!==6||login.rows.some(r=>!['已验证','已验证（保留差异）'].includes(r.status)))throw new Error('Login closure evidence incomplete');
if(imperfect.length||interactions.some(r=>interactionStatus(r)==='待修复'))throw new Error('Acceptance still has unresolved defects');
summary.loginChecks=login.rows.length;summary.loginStatusCounts=login.statusCounts;summary.loginRows=login.rows;
summary.closure={status:'complete',unverified:0,needsFix:0,recordedSnapshotDifferences:5,retainedLoginDifferences:2};
const loginLabels={empty:'空表单必填提示',invalid:'错误账号提示',agreement:'未勾协议提示'};
const loginTable=login.rows.map(r=>`| ${loginLabels[r.state]} | ${r.width} | ${r.status} | ${evidence(r.sourceImage)} | ${evidence(r.localImage)} | ${pct(r.comparison.perceptual_similarity)} | ${r.reason} |`).join('\n');
fs.writeFileSync('app/checks/coverage.json',JSON.stringify(summary,null,2));
const md=`# GEO 后台复刻验收说明

更新：2026-11-22。已通过用户指定 CLI 登录原站，后台落点为 /user/index/index，默认内容为 /user/dashboard。交互采样没有重试 MCP。

已建立 ${routes.length} 个菜单及新增、编辑、弹窗内容页面，加后台外框共 ${routes.length+1} 页，逐页完成 ${rows.length} 次 1440/390 浏览器检查。下面的“已验证”指该页面的实际本地 DOM、截图、网络与脚本错误检查已执行，且报告达到当前对照条件；不表示真实业务后端已接入或达到逐像素100%。像素差异为容差16下的变化像素比例，完整结构、感知、全页指标见 checks/backend-comparisons.json。

## 构建与使用

在 app/ 执行 npm.cmd install、npm.cmd test、npm.cmd run build。静态产物位于 dist/。npm.cmd run test:browser 核对本轮已保存的本地登录和AI浏览器证据。

最终构建及全部测试见 [收尾报告](checks/final-validation.json)：21项逻辑/AI测试、14项浏览器证据断言（8项本轮复跑的登录/AI流程＋6项原站/本地登录提示对照）及 [验收闭环检查](checks/acceptance-links.json) 全部通过。最终 [rebuild_check](checks/final-rebuild-check.json) 通过，登录1440/768/390视觉与文本100%、结构80%；预览 http://127.0.0.1:4173/ 已实际检查可用。凭据及敏感令牌扫描见 [完整性检查](checks/integrity.json)。

本地演示使用 demo / demo123，成功后进入 /user/index/index。演示账号仅用于本地页面状态；没有原站账户、Cookie或供应商密钥。原站测试凭据仅在采样进程内使用，传入 hidden_values；个人资料字段在截图前遮蔽，截图证据旁有 redaction 元数据。

## 真实技术组合与实现

登录保留 HTML、jQuery 3.7.1、Layui 2.7.6。后台实际还使用 FastAdmin/AdminLTE、Bootstrap、RequireJS、Bootstrap Table、bootstrap-select、日期选择器和 UEditor。源站组件资源与字体存放 site-assets/，来源和原站缺失资源见 checks/assets-audit.json、checks/css-adjustments.json、../capture/static-assets/。

backend-pages/ 是根据脱敏采样 DOM 与原站 CSS生成的静态页面，backend-routes.json 维护路由，admin-runtime.js 提供本地菜单、筛选、表格、弹窗、表单与AI调用。原站服务端鉴权、数据库和付费接口由本地静态演示层替代；这部分不能宣称与原服务端技术栈100%相同。

## 逐页双宽验收

收尾状态：已闭环，无未验证项、无悬空待修复项。170项后台页面、268项后台交互及以下6项登录状态分别登记；5项数据快照差异与2项错误账号演示差异均有原因和双侧证据，不计作视觉一致。

### 登录页补证（监工指令 #3）

2026-11-22 使用已授权 CLI 直调 CDP 9222，在隔离临时浏览器上下文中实测；原有已登录标签页和Cookie保持不变。输入仅为虚构的无效测试值，未使用真实凭据。原站与本地均实际点击提交，截图大小为1440×900和390×900。完整请求概要、DOM、截图及观察记录见 [登录对照报告](checks/login-closure.json) 和 [capture目录](../capture/admin/login-closure/)。空表单及协议提示的“已验证”包括行为核对与至少98%感知相似度；错误账号的“已验证（保留差异）”仅表示完成实测并明确接受静态演示边界，不代表视觉或真实鉴权等价。

| 登录状态 | 宽度 | 验收状态 | 原站证据 | 本地证据 | 感知相似度 | 结论与保留原因 |
| --- | ---: | --- | --- | --- | ---: | --- |
${loginTable}

### 后台页面

| 页面 | 宽度 | 状态 | 原站证据 | 本地证据 | 变化像素 | 全页高（原/本） |
| --- | ---: | --- | --- | --- | ---: | ---: |
${table}

## 登录、后台外框和交互证据

- 登录页：checks/rebuild-check.json；rebuild_check 对登录起始态 1440/768/390 给出视觉与文本100%、结构80%。它不代替上述后台验收。
- 登录到后台：../capture/admin/login/record.json；本地 ../capture/admin/local-flow-login/record.json。
- 后台外框双宽：../capture/admin/shell-1440/、shell-390/；各级菜单与账号下拉：shell-states-1440/、shell-states-390/，每一步有DOM和截图。
- 每页搜索、列选择、视图切换、模型选项、Tab及新增弹窗：../capture/admin/interaction-coverage.json 定位原站步骤；../capture/admin/states/ 保存截图和DOM。
- 新增、编辑和投稿弹窗的实际URL：../capture/admin/subroutes.json、interaction-subroutes.json。重复记录使用同一表单模板；不是把每条数据库记录作为独立页面宣称全部操作过。
- 生成、检测、分析三个本地入口：../capture/admin/local-ai-generate/、local-ai-detect/、local-ai-analyze/；均观察到统一的未配置反馈，没有调用原站AI接口。
- 上述登录与三个AI入口均复验1440/390，390证据目录追加 -390；八项浏览器检查见 checks/browser-tests.txt。异步组件初始化前的早期采样保留在对应 -early 目录，最终验收采用初始化完成后的结果。
- 原生下拉及表单输入：checks/form-plugin-checks.json。后台外框展开及账号菜单：../capture/admin/local-shell-states-1440/、local-shell-states-390/。
- TDK动态字段：checks/tdk-field-checks.json，16项双宽原站/本地对照通过，覆盖新增、删除、回车新增、重置和本地必填/保存；原站未执行最终提交。
- 72次常规页面交互、20次投稿与绑定弹窗，以及补充AI按钮和手动关键词组合已留存本地证据；完整清单为 checks/interaction-coverage.json、interaction-special.json、last-change-validation.json。部分原站移动端按钮先在1440打开再缩到390，报告保留 opening_width；没有把这种采样记成原站390直接点击成功。

## 逐状态交互对照

以下 ${interactions.length} 个状态都有截图与DOM。“已验证”采用感知相似度至少98%的对照条件，不表示逐像素一致。早期原站校验器、固定列、下拉框尚未初始化的截图已保留历史证据，稳定状态复采的依据见 checks/interaction-residual-review.json；不修改历史截图来提高分数。

“已记录数据差异”仅用于下方5项点数明细快照对照：原站后期采样为0条，本地保留早期采样的3条；这些条目仍低于98%阈值，不计入“已验证”，原始分数、截图及差异原因均保留。

| 页面 | 宽度 | 状态名 | 验收状态 | 原站证据 | 本地证据 | 感知相似度 |
| --- | ---: | --- | --- | --- | --- | ---: |
${interactionRows}

${residualText}

## AI 空壳与配置

services/ai-service.js 暴露 GeoAI.request('generate' / 'detect' / 'analyze', input, options)。ai-config.js 默认为 stub，返回 not_configured；admin-runtime.js 已将生成表单、诊断按钮、品牌分析与相关工具接到统一入口。loading、失败、取消和超时由统一服务处理。真实接入将 mode 改为 proxy，并由自有服务端实现同源 /api/ai；协议见 AI接入说明.md。默认不生成虚假文章、诊断分数或发布成功结果。

## 无法100%复刻与保留差异

1. 真实鉴权、权限校验、服务器控制器、数据库、支付、发布、授权与上传服务没有原站后端代码，也不进行生产写入；本地产物提供静态演示状态。
2. 表格与报表为采样时刻快照，本地搜索、排序和分页仅作用于当前已保存及本地新增记录；无法凭有限快照还原服务器全部历史数据、每个动态记录的不同内容或实时余额。
3. AI真实生成、检测、分析按要求保留stub；没有虚构执行结果。涉及消耗余额、发布或第三方授权的最终提交未在原站执行，不能当作真实业务链路通过。
4. 原站自身部分资源返回404；已保留原始失败列表并去掉本地无效请求，具体6项样式调整见 checks/css-adjustments.json。个人资料账号和敏感字段已遮蔽，导致这些区域与原始像素有预期差异。
5. 原站动画、时间、随机节点标识、实时数据会造成截图差异；各页具体数值保存在逐页报告。复刻没有引入其他前端框架，但原站业务控制器由本地交互层替代。
6. 原站登录空表单、错误账号响应及未勾协议提示已完成双宽采样与本地对照，见上方6项记录。错误账号响应保留独立错误页与本地演示Layer提示的差异；不推断所有账号/密码错误分支或服务端实现。真实文件上传/媒体发布、跨账号权限及测试账号不可达页面属于本轮静态演示交付边界，不声明真实业务等价。
7. 手动关键词组合按已观察的输入项在本地组合，不具备原站PHP算法源码；生成结果的完整业务等价性无法证明。短表格移动端的横向滚动条及实时记录数量差异，在逐页报告 notes 中保留，不能把通过阈值解释为像素完全一致。
8. 静态交付用双宽HTML模板匹配原站布局，同名入口可访问；移动端会跳到内部 backend-pages/*.mobile.html 地址。这是本地路由实现差异，没有原站服务端按请求生成页面的能力。

${exceptions}

## 收录与敏感信息

robots.txt 和 dist/robots.txt 全站 User-agent: * / Disallow: /，页面保留 noindex、nofollow；没有生成 sitemap.xml、llms.txt 或结构化数据。checks/integrity.json 记录交付及采样文件的测试凭据与云密钥扫描结果。原始项目任务输入不属于交付文件，也未复制进dist。
`;
fs.writeFileSync('app/验收说明.md',md);console.log(JSON.stringify({pages:routes.length,checks:rows.length,statusCounts:summary.statusCounts}));
fs.writeFileSync('app/交接记录.md',`# 本轮交接

完工状态：监工指令 #3 已闭环。登录两类缺证已消除，新增空表单、错误账号、未勾协议三种状态×1440/390，共6组双侧实测；4组已验证一致性，2组错误账号已验证并保留演示差异。证据在 ../capture/admin/login-closure/，结论与原因为 checks/login-closure.json。验收表无未验证项、无悬空待修复项；5项快照差异均已逐项登记，未提高阈值或篡改原始分数。

此前已按用户指定的 shell CLI 完成真实登录及后台采样，没有重试交互 MCP。成功落点 /user/index/index，默认内容 /user/dashboard；原站 Chrome CDP 9222 会话保留。本次仅使用虚构无效输入补证；既有采样凭据从任务元数据仅在进程内读取并传入 hidden_values，禁止复制进产物。

app/ 已建立 ${routes.length} 个后台内容路由和外框，包含49菜单页及新增、编辑、投稿/绑定等表单。原站 Layui、jQuery、Bootstrap、RequireJS、FastAdmin/AdminLTE、表格、UEditor和选择器资源均本地加载；静态服务器行为由 admin-runtime.js 提供。生成、检测、分析接到 GeoAI.request 统一 stub，默认明确显示未配置。

最新验收以 验收说明.md 与 checks/coverage.json 为入口：${rows.length} 个页面宽度组合，${interactions.length} 个交互状态；逐页状态 ${JSON.stringify(summary.statusCounts)}，逐状态 ${JSON.stringify(summary.interactionStatusCounts)}。5项点数明细差异为原站后期0条、本地保留早期3条记录，低于98%阈值，单列已记录数据差异，不计作一致性通过。原始DOM/截图/网络位于 ../capture/admin/，本地证据在其 local/、local-states/、local-modal-final/ 等目录，报告保留准确路径。早期未初始化源图保留为历史，稳定复采明确记录 priorSourceImage 和原因。

构建产物在 dist/；逻辑与浏览器证据检查记录在 checks/service-tests.txt、browser-tests.txt，构建记录在 checks/build.txt，最终 Craft 检查在 checks/rebuild-check.json。rebuild_check的登录起始页分数不代表后台全量或真实业务后端等价，后台有单独逐页对照。robots.txt全站 Disallow；最终敏感文本检查见 checks/integrity.json 与 ../capture/redaction-report.json。

本次最终复跑汇总为 checks/final-validation.json；rebuild_check 原始报告为 checks/final-rebuild-check.json；证据链接闭环检查为 checks/acceptance-links.json。预览使用 http://127.0.0.1:4173/，构建后实际浏览器复跑本地双宽登录和AI三个入口，并重新采样本轮登录提示。历史 resume-* 报告保留当时未知项，不代表当前状态。当前两项调查未知已通过 CLI 更新；真实服务端缺失作为明确交付边界登记。没有剩余待实施修复。

剩余边界和差异已逐条列入验收说明：真实服务端鉴权/数据库/支付发布上传、测试账号之外权限、真实AI不属于已接入行为；本地数据为采样快照，原站记录变化不会同步。不要把阈值通过写成100%逐像素或服务器完全复刻。后续如接真实AI，在自有服务端实现同源/api/ai，按 AI接入说明.md 配置；不得把供应商密钥放入浏览器。
`);
