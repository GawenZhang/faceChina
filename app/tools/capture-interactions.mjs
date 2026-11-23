import fs from 'node:fs';
const tab={id:process.env.GEO_CAPTURE_TARGET||JSON.parse(fs.readFileSync('capture/admin/interaction-target.json','utf8')).target_id};
process.env.GEO_CAPTURE_TARGET=tab.id;
const {run}=await import('./capture.mjs');
const routes=JSON.parse(fs.readFileSync('capture/admin/routes.json','utf8'));
const suffix=process.env.REPORT_SUFFIX?'-'+process.env.REPORT_SUFFIX:'';const report='capture/admin/interaction-coverage'+suffix+'.json';const subreport='capture/admin/interaction-subroutes'+suffix+'.json';const results=fs.existsSync(report)?JSON.parse(fs.readFileSync(report,'utf8')):[];const subroutes=fs.existsSync('capture/admin/interaction-subroutes.json')?JSON.parse(fs.readFileSync('capture/admin/interaction-subroutes.json','utf8')):[];

function attr(tag,key){return tag.match(new RegExp('\\b'+key+'="([^"]*)"','i'))?.[1];}
function addSub(url,r,label){if(!url?.startsWith('/user/')||/logout|delete|\/del\b/.test(url))return;const path=url.split('?')[0].replace(/\/$/,'');const key=path.replace(/^\/user\//,'').replaceAll('/','-');if(!subroutes.some(x=>x.path===path))subroutes.push({path,key,label:r.label+' · '+label,parent:r.key});fs.writeFileSync(subreport,JSON.stringify(subroutes,null,2));}
for(const r of routes.slice(+(process.env.START_INDEX||0),+(process.env.END_INDEX||routes.length))){
 if(results.some(x=>x.key===r.key&&x.width===1440&&x.status==='complete')&&results.some(x=>x.key===r.key&&x.width===390&&x.status==='complete'))continue;
 if(r.key==='general-profile'){results.push({key:r.key,reason:'Account input contains sampling identity; separate redacted profile capture required.'});continue;}
 const source=fs.readFileSync('capture/admin/'+r.key+'-1440/final.html','utf8').replace(/<!--[\s\S]*?-->/g,'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
 const controls=[];
 if(source.includes('name="commonSearch"'))controls.push({name:'search',selector:'button[name="commonSearch"]',close:'button[name="commonSearch"]'});
 if(source.includes('aria-label="columns"'))controls.push({name:'columns',selector:'button[aria-label="columns"]',close:'button[aria-label="columns"]'});
 if(source.includes('name="toggle"'))controls.push({name:'table-view',selector:'button[name="toggle"]',close:'button[name="toggle"]'});
 if(source.includes('class="query-button"')&&/class="[^"]*\bitem-ai-dis\b/.test(source))controls.push({name:'ai-model',selector:'.item-ai-dis[id="2"]',close:'.item-ai-dis[id="2"]'});
 const seen=new Set();
 for(const tag of source.match(/<(?:a|button)\b[^>]*>/gi)||[]){
  const cls=attr(tag,'class')||'',url=attr(tag,'data-url')||attr(tag,'href');
  if(cls.includes('btn-dialog')&&url?.startsWith('/user/')){
   const family=url.replace(/\/(media_id|ids|id)\/\d+/g,'/$1/{id}');if(seen.has(family))continue;seen.add(family);
   const key=tag.includes('data-url=')?'data-url':'href';controls.push({name:'dialog-'+controls.length,selector:'['+key+'="'+url+'"]',modal:true});addSub(url,r,attr(tag,'data-title')||'弹窗');
  }
  if(attr(tag,'data-toggle')==='tab'&&url?.startsWith('#'))controls.push({name:'tab-'+url.slice(1),selector:'a[href="'+url+'"]'});
 }
 if(/class="[^"]*\bbtn-add\b/.test(source))controls.push({name:'add',selector:'.btn-add',modal:true});
 if(!controls.length){results.push({key:r.key,controls:[],reason:'No generic safe interaction controls; base form/page captures cover initial state.'});continue;}
 let ready=run('states/ready-'+r.key,[{kind:'goto',url:'https://geo136.doujia5799.top'+r.path+'?addtabs=1',wait_ms:2000},{kind:'wait',ms:6000}],1440,{action_timeout_ms:20000,capture:{at_end:['dom']}});
 if(source.includes('name="commonSearch"'))for(let attempt=0;attempt<3&&!ready.result?.final_artifacts?.dom?.text?.includes('name="commonSearch"');attempt++)ready=run('states/ready-'+r.key,[{kind:'wait',ms:4000}],1440,{action_timeout_ms:20000,capture:{at_end:['dom']}});
 for(const width of [1440,390]){
  const actions=[{kind:'wait',ms:500}];
  const states=[];
  for(const c of controls){actions.push({kind:'click',selector:c.selector},{kind:'wait',ms:c.modal?2500:250});states.push({...c,step:actions.length-1});if(c.modal)actions.push({kind:'click',selector:'.layui-layer-close'},{kind:'wait',ms:450});else if(c.close)actions.push({kind:'click',selector:c.close});}
  const name='states/'+r.key+'-interactive-'+width;
  try{
   const evidence=run(name,actions,width,{action_timeout_ms:20000,capture:{after_each_step:['dom','screenshot'],at_end:['dom','screenshot'],events:['page_errors','popups']}});
   results.push({key:r.key,width,name,evidence_id:evidence.id,states,status:evidence.result?.aborted?'partial':'complete'});
   for(const state of states){const step=evidence.result?.steps[state.step],dom=step?.artifacts?.dom?.text||'';for(const m of dom.matchAll(/<iframe\b[^>]*src="([^"]*)"/gi))addSub(m[1],r,state.name);}
  }catch(error){results.push({key:r.key,width,error:error.message.slice(0,150)});}
  fs.writeFileSync(report,JSON.stringify(results,null,2));
 }
}
const main=[...routes,...JSON.parse(fs.readFileSync('capture/admin/subroutes.json','utf8'))];
fs.writeFileSync(report,JSON.stringify(results,null,2));
for(const r of (process.env.SKIP_SUBROUTES?[]:subroutes.filter(x=>!main.some(y=>y.path===x.path)))){
 for(const width of [1440,390]){
  if(fs.existsSync('capture/admin/'+r.key+'-'+width+'/final.html'))continue;
  try{run(r.key+'-'+width,[{kind:'goto',url:'https://geo136.doujia5799.top'+r.path+'?addtabs=1',wait_ms:1500},{kind:'wait',ms:800}],width);}catch(e){console.log('ERROR',r.key,e.message.slice(0,150));}
 }
}
fs.writeFileSync(report+'.done','done');console.log('INTERACTION SAMPLING FINISHED',results.length,subroutes.length);
