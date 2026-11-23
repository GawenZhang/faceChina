import fs from 'node:fs';
process.env.GEO_CAPTURE_TARGET=JSON.parse(fs.readFileSync('capture/admin/extra-state-target.json','utf8'));const {run}=await import('./capture.mjs');
const coverage=JSON.parse(fs.readFileSync('capture/admin/interaction-coverage.json','utf8'));const report=[];
for(const key of ['b2b','webmedia','zimedia']){
 const original=coverage.find(r=>r.key===key&&r.width===1440);const controls=original.states.filter(s=>s.modal);
 run('states/special-'+key+'-ready',[{kind:'goto',url:'https://geo136.doujia5799.top/user/'+key+'?addtabs=1',wait_ms:2000},{kind:'wait',ms:7000}],1440,{action_timeout_ms:20000,capture:{at_end:['dom']}});
 for(let i=0;i<controls.length;i++){
  const c=controls[i];const actions=[];
  if(key==='b2b')actions.push({kind:'press',selector:'.btn-outline',key:i>=5?'End':'Home'},{kind:'wait',ms:250});
  actions.push({kind:'click',selector:c.selector},{kind:'wait',ms:2800});
  let name='states/special-'+key+'-'+i+'-1440';let e=run(name,actions,1440,{action_timeout_ms:20000});
  if(!e.result?.final_artifacts?.dom?.text?.includes('layui-layer-iframe'))e=run(name,[{kind:'wait',ms:2500}],1440,{action_timeout_ms:20000});
  const opened=e.result?.final_artifacts?.dom?.text?.includes('layui-layer-iframe');report.push({key,width:1440,selector:c.selector,name,evidence_id:e.id,status:opened?'complete':'missing-dialog',opening_width:1440});
  if(opened){name='states/special-'+key+'-'+i+'-390';const mobile=run(name,[{kind:'wait',ms:600}],390,{action_timeout_ms:20000});report.push({key,width:390,selector:c.selector,name,evidence_id:mobile.id,status:mobile.result?.final_artifacts?.dom?.text?.includes('layui-layer-iframe')?'complete':'missing-dialog',opening_width:1440,note:'Original control lies outside narrow viewport; opened at 1440 then observed responsive dialog at 390.'});run('states/special-'+key+'-'+i+'-closed',[{kind:'click',selector:'.layui-layer-close'},{kind:'wait',ms:500}],1440,{action_timeout_ms:20000,capture:{at_end:['dom']}});}
  fs.writeFileSync('capture/admin/interaction-special.json',JSON.stringify(report,null,2));
 }
}
console.log('SPECIAL_SOURCE_DONE',report.length);
