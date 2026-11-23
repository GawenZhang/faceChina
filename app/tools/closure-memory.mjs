import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const cli='C:/Users/Administration/.dsh/plugins-data/craft-anything/0.6.0/craft-anything-cli.exe';
function call(command,payload){
 const p=spawnSync(cli,[command,'--project','investigation.cany','--json','-'],{input:JSON.stringify(payload),encoding:'utf8',maxBuffer:5e6});
 if(p.status!==0)throw new Error(p.stderr||p.stdout);
 const r=JSON.parse(p.stdout);console.log(command,JSON.stringify({ok:true,id:r.result?.id,revision:r.result?.revision,status:r.result?.status}));return r;
}
const finish=process.argv.includes('--finish');
call('core-plan-update',{steps:[
 {title:'补齐登录错误和协议双宽实测证据',status:finish?'done':'doing',why:'CLI隔离上下文；空表单、错误账号、未勾协议三个状态双宽，保持原会话'},
 {title:'复现本地状态并登记全部差异',status:finish?'done':'doing',why:'保留静态demo错误反馈差异；5项快照逐条保留'},
 {title:'全部测试、构建、rebuild_check及预览',status:finish?'done':'todo',why:finish?'最终报告 app/checks/final-validation.json':'完成后写最终报告'},
 {title:'敏感信息审计、验收及交接闭环',status:finish?'done':'todo',why:finish?'验收0未验证、0待修复；敏感信息审计通过':'更新生成器和交接'}
]});
if(process.argv.includes('--resolve')){
 const rows=JSON.parse(fs.readFileSync('app/checks/login-closure.json','utf8')).rows;
 const ids=state=>rows.filter(r=>r.state===state).flatMap(r=>r.evidenceIds.slice(0,2));
 const unknowns=call('core-unknowns-show',{}).result.items;
 for(const [id,resolution,evidence] of [
  ['unk_535e912a89bb59c9','已完成CLI双宽实测：空表单原生required提示；虚构错误账号POST返回HTTP200“用户名不正确”独立页及3秒返回。成功登录落点前轮已确认。本地错误反馈保留“演示账号或密码错误”Layer并不发送认证请求，截图及原因见app/checks/login-closure.json。此未知的交互证据部分已解决；服务端源码、真实鉴权及其他错误分支作为静态演示的已登记范围边界，不声明等价。',ids('invalid')],
  ['unk_72d7e78db17ca13b','已完成原站及本地1440/390实际填表、取消协议并提交的CLI截图、DOM及网络取证，均显示“请阅读并勾选用户协议”，无登录POST；感知相似度均超过98%。微量残差为Layer抖动截图时刻差异，实测数值见app/checks/login-closure.json。采用隔离临时上下文，未退出原站持久会话。',ids('agreement')]
 ]){
  const u=unknowns.find(u=>u.id===id);
  call('core-unknown-edit',{unknown_id:id,based_on_revision:u.revision,status:'resolved',resolution,evidence_for:evidence});
 }
 call('core-finding-record',{confidence:'observed',evidence_ids:ids('invalid').concat(ids('agreement')),statement:'监工指令3已补齐原站和本地空表单、错误账号、未勾协议1440/390六组对照。原站错误账号为独立“用户名不正确”页，本地保留演示Layer差异；协议提示一致且空表单原生拦截；5项既有数据快照差异原因完整，未伪装视觉一致。'});
}
if(finish)call('core-handoff-write',{text:fs.readFileSync('app/交接记录.md','utf8')});
