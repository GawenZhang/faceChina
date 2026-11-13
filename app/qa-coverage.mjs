import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {allRoutes} from './route-manifest.mjs';
import {productLinks,guideLinks,topicLinks,articleLinks} from './navigation-data.mjs';

const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/Administration/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dist=fileURLToPath(new URL('./dist/',import.meta.url));
const origin='https://oxyhealth.local';
const required=JSON.parse(await fs.readFile(new URL('./acceptance-routes.json',import.meta.url),'utf8'));
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
page.setDefaultTimeout(10000);
await page.emulateMedia({reducedMotion:'reduce'});
const errors=[],results=[],routeResults=[],entryResults=[];
page.on('pageerror',error=>errors.push(String(error)));
// Serve exact generated files, without an SPA fallback. Remote images are placeholders
// for deterministic offline layout checks; original media/visual parity is separate.
await page.route('**/*',async route=>{
 const url=new URL(route.request().url());
 if(url.origin!==origin){
  const image=route.request().resourceType()==='image';
  return route.fulfill({contentType:image?'image/svg+xml':'text/css',body:image?'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#e8e8ed"/></svg>':''});
 }
 const pathname=decodeURIComponent(url.pathname);
 const local=pathname.endsWith('/')?pathname+'index.html':path.extname(pathname)?pathname:pathname+'/index.html';
 try{const body=await fs.readFile(path.join(dist,local));await route.fulfill({body,contentType:({'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json'})[path.extname(local)]||'text/html'});}
 catch(error){errors.push('Missing local file: '+local);await route.fulfill({status:404,body:'Not found'});}
});
await fs.mkdir(new URL('./qa-coverage/',import.meta.url),{recursive:true});
async function visit(url){await page.goto(origin+url,{waitUntil:'load'});await page.locator('main h1').waitFor();}
async function layout(route,width){
 const info=await page.evaluate(()=>({heading:document.querySelector('main h1')?.textContent,mainCount:document.querySelectorAll('main').length,headingCount:document.querySelectorAll('main h1').length,width:document.documentElement.scrollWidth,viewport:innerWidth,sections:document.querySelectorAll('main h2').length,template:document.documentElement.dataset.pageTemplate,height:document.querySelector('main')?.offsetHeight}));
 assert(info.heading?.trim(),`Missing heading ${route.path}`);
 assert.equal(info.mainCount,1);assert.equal(info.headingCount,1);
 assert.equal(info.template,route.template);
 assert(info.width<=width,`${route.path} overflows at ${width}: ${info.width}`);
 assert(info.height>200,`${route.path} empty body`);
 return info;
}
async function fullNavigation(selector,target){
 const from=new URL(page.url()).pathname;
 const link=page.locator(selector).first();
 assert.equal(await link.getAttribute('href'),target);
 await page.evaluate(()=>{window.__documentMarker=true});
 await link.click();await page.waitForURL(url=>url.pathname===target);await page.locator('main h1').waitFor();
 assert.equal(await page.evaluate(()=>!!window.__documentMarker),false,'Expected complete document navigation');
 assert.equal(await page.locator('[role="dialog"]').count(),0,'Detail is not a dialog');
 await page.reload({waitUntil:'load'});await page.locator('main h1').waitFor();
 await page.goBack({waitUntil:'load'});await page.locator('main h1').waitFor();
 assert.equal(new URL(page.url()).pathname,from);
 entryResults.push({from,target,width:page.viewportSize().width,passed:true,checks:'click, document navigation, URL, refresh, back'});
}
try{
 assert(required.every(url=>allRoutes.some(route=>route.path===url)),'Every checklist URL must be registered');
 // 1. Each distinct template is checked before entry-link testing.
 const representativeMap=new Map();
 for(const route of allRoutes)if(!representativeMap.has(route.template))representativeMap.set(route.template,route);
 const representatives=[...representativeMap.values(),allRoutes.find(route=>route.path==='/post/hyperbaric-oxygen-therapy-for-longevity')];
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:900});
  for(const route of representatives){
   await visit(route.path);const info=await layout(route,width);
   assert(info.sections>0,`No body sections for ${route.path}`);
   if(width!==768)await page.screenshot({path:fileURLToPath(new URL(`./qa-coverage/${route.template}-${width}.png`,import.meta.url)),fullPage:true});
   results.push({stage:'representative',path:route.path,width,...info,passed:true});
  }
 }
 // 2. Exact-file reachability and mobile/desktop structure of every route.
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});
  for(const route of allRoutes){
   await visit(route.path);await layout(route,width);
   const internal=await page.locator('a[href]').evaluateAll(links=>links.map(a=>a.getAttribute('href')).filter(h=>h.startsWith('/')&&!h.startsWith('//')));
   for(const href of internal){const dest=href.split(/[?#]/)[0].replace(/\/$/,'')||'/';assert(allRoutes.some(r=>r.path===dest)||path.extname(dest),`${route.path}: unregistered link ${href}`);}
   routeResults.push({path:route.path,width,passed:true});
  }
  // 3. Entry semantics and real navigation, after templates pass.
  await visit('/');
  for(const [label,target] of [...productLinks,...guideLinks,...topicLinks,...articleLinks]){
   const hrefs=await page.locator('.sh-footer a').filter({hasText:label}).evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
   assert(hrefs.includes(target),`Footer link ${label} must point to ${target}`);
  }
  const cards=await page.locator('.product-card').evaluateAll(nodes=>nodes.map(n=>({href:n.getAttribute('href'),text:n.textContent})));
  assert.equal(cards.length,5);assert.equal(new Set(cards.map(c=>c.href)).size,5);
  for(const {href,text} of cards){assert(/Learn more/.test(text));assert(productLinks.some(([,url])=>url===href));await fullNavigation(`.product-card[href="${href}"]`,href);}
  if(width===1440){await page.getByRole('button',{name:'Products',exact:true}).focus();await page.keyboard.press('Enter');await page.locator('.sh-product-menu').waitFor();await fullNavigation('.sh-product-menu a','/products/fortius-420');}
  else{await page.getByRole('button',{name:'Toggle mobile menu'}).click();await page.getByRole('dialog',{name:'Navigation menu'}).waitFor();await fullNavigation('.sh-mobile-products a','/products/fortius-420');}
  await visit('/blog');
  const articles=await page.locator('.sr-blog-card .sr-read').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
  assert(articles.length>=7);assert.equal(new Set(articles).size,articles.length,'Each blog card has a unique detail URL');
  const titleLinks=await page.locator('.sr-blog-card h2 a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));assert.deepEqual(titleLinks,articles,'Article title and read link must share the correct destination');
  for(const target of articles)await fullNavigation(`.sr-blog-card .sr-read[href="${target}"]`,target);
  await visit('/events/events');
  await fullNavigation('main a[href="/events/a4m-longevity-fest"]','/events/a4m-longevity-fest');
 }
 // Trailing slash must select the same template when a static host redirects.
 await visit('/products/fortius-420/');assert.equal(new URL(page.url()).pathname,'/products/fortius-420/');
 assert.equal(await page.locator('main h1').count(),1);
}catch(error){errors.push(error.stack);process.exitCode=1;}
finally{
 const report={passed:errors.length===0,scope:'Offline generated static pages; remote media stubbed. Does not certify visual parity with uncaptured originals.',representatives:results,routes:routeResults,entries:entryResults,errors};
 await fs.writeFile(new URL('./qa-coverage/results.json',import.meta.url),JSON.stringify(report,null,2));
 console.log(JSON.stringify({passed:report.passed,representativeChecks:results.length,routeChecks:routeResults.length,entryFlows:entryResults.length,errors},null,2));
 await browser.close();if(errors.length)process.exitCode=1;
}
