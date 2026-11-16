import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {navigationMotion} from './navigation-motion.mjs';
const {chromium}=createRequire(import.meta.url)('C:/Users/Administration/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dist=fileURLToPath(new URL('./dist/',import.meta.url)),origin='https://motion.local';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage(),checks=[],errors=[];
page.setDefaultTimeout(10000);
page.on('pageerror',error=>errors.push(String(error)));
await page.route('**/*',async route=>{
 const url=new URL(route.request().url());
 if(url.origin!==origin)return route.fulfill({contentType:route.request().resourceType()==='image'?'image/svg+xml':'text/css',body:route.request().resourceType()==='image'?'<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><rect width="900" height="600" fill="#aaa"/></svg>':''});
 const local=path.extname(url.pathname)?url.pathname:url.pathname.replace(/\/$/,'')+'/index.html';
 try{await route.fulfill({body:await fs.readFile(path.join(dist,local)),contentType:({'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(local)]||'text/html'});}catch{await route.fulfill({status:404,body:'Not found'});}
});
// Freeze only the tested animation at creation, so sampling is deterministic.
await page.addInitScript(()=>{
 const animate=Element.prototype.animate;
 Element.prototype.animate=function(frames,options){const result=animate.call(this,frames,options);if(frames?.[0]?.transform==='translateY(40px)')result.pause();return result;};
});
async function go(url){await page.goto(origin+url,{waitUntil:'load'});await page.locator('main h1').waitFor({state:'attached'});}
async function check(name,fn){try{await fn();checks.push({name,passed:true});}catch(e){checks.push({name,passed:false,error:e.stack});}}
try{
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:900});
  await page.emulateMedia({reducedMotion:'no-preference'});
  for(const slug of ['respiro-270','vitaeris-320','quamvis-320','fortius-420','fortius-420-exp'])await check(`${width} homepage ATA -> ${slug}`,async()=>{
   await go('/');
   const target='/products/'+slug;
   const link=page.locator(`.pressure-copy a[href="${target}"]`);
   await page.evaluate(()=>window.__oldDocument=true);
   await Promise.all([page.waitForURL(origin+target),link.click()]);
   await page.locator('main h1').waitFor();
   const frames=await page.evaluate(()=>{
    const animation=document.getAnimations().find(a=>a.id==='route-arrival');
    if(!animation)return null;
    const main=document.querySelector('main');
    const samples=[0,300,599].map(time=>{animation.currentTime=time;const s=getComputedStyle(main);return {y:new DOMMatrix(s.transform).m42,opacity:Number(s.opacity)};});
    const timing=animation.effect.getTiming();animation.finish();return {samples,timing,oldDocument:!!window.__oldDocument};
   });
   assert(frames,'Internal navigation must animate');
   assert.equal(frames.oldDocument,false,'Keep full-document navigation');
   assert.equal(frames.timing.duration,navigationMotion.duration);
   assert.equal(frames.timing.easing,navigationMotion.easing);
   assert.equal(frames.samples[0].y,40);
   assert(frames.samples[1].y>frames.samples[2].y&&frames.samples[1].y<40,'Movement must travel upward');
   assert(frames.samples[1].opacity>0&&frames.samples[2].opacity>.99);
   await page.reload({waitUntil:'load'});await page.locator('main h1').waitFor();
   assert.equal(await page.evaluate(()=>document.getAnimations().some(a=>a.id==='route-arrival')),false,'Reload must not replay stored intent');
   await page.goBack({waitUntil:'load'});await page.locator('main h1').waitFor();
   assert.equal(new URL(page.url()).pathname,'/');
  });
  await check(`${width} reduced motion and same-page anchors`,async()=>{
   await page.emulateMedia({reducedMotion:'reduce'});await go('/');
   const target='/products/respiro-270';await Promise.all([page.waitForURL(origin+target),page.locator(`.pressure-copy a[href="${target}"]`).click()]);await page.locator('main h1').waitFor();
   assert.equal(await page.evaluate(()=>document.getAnimations().some(a=>a.id==='route-arrival')),false);
   assert.equal(await page.locator('main').evaluate(el=>getComputedStyle(el).opacity),'1');
   await go('/blog/fda-hyperbaric-chambers-wellness-devices-not-exempt');
   const sourceAnchor='#what-does-the-fda-define-as-a-hyperbaric-chamber';
   await page.locator('main a[href="'+sourceAnchor+'"]').click();
   assert.equal(new URL(page.url()).hash,sourceAnchor);
   assert.equal(await page.evaluate(()=>sessionStorage.getItem('oxyhealth:route-arrival')),null);
  });
 }
}finally{await browser.close();}
const report={date:new Date().toISOString(),passed:checks.every(c=>c.passed)&&!errors.length,scope:'Local navigation behavior; original timing is unverified',parameters:navigationMotion,checks,errors};
await fs.writeFile(new URL('./qa-motion-results.json',import.meta.url),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));if(!report.passed)process.exitCode=1;
