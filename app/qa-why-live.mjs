import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/Administration/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=fileURLToPath(new URL('./',import.meta.url));
const server=await createServer({root,server:{host:'127.0.0.1',port:0},logLevel:'error'});
await server.listen();
const origin=server.resolvedUrls.local[0];
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
const errors=[],checks=[];
page.on('pageerror',error=>errors.push(String(error)));
await page.route('**/*',async route=>{
 if(route.request().url().startsWith(origin))return route.continue();
 const image=route.request().resourceType()==='image';
 return route.fulfill({body:image?'<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1280"><rect width="1920" height="1280" fill="#333"/></svg>':'',contentType:image?'image/svg+xml':'text/css'});
});
try{
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:900});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(origin+'why-oxyhealth',{waitUntil:'networkidle'});
  const snapshot=await page.evaluate(()=>{
   const main=document.querySelector('main');
   return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,sections:[...main.children].map(el=>({heading:el.querySelector('h1,h2')?.textContent,height:Math.round(el.offsetHeight),background:getComputedStyle(el).backgroundColor})),headings:main.querySelectorAll('h1').length,chapters:main.querySelectorAll('[aria-labelledby="journey-heading"] ol>li').length,credentials:main.querySelectorAll('[data-credential]').length,faqs:main.querySelectorAll('[aria-controls^="faq-answer-"]').length};
  });
  assert(snapshot.scrollWidth<=width,'No horizontal overflow');assert.equal(snapshot.headings,1);assert.equal(snapshot.sections.length,9);assert.equal(snapshot.chapters,5);assert.equal(snapshot.credentials,6);assert.equal(snapshot.faqs,7);
  assert.deepEqual(snapshot.sections.map(x=>x.background),['rgb(0, 0, 0)','rgb(0, 0, 0)','rgb(0, 0, 0)','rgb(0, 0, 0)','rgb(0, 0, 0)','rgb(245, 245, 247)','rgb(255, 255, 255)','rgb(245, 245, 247)','rgb(0, 0, 0)']);
  assert.equal(snapshot.sections[0].height,900);
  if(width===1440)assert.equal(snapshot.sections[3].height,5040);
  const faq=page.locator('#faq-question-0');await faq.click();await page.waitForTimeout(350);
  assert.equal(await faq.getAttribute('aria-expanded'),'true');assert((await page.locator('#faq-answer-0').boundingBox()).height>100);
  await faq.click();await page.waitForTimeout(350);assert.equal(await faq.getAttribute('aria-expanded'),'false');
  await page.locator('[data-quote]').first().click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
  await page.locator('[aria-labelledby="journey-heading"] ol>li').nth(4).scrollIntoViewIfNeeded();await page.waitForTimeout(100);assert.equal(await page.locator('[aria-labelledby="journey-heading"] ol>li').nth(4).getAttribute('data-active'),'true');
  if(width===1440){
   const stage=await page.locator('.why-dossier').boundingBox();const y=await page.evaluate(()=>scrollY);
   await page.evaluate(({top})=>window.scrollTo(0,top),{top:stage.y+y+3000});await page.waitForTimeout(100);
   await page.screenshot({path:root+'qa-why-credential-1440.png'});
   assert.equal(await page.locator('.why-credential-meter span').textContent(),'5 of 6');
   assert((await page.locator('[data-credential="4"]').boundingBox()).y<900,'Scroll brings fifth credential into view');
  }
  await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(1100);await page.screenshot({path:root+`qa-why-live-${width}.png`});
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(50);
  assert.equal(await page.locator('.why-dossier-sticky').evaluate(el=>getComputedStyle(el).position),'static');
  checks.push({...snapshot,interaction_checks:['FAQ open/close','quote modal/Escape','chapter scroll','reduced-motion credential list'],passed:true});
 }
 assert.deepEqual(errors,[]);
 const result={completed_at:new Date().toISOString(),passed:true,checks,errors,limitations:['External imagery is replaced by same-size placeholders for deterministic local QA.','Source capture can contain hidden scroll reveals; visible rebuilt content follows captured HTML and original CSS.']};
 await writeFile(root+'qa-why-live-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await browser.close();await server.close();}
