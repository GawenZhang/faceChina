import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {allRoutes} from './route-manifest.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/Administration/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const directory=fileURLToPath(new URL('./',import.meta.url));
const output=directory;
const origin='https://aeris.local';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
await page.emulateMedia({reducedMotion:'reduce'});
const errors=[],results=[],comparisons=[];
const runId=Date.now();
page.on('pageerror',error=>errors.push(error.message));
await page.route('**/*',async route=>{
 const url=new URL(route.request().url());
 if(url.origin!==origin)return route.fulfill({contentType:route.request().resourceType()==='image'?'image/svg+xml':'text/css',body:route.request().resourceType()==='image'?'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><rect width="1200" height="900" fill="#d8d8dd"/></svg>':''});
 const pathname=decodeURIComponent(url.pathname);
 const local=path.extname(pathname)?pathname:pathname.replace(/\/$/,'')+'/index.html';
 try{await route.fulfill({body:await fs.readFile(path.join(directory,'dist',local)),contentType:({'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(local)]||'text/html'});}catch{await route.fulfill({status:404,body:'Not found'});}
});
const sources={
 '/':'../capture/capture.json',
 '/blog':'../capture/routes/blog/capture.json',
 '/hyperbarics':'../capture/routes/hyperbarics/capture.json',
 '/resources':'../capture/routes/resources/capture.json',
 '/events/a4m-longevity-fest':'../capture/routes/events-a4m-longevity-fest/capture.json'
};
const sourceData=Object.fromEntries(await Promise.all(Object.entries(sources).map(async([route,file])=>[route,JSON.parse(await fs.readFile(path.join(directory,file),'utf8'))])));
const productSequence=['hero','metrics','gallery','features','specifications','included','compressor','advantage','faq','finance','brand','resource','contact'];
const livePaths=new Set(JSON.parse(await fs.readFile(path.join(directory,'live-source-audit.json'),'utf8')).results.map(x=>x.path));
function luminance(hex){const c=hex.slice(1,7).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
try{
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:900});
  for(const entry of allRoutes){
   await page.goto(origin+entry.path,{waitUntil:'domcontentloaded'});
   await page.locator('main h1').waitFor();
   const blocks=await page.evaluate(()=>{
    const hex=c=>{const v=c.match(/[\d.]+/g)?.map(Number)||[255,255,255];return '#'+v.slice(0,3).map(n=>Math.round(n).toString(16).padStart(2,'0')).join('');};
    const effective=el=>{for(let e=el;e;e=e.parentElement){const c=getComputedStyle(e).backgroundColor;if(c!=='rgba(0, 0, 0, 0)'&&c!=='transparent')return hex(c);}return '#ffffff';};
    const main=document.querySelector('main');
    return [...main.querySelectorAll('section, article > header, article > .pa-article-body')].filter(e=>e.getBoundingClientRect().height>0&&!e.closest('[role="dialog"]')).map(el=>({
     selector:el.dataset.productSection?'[data-product-section="'+el.dataset.productSection+'"]':el.tagName.toLowerCase()+'.'+[...el.classList].join('.'),
     productSection:el.dataset.productSection||null,
     heading:el.querySelector('h1,h2,h3')?.textContent||'',
     topLevel:!el.parentElement.closest('section'),
     background:effective(el),color:hex(getComputedStyle(el).color),
     text:[...el.querySelectorAll('h1,h2,h3,p,dt,dd,li,figcaption,summary')].filter(e=>e.textContent.trim()&&!e.closest('a,button')).slice(0,160).map(e=>({tag:e.tagName.toLowerCase(),color:hex(getComputedStyle(e).color),background:effective(e),text:e.textContent.slice(0,70)}))
    }));
   });
   const compactControls=await page.locator('.sl-compact .ex-cta .ex-button').evaluateAll(elements=>elements.map(el=>{
    const hex=c=>'#'+c.match(/[\d.]+/g).slice(0,3).map(n=>Number(n).toString(16).padStart(2,'0')).join('');
    let background='#ffffff';for(let e=el;e;e=e.parentElement){const c=getComputedStyle(e).backgroundColor;if(c!=='rgba(0, 0, 0, 0)'&&c!=='transparent'){background=hex(c);break;}}
    return {color:hex(getComputedStyle(el).color),background};
   }));
   const failures=[];
   const check=(label,fn)=>{try{fn();comparisons.push({path:entry.path,width,label,passed:true});}catch(e){failures.push(e.message);comparisons.push({path:entry.path,width,label,passed:false,error:e.message});}};
   for(const control of compactControls)check('Light CTA button contrast',()=>assert.ok(contrast(control.color,control.background)>=4.5,'CTA text must remain readable on its light surface'));
   if(entry.template==='product'){
    const sections=blocks.filter(x=>x.topLevel);
    check('Product section coverage',()=>assert.deepEqual(sections.map(x=>x.productSection),productSequence.map(x=>x==='included'&&entry.path.includes('fortius')?'installation':x)));
    for(const section of sections){
     const hero=section.productSection==='hero';
     check(section.productSection+' background and text polarity',()=>{
      assert.ok(hero?luminance(section.background)<.03:luminance(section.background)>.8,section.productSection+' must be '+(hero?'dark':'light'));
      assert.ok(hero?luminance(section.color)>.8:luminance(section.color)<.1,section.productSection+' has wrong inherited text');
      for(const text of section.text)assert.ok(contrast(text.color,text.background)>=3,section.productSection+' low contrast: '+text.text+' '+text.color+' on '+text.background);
     });
     if(['metrics','gallery'].includes(section.productSection))check(section.productSection+' white surface',()=>assert.equal(section.background,'#ffffff'));
    }
    if(entry.path==='/products/respiro-270'&&width!==768){
     for(const section of ['hero','metrics','gallery','specifications','faq','contact'])await page.locator('[data-product-section="'+section+'"]').screenshot({path:path.join(output,'local-respiro-'+section+'-'+width+'-'+runId+'.png')});
    }
   }
   if(sourceData[entry.path]){
    const source=sourceData[entry.path];
    const layout=source.layouts.find(x=>x.width===width);
    const original=layout.blocks.filter(x=>x.tag==='section');
    const local=blocks.filter(x=>x.topLevel);
    check('Original section count',()=>assert.equal(local.length,original.length));
    for(let i=0;i<original.length;i++){
     // A missing background in a capture is transparent, not proof of white.
     if(!original[i].background)continue;
     check('Original section '+i+' '+original[i].heading,()=>assert.equal(local[i]?.background,original[i].background));
    }
   }
   results.push({path:entry.path,template:entry.template,width,passed:failures.length===0,failures,reference:sources[entry.path]|| (livePaths.has(entry.path)?'2026-11-13 live source capture; independent comparison in qa-live-source-results.json':entry.template==='product'?'User-observed Respiro polarity; shared five-product regression. Exact other boundaries unverified.':'Outside this 44-page live sampling scope; prior evidence status retained'),blocks});
  }
 }
}finally{await browser.close();}
const report={checkedAt:new Date().toISOString(),passed:!errors.length&&results.every(x=>x.passed),scope:'All 70 routes at three widths: computed surface inventory and five historical source comparisons. The additional 44 live-source pages are independently compared by qa-live-source.mjs. Product checks retain previously accepted polarity. Scope outside these groups remains unchanged.',routeCount:allRoutes.length,results,comparisons,errors};
await fs.writeFile(path.join(directory,'qa-backgrounds-results.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({passed:report.passed,pages:results.length,checks:comparisons.length,failures:comparisons.filter(x=>!x.passed),errors},null,2));
if(!report.passed)process.exitCode=1;
