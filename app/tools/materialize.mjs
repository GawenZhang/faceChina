import fs from 'node:fs';
import path from 'node:path';
const project=path.resolve(import.meta.dirname,'../..');
const app=path.join(project,'app');
const captures=path.join(project,'capture/admin');
const sourceOrigin='https://geo136.doujia5799.top';
const routeCandidates=['routes.json','subroutes.json','interaction-subroutes.json'].filter(f=>fs.existsSync(path.join(captures,f))).flatMap(f=>JSON.parse(fs.readFileSync(path.join(captures,f),'utf8').replace(/^\uFEFF/,'')));
const routes=[...new Map(routeCandidates.reverse().map(route=>[route.path,route])).values()].reverse();
const assets=new Map();
const output=path.join(app,'backend-pages');
const interactionsOnly=process.argv.includes('--interactions-only');
const selectedPages=process.argv.find(x=>x.startsWith('--pages='))?.slice(8).split(',');
const matureFormTemplates=new Set(['b2b_task-add','draft-add','user_tdk-add','general-profile','user_contact-edit-ids-975','images_type-edit-ids-14743','user_contact-add','webmedia_task-add','media_collection-add','user_site-add','user_site_task-add','ai_image-add','piliang_baowen-add']);
fs.mkdirSync(output,{recursive:true});
function attrEscape(x){return x.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');}
function asset(raw,base){
 if(!raw||/^(?:data:|blob:|#|javascript:)/i.test(raw))return raw;
 try{
  const u=new URL(raw.replaceAll('&amp;','&'),base);
  if(!/^https?:$/.test(u.protocol))return raw;
  assets.set(u.href,{url:u.href,path:'/site-assets'+u.pathname});
  return '/site-assets'+u.pathname+u.search+u.hash;
 }catch{return raw;}
}
function materialize(html,item,shell=false,mobile=false,paired=false){
 const base=new URL(item.path||'/user/index/index',sourceOrigin).href;
 html=html.replace(/<!--[\s\S]*?-->/g,'').replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,'');
 // Retain route metadata from inert event text, never the remote execution.
 html=html.replace(/\son([a-z]+)\s*=\s*(["'])([\s\S]*?)\2/gi,(_,event,q,body)=>{
   if(event.toLowerCase()!=='click')return '';
   const target=body.match(/["']((?:https?:\/\/[^/'"]+)?\/user\/[^'"]*)["']/)?.[1];
   const inert=body.replace(/https?:\/\/[^/'"]+/g,'');
   return ' data-original-click="'+attrEscape(inert)+'"'+(target?' data-local-url="'+attrEscape(target.replace(/^https?:\/\/[^/]+/,''))+'"':'');
 });
 html=html.replace(/<base\b[^>]*>/gi,'').replace(/<meta\b[^>]*http-equiv\s*=\s*["']refresh["'][^>]*>/gi,'');
 html=html.replace(/<form\b([^>]*)>/gi,(_,a)=>'<form'+a.replace(/\s(?:action|method|target)\s*=\s*(["'])[\s\S]*?\1/gi,'')+' action="#" method="get">');
 html=html.replace(/<(?:input)\b[^>]*type=["']hidden["'][^>]*>/gi,'');
 if(item.path==='/user/general/profile')html=html.replace(/<input\b([^>]*\bid=["']username["'][^>]*)>/gi,(_,a)=>'<input'+a.replace(/\bvalue=(["'])[\s\S]*?\1/gi,'value="demo"')+'>');
 html=html.replace(/<(link|img|source|video|audio|image)\b([^>]*?)>/gi,(tag,name,a)=>'<'+name+a.replace(/\b(href|src|poster|xlink:href)\s*=\s*(["'])([\s\S]*?)\2/gi,(_,key,q,url)=>key+'='+q+asset(url,base)+q)+'>');
 html=html.replace(/url\(\s*(["']?)([^)'"\s]+)\1\s*\)/gi,(_,q,url)=>'url('+q+asset(url,base)+q+')');
 html=html.replace(/\bhref\s*=\s*(["'])https?:\/\/geo136\.doujia5799\.top([^"']*)\1/gi,'href=$1$2$1');
 html=html.replace(/\bhref\s*=\s*(["'])javascript:[\s\S]*?\1/gi,'href="#"');
 html=html.replace(/<body\b([^>]*)>/i,'<body$1 data-page-key="'+item.key+'" data-page-path="'+item.path+'"'+(shell?' data-backend-shell="true"':'')+'>');
 // A captured remote iframe is replaced with an already materialized local page.
 html=html.replace(/<iframe\b([^>]*?)\bsrc\s*=\s*(["'])([\s\S]*?)\2([^>]*)>/gi,(_,a,q,url,b)=>{
   const u=new URL(url,base);const route=routes.find(r=>r.path===u.pathname.replace(/\/$/,''));
   return '<iframe'+a+'src="'+(route?'/backend-pages/'+route.key+'.html':'about:blank')+'"'+b+'>';
 });
 if(shell){
   html=html.replace(/<iframe\b/,'<iframe id="backend-frame" title="后台页面"');
 }
 html=html.replace(/<\/head>/i,'<meta name="robots" content="noindex,nofollow,noarchive"><link rel="stylesheet" href="/admin-runtime.css"></head>');
 if(paired){
   const destination='/backend-pages/'+item.key+(mobile?'.html':'.mobile.html');
   const condition=mobile?'innerWidth>600':'innerWidth<=600';
   html=html.replace(/<\/head>/i,'<script>if('+condition+')location.replace('+JSON.stringify(destination)+'+location.search+location.hash);</script></head>');
 }
 const editorScripts=html.includes('edui-editor')?'<script>window.UEDITOR_HOME_URL="/site-assets/ueditor/";</script><script src="/site-assets/ueditor/ueditor.config.js"></script><script src="/site-assets/ueditor/ueditor.all.min.js"></script><script src="/site-assets/ueditor/lang/zh-cn/zh-cn.js"></script>':'';
 const dateScripts=html.includes('datetimerange')?'<script src="/site-assets/user_assets/libs/moment/moment.js"></script><script src="/site-assets/user_assets/libs/bootstrap-daterangepicker/daterangepicker.js"></script>':'';
 const selectScripts=html.includes('selectpicker')?'<script src="/site-assets/user_assets/libs/bootstrap-select/dist/js/bootstrap-select.min.js"></script><script src="/site-assets/user_assets/libs/bootstrap-select/dist/js/i18n/defaults-zh_CN.js"></script>':'';
 const shellScripts=shell?'<script>window.AdminLTEOptions={enableControlTreeView:true,sidebarPushMenu:true,enableControlSidebar:true,sidebarSlimScroll:false,navbarMenuSlimscroll:false};</script><script src="/site-assets/user_assets/libs/jquery-slimscroll/jquery.slimscroll.js"></script><script src="/site-assets/user_assets/js/adminlte.js"></script>':'';
 const scripts='<script src="/vendor/jquery.js"></script><script src="/vendor/layui.js"></script><script src="/site-assets/user_assets/libs/bootstrap/dist/js/bootstrap.min.js"></script>'+shellScripts+editorScripts+dateScripts+selectScripts+'<script src="/ai-config.js"></script><script src="/services/ai-service.js"></script><script src="/site-assets/user_assets/js/require.js"></script><script>require(["/admin-runtime.js"]);</script>';
 html=html.replace(/<\/body>/i,scripts+'</body>');
 return html;
}
let built=[];let missing=[];
for(const route of interactionsOnly?[]:routes){
 if(selectedPages&&!selectedPages.includes(route.key))continue;
 const matureFile=path.join(captures,route.key+'-1440','full.html');
 const file=matureFormTemplates.has(route.key)&&fs.existsSync(matureFile)?matureFile:path.join(captures,route.key+'-1440','final.html');
 if(!fs.existsSync(file)){missing.push(route.key);continue;}
 const matureMobile=path.join(captures,route.key+'-390','full.html');
 const mobileFile=matureFormTemplates.has(route.key)&&fs.existsSync(matureMobile)?matureMobile:path.join(captures,route.key+'-390','final.html');
 const paired=fs.existsSync(mobileFile);
 const html=materialize(fs.readFileSync(file,'utf8'),route,false,false,paired);
 fs.writeFileSync(path.join(output,route.key+'.html'),html);
 if(paired)fs.writeFileSync(path.join(output,route.key+'.mobile.html'),materialize(fs.readFileSync(mobileFile,'utf8'),route,false,true,true));
 built.push({...route,file:'/backend-pages/'+route.key+'.html',mobileFile:paired?'/backend-pages/'+route.key+'.mobile.html':null,source:path.relative(app,file).replaceAll('\\','/'),mobileSource:paired?path.relative(app,mobileFile).replaceAll('\\','/'):null});
}
const settledShell=path.join(captures,'shell-1440','final.html');
const shell=fs.existsSync(settledShell)?settledShell:path.join(captures,'login','final.html');
if(!interactionsOnly&&!selectedPages&&fs.existsSync(shell)){
 const mobileShell=path.join(captures,'shell-390','final.html');
 const paired=fs.existsSync(mobileShell);
 const content=materialize(fs.readFileSync(shell,'utf8'),{key:'shell',path:'/user/index/index'},true,false,paired);
 fs.writeFileSync(path.join(output,'shell.html'),content);
 fs.writeFileSync(path.join(app,'shell.html'),content);
 if(paired)fs.writeFileSync(path.join(output,'shell.mobile.html'),materialize(fs.readFileSync(mobileShell,'utf8'),{key:'shell',path:'/user/index/index'},true,true,true));
}
if(!interactionsOnly&&!selectedPages){
 fs.writeFileSync(path.join(app,'backend-routes.json'),JSON.stringify(Object.fromEntries(built.map(x=>[x.path,x.file])),null,2));
 fs.writeFileSync(path.join(app,'backend-page-manifest.json'),JSON.stringify(built,null,2));
 fs.writeFileSync(path.join(app,'backend-assets-needed.json'),JSON.stringify([...assets.values()],null,2));
}
function modalAppearance(html,tag){
 const shadeTag=[...html.matchAll(/<div\b(?=[^>]*class="[^"]*\blayui-layer-shade\b)[^>]*>/gi)].map(m=>m[0]).filter(t=>!/display\s*:\s*none/.test(t)).at(-1);
 const shade=shadeTag?Number(shadeTag.match(/opacity\s*:\s*([\d.]+)/)?.[1]||.3):0;
 return {skin:/\blayui-layer-fast\b/.test(tag)?'layui-layer-fast':'',shade,maxmin:/\blayui-layer-max\b/.test(html.slice(html.indexOf(tag)))};
}
const interactions={};
if(selectedPages){
 const manifestPath=path.join(app,'backend-page-manifest.json');
 const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
 fs.writeFileSync(manifestPath,JSON.stringify(manifest.map(row=>built.find(b=>b.path===row.path)||row),null,2));
 console.log(JSON.stringify({built:built.length,missing,selectedPages}));process.exit(0);
}
for(const filename of fs.readdirSync(captures).filter(f=>/^interaction-coverage.*\.json$/.test(f))){
 const runs=JSON.parse(fs.readFileSync(path.join(captures,filename),'utf8').replace(/^\uFEFF/,''));
 for(const run of runs.filter(r=>r.status==='complete'))for(const state of (run.states||[]).filter(s=>s.modal)){
   const file=path.join(captures,run.name,'step-'+state.step+'.html');if(!fs.existsSync(file))continue;
   const html=fs.readFileSync(file,'utf8');
   const tag=html.match(/<div\b(?=[^>]*class="[^"]*\blayui-layer-iframe\b)[^>]*>/i)?.[0];if(!tag)continue;
   const css=tag.match(/style="([^"]*)"/i)?.[1]||'';const geometry=modalAppearance(html,tag);
   for(const field of ['width','height','top','left']){const value=css.match(new RegExp('(?:^|;)\\s*'+field+'\\s*:\\s*([^;]+)'))?.[1];if(value)geometry[field]=value.trim();}
   const frame=html.slice(html.indexOf(tag)).match(/<iframe\b[^>]*\bsrc="([^"]+)"/i)?.[1];
   if(frame){try{const u=new URL(frame.replaceAll('&amp;','&'),sourceOrigin);geometry.url=u.pathname+u.search;}catch{}}
   ((interactions[run.key]??={})[run.width]??={})[state.selector]=geometry;
 }
}
fs.writeFileSync(path.join(app,'backend-interactions.json'),JSON.stringify(interactions,null,2));
const specialPath=path.join(captures,'interaction-special.json');
if(fs.existsSync(specialPath))for(const run of JSON.parse(fs.readFileSync(specialPath,'utf8')).filter(r=>r.status==='complete')){
 const file=path.join(captures,run.name,'final.html');if(!fs.existsSync(file))continue;
 const html=fs.readFileSync(file,'utf8');const tag=html.match(/<div\b(?=[^>]*class="[^"]*\blayui-layer-iframe\b)[^>]*>/i)?.[0];if(!tag)continue;
 const css=tag.match(/style="([^"]*)"/i)?.[1]||'';const geometry=modalAppearance(html,tag);
 for(const field of ['width','height','top','left']){const value=css.match(new RegExp('(?:^|;)\\s*'+field+'\\s*:\\s*([^;]+)'))?.[1];if(value)geometry[field]=value.trim();}
 const frame=html.slice(html.indexOf(tag)).match(/<iframe\b[^>]*\bsrc="([^"]+)"/i)?.[1];
 if(frame){try{const u=new URL(frame.replaceAll('&amp;','&'),sourceOrigin);geometry.url=u.pathname+u.search;}catch{}}
 ((interactions[run.key]??={})[run.width]??={})[run.selector]=geometry;
}
// Settled rechecks supersede a modal captured before its RequireJS/layout work completed.
const residualPath=path.join(app,'checks/interaction-residual-review.json');
if(fs.existsSync(residualPath))for(const run of JSON.parse(fs.readFileSync(residualPath,'utf8')).filter(r=>r.status==='complete'&&r.state==='add'&&r.sourceImage)){
 const file=path.resolve(project,run.sourceImage.replace(/\.png$/i,'.html'));if(!fs.existsSync(file))continue;
 const html=fs.readFileSync(file,'utf8');const tag=html.match(/<div\b(?=[^>]*class="[^"]*\blayui-layer-iframe\b)[^>]*>/i)?.[0];if(!tag)continue;
 const css=tag.match(/style="([^"]*)"/i)?.[1]||'';const geometry=modalAppearance(html,tag);
 for(const field of ['width','height','top','left']){const value=css.match(new RegExp('(?:^|;)\\s*'+field+'\\s*:\\s*([^;]+)'))?.[1];if(value)geometry[field]=value.trim();}
 const frame=html.slice(html.indexOf(tag)).match(/<iframe\b[^>]*\bsrc="([^"]+)"/i)?.[1];
 if(frame){try{const u=new URL(frame.replaceAll('&amp;','&'),sourceOrigin);geometry.url=u.pathname+u.search;}catch{}}
 ((interactions[run.key]??={})[run.width]??={})[run.selector||'.btn-add']=geometry;
}
fs.writeFileSync(path.join(app,'backend-interactions.json'),JSON.stringify(interactions,null,2));
console.log(JSON.stringify({built:built.length,missing,assets:assets.size,interactionPages:Object.keys(interactions).length}));
