import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=name=>JSON.parse(fs.readFileSync(new URL('../capture/admin/'+name+'/record.json',import.meta.url),'utf8'));
for(const width of [1440,390]){
const suffix=width===390?'-390':'';
const login=read('local-flow-login'+suffix);assert.equal(login.result.aborted,null);assert.ok(/\/user\/index\/index|\/backend-pages\/shell\.mobile\.html/.test(login.result.steps.at(-1).url));
assert.ok(login.result.final_artifacts.dom.text.includes('main-sidebar'),'Login '+width+' must show the backend shell');
assert.equal(login.result.events.items.filter(e=>e.kind==='page-error').length,0);
for(const op of ['generate','detect','analyze']){
 const r=read('local-ai-'+op+suffix);assert.equal(r.result.aborted,null);assert.ok(r.result.final_artifacts.dom.text.includes('AI 服务尚未接入'),op+' '+width+' must visibly report the unconfigured AI stub');
 assert.equal(r.result.events.items.filter(e=>e.kind==='page-error').length,0);
 assert.equal(r.result.network.requests.filter(e=>e.url.startsWith('https://geo136')).length,0);
 console.log('PASS '+op+' '+width+' browser UI uses unified stub without original API calls');
}
console.log('PASS '+width+' demo browser login reaches sampled backend shell');
}
