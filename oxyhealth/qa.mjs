import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/Administration/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dist=fileURLToPath(new URL('./dist/',import.meta.url));
const origin='https://aeris.local';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[],results=[];
page.on('pageerror',error=>errors.push(String(error)));
page.on('requestfailed',request=>errors.push(request.url()+': '+request.failure()?.errorText));
await page.emulateMedia({reducedMotion:'reduce'});

// Deterministic offline checks. Original media likeness is assessed by rebuild_check.
await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.origin!==origin){
    const image=route.request().resourceType()==='image';
    return route.fulfill({contentType:image?'image/svg+xml':'text/css',body:image?'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#e8e8ed"/></svg>':''});
  }
  const pathname=decodeURIComponent(url.pathname);
  const local=pathname.endsWith('/')?pathname+'index.html':path.extname(pathname)?pathname:pathname+'/index.html';
  try{
    const body=await fs.readFile(path.join(dist,local));
    await route.fulfill({body,contentType:({'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json'})[path.extname(local)]||'text/html'});
  }catch(error){
    errors.push(`Missing local file ${local}: ${error.message}`);
    await route.fulfill({status:404,body:'Not found'});
  }
});

try{
  for(const width of [1440,768,390]){
    await page.setViewportSize({width,height:900});
    const response=await page.goto(origin+'/',{waitUntil:'networkidle',timeout:25000});
    assert.equal(response.status(),200,'Homepage must return HTTP 200');
    await page.locator('main h1').waitFor();
    const layout=await page.evaluate(()=>({
      scroll:document.documentElement.scrollWidth,width:innerWidth,
      mainCount:document.querySelectorAll('main').length,
      headingCount:document.querySelectorAll('main h1').length,
      heading:document.querySelector('main h1')?.textContent,
      sections:[...document.querySelectorAll('main>section')].map(section=>({title:section.querySelector('h1,h2')?.textContent,y:Math.round(section.getBoundingClientRect().top+scrollY),h:Math.round(section.offsetHeight)})),
    }));
    assert.equal(layout.mainCount,1,'Homepage must contain one main region');
    assert.equal(layout.headingCount,1,'Homepage must contain one main heading');
    assert(layout.heading?.trim(),'Homepage heading must not be empty');
    assert(layout.scroll<=width,`Homepage overflows at ${width}px: ${layout.scroll}px`);
    await page.screenshot({path:fileURLToPath(new URL(`./qa-${width}.png`,import.meta.url))});
    results.push({width,title:await page.title(),layout,passed:true});
  }
}catch(error){
  errors.push(error.stack||String(error));
}finally{
  await browser.close();
  console.log(JSON.stringify({passed:errors.length===0,scope:'Offline homepage structure and layout; remote media stubbed.',results,errors},null,2));
  if(errors.length)process.exitCode=1;
}
