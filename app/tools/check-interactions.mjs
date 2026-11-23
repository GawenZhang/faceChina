import fs from 'node:fs';import {createHash} from 'node:crypto';const buildHash=createHash('sha256').update(fs.readFileSync('app/dist/admin-runtime.js')).update(fs.readFileSync('app/dist/backend-interactions.json')).digest('hex');
const target=await (await fetch('http://127.0.0.1:9222/json/new?'+encodeURIComponent('http://127.0.0.1:4173/backend-pages/dashboard.html'),{method:'PUT'})).json();
process.env.GEO_CAPTURE_TARGET=target.id;const {run}=await import('./capture.mjs');
const source=JSON.parse(fs.readFileSync('capture/admin/interaction-coverage.json','utf8'));
const file='app/checks/interaction-coverage'+(process.env.REPORT_SUFFIX?'-'+process.env.REPORT_SUFFIX:'')+'.json';let results=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):[];
const cases=source.filter(r=>r.status==='complete');for(const r of cases.slice(+(process.env.START_RECORD||0),+(process.env.END_RECORD||cases.length))){
 if(results.some(x=>x.key===r.key&&x.width===r.width&&x.status==='complete'&&x.buildHash===buildHash))continue;
 const actions=[{kind:'goto',url:'http://127.0.0.1:4173/backend-pages/'+r.key+'.html',wait_ms:800},{kind:'wait',ms:700}];const states=[];
 for(const c of r.states){actions.push({kind:'click',selector:c.selector},{kind:'wait',ms:c.modal?1200:350});states.push({...c,step:actions.length-1});if(c.modal)actions.push({kind:'click',selector:'.layui-layer-close'},{kind:'wait',ms:450});else if(c.close)actions.push({kind:'click',selector:c.close});}
 const name='local-states/'+r.key+'-interactive-'+r.width;
 try{const e=run(name,actions,r.width,{action_timeout_ms:10000,capture:{after_each_step:['dom','screenshot'],at_end:['dom','screenshot'],events:['page_errors']}});results=results.filter(x=>x.key!==r.key||x.width!==r.width);results.push({buildHash,key:r.key,width:r.width,name,evidence_id:e.id,source:r.name,source_evidence_id:r.evidence_id,states,status:e.result?.aborted?'partial':'complete',aborted:e.result?.aborted,errors:e.result?.events?.items});}catch(error){results.push({key:r.key,width:r.width,error:error.message.slice(0,150)});}
 fs.writeFileSync(file,JSON.stringify(results,null,2));
}
console.log('Local state pass completed',results.length);
