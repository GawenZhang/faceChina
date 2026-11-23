import { readFile, readdir, writeFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(app, 'site-assets');
const references = [];
const paths = [];
async function walk(dir) {
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    const file = resolve(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else paths.push(file);
  }
}
await walk(root);
async function exists(file) { try { return (await stat(file)).isFile(); } catch { return false; } }
for (const file of paths.filter(p => p.endsWith('.css'))) {
  const text = await readFile(file, 'utf8');
  const base = 'https://original.invalid/' + file.slice(root.length + 1).replaceAll('\\','/');
  for (const match of text.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/g)) {
    if (/^(?:data:|#)/.test(match[1])) continue;
    const url = new URL(match[1], base);
    const local = resolve(root, '.' + decodeURIComponent(url.pathname));
    references.push({source:file.slice(root.length+1).replaceAll('\\','/'),reference:match[1],path:local.slice(app.length+1).replaceAll('\\','/'),exists:await exists(local)});
  }
}
const needed = JSON.parse(await readFile(resolve(app,'backend-assets-needed.json'), 'utf8'));
let originalFailures=[];
try { originalFailures=JSON.parse(await readFile(resolve(app,'../capture/static-assets/public-fetch-failures.json'),'utf8')); } catch {}
for(const reference of references.filter(r=>!r.exists)) {
  const failure=originalFailures.find(f=>'site-assets'+new URL(f.url).pathname===reference.path);
  reference.originalStatus=failure?.error || 'not checked';
}
const missingHtml = [];
for (const item of needed) if (!await exists(resolve(app, '.'+item.path))) missingHtml.push(item);
const report={assetFiles:paths.length,htmlAssets:needed.length,missingHtml,cssReferences:references.length,missingCss:references.filter(r=>!r.exists)};
await writeFile(resolve(app,'checks/assets-audit.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({assetFiles:report.assetFiles,htmlAssets:report.htmlAssets,missingHtml:missingHtml.length,missingCss:report.missingCss.length}));
