import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {run} from './capture.mjs';
let rows=JSON.parse(fs.readFileSync('capture/long-full-pending.json','utf8'));
const key=process.argv.find(a=>a.startsWith('--key='))?.slice(6);
if(key)rows=rows.filter(r=>r.key===key);
process.env.GEO_SOURCE_CAPTURE='1';
const tab=await (await fetch('http://127.0.0.1:9222/json/new?'+encodeURIComponent('https://geo136.doujia5799.top/user/dashboard?addtabs=1'),{method:'PUT'})).json();
process.env.GEO_CAPTURE_TARGET=tab.id;
console.log('Settled long-page capture target',tab.id);
const results=[];
for(const r of rows){
 const dir='capture/admin/'+r.key+'-'+r.width;
 try{
  run('full-pass/long-'+r.key+'-'+r.width,[{kind:'goto',url:'https://geo136.doujia5799.top'+r.path+'?addtabs=1',wait_ms:2000}],r.width,{capture:{at_end:['dom'],events:['page_errors']}});
  const shot=spawnSync(process.execPath,['app/tools/full-screenshot.mjs',dir+'/full.png',String(r.width)],{encoding:'utf8',timeout:65000});
  if(shot.status!==0)throw new Error(shot.stderr||'Screenshot failed');
  const settled=run('full-pass/settled-'+r.key+'-'+r.width,[{kind:'wait',ms:100}],r.width,{capture:{at_end:['dom'],events:['page_errors']}});
  const meta=JSON.parse(fs.readFileSync(dir+'/full.png.json','utf8'));
  meta.provenance={settledRecord:'../full-pass/settled-'+r.key+'-'+r.width+'/record.json',evidenceId:settled.id};
  fs.writeFileSync(dir+'/full.png.json',JSON.stringify(meta,null,2));
  results.push({key:r.key,width:r.width,status:'captured',file:dir+'/full.png'});
 }catch(error){results.push({key:r.key,width:r.width,status:'failed',error:error.message});}
 fs.writeFileSync('capture/settled-long-results'+(key?'-probe':'')+'.json',JSON.stringify(results,null,2));
}
console.log(JSON.stringify({total:results.length,failed:results.filter(r=>r.status==='failed').length}));
