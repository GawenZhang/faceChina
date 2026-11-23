import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {cli} from './capture.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const rows=[];
for(const width of [1440,390])for(const state of ['empty','invalid','agreement']){
 const dirs=['source','local'].map(kind=>`capture/admin/login-closure/${kind}-${state}-${width}`);
 const [source,local]=dirs.map(dir=>read(dir+'/record.json'));
 const observations=dirs.map(dir=>read(dir+'/observation.json'));
 for(const [i,r] of [source,local].entries()){
  assert.equal(r.result.aborted,null);
  assert.ok(r.result.steps.every(s=>s.status==='ok'));
  assert.equal(r.result.events.items.filter(e=>e.kind==='page-error').length,0);
  const png=fs.readFileSync(dirs[i]+'/final.png');assert.equal(png.readUInt32BE(16),width);assert.equal(png.readUInt32BE(20),900);
 }
 const post=r=>r.result.network.requests.filter(r=>r.method==='POST');
 assert.equal(post(local).length,0,'Local login must not make authentication requests');
 assert.equal(local.result.network.requests.filter(r=>r.url.startsWith('https://geo136')).length,0);
 if(state==='empty')for(const o of observations){assert.equal(o.activeElement,'username');assert.equal(o.fields.length,2);assert.ok(o.fields.every(f=>f.required&&f.valueMissing&&f.validationMessage==='请填写此字段。'));}
 if(state==='agreement')for(const o of observations){assert.equal(o.agreement,false);assert.ok(o.messages.includes('请阅读并勾选用户协议'));assert.ok(o.fields.every(f=>!f.valueMissing));}
 if(state==='invalid'){
  assert.ok(observations[0].messages.includes('用户名不正确'));
  assert.ok(observations[1].messages.includes('演示账号或密码错误'));
  assert.equal(post(source).length,1);assert.equal(post(source)[0].status,200);
 }else assert.equal(post(source).length,0);
 const sourceImage=dirs[0]+'/final.png',localImage=dirs[1]+'/final.png';
 const out=spawnSync(cli,['web-pixels-compare','--project','investigation.cany','--json','-'],{input:JSON.stringify({before:{path:path.resolve(sourceImage)},after:{path:path.resolve(localImage)},common_area:true,tolerance:16}),encoding:'utf8',maxBuffer:1e7});
 assert.equal(out.status,0,out.stderr);const result=JSON.parse(out.stdout);assert.ok(result.result.comparable);
 const reason=state==='invalid'?'原站错误账号POST后返回“用户名不正确”独立页，3秒后返回；本地静态演示无真实鉴权，保留“演示账号或密码错误”Layer提示且不发认证请求。两者已双宽实测，保留页面、文案和跳转差异，不认定视觉等价。':state==='empty'?'双侧空表单均由原生required拦截，账号获得焦点并显示“请填写此字段。”，没有登录POST；截图含浏览器原生提示。':'双侧填入同一虚构无效输入后取消协议均显示“请阅读并勾选用户协议”Layer提示，没有登录POST；抖动动画采样时刻可能产生像素差异。';
 rows.push({state,width,status:state==='invalid'?'已验证（保留差异）':'已验证',sourceImage,localImage,reason,comparison:result.result,evidenceIds:[source.id,local.id,result.id],observations});
}
const report={timestamp:new Date().toISOString(),method:'CLI web-walkthrough-record --allow-run --deep over CDP 9222; isolated disposable context; synthetic invalid input only',rows,statusCounts:rows.reduce((a,r)=>(a[r.status]=(a[r.status]||0)+1,a),{}),pass:true};
fs.writeFileSync('app/checks/login-closure.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(rows.map(({state,width,status,comparison})=>({state,width,status,similarity:comparison.perceptual_similarity,difference:comparison.difference_fraction}))));
