import fs from 'node:fs';
import {createHash} from 'node:crypto';
process.env.GEO_CAPTURE_TARGET=JSON.parse(fs.readFileSync('app/checks/local-target.json','utf8')).id;
const {run}=await import('./capture.mjs');
const buildHash=createHash('sha256').update(fs.readFileSync('app/dist/admin-runtime.js')).digest('hex');
const cases=[
 {key:'b2b_task-add',open:'.bootstrap-select:has(select[name="b2b_ids[]"]) > button.dropdown-toggle',select:'.bootstrap-select:has(select[name="b2b_ids[]"]) .dropdown-menu li:first-child a[role="option"]',expected:'列举网'},
 {key:'draft-add',open:'.bootstrap-select > button.dropdown-toggle',select:'.bootstrap-select .dropdown-menu li:first-child a[role="option"]',expected:'不选择'},
 {key:'user_tdk-add',fields:[['#type_name','交互验收分组'],['#phone','4000000000']]}
];
const report=[];
for(const c of cases)for(const width of [1440,390]){
 const actions=[{kind:'goto',url:'http://127.0.0.1:4173/backend-pages/'+c.key+'.html',wait_ms:1600},{kind:'wait',ms:600}];
 if(c.open)actions.push({kind:'click',selector:c.open},{kind:'wait',ms:350},{kind:'click',selector:c.select},{kind:'wait',ms:350});
 for(const [selector,value] of c.fields||[])actions.push({kind:'fill',selector,value});
 const name='local-select/'+c.key+'-'+width;
 const r=run(name,actions,width,{action_timeout_ms:10000,capture:{after_each_step:['dom','screenshot','accessibility'],at_end:['dom','screenshot','accessibility'],events:['page_errors']}});
 const html=r.result?.final_artifacts?.dom?.text||'';
 const errors=r.result?.events?.items?.filter(e=>/error/i.test(e.kind||''))||[];
 const names=(r.result?.final_artifacts?.accessibility?.nodes||[]).map(n=>n.name);
 const check=c.open?html.includes('title="'+c.expected+'"')&&html.includes('selected'):names.includes('交互验收分组')&&names.includes('4000000000');
 report.push({key:c.key,width,name,buildHash,evidence:r.id,steps:r.result?.steps?.map(s=>({action:s.action,status:s.status,error:s.error})),errors,aborted:r.result?.aborted,check,status:!r.result?.aborted&&!errors.length&&check?'已验证':'待修复',notes:c.key==='draft-add'?'原测试账号文章分类仅有“不选择”；已打开原生菜单并选择该实际选项。':c.key==='user_tdk-add'?'此页无下拉框；验证分组名和联系方式输入。':'已打开原生多选菜单并选择“列举网”。'});
 fs.writeFileSync('app/checks/form-plugin-checks.json',JSON.stringify(report,null,2));
}
