import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=relative=>JSON.parse(fs.readFileSync(new URL(relative,import.meta.url),'utf8'));
const report=read('checks/login-closure.json');
assert.equal(report.rows.length,6);
assert.equal(new Set(report.rows.map(r=>r.state+'/'+r.width)).size,6);
for(const row of report.rows){
 const records=['source','local'].map(kind=>read(`../capture/admin/login-closure/${kind}-${row.state}-${row.width}/record.json`));
 const observations=['source','local'].map(kind=>read(`../capture/admin/login-closure/${kind}-${row.state}-${row.width}/observation.json`));
 for(const [index,r] of records.entries()){
  assert.equal(r.result.aborted,null);assert.ok(r.result.steps.every(s=>s.status==='ok'));
  assert.equal(r.result.environment.requested.width,row.width);
  assert.equal(r.result.events.items.filter(e=>e.kind==='page-error').length,0);
  assert.equal(r.id,row.evidenceIds[index]);
 }
 assert.equal(records[1].result.network.requests.filter(r=>r.method==='POST'||r.url.startsWith('https://geo136')).length,0);
 if(row.state==='empty')for(const o of observations){assert.equal(o.activeElement,'username');assert.equal(o.fields.length,2);assert.ok(o.fields.every(f=>f.required&&f.valueMissing&&f.validationMessage==='请填写此字段。'));}
 if(row.state==='agreement')for(const o of observations){assert.equal(o.agreement,false);assert.ok(o.messages.includes('请阅读并勾选用户协议'));assert.ok(o.fields.every(f=>!f.valueMissing));}
 if(row.state==='invalid'){
  assert.ok(observations[0].messages.includes('用户名不正确'));
  assert.ok(observations[1].messages.includes('演示账号或密码错误'));
  assert.equal(records[0].result.network.requests.filter(r=>r.method==='POST'&&r.status===200).length,1);
  assert.equal(row.status,'已验证（保留差异）');assert.ok(row.reason.includes('不认定视觉等价'));
 }else{
  assert.equal(records[0].result.network.requests.filter(r=>r.method==='POST').length,0);
  assert.ok(row.comparison.perceptual_similarity>=.98);assert.equal(row.status,'已验证');
 }
 console.log(`PASS login ${row.state} ${row.width}: source/local evidence and explicit difference classification`);
}
