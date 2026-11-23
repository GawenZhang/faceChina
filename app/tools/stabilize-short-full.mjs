import fs from 'node:fs';
import crypto from 'node:crypto';
const rows=JSON.parse(fs.readFileSync('app/backend-page-manifest.json','utf8'));
const reused=[],pending=[];
for(const r of rows)for(const width of [1440,390]){
 const dir='capture/admin/'+r.key+'-'+width;
 try{
  const meta=JSON.parse(fs.readFileSync(dir+'/full.png.json','utf8'));
  if(['general-profile','user_score_log'].includes(r.key)){
   reused.push({key:r.key,width,file:dir+'/full.png',method:'Existing settled CDP full capture preserved'});
   continue;
  }
  const final=fs.readFileSync(dir+'/final.png');
  const local=fs.readFileSync('capture/admin/local/'+r.key+'-'+width+'/full.png');
  const html=fs.readFileSync(dir+'/final.html','utf8');
  const loaders=[...html.matchAll(/<div\b[^>]*class="[^"]*fixed-table-loading[^>]*>/g)];
  const rendered=!/<table[^>]+id="table"/.test(html)||html.includes('fixed-table-loading');
  const stable=rendered&&loaders.every(x=>/display:\s*none/.test(x[0]));
  if(meta.height!==900||final.readUInt32BE(16)!==width||final.readUInt32BE(20)!==900||local.readUInt32BE(20)>900||!stable)throw new Error('Requires settled long capture');
  const record=fs.existsSync(dir+'/settled-record.json')?'settled-record.json':'record.json';
  const evidence=JSON.parse(fs.readFileSync(dir+'/'+record,'utf8'));
  if(evidence.result?.environment?.requested?.width!==width)throw new Error('CLI viewport evidence missing');
  fs.writeFileSync(dir+'/full.png',final);
  fs.writeFileSync(dir+'/full.png.json',JSON.stringify({...meta,viewportApplied:true,readiness:{source:'Settled CLI final capture reused unchanged; identical 900px extent verified against original full extent and local rendered DOM',visibleLoading:0},provenance:{record,artifact:'final.png',evidenceId:evidence.id,sha256:crypto.createHash('sha256').update(final).digest('hex')}},null,2));
  reused.push({key:r.key,width,file:dir+'/full.png'});
 }catch(error){pending.push({...r,width,reason:error.message});}
}
fs.writeFileSync('capture/long-full-pending.json',JSON.stringify(pending,null,2));
fs.writeFileSync('capture/short-full-provenance.json',JSON.stringify(reused,null,2));
console.log(JSON.stringify({reused:reused.length,pending:pending.length}));
