import {spawn} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const cwd=fileURLToPath(new URL('./',import.meta.url));
const scripts=['qa.mjs','qa-motion.mjs','qa-products.mjs','qa-backgrounds.mjs','qa-template-structure.mjs','qa-extended-current.mjs','qa-live-source.mjs','qa-captured-geometry.mjs','qa-why-live.mjs','qa-navigation.mjs','qa-coverage.mjs','qa-new-interactions.mjs','qa-resume.mjs','qa-flows.mjs','qa-faq.mjs'];
let report={started_at:new Date().toISOString(),passed:false,scripts:[]};
let pending=scripts;
if(process.argv.includes('--retry-failed')){
  const previous=JSON.parse(await readFile(new URL('./qa-suite-results.json',import.meta.url),'utf8'));
  if(!previous.completed_at)throw new Error('Wait for the running suite to complete before retrying');
  pending=scripts.filter(script=>!previous.scripts.find(item=>item.script===script)?.passed);
  report={...previous,passed:false,retried_at:new Date().toISOString(),prior_failures:[...(previous.prior_failures||[]),...previous.scripts.filter(item=>!item.passed)]};
  delete report.completed_at;
}

async function run(script){
  const started=Date.now();
  return new Promise(resolve=>{
    const child=spawn(process.execPath,[script],{cwd,shell:false,windowsHide:true,stdio:['ignore','pipe','pipe']});
    let stdout='',stderr='',spawnError;
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data',chunk=>{stdout+=chunk;});
    child.stderr.on('data',chunk=>{stderr+=chunk;});
    child.on('error',error=>{spawnError=error.message;});
    child.on('close',(exitCode,signal)=>{
      let result;
      try{result=JSON.parse(stdout);}catch{/* Preserve raw output when a script prints multiple records. */}
      resolve({script,exitCode,signal,duration_ms:Date.now()-started,passed:exitCode===0&&!spawnError&&result?.passed!==false,stdout,stderr,...(result!==undefined?{result}:{}),...(spawnError?{spawnError}:{})});
    });
  });
}

for(const script of pending){
  console.log(`Running ${script}`);
  const result=await run(script);
  const index=report.scripts.findIndex(item=>item.script===script);
  if(index===-1)report.scripts.push(result);else report.scripts[index]=result;
  // Keep partial results if a later suite is interrupted.
  await writeFile(new URL('./qa-suite-results.json',import.meta.url),JSON.stringify(report,null,2));
  console.log(`${result.passed?'PASS':'FAIL'} ${script} (${result.duration_ms} ms)`);
  if(!result.passed)console.error(result.stderr||result.stdout||result.spawnError||`Exit code: ${result.exitCode}`);
}
report.completed_at=new Date().toISOString();
report.passed=report.scripts.every(result=>result.passed);
await writeFile(new URL('./qa-suite-results.json',import.meta.url),JSON.stringify(report,null,2));
console.log(JSON.stringify({passed:report.passed,scripts:report.scripts.map(({script,passed,exitCode})=>({script,passed,exitCode})),report:'qa-suite-results.json'},null,2));
if(!report.passed)process.exitCode=1;
