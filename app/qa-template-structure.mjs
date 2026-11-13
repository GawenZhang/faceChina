import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {articlePaths} from './product-article-data.mjs';
import {independentRoutes} from './independent-data.mjs';
import {allRoutes} from './route-manifest.mjs';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/Administration/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=fileURLToPath(new URL('./',import.meta.url)),dist=path.join(root,'dist'),origin='https://templates.local';
const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage(),errors=[],results=[];
page.on('pageerror',e=>errors.push(String(e)));
await page.emulateMedia({reducedMotion:'reduce'});
await page.route('**/*',async route=>{const u=new URL(route.request().url());if(u.origin!==origin)return route.fulfill({contentType:route.request().resourceType()==='image'?'image/svg+xml':'text/css',body:route.request().resourceType()==='image'?'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#e8e8ed"/></svg>':''});const local=path.extname(u.pathname)?u.pathname:u.pathname.replace(/\/$/,'')+'/index.html';try{await route.fulfill({body:await fs.readFile(path.join(dist,local)),contentType:({'.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'})[path.extname(local)]||'text/html'});}catch{await route.fulfill({status:404,body:'Not found'});errors.push('Missing '+local)}});

// Expectations are read independently from the immutable rendered source pages,
// never from the generated article data or the implementation's CSS class names.
const sourceHTML=Object.fromEntries(await Promise.all(articlePaths.map(async route=>[route,await fs.readFile(path.join(root,'inspection/live-20261113',route.slice(1).replaceAll('/','__'),'page.html'),'utf8')])));
let failure;
try{
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:900});
  for(const route of [...independentRoutes.map(r=>r.path),...articlePaths]){
   await page.goto(origin+route,{waitUntil:'load'});
   await page.locator('main h1').waitFor();
   assert.equal(await page.locator('main h1').count(),1,route+' main heading');
   assert.equal(await page.locator('main').count(),1,route+' main landmark');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' overflow '+width);
   let sourceChecks;
   if(sourceHTML[route]){
    assert.equal(await page.locator('main').getAttribute('data-source-verification'),'live-sampled');
    sourceChecks=await page.evaluate(({html,routePaths})=>{
     const expected=new DOMParser().parseFromString(html,'text/html').querySelector('main');
     const actual=document.querySelector('main');
     const text=el=>el.textContent.replace(/\s+/g,' ').trim();
     const href=el=>{const value=el.getAttribute('href');if(!value)return '';if(value.startsWith('#'))return value;const url=new URL(value,'https://www.oxyhealth.com');return ['www.oxyhealth.com','oxyhealth.com',location.hostname].includes(url.hostname)?url.pathname+url.search+url.hash:value;};
     const collect=main=>({
      headings:[...main.querySelectorAll('h1,h2,h3')].map(el=>({tag:el.tagName,text:text(el)})),
      sections:[...main.querySelectorAll('section,article')].map(el=>({tag:el.tagName,heading:el.querySelector('h1,h2,h3')?text(el.querySelector('h1,h2,h3')):''})),
      links:[...main.querySelectorAll('a[href]')].map(el=>({href:href(el),text:text(el)})),
      disclosures:[...main.querySelectorAll('details>summary')].map(text),
      faqButtons:[...main.querySelectorAll('button[aria-controls]')].map(text),
      images:main.querySelectorAll('img').length
     });
     return {expected:collect(expected),actual:collect(actual)};
    },{html:sourceHTML[route],routePaths:allRoutes.map(item=>item.path)});
    assert.deepEqual(sourceChecks.actual,sourceChecks.expected,route+' captured hierarchy, sections, links, disclosures and images at '+width);
    for(const detail of await page.locator('main details').all()){
     const wasOpen=await detail.evaluate(el=>el.open);
     if(wasOpen)await detail.locator('summary').click();
     await detail.locator('summary').focus();
     await page.keyboard.press('Enter');
     assert(await detail.evaluate(el=>el.open),route+' disclosure keyboard expansion');
     await detail.locator('summary').click();
     assert.equal(await detail.evaluate(el=>el.open),false,route+' disclosure collapse');
     if(wasOpen)await detail.locator('summary').click();
    }
    for(const button of await page.locator('main button[aria-controls]').all()){
     const answer=page.locator('[id="'+await button.getAttribute('aria-controls')+'"]');
     if(!await answer.count())continue;
     if(await button.getAttribute('aria-expanded')==='true')await button.click();
     await button.focus();await page.keyboard.press('Enter');
     assert.equal(await button.getAttribute('aria-expanded'),'true',route+' FAQ expansion');
     assert(await answer.evaluate(el=>el.getBoundingClientRect().height>0),route+' visible FAQ answer');
     await button.click();assert.equal(await button.getAttribute('aria-expanded'),'false',route+' FAQ collapse');
    }
    const toc=page.locator('main nav a[href^="#"]');
    if(await toc.count()){
     const link=toc.first(),hash=await link.getAttribute('href');
     assert.equal(await page.locator('[id="'+decodeURIComponent(hash.slice(1))+'"]').count(),1,route+' TOC destination exists');
     await link.click();assert.equal(new URL(page.url()).hash,hash,route+' TOC navigation');
    }
   }
   if(route==='/why-oxyhealth')assert.equal(await page.locator('main').getAttribute('data-source-verification'),'live-sampled');
   if(route==='/partners'){
    assert.equal(await page.locator('.ip-program-quote').count(),1);
    assert.equal(await page.locator('.ip-implementation-images img').count(),2);
    assert.equal(await page.locator('.ip-implementation-stages li').count(),6);
   }
   if(route==='/support')assert.equal(await page.locator('.ip-support-warehouse img').count(),1);
   results.push({route,width,passed:true,...(sourceChecks?{source:'inspection/live-20261113/'+route.slice(1).replaceAll('/','__')+'/page.html',headings:sourceChecks.actual.headings.length,sections:sourceChecks.actual.sections.length,links:sourceChecks.actual.links.length,disclosures:sourceChecks.actual.disclosures.length,faqButtons:sourceChecks.actual.faqButtons.length}:{})});
  }
 }
 assert.deepEqual(errors,[]);
}catch(error){failure=error;errors.push(String(error));}
finally{
 await browser.close();
 await fs.writeFile(new URL('./qa-template-structure-results.json',import.meta.url),JSON.stringify({checked_at:new Date().toISOString(),passed:!failure&&errors.length===0&&results.length===66,results,errors},null,2));
}
if(failure)throw failure;
console.log(JSON.stringify({passed:true,checks:results.length,errors}));
