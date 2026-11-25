import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/Administration/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const directory=fileURLToPath(new URL('./',import.meta.url));
const dist=path.join(directory,'dist');
const origin='https://aeris.local';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
await page.emulateMedia({reducedMotion:'reduce'});
const results=[],errors=[];
page.on('pageerror',error=>errors.push(error.message));
await page.route('**/*',async route=>{
 const url=new URL(route.request().url());
 if(url.origin!==origin)return route.fulfill({contentType:route.request().resourceType()==='image'?'image/svg+xml':'text/css',body:route.request().resourceType()==='image'?'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><rect width="1200" height="900" fill="#555"/></svg>':''});
 const pathname=decodeURIComponent(url.pathname);
 const local=path.extname(pathname)?pathname:pathname.replace(/\/$/,'')+'/index.html';
 try{await route.fulfill({body:await fs.readFile(path.join(dist,local)),contentType:({'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(local)]||'text/html'});}catch{await route.fulfill({status:404,body:'Not found'});}
});
const expected=[
 ['respiro-270','Respiro 270 Portable Hyperbaric Chamber for Home',8,6,false],
 ['vitaeris-320','Vitaeris 320 Portable Home Hyperbaric Chamber',8,6,false],
 ['quamvis-320','Quamvis 320',12,0,false],
 ['fortius-420','Fortius 420',7,0,true],
 ['fortius-420-exp','Fortius 420 EXP',7,0,true]
];
try{
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:900});
  for(const [slug,title,faqCount,includedCount,clinical] of expected){
   const response=await page.goto(origin+'/products/'+slug,{waitUntil:'networkidle'});
   await page.locator('main h1').waitFor();
   assert.equal(response.status(),200);
   assert.equal(await page.locator('main h1').count(),1);
   assert.equal(await page.locator('main h1').textContent(),title);
   assert.equal(await page.locator('main .pa-breadcrumb').count(),0,'Product hero must not use the old breadcrumb template');
   assert.equal(await page.locator('.pd-labels>span').count(),2);
   assert.equal(await page.locator('.pd-labels>span').last().textContent(),'FDA 510(k)-Cleared');
   assert.equal(await page.locator('.pd-metrics>div').count(),4);
   assert.equal(await page.locator('.pd-gallery img').count(),6);
   assert.equal(await page.locator('.pd-included-cards figure').count(),includedCount);
   assert.equal(await page.locator('[data-product-section="installation"]').count(),clinical?1:0);
   assert.equal(await page.locator('[data-product-section="included"]').count(),clinical?0:1);
   assert.equal(await page.locator('.pd-faq details').count(),faqCount);
   assert.equal(await page.locator('.pd-dimensions').count(),1);
   assert.equal(await page.locator('.pd-hero .pd-actions a').getAttribute('href'),'tel:5629068888');
   assert.equal(await page.locator('.pd-hero .pd-why').getAttribute('href'),'/why-oxyhealth');
   const layout=await page.evaluate(()=>{
    const hero=document.querySelector('.pd-hero'),title=document.querySelector('main h1'),image=document.querySelector('.pd-hero-image'),intro=document.querySelector('.pd-intro');
    const box=element=>{const r=element.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
    return {fontFamily:getComputedStyle(document.querySelector('.pd-lead')).fontFamily,background:getComputedStyle(hero).backgroundColor,titleColor:getComputedStyle(title).color,title:box(title),image:box(image),intro:box(intro),lineHeight:parseFloat(getComputedStyle(title).lineHeight),scrollWidth:document.documentElement.scrollWidth,width:innerWidth};
   });
   assert.equal(layout.background,'rgb(11, 11, 13)');
   assert.equal(layout.titleColor,'rgb(245, 245, 247)');
   assert.ok(layout.scrollWidth<=width+1,'No horizontal overflow');
   if(width>=768)assert.ok(layout.image.x>=layout.intro.right,'Desktop hero photograph sits to the right');
   else assert.ok(layout.image.y>=layout.intro.bottom,'Mobile hero photograph stacks after content');
   if(slug==='respiro-270')assert.ok(layout.title.height/layout.lineHeight>=3,'Full Respiro title retains multiple lines');
   const faq=page.locator('.pd-faq summary').first();await faq.click();assert.equal(await page.locator('.pd-faq details').first().getAttribute('open'),'');
   if(slug==='respiro-270'){
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:path.join(directory,'qa-products-respiro-'+width+'.png')});
   }
   results.push({slug,width,passed:true,layout});
  }
 }
 assert.deepEqual(errors,[]);
}catch(error){results.push({passed:false,error:error.message});process.exitCode=1;}
finally{await browser.close();}
const report={checkedAt:new Date().toISOString(),passed:results.every(r=>r.passed)&&errors.length===0,scope:'Local product structure, responsive geometry and FAQ behavior. Original screenshot/computed-style comparison remains unverified.',results,errors};
await fs.writeFile(path.join(directory,'qa-products-results.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({passed:report.passed,checks:results.length,errors,failures:results.filter(r=>!r.passed)}));
