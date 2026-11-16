import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {allRoutes} from './route-manifest.mjs';
const required=JSON.parse(await readFile('acceptance-routes.json','utf8'));
const paths=allRoutes.map(route=>route.path);
if(new Set(paths).size!==paths.length) throw new Error('Duplicate paths in route manifest');
const missing=required.filter(path=>!paths.includes(path));
if(missing.length) throw new Error(`Missing acceptance routes: ${missing.join(', ')}`);
const html=await readFile('dist/index.html','utf8');
const escape=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
for(const route of allRoutes){
 const folder=route.path==='/'?'dist':`dist${route.path}`;
 await mkdir(folder,{recursive:true});
 const page=html.replace(/<title>.*?<\/title>/s,`<title>${escape(route.title)}</title>`);
 await writeFile(`${folder}/index.html`,page);
}
await writeFile('dist/404.html',html.replace(/<title>.*?<\/title>/s,'<title>Page not found | OxyHealth</title>'));
await writeFile('dist/route-manifest.json',JSON.stringify(allRoutes,null,2));
console.log(`Generated ${allRoutes.length} static pages; all ${required.length} checklist URLs are covered.`);
