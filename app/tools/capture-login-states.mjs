import {run} from './capture.mjs';
for(const w of [1440,390]){
 run('login-protocol-'+w,[{kind:'goto',url:'https://geo136.doujia5799.top/user/index/login',wait_ms:500},{kind:'fill',selector:'#username',value:'demo-invalid'},{kind:'fill',selector:'#password',value:'invalid-demo'},{kind:'click',selector:'#agree_input'},{kind:'click',selector:'.sub-btn'},{kind:'wait',ms:100}],w);
}
run('login-error-1440',[{kind:'goto',url:'https://geo136.doujia5799.top/user/index/login',wait_ms:500},{kind:'fill',selector:'#username',value:'demo-invalid'},{kind:'fill',selector:'#password',value:'invalid-demo'},{kind:'click',selector:'.sub-btn'},{kind:'wait',ms:700}],1440);
