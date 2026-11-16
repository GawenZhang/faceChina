import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {capturedMain,capturedMainClass} from './captured-source-utils.mjs';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/Administration/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=fileURLToPath(new URL('./',import.meta.url)),base=path.join(root,'inspection/live-20261113');
const routes=JSON.parse(await fs.readFile(path.join(root,'live-source-audit.json'),'utf8')).results.map(item=>item.path);
const originalCSS=await fs.readFile(path.join(base,'original.css'),'utf8');
const scopedCSS=await fs.readFile(path.join(root,'captured-source.css'),'utf8');
const globalFiles=(await fs.readdir(root)).filter(name=>name.endsWith('.css')&&name!=='captured-source.css');
const globalCSS=(await Promise.all(globalFiles.map(name=>fs.readFile(path.join(root,name),'utf8')))).join('\n');
const browser=await chromium.launch({channel:'chrome',headless:true});
const source=await browser.newPage(),local=await browser.newPage();
let imageDimensions=new Map();
for(const page of [source,local]){
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.route('**/*',async route=>{
  const request=route.request();
  if(request.resourceType()==='image'){
   const size=imageDimensions.get(request.url())||{w:1200,h:800};
   return route.fulfill({contentType:'image/svg+xml',body:`<svg xmlns="http://www.w3.org/2000/svg" width="${size.w||1200}" height="${size.h||800}"><rect width="100%" height="100%" fill="#e8e8ed"/></svg>`});
  }
  return route.fulfill({contentType:'text/css',body:''});
 });
}
const readLayout=()=>{
 const main=document.querySelector('main'),base=main.getBoundingClientRect();
 const fields=['display','backgroundColor','color','fontSize','fontWeight','lineHeight','letterSpacing','paddingTop','paddingRight','paddingBottom','paddingLeft','borderRadius','gap','gridTemplateColumns'];
 return [...main.querySelectorAll('section,article,h1,h2,h3,p,ul,ol,li,img,details,summary,button,table,nav,a')].map(el=>{
  const rect=el.getBoundingClientRect(),style=getComputedStyle(el);
  return {tag:el.tagName,text:el.textContent.replace(/\s+/g,' ').trim().slice(0,65),x:rect.x-base.x,y:rect.y-base.y,w:rect.width,h:rect.height,style:Object.fromEntries(fields.map(field=>[field,style[field]]))};
 });
};
const results=[],missing=[];
try{
 for(const route of routes){
  const directory=path.join(base,route.slice(1).replaceAll('/','__'));
  let capture,fullHTML;
  try{capture=JSON.parse(await fs.readFile(path.join(directory,'capture.json'),'utf8'));fullHTML=await fs.readFile(path.join(directory,'page.html'),'utf8');}
  catch(error){if(error.code==='ENOENT'&&process.argv.includes('--partial')){missing.push(route);continue;}throw error;}
  imageDimensions=new Map(capture.assets.images.map(item=>[item.src,item]));
  // Both sides use the same sanitized static state so this test isolates CSS
  // scoping/global-style interference, rather than claiming animation parity.
  const html=capturedMain(fullHTML,capture.assets.images),classes=capturedMainClass(fullHTML);
  for(const width of [1440,768,390]){
   await Promise.all([source.setViewportSize({width,height:900}),local.setViewportSize({width,height:900})]);
   await Promise.all([
    source.setContent('<style>'+originalCSS+'</style><main class="'+classes+'">'+html+'</main>',{waitUntil:'load'}),
    local.setContent('<style>'+globalCSS+'\n'+scopedCSS+'</style><main class="captured-source '+classes+'">'+html+'</main>',{waitUntil:'load'})
   ]);
   // Compare the settled finite CSS animation state. The original reduced-motion
   // rule leaves .story-rise translated by 18px while the rebuilt page correctly
   // restores its visible resting state; that is a motion fallback, not geometry.
   await Promise.all([source,local].map(page=>page.evaluate(()=>{
    for(const animation of document.getAnimations())if(Number.isFinite(animation.effect?.getComputedTiming().endTime))animation.finish();
   })));
   const [expected,actual]=await Promise.all([source.evaluate(readLayout),local.evaluate(readLayout)]);
   const failures=[];
   if(actual.length!==expected.length)failures.push({kind:'element_count',expected:expected.length,actual:actual.length});
   expected.forEach((want,i)=>{
    const got=actual[i];if(!got)return;
    const differences={};
    for(const field of ['x','y','w','h'])if(Math.abs(want[field]-got[field])>.5)differences[field]={expected:want[field],actual:got[field]};
    for(const [field,value] of Object.entries(want.style))if(value!==got.style[field])differences[field]={expected:value,actual:got.style[field]};
    if(Object.keys(differences).length)failures.push({index:i,tag:want.tag,text:want.text,differences});
   });
   results.push({path:route,width,elements:expected.length,passed:failures.length===0,failures});
  }
 }
}finally{await browser.close();}
const report={checked_at:new Date().toISOString(),passed:results.every(row=>row.passed)&&(!missing.length||process.argv.includes('--partial')),scope:'Original CSS versus isolated source CSS under current app global CSS. Same sanitized static DOM and source-sized image substitutes; no source scripts, animation parity, font-file likeness, shell or app routing claim.',expected_routes:44,checked_routes:results.length/3,missing,results};
await fs.writeFile(path.join(root,'qa-captured-geometry-results.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({passed:report.passed,cases:results.length,failed:results.filter(row=>!row.passed).map(row=>({path:row.path,width:row.width,count:row.failures.length,first:row.failures[0]})),missing},null,2));
if(!report.passed)process.exitCode=1;
