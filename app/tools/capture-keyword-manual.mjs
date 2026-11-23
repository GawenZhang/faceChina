import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {run} from './capture.mjs';
const tab=await (await fetch('http://127.0.0.1:9222/json/new?'+encodeURIComponent('https://geo136.doujia5799.top/user/company_keyword/add?addtabs=1'),{method:'PUT'})).json();
process.env.GEO_CAPTURE_TARGET=tab.id;
process.env.GEO_SOURCE_CAPTURE='1';
for(const width of [1440,390]){
 const base='capture/admin/manual-keyword-base-'+width;
 fs.mkdirSync(base,{recursive:true});
 fs.copyFileSync('capture/admin/company_keyword-add-'+width+'/final.html',base+'/final.html');
 run('full-pass/keyword-manual-base-'+width,[{kind:'goto',url:'https://geo136.doujia5799.top/user/company_keyword/add?addtabs=1',wait_ms:2000}],width,{capture:{at_end:['dom'],events:['page_errors']}});
 const ready=spawnSync(process.execPath,['app/tools/full-screenshot.mjs',base+'/full.png',String(width)],{encoding:'utf8',timeout:65000});
 if(ready.status!==0)throw new Error(ready.stderr);
 run('interaction-keyword-manual-'+width,[{kind:'click',selector:'.shoudong_zhengliu'},{kind:'wait',ms:1200}],width);
}
console.log('Manual keyword popup captured at both widths without confirming or submitting.');
