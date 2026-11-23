import fs from 'node:fs';
const file='app/checks/interaction-comparisons.json';const original=JSON.parse(fs.readFileSync(file,'utf8'));const freshSource=JSON.parse(fs.readFileSync('app/checks/interaction-residual-review.json','utf8'));const freshLocal=JSON.parse(fs.readFileSync('app/checks/interaction-local-residual-review.json','utf8'));
const key=r=>r.key+'-'+r.width+'-'+r.state;const local=new Map(freshLocal.map(r=>[key(r),r]));const updates=new Map();
for(const s of freshSource){const r=local.get(key(s))||s;const old=original.find(x=>key(x)===key(s));let reason,notes;
 if(s.key==='user_score_log'){reason='原站最新稳定交互采样显示0条记录，本地保留较早稳定采样的3条记录；数据状态不同。';notes='已重新打开原站并等待后复核，差异仍存在；没有为提高相似度删除本地采样数据。';}
 else if(s.state!=='add'){reason='原始证据采用桌面加载后切换卡片再缩至390；固定列显示状态与直接390加载不同。';notes='现按本地相同的目标宽度重新加载原站，搜索/列选择交互截图已对齐；原始路径与分数保留。';}
 else if(r.result?.perceptual_similarity>=.98){reason='稳定原站弹窗与本地完成初始化后的弹窗已复核对齐。';notes='保留旧异步初始化截图；本地复拍包含原生selectpicker重建及短弹窗iframe最小高度修正。达到98%验收阈值不等于逐像素100%。';}
 else {reason='稳定原站与最新本地弹窗仍有可见差异，需结合配对截图定位。';notes='该项保留待修复，未将页面无报错视为视觉一致。';}
 updates.set(key(s),{...old,before:r.sourceImage,after:r.localImage,status:r.result?.comparable?'compared':'error',result:r.result,priorSourceImage:old.priorSourceImage||r.priorSourceImage||old.before,priorLocalImage:old.priorLocalImage||r.priorLocalImage||old.after,priorSimilarity:old.priorSimilarity??r.priorSimilarity??old.result?.perceptual_similarity,source_evidence_id:r.evidence_id,...(r.local_evidence_id?{local_evidence_id:r.local_evidence_id,runtimeSHA256:r.runtimeSHA256,templatesSHA256:r.templatesSHA256}:{}),review_record:'app/checks/'+(local.has(key(s))?'interaction-local-residual-review.json':'interaction-residual-review.json'),reason,notes});
}
const merged=original.map(r=>updates.get(key(r))||r);fs.writeFileSync(file,JSON.stringify(merged,null,2));console.log(JSON.stringify({total:merged.length,refreshed:updates.size,under98:merged.filter(r=>r.result?.perceptual_similarity<.98).map(r=>[r.key,r.width,r.state,r.result.perceptual_similarity,r.reason])}));
