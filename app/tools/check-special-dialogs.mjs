import fs from 'node:fs';import {createHash} from 'node:crypto';
const tab=await(await fetch('http://127.0.0.1:9222/json/new?'+encodeURIComponent('http://127.0.0.1:4173/backend-pages/b2b.html'),{method:'PUT'})).json();process.env.GEO_CAPTURE_TARGET=tab.id;const {run}=await import('./capture.mjs');
const hash=createHash('sha256').update(fs.readFileSync('app/dist/admin-runtime.js')).update(fs.readFileSync('app/dist/backend-interactions.json')).digest('hex');
const source=JSON.parse(fs.readFileSync('capture/admin/interaction-special.json','utf8'));const results=[];
for(const x of source.filter(x=>x.width===1440&&x.status==='complete')){
 let selector=x.opening_selector||x.selector;
 if(x.key==='b2b'&&!x.selector.includes('configure')&&!selector.includes('#settle')&&!selector.endsWith(' button'))selector+=' button';
 const actions=[{kind:'goto',url:'http://127.0.0.1:4173/backend-pages/'+x.key+'.html',wait_ms:800},{kind:'wait',ms:400}];
 if(x.key==='b2b')actions.push({kind:'press',selector,key:'Shift'},{kind:'wait',ms:200});
 actions.push({kind:'click',selector},{kind:'wait',ms:1200});
 let name='local-states/special-'+x.key+'-'+results.length+'-1440';const e=run(name,actions,1440,{action_timeout_ms:10000});const ok=e.result?.final_artifacts?.dom?.text?.includes('layui-layer-iframe');
 results.push({key:x.key,width:1440,selector:x.selector,name,source:x.name,evidence_id:e.id,buildHash:hash,status:ok?'complete':'missing-dialog',errors:e.result?.events?.items});
 if(ok){name=name.replace('-1440','-390');const m=run(name,[{kind:'wait',ms:800}],390,{action_timeout_ms:10000});results.push({key:x.key,width:390,selector:x.selector,name,source:source.find(y=>y.key===x.key&&y.selector===x.selector&&y.width===390)?.name,evidence_id:m.id,buildHash:hash,status:m.result?.final_artifacts?.dom?.text?.includes('layui-layer-iframe')?'complete':'missing-dialog',errors:m.result?.events?.items});}
 fs.writeFileSync('app/checks/interaction-special.json',JSON.stringify(results,null,2));
}
console.log('LOCAL_SPECIAL_DONE',results.length);
