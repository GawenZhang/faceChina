import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {allRoutes} from './route-manifest.mjs';

const read = async name => JSON.parse((await fs.readFile(new URL(name, import.meta.url), 'utf8')).replace(/^\uFEFF/, ''));
const write = (name, value) => fs.writeFile(new URL(name, import.meta.url), value);
const sourceFiles = ['live-source-priority-attempts.json', 'live-source-placeholder-attempts.json', 'live-source-articles.json', 'live-source-landings.json'];
const [qa, bg, rebuild, session, retry, ...sources] = await Promise.all(['qa-suite-results.json', 'qa-backgrounds-results.json', 'rebuild-check-final.json', 'live-source-session.json', 'live-source-retry.json', ...sourceFiles].map(read));
const run = await read('verification-run.json');
assert.equal(run.kind, 'local_rebuild');
assert.equal(run.source_browser_calls, 0);
assert.equal(run.new_original_samples, 0);
assert(['retained_from_previous_run','rerun_this_run'].includes(run.qa.status));
const retainedQA = run.qa.status === 'retained_from_previous_run';
assert.equal(run.qa.completed_at, qa.completed_at, 'QA metadata must match the actual completion time');
const artifacts = {};
for (const name of await fs.readdir(new URL('dist/assets/', import.meta.url))) artifacts[name] = createHash('sha256').update(await fs.readFile(new URL('dist/assets/' + name, import.meta.url))).digest('hex');
assert.deepEqual(artifacts, run.qa.artifacts, 'Current bundles differ from the recorded QA build; run QA again before updating verification');
assert(qa.completed_at && qa.scripts.length === 12 && qa.passed, 'A completed, passing full QA suite is required');
assert(bg.passed && bg.results.length === allRoutes.length * 3, 'Complete three-width background inventory is required');
const targets = allRoutes.filter(r => ['landing', 'article', 'why-oxyhealth'].includes(r.template));
const attempts = sources.flatMap((s, i) => s.results.map(r => ({...r, record:sourceFiles[i]})));
assert.equal(targets.length, 44, 'Scope is 28 landings, 15 articles and Why');
assert.equal(attempts.length, targets.length, 'Every target must have a single attempt record');
assert.equal(new Set(attempts.map(r => r.path)).size, targets.length, 'Duplicate route attempt');
for (const target of targets) assert(attempts.some(r => r.path === target.path), `Missing attempt: ${target.path}`);
assert.equal(retry.results.length, targets.length, 'Every target needs a recorded historical retry status');
assert.equal(new Set(retry.results.map(r => r.path)).size, targets.length, 'Duplicate historical retry route');
for (const target of targets) assert(retry.results.some(r => r.path === target.path), `Missing historical retry status: ${target.path}`);
assert.equal(retry.results.filter(r => r.attempted).length, 1, 'Only one browser call was attempted in the recorded historical retry');
assert.equal(retry.results.filter(r => r.status === 'approval_rejected').length, 1);
assert.equal(retry.results.filter(r => r.status === 'not_attempted_session_policy_blocked').length, 43);
assert(retry.results.every(r => r.new_original_samples === 0), 'This blocked retry cannot certify original samples');
assert.equal(retry.browser_attempt.path, '/why-oxyhealth');
assert.equal(retry.browser_attempt.execution_started, false);
assert.equal(session.results.length, targets.length, 'Every target needs a historical source-session status');
assert.equal(new Set(session.results.map(r => r.path)).size, targets.length, 'Duplicate historical source-session route');
for (const target of targets) assert(session.results.some(r => r.path === target.path), `Missing historical source-session status: ${target.path}`);
assert.equal(session.results.filter(r => r.attempted).length, session.counts.attempted);
assert.equal(session.counts.attempted, 1, 'The historical source session attempted one original browser call');
assert.equal(session.results.filter(r => r.status === 'approval_rejected').length, session.counts.approval_rejected);
assert.equal(session.results.filter(r => r.status === 'not_attempted_session_policy_blocked').length, session.counts.not_attempted_session_policy_blocked);
assert.equal(session.counts.approval_rejected, 1);
assert.equal(session.counts.not_attempted_session_policy_blocked, 43);
assert(session.results.every(r => r.new_original_samples === 0), 'A rejected call supplies no original samples');
assert.equal(session.counts.new_original_samples, 0);
assert.equal(session.browser_attempt.path, '/why-oxyhealth');
assert.equal(session.browser_attempt.execution_started, false);
const placeholders = [
 '/mild-hyperbaric-chamber', '/hyperbaric-chamber-for-business', '/hyperbaric-therapy-brain-health',
 '/hyperbaric-therapy-inflammation', '/hyperbaric-therapy-long-covid', '/hyperbaric-therapy-veterinary',
 '/hyperbaric-therapy-wound-healing', '/why-oxyhealth', '/post/does-insurance-cover-hyperbaric-oxygen-therapy',
 '/post/hbot-for-pets-veterinary-hyperbaric-therapy', '/post/how-mark-andrews-used-a-hyperbaric-oxygen-chamber-in-his-injury-recovery',
];
const captured = ['/', '/hyperbarics', '/resources', '/blog', '/events/a4m-longevity-fest'];
const local = path => bg.results.filter(r => r.path === path);
const sequence = path => local(path).find(r => r.width === 1440)?.blocks.filter(b => b.topLevel).map(b => b.background).join(' → ') || '见逐段 JSON';
const compactReason = r => /Cache miss/i.test(r.reason + ' ' + JSON.stringify(r.source_result)) ? '此前只读抓取 Cache miss' : r.fetch_status === 'readable' ? '此前仅可读文本；缺原站截图和计算样式' : '此前只读响应无可读正文；缺原站截图和计算样式';
const retryLabel = () => '本轮未请求；仅本地重新构建与检查';
const rows = targets.map(target => {
 const r = attempts.find(a => a.path === target.path);
 const current = {path:target.path, attempted:false, status:run.source_status, new_original_samples:0,
   reason:'No original-source browser call was made in this local verification run. Historical approval rejections are preserved separately; this is not a new request failure.'};
 return {...r, template:target.template, placeholder:placeholders.includes(target.path),
   background_status:'unverified', color_status:'unverified', layout_status:'unverified',
   visual_reason:current.reason, current_session:current, historical_source_session:session.results.find(a => a.path === target.path), historical_retry:retry.results.find(a => a.path === target.path),
   prior_evidence_note:'Text evidence and both earlier source-browser logs are historical. The current local verification made zero original-source browser calls.',
   local_samples:local(target.path).map(p => ({width:p.width, passed:p.passed, blocks:p.blocks}))};
});
const previousChanges = sources.flatMap(source => source.changes || []);
const previousLocalChanges = run.previous_ui_changes || [{path:'/support',file:'IndependentPages.jsx',summary:'此前已修复附件数量或大小校验失败后，重置表单仍保留浏览器自定义校验错误的问题；qa-new-interactions.mjs 已覆盖重置后再次提交。本轮保留该改动。'}];
const audit = {recorded_at:new Date().toISOString(), scope:'44 routes: 28 landing pages, 15 articles, Why; includes all 11 placeholders',
 browser_attempt:null, run_record:'verification-run.json', historical_session_record:'live-source-session.json', retry_record:'live-source-retry.json', historical_browser_attempt:session.browser_attempt, previous_browser_attempt:retry.browser_attempt, previous_stylesheet_attempt:sources[0].stylesheet_attempt,
 method:retainedQA?'Local build and rebuild_check against saved captures; earlier full QA retained after verifying identical JS/CSS artifact hashes. No original-source browsing in this run.':'Local build, full QA and rebuild_check against saved captures. No original-source browsing in this run.',
 verification_run:{...run,record:'verification-run.json',historical_session_recorded_at:session.recorded_at,prior_retry_recorded_at:retry.recorded_at},
 original_visual_verified:false, source_files:sourceFiles, source_files_note:'Historical read-only evidence, retained without new retrieval.', changes:[], local_changes:run.ui_changes, previous_local_changes:previousLocalChanges, previous_changes:previousChanges,
 counts:{requested_scope:rows.length,readable:rows.filter(r=>r.fetch_status==='readable').length,unavailable:rows.filter(r=>r.fetch_status!=='readable').length,placeholders:placeholders.length,attempted:run.source_browser_calls,approval_rejected:0,not_attempted_local_verification:rows.length,new_original_samples:run.new_original_samples},
 historical_session_counts:session.counts,
 counts_note:'readable/unavailable count historical text retrievals. attempted/approval_rejected/not_attempted_local_verification/new_original_samples describe verification-run.json for this local run. Both source-session and retry logs are historical.',
 accepted_differences:'Authorized placeholder images, logos and prose plus already accepted small visual differences are preserved.', results:rows};
await write('live-source-audit.json', JSON.stringify(audit, null, 2));
const esc = value => String(value).replaceAll('|', '\\|').replaceAll('\n',' ');
const scores = rebuild.report?.match(/(\d+)% alike \(needs (\d+)%\)/);
assert(scores, 'A completed rebuild_check report is required');
const targetRows = rows.map(r => `| ${r.path} | ${retryLabel(r.current_session)} | 未验证 | 未验证 | 未验证 | ${compactReason(r)}；[旧记录](${r.record}) |`).join('\n');
const placeholderRows = placeholders.map(path => {const r=rows.find(r=>r.path===path);return `| ${path} | 未验证／保留占位 | ${retryLabel(r.current_session)}；${compactReason(r)} |`;}).join('\n');
const allRows = allRoutes.map(r=>{
 const attempt=rows.find(x=>x.path===r.path);
 const original=captured.includes(r.path)?'已验证既有采样中记录的分区背景（非本轮采样／非全像素认证）':attempt?'未验证：'+retryLabel(attempt.current_session):'未验证：沿用此前文本／用户观察，无新增视觉样本';
 return `| ${r.path} | ${r.template} | ${original} | ${local(r.path).length===3&&local(r.path).every(s=>s.passed)?'三宽度通过':'未通过'} |`;
}).join('\n');
const testRows=qa.scripts.map(x=>`| ${x.script} | ${x.passed?'通过':'失败'} | ${(x.duration_ms/1000).toFixed(1)} 秒 |`).join('\n');
const changeRows=previousChanges.map(x=>`| ${x.path} | ${esc(x.summary)} | 此前文本结构证据；精确视觉仍未验证 |`).join('\n');
const qaDescription=retainedQA?'沿用此前完整 QA，已核对本轮 JS／CSS 构建哈希完全相同；本轮没有重跑完整 QA':'本轮重新运行完整 QA';
const localChangeDescription=run.ui_changes.length?run.ui_changes.map(x=>`${esc(x.summary)}（${esc(x.file)}）`).join('\n\n'):'本轮没有新增 UI 改动，local_changes 与原站差异 changes 均为空。';
const reportingChangeDescription=run.reporting_changes?.length?run.reporting_changes.map(esc).join('\n\n'):'本轮仅更新验证记录与验收结果，未修改报告生成器。';
await write('ACCEPTANCE-REPORT.md', `# 原站采样与构建验收报告

更新时间：${audit.recorded_at}。**本轮完成本地重新构建与 rebuild_check；精确原站视觉验收仍未完成。** ${qaDescription}。本轮原站浏览器调用为 ${run.source_browser_calls} 次，新增原站样本为 ${run.new_original_samples}；44 页均未在本轮请求。此前的审批拒绝不能解释为原站不可访问，旧文本或本地 QA 也不是原站新样本。

## 本轮实际改动

${reportingChangeDescription}

独立的 [本轮验证记录](verification-run.json) 将本轮本地验证与历史原站调用分开。生成器核对 QA 完成时间及对应构建哈希，避免把旧 QA 或旧审批拒绝重标为本轮发生；已接受差异保持不变。

${localChangeDescription}

此前的 ${previousLocalChanges.length} 项界面修复保留于 previous_local_changes。本轮没有覆盖原站日志：[上次原站会话](live-source-session.json)、[更早重试](live-source-retry.json) 和四份只读记录仍保留各自的原始时间与内容。

## 保留的此前结构修正

以下 7 页修正均已在此前完成，本轮没有新增或反复调整。它们基于可读原站文字层级，不能升级为精确视觉通过。

| 页面 | 此前已完成的结构修正 | 证据边界 |
|---|---|---|
${changeRows}

此前已补的 7 个占位着陆页机器可读未验证标记、产品浅色正文修复与五个浅色 CTA 字色修复继续保留，相关历史见 [此前报告](ACCEPTANCE-REPORT-before-live-sampling.md)。

## 本轮验证范围与历史原站阻断

本轮仅进行本地构建与验证，没有提交原站浏览器调用。此前约 ${session.browser_attempt.attempted_at_approx}，Craft Anything web_site_open 请求 ${session.browser_attempt.url} 时收到自动审批拒绝，原文：**${esc(session.browser_attempt.reason)}**。这是 [历史原站会话](live-source-session.json) 的记录，该次调用未执行，不能写成本轮调用。

更早的 [重试记录](live-source-retry.json) 约 ${retry.browser_attempt.attempted_at_approx} 的拒绝也保持原样。缺少原站截图和计算样式的问题仍未解除。

| 本轮原站采样范围 | 数量 | 证据边界 |
|---|---|---|
| 待补采页面 | ${rows.length} | 28 个着陆页、15 篇文章、Why，包含全部 11 个占位页 |
| 实际尝试的浏览器调用 | ${run.source_browser_calls} | 本轮没有提交原站浏览器调用 |
| 未逐 URL 请求 | ${rows.length} | 仅本地验证；不称作本轮原站请求失败 |
| 新增原站实时样本 | ${run.new_original_samples} | 所有目标背景、精确色值与视觉布局仍未验证 |
| 此前只读证据 | ${audit.counts.readable} 页可读，${audit.counts.unavailable} 页无正文 | 历史记录，可能为缓存文本；本轮没有重新抓取 |

此前 CSS 请求不可访问、Cache miss 或无正文的记录仅作为历史证据保留，不代表本轮请求结果。完整逐页状态及本地三宽度色值见 [当前审计账本](live-source-audit.json)。

## 11 个占位页

| URL | 状态 | 本轮采样状态与历史证据 |
|---|---|---|
${placeholderRows}

## 44 个目标逐页对照

本表列出本轮“未请求”状态，并保留更早的文本证据；本轮已提交 ${run.source_browser_calls} 次原站浏览器调用。布局状态包括真实几何、网格、媒体位置和断点；历史文字层级不证明视觉布局。本轮范围见 [verification-run.json](verification-run.json)，逐页状态见 [live-source-audit.json](live-source-audit.json)；历史原站调用见 [live-source-session.json](live-source-session.json)。

| URL | 本轮原站采样状态 | 背景分段 | 精确配色 | 视觉布局 | 保留的历史证据 |
|---|---|---|---|---|---|
${targetRows}

## 本地背景盘点与保留项

${retainedQA?'沿用此前背景 QA':'本轮背景 QA 检查'}全部 ${allRoutes.length} 路由 × 1440／768／390 三宽度，共 ${bg.results.length} 个样本、${bg.comparisons.length} 项背景断言。每个分区的有效背景（含祖先继承）、文字颜色、标题均保存于 [背景 QA JSON](qa-backgrounds-results.json)。这些是本地实现值，不是原站新证据。

产品当前分区顺序为 hero → metrics → gallery → features → specifications → included/installation → compressor → advantage → FAQ → finance → brand → resource → contact。五产品沿用同一背景序列：${sequence('/products/respiro-270')}。用户观察支持 Respiro 深色首屏／浅色正文；精确白灰边界仍未验证。SourceLanding 的 index % 2 交替背景及标题规则 CTA 没有原站色值可核验，继续明确待核验，未猜测修改。

用户已接受的图片、Logo、正文占位及既有细小视觉差异保留；导航 600ms 和曲线仍为暂定值而非原站测量值。表单／聊天继续为本地预览；离线 QA 使用媒体和外站替身，不认证第三方服务。本轮没有新增原站截图，也没有将此前本地截图复述为本轮视觉检查。

## 构建、全部 QA 与 rebuild_check

重新构建成功，生成 70 个页面，覆盖根验收清单全部 61 个地址。${qaDescription}。完整 12 脚本的实际完成时间：${qa.completed_at}，${qa.scripts.filter(x=>x.passed).length}/${qa.scripts.length} 通过。

| 脚本 | 结果 | 用时 |
|---|---|---|
${testRows}

结果：[完整 QA](qa-suite-results.json)、[构建指纹](verification.json)。${retainedQA?'上表为保留的历史 QA 结果，本轮未重跑；当前构建哈希已与该次 QA 的记录逐一核对。':'上表为本轮完整 QA 结果。'}此前新增模块截图已在历史报告保留，不作为本轮新增原站视觉证据。

rebuild_check 已重新运行，相似度 **${scores[1]}%**，默认阈值 **${scores[2]}%**，${Number(scores[1])>=Number(scores[2])?'达到':'未达到'}默认阈值；原始输出见 [rebuild-check-final.json](rebuild-check-final.json)。其参考仍限于既有首页、Hyperbarics、Resources、Blog、A4M 及已采交互状态，未包含本轮 44 页新视觉样本。工具返回的 passed 字样不覆盖分数阈值，更不能认证全站；不为提高分数反复改动已接受差异。

此前记录的参考状态核对（本轮未重新核对）：capture/states/states.json 将 state-2.png 标记为第一个 FAQ 展开，但该原始截图实际显示前面的 Journey / Speak with a Hyperbaric Specialist 区块，FAQ 不在视口内；当时本地 qa-faq-1440-1.png 则显示展开的第一个 FAQ。这组截图不是相同视口状态，因此其单项低分不能直接用来判定 FAQ 布局错误。总分仍按工具原样保留，也不据此认定菜单或其他页面的视觉差异已通过。

## 全站验收表

| URL | 模板 | 原站视觉证据状态 | 本地背景 QA |
|---|---|---|---|
${allRows}

剩余问题：44 个目标的背景分段、精确配色与布局均缺少原站样本；11 个占位页仍有结构证据缺口。历史 web_site_open 在执行前被自动审批拒绝，本轮未重试，故不能宣布精确视觉收尾完成。实际可执行的原站浏览器采样或等效原始截图／计算样式才能解除该缺口。运行 node write-acceptance-report.mjs 可重新生成此报告；生成器分别引用本轮验证记录、历史原站日志和带实际时间的 QA 结果。
`);
console.log(JSON.stringify({report:'ACCEPTANCE-REPORT.md',audit:'live-source-audit.json',...audit.counts}));
