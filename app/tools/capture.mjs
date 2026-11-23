import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
export const root=process.cwd();
export const cli='C:/Users/Administration/.dsh/plugins-data/craft-anything/0.6.0/craft-anything-cli.exe';
const request=JSON.parse(fs.readFileSync('craft.json','utf8')).request;
const secret=request.match(/账号：([^\s]+)/)?.[1];
export function clean(text){return text.replaceAll(secret,'[REDACTED]').replace(/(aliosstoken[\\]*["']\s*:\s*[\\]*["'])(.*?)([\\]*["'])/gi,'$1[REDACTED]$3').replace(/LTAI[A-Za-z0-9+:\/=]+/g,'[REDACTED]');}
export function save(name,r){
 const dir=path.join(root,'capture/admin',name);fs.mkdirSync(dir,{recursive:true});
 for(const [key,a] of Object.entries({final:r.result?.final_artifacts,...Object.fromEntries((r.result?.steps||[]).map((s,i)=>['step-'+i,s.artifacts]))})){
  if(!a)continue;
  if(a.dom?.text)fs.writeFileSync(path.join(dir,key+'.html'),clean(a.dom.text));
  if(a.screenshot?.base64){fs.writeFileSync(path.join(dir,key+'.png'),Buffer.from(a.screenshot.base64,'base64'));delete a.screenshot.base64;a.screenshot.file=key+'.png';}
 }
 fs.writeFileSync(path.join(dir,'record.json'),clean(JSON.stringify(r,null,2)));
 return r;
}
export function run(name,actions,width=1440,extra={}){
 const payload={target_id:process.env.GEO_CAPTURE_TARGET || "530169DE343B533A770ABC69684FF860",actions,environment:{width,height:900},hidden_values:secret?[secret]:[],capture:{at_end:['dom','screenshot','accessibility'],events:['page_errors','popups']},capture_network:true,...extra};
 const out=spawnSync(cli,['web-walkthrough-record','--project','investigation.cany','--allow-run','--deep','--cdp-endpoint','http://127.0.0.1:9222','--json','-'],{input:JSON.stringify(payload),encoding:'utf8',maxBuffer:100*1024*1024,timeout:180000});
 if(out.status!==0)throw new Error(out.stderr||out.stdout);
 const r=JSON.parse(out.stdout);save(name,r);
 console.log(name,JSON.stringify({id:r.id,steps:r.result?.steps?.map(s=>({action:s.action,status:s.status,url:s.url,error:s.error})),aborted:r.result?.aborted}));return r;
}
if(process.argv[2]==='clean-login'){
 const r=JSON.parse(clean(fs.readFileSync('capture/admin/login.json','utf8').replace(/^\uFEFF/,'')));save('login',r);fs.writeFileSync('capture/admin/login.json',clean(JSON.stringify(r)));
 const html=r.result.final_artifacts.dom.text;
 const links=[...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(m=>({url:m[1].match(/href="([^"]*)"/)?.[1],label:m[2].replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim()})).filter(x=>x.url?.startsWith('/user/')&&!/logout|^\/user\/$/.test(x.url));
 fs.writeFileSync('capture/admin/menu.json',JSON.stringify([...new Map(links.map(x=>[x.url.replace(/\/?\?.*/,''),x])).values()],null,2));
}else if(process.argv[2]==='run'){
 run(process.argv[3],JSON.parse(fs.readFileSync(process.argv[4],'utf8').replace(/^\uFEFF/,'')),+(process.argv[5]||1440));
}


