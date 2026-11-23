import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {run} from './capture.mjs';
const tab=await (await fetch('http://127.0.0.1:9222/json/new?'+encodeURIComponent('https://geo136.doujia5799.top/user/draft/add?addtabs=1'),{method:'PUT'})).json();
process.env.GEO_CAPTURE_TARGET=tab.id;process.env.GEO_SOURCE_CAPTURE='1';process.env.GEO_CAPTURE_SETTLE_MS='8000';
const result=[];
for(const key of ['draft-add','user_tdk-add','b2b_task-add']){
 const dir='capture/admin/'+key+'-1440';
 process.env.GEO_CAPTURE_REFERENCE='capture/admin/'+key+'-390/full.html';
 run('full-pass/mature-'+key+'-1440',[{kind:'goto',url:'https://geo136.doujia5799.top/user/'+key.replace('-add','/add')+'?addtabs=1',wait_ms:2000}],1440,{capture:{at_end:['dom'],events:['page_errors']}});
 const shot=spawnSync(process.execPath,['app/tools/full-screenshot.mjs',dir+'/full.png','1440'],{encoding:'utf8',timeout:65000});
 if(shot.status!==0)throw new Error(shot.stderr);
 const record=run('full-pass/mature-settled-'+key+'-1440',[{kind:'wait',ms:100}],1440,{capture:{at_end:['dom'],events:['page_errors']}});
 const dom='capture/admin/full-pass/mature-settled-'+key+'-1440/final.html';
 fs.copyFileSync(dom,dir+'/final.html');fs.copyFileSync(dom,dir+'/full.html');
 fs.copyFileSync('capture/admin/full-pass/mature-settled-'+key+'-1440/record.json',dir+'/settled-record.json');
 fs.copyFileSync(dir+'/full.png',dir+'/final.png');
 const metadata=JSON.parse(fs.readFileSync(dir+'/full.png.json','utf8'));
 metadata.provenance={captureMethod:'CDP full screenshot after foreground, expected mature RequireJS modules and 8-second settle',domRecord:'settled-record.json',evidenceId:record.id,duplicateArtifact:'final.png'};
 fs.writeFileSync(dir+'/full.png.json',JSON.stringify(metadata,null,2));
 result.push({key,width:1440,status:'captured',readiness:metadata.readiness});
 fs.writeFileSync('capture/final-mature-forms.json',JSON.stringify(result,null,2));
}
console.log(JSON.stringify({matureForms:result.length}));
