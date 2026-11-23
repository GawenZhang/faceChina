import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {cli} from './capture.mjs';
const file='app/checks/backend-comparisons.json';const rows=JSON.parse(fs.readFileSync(file,'utf8'));
for(const row of rows){
 if(process.env.GEO_VERIFY_KEY&&!process.env.GEO_VERIFY_KEY.split(',').includes(row.key))continue;
 const input={before:{path:path.resolve(row.original)},after:{path:path.resolve(row.local)},common_area:true,tolerance:16};
 const result=spawnSync(cli,['web-pixels-compare','--json','-'],{input:JSON.stringify(input),encoding:'utf8',maxBuffer:16e6});
 if(result.status!==0)throw new Error(result.stderr||result.stdout);
 const data=JSON.parse(result.stdout);row.comparison=data.result;
 fs.writeFileSync(path.join(path.dirname(row.local),'pixels.json'),JSON.stringify(data,null,2));
}
fs.writeFileSync(file,JSON.stringify(rows,null,2));
console.log(JSON.stringify({total:rows.length,viewportBelowThreshold:rows.filter(r=>r.comparison?.perceptual_similarity<.98).map(r=>({key:r.key,width:r.width,ssim:r.comparison.perceptual_similarity}))}));
