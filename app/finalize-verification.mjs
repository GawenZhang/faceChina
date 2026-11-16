import assert from 'node:assert/strict';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {allRoutes} from './route-manifest.mjs';
const readJSON=async file=>JSON.parse(await readFile(file,'utf8'));
const coverage=await readJSON('qa-coverage/results.json');
const navigation=await readJSON('qa-navigation-results.json');
const suite=await readJSON('qa-suite-results.json');
const rebuild=await readJSON('rebuild-check-final.json');
const liveSource=await readJSON('live-source-audit.json');
const session=await readJSON('live-source-session.json');
const retry=await readJSON('live-source-retry.json');
const run=await readJSON('verification-run.json');
assert.equal(run.kind,'local_rebuild');
assert.equal(run.source_browser_calls,0);
assert.equal(run.new_original_samples,0);
assert(['retained_from_previous_run','rerun_this_run'].includes(run.qa.status));
const retainedQA=run.qa.status==='retained_from_previous_run';
assert.equal(run.qa.completed_at,suite.completed_at,'QA metadata must retain the actual completion time');
assert(liveSource.results.length===44&&liveSource.counts.placeholders===11,'All requested source attempts must be recorded');
assert(retry.results.length===44&&retry.counts.attempted===1&&retry.counts.not_attempted_session_policy_blocked===43,'Historical retry must retain one denied call and 43 unrequested URLs');
assert(session.results.length===44&&session.counts.attempted===1&&session.counts.approval_rejected===1&&session.counts.not_attempted_session_policy_blocked===43,'Historical source session must retain one denied call and 43 unrequested URLs');
assert(liveSource.run_record==='verification-run.json'&&liveSource.historical_session_record==='live-source-session.json'&&liveSource.retry_record==='live-source-retry.json'&&liveSource.changes.length===0,'Current run and both historical source logs must be distinct');
assert(liveSource.verification_run?.kind===run.kind&&liveSource.verification_run.source_browser_calls===run.source_browser_calls&&liveSource.verification_run.new_original_samples===run.new_original_samples,'Current audit must match the explicit verification run');
assert(session.browser_attempt.execution_started===false&&session.counts.new_original_samples===0,'Rejected source call captured no original samples');
assert.equal(liveSource.browser_attempt,null,'No current browser attempt may be inferred from historical logs');
assert.deepEqual(liveSource.historical_browser_attempt,session.browser_attempt,'Historical browser rejection must retain its original record');
assert.deepEqual(liveSource.local_changes,run.ui_changes,'Only current UI changes belong in local_changes');
assert(liveSource.results.every(r=>r.current_session.status===run.source_status&&!r.current_session.attempted),'All 44 current routes must remain unrequested');
assert(suite.passed&&navigation.passed&&coverage.passed,'Do not certify a failed QA run');
assert(suite.scripts.length===12&&suite.scripts.every(item=>item.exitCode===0),'All twelve QA scripts must finish');
const backgrounds=await readJSON('qa-backgrounds-results.json');
assert(backgrounds.passed&&backgrounds.results.length===allRoutes.length*3,'All route background checks must finish');
const artifacts={};
for(const name of await readdir('dist/assets'))artifacts[name]=createHash('sha256').update(await readFile('dist/assets/'+name)).digest('hex');
assert.deepEqual(artifacts,run.qa.artifacts,'Current bundles differ from the recorded QA build; rerun QA before updating verification');
const scores=rebuild.report.match(/(\d+)% alike \(needs (\d+)%\)/);
assert(scores,'A completed rebuild_check score and threshold are required');
const score=Number(scores?.[1]),target=Number(scores?.[2]);
await writeFile('verification.json',JSON.stringify({
 date:new Date().toISOString(),production_build:'passed',verification_run:run,generated_pages:allRoutes.length,checklist_urls:navigation.checklist.length,
 representative_checks:coverage.representatives.length,route_checks:coverage.routes.length,entry_flow_checks:coverage.entries.length,
 coverage_passed:coverage.passed,navigation_passed:navigation.passed,
 navigation_checks:{route_scans:navigation.scans.length,entry_flows:navigation.entries.length,external_flows:navigation.externalEntries.length,fragment_checks:navigation.fragments.length,semantic_checks:navigation.semantics.length,report:'qa-navigation-results.json'},
 qa_suite:{passed:suite.passed,status:run.qa.status,completed_at:suite.completed_at,artifacts_match:true,scripts:suite.scripts.map(({script,exitCode,passed})=>({script,exitCode,passed})),report:'qa-suite-results.json'},
 widths:[1440,768,390],runtime_errors:[...coverage.errors,...navigation.errors],runtime_errors_source:run.qa.status,remote_media_in_offline_tests:'stubbed',
 visual_similarity_percent:score,visual_target_percent:target,visual_target_met:score>=target,
 rebuild_check_scope:'Previously captured homepage and four existing routes/states; not all 70 routes',
 rebuild_check_report:'rebuild-check-final.json',artifacts,local_changes:liveSource.local_changes||[],previous_local_changes:liveSource.previous_local_changes||[],
 live_source_audit:{report:'live-source-audit.json',recorded_at:liveSource.recorded_at,verification_run:liveSource.verification_run,counts:liveSource.counts,counts_note:liveSource.counts_note,original_visual_verified:false,browser_failure:session.browser_attempt.reason,browser_failure_is_historical:true,browser_attempt:null,historical_browser_attempt:session.browser_attempt,changes:[],previous_changes:liveSource.previous_changes,historical_session_record:'live-source-session.json',historical_session_counts:session.counts,retry_record:'live-source-retry.json',retry_counts:retry.counts,retry_is_historical:true,previous_read_only_records:liveSource.source_files},
 limitations:[`This local verification run made ${run.source_browser_calls} original-source browser calls and captured ${run.new_original_samples} new original samples. Both live-source-session.json and live-source-retry.json retain earlier approval rejections; none is a new request failure.`, retainedQA?`The full twelve-script QA is retained from ${suite.completed_at}; it was not rerun this time. Current JS/CSS artifact hashes match its recorded build.`:`The full twelve-script QA was rerun and completed at ${suite.completed_at}.`, 'The 33 readable and 11 unavailable text results are historical evidence, not current retrievals. All 44 target background/color/layout comparisons remain unverified.', 'Navigation direction follows user observation; 600ms / cubic-bezier(0.22,1,0.36,1) are provisional, not extracted original timing.', 'Unavailable original routes remain explicitly provisional; see historical live-source-session.json and ACCEPTANCE-REPORT.md.', `Existing accepted visual differences retained; automatic visual score ${score>=target?'meets':'remains below'} its default threshold within the saved reference scope.`, 'External navigation tests stub destinations; live third-party services are not certified.', 'Preview forms/chat have no backend; remote images/font need network access.'],
 background_audit:{report:'qa-backgrounds-results.json',qa_status:run.qa.status,page_samples:backgrounds.results.length,checks:backgrounds.comparisons.length,passed:backgrounds.passed,original_all_site_verified:false,limitations:'This local run captured no new raw source HTML/CSS or original screenshots; previous browser rejections remain historical. Product light-body fix is retained from an earlier user observation; other template exact sequences remain unverified.'},
 reference_records:['navigation-motion-audit.json','inspection/products-current/audit.json','inspection/independent-current/audit.json','evidence-extended-current/audit.json','inspection/backgrounds-products/audit.json','inspection/backgrounds-independent/audit.json','inspection/backgrounds-extended/audit.json'],
 report:rebuild.report,
},null,2));
console.log('Updated verification from completed QA results and current build fingerprints');
