import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = dirname(fileURLToPath(import.meta.url));
const output = resolve(source, 'dist');
await mkdir(output, { recursive: true });
const login = await readFile(resolve(source, 'login.html'), 'utf8');
for (const file of ['index.html', 'user/index/login/index.html']) {
  const path = resolve(output, file);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, login);
}
for (const file of ['login.css', 'login.js', 'ai-config.js', 'robots.txt', 'favicon.svg']) {
  await cp(resolve(source, file), resolve(output, file));
}
await mkdir(resolve(output, 'services'), { recursive: true });
await cp(resolve(source, 'services/ai-service.js'), resolve(output, 'services/ai-service.js'));
await mkdir(resolve(output, 'vendor'), { recursive: true });
await cp(resolve(source, 'node_modules/jquery/dist/jquery.min.js'), resolve(output, 'vendor/jquery.js'));
await cp(resolve(source, 'node_modules/layui/dist'), resolve(output, 'vendor'), { recursive: true });
await cp(resolve(source, 'THIRD-PARTY-NOTICES.txt'), resolve(output, 'THIRD-PARTY-NOTICES.txt'));
await writeFile(resolve(output, '404.html'), '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>页面不存在</title><p>未找到此页面，请从后台菜单选择入口。</p><a href="/">返回登录</a></html>');
console.log('Static build ready: dist; login, backend and configurable AI service stub.');
// Backend artifacts are built from sanitized, observed page templates.
const backendMapPath = resolve(source, 'backend-routes.json');
try {
  const backendMap = JSON.parse(await readFile(backendMapPath, 'utf8'));
  for (const dir of ['backend-pages', 'site-assets']) await cp(resolve(source, dir), resolve(output, dir), { recursive: true });
  for (const file of ['admin-runtime.js','admin-runtime.css','backend-routes.json','backend-page-manifest.json','backend-interactions.json']) await cp(resolve(source,file),resolve(output,file));
  const shell = await readFile(resolve(source, 'shell.html'), 'utf8');
  for (const route of ['user/index/index','user','demo']) {
    await mkdir(resolve(output,route),{recursive:true});
    await writeFile(resolve(output,route,'index.html'),shell);
  }
  for (const [route, file] of Object.entries(backendMap)) {
    const dest = resolve(output, route.replace(/^\//,''), 'index.html');
    if(!dest.startsWith(output)) throw new Error('Invalid backend route');
    await mkdir(dirname(dest),{recursive:true});
    await cp(resolve(source,file.replace(/^\//,'')),dest);
  }
  console.log('Backend pages built: '+Object.keys(backendMap).length);
} catch(error) {
  console.error('Backend build failed:',error.message);
  process.exitCode=1;
}


