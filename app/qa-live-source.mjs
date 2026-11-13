import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/Administration/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=fileURLToPath(new URL('./',import.meta.url));
const targets=JSON.parse(await fs.readFile(path.join(root,'live-source-audit.json'),'utf8')).results;
const origin='https://live-source.local',results=[],errors=[];
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
page.on('pageerror',e=>errors.push({url:page.url(),error:e.message}));
await page.emulateMedia({reducedMotion:'reduce'});
await page.route('**/*',async route=>{
 const u=new URL(route.request().url());
 if(u.origin!==origin)return route.fulfill({contentType:route.request().resourceType()==='image'?'image/svg+xml':'text/css',body:route.request().resourceType()==='image'?'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#e8e8ed"/></svg>':''});
 const local=path.extname(u.pathname)?u.pathname:u.pathname.replace(/\/$/,'')+'/index.html';
 try{await route.fulfill({body:await fs.readFile(path.join(root,'dist',local)),contentType:({'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json'})[path.extname(local)]||'text/html'});}catch{errors.push({missing:local});await route.fulfill({status:404,body:'Missing local file'});}
});
try{
 for(const target of targets){
  const folder=path.join(root,'inspection/live-20261113',target.path.slice(1).replaceAll('/','__'));
  const capture=JSON.parse(await fs.readFile(path.join(folder,'capture.json'),'utf8'));
  const html=await fs.readFile(path.join(folder,'page.html'),'utf8');
  for(const width of [1440,768,390]){
   await page.setViewportSize({width,height:900});
   // The reference Why capture uses its animated desktop dossier, while its
   // deliberately different reduced-motion layout has a separate regression.
   await page.emulateMedia({reducedMotion:target.path==='/why-oxyhealth'?'no-preference':'reduce'});
   await page.goto(origin+target.path,{waitUntil:'load'});
   await page.locator('main h1').waitFor();
   const actual=await page.evaluate(sourceHTML=>{
    const main=document.querySelector('main'),source=new DOMParser().parseFromString(sourceHTML,'text/html').querySelector('main');
    const hex=v=>{if(v==='rgba(0, 0, 0, 0)'||v==='transparent')return null;const n=v.match(/[\d.]+/g).map(Number);return '#'+n.slice(0,3).map(x=>Math.round(x).toString(16).padStart(2,'0')).join('')+(n[3]!==undefined&&n[3]<1?Math.round(n[3]*255).toString(16).padStart(2,'0'):'');};
    const headings=el=>[...el.querySelectorAll('h1,h2,h3,h4')].filter(h=>!h.closest('dialog:not([open])')).map(h=>[h.tagName,h.textContent.replace(/\s+/g,' ').trim()]);
    return {mainCount:document.querySelectorAll('main').length,verified:main.dataset.sourceVerification,overflow:document.documentElement.scrollWidth>innerWidth+1,headings:headings(main),expectedHeadings:headings(source),type:Object.fromEntries(['h1','h2','h3'].map(t=>[t,main.querySelector(t)?parseFloat(getComputedStyle(main.querySelector(t)).fontSize):null])),blocks:[...main.querySelectorAll('section,article')].filter(e=>e.getBoundingClientRect().height>0).map(e=>{const c=getComputedStyle(e);return {tag:e.tagName.toLowerCase(),heading:e.querySelector('h1,h2,h3')?.textContent.replace(/\s+/g,' ').trim(),background:hex(c.backgroundColor),pad:[c.paddingTop,c.paddingRight,c.paddingBottom,c.paddingLeft].map(parseFloat),w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height};})};
   },html);
   const layout=capture.layouts.find(x=>x.width===width);
   const begin=layout.blocks.findIndex(x=>x.tag==='main'),end=layout.blocks.findIndex((x,i)=>i>begin&&x.tag==='footer');
   const expected=layout.blocks.slice(begin+1,end<0?undefined:end).filter(x=>['section','article'].includes(x.tag)&&x.h>0);
   const failures=[],check=(valid,message)=>{if(!valid)failures.push(message);};
   check(actual.mainCount===1,'exactly one main');check(actual.verified==='live-sampled','live source marker');check(!actual.overflow,'horizontal overflow');
   check(JSON.stringify(actual.headings)===JSON.stringify(actual.expectedHeadings),'heading hierarchy/order differs from captured main');
   check(actual.blocks.length===expected.length,`section/article count ${actual.blocks.length} vs ${expected.length}`);
   for(const [tag,size] of Object.entries(layout.type))if(tag!=='body'&&size&&actual.type[tag])check(Math.abs(actual.type[tag]-size)<1,`${tag} size ${actual.type[tag]} vs ${size}`);
   expected.forEach((e,i)=>{const a=actual.blocks[i];if(!a)return;check(a.tag===e.tag,`block ${i} tag`);check((a.background||null)===(e.background||null),`block ${i} background ${a.background} vs ${e.background||'transparent'}`);check(a.pad.every((v,k)=>Math.abs(v-e.pad[k])<1),`block ${i} padding ${a.pad} vs ${e.pad}`);check(Math.abs(a.w-e.w)<=16,`block ${i} width ${a.w} vs ${e.w}`);});
   results.push({path:target.path,width,reference:path.relative(root,folder).replaceAll('\\','/'),passed:failures.length===0,failures,expected,actual});
  }
 }
}finally{await browser.close();}
const passed=results.length===132&&results.every(x=>x.passed)&&errors.length===0;
await fs.writeFile(path.join(root,'qa-live-source-results.json'),JSON.stringify({checked_at:new Date().toISOString(),passed,scope:'44 live source pages x 3 widths. Independent capture comparison: ordered headings, section/article boundaries, background colors, padding, widths and heading sizes; no horizontal overflow. Media is stubbed; full pixel, font rasterization, imagery and animated intermediate states are not certified.',results,errors},null,2));
console.log(JSON.stringify({passed,pages:results.length,failures:results.filter(x=>!x.passed).map(({path,width,failures})=>({path,width,failures})),errors},null,2));
if(!passed)process.exitCode=1;
