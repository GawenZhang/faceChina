import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/Administration/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];
page.on('pageerror',e=>errors.push(String(e)));
await page.route('https://aeris.local/**',async route=>{
  let file=new URL(route.request().url()).pathname;
  if(!path.extname(file))file+='/index.html';
  try{
    const body=await fs.readFile(path.join('dist',file));
    const ext=path.extname(file);
    await route.fulfill({body,contentType:ext==='.js'?'text/javascript':ext==='.css'?'text/css':ext==='.woff2'?'font/woff2':'text/html'});
  }catch{await route.fulfill({status:404,body:'Not found'});}
});
const results=[];
try{
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:900});
    await page.goto('https://aeris.local/',{waitUntil:'networkidle'});
    for(let index=0;index<3;index++){
      const detail=page.locator('.hl-question').nth(index);
      const control=detail.locator('summary');
      await control.click();
      await page.waitForTimeout(250);
      const isOpen=await detail.evaluate(el=>el.open);
      const answerVisible=await detail.locator('[role="region"]').isVisible();
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
      results.push({width,index,label:await control.textContent(),isOpen,answerVisible,overflow});
      if(!isOpen||!answerVisible||overflow)throw new Error('FAQ open or overflow check failed');
      await page.screenshot({path:`qa-faq-${width}-${index+1}.png`});
      await control.click();
      if(await detail.evaluate(el=>el.open))throw new Error('FAQ did not close');
    }
    await page.locator('.hl-question summary').first().focus();
    await page.keyboard.press('Enter');
    if(!await page.locator('.hl-question').first().evaluate(el=>el.open))throw new Error('Keyboard FAQ interaction failed');
    await page.locator('.hl-question summary').nth(1).click();
    if(await page.locator('.hl-question[open]').count()!==2)throw new Error('Independent disclosure behavior failed');
  }
  if(errors.length)throw new Error(errors.join('\n'));
  console.log(JSON.stringify({passed:true,results,errors},null,2));
}finally{await browser.close();}
