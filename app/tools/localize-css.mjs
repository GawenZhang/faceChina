import { readFile, readdir, mkdir, writeFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(app,'site-assets');
const archive = resolve(app,'../capture/static-assets/original-css');
const files=[];
async function walk(dir) { for(const e of await readdir(dir,{withFileTypes:true})) {const p=resolve(dir,e.name); if(e.isDirectory()) await walk(p); else if(e.name.endsWith('.css')) files.push(p); } }
await walk(root);
let rewrites=0;
let adjustments=[];
try { adjustments=JSON.parse(await readFile(resolve(app,'checks/css-adjustments.json'),'utf8')); } catch {}
let unavailable=[];
try { unavailable=JSON.parse(await readFile(resolve(app,'../capture/static-assets/public-fetch-failures.json'),'utf8')).filter(r=>r.error.includes('404')).map(r=>new URL(r.url).pathname); } catch {}
for(const file of files) {
  const original=await readFile(file,'utf8');
  const relative=file.slice(root.length+1);
  const evidence=resolve(archive,relative);
  await mkdir(dirname(evidence),{recursive:true});
  try { await stat(evidence); } catch { await writeFile(evidence,original); }
  let rewritten=original;
  rewritten=rewritten.replace(/@font-face\s*\{[^}]*\}/g,block=>{
    const urls=[...block.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/g)].map(m=>new URL(m[1],'https://original.invalid/'+relative.replaceAll('\\','/')).pathname);
    if(!urls.length||!urls.every(u=>unavailable.includes(u))) return block;
    adjustments.push({file:relative.replaceAll('\\','/'),kind:'remove unavailable font-face',resources:urls,reason:'Every font source returned HTTP 404 on the original site; preserve its fallback rendering without failed local requests'});
    return '';
  });
  rewritten=rewritten.replace(/@font-face\s*\{[^}]*Alibaba-PuHuiTi-Regular\.ttf[^}]*\}/g,block=>{
    adjustments.push({file:relative.replaceAll('\\','/'),kind:'remove unavailable font-face',resource:'Alibaba-PuHuiTi-Regular.ttf',reason:'Original URL returns HTTP 404; preserve observed system-font fallback without failed local request'});
    return '';
  });
  rewritten=rewritten.replace(/url\(\s*["']?\/assets\/img\/select\.png["']?\s*\)/g,()=>{
    adjustments.push({file:relative.replaceAll('\\','/'),kind:'remove unavailable background',resource:'/assets/img/select.png',reason:'Original URL returns HTTP 404; preserve observed absent background'});
    return 'none';
  });
  for(const match of original.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/g)) {
    if(!/^(?:\/(?!site-assets\/)|https?:)/.test(match[1])) continue;
    let url;
    try { url=new URL(match[1],'https://original.invalid'); } catch {continue;}
    try { if(!(await stat(resolve(root,'.'+url.pathname))).isFile()) continue; } catch {continue;}
    rewritten=rewritten.replaceAll(match[1],'/site-assets'+url.pathname+url.search+url.hash);
    rewrites++;
  }
  if(rewritten!==original) await writeFile(file,rewritten);
}
adjustments=[...new Map(adjustments.map(x=>[JSON.stringify(x),x])).values()];
await writeFile(resolve(app,'checks/css-adjustments.json'),JSON.stringify(adjustments,null,2));
console.log(JSON.stringify({stylesheets:files.length,rewrites,adjustments:adjustments.length}));
