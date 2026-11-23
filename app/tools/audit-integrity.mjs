import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const request=JSON.parse(fs.readFileSync('craft.json','utf8')).request;
const credential=request.match(/\u8d26\u53f7\uff1a([^\s]+)/)?.[1];
if(!credential)throw new Error('Original task credential cannot be located in memory');
const variants=[];
function add(encoding,value){if(value)variants.push({encoding,value});}
for(const value of new Set([credential,credential.toLowerCase(),credential.toUpperCase()])){
 const bytes=Buffer.from(value);
 add('plain',value);add('url_component',encodeURIComponent(value));
 add('percent_bytes',[...bytes].map(n=>'%'+n.toString(16).padStart(2,'0')).join(''));
 add('base64',bytes.toString('base64'));add('base64url',bytes.toString('base64url'));
 add('base64_utf16le',Buffer.from(value,'utf16le').toString('base64'));
 add('hex_utf8',bytes.toString('hex'));
 add('json_unicode',[...value].map(c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0')).join(''));
 add('html_decimal',[...value].map(c=>'&#'+c.charCodeAt(0)+';').join(''));
 add('html_hex',[...value].map(c=>'&#x'+c.charCodeAt(0).toString(16)+';').join(''));
}
const sanitizerCode=fs.readFileSync('app/tools/redact-capture-text.mjs','utf8').split('function walk(dir)')[0].replace(/^import .*;\r?\n/gm,'');
const sanitizer={fs,process:{argv:['--check']}};
vm.createContext(sanitizer);vm.runInContext(sanitizerCode,sanitizer);
const files=[],htmlFiles=[];
function collect(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory()){if(entry.name!=='node_modules')collect(file);}else if(/\.(?:json|html|js|mjs|md|txt|css|svg|xml|log|ya?ml)$/i.test(file)&&file!==path.join('app','checks','integrity.json'))files.push(file);}}
collect('app');collect('capture');
const encodingHits=Object.fromEntries([...new Set(variants.map(v=>v.encoding))].map(key=>[key,0]));
const credentialFiles=[],tokenFiles=[],missingNoindex=[],structuredData=[];
for(const file of files){
 const buffer=fs.readFileSync(file);
 const text=buffer.toString(buffer[0]===255&&buffer[1]===254?'utf16le':'utf8');
 const lower=text.toLowerCase();
 const encodings=[...new Set(variants.filter(v=>lower.includes(v.value.toLowerCase())).map(v=>v.encoding))];
 if(encodings.length){credentialFiles.push({file:file.replaceAll('\\','/'),encodings});for(const key of encodings)encodingHits[key]++;}
 const before=JSON.parse(vm.runInContext('JSON.stringify(counts)',sanitizer));
 try{if(file.endsWith('.json'))sanitizer.visit(JSON.parse(text.replace(/^\uFEFF/,'')));else sanitizer.sanitizeText(text);}catch{sanitizer.sanitizeText(text);}
 const after=JSON.parse(vm.runInContext('JSON.stringify(counts)',sanitizer));
 if(['htmlToken','structuredToken','inlineToken','queryToken','cloudKey','sensitiveHeader'].some(key=>after[key]>before[key]))tokenFiles.push({file:file.replaceAll('\\','/'),categories:Object.keys(after).filter(key=>after[key]>before[key])});
 if(file.startsWith(path.join('app','dist')+path.sep)&&file.endsWith('.html')){
  htmlFiles.push(file);
  if(!/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(text)&&!/<meta\b[^>]*content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["']/i.test(text))missingNoindex.push(file.replaceAll('\\','/'));
  if(/<script\b[^>]*type=["']application\/ld\+json/i.test(text))structuredData.push(file.replaceAll('\\','/'));
 }
}
const robots=['app/robots.txt','app/dist/robots.txt'].map(file=>{let content='';try{content=fs.readFileSync(file,'utf8');}catch{}return{file,exists:!!content,disallowAll:/User-agent:\s*\*/i.test(content)&&/^Disallow:\s*\/\s*$/im.test(content)};});
const forbiddenIndexFiles=files.filter(file=>file.startsWith('app'+path.sep)&&/^(?:sitemap(?:[-_].*)?\.xml|llms\.txt)$/i.test(path.basename(file))).map(file=>file.replaceAll('\\','/'));
const counters=JSON.parse(vm.runInContext('JSON.stringify(counts)',sanitizer));
const headerAudit={recordFilesChecked:0,networkRecordsChecked:0,sensitiveHeaderEntries:[],unredactedEntries:[]};
const headerName=/^(?:cookie|set-cookie|authorization|proxy-authorization|x-api-key)$/i;
const valueRedacted=value=>value==null||value===''||value==='[REDACTED]'||(Array.isArray(value)&&value.every(valueRedacted))||(typeof value==='object'&&Object.entries(value).filter(([key])=>/^(?:value|values|content|raw)$/i.test(key)).every(([,item])=>valueRedacted(item)));
for(const file of files.filter(file=>file.startsWith('capture'+path.sep)&&path.basename(file).endsWith('record.json'))){
 headerAudit.recordFilesChecked++;
 let doc;try{doc=JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));}catch{continue;}
 const network=doc.result?.network||doc.structuredContent?.result?.network||doc.network;
 if(!network)continue;headerAudit.networkRecordsChecked++;
 function inspect(node,inside=false,pointer='network'){
  if(!node||typeof node!=='object')return;
  if(Array.isArray(node)){node.forEach((item,i)=>inspect(item,inside,pointer+'['+i+']'));return;}
  const add=(name,value,suffix)=>{const entry={file:file.replaceAll('\\','/'),jsonPath:pointer+suffix,header:name,valueRedacted:valueRedacted(value)};headerAudit.sensitiveHeaderEntries.push(entry);if(!entry.valueRedacted)headerAudit.unredactedEntries.push(entry);};
  if(inside&&typeof node.name==='string'&&headerName.test(node.name))add(node.name,node.value,'.value');
  for(const [key,value]of Object.entries(node)){
   if(inside&&headerName.test(key))add(key,value,'.'+key);
   inspect(value,inside||/^(?:(?:request|response)[_-]?)?headers$/i.test(key),pointer+'.'+key);
  }
 }
 inspect(network);
}
const report={timestamp:new Date().toISOString(),scope:['app (including dist, source, documentation and checks)','capture (original/local evidence and reports)'],excluded:['Original task metadata and other workspace metadata; credential read from craft.request in memory only','node_modules junction (vendor sources scanned)','PNG/JPEG and other binary data; screenshots were masked before capture, never pixel-edited','This integrity report itself'],textFilesChecked:files.length,credential:{filesWithMatches:credentialFiles.length,encodingsChecked:Object.keys(encodingHits),hitsByEncoding:encodingHits,matches:credentialFiles},tokens:{htmlCSRF:counters.htmlToken,structuredCSRF:counters.structuredToken,inlineCSRFOrAliOss:counters.inlineToken,queryCSRF:counters.queryToken,cloudKeys:counters.cloudKey,sensitiveHeaders:counters.sensitiveHeader,matches:tokenFiles},robots,servedHtml:{count:htmlFiles.length,missingNoindex,structuredData},forbiddenIndexFiles,redactionReport:'../../capture/redaction-report.json'};
report.pass=credentialFiles.length===0&&tokenFiles.length===0&&robots.every(r=>r.disallowAll)&&missingNoindex.length===0&&structuredData.length===0&&forbiddenIndexFiles.length===0;
report.networkHeaders=headerAudit;
report.pass=report.pass&&headerAudit.unredactedEntries.length===0;
fs.writeFileSync('app/checks/integrity.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({pass:report.pass,textFilesChecked:files.length,credentialHits:credentialFiles.length,tokenHits:tokenFiles.length,servedHtml:htmlFiles.length,missingNoindex:missingNoindex.length,robots:robots.every(r=>r.disallowAll),forbiddenIndexFiles:forbiddenIndexFiles.length}));
