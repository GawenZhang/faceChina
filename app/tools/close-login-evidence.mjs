import fs from 'node:fs';
import {run} from './capture.mjs';

const endpoint='http://127.0.0.1:9222';
async function connect(url){
 const ws=new WebSocket(url);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
 let id=0;const pending=new Map();
 ws.onmessage=e=>{const m=JSON.parse(e.data),p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result);}};
 return {ws,send:(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));})};
}
const version=await(await fetch(endpoint+'/json/version')).json();
const browser=await connect(version.webSocketDebuggerUrl);
// An isolated context keeps the original authenticated tabs and cookies intact.
const {browserContextId}=await browser.send('Target.createBrowserContext');
const {targetId}=await browser.send('Target.createTarget',{url:'about:blank',browserContextId});
process.env.GEO_CAPTURE_TARGET=targetId;
const target=(await(await fetch(endpoint+'/json/list')).json()).find(t=>t.id===targetId);
const page=await connect(target.webSocketDebuggerUrl);
const observations=[];
try{
 for(const kind of (process.argv.includes('--source-only')?['source']:process.argv.includes('--local-only')?['local']:['source','local']))for(const width of [1440,390])for(const state of ['empty','invalid','agreement']){
  const url=kind==='source'?'https://geo136.doujia5799.top/user/index/login':'http://127.0.0.1:4173/user/index/login/';
  const actions=[{kind:'goto',url,wait_ms:1000}];
  if(state!=='empty')actions.push({kind:'fill',selector:'#username',value:'demo-invalid'},{kind:'fill',selector:'#password',value:'invalid-demo'});
  if(state==='agreement')actions.push({kind:'click',selector:'#agree_input'});
  actions.push({kind:'click',selector:kind==='source'?'.sub-btn':'.login-submit'},{kind:'wait',ms:state==='invalid'?650:150});
  const name=`login-closure/${kind}-${state}-${width}`;
  const record=run(name,actions,width,{environment:{width,height:900,locale:'en-US',timezone:'UTC',reduced_motion:true},capture:{at_end:['dom','screenshot','accessibility'],events:['page_errors']},keep_bodies:{request_body:false,response_body:false,header_values:false}});
  if(record.result?.aborted)throw new Error('Aborted '+name);
  const {result}=await page.send('Runtime.evaluate',{returnByValue:true,expression:`({url:location.href,activeElement:document.activeElement?.id,fields:['username','password'].map(id=>{const e=document.getElementById(id);return e?{id,required:e.required,valueMissing:e.validity.valueMissing,validationMessage:e.validationMessage}:null}).filter(Boolean),agreement:document.getElementById('agree_input')?.checked,messages:[...document.querySelectorAll('.layui-layer-content, .system-message h1')].map(e=>e.textContent)})`});
  const observation={kind,width,state,evidence_id:record.id,...result.value};
  fs.writeFileSync(`capture/admin/${name}/observation.json`,JSON.stringify(observation,null,2));
  observations.push(observation);console.log(JSON.stringify(observation));
 }
 fs.writeFileSync(`app/checks/login-closure-${process.argv.includes('--source-only')?'source':process.argv.includes('--local-only')?'local':'all'}.json`,JSON.stringify(observations,null,2));
}finally{page.ws.close();await browser.send('Target.disposeBrowserContext',{browserContextId});browser.ws.close();}
