import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {run,cli} from './capture.mjs';
process.env.GEO_CAPTURE_TARGET=JSON.parse(fs.readFileSync('app/checks/local-target.json','utf8')).id;
const routes=JSON.parse(fs.readFileSync('app/backend-page-manifest.json','utf8'));
routes.push({key:'shell',path:'/user/index/index',label:'后台框架',file:'/user/index/index/'});
const reportFile='app/checks/backend-comparisons.json';
let reports=fs.existsSync(reportFile)?JSON.parse(fs.readFileSync(reportFile,'utf8')):[];
for(const route of routes){
 if(process.env.GEO_VERIFY_KEY && !process.env.GEO_VERIFY_KEY.split(',').includes(route.key))continue;
 for(const width of process.env.GEO_VERIFY_WIDTH?[Number(process.env.GEO_VERIFY_WIDTH)]:[1440,390]){
  if(reports.some(r=>r.key===route.key&&r.width===width)&&!process.env.GEO_VERIFY_FORCE)continue;
  if(process.env.GEO_VERIFY_FRESH_TAB){const tab=await (await fetch('http://127.0.0.1:9222/json/new?about:blank',{method:'PUT'})).json();process.env.GEO_CAPTURE_TARGET=tab.id;}
  const r=run('local/'+route.key+'-'+width,[{kind:'goto',url:'http://127.0.0.1:4173'+route.file,wait_ms:Number(process.env.GEO_VERIFY_NAV_WAIT_MS||700)},{kind:'wait',ms:1200}],width);
  const full='capture/admin/local/'+route.key+'-'+width+'/full.png';
  const fullRun=spawnSync(process.execPath,['app/tools/full-screenshot.mjs',full,String(width)],{encoding:'utf8',env:process.env,timeout:30000});
  const local='capture/admin/local/'+route.key+'-'+width+'/final.png';
  const original='capture/admin/'+route.key+'-'+width+'/final.png';
  let comparison=null;
  if(fs.existsSync(original)&&fs.existsSync(local)){
   const input={before:{path:path.resolve(original)},after:{path:path.resolve(local)},common_area:true,tolerance:16};
   const p=spawnSync(cli,['web-pixels-compare','--json','-'],{input:JSON.stringify(input),encoding:'utf8',maxBuffer:8e6});
   if(p.status===0){const data=JSON.parse(p.stdout);comparison=data.result;fs.writeFileSync('capture/admin/local/'+route.key+'-'+width+'/pixels.json',JSON.stringify(data,null,2));}
  }
  const errors=r.result?.events?.items?.filter(e=>/error/i.test(e.kind||''))||[];
  const failed=(r.result?.network?.requests||[]).filter(n=>n.status>=400||n.error);
  const row={key:route.key,path:route.path,label:route.label,width,local,original,full:fullRun.status===0?full:null,evidence:r.id,errors,failed,comparison,status:errors.length||failed.length||!comparison||comparison.perceptual_similarity<.98?'待修复':'已验证'};
  reports=reports.filter(x=>!(x.key===route.key&&x.width===width));reports.push(row);fs.writeFileSync(reportFile,JSON.stringify(reports,null,2));
  console.log('RESULT',route.key,width,JSON.stringify({errors:errors.length,failed:failed.length,comparison}));
  if(process.env.GEO_VERIFY_FRESH_TAB)await fetch('http://127.0.0.1:9222/json/close/'+process.env.GEO_CAPTURE_TARGET).catch(()=>{});
 }
}
