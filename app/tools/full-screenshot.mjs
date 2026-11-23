import fs from 'node:fs';
import path from 'node:path';
const tabs=await (await fetch('http://127.0.0.1:9222/json/list')).json();
const target=(process.env.GEO_CAPTURE_TARGET ? tabs.find(t=>t.id===process.env.GEO_CAPTURE_TARGET) : null)||tabs.find(t=>t.type==='page'&&/geo136|127\.0\.0\.1:4173/.test(t.url))||tabs.find(t=>t.type==='page');
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej});let id=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result)}};
const send=(method,params={})=>new Promise((resolve,reject)=>{const i=++id;pending.set(i,{resolve,reject});ws.send(JSON.stringify({id:i,method,params}));});
const width=+(process.argv[3]||1440);
const sourceCapture=process.env.GEO_SOURCE_CAPTURE==='1';
let expectedModules=[],expectedLinks=0;
if(sourceCapture){
 await send('Page.bringToFront');
 const reference=process.env.GEO_CAPTURE_REFERENCE||path.join(path.dirname(process.argv[2]),'final.html');
 if(fs.existsSync(reference)){
  const html=fs.readFileSync(reference,'utf8').replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi,'$1</script>').replace(/<!--[\s\S]*?-->/g,'');
  expectedModules=[...new Set([...html.matchAll(/<script\b[^>]*\bdata-requiremodule="([^"]+)"/g)].map(m=>m[1]))];
  expectedLinks=[...html.matchAll(/<link\b[^>]*>/g)].length;
 }
 if(process.env.GEO_REQUIRE_FORM==='1')expectedModules=[...new Set([...expectedModules,'form','validator'])];
}
await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'},{name:'prefers-color-scheme',value:'light'}]});
const readyStart=Date.now();
const settleMs=Number(process.env.GEO_CAPTURE_SETTLE_MS || (target.url.startsWith('http://127.0.0.1:4173')?500:3000));
await new Promise(resolve=>setTimeout(resolve,settleMs));
let visibleLoading=0,missingModules=[],missingLinks=0,actualModules=[],actualLinks=0,validatorForms=0,missingFormInitialization=false,runtimeState=null,runtimePending=false;
do {
 const {root}=await send('DOM.getDocument');
 const {nodeIds}=await send('DOM.querySelectorAll',{nodeId:root.nodeId,selector:'.fixed-table-loading, .layui-table-init, .layui-layer-loading'});
 visibleLoading=0;
 for(const nodeId of nodeIds){try{const {model}=await send('DOM.getBoxModel',{nodeId});if(model.width>0&&model.height>0)visibleLoading++;}catch{}}
 if(sourceCapture){
  const scripts=await send('DOM.querySelectorAll',{nodeId:root.nodeId,selector:'script[data-requiremodule]'});
  const modules=[];
  for(const nodeId of scripts.nodeIds){const {attributes}=await send('DOM.getAttributes',{nodeId});for(let i=0;i<attributes.length;i+=2)if(attributes[i]==='data-requiremodule')modules.push(attributes[i+1]);}
  missingModules=expectedModules.filter(name=>!modules.includes(name));
  actualModules=modules;
  const links=await send('DOM.querySelectorAll',{nodeId:root.nodeId,selector:'link'});
  actualLinks=links.nodeIds.length;
  missingLinks=Math.max(0,expectedLinks-links.nodeIds.length);
  const validators=await send('DOM.querySelectorAll',{nodeId:root.nodeId,selector:'form.nice-validator'});
  validatorForms=validators.nodeIds.length;
  missingFormInitialization=process.env.GEO_STRICT_VALIDATOR==='1'&&!validatorForms;
  const runtime=await send('Runtime.evaluate',{returnByValue:true,expression:'({ready:document.readyState,fontStatus:document.fonts?document.fonts.status:"loaded",defined:typeof requirejs!=="undefined"?Object.keys(requirejs.s.contexts._.defined):[],pending:typeof requirejs!=="undefined"?Object.keys(requirejs.s.contexts._.registry).filter(function(k){return requirejs.s.contexts._.registry[k].enabled&&!requirejs.s.contexts._.registry[k].defined}):[]})'});
  runtimeState=runtime.result.value;
  runtimePending=runtimeState.ready!=='complete'||runtimeState.pending.length>0||runtimeState.fontStatus==='loading';
 }
 if(!visibleLoading&&!missingModules.length&&!missingLinks&&!missingFormInitialization&&!runtimePending)break;
 if(Date.now()-readyStart>50000)throw new Error('Page readiness timeout: loading='+visibleLoading+' missing modules='+missingModules.join(',')+' missing styles='+missingLinks+' missing initialized form='+missingFormInitialization+' runtime pending='+JSON.stringify(runtimeState?.pending));
 await new Promise(resolve=>setTimeout(resolve,1000));
}while(true);
await new Promise(resolve=>setTimeout(resolve,500));
if(process.argv.includes('--mask-account')){
 const {root}=await send('DOM.getDocument');const {nodeId}=await send('DOM.querySelector',{nodeId:root.nodeId,selector:'#username'});
 if(nodeId)await send('DOM.setAttributeValue',{nodeId,name:'style',value:'color:transparent!important;text-shadow:none!important'});
}
const met=await send('Page.getLayoutMetrics');const size=met.cssContentSize||met.contentSize;const height=Math.min(60000,Math.max(900,Math.ceil(size.height)));
const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height,scale:1}});
fs.writeFileSync(process.argv[2],Buffer.from(shot.data,'base64'));fs.writeFileSync(process.argv[2]+'.json',JSON.stringify({width,height,fullHeight:size.height,clipped:size.height>60000,viewportApplied:true,readiness:{waitedMs:Date.now()-readyStart,visibleLoading,expectedModules:expectedModules.length,missingModules,expectedLinks,missingLinks,actualModules:actualModules.length,actualModuleNames:actualModules,actualLinks,validatorForms,missingFormInitialization,runtime:runtimeState,foreground:sourceCapture},accountMasked:process.argv.includes('--mask-account'),url:target.url},null,2));ws.close();
