import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {allRoutes} from './route-manifest.mjs';
import {productLinks} from './navigation-data.mjs';

// This regression reads the acceptance contract itself, not only the route manifest.
// Serve exact production files (no SPA fallback); media is stubbed, so this checks
// navigation semantics and document lifecycles, not original-site visual parity.
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/Administration/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin='https://oxyhealth.local';
const dist=fileURLToPath(new URL('./dist/',import.meta.url));
const checklistText=await fs.readFile(new URL('../ACCEPTANCE-CHECKLIST.md',import.meta.url),'utf8');
const contractSection=checklistText.split('## 一、')[1]?.split('## 二、')[0];
assert(contractSection,'The original-page URL section must exist in ACCEPTANCE-CHECKLIST.md');
const checklistPaths=[...new Set([...contractSection.matchAll(/(?:^|[\s：·（(])((?:\/[a-z0-9][a-z0-9-]*)+)/gm)].map(match=>match[1]))];
const recordedPaths=JSON.parse(await fs.readFile(new URL('./acceptance-routes.json',import.meta.url),'utf8'));
const errors=[],scans=[],fragments=[],entries=[],semantics=[],externalEntries=[];
const progress={startedAt:new Date().toISOString(),completed:0,passed:0,failed:0};
const routeMap=new Map(allRoutes.map(route=>[route.path,route]));
const normalizePath=value=>value.replace(/\/+$/,'')||'/';
const productPattern=/\b(?:Fortius 420(?: EXP)?|Respiro 270|Vitaeris 320|Quamvis 320)\b/i;
// Exact source-recorded fragment destinations, independently read from captures.
const liveFragments=[];
for(const entry of JSON.parse(await fs.readFile(new URL('./live-source-audit.json',import.meta.url),'utf8')).results){
 const capture=JSON.parse(await fs.readFile(new URL('./inspection/live-20261113/'+entry.path.slice(1).replaceAll('/','__')+'/capture.json',import.meta.url),'utf8'));
 for(const link of capture.links){const url=new URL(link.href,capture.url);if(url.hash&&url.hostname.endsWith('oxyhealth.com'))liveFragments.push({from:entry.path,target:url.pathname,hash:url.hash,label:link.text.replace(/\s+/g,' ').trim()});}
}
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
page.setDefaultTimeout(10000);
await page.emulateMedia({reducedMotion:'reduce'});
page.on('pageerror',error=>errors.push({kind:'pageerror',url:page.url(),error:String(error)}));
await page.context().route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.origin!==origin){
    const image=route.request().resourceType()==='image';
    return route.fulfill({contentType:image?'image/svg+xml':route.request().resourceType()==='document'?'text/html':'text/css',body:image?'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#e8e8ed"/></svg>':'<!doctype html><title>Offline external destination</title>'});
  }
  const pathname=decodeURIComponent(url.pathname);
  const local=pathname.endsWith('/')?pathname+'index.html':path.extname(pathname)?pathname:pathname+'/index.html';
  try{
    await route.fulfill({body:await fs.readFile(path.join(dist,local)),contentType:({'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.txt':'text/plain'})[path.extname(local)]||'text/html'});
  }catch(error){
    errors.push({kind:'missing-file',path:local,error:error.message});
    await route.fulfill({status:404,body:'Not found'});
  }
});

async function check(name,run){
  const started=Date.now(),errorCount=errors.length;
  const writeProgress=status=>fs.writeFile(new URL('./qa-navigation-progress.json',import.meta.url),JSON.stringify({
    ...progress,updatedAt:new Date().toISOString(),width:page.viewportSize()?.width,
    lastCheck:name,status,currentUrl:page.url(),elapsedMs:Date.now()-started,
    errorCount:errors.length,errors:errors.map(error=>({name:error.name||error.kind,width:error.width,error:String(error.error).split('\n')[0]})),
  },null,2));
  await writeProgress('running');
  try{await run();}
  catch(error){errors.push({name,width:page.viewportSize()?.width,error:error.stack});}
  finally{
    const passed=errors.length===errorCount;
    progress.completed++;progress[passed?'passed':'failed']++;
    console.error(`[${page.viewportSize()?.width}] ${passed?'PASS':'FAIL'} ${name} (${Date.now()-started}ms)`);
    await writeProgress(passed?'passed':'failed');
  }
}
async function visit(target){
  const response=await page.goto(origin+target,{waitUntil:'load'});
  assert.equal(response.status(),200,`Direct visit must serve a real file: ${target}`);
  await page.locator('main h1').waitFor();
}
async function navigation(link,target,source){
  const from=new URL(page.url()).pathname;
  assert.equal(await link.count(),1,`${source}: expected one specific link`);
  assert.equal(await link.getAttribute('href'),target,`${source}: wrong destination`);
  await page.evaluate(()=>{window.__navigationRegressionMarker=true;});
  const [response]=await Promise.all([
    page.waitForResponse(response=>response.request().isNavigationRequest()&&response.request().frame()===page.mainFrame()),
    link.click(),
  ]);
  await page.waitForURL(url=>url.pathname===target&&!url.hash);
  await page.locator('main h1').waitFor();
  assert.equal(response.status(),200,`${source}: navigation response`);
  assert.equal(await page.evaluate(()=>Boolean(window.__navigationRegressionMarker)),false,`${source}: must load a new document`);
  assert.equal(await page.locator('[role="dialog"]').count(),0,`${source}: detail must not be a modal`);
  assert.equal(await page.locator('html').getAttribute('data-page-template'),routeMap.get(target).template);
  const reload=await page.reload({waitUntil:'load'});
  assert.equal(reload.status(),200,`${source}: refresh must serve the detail file`);
  await page.locator('main h1').waitFor();
  await page.goBack({waitUntil:'load'});
  await page.locator('main h1').waitFor();
  assert.equal(new URL(page.url()).pathname,from,`${source}: browser Back must return to the source page`);
  entries.push({source,from,target,width:page.viewportSize().width,passed:true,checks:['click','new document','correct URL','HTTP 200','template','no dialog','refresh','back']});
}

async function externalNavigation(link,target,source){
  const from=page.url();
  assert.equal(await link.count(),1,`${source}: expected one external link`);
  assert.equal(await link.getAttribute('href'),target,`${source}: original external URL`);
  assert.equal(await link.getAttribute('target'),'_blank',`${source}: original new-tab behavior`);
  const [popup]=await Promise.all([page.waitForEvent('popup'),link.click()]);
  try{
    await popup.waitForLoadState('domcontentloaded');
    assert.equal(popup.url(),new URL(target).href,`${source}: popup must reach original destination`);
    assert.equal(page.url(),from,`${source}: original page stays open`);
    assert.equal(await page.locator('[role="dialog"]').count(),0,`${source}: external page must not become an inquiry dialog`);
    externalEntries.push({source,from:new URL(from).pathname,target,width:page.viewportSize().width,passed:true,checks:['original href','new tab','popup URL','no modal','original page retained'],network:'stubbed'});
  }finally{await popup.close();}
}

// Explicitly legitimate section navigation. A hash is not automatically accepted
// merely because a matching id exists (that was why the ATA defect escaped QA).
function fragmentPurpose(from,target,hash,label){
  if(liveFragments.some(item=>item.from===from&&item.target===target&&item.hash===hash&&item.label===label.replace(/\s+/g,' ').trim()))return '2026-11-13 live source recorded section link';
  // Source outline: cost page's pricing CTA leads to its own inquiry form.
  if(from===target&&target==='/hyperbaric-chamber-cost'&&hash==='#pricing'&&label==='Get Pricing and Financing Options')return 'Source-evidenced pricing inquiry form on current page';
  if(target==='/'&&hash==='#products'&&!productPattern.test(label))return 'Home product overview';
  if(target==='/resources'&&hash==='#videos')return 'Resources video section';
  if(from===target&&target.startsWith('/post/')&&/^#article-section-\d+$/.test(hash))return 'Article table of contents';
  if(from===target&&target.startsWith('/blog/')&&/^#article-section-\d+$/.test(hash))return 'Article table of contents';
  if(from===target&&target==='/documents/terms-conditions'&&/^#document-section-\d+$/.test(hash))return 'Terms table of contents';
  if(from===target&&target==='/support'&&hash==='#service-request')return 'Service form on current page';
  if(from===target&&target==='/partners'&&hash==='#partner-inquiry')return 'Partnership form on current page';
  return null;
}

try{
  assert.deepEqual([...recordedPaths].sort(),[...checklistPaths].sort(),'Saved route inventory must agree with the current acceptance contract');
  assert.equal(routeMap.size,allRoutes.length,'Route paths must be unique');
  for(const target of checklistPaths)assert(routeMap.has(target),`Missing checklist URL: ${target}`);

  for(const width of [1440,390]){
    await page.setViewportSize({width,height:900});
    const pages=new Map();
    // Scan every entry on every generated page, including links hidden in menus.
    for(const route of allRoutes)await check(`scan ${route.path}`,async()=>{
      await visit(route.path);
      const data=await page.evaluate(()=>({
        ids:[...document.querySelectorAll('[id]')].map(el=>el.id),
        links:[...document.querySelectorAll('a')].map(el=>({href:el.getAttribute('href'),label:(el.textContent||el.getAttribute('aria-label')||'').trim(),download:el.hasAttribute('download')})),
        buttons:[...document.querySelectorAll('button')].map(el=>({label:el.textContent.trim(),videoControl:Boolean(el.closest('.sr-video-card')),sourceFAQ:Boolean(el.closest('.captured-source')&&el.hasAttribute('aria-expanded')&&document.getElementById(el.getAttribute('aria-controls')))})),
      }));
      pages.set(route.path,data);
      // Resource videos name the equipment in their titles; these are verified
      // video controls, not substituted product-detail entry points.
      for(const {label,videoControl,sourceFAQ} of data.buttons)assert(videoControl||sourceFAQ||!productPattern.test(label),`${route.path}: a product entry must be a link, not a button/modal: ${label}`);
      for(const link of data.links){
        assert(link.href?.trim()&&link.href.trim()!=='#',`${route.path}: empty/hash-placeholder entry: ${link.label}`);
        assert(!/^javascript:/i.test(link.href),`${route.path}: JavaScript placeholder: ${link.label}`);
        if(link.download||/^(tel:|mailto:|data:)/.test(link.href))continue;
        const url=new URL(link.href,origin+route.path);
        if(url.origin!==origin)continue;
        const target=normalizePath(url.pathname);
        assert(routeMap.has(target),`${route.path}: unregistered destination ${link.href}`);
        if(url.hash){
          assert(!productPattern.test(link.label),`${route.path}: product detail incorrectly replaced by a section link: ${link.label}`);
          const purpose=fragmentPurpose(route.path,target,url.hash,link.label);
          assert(purpose,`${route.path}: section entry requires explicit original-behavior review: ${link.label} -> ${link.href}`);
          fragments.push({from:route.path,target,hash:url.hash,label:link.label,purpose,width,passed:false});
        }
      }
      scans.push({path:route.path,width,linkCount:data.links.length,passed:true});
    });
    for(const fragment of fragments.filter(item=>item.width===width))await check(`fragment ${fragment.from} -> ${fragment.target}${fragment.hash}`,async()=>{
      assert(pages.get(fragment.target)?.ids.includes(decodeURIComponent(fragment.hash.slice(1))),`Missing fragment target: ${fragment.target}${fragment.hash}`);
      fragment.passed=true;
    });

    // Test the five individual ATA links, not just existence of product routes.
    for(const [label,target] of productLinks)await check(`ATA ${label}`,async()=>{
      await visit('/');
      const link=page.locator('.pressure-section').getByRole('link',{name:label,exact:true});
      await page.locator('.pressure-section').evaluate(el=>window.scrollTo(0,el.offsetTop));
      await navigation(link,target,`ATA: ${label}`);
    });
    await check('ATA independent link count',async()=>{
      await visit('/');
      assert.equal(await page.locator('.pressure-section a').count(),5);
      semantics.push({name:'Five separate ATA product links',width,passed:true});
    });

    // Every required URL must have a working entry on the home page. Prefer the
    // always-visible footer; selected main links cover the article/event details.
    for(const target of checklistPaths)await check(`checklist entry ${target}`,async()=>{
      await visit('/');
      const footer=page.locator(`.sh-footer a[href="${target}"]`).first();
      const link=await footer.count()?footer:page.locator(`main a[href="${target}"],header a[href="${target}"]`).first();
      await navigation(link,target,'Checklist home entry');
    });

    const homePageEntries=[
      ['.manifesto .story-link','/why-oxyhealth','Brand story'],
      ['.product-categories a:nth-child(1)','/hyperbaric-chamber-for-sale','Chambers for sale'],
      ['.product-categories a:nth-child(2)','/home-hyperbaric-chamber','Home chambers'],
      ['.product-categories a:nth-child(3)','/portable-hyperbaric-chamber','Portable chambers'],
      ['.product-categories a:nth-child(4)','/best-hyperbaric-chamber','Choose a chamber'],
      ['.product-categories a:nth-child(5)','/hyperbaric-chamber-cost','Cost and financing'],
      ['.hl-finance a.hl-button','/finance','Explore Payment Options'],
    ];
    for(const [selector,target,label] of homePageEntries)await check(label,async()=>{
      await visit('/');await navigation(page.locator(selector),target,label);
    });
    await check('Hyperbarics veterinary research entry',async()=>{
      await visit('/hyperbarics');
      await navigation(page.locator('main').getByRole('link',{name:'Explore resources →',exact:true}),'/hyperbaric-therapy-veterinary','Hyperbarics veterinary research');
    });
    await check('Homepage telephone and quote entry semantics',async()=>{
      await visit('/');
      for(const selector of ['.product-help a','.hl-step-actions a:first-child','.hl-contact-actions a:first-child','.hl-contact-cards a:first-child']){
        const link=page.locator(selector);
        assert.equal(await link.count(),1,`${selector}: telephone entry must be an anchor`);
        assert.match((await link.getAttribute('href')).replaceAll('-',''),/^tel:(?:\+1)?5629068888$/,`${selector}: must call the original telephone target`);
      }
      const quote=page.locator('.product-help button[data-quote]');
      assert.equal(await quote.count(),1,'Product help quote must use the actual quote control');
      await quote.click();
      await page.locator('.sh-quote-modal').waitFor();
      assert.equal(new URL(page.url()).pathname,'/');
      assert.equal(new URL(page.url()).hash,'');
      await page.keyboard.press('Escape');
      await page.locator('.sh-quote-modal').waitFor({state:'hidden'});
      semantics.push({name:'Telephone links and original quote modal',width,passed:true});
    });
    await check('Original external event registration',async()=>{
      await visit('/');
      const register=page.locator('.hl-event-actions a').nth(1);
      await externalNavigation(register,'https://www.a4m.com/longevity-fest-2026/index.html','Home event registration');
    });
    // URLs independently pinned to original capture evidence, not imported from
    // application routing data (a wrong shared constant must fail the regression).
    for(const [label,target] of [
      ['TikTok','https://www.tiktok.com/@oxyhealth'],
      ['Facebook','https://www.facebook.com/oxyhealthllc'],
      ['YouTube','https://www.youtube.com/@OxyHealthLLC'],
      ['Instagram','https://www.instagram.com/oxyhealth'],
    ])await check(`Footer ${label}`,async()=>{
      await visit('/');
      await externalNavigation(page.locator('.sh-socials').getByRole('link',{name:label,exact:true}),target,`Footer ${label}`);
    });
    await check('Footer original sitemap and humans destinations',async()=>{
      await visit('/');
      for(const [label,target] of [
        ['Sitemap','https://www.oxyhealth.com/sitemap.xml'],
        ['About this site','https://www.oxyhealth.com/humans.txt'],
      ]){
        const link=page.locator('.sh-copyright').getByRole('link',{name:label,exact:true});
        assert.equal(await link.count(),1);
        assert.equal(await link.getAttribute('href'),target,`${label}: original file URL`);
        assert([null,'','_self'].includes(await link.getAttribute('target')),`${label}: original same-tab behavior`);
      }
      semantics.push({name:'Footer sitemap and humans original file URLs and same-tab behavior',width,passed:true});
    });
    const eventDestinations=[
      'https://shop.lymebytes.com/',
      'https://www.a4m.com/longevity-fest-2026/index.html',
      'https://beyondconference.com/',
      'https://ahsconference.com/',
      'https://www.a4m.com/spring-exhibit-2026.html',
      'https://www.medmaps.org/events/spring2026/',
    ];
    for(const [index,target] of eventDestinations.entries())await check(`Event registration ${index+1}`,async()=>{
      await visit('/events/a4m-longevity-fest');
      await externalNavigation(page.locator(`.sr-event-${index} .sr-event-buttons a`).first(),target,`Event detail registration ${index+1}`);
    });
    for(const [index,target] of eventDestinations.entries())await check(`Event list registration ${index+1}`,async()=>{
      await visit('/events/events');
      await externalNavigation(page.locator('.ip-event-card').nth(index).getByRole('link',{name:'Conference Website ↗',exact:true}),target,`Event list registration ${index+1}`);
    });
    await check('Finance original external destinations',async()=>{
      await visit('/finance');
      const financing=page.locator('.ip-hero').getByRole('link',{name:'Explore Financing',exact:true});
      assert.equal(await financing.getAttribute('href'),'https://partners.brickhousecapital.com/oxyhealth/');
      const pricing=page.getByRole('link',{name:'Get Pricing and Financing Options →',exact:true});
      assert.equal(await pricing.getAttribute('href'),'https://www.oxyhealth.com/get-pricing');
      semantics.push({name:'Finance original application and pricing URLs',width,passed:true});
    });
    await check('Event detail telephone action',async()=>{
      await visit('/events/a4m-longevity-fest');
      const telephone=page.locator('.sr-events-hero a.sr-button');
      assert.equal(await telephone.count(),1);
      assert.match((await telephone.getAttribute('href')).replaceAll('-',''),/^tel:(?:\+1)?5629068888$/);
      semantics.push({name:'Event detail telephone action',width,passed:true});
    });
  }
}catch(error){errors.push({name:'setup',error:error.stack});}
finally{
  const checklist=checklistPaths.map(target=>({target,registered:routeMap.has(target),widths:[1440,390].map(width=>({width,passed:entries.some(entry=>entry.source==='Checklist home entry'&&entry.target===target&&entry.width===width)}))}));
  const report={passed:!errors.length,scope:'Offline production files; full document navigation. External destinations are checked for original URL/opening semantics, not contacted; media/visual parity is separate.',checklistSource:'../ACCEPTANCE-CHECKLIST.md section 1',checklist,scans,fragments,entries,externalEntries,semantics,errors};
  await fs.writeFile(new URL('./qa-navigation-results.json',import.meta.url),JSON.stringify(report,null,2));
  console.log(JSON.stringify({passed:report.passed,checklistUrls:checklist.length,routeScans:scans.length,fragmentChecks:fragments.length,entryFlows:entries.length,externalFlows:externalEntries.length,semanticChecks:semantics.length,errors},null,2));
  await browser.close();
  if(errors.length)process.exitCode=1;
}
