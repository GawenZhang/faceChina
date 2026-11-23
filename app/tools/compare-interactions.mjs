import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {cli} from './capture.mjs';
const records=JSON.parse(fs.readFileSync('app/checks/interaction-coverage.json','utf8'));const sources=JSON.parse(fs.readFileSync('capture/admin/interaction-coverage.json','utf8'));const output=[];
for(const local of records){if(local.status!=='complete')continue;const src=sources.find(s=>s.name===local.source&&s.status==='complete');if(!src)continue;
for(const state of local.states||[]){const originalState=src.states?.find(s=>s.name===state.name);if(!originalState)continue;
const before=path.resolve('capture/admin',src.name,'step-'+originalState.step+'.png');const after=path.resolve('capture/admin',local.name,'step-'+state.step+'.png');
if(!fs.existsSync(before)||!fs.existsSync(after)){output.push({key:local.key,width:local.width,state:state.name,status:'missing-screenshot',before,after});continue;}
const p=spawnSync(cli,['web-pixels-compare','--json','-'],{input:JSON.stringify({before:{path:before},after:{path:after},tolerance:16,common_area:true}),encoding:'utf8',maxBuffer:10e6});let result=null;try{result=JSON.parse(p.stdout).result}catch{}
output.push({key:local.key,width:local.width,state:state.name,before:path.relative(process.cwd(),before),after:path.relative(process.cwd(),after),status:result?.comparable?'compared':'error',result});
}}
fs.writeFileSync('app/checks/interaction-comparisons.json',JSON.stringify(output,null,2));console.log(JSON.stringify({states:output.length,noncomparable:output.filter(x=>x.status!=='compared').length,under98:output.filter(x=>x.result?.perceptual_similarity<.98).map(x=>[x.key,x.width,x.state,Math.round(x.result.perceptual_similarity*1000)/10])}));
