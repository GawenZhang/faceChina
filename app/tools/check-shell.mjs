import fs from 'node:fs';import {run} from './capture.mjs';
process.env.GEO_CAPTURE_TARGET='E6BC15F3BDB72E4862127464BA262FE2';
const html=fs.readFileSync('capture/admin/login/final.html','utf8');const icons=[...html.matchAll(/<li class="treeview"><a[^>]*><i class="fa ([^" ]+)/g)].map(m=>m[1]);
for(const width of [1440,390]){
 const actions=[{kind:'goto',url:'http://127.0.0.1:4173/user/index/index',wait_ms:1000}];for(const icon of icons)actions.push({kind:'click',selector:'.sidebar-menu > li.treeview > a:has(i.'+icon+')'},{kind:'wait',ms:400},{kind:'click',selector:'.sidebar-menu > li.treeview > a:has(i.'+icon+')'});
 actions.push({kind:'click',selector:'.user-menu .dropdown-toggle'},{kind:'wait',ms:400});
 run('local-shell-states-'+width,actions,width,{capture:{after_each_step:['dom','screenshot'],at_end:['dom','screenshot'],events:['page_errors']}});
}
