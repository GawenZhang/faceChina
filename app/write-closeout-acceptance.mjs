import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {allRoutes} from './route-manifest.mjs';
const root=fileURLToPath(new URL('./',import.meta.url));
const read=async name=>JSON.parse(await fs.readFile(path.join(root,name),'utf8'));
const old=await read('live-source-audit.json'),captures=await read('live-captures-20261113.json');
const qa=await read('qa-suite-results.json'),live=await read('qa-live-source-results.json'),geometry=await read('qa-captured-geometry-results.json');
const rebuild=await read('rebuild-check-20261113.json');
const build=await read('build-result-20261113.json');
const historical=new Set(['/','/hyperbarics','/resources','/blog','/events/a4m-longevity-fest']);
const scope=new Set(old.results.map(x=>x.path));
const assets={};
for(const file of await fs.readdir(path.join(root,'dist/assets')))if(/\.(js|css)$/.test(file))assets[file]=crypto.createHash('sha256').update(await fs.readFile(path.join(root,'dist/assets',file))).digest('hex');
if(build.exit_code!==0||JSON.stringify(assets)!==JSON.stringify(build.assets))throw new Error('Build artifacts differ from the verified production build');
if(captures.count!==44||geometry.checked_routes!==44||live.results.length!==132||!qa.completed_at||qa.scripts.length!==15)throw new Error('Incomplete final verification data');
if(!qa.passed||!qa.scripts.every(x=>x.passed)||!live.passed||!geometry.passed)throw new Error('Final checks must pass before closing acceptance');
for(const entry of old.results){
 for(const checks of [live.results,geometry.results]){
  const selected=checks.filter(x=>x.path===entry.path);
  if(selected.length!==3||selected.some(x=>!x.passed)||selected.map(x=>x.width).sort((a,b)=>a-b).join()!=='390,768,1440')throw new Error('Incomplete width coverage: '+entry.path);
 }
}
const results=old.results.map(entry=>{
 const capture=captures.results.find(c=>c.path===entry.path),checks=live.results.filter(c=>c.path===entry.path);
 const passed=checks.length===3&&checks.every(c=>c.passed)&&geometry.passed;
 return {path:entry.path,template:entry.template,was_placeholder:entry.placeholder,status:passed?'已验证':'待修复',background:passed?'三宽通过':'待修复',layout:passed?'三宽通过':'待修复',capture_evidence:capture.capture_evidence,source:'inspection/live-20261113/'+entry.path.slice(1).replaceAll('/','__')+'/capture.json',checks:checks.map(c=>({width:c.width,passed:c.passed,failures:c.failures})),screenshot_cut_widths:capture.screenshots.filter(s=>s.cut).map(s=>s.css_width)};
});
const verified=results.filter(x=>x.status==='已验证').length;
const reportText=rebuild.report||rebuild.result?.report||'';
const score=Number(reportText.match(/(\d+)% alike/)?.[1]||0)||null;
const verification={recorded_at:new Date().toISOString(),scope:'44 target pages: 28 landing pages, 15 articles, why-oxyhealth; 11 prior placeholders are a subset.',build:{passed:true,static_pages:allRoutes.length,checklist_urls:61,assets},source_capture:{index:'live-captures-20261113.json',pages:captures.count,screenshots:captures.results.reduce((n,r)=>n+r.screenshots.length,0),widths:[1440,768,390]},qa:{passed:qa.passed,completed_at:qa.completed_at,script_count:qa.scripts.length,report:'qa-suite-results.json'},source_comparison:{passed:live.passed,checks:live.results.length,geometry_passed:geometry.passed,report:'qa-live-source-results.json',geometry_report:'qa-captured-geometry-results.json'},rebuild_check:{score_percent:score,target_percent:90,meets_threshold:score!==null&&score>=90,report:'rebuild-check-20261113.json',scope:'Five historical reference pages and saved states; does not score the new 44-page capture set.'},accepted_differences:['Images, logos and copy may be placeholders; retain dimensions, hierarchy and reasonable line counts.','Previously accepted shared header/footer and small visual differences remain unchanged.','Local forms do not send information; captcha is a same-size preview placeholder.'],verified_targets:verified,remaining_targets:44-verified,results};
await fs.writeFile(path.join(root,'closeout-verification.json'),JSON.stringify(verification,null,2)+'\n');
// Keep the canonical verification entry current without erasing its history.
try{await fs.access(path.join(root,'verification-before-20261113.json'));}catch{await fs.copyFile(path.join(root,'verification.json'),path.join(root,'verification-before-20261113.json'));}
await fs.writeFile(path.join(root,'verification.json'),JSON.stringify({...verification,previous_verification:'verification-before-20261113.json'},null,2)+'\n');
const rows=results.map((r,i)=>`| ${i+1} | ${r.path} | ${r.template} | ${r.was_placeholder?'是，已补齐源结构':'否'} | ${r.background} | ${r.layout} | ${r.status} | [原站证据](${r.source}) |`).join('\n');
const qaRows=qa.scripts.map(s=>`| ${s.script} | ${s.passed?'通过':'失败'} | ${(s.duration_ms/1000).toFixed(1)} 秒 |`).join('\n');
const outside=allRoutes.filter(r=>!scope.has(r.path)).map(r=>`| ${r.path} | ${historical.has(r.path)?'已验证既有分区背景；保留用户已接受差异':'未增加原站实采；保留上轮证据状态，不由本轮核销'} |`).join('\n');
const cuts=results.filter(r=>r.screenshot_cut_widths.length).map(r=>r.path).join('、');
const text=`# 验收报告 — 2026-11-13 实时采样收尾

本轮原站采样权限已恢复：44/44 个目标均实时打开并保存 1440、768、390 三种屏宽的截图、完整 DOM、分区布局与颜色记录，共 132 张原站截图。44 = 28 个着陆页 + 15 篇文章 + /why-oxyhealth；此前 11 个占位页是其中的子集（7 个着陆页、3 篇文章、Why），不重复计数。

当前逐项结果：**已验证 ${verified}/44，待修复 ${44-verified}/44**。这里“已验证”指本次要求的背景分段、配色、布局、尺寸与文字层级核对；素材占位、此前已接受差异保持原协议，不宣称全像素一致。完整 QA ${qa.scripts.filter(s=>s.passed).length}/${qa.scripts.length}，70 个静态页构建成功，61 个清单 URL 全覆盖。

## 修改与依据

- 28 个着陆页恢复各自原站内容分段、背景顺序、网格、容器宽度、响应断点和标题/正文层级，替换此前猜测模板；咨询按钮、FAQ、cost 表单及 practice 原生弹窗保持本地可用。
- 15 篇文章逐页恢复封面/正文/FAQ/引用/相关链接/结尾 CTA 的实际结构，保留文字行数和媒体比例；验证 48 个按钮 FAQ、9 个原生折叠区与目录锚点。
- Why 恢复 9 个分区、黑金配色、5 段时间线、19,000 计数、6 张资质滚动卡、7 项 FAQ 和 CTA，并检查桌面滚动与减弱动画分支。
- 样式仅作用于新采样页面，原公共导航、页脚及已接受差异不反复改动；原站脚本、跟踪与外部提交不随 DOM 导入。

原站总索引：[live-captures-20261113.json](live-captures-20261113.json)。实施阶段核对快照：[着陆页](landing-review.json)、[文章](article-review.json)、[Why](inspection/live-20261113/why-review.json)；其中的“等待最终 QA”描述属于实施阶段，最终状态以 [closeout-verification.json](closeout-verification.json) 的构建指纹及逐项结果为准。历史报告保存在 [ACCEPTANCE-REPORT-before-20261113.md](ACCEPTANCE-REPORT-before-20261113.md)，其中“审批阻断/未验证”是历史状态。

## 44 个目标逐项核销

| # | URL | 类型 | 原占位页 | 背景/配色 | 布局/层级 | 核销结果 | 实时依据 |
|---|---|---|---|---|---|---|---|
${rows}

## 完整 QA 与构建

QA 开始：${qa.started_at}；完成：${qa.completed_at}。以下均为本轮重新运行，不沿用旧 QA。

| 脚本 | 结果 | 耗时 |
|---|---|---|
${qaRows}

[完整 QA 输出](qa-suite-results.json)；[44 页 × 三宽实采分区、背景、padding、宽度、字号与层级对照](qa-live-source-results.json)；[原始 CSS 对隔离 CSS 的逐元素几何及颜色对照](qa-captured-geometry-results.json)。全部页面导航、刷新、返回及已有交互回归保留，源目录与 FAQ 测试已从旧占位模板改为当前原站真实语义。

## rebuild_check

本轮重新运行，分数 **${score??'未返回'}%**，默认目标 **90%**，${score!==null&&score>=90?'已达到':'未达到'}默认目标；原始输出：[rebuild-check-20261113.json](rebuild-check-20261113.json)。该工具仍只对既有首页、Hyperbarics、Resources、Blog、A4M 与保存的交互状态评分；新 44 页由上面的实时证据及独立三宽 QA 核对。工具分数不替代逐项验收，也不据此反复修改用户已接受差异。

## 验证边界与素材规则

原站完整 DOM 与计算布局覆盖页面尾部，但截图工具最高保存 20,000 像素，以下 ${results.filter(r=>r.screenshot_cut_widths.length).length} 页的 390 宽长截图被截断：${cuts}。这些页的尾部分区继续由完整 DOM、实采布局记录和源样式三宽几何对照核对；截图裁切不是页面缺失。原站的滚入动画会让未滚入区块在单张截图中暂时不可见，本地静态内容保持可读，Why 专门恢复滚动状态。

几何对照使用同一份净化 DOM，比较原始 CSS 与隔离 CSS 在相同离线媒体环境中的表现，证明样式隔离保留几何与配色；它不是完整应用对实时原站的逐像素比较。实采布局 QA 独立比对分区、背景、padding、宽度、标题字号及层级，未逐项断言所有分区高度/y 坐标和每段实际行数；这些由原站 DOM、原样式与媒体比例保留，并进行代表截图检查。

离线 QA 对图片使用等比例占位，对字体采用一致环境，核对布局而非媒体内容；原站 Windows 滚动条与本地 overlay 滚动条可能有最多 15px 内容宽度差及少量换行差。图片/Logo/文字允许占位，布局尺寸、层级、行数及必要媒体比例保留。表单为本地预览；此前已接受的公共组件差异保持不变。

## 本轮范围外页面（不冒充新增核销）

| URL | 保留状态 |
|---|---|
${outside}

可运行 node write-acceptance-report.mjs 用当前实采与最终检查重新生成本报告；该入口不再回写旧的审批阻断记录。
`;
await fs.writeFile(path.join(root,'ACCEPTANCE-REPORT.md'),text);
console.log(JSON.stringify({verified,remaining:44-verified,qa:qa.passed,scripts:qa.scripts.length,rebuildScore:score,report:'ACCEPTANCE-REPORT.md'}));
