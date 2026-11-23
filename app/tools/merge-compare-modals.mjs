import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {cli} from './capture.mjs';
const file='app/checks/modal-final.json';const merged=new Map();for(const f of [file,'app/checks/modal-final-tail.json','app/checks/modal-final-responsive.json'])for(const r of JSON.parse(fs.readFileSync(f)))merged.set(r.key+'-'+r.width+'-'+r.state,r);fs.writeFileSync(file,JSON.stringify([...merged.values()],null,2));
const base=JSON.parse(fs.readFileSync('app/checks/interaction-comparisons.json'));const all=new Map(base.map(r=>[r.key+'-'+r.width+'-'+r.state,r]));
for(const r of merged.values()){
const p=spawnSync(cli,['web-pixels-compare','--json','-'],{input:JSON.stringify({before:{path:path.resolve(r.sourceImage)},after:{path:path.resolve(r.localImage)},common_area:true,tolerance:16}),encoding:'utf8',maxBuffer:1e7});let result=null;try{result=JSON.parse(p.stdout).result}catch{}
all.set(r.key+'-'+r.width+'-'+r.state,{key:r.key,width:r.width,state:r.state,before:r.sourceImage,after:r.localImage,status:result?.comparable?'compared':'error',record:r.record,opening_width:r.opening_width,result});}
fs.writeFileSync('app/checks/interaction-comparisons.json',JSON.stringify([...all.values()],null,2));
console.log(JSON.stringify({modalCases:merged.size,totalStates:all.size,under98:[...all.values()].filter(x=>x.result?.perceptual_similarity<.98).map(x=>[x.key,x.width,x.state,Math.round(1000*x.result.perceptual_similarity)/10])}));

