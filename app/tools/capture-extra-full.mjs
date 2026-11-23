import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {run} from './capture.mjs';
const tab=await (await fetch('http://127.0.0.1:9222/json/new?'+encodeURIComponent('https://geo136.doujia5799.top/user/dashboard?addtabs=1'),{method:'PUT'})).json();
process.env.GEO_CAPTURE_TARGET=tab.id;
console.log('Extra full capture target',tab.id);
const base=[...JSON.parse(fs.readFileSync('capture/admin/routes.json','utf8')),...JSON.parse(fs.readFileSync('capture/admin/subroutes.json','utf8'))];
let discovered=[];
for(const file of ['capture/admin/interaction-subroutes.json','capture/admin/interaction-subroutes-tail.json'])if(fs.existsSync(file))discovered.push(...JSON.parse(fs.readFileSync(file,'utf8')));
const extras=[...new Map(discovered.map(r=>[r.path,r])).values()].filter(r=>!base.some(b=>b.path===r.path));
const routes=process.argv.includes('--score-only')?base.filter(r=>r.key==='user_score_log'):extras;
let results=[];try{results=JSON.parse(fs.readFileSync('capture/extra-full-screens.json','utf8'));}catch{}
for(const r of routes)for(const width of [1440,390]){
  const dir='capture/admin/'+r.key+'-'+width;
  if(!process.argv.includes('--score-only')&&fs.existsSync(dir+'/full.png.json')&&JSON.parse(fs.readFileSync(dir+'/full.png.json')).viewportApplied)continue;
  const isNew=!fs.existsSync(dir+'/final.html');
  fs.mkdirSync(dir,{recursive:true});
  try{
    const name=(isNew?'':'full-pass/')+r.key+'-'+width;
    const response=run(name,[{kind:'goto',url:'https://geo136.doujia5799.top'+r.path+'?addtabs=1',wait_ms:1400},{kind:'wait',ms:r.key==='user_score_log'?6500:700}],width,{capture:{at_end:['dom'],events:['page_errors']}});
    if(response.result?.aborted)throw new Error('Navigation aborted');
    const shot=spawnSync(process.execPath,['app/tools/full-screenshot.mjs',dir+'/full.png',String(width)],{encoding:'utf8',timeout:60000});
    if(shot.status!==0)throw new Error(shot.stderr||'Screenshot failed');
    if(isNew)fs.copyFileSync(dir+'/full.png',dir+'/final.png');
    results=results.filter(x=>x.key!==r.key||x.width!==width);
    results.push({key:r.key,width,status:'captured',file:dir+'/full.png',sourceCreated:isNew});
  }catch(error){results.push({key:r.key,width,status:'failed',error:error.message});}
  let previous=[];try{previous=JSON.parse(fs.readFileSync('capture/extra-full-screens.json','utf8'));}catch{}
  results=[...new Map([...previous,...results].map(r=>[r.key+'-'+r.width,r])).values()];
  fs.writeFileSync('capture/extra-full-screens.json',JSON.stringify(results,null,2));
}
console.log(JSON.stringify({extraPages:extras.length,completed:results.length,failures:results.filter(r=>r.status==='failed').length}));
