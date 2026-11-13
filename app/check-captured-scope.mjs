import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {capturedMain} from './captured-source-utils.mjs';
const require=createRequire(import.meta.url);const{chromium}=require('C:/Users/Administration/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const pages=await Promise.all([browser.newPage(),browser.newPage()]);
for(const page of pages){await page.route('**/*',r=>r.fulfill({status:200,contentType:'text/css',body:''}));await page.emulateMedia({reducedMotion:'reduce'});}
const original=(await fs.readFile('inspection/live-20261113/original.css','utf8')).replace(/@font-face\{[^}]*\}/g,'');
const scoped=await fs.readFile('captured-source.css','utf8');const theme=await fs.readFile('theme.css','utf8');
const html=capturedMain(await fs.readFile('inspection/live-20261113/home-hyperbaric-chamber/page.html','utf8'));
const rows=[];
for(const width of [1440,768,390]){
 for(const page of pages)await page.setViewportSize({width,height:900});
 await pages[0].setContent('<style>'+original+'</style><main>'+html+'</main>');
 await pages[1].setContent('<style>'+theme+'\n'+scoped+'</style><main class="captured-source">'+html+'</main>');
 const samples=await Promise.all(pages.map(page=>page.evaluate(()=>[...document.querySelectorAll('main section,main h1,main h2,main h3')].map(el=>{const b=el.getBoundingClientRect(),s=getComputedStyle(el);return {tag:el.tagName,x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height),bg:s.backgroundColor,color:s.color,font:s.fontSize,padding:s.padding,lh:s.lineHeight};}))));
 const differences=samples[0].flatMap((expected,i)=>JSON.stringify(expected)===JSON.stringify(samples[1][i])?[]:[{i,expected,actual:samples[1][i]}]);rows.push({width,differences});
}
await browser.close();const result={tested_at:new Date().toISOString(),scope:"Offline source CSS versus scoped CSS, home landing only; fonts and images stubbed identically",passed:rows.every(row=>!row.differences.length),rows};await fs.writeFile("captured-scope-check.json",JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
