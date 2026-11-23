// Post-capture text hygiene. Does not read, rewrite or alter image pixels.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const requested=JSON.parse(fs.readFileSync('craft.json','utf8')).request;
const credential=requested.match(/\u8d26\u53f7\uff1a([^\s]+)/)?.[1];
if(!credential)throw new Error('Cannot locate sampling credential in original task metadata');
const marker='[REDACTED]';
const auditOnly=process.argv.includes('--check');
const keyPattern='(?:__token__|_token|csrf(?:[-_]?token)?|aliosstoken|x-csrf-token)';
const sensitiveKey=new RegExp('^'+keyPattern+'$','i');
const counts={credential:0,htmlToken:0,structuredToken:0,inlineToken:0,queryToken:0,cloudKey:0,sensitiveHeader:0};
const sensitiveHeader=/^(?:cookie|set-cookie|authorization|proxy-authorization|x-api-key)$/i;
const changed=[];
let checked=0;
function hide(value,kind){if(typeof value!=='string'||!value||value===marker)return value;counts[kind]++;return marker;}
function sanitizeText(text){
 text=text.replaceAll(credential,()=>{counts.credential++;return marker;});
 text=text.replace(/<(?:input|meta)\b[^>]*>/gi,tag=>{
   const name=tag.match(/\bname\s*=\s*(["'])(.*?)\1/i)?.[2];
   if(!name||!sensitiveKey.test(name))return tag;
   return tag.replace(/\b(value|content)(\s*=\s*)(["'])(.*?)\3/gi,(all,attr,gap,quote,value)=>attr+gap+quote+hide(value,'htmlToken')+quote);
 });
 const assignment=new RegExp('(["\\\']?'+keyPattern+'["\\\']?\\s*[:=]\\s*)(["\\\'])([^"\\\'\\r\\n]*?)\\2','gi');
 text=text.replace(assignment,(all,prefix,quote,value)=>prefix+quote+hide(value,'inlineToken')+quote);
 const query=new RegExp('([?&]'+keyPattern+'=)([^&\\s"\\\'<>]+)','gi');
 text=text.replace(query,(all,prefix,value)=>prefix+hide(value,'queryToken'));
 text=text.replace(/(?:LTAI|AKIA)[A-Za-z0-9]{12,}/g,()=>{counts.cloudKey++;return marker;});
 return text;
}
function headerValue(value){
 if(Array.isArray(value))return value.map(headerValue);
 if(typeof value==='string')return hide(value,'sensitiveHeader');
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,/^(?:value|values|content|raw)$/i.test(key)?headerValue(item):item]));
 return value;
}
function visit(value,inHeaders=false){
 if(typeof value==='string')return sanitizeText(value);
 if(Array.isArray(value))return value.map(item=>visit(item,inHeaders));
 if(value&&typeof value==='object'){
  const copy={};
  for(const [key,item]of Object.entries(value))copy[key]=inHeaders&&sensitiveHeader.test(key)?headerValue(item):sensitiveKey.test(key)&&typeof item==='string'?hide(item,'structuredToken'):visit(item,inHeaders||/^(?:(?:request|response)[_-]?)?headers$/i.test(key));
  if(typeof value.name==='string'&&sensitiveKey.test(value.name)&&typeof value.value==='string')copy.value=hide(value.value,'structuredToken');
  if(inHeaders&&typeof value.name==='string'&&sensitiveHeader.test(value.name))copy.value=headerValue(value.value);
  return copy;
 }
 return value;
}
function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()){if(entry.name!=='node_modules'&&(auditOnly||file!==path.join('app','checks')))walk(file);continue;}
  if(!/\.(?:json|html|js|mjs|md|txt|css|svg|xml|log|ya?ml)$/i.test(file)||file===path.join('capture','redaction-report.json'))continue;
  checked++;
  const buffer=fs.readFileSync(file);
  const utf16=buffer[0]===255&&buffer[1]===254;
  const original=buffer.toString(utf16?'utf16le':'utf8');
  const before={...counts};
  let result;
  if(file.endsWith('.json')){
   try{const parsed=JSON.parse(original.replace(/^\uFEFF/,''));const sanitized=visit(parsed);result=Object.keys(counts).some(k=>counts[k]!==before[k])?JSON.stringify(sanitized,null,2):original;}
   catch{result=sanitizeText(original);}
  }else result=sanitizeText(original);
  if(result!==original){
   const output=Buffer.from(utf16?'\uFEFF'+result.replace(/^\uFEFF/,''):result,utf16?'utf16le':'utf8');
   if(!auditOnly){const temporary=file+'.redaction.tmp';fs.writeFileSync(temporary,output);fs.renameSync(temporary,file);}
   changed.push({file:file.replaceAll('\\','/'),sha256Before:crypto.createHash('sha256').update(buffer).digest('hex'),sha256After:crypto.createHash('sha256').update(output).digest('hex'),replacements:Object.fromEntries(Object.keys(counts).map(k=>[k,counts[k]-before[k]]).filter(([,n])=>n))});
  }
 }
}
for(const root of ['app','capture'])walk(root);
const report={timestamp:new Date().toISOString(),scope:['app','capture'],excluded:['original task metadata (read only in memory)','node_modules junction (vendor source scanned)','image pixels and binary assets','app/checks during mutation (concurrently written; included in read-only audits)'],method:'Post-capture text sanitization using atomic file replacement; token names, DOM structure and evidence IDs retained, token values replaced. Original evidence IDs refer to the capture before this text hygiene pass. Each changed file has before/after SHA-256 hashes.',checked,filesChanged:changed.length,counts,changed};
if(!auditOnly){
 let previous;try{previous=JSON.parse(fs.readFileSync('capture/redaction-report.json','utf8'));}catch{}
 const pass={timestamp:report.timestamp,checked,filesChanged:changed.length,counts:{...counts}};
 report.passes=[...(previous?.passes||(previous?[{timestamp:previous.timestamp,checked:previous.checked,filesChanged:previous.filesChanged,counts:previous.counts}]:[])),pass];
 report.changed=[...(previous?.changed||[]),...changed.map(item=>({...item,passTimestamp:report.timestamp}))];
 report.filesChanged=new Set(report.changed.map(item=>item.file)).size;
 report.counts=Object.fromEntries(Object.keys(counts).map(key=>[key,report.passes.reduce((sum,item)=>sum+(item.counts[key]||0),0)]));
 fs.writeFileSync('capture/redaction-report.json',JSON.stringify(report,null,2));
}
console.log(JSON.stringify({auditOnly,checked,filesChanged:changed.length,counts}));
