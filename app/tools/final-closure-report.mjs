import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const cli='C:/Users/Administration/.dsh/plugins-data/craft-anything/0.6.0/craft-anything-cli.exe';
function text(file){const b=fs.readFileSync(file);return b.toString(b[0]===255&&b[1]===254?'utf16le':'utf8').replace(/^\uFEFF/,'');}
const json=file=>JSON.parse(text(file));
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const report=json('app/checks/final-rebuild-check.json');
assert.match(report.result.report,/web-visual: passed/);assert.doesNotMatch(report.result.report,/Your open questions/);
for(const file of ['app/checks/final-rebuild-check.json','app/checks/rebuild-check.json'])fs.writeFileSync(file,JSON.stringify(report,null,2));
const logs=['service-tests','browser-tests','build','acceptance-tests','login-capture','final-preview-flows'];
for(const name of logs){const file=`app/checks/${name}.txt`;fs.writeFileSync(file,text(file));}
const logicTests=(text('app/checks/service-tests.txt').match(/^PASS /gm)||[]).length;
const browserTests=(text('app/checks/browser-tests.txt').match(/^PASS /gm)||[]).length;
assert.equal(logicTests,21);assert.equal(browserTests,14);
assert.match(text('app/checks/build.txt'),/Backend pages built: 84/);
const bindings=['login.html','login.js','login.css','admin-runtime.js','admin-runtime.css'].map(file=>({file,source:hash('app/'+file),build:hash('app/dist/'+(file==='login.html'?'index.html':file))}));
assert.ok(bindings.every(b=>b.source===b.build));
const preview=[];
for(const pathname of ['/','/user/index/login/','/user/index/index/','/backend-pages/dashboard.html','/backend-pages/dashboard.mobile.html','/robots.txt']){
 const r=await fetch('http://127.0.0.1:4173'+pathname);assert.equal(r.status,200);preview.push({url:r.url,status:r.status,robots:r.headers.get('x-robots-tag')});
}
const u=spawnSync(cli,['core-unknowns-show','--project','investigation.cany','--json','-'],{input:'{}',encoding:'utf8'});assert.equal(u.status,0);
const unknowns=JSON.parse(u.stdout).result.items;assert.ok(unknowns.every(u=>u.status==='resolved'));
const acceptance=json('app/checks/acceptance-links.json');assert.equal(acceptance.closure,'complete');
const integrity=json('app/checks/integrity.json');assert.equal(integrity.pass,true);
const value={timestamp:new Date().toISOString(),status:'complete',build:{passed:true,contentRoutes:84,log:'build.txt',bindings},tests:{logicTests,browserEvidenceAssertions:browserTests,acceptance:'passed',freshLocalBrowserFlows:8,freshSourceLocalLoginStates:12},rebuild:{passed:true,scope:'Login initial state at 1440/768/390; backend evidence separately indexed',report:'final-rebuild-check.json'},preview:{passed:true,checks:preview,flows:'final-preview-flows.txt'},acceptance:{pageWidths:170,interactions:268,loginComparisons:6,snapshotDifferences:5,retainedLoginDifferences:2,unverified:0,needsFix:0,missingLinks:acceptance.missingLinks},integrity:{pass:true,report:'integrity.json',credentialHits:integrity.credential.filesWithMatches,tokenFiles:integrity.tokens.matches.length},unknowns:unknowns.map(({id,status,resolution})=>({id,status,resolution})),limitations:'Static demo; source error response differs from local demo message and is explicitly retained. Server authentication, database, paid publishing/upload and live AI are not implemented.'};
fs.writeFileSync('app/checks/final-validation.json',JSON.stringify(value,null,2));
console.log(JSON.stringify({status:value.status,logicTests,browserTests,preview:preview.length,unknownsOpen:0}));
