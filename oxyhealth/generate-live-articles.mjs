import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {articlePaths} from './product-article-data.mjs';
import {capturedMain,capturedMainClass} from './captured-source-utils.mjs';

const root=fileURLToPath(new URL('./',import.meta.url));
const sourceRoot=path.join(root,'inspection/live-20261113');
const partial=process.argv.includes('--partial');
const data={},reviews=[];
for(const route of articlePaths){
 const directory=route.slice(1).replaceAll('/','__');
 let capture,html;
 try{
  capture=JSON.parse(await fs.readFile(path.join(sourceRoot,directory,'capture.json'),'utf8'));
  html=await fs.readFile(path.join(sourceRoot,directory,'page.html'),'utf8');
 }catch(error){if(partial&&error.code==='ENOENT')continue;throw error;}
 if(new URL(capture.url).pathname.replace(/\/$/,'')!==route)throw new Error('Wrong capture route '+route);
 const main=capturedMain(html,capture.assets.images);
 data[route]={html:main,className:capturedMainClass(html),source:'inspection/live-20261113/'+directory+'/capture.json'};
 const layouts=capture.layouts.map(layout=>({
  width:layout.width,
  blocks:layout.blocks.filter(block=>['section','article'].includes(block.tag)).map(({tag,heading,background,pad,column,per_row})=>({tag,heading,background:background||'transparent',padding:pad,column,per_row}))
 }));
 reviews.push({
  path:route,source:data[route].source,status:'implemented_from_live_capture_pending_local_qa',
  evidence:['capture.json','page.html','screenshot-1440.png','screenshot-768.png','screenshot-390.png'].map(file=>'inspection/live-20261113/'+directory+'/'+file),
  source_widths:capture.layouts.map(item=>item.width),layouts,
  changes:['Restore source section backgrounds, typography, responsive columns and spacing from scoped source CSS.','Preserve the original heading hierarchy, text lengths, image placement, links and native disclosures.','Replace the prior generic article cover/body/related layout with this individual page’s captured structure.'],
  limitations:['Original scripts and tracking are excluded. Existing shared header/footer and accepted differences are retained.','Image availability is not a completion requirement; original dimensions and hierarchy are retained.']
 });
}
await fs.writeFile(path.join(root,'captured-articles.json'),JSON.stringify(data,null,2)+'\n');
await fs.writeFile(path.join(root,'article-review.json'),JSON.stringify({updated_at:new Date().toISOString(),count:reviews.length,expected:articlePaths.length,results:reviews},null,2)+'\n');
console.log(JSON.stringify({generated:reviews.length,expected:articlePaths.length}));
