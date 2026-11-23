import fs from 'node:fs';
const tabs=await (await fetch('http://127.0.0.1:9222/json/list')).json();const target=tabs.find(t=>t.id===JSON.parse(fs.readFileSync('app/checks/local-target.json','utf8')).id);
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(resolve=>ws.onopen=resolve);let i=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}};
const send=(method,params={})=>new Promise(resolve=>{const id=++i;pending.set(id,resolve);ws.send(JSON.stringify({id,method,params}));});
await send('Emulation.setDeviceMetricsOverride',{width:390,height:900,deviceScaleFactor:1,mobile:false});await new Promise(resolve=>setTimeout(resolve,500));
await send('Emulation.setScrollbarsHidden',{hidden:false});
await send('DOM.enable');await send('CSS.enable');const doc=await send('DOM.getDocument');const {nodeIds}= (await send('DOM.querySelectorAll',{nodeId:doc.result.root.nodeId,selector:'.fixed-table-body, .fixed-table-body table'})).result;
if(process.argv.includes('--force-scroll'))await send('DOM.setAttributeValue',{nodeId:nodeIds[0],name:'style',value:'overflow-x:scroll'});
const out=[];for(const nodeId of nodeIds){const box=await send('DOM.getBoxModel',{nodeId});const style=await send('CSS.getComputedStyleForNode',{nodeId});out.push({nodeId,box:box.result?.model,css:style.result?.computedStyle?.filter(x=>/^(?:overflow.*|width|height|scrollbar.*)$/.test(x.name))});}
console.log(JSON.stringify({url:target.url,boxes:out},null,2));
const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync('app/checks/scrollbars-visible-probe.png',Buffer.from(shot.result.data,'base64'));ws.close();
