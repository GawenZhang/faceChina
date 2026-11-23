import fs from 'node:fs';
const rs=[...JSON.parse(fs.readFileSync('capture/admin/routes.json')),...JSON.parse(fs.readFileSync('capture/admin/subroutes.json'))];
for(const r of rs){const f='capture/admin/'+r.key+'-1440/final.html';if(!fs.existsSync(f))continue;const h=fs.readFileSync(f,'utf8').replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');if(/系统发生错误|没有权限|页面不存在|没有访问权限|未找到页面|SQLSTATE|404 Not/.test(h))console.log(r.key,h.slice(0,300));}
