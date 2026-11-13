import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/Administration/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dist=fileURLToPath(new URL('./dist/',import.meta.url));
const origin='https://interactions.local';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
page.setDefaultTimeout(7000);
await page.emulateMedia({reducedMotion:'reduce'});
const errors=[],results=[];
page.on('pageerror',e=>errors.push(String(e)));
await page.route('**/*',async route=>{
 const url=new URL(route.request().url());
 if(url.origin!==origin){const image=route.request().resourceType()==='image';return route.fulfill({contentType:image?'image/svg+xml':'text/css',body:image?'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="640" height="400" fill="#999"/></svg>':''})}
 let pathname=decodeURIComponent(url.pathname);if(!path.extname(pathname))pathname+='/index.html';
 try{await route.fulfill({body:await fs.readFile(path.join(dist,pathname)),contentType:({'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(pathname)]||'text/html'})}
 catch(e){errors.push('Missing local file '+pathname);await route.fulfill({status:404,body:'Not found'})}
});
async function visit(route){await page.goto(origin+route,{waitUntil:'load'});await page.locator('main h1').waitFor()}
async function check(name,run){try{await run();results.push({name,passed:true})}catch(e){results.push({name,passed:false,error:e.message})}}
async function result(label){return page.locator('.ex-results > div').filter({has:page.locator('dt',{hasText:new RegExp('^'+label+'$')})}).locator('dd').innerText()}
async function faq(selector){const details=page.locator(selector);assert(await details.count()>=2);await details.nth(0).locator('summary').click();await details.nth(1).locator('summary').click();assert.equal(await details.nth(0).getAttribute('open'),'');assert.equal(await details.nth(1).getAttribute('open'),'');assert(await details.nth(0).locator('p').isVisible());assert(await details.nth(1).locator('p').isVisible());await details.nth(0).locator('summary').click();assert.equal(await details.nth(0).getAttribute('open'),null);assert.equal(await details.nth(1).getAttribute('open'),'')}
async function fillRequired(form){
 const inputs=form.locator('input[required]');
 for(let i=0;i<await inputs.count();i++){const input=inputs.nth(i),type=await input.getAttribute('type'),name=await input.getAttribute('name');await input.fill(name==='verification'?'OXY26':type==='email'?'preview@example.test':type==='tel'?'5551234567':'Preview User')}
 const selects=form.locator('select[required]');for(let i=0;i<await selects.count();i++)await selects.nth(i).selectOption({index:1});
 const areas=form.locator('textarea[required]');for(let i=0;i<await areas.count();i++)await areas.nth(i).fill('Local preview check; no request should be transmitted.');
}
async function formFlow(form){
 await form.locator('[type="submit"]').click();assert.equal(await form.evaluate(el=>el.checkValidity()),false);assert.equal(await form.locator('.ip-form-success').count(),0);
 await fillRequired(form);assert.equal(await form.evaluate(el=>el.checkValidity()),true);
 const code=form.locator('[name="verification"]');await code.fill('WRONG');await form.locator('[type="submit"]').click();assert.equal(await form.evaluate(el=>el.checkValidity()),false);assert.equal(await form.locator('.ip-form-success').count(),0);
 await code.fill('OXY26');await form.locator('[type="submit"]').click();await form.locator('[role="status"]').waitFor();assert.match(await form.locator('[role="status"]').innerText(),/has not sent a request/);
 await form.locator('[type="reset"]').click();assert.equal(await form.locator('.ip-form-success').count(),0);assert.equal(await form.locator('input[required]').first().inputValue(),'');assert.equal(await code.inputValue(),'');
}
try{
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});
  await check(`${width}: converter defaults, live input, invalid and reset`,async()=>{
   await visit('/hyperbaric-pressure-converter');assert.match(await result('Gauge pressure'),/^4\.4 psi/);assert.match(await result('Absolute pressure'),/^19\.1 psi/);assert.match(await result('Kilopascals'),/^131\.7 kPa/);assert.equal(await page.locator('.ex-results > div').count(),6,'Original converter has six result cards');assert.match(await result('Millimeters of mercury'),/^988 mmHg/);
   await page.locator('#ex-pressure').fill('2');await page.locator('#ex-oxygen').fill('100');assert.match(await result('Gauge pressure'),/^14\.7 psi/);assert.match(await result('Absolute pressure'),/^29\.4 psi/);assert.match(await result('Kilopascals'),/^202\.7 kPa/);assert.match(await result('Oxygen partial pressure'),/^2\.00 ATA/);
   await page.locator('#ex-pressure').fill('0');assert(await page.locator('.ex-input-error').isVisible());assert.equal(await page.locator('.ex-results').count(),0);
   await page.locator('#ex-pressure').fill('2');await page.locator('#ex-oxygen').fill('101');assert(await page.locator('.ex-input-error').isVisible());
   await page.locator('.ex-reset').click();assert.equal(await page.locator('#ex-pressure').inputValue(),'1.3');assert.equal(await page.locator('#ex-oxygen').inputValue(),'21');assert.match(await result('Gauge pressure'),/^4\.4 psi/);
   await page.locator('#ex-pressure').fill('');assert(await page.locator('.ex-input-error').isVisible());await page.locator('.ex-reset').click();
  });
  await check(`${width}: research pressure filters`,async()=>{await visit('/hyperbaric-research-library');assert.equal(await page.locator('.ex-studies article').count(),7);for(const [label,count] of [['1.5 ATA and below',3],['2.0 ATA and above',4],['All pressures',7]]){const control=page.getByRole('button',{name:label,exact:true});await control.click();assert.equal(await control.getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.ex-studies article').count(),count);assert.match(await page.locator('.ex-filter-count').innerText(),new RegExp('Showing '+count+' of 7'))}});
  await check(`${width}: product FAQs remain independent`,async()=>{await visit('/products/fortius-420');await faq('.pd-faq details')});
  for(const [route,kind] of [['/support','support'],['/partners','partner']]){
   await check(`${width}: ${kind} form validation, verification, local status and reset`,async()=>{await visit(route);await formFlow(page.locator('.ip-form'))});
   await check(`${width}: ${kind} independent FAQs`,async()=>{await visit(route);await faq('.ip-faq details')});
  }
  await check(`${width}: support reset clears attachment error and permits submission without files`,async()=>{
   await visit('/support');const form=page.locator('.ip-form'),file=form.locator('input[type="file"]');
   await fillRequired(form);
   await file.setInputFiles(Array.from({length:4},(_,i)=>({name:`preview-${i}.txt`,mimeType:'text/plain',buffer:Buffer.from('Local attachment validation check.')})));
   await form.locator('[type="submit"]').click();assert.equal(await file.evaluate(el=>el.checkValidity()),false);assert.equal(await form.locator('.ip-form-success').count(),0);
   await form.locator('[name="verification"]').fill('WRONG');assert.equal(await form.locator('[name="verification"]').evaluate(el=>el.validity.customError),true);
   await form.locator('[type="reset"]').click();
   assert.equal(await file.evaluate(el=>el.files.length),0);assert.equal(await file.evaluate(el=>el.checkValidity()),true,'Reset must clear the optional attachment input custom error');
   assert.equal(await form.locator('[name="verification"]').evaluate(el=>el.validity.customError),false,'Reset must clear the verification custom error');
   assert.equal(await form.locator('.ip-error').count(),0);
   await fillRequired(form);assert.equal(await form.evaluate(el=>el.checkValidity()),true);
   await form.locator('[type="submit"]').click();await form.locator('.ip-form-success').waitFor();assert.match(await form.locator('.ip-form-success').innerText(),/has not sent a request/);
  });
  await check(`${width}: contact dialog focus, escape and form lifecycle`,async()=>{
   await visit('/contact');const trigger=page.locator('.ip-contact .ip-centered button');await trigger.focus();await trigger.press('Enter');const modal=page.getByRole('dialog',{name:'Submit an Inquiry'});await modal.waitFor();assert(await modal.evaluate(el=>el.contains(document.activeElement)));assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
   const focusable=modal.locator('button,a[href],input,select,textarea');await focusable.last().focus();await page.keyboard.press('Tab');assert(await focusable.first().evaluate(el=>el===document.activeElement));await page.keyboard.press('Shift+Tab');assert(await focusable.last().evaluate(el=>el===document.activeElement));
   await page.keyboard.press('Escape');await modal.waitFor({state:'hidden'});assert(await trigger.evaluate(el=>el===document.activeElement));assert.notEqual(await page.evaluate(()=>document.body.style.overflow),'hidden');await trigger.press('Enter');await modal.waitFor();await formFlow(modal.locator('form'));await page.keyboard.press('Escape');await modal.waitFor({state:'hidden'});
  });
 }
}finally{await browser.close();const output={passed:errors.length===0&&results.every(x=>x.passed),results,errors,remoteMedia:'Stubbed; interaction verification only'};await fs.writeFile(new URL('./qa-new-interactions-results.json',import.meta.url),JSON.stringify(output,null,2));console.log(JSON.stringify(output,null,2));if(!output.passed)process.exitCode=1}
