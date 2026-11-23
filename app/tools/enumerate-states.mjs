import fs from 'node:fs';
const rs=JSON.parse(fs.readFileSync('capture/admin/routes.json'));const states=[];
for(const r of rs){const f='capture/admin/'+r.key+'-1440/final.html';if(!fs.existsSync(f))continue;const h=fs.readFileSync(f,'utf8').replace(/<!--[\s\S]*?-->/g,'');
const tabs=[...h.matchAll(/<(?:a|button)\b([^>]*(?:data-toggle="tab"|role="tab")[^>]*)>([\s\S]*?)<\/(?:a|button)>/gi)];
for(const [i,m] of tabs.entries()){const href=m[1].match(/href="([^" ]+)"/)?.[1];if(!href)continue;states.push({page:r.key,path:r.path,label:m[2].replace(/<[^>]*>/g,'').trim(),selector:'a[href="'+href+'"]',key:r.key+'-tab-'+i});}
const btns=[...h.matchAll(/<a\b([^>]*class="[^"]*\bbtn-dialog\b[^>]*")>([\s\S]*?)<\/a>/gi)];
for(const [i,m] of btns.entries()){const href=m[1].match(/href="([^" ]+)"/)?.[1];if(href?.startsWith('/user/'))states.push({page:r.key,path:r.path,label:m[2].replace(/<[^>]*>/g,'').trim(),url:href,selector:'a[href="'+href+'"]',key:r.key+'-dialog-'+i});}
}
fs.writeFileSync('capture/admin/states-plan.json',JSON.stringify(states,null,2));console.log(JSON.stringify(states,null,2));
