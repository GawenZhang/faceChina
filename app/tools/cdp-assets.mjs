/** Read already-loaded static resources. Never navigates or evaluates page code. */
import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const destination = resolve(app, 'site-assets');
const evidence = resolve(app, '../capture/static-assets');
const endpoint = process.env.GEO_CDP_ENDPOINT || 'http://127.0.0.1:9222';
const pages = await (await fetch(endpoint + '/json/list')).json();
const page = (process.env.GEO_ASSET_TARGET ? pages.find(p=>p.id===process.env.GEO_ASSET_TARGET) : null) || pages.find(p => p.type === 'page' && /geo136\.doujia5799\.top/.test(p.url));
if (!page) throw new Error('No HTTP page in the existing browser');
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((ok, fail) => { socket.addEventListener('open', ok, {once:true}); socket.addEventListener('error', fail, {once:true}); });
let sequence = 0;
const pending = new Map();
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  const promise = pending.get(message.id);
  if (!promise) return;
  pending.delete(message.id);
  clearTimeout(promise.timer);
  message.error ? promise.reject(new Error(message.error.message)) : promise.resolve(message.result);
});
const command = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence;
  const timer = setTimeout(() => { pending.delete(id); reject(new Error('CDP resource timeout')); }, 8000);
  pending.set(id, {resolve, reject, timer});
  socket.send(JSON.stringify({id, method, params}));
});
const vendorScript = /(?:jquery|layui|bootstrap|require|adminlte|fastadmin|toastr|moment|template|selectpage|select2|validator|table|layer|upload|echarts|fancybox|daterange|datetime|jstree|dragsort|plupload|slimscroll|bootstrap-select|marked|clipboard|vue|sortable|ace|ue|ueditor|prism|codemirror)/i;
const staticType = /^(Stylesheet|Image|Font)$/;
await mkdir(evidence, {recursive:true});
let records = [];
try { records = JSON.parse(await readFile(resolve(evidence, 'manifest.json'), 'utf8')); } catch {}
const existing = new Map(records.map(x => [x.url, x]));
let count = 0;
let failures = 0;
const failedResources = [];
async function flushManifest() {
  try {
    for (const item of JSON.parse(await readFile(resolve(evidence, 'manifest.json'), 'utf8'))) if (!existing.has(item.url)) existing.set(item.url, item);
  } catch {}
  await writeFile(resolve(evidence, 'manifest.json'), JSON.stringify([...existing.values()], null, 2));
}
async function save(resource, readContent) {
    let url;
    try { url = new URL(resource.url); } catch { return; }
    if (!/^https?:$/.test(url.protocol)) return;
    const script = resource.type === 'Script';
    if (!staticType.test(resource.type) && !script) return;
    const published = !script || vendorScript.test(url.pathname);
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    if (relative.split('/').includes('..')) return;
    const root = published ? destination : resolve(evidence, 'scripts');
    const path = resolve(root, relative);
    if (!path.startsWith(root + '\\') && !path.startsWith(root + '/')) return;
    try {
      const result = await readContent();
      const bytes = Buffer.from(result.content ?? result.body, result.base64Encoded ? 'base64' : 'utf8');
      await mkdir(dirname(path), {recursive:true});
      await writeFile(path, bytes);
      existing.set(resource.url, {url:resource.url, type:resource.type, bytes:bytes.length, published, file:path.slice(app.length + 1).replaceAll('\\','/')});
      count++;
      await flushManifest();
    } catch (error) { if (!failures) console.error('Resource read:', error.message); failures++; failedResources.push({url:resource.url,type:resource.type,error:error.message}); }
}
async function visit(tree) {
  for (const resource of tree.resources || []) {
    await save(resource, () => command('Page.getResourceContent', {frameId: tree.frame.id, url:resource.url}));
  }
  for (const child of tree.childFrames || []) await visit(child);
}
try {
  await command('Page.enable');
  if (process.argv.includes('--fetch-needed')) {
    const tree = (await command('Page.getResourceTree')).frameTree;
    const queue = new Set();
    const seen = new Set();
    const originalOrigin = new URL(page.url).origin;
    async function collect(dir) {
      for (const entry of await readdir(dir, {withFileTypes:true})) {
        const path = resolve(dir, entry.name);
        if (entry.isDirectory()) await collect(path);
        else if (entry.name.endsWith('.html')) {
          const html = await readFile(path, 'utf8');
          for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
            try {
              const url = new URL(match[1].replaceAll('&amp;', '&'), originalOrigin);
              if (/\.(?:css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|ico)(?:$|\?)/i.test(url.href)) queue.add(url.href);
            } catch {}
          }
        }
      }
    }
    const explicitAsset=process.argv[process.argv.indexOf('--asset')+1];
    if(process.argv.includes('--asset')) queue.add(explicitAsset);
    else await collect(resolve(app, '../capture/admin'));
    // Required by Layui modules even before those modules are opened.
    if(!process.argv.includes('--asset')) for (const suffix of ['css/layui.css','css/modules/layer/default/layer.css','css/modules/laydate/default/laydate.css','css/modules/code.css']) queue.add(originalOrigin + '/user_assets/layui/' + suffix);
    for (const url of queue) {
      if (seen.has(url)) continue;
      seen.add(url);
      const type = /\.js(?:$|\?)/i.test(url) ? 'Script' : /\.css(?:$|\?)/i.test(url) ? 'Stylesheet' : /\.(?:woff2?|ttf|eot)(?:$|\?)/i.test(url) ? 'Font' : 'Image';
      let cssText;
      let present=false;
      try {
        const local=await readFile(resolve(destination,'.'+decodeURIComponent(new URL(url).pathname)));
        present=true;
        if(type==='Stylesheet') cssText=local.toString('utf8');
      } catch {}
      if(!present) {
      await save({url,type}, async () => {
        const loaded = await command('Network.loadNetworkResource', {frameId:tree.frame.id,url,options:{disableCache:false,includeCredentials:false}});
        if (!loaded.resource.success || loaded.resource.httpStatusCode >= 400 || !loaded.resource.stream) throw new Error('Public asset unavailable: ' + loaded.resource.httpStatusCode);
        const stream = loaded.resource.stream;
        const chunks = [];
        try {
          for (;;) {
            const part = await command('IO.read', {handle:stream});
            chunks.push(Buffer.from(part.data, part.base64Encoded ? 'base64':'utf8'));
            if (part.eof) break;
          }
        } finally { await command('IO.close', {handle:stream}); }
        const bytes = Buffer.concat(chunks);
        if (type === 'Stylesheet') cssText = bytes.toString('utf8');
        return {content:bytes.toString('base64'),base64Encoded:true};
      });
      }
      if (cssText) for (const match of cssText.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/g)) {
        if (/^(?:data:|#)/i.test(match[1])) continue;
        try { const nested = new URL(match[1], url); nested.hash = ''; queue.add(nested.href); } catch {}
      }
    }
  } else if (process.argv.includes('--watch')) {
    const requests = new Map();
    let saves = Promise.resolve();
    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      const params = message.params;
      if (message.method === 'Network.responseReceived') requests.set(params.requestId, {url:params.response.url,type:params.type});
      if (message.method === 'Network.loadingFinished' && requests.has(params.requestId)) {
        const resource = requests.get(params.requestId);
        requests.delete(params.requestId);
        saves = saves.then(() => save(resource, () => command('Network.getResponseBody', {requestId:params.requestId})));
      }
    });
    await command('Network.enable', {maxTotalBufferSize:100000000, maxResourceBufferSize:10000000});
    console.log('Passive static-asset observation started.');
    await new Promise(resolve => setTimeout(resolve, 240000));
    await saves;
  } else await visit((await command('Page.getResourceTree')).frameTree);
}
finally { socket.close(); }
await flushManifest();
const failureFile=resolve(evidence, process.argv.includes('--fetch-needed') ? 'public-fetch-failures.json' : 'observer-failures.json');
let oldFailures=[];try{oldFailures=JSON.parse(await readFile(failureFile,'utf8'));}catch{}
await writeFile(failureFile, JSON.stringify([...new Map([...oldFailures,...failedResources].map(x=>[x.url,x])).values()],null,2));
console.log(JSON.stringify({captured:count, failed:failures, total:existing.size}));
