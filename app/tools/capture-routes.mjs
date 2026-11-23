import fs from 'node:fs';import {run} from './capture.mjs';
const menu=JSON.parse(fs.readFileSync('capture/admin/menu.json','utf8'));
const routes=menu.filter(x=>!x.label.startsWith('-->')).map((x,i)=>({...x,path:x.url.split('?')[0].replace(/\/$/,''),key:x.url.split('?')[0].replace(/^\/user\//,'').replace(/\/$/,'').replaceAll('/','-')}));
fs.writeFileSync('capture/admin/routes.json',JSON.stringify(routes,null,2));
for(const r of routes){for(const w of [1440,390]){
 const name=r.key+'-'+w;if(fs.existsSync('capture/admin/'+name+'/final.html'))continue;
 const acts=[{kind:'goto',url:'https://geo136.doujia5799.top'+r.path+'?addtabs=1',wait_ms:1800},{kind:'wait',ms:1000}];
 if(r.key==='general-profile')acts.push({kind:'fill',selector:'input[name="row[username]"]',value:'采样账号'});
 try{run(name,acts,w)}catch(e){console.log(name,'ERROR',e.message.slice(0,400));}
}}
