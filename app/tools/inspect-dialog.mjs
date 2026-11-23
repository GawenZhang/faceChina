import fs from 'node:fs';
const u='https://geo136.doujia5799.top/user/company_keyword?addtabs=1';
const tab=await(await fetch('http://127.0.0.1:9222/json/new?'+encodeURIComponent(u),{method:'PUT'})).json();
process.env.GEO_CAPTURE_TARGET=tab.id;const {run}=await import('./capture.mjs');
run('dialog-investigation/keyword-modal-390',[{kind:'goto',url:u,wait_ms:1200},{kind:'wait',ms:1400},{kind:'click',selector:'.btn-add'},{kind:'wait',ms:2500}],390);
