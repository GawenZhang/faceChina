// Preserve the authorized page content while adding local story-state hooks.
import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {capturedMain} from './captured-source-utils.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/Administration/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const source=await readFile(new URL('./inspection/live-20261113/why-oxyhealth/page.html',import.meta.url),'utf8');
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
await page.route('**/*',route=>route.abort());
await page.setContent('<main>'+capturedMain(source)+'</main>');
const html=await page.evaluate(()=>{
 const main=document.querySelector('main');
 const hero=main.querySelector('section');
 hero.firstElementChild.style.opacity='1';hero.firstElementChild.style.transform='none';
 main.querySelector('#count-heading>span').textContent='19,000+';
 const dossier=main.querySelector('[aria-labelledby="dossier-heading"]');
 dossier.classList.add('why-dossier');
 const grid=dossier.firstElementChild;grid.classList.add('why-dossier-grid');
 const intro=document.createElement('div');intro.className='why-dossier-intro';
 [...grid.children].slice(0,3).forEach(el=>intro.append(el));grid.prepend(intro);
 const stage=document.createElement('div');stage.className='why-dossier-sticky';dossier.append(stage);stage.append(grid);
 const meter=document.createElement('div');meter.className='why-credential-meter';meter.setAttribute('aria-hidden','true');meter.innerHTML='<i></i>'.repeat(6)+'<span>1 of 6</span>';intro.append(meter);
 grid.querySelectorAll('ol>li').forEach((el,i)=>{el.dataset.credential=String(i);});
 return main.innerHTML;
});
await browser.close();
await writeFile(new URL('./why-source.html',import.meta.url),html);
console.log('Prepared why-source.html from live capture');
