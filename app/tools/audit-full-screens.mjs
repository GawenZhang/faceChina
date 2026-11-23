import fs from 'node:fs';
const routes=new Map();
for(const file of ['capture/admin/routes.json','capture/admin/subroutes.json','capture/admin/interaction-subroutes.json','capture/admin/interaction-subroutes-tail.json']){
  if(!fs.existsSync(file))continue;
  for(const row of JSON.parse(fs.readFileSync(file,'utf8')))routes.set(row.path,row);
}
if(fs.existsSync('capture/admin/shell-1440/full.png')&&fs.existsSync('capture/admin/shell-390/full.png'))routes.set('/user/index/index',{key:'shell',path:'/user/index/index'});
const results=[],bad=[];
let clipped=0;
for(const r of routes.values())for(const width of [1440,390]){
  const file='capture/admin/'+r.key+'-'+width+'/full.png';
  const dom='capture/admin/'+r.key+'-'+width+'/final.html';
  try{
    const meta=JSON.parse(fs.readFileSync(file+'.json','utf8'));
    const png=fs.readFileSync(file);
    if(png.readUInt32BE(16)!==width||!meta.viewportApplied||!meta.url.startsWith('https://geo136.doujia5799.top/')||!fs.existsSync(dom))throw new Error('Invalid viewport, origin, size or DOM');
    if(meta.clipped)clipped++;
    results.push({key:r.key,width,status:'captured',file,dom});
  }catch(error){bad.push({key:r.key,width,error:error.message});}
}
const report={pages:routes.size,widths:[1440,390],screenshots:results.length,failed:bad.length,invalidMetadata:bad,clipped,profileMasked:[1440,390].every(w=>JSON.parse(fs.readFileSync('capture/admin/general-profile-'+w+'/full.png.json')).accountMasked)};
fs.writeFileSync('capture/full-screenshot-results.json',JSON.stringify(results,null,2));
fs.writeFileSync('app/checks/original-full-screens.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report));
