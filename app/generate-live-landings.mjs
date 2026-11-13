import fs from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';
import {allRoutes} from './route-manifest.mjs';
import {capturedMain,capturedMainClass} from './captured-source-utils.mjs';

const root=new URL('./',import.meta.url);
const captureRoot=new URL('./inspection/live-20261113/',root);
const css=postcss.parse(await fs.readFile(new URL('original.css',captureRoot),'utf8'));
css.walkAtRules('font-face',rule=>rule.remove()); // Preserve the accepted shared Inter font.
const keyframes=new Map();
css.walkAtRules(/keyframes$/,rule=>{const old=rule.params;keyframes.set(old,'captured-'+old);rule.params='captured-'+old;});
css.walkRules(rule=>{
 if(/keyframes$/.test(rule.parent.name||''))return;
 rule.selectors=rule.selectors.flatMap(selector=>{
  if(/^(?:html|body|:root|:host)(?:$|[\s:,>])/.test(selector))return selector.replace(/^(?:html|body|:root|:host)/,'.captured-source');
  if(selector==='*')return ['.captured-source','.captured-source *'];
  if(selector==='::before'||selector==='::after')return ['.captured-source'+selector,'.captured-source '+selector];
  return ['.captured-source '+selector,'.captured-source:is('+selector+')'];
 });
});
css.walkDecls(decl=>{
 if(/^animation(?:-name)?$/.test(decl.prop))for(const[old,name]of keyframes)decl.value=decl.value.replace(new RegExp('\\b'+old+'\\b','g'),name);
 decl.value=decl.value.replace(/url\((['"]?)(\/[^)'"\s]+)\1\)/g,'url($1https://www.oxyhealth.com$2$1)');
});
await fs.writeFile(new URL('captured-source.css',root),'/* Scoped from the authorized live 2026-11-13 source stylesheet. */\n'+css.toString()+'\n.captured-source{display:block;background:#fff;color:#1d1d1f;font-family:Inter,system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.5;overflow-wrap:break-word}\n.captured-source svg{max-width:none}\n.captured-source [data-preview-status]{color:#1d1d1f}\n');
const data={},review=[];
for(const route of allRoutes.filter(route=>route.template==='landing')){
 const slug=route.path.slice(1).replaceAll('/','__');
 const dir=new URL(slug+'/',captureRoot);
 let source,capture;
 try{[source,capture]=await Promise.all([fs.readFile(new URL('page.html',dir),'utf8'),fs.readFile(new URL('capture.json',dir),'utf8').then(JSON.parse)]);}catch{continue;}
 const html=capturedMain(source,capture.assets.images);
 data[route.path]={html,className:capturedMainClass(source)};
 const sections=capture.layouts.map(layout=>({width:layout.width,sections:layout.blocks.filter(block=>block.tag==='section').map(block=>({heading:block.heading||'',background:block.background||'transparent',padding:block.pad,column:block.column,per_row:block.per_row,height:block.h}))}));
 review.push({path:route.path,template:'landing',status:'source_layout_restored',source_capture:'inspection/live-20261113/'+slug+'/capture.json',source_html:'inspection/live-20261113/'+slug+'/page.html',widths:sections.map(s=>s.width),sections,changes:'Replaced provisional text-schema layout with the captured main structure and scoped source CSS; restored exact section colors, container widths, spacing, card grids, type hierarchy and responsive utility rules. Original runtime scripts excluded; local FAQ/quote/form handlers restored.',verification_limit:'Build and browser comparison are pending the final QA run; this record documents the source-backed implementation, not an independent rendered equivalence result.',faq_count:(html.match(/aria-controls="faq-answer-/g)||[]).length,form_count:(html.match(/<form\b/g)||[]).length,main_section_count:(html.match(/<section\b/g)||[]).length});
}
await fs.writeFile(new URL('landing-live-data.json',root),JSON.stringify(data));
await fs.writeFile(new URL('landing-review.json',root),JSON.stringify({recorded_at:new Date().toISOString(),count:review.length,expected:28,source_style:'inspection/live-20261113/original.css',results:review},null,2));
console.log(JSON.stringify({generated:review.length,expected:28,paths:Object.keys(data)}));
