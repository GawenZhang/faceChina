import fs from 'node:fs';import {run} from './capture.mjs';
const html=fs.readFileSync('capture/admin/login/final.html','utf8');
const icons=[...html.matchAll(/<li class="treeview"><a[^>]*><i class="fa ([^" ]+)/g)].map(m=>m[1]);
for(const width of [1440,390]){
 const original=run('shell-'+width,[{kind:'goto',url:'https://geo136.doujia5799.top/user/index/index',wait_ms:3500},{kind:'wait',ms:1200}],width);
 const actions=[];for(const icon of icons){actions.push({kind:'click',selector:'.sidebar-menu > li.treeview > a:has(i.'+icon+')'},{kind:'wait',ms:350},{kind:'click',selector:'.sidebar-menu > li.treeview > a:has(i.'+icon+')'});}
 actions.push({kind:'click',selector:'.user-menu .dropdown-toggle'},{kind:'wait',ms:400});
 run('shell-states-'+width,actions,width,{capture:{after_each_step:['dom','screenshot'],at_end:['dom','screenshot'],events:['page_errors']}});
}
