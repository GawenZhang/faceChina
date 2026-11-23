import {run} from './capture.mjs';
const endpoint=process.env.GEO_CDP_ENDPOINT||'http://127.0.0.1:9222';
const page=await(await fetch(endpoint+'/json/new?about:blank',{method:'PUT'})).json();
process.env.GEO_CAPTURE_TARGET=page.id;
const tests=[['local-flow-login',[{kind:'goto',url:'http://127.0.0.1:4173/user/index/login/',wait_ms:500},{kind:'fill',selector:'#username',value:'demo'},{kind:'fill',selector:'#password',value:'demo123'},{kind:'click',selector:'.login-submit'},{kind:'wait',ms:1000}]],['local-ai-analyze',[{kind:'goto',url:'http://127.0.0.1:4173/backend-pages/analyze_v2-add.html',wait_ms:500},{kind:'fill',selector:'.brand_name',value:'示例品牌'},{kind:'click',selector:'.pingpai_jiexi'},{kind:'wait',ms:800}]],['local-ai-detect',[{kind:'goto',url:'http://127.0.0.1:4173/backend-pages/analyze_v2-add.html',wait_ms:500},{kind:'fill',selector:'.brand_name',value:'示例品牌'},{kind:'click',selector:'.query-button'},{kind:'wait',ms:800}]],['local-ai-generate',[{kind:'goto',url:'http://127.0.0.1:4173/backend-pages/ai_image-add.html',wait_ms:500},{kind:'fill',selector:'#prompt',value:'示例产品图片'},{kind:'click',selector:'button[type=submit]'},{kind:'wait',ms:800}]]];
const only=process.argv[2];
try{for(const width of [1440,390])for(const [name,actions] of tests){
 if(only&&!name.includes(only))continue;
 const settled=actions.map(a=>a.kind==='goto'?{...a,wait_ms:3500}:a.kind==='wait'?{...a,ms:1200}:a);
 run(name+(width===390?'-390':''),settled,width);
}}
finally{await fetch(endpoint+'/json/close/'+page.id);}

