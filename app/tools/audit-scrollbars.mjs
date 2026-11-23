import fs from 'node:fs';import {run} from './capture.mjs';
const results=[];
for(const [side,url] of [['source','https://geo136.doujia5799.top/user/article_type?addtabs=1'],['local','http://127.0.0.1:4173/backend-pages/article_type.mobile.html']]){
 const tab=await (await fetch('http://127.0.0.1:9222/json/new?about:blank',{method:'PUT'})).json();process.env.GEO_CAPTURE_TARGET=tab.id;
 const evidence=run('scrollbar-audit/'+side+'-390',[{kind:'goto',url,wait_ms:3000},{kind:'wait',ms:1200}],390);
 const ws=new WebSocket(tab.webSocketDebuggerUrl);await new Promise(resolve=>ws.onopen=resolve);let i=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}};
 const send=(method,params={})=>new Promise(resolve=>{const id=++i;pending.set(id,resolve);ws.send(JSON.stringify({id,method,params}));});
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:900,deviceScaleFactor:1,mobile:false});await new Promise(resolve=>setTimeout(resolve,500));
 const data=await send('Runtime.evaluate',{expression:`JSON.stringify(Array.from(document.querySelectorAll('.fixed-table-body')).map(el=>({clientWidth:el.clientWidth,offsetWidth:el.offsetWidth,scrollWidth:el.scrollWidth,clientHeight:el.clientHeight,offsetHeight:el.offsetHeight,scrollHeight:el.scrollHeight,overflow:getComputedStyle(el).overflow,pseudo:{display:getComputedStyle(el,'::-webkit-scrollbar').display,width:getComputedStyle(el,'::-webkit-scrollbar').width,height:getComputedStyle(el,'::-webkit-scrollbar').height}})))`,returnByValue:true});
 results.push({side,evidence:evidence.id,measurements:JSON.parse(data.result.result.value)});fs.writeFileSync('app/checks/scrollbar-audit.json',JSON.stringify(results,null,2));ws.close();
}
console.log(JSON.stringify(results,null,2));
