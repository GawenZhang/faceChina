import fs from 'node:fs';import {run} from './capture.mjs';
const routes=JSON.parse(fs.readFileSync('capture/admin/routes.json','utf8'));
const sub=[];
for(const r of routes){
 const file='capture/admin/'+r.key+'-1440/final.html';if(!fs.existsSync(file))continue;
 const html=fs.readFileSync(file,'utf8').replace(/<!--[\s\S]*?-->/g,'');
 if(/class="[^"]*\bbtn-add\b/.test(html))sub.push({path:r.path.replace(/\/index\/type\/[12]$/,'')+'/add',label:r.label+' · 添加',parent:r.key,selector:'.btn-add'});
 const links=[...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
 const seen=new Set();for(const m of links){
 const attrs=m[1],url=attrs.match(/href="([^"]+)"/)?.[1];
 if(!url?.startsWith('/user/')||!/\/(edit|detail|show|add|index\/type)\b/.test(url)||/logout/.test(url))continue;
 const family=url.replace(/\/ids?\/\d+|\/id\/\d+/g,'/ids/{id}').split('?')[0];if(seen.has(family))continue;seen.add(family);
 sub.push({path:url.split('?')[0].replace(/\/$/,''),label:r.label+' · '+(attrs.match(/title="([^"]*)"/)?.[1]||m[2].replace(/<[^>]+>/g,'').trim()||'详情'),parent:r.key});
 }
}
const added=[...new Map(sub.map(r=>[r.path,r])).values()].filter(r=>!routes.some(x=>x.path===r.path)).map(r=>({...r,key:r.path.replace(/^\/user\//,'').replaceAll('/','-')}));
fs.writeFileSync('capture/admin/subroutes.json',JSON.stringify(added,null,2));
console.log(added.map(r=>r.key).join('\n'));
if(process.argv.includes('--run'))for(const r of added)for(const w of [1440,390]){
 if(fs.existsSync('capture/admin/'+r.key+'-'+w+'/final.html'))continue;
 run(r.key+'-'+w,[{kind:'goto',url:'https://geo136.doujia5799.top'+r.path+'?addtabs=1',wait_ms:1600},{kind:'wait',ms:700}],w);
}
