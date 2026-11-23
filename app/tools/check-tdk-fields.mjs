import fs from 'node:fs';import {createHash} from 'node:crypto';
const report=[];const groups=['keywords','citys','companys','descs'];const buttons={keywords:'addKeywordBtn',citys:'addCityBtn',companys:'addCompanyBtn',descs:'addDescBtn'};const hash=createHash('sha256').update(fs.readFileSync('app/dist/admin-runtime.js')).digest('hex');
const {run}=await import('./capture.mjs');
function counts(e){const html=e.result?.final_artifacts?.dom?.text||'';return Object.fromEntries(groups.map(g=>[g,(html.match(new RegExp('data-group="'+g+'"','g'))||[]).length]));}
function remember(kind,width,state,name,e,expected,extra={}){const actual=counts(e);const html=e.result?.final_artifacts?.dom?.text||'';const passed=!e.result?.aborted&&groups.every(g=>actual[g]===expected[g])&&(!extra.text||html.includes(extra.text));report.push({kind,width,state,name,evidence_id:e.id,runtimeSHA256:kind==='local'?hash:undefined,expected,actual,passed,errors:e.result?.events?.items||[],...extra});fs.writeFileSync('app/checks/tdk-field-checks.json',JSON.stringify(report,null,2));console.log('TDK_FIELDS',kind,width,state,passed,JSON.stringify(actual));}
for(const kind of ['source','local'])for(const width of [1440,390]){
 const url=kind==='source'?'https://geo136.doujia5799.top/user/user_tdk/add?addtabs=1':'http://127.0.0.1:4173/backend-pages/user_tdk-add.html';const tab=await(await fetch('http://127.0.0.1:9222/json/new?'+encodeURIComponent(url),{method:'PUT'})).json();process.env.GEO_CAPTURE_TARGET=tab.id;
 const actions=[{kind:'goto',url,wait_ms:1400},{kind:'wait',ms:2500}];
 for(const group of groups){actions.push({kind:'fill',selector:'#'+group+'Container .field-input',value:group+'甲'},{kind:'press',selector:'#'+buttons[group],key:'Shift'},{kind:'click',selector:'#'+buttons[group]},{kind:'fill',selector:'#'+group+'Container .field-row:nth-child(2) .field-input',value:group+'乙'});}
 actions.push({kind:'press',selector:'#keywordsContainer .field-row:nth-child(2) .field-input',key:'Enter'},{kind:'wait',ms:350});
 let name='tdk-fields-final/'+kind+'-'+width+'-added',e=run(name,actions,width);remember(kind,width,'add-four-groups-and-enter',name,e,{keywords:3,citys:2,companys:2,descs:2});
 const removals=[];for(const group of groups){const selector='#'+group+'Container .field-row:nth-child(2) .btn-remove';removals.push({kind:'press',selector,key:'Shift'},{kind:'click',selector});}removals.push({kind:'wait',ms:200});
 name='tdk-fields-final/'+kind+'-'+width+'-removed';e=run(name,removals,width);remember(kind,width,'remove-rows',name,e,{keywords:2,citys:1,companys:1,descs:1});
 name='tdk-fields-final/'+kind+'-'+width+'-reset';e=run(name,[{kind:'press',selector:'#entryForm button[type="reset"]',key:'Shift'},{kind:'click',selector:'#entryForm button[type="reset"]'},{kind:'wait',ms:400}],width);remember(kind,width,'reset-to-single-empty-row',name,e,{keywords:1,citys:1,companys:1,descs:1});
 if(kind==='local'){
  const fills=[{kind:'fill',selector:'#type_name',value:'本地测试分组'},{kind:'fill',selector:'#phone',value:'测试联系方式'},{kind:'fill',selector:'#zhuti',value:'测试主体'},{kind:'press',selector:'#entryForm button[type="submit"]',key:'Shift'},{kind:'click',selector:'#entryForm button[type="submit"]'},{kind:'wait',ms:300}];
  name='tdk-fields-final/'+kind+'-'+width+'-required';e=run(name,fills,width);remember(kind,width,'required-group-validation',name,e,{keywords:1,citys:1,companys:1,descs:1},{text:'请至少填写一个关键词'});
  const save=groups.map(group=>({kind:'fill',selector:'#'+group+'Container .field-input',value:group+'本地样例'}));save.push({kind:'press',selector:'#entryForm button[type="submit"]',key:'Shift'},{kind:'click',selector:'#entryForm button[type="submit"]'},{kind:'wait',ms:300});
  name='tdk-fields-final/'+kind+'-'+width+'-saved';e=run(name,save,width);remember(kind,width,'local-save',name,e,{keywords:1,citys:1,companys:1,descs:1},{text:'已保存本地演示数据'});
 }
}
