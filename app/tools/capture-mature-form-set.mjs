import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {run} from './capture.mjs';
let routes=[
 ['general-profile','/user/general/profile'],
 ['user_contact-edit-ids-975','/user/user_contact/edit/ids/975'],
 ['images_type-edit-ids-14743','/user/images_type/edit/ids/14743'],
 ['user_contact-add','/user/user_contact/add'],
 ['webmedia_task-add','/user/webmedia_task/add'],
 ['media_collection-add','/user/media_collection/add'],
 ['user_site-add','/user/user_site/add'],
 ['user_site_task-add','/user/user_site_task/add'],
 ['draft-add','/user/draft/add'],['user_tdk-add','/user/user_tdk/add'],['b2b_task-add','/user/b2b_task/add'],
 ['piliang_baowen-add','/user/piliang_baowen/add'],['ai_image-add','/user/ai_image/add']
];
const onlyKeys=process.argv.find(a=>a.startsWith('--keys='))?.slice(7).split(',');
if(onlyKeys)routes=routes.filter(([key])=>onlyKeys.includes(key));
const tab=await(await fetch('http://127.0.0.1:9222/json/new?'+encodeURIComponent('https://geo136.doujia5799.top/user/dashboard?addtabs=1'),{method:'PUT'})).json();
process.env.GEO_CAPTURE_TARGET=tab.id;process.env.GEO_SOURCE_CAPTURE='1';process.env.GEO_REQUIRE_FORM='1';process.env.GEO_CAPTURE_SETTLE_MS='8000';
delete process.env.GEO_CAPTURE_REFERENCE;
console.log('Mature form set target',tab.id);
let results=[];if(onlyKeys)try{results=JSON.parse(fs.readFileSync('capture/mature-form-results.json','utf8'));}catch{}
for(const [key,url]of routes)for(const width of [1440,390]){
 const dir='capture/admin/'+key+'-'+width;
 try{
  if(!fs.existsSync(dir+'/early')){fs.mkdirSync(dir+'/early',{recursive:true});for(const file of ['record.json','final.html','final.png'])if(fs.existsSync(dir+'/'+file))fs.copyFileSync(dir+'/'+file,dir+'/early/'+file);}
  run('full-pass/form-ready-'+key+'-'+width,[{kind:'goto',url:'https://geo136.doujia5799.top'+url+'?addtabs=1',wait_ms:2000}],width,{capture:{at_end:['dom'],events:['page_errors']}});
  const shot=spawnSync(process.execPath,['app/tools/full-screenshot.mjs',dir+'/full.png',String(width),...(key==='general-profile'?['--mask-account']:[])],{encoding:'utf8',timeout:65000});
  if(shot.status!==0)throw new Error(shot.stderr);
  const record=run(key+'-'+width,[{kind:'wait',ms:1200}],width);
  fs.copyFileSync(dir+'/final.html',dir+'/full.html');
  fs.copyFileSync(dir+'/record.json',dir+'/settled-record.json');
  const metadata=JSON.parse(fs.readFileSync(dir+'/full.png.json','utf8'));
  metadata.provenance={captureMethod:'CDP full screenshot with mature form/layui modules; final.png is a subsequent independent CLI viewport screenshot',domRecord:'settled-record.json',evidenceId:record.id};
  fs.writeFileSync(dir+'/full.png.json',JSON.stringify(metadata,null,2));
  results.push({key,width,status:'captured',source:'full.html',readiness:metadata.readiness});
 }catch(error){results.push({key,width,status:'failed',error:error.message});}
 results=[...new Map(results.map(r=>[r.key+'-'+r.width,r])).values()];
 fs.writeFileSync('capture/mature-form-results.json',JSON.stringify(results,null,2));
}
console.log(JSON.stringify({total:results.length,failed:results.filter(r=>r.status==='failed').length}));
