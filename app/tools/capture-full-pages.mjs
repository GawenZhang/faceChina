import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {run} from './capture.mjs';
const tab=await (await fetch('http://127.0.0.1:9222/json/new?'+encodeURIComponent('https://geo136.doujia5799.top/user/dashboard?addtabs=1'),{method:'PUT'})).json();
process.env.GEO_CAPTURE_TARGET=tab.id;
fs.writeFileSync('capture/full-screenshot-target.json',JSON.stringify({id:tab.id}));
console.log('Full-page capture tab '+tab.id);
const routes=[...JSON.parse(fs.readFileSync('capture/admin/routes.json','utf8')),...JSON.parse(fs.readFileSync('capture/admin/subroutes.json','utf8'))];
const onlyWidth=+(process.argv.find(a=>a.startsWith('--width='))?.split('=')[1]||0);
const report='capture/full-screenshot-results'+(onlyWidth?'-'+onlyWidth:'')+'.json';
const results=[];
for(const r of routes) for(const width of (onlyWidth?[onlyWidth]:[1440,390])) {
  const dir='capture/admin/'+r.key+'-'+width;
  if(!process.argv.includes('--force') && fs.existsSync(dir+'/full.png') && r.key!=='general-profile') {results.push({key:r.key,width,status:'existing'});continue;}
  fs.mkdirSync(dir,{recursive:true});
  try {
    const response=run('full-pass/'+r.key+'-'+width,[{kind:'goto',url:'https://geo136.doujia5799.top'+r.path+'?addtabs=1',wait_ms:process.argv.includes('--fast')?500:1200}],width,{capture:{at_end:['dom'],events:['page_errors']}});
    if(response.result?.aborted || response.result?.steps?.some(x=>x.status==='error')) throw new Error('Navigation failed');
    const mask=r.key==='general-profile';
    const shot=spawnSync(process.execPath,['app/tools/full-screenshot.mjs',dir+'/full.png',String(width),...(mask?['--mask-account']:[])],{encoding:'utf8',timeout:60000});
    if(shot.status!==0)throw new Error(shot.stderr||'Screenshot failed');
    if(mask){
      fs.copyFileSync(dir+'/full.png',dir+'/final.png');
      fs.copyFileSync('capture/admin/full-pass/'+r.key+'-'+width+'/final.html',dir+'/final.html');
      fs.writeFileSync(dir+'/redaction.json',JSON.stringify({accountMaskedBeforeScreenshot:true,method:'DOM style color transparent on #username; hidden_values for DOM',image:'final.png',fullImage:'full.png'},null,2));
    }
    results.push({key:r.key,width,status:'captured',file:dir+'/full.png'});
  } catch(error) {results.push({key:r.key,width,status:'failed',error:error.message});console.error('Capture failed',r.key,width,error.message);}
  fs.writeFileSync(report,JSON.stringify(results,null,2));
}
console.log(JSON.stringify({done:results.length,failed:results.filter(r=>r.status==='failed').length}));
