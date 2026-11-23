/* Local interaction layer for the captured FastAdmin / Layui interface. */
(function () {
  'use strict';
  var body = document.body;
  var pageKey = body.dataset.pageKey || location.pathname.split('/').pop().replace('.html', '');
  var shell = pageKey === 'shell' || !!document.querySelector('.main-sidebar');
  var routes = {};
  var stateKey = 'geo-local-page:' + pageKey;
  var table = document.querySelector('.fixed-table-body table') || document.querySelector('#table');
  var activeModal = null;
  var originalRows = table && table.tBodies[0] ? table.tBodies[0].innerHTML : '';
  var page = 1, pageSize = 10, filtered = null;
  var editors=[];
  var modalLayouts={};
  var manualKeywordMarkup="<div class=\"keyword_block keyword_all\">\n        <div class=\"keyword_item\">\n            <p>前缀（换行，一行一个，0-20个） </p>\n            <textarea  class=\"form-control \" id=\"prefixes\" name=\"row[pre_keywords]\" data-rule=\"\" rows=\"20\" type=\"text\" placeholder=\"前缀如：\n推荐\n求推荐\n推荐一下\n靠谱的\n口碑好的\n口碑不错的\n诚信的\n专业的\n实力强的\n售后完善的\"></textarea>\n        </div>\n        <div class=\"keyword_item\">\n            <p>主词（必须包含关键词，1-20个）</p>\n            <textarea   class=\"form-control\" id=\"main-words\" name=\"row[tuozhan_keywords]\" data-rule=\"\" rows=\"20\" type=\"text\" placeholder=\"主词相关，比如主词是：GEO\n这里可以写：\n\nGEO优化\nGEO优化软件\nGEO软件\n\"></textarea>\n        </div>\n        <div class=\"keyword_item\">\n            <p>后缀（换行，一行一个，0-20个） </p>\n            <textarea  id=\"suffixes\" class=\"form-control\" name=\"row[next_keywords]\" data-rule=\"\" rows=\"20\" type=\"text\" placeholder=\"后缀如：\n厂家\n生产厂家\n源头厂家\n供应商\n公司\n服务商\n渠道\n机构\n方案\n平台\n权威平台\n管理平台\"></textarea>\n        </div>\n    </div>";
  if(new URLSearchParams(location.search).has('localDialog')&&new URLSearchParams(location.search).get('originalDialog')!=='0')body.classList.add('is-dialog');
  // The shipped Bootstrap widget implementations own dropdown/tab behavior;
  // this local router supplies their delegated event boundary for static pages.
  if(window.jQuery){window.jQuery(document).off('.bs.dropdown.data-api').off('.bs.tab.data-api');}
  function one(selector, root) { return (root || document).querySelector(selector); }
  function all(selector, root) { return Array.from((root || document).querySelectorAll(selector)); }
  function escapeHTML(text) { return String(text == null ? '' : text).replace(/[&<>"']/g, function(c) {return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function layer() { return window.layer || (window.layui && window.layui.layer); }
  function message(text) {
    if (layer()) return layer().msg(text, {time: 2600});
    var toast = document.createElement('div'); toast.className = 'geo-toast'; toast.setAttribute('role','status'); toast.textContent = text;
    body.appendChild(toast); setTimeout(function(){toast.remove();}, 2600);
  }
  function normalize(url) {
    try { return new URL(url, location.origin).pathname.replace(/\/$/,''); } catch(e) { return ''; }
  }
  function routeFor(url) {
    var path = normalize(url), result = routes[path];
    if (result && typeof result === 'object') return result.file || result.local || result.output;
    if (result) return result;
    // Every edit record uses the same sampled form, with local row values supplied separately.
    var match = path.match(/^(.*\/(?:media_id|id|ids)\/)\d+$/);
    if (match) { var key = Object.keys(routes).find(function(k){return k.startsWith(match[1]);}); if(key) return routeFor(key); }
    return null;
  }
  function titleFor(path) {
    var anchor = all('.sidebar-menu a[href]').find(function(a){return normalize(a.getAttribute('href')) === normalize(path);});
    return anchor ? anchor.textContent.trim() : document.title;
  }
  function layoutSelector(layouts,control){
    if(!layouts)return null;
    var direct=Object.keys(layouts).find(function(selector){try{return control.matches(selector);}catch(e){return false;}});if(direct)return direct;
    function family(url){return normalize(url).replace(/\/(media_id|id|ids)\/\d+/g,'/$1/{record}');}
    var path=family(actionURL(control));return Object.keys(layouts).find(function(selector){return layouts[selector].url&&family(layouts[selector].url)===path;});
  }
  function navigate(url) {
    var path = normalize(url);
    if (path === '/user/index/logout') {
      sessionStorage.removeItem('geo-demo-session');localStorage.removeItem('geo-demo-remember'); location.href='/user/index/login/';return;
    }
    if(path === '/user' || path === '/user/index/index')path='/user/dashboard';
    if (!routeFor(path)) { message('此入口没有可用的本地采样页面'); return; }
    if (!shell && parent !== window && typeof parent.GeoNavigate === 'function') { parent.GeoNavigate(path);return; }
    if (!shell) { location.href='/user/index/index/#'+encodeURIComponent(path); return; }
    var iframe = one('.content-wrapper iframe');
    if (iframe) { iframe.src=routeFor(path);iframe.title=titleFor(path); }
    all('.sidebar-menu li').forEach(function(li){li.classList.remove('active');});
    all('.sidebar-menu a[href]').filter(function(a){return normalize(a.href)===path;}).forEach(function(a){
      a.parentElement.classList.add('active');var ul=a.closest('.treeview-menu');if(ul){ul.style.display='block';ul.parentElement.classList.add('active');}
    });
    if(location.hash !== '#'+encodeURIComponent(path))history.replaceState(null,'','#'+encodeURIComponent(path));
    body.classList.remove('sidebar-open');
  }
  window.GeoNavigate = navigate;
  function modal(url, control) {
    var file=routeFor(url);
    if(!file) { message('该弹窗尚无可用的本地采样内容'); return; }
    var area=['80%','90%'];try{area=JSON.parse(control.dataset.area||'null')||area;}catch(e){}
    var widthKey=innerWidth<600?'390':'1440',layouts=modalLayouts[pageKey]&&modalLayouts[pageKey][widthKey];
    var match=layoutSelector(layouts,control);
    var layout=match&&layouts[match];if(layout){area=[layout.width,layout.height];if(layout.url&&routeFor(layout.url)){url=layout.url;file=routeFor(url);}}
    var title=control.dataset.title||control.title||control.textContent.trim()||'详情';
    activeModal={url:url,control:control,row:control.closest('tr'),index:null};
    var fastDialog=layout?/[?&]dialog=1(?:&|$)/.test(layout.url||''):true;
    var frameUrl=file+'?localDialog=1&originalDialog='+(fastDialog?'1':'0');
    var skin=layout&&Object.prototype.hasOwnProperty.call(layout,'skin')?layout.skin:'layui-layer-fast';
    if(skin.includes('layui-layer-fast'))skin+=' layui-layer-border';
    if(layer())activeModal.index=layer().open({type:2,title:title,area:area,offset:layout?[layout.top,layout.left]:'auto',skin:skin,shade:layout?.shade??0,shadeClose:true,maxmin:layout?.maxmin??true,content:frameUrl,success:function(layero,index){
      var panel=layero[0]||layero,frame=one('iframe',panel);
      function attachFooter(){try{
        if(!fastDialog)return;
        var child=frame.contentDocument;if(!child)return;var sourceFooter=one('.layer-footer',child);if(!sourceFooter||one('.layui-layer-footer',panel))return;
        var footer=document.createElement('div');footer.className='layui-layer-btn layui-layer-footer';footer.innerHTML='<div class="row">'+sourceFooter.innerHTML+'</div>';panel.appendChild(footer);
        var originalButtons=all('button,a',sourceFooter);all('button,a',footer).forEach(function(button,i){button.addEventListener('click',function(event){event.preventDefault();event.stopPropagation();originalButtons[i]?.click();});});
        frame.style.height=Math.max(0,panel.clientHeight-(one('.layui-layer-title',panel)?.offsetHeight||0)-footer.offsetHeight)+'px';
      }catch(e){}}
      frame.addEventListener('load',attachFooter);setTimeout(attachFooter,100);setTimeout(attachFooter,700);
    }});
    else {
      var dialog=document.createElement('dialog');dialog.className='geo-dialog';
      dialog.innerHTML='<header>'+escapeHTML(title)+'<button type="button" aria-label="关闭">×</button></header><iframe title="'+escapeHTML(title)+'" src="'+frameUrl+'"></iframe>';
      dialog.querySelector('button').onclick=function(){dialog.close();dialog.remove();};body.appendChild(dialog);dialog.showModal();activeModal.dialog=dialog;
    }
  }
  function closeModal() {if(!activeModal)return;if(activeModal.dialog){activeModal.dialog.close();activeModal.dialog.remove();}else if(layer())layer().close(activeModal.index);activeModal=null;}
  function manualKeywords(){
    if(!layer())return;layer().open({title:'手动批量组合',content:manualKeywordMarkup,area:['90%','100%'],shadeClose:true,shade:0.8,btn:['确定'],yes:function(index){
      var keyword=(one('#c-keyword')?.value||'').trim();if(!keyword)return message('请输入主关键词');
      function lines(selector){return (one(selector)?.value||'').split(/\r?\n/).map(function(value){return value.trim();}).filter(Boolean);}
      var prefixes=lines('#prefixes'),mainWords=lines('#main-words'),suffixes=lines('#suffixes');
      if(!mainWords.length)return message('请至少输入1个拓展主词');
      if(Math.max(prefixes.length,mainWords.length,suffixes.length)>20)return message('每组最多输入20条');
      if(mainWords.some(function(word){return !word.includes(keyword);}))return message('主词必须包含关键词');
      var results=[];(prefixes.length?prefixes:['']).forEach(function(prefix){mainWords.forEach(function(word){(suffixes.length?suffixes:['']).forEach(function(suffix){results.push(prefix+word+suffix);});});});
      var output=one('.zhengliu_question_input');output.value=Array.from(new Set(results)).join('\n');output.textContent=output.value;layer().close(index);message('已生成 '+results.length+' 条本地组合');
    }});
  }
  function formData(form) {
    editors.forEach(function(item){if(item.editor.isReady)item.input.value=item.editor.getContent();});
    all('.edui-editor iframe').forEach(function(frame){try{var textarea=one('textarea',frame.closest('.form-group')||form||document);if(textarea&&frame.contentDocument)textarea.value=frame.contentDocument.body.innerHTML;}catch(e){}});
    var data={};all('input,textarea,select',form||document).forEach(function(input,i){
      if(input.disabled || input.type==='password' || input.type==='hidden' || input.type==='file' || ((input.type==='checkbox'||input.type==='radio')&&!input.checked))return;
      var key=input.name||input.id||input.className.split(' ')[0]||'field_'+i;
      data[key]=input.value;
    });
    if(pageKey==='user_tdk-add'&&form?.id==='entryForm'){data={};['type_name','phone','zhuti'].forEach(function(key){data[key]=(one('#'+key,form)?.value||'').trim();});tdkGroups.forEach(function(group){data[group]=tdkValues(group).join(group==='descs'?'@@':',');});}
    return data;
  }
  function validation(form) {
    var invalid=all('input,textarea,select',form||document).find(function(input){
      return !input.disabled && input.type!=='hidden' && input.offsetParent !== null && (input.required || /required/.test(input.dataset.rule||'')) && !input.value.trim();
    });
    if(invalid){invalid.focus();message('请填写'+(invalid.placeholder||'必填项'));return false;}
    if(pageKey==='user_tdk-add'&&form?.id==='entryForm'){var requiredGroup=['keywords','citys','companys'].find(function(group){return !tdkValues(group).length;});if(requiredGroup){one('#'+requiredGroup+'Container .field-input')?.focus();message('请至少填写一个'+({keywords:'关键词',citys:'城市',companys:'品牌名'}[requiredGroup]));return false;}}
    return true;
  }
  function aiMode() {
    if(/analyze/.test(pageKey))return 'detect';
    if(/tongji|zhishu|shoulu/.test(pageKey))return 'analyze';
    return 'generate';
  }
  async function callAI(button,mode,container) {
    if(button.disabled||!validation(container))return;
    var input=formData(container);if(!Object.values(input).some(function(v){return String(v).trim();})){message('请先填写内容');return;}
    if(!window.GeoAI){message('AI 服务配置尚未加载');return;}
    var previous=button.innerHTML;
    button.disabled=true;button.setAttribute('aria-busy','true');button.textContent='处理中…';
    var status=one('.geo-ai-status',container||button.parentElement);
    if(!status){status=document.createElement('div');status.className='geo-ai-status';status.setAttribute('role','status');button.insertAdjacentElement('afterend',status);}
    status.textContent='正在处理…';
    try {
      var result=await window.GeoAI.request(mode||aiMode(),{page:pageKey,fields:input});
      status.textContent=result.ok?'处理完成':result.error.message;
      if(result.ok){var output=one('textarea[data-ai-output],.ai-result,.result-content');if(output){if('value'in output)output.value=typeof result.data==='string'?result.data:JSON.stringify(result.data,null,2);else output.textContent=typeof result.data==='string'?result.data:JSON.stringify(result.data,null,2);}}
      else message(result.error.message);
    } catch(e){status.textContent='AI 服务暂时不可用，请重试';message(status.textContent);}
    finally{button.disabled=false;button.removeAttribute('aria-busy');button.innerHTML=previous;}
  }
  function rows(){return table&&table.tBodies[0]?all('tr:not(.no-records-found)',table.tBodies[0]):[];}
  function toggleCardView(){
    if(!table)return;var entering=table.dataset.cardView!=='true',headers=all('thead th',table);
    rows().forEach(function(row){if(entering){row._geoCells=Array.from(row.cells);var td=document.createElement('td');td.colSpan=headers.length;var cards=document.createElement('div');cards.className='card-views';row._geoCells.forEach(function(cell,index){var card=document.createElement('div');card.className='card-view';if(!one('input',headers[index])){var title=document.createElement('span');title.className='title';title.style.cssText=headers[index]?.style.cssText||'';title.textContent=headers[index]?.textContent||'';card.appendChild(title);}var value=document.createElement('span');value.className='value';while(cell.firstChild)value.appendChild(cell.firstChild);card.appendChild(value);cards.appendChild(card);});row.replaceChildren(td);td.appendChild(cards);}else if(row._geoCells){all('.card-view .value',row).forEach(function(value,index){while(value.firstChild)row._geoCells[index].appendChild(value.firstChild);});row.replaceChildren.apply(row,row._geoCells);delete row._geoCells;}});
    table.dataset.cardView=String(entering);if(table.tHead)table.tHead.style.display=entering?'none':'';all('.fixed-columns-right').forEach(function(panel){panel.style.display=entering?'none':'';});positionFrozenColumns();
  }
  function saveRows(){if(table)try{if(table.dataset.cardView==='true')toggleCardView();localStorage.setItem(stateKey,table.tBodies[0].innerHTML);}catch(e){message('本地存储不可用，修改仅在本页保留');}}
  function refreshRows(){
    if(!table)return;var list=rows();var visible=filtered?list.filter(function(row){return filtered(row);}):list;
    var max=Math.max(1,Math.ceil(visible.length/pageSize));page=Math.min(max,Math.max(1,page));
    list.forEach(function(row){row.style.display='none';});visible.slice((page-1)*pageSize,page*pageSize).forEach(function(row){row.style.display='';});
    var empty=one('tr.no-records-found',table);if(!empty){empty=document.createElement('tr');empty.className='no-records-found';empty.innerHTML='<td colspan="'+Math.max(1,table.tHead?.rows[0]?.cells.length||1)+'">没有找到匹配的记录</td>';table.tBodies[0].appendChild(empty);}empty.style.display=visible.length?'none':'';
    var info=one('.pagination-info');if(info)info.textContent='显示第 '+(visible.length?((page-1)*pageSize+1):0)+' 到第 '+Math.min(page*pageSize,visible.length)+' 条记录，总共 '+visible.length+' 条记录';
    var pagination=one('.fixed-table-pagination');if(pagination)pagination.style.display=visible.length?'':'none';
    all('li.page-number').forEach(function(li){li.classList.toggle('active',+li.textContent===page);});
  }
  function filterTable(form){
    if(!table)return;if(table.dataset.cardView==='true')toggleCardView();var criteria=all('input:not([type=hidden]),select',form).filter(function(el){return el.value.trim();});
    var headers=all('thead th',table).map(function(th){return th.dataset.field;});
    filtered=function(row){return criteria.every(function(el){var index=headers.indexOf(el.name),cell=row.cells[index];var value=el.tagName==='SELECT'?el.options[el.selectedIndex].text:el.value;return (cell||row).textContent.toLowerCase().includes(value.toLowerCase());});};page=1;refreshRows();
  }
  function selected(){return all('input[name=btSelectItem]:checked').map(function(i){return i.closest('tr');});}
  function selectionChanged(){var count=selected().length;all('.btn-del,.btn-more,.btn-multi').forEach(function(b){b.classList.toggle('disabled',!count);b.classList.toggle('btn-disabled',!count);});}
  function deleteRows(targets){
    if(!targets.length)return message('请先选择记录');
    function remove(){targets.forEach(function(r){r.remove();});saveRows();refreshRows();selectionChanged();message('已删除本地记录');}
    if(layer())layer().confirm('确定删除选中的本地记录？',{icon:3,title:'提示'},function(index){layer().close(index);remove();});else if(confirm('确定删除选中的本地记录？'))remove();
  }
  function applyLocalFields(values,row){
    if(!table)return;
    var headers=all('thead th',table);
    if(!row){row=document.createElement('tr');headers.forEach(function(th){var td=document.createElement('td');td.style.cssText='text-align:center;vertical-align:middle;';row.appendChild(td);});table.tBodies[0].prepend(row);}
    headers.forEach(function(th,i){
      var field=th.dataset.field;var key=Object.keys(values).find(function(k){return k===field||k==='row['+field+']';});
      if(i===0 && one('input[name=btSelectAll]',th)){row.cells[i].innerHTML='<input name="btSelectItem" type="checkbox">';}
      else if(key!==undefined)row.cells[i].textContent=values[key];
      else if(field==='addtime'||field==='created_at')row.cells[i].textContent=new Date().toLocaleString('zh-CN',{hour12:false});
      else if(field==='operate'&&!row.cells[i].textContent)row.cells[i].innerHTML='<a href="#" class="btn btn-xs btn-danger btn-delone" title="删除">删除</a>';
    });saveRows();refreshRows();
  }
  function exportRows(){
    if(!table)return;var lines=[all('thead th',table).map(function(th){return th.textContent.trim();})].concat(rows().filter(function(r){return r.style.display!=='none';}).map(function(r){return Array.from(r.cells).map(function(td){return td.textContent.trim();});}));
    var csv='\uFEFF'+lines.map(function(row){return row.map(function(value){return '"'+value.replace(/"/g,'""')+'"';}).join(',');}).join('\r\n');
    var url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));var a=document.createElement('a');a.href=url;a.download=pageKey+'.csv';a.click();setTimeout(function(){URL.revokeObjectURL(url);},1000);
  }
  function actionURL(control){return control.dataset.localUrl||control.dataset.url||control.getAttribute('href')||'';}
  function addURL(){
    var current=Object.keys(routes).find(function(path){return routeFor(path)?.split('?')[0].endsWith('/'+pageKey+'.html');});
    if(!current)return '';
    if(current.includes('/index/')){
      var candidate=current.replace('/index/','/add/');
      return routeFor(candidate)?candidate:current.split('/index/')[0]+'/add';
    }
    return current+'/add';
  }
  function localSubmit(form,button){
    if(!validation(form))return;
    var values=formData(form);
    if(/(?:ai_image|analyze|zhengliu|tuozhan|shoulu|zhishu|weixin_baowen|piliang_baowen|ai_task)(?:-|$)/.test(pageKey)){callAI(button,aiMode(),form);return;}
    if(parent!==window && new URLSearchParams(location.search).has('localDialog')){
      parent.postMessage({type:'geo-local-save',values:values},location.origin);return;
    }
    try{sessionStorage.setItem('geo-local-form:'+pageKey,JSON.stringify(values));}catch(e){}
    message(pageKey==='general-profile'?'本地资料已保存，密码未保存':'已保存本地演示数据');
  }
  document.addEventListener('submit',function(event){event.preventDefault();var form=event.target;if(form.matches('.form-commonsearch'))filterTable(form);else if(form.matches('.sidebar-form')){var query=one('input',form).value.trim();all('.sidebar-menu li').forEach(function(li){li.style.display=li.textContent.includes(query)?'':'none';});}else localSubmit(form,event.submitter||one('[type=submit]',form)||form);});
  document.addEventListener('reset',function(event){if(event.target.matches('.form-commonsearch'))setTimeout(function(){filtered=null;page=1;refreshRows();},0);if(pageKey==='user_tdk-add'&&event.target.id==='entryForm'){event.preventDefault();tdkGroups.forEach(function(group){var container=one('#'+group+'Container');if(!container)return;all('.field-row',container).slice(1).forEach(function(row){row.remove();});all('.field-input',container).forEach(function(input){input.value='';});tdkSync(group);});['type_name','phone','zhuti'].forEach(function(id){var input=one('#'+id);if(input)input.value='';});message('已重置所有字段');}});
  // The custom TDK entry form uses the captured inline row editor, not Form.events.validator.
  var tdkGroups=['keywords','citys','companys','descs'];
  var tdkAddButtons={addKeywordBtn:'keywords',addCityBtn:'citys',addCompanyBtn:'companys',addDescBtn:'descs'};
  function tdkValues(group){return all('#'+group+'Container .field-input').map(function(input){return input.value.trim();}).filter(Boolean);}
  function tdkSync(group){var container=one('#'+group+'Container');if(!container)return;var rows=all('.field-row',container);all('.btn-remove',container).forEach(function(button){button.disabled=rows.length<=1;});one('#'+group+'EmptyTip')?.classList.toggle('show',!tdkValues(group).length);}
  function tdkAdd(group){var container=one('#'+group+'Container'),first=container&&one('.field-row',container);if(!first)return;var row=first.cloneNode(true),input=one('.field-input',row);input.value='';input.defaultValue='';container.appendChild(row);tdkSync(group);input.focus();}
  document.addEventListener('keydown',function(event){if(pageKey!=='user_tdk-add'||!event.target.matches('#entryForm .field-input')||event.key!=='Enter')return;event.preventDefault();tdkAdd(event.target.closest('.field-row').dataset.group);});
  document.addEventListener('change',function(event){
    var el=event.target;
    if(el.id==='agreeCheckbox'&&one('#submitBtn'))one('#submitBtn').disabled=!el.checked;
    if(el.name==='row[type]'&&one('#docContent')){all('.subdivision').forEach(function(x){x.style.display=el.value==='1'?'':'none';});all('.summary').forEach(function(x){x.style.display=el.value==='1'?'none':'';});}
    if(el.name==='btSelectAll'){all('input[name=btSelectItem]').forEach(function(i){if(i.closest('tr').style.display!=='none')i.checked=el.checked;});selectionChanged();}
    if(el.name==='btSelectItem')selectionChanged();
    if(el.matches('.keep-open input[data-field]')&&table){var index=all('thead th',table).findIndex(function(th){return th.dataset.field===el.dataset.field;});all('tr',table).forEach(function(tr){if(tr.cells[index])tr.cells[index].style.display=el.checked?'':'none';});}
    if(el.dataset.layout)body.classList.toggle(el.dataset.layout,el.checked);
    if(el.dataset.menu)all('.treeview-menu').forEach(function(ul){ul.style.display=el.checked?'block':'';});
    if(el.type==='file')message(el.files.length?'已选择 '+el.files.length+' 个本地文件，尚未上传':'未选择文件');
  });
  document.addEventListener('click',function(event){
    var el=event.target.closest('a,button,[data-url],[data-local-url],[data-original-click],.item-ai-dis,.filter_search_list li,.sortable,[data-tab],.edui-button,.strat_zhengliu,.submit_btn,.shoudong_zhengliu');
    if(!el)return;
    if(el.matches('button')&&!actionURL(el)&&el.closest('.btn-dialog'))el=el.closest('.btn-dialog');
    if(el.matches('.disabled,[disabled]')){event.preventDefault();return;}
    var url=actionURL(el), text=el.textContent.trim(), handler=el.dataset.originalClick||'';
    if(pageKey==='user_tdk-add'&&el.closest('#entryForm')){if(tdkAddButtons[el.id]){event.preventDefault();tdkAdd(tdkAddButtons[el.id]);return;}if(el.matches('.btn-remove')){event.preventDefault();var tdkRow=el.closest('.field-row'),tdkGroup=tdkRow?.dataset.group;if(tdkGroup&&all('#'+tdkGroup+'Container .field-row').length>1){tdkRow.remove();tdkSync(tdkGroup);}return;}}
    if(el.matches('.strat_zhengliu,.submit_btn')){event.preventDefault();var keywordInput=one(el.matches('.strat_zhengliu')?'#c-keyword':'#keyword');if(!keywordInput?.value.trim()){message(el.matches('.strat_zhengliu')?'请输入主关键词':'请输入关键词');return;}callAI(el,'generate',el.closest('form'));return;}
    if(el.matches('.shoudong_zhengliu')){event.preventDefault();manualKeywords();return;}
    if(el.id==='openDocBtn'){event.preventDefault();one('#modalOverlay').style.display='flex';one('#docContent').scrollTop=0;return;}
    if(el.id==='closeModalBtn'||(el.id==='submitBtn'&&pageKey.startsWith('user_huaxiang'))){event.preventDefault();one('#modalOverlay').style.display='none';return;}
    if(el.id==='saveBtn'&&pageKey.startsWith('user_huaxiang')){event.preventDefault();if(!one('#agreeCheckbox').checked){message('请先阅读必读承诺协议');return;}localSubmit(el.closest('form'),el);return;}
    if(el.matches('.edui-button')){if(editors.length)return;var command=(el.className.match(/edui-for-([\w]+)/)||[])[1];var commands={bold:'bold',italic:'italic',underline:'underline',strikethrough:'strikeThrough',justifyleft:'justifyLeft',justifycenter:'justifyCenter',justifyright:'justifyRight',insertorderedlist:'insertOrderedList',insertunorderedlist:'insertUnorderedList',undo:'undo',redo:'redo',removeformat:'removeFormat',selectall:'selectAll'};var editor=one('.edui-editor iframe');if(editor&&commands[command]){event.preventDefault();editor.contentWindow.focus();editor.contentDocument.execCommand(commands[command],false,null);}return;}
    if(el.closest('.bootstrap-select')&&el.matches('.dropdown-menu a')){
      if(window.jQuery&&window.jQuery(one('select',el.closest('.bootstrap-select'))).data('selectpicker'))return;
      event.preventDefault();var selectWrapper=el.closest('.bootstrap-select'),select=one('select',selectWrapper);
      if(select){var option=Array.from(select.options).find(function(o){return o.text.trim()===text.trim();});if(option){if(!select.multiple)Array.from(select.options).forEach(function(o){o.selected=false;});option.selected=select.multiple?!option.selected:true;updateSelect(select);select.dispatchEvent(new Event('change',{bubbles:true}));if(!select.multiple)selectWrapper.classList.remove('open');}}return;
    }
    if(el.matches('.bs-select-all,.bs-deselect-all')){var multi=one('select',el.closest('.bootstrap-select'));if(window.jQuery&&window.jQuery(multi).data('selectpicker'))return;event.preventDefault();if(multi){Array.from(multi.options).forEach(function(o){o.selected=el.matches('.bs-select-all');});updateSelect(multi);}return;}
    if(el.id==='submitBtn'&&pageKey==='company_keyword-add'){event.preventDefault();localSubmit(el.closest('form'),el);return;}
    if(el.closest('.treeview')&&el.parentElement.classList.contains('treeview')&&/^(?:javascript:|#)/.test(url)){
      if(window.jQuery&&window.jQuery.AdminLTE)return;
      event.preventDefault();var submenu=one('.treeview-menu',el.parentElement);if(submenu){var open=getComputedStyle(submenu).display!=='none';submenu.style.display=open?'none':'block';el.parentElement.classList.toggle('active',!open);}return;
    }
    if(el.matches('.sidebar-toggle,[data-toggle=offcanvas]')){if(window.jQuery&&window.jQuery.AdminLTE)return;event.preventDefault();body.classList.toggle(innerWidth<768?'sidebar-open':'sidebar-collapse');return;}
    if(el.dataset.toggle==='dropdown') {event.preventDefault();event.stopPropagation();if(window.jQuery&&window.jQuery.fn.dropdown)window.jQuery(el).dropdown('toggle');else el.parentElement.classList.toggle('open');return;}
    if(el.dataset.toggle==='tab'&&url.startsWith('#')){
      if(window.jQuery&&window.jQuery.fn.tab){event.preventDefault();window.jQuery(el).tab('show');return;}
      event.preventDefault();var target=document.getElementById(url.slice(1));if(target){all('.tab-pane',target.parentElement).forEach(function(p){p.classList.remove('active','in');});target.classList.add('active','in');all('li',el.closest('ul')).forEach(function(li){li.classList.remove('active');});el.parentElement.classList.add('active');}return;
    }
    if(el.matches('.btn-add')){event.preventDefault();modal(addURL(),el);return;}
    if(el.matches('.btn-dialog,.btn-editone,.btn-edit')){event.preventDefault();modal(url,el);return;}
    if(el.matches('.btn-del,.btn-delone')){event.preventDefault();deleteRows(el.matches('.btn-delone')?[el.closest('tr')]:selected());return;}
    if(el.matches('.btn-refresh')){event.preventDefault();filtered=null;page=1;refreshRows();message('已刷新本地数据');return;}
    if(el.matches('[name=commonSearch]')){event.preventDefault();var search=one('.commonsearch-table');if(search)search.classList.toggle('hidden');return;}
    if(el.matches('[name=toggle]')){event.preventDefault();toggleCardView();return;}
    if(el.closest('.export')&&el.matches('a')){event.preventDefault();exportRows();return;}
    if(el.matches('.sortable')&&table){var th=el.closest('th'),index=Array.from(th.parentElement.cells).indexOf(th),desc=el.dataset.direction!=='desc';el.dataset.direction=desc?'desc':'asc';rows().sort(function(a,b){return a.cells[index].textContent.localeCompare(b.cells[index].textContent,'zh-CN',{numeric:true})*(desc?-1:1);}).forEach(function(row){table.tBodies[0].appendChild(row);});refreshRows();return;}
    if(el.closest('.pagination')&&table){event.preventDefault();if(el.closest('.page-next'))page++;else if(el.closest('.page-pre'))page--;else if(el.closest('.jumpto'))page=+one('input',el.closest('.jumpto')).value||1;else if(/^\d+$/.test(text))page=+text;refreshRows();return;}
    if(el.matches('.searchit')){event.preventDefault();var field=all('.form-commonsearch [name]').find(function(x){return x.name===el.dataset.field;});if(field){field.value=el.dataset.value;filterTable(field.form);}return;}
    if(el.matches('.btn-change')){event.preventDefault();var icon=one('i',el);if(icon){icon.classList.toggle('fa-toggle-on');icon.classList.toggle('fa-toggle-off');icon.classList.toggle('text-success');}saveRows();return;}
    if(el.matches('.btn-multi')){event.preventDefault();selected().forEach(function(row){row.dataset.status=el.dataset.params;});saveRows();message('已更新本地选中记录');return;}
    if(el.matches('.query-button,.pingpai_jiexi')){event.preventDefault();callAI(el,el.matches('.pingpai_jiexi')?'analyze':'detect');return;}
    if(el.matches('.item-ai-dis')){event.preventDefault();el.classList.toggle('select-border-bar');el.setAttribute('aria-pressed',String(el.classList.contains('select-border-bar')));return;}
    if(el.matches('.filter_search_list li')){event.preventDefault();all('li',el.parentElement).forEach(function(li){li.classList.remove('active','selected');});el.classList.add('active','selected');return;}
    if(el.matches('.search_btn,.close_btn')){event.preventDefault();if(el.matches('.close_btn'))all('.filter_search input').forEach(function(i){i.value='';});var query=all('input:not([type=hidden])').map(function(i){return i.value.trim();}).filter(Boolean).join(' ').toLowerCase();all('tr',one('.media-list')||one('table')||document).filter(function(r){return !r.closest('thead');}).forEach(function(row){row.style.display=!query||row.textContent.toLowerCase().includes(query)?'':'none';});return;}
    if(/media_collection|cancel_collection/.test(handler)){event.preventDefault();el.classList.toggle('geo-favorite');el.setAttribute('aria-pressed',String(el.classList.contains('geo-favorite')));message(el.classList.contains('geo-favorite')?'已加入本地收藏':'已取消本地收藏');return;}
    if(/^\/user\//.test(url)){event.preventDefault();navigate(url);return;}
    if(/history\.back/.test(url)||text==='返回上一级'){event.preventDefault();history.back();return;}
    if(/生成|开始创作|立即创作|立即分析|一键检测|开始查询|开始拓词/.test(text)&&el.matches('button,.btn')){event.preventDefault();callAI(el,aiMode(),el.closest('form'));return;}
    if(el.matches('button[type=reset]'))return;
    if(el.matches('a')&&(/^javascript:/i.test(url)||url==='#'))event.preventDefault();
  });
  document.addEventListener('click',function(event){if(!event.target.closest('.dropdown,.btn-group'))all('.open').filter(function(el){return el.matches('.dropdown,.btn-group');}).forEach(function(el){el.classList.remove('open');});});
  window.addEventListener('message',function(event){
    if(event.origin!==location.origin||!activeModal||!event.data||event.data.type!=='geo-local-save')return;
    var frame=activeModal.dialog?one('iframe',activeModal.dialog):one('#layui-layer'+activeModal.index+' iframe');if(!frame||event.source!==frame.contentWindow)return;
    applyLocalFields(event.data.values,activeModal.row);closeModal();message('已保存本地演示记录');
  });
  window.addEventListener('hashchange',function(){if(shell)navigate(decodeURIComponent(location.hash.slice(1))||'/user/dashboard');});
  window.addEventListener('resize',function(){
    if(!activeModal||!layer())return;var layouts=modalLayouts[pageKey]?.[innerWidth<600?'390':'1440'];
    var selector=layoutSelector(layouts,activeModal.control);if(!selector)return;
    var layout=layouts[selector],panel=one('#layui-layer'+activeModal.index);if(!panel)return;
    // Layer.style parses percentage dimensions as integers; preserve their CSS units.
    Object.assign(panel.style,{width:layout.width,height:layout.height,top:layout.top,left:layout.left});
    var frame=one('iframe',panel);if(frame)frame.style.height=Math.max(0,panel.clientHeight-(one('.layui-layer-title',panel)?.offsetHeight||0)-(one('.layui-layer-footer',panel)?.offsetHeight||0))+'px';
  });
  function updateSelect(select){var wrapper=select.closest('.bootstrap-select');if(!wrapper)return;var selected=Array.from(select.selectedOptions).map(function(o){return o.text;});var label=one('.filter-option-inner-inner',wrapper)||one('.filter-option',wrapper);if(label)label.textContent=selected.join(', ')||'没有选中任何项';all('.dropdown-menu li',wrapper).forEach(function(li){var a=one('a',li);if(a)li.classList.toggle('selected',selected.includes(a.textContent.trim()));});}
  document.addEventListener('input',function(event){
    var el=event.target;if(el.closest('.bs-searchbox')){var wrapper=el.closest('.bootstrap-select');all('.dropdown-menu li',wrapper).forEach(function(li){li.style.display=li.textContent.toLowerCase().includes(el.value.toLowerCase())?'':'none';});}
    if(pageKey==='user_tdk-add'&&el.matches('#entryForm .field-input'))tdkSync(el.closest('.field-row').dataset.group);
    if(el.form)all('[type=submit].disabled',el.form).forEach(function(button){button.classList.remove('disabled');});
  });
  document.addEventListener('change',function(event){if(event.target.form)all('[type=submit].disabled',event.target.form).forEach(function(button){button.classList.remove('disabled');});});
  function positionFrozenColumns(){all('.fixed-columns-right .fixed-table-body,.fixed-columns-right .fixed-table-header').forEach(function(panel){panel.scrollLeft=panel.scrollWidth;});}
  window.addEventListener('load',positionFrozenColumns);window.addEventListener('resize',positionFrozenColumns);setTimeout(positionFrozenColumns,100);setTimeout(positionFrozenColumns,700);
  var agreementDocument=one('#docContent');if(agreementDocument)agreementDocument.addEventListener('scroll',function(){if(this.scrollTop+this.clientHeight+1>=this.scrollHeight){one('#agreeCheckbox').disabled=false;one('#agreeSection').classList.add('enabled');}});
  if(window.UE){all('.edui-editor').forEach(function(old,index){
    var input=one('textarea',old.closest('.form-group')||old.parentElement);if(!input)return;
    var holder=one('.edui-editor-iframeholder',old),height=holder?parseInt(holder.style.height,10)||800:800;
    var mount=document.createElement('script');mount.type='text/plain';mount.id='geo-editor-'+index;old.replaceWith(mount);
    var editor=window.UE.getEditor(mount.id,{serverUrl:'',imageUrl:'',initialFrameWidth:'100%',initialFrameHeight:height,autoHeightEnabled:false,initialContent:input.value,elementPathEnabled:true,wordCount:true});
    editors.push({editor:editor,input:input});
    editor.ready(function(){editor.addListener('contentChange',function(){input.value=editor.getContent();});});
  });} else all('.edui-editor iframe').forEach(function(frame){function enable(){try{frame.contentDocument.body.contentEditable='true';frame.contentDocument.body.style.cssText='font:16px/1.6 sans-serif;padding:8px;';}catch(e){}}frame.addEventListener('load',enable);enable();});
  if(window.jQuery&&window.jQuery.fn.selectpicker){all('select.selectpicker').forEach(function(select){var $select=window.jQuery(select);if($select.data('selectpicker'))$select.selectpicker('destroy');var wrapper=select.closest('.bootstrap-select');if(wrapper){wrapper.parentNode.insertBefore(select,wrapper);wrapper.remove();}$select.addClass('selectpicker').selectpicker();});}
  if(window.jQuery&&window.jQuery.fn.daterangepicker){window.jQuery('.datetimerange').daterangepicker({autoUpdateInput:false,locale:{format:'YYYY-MM-DD HH:mm:ss',applyLabel:'确定',cancelLabel:'清空',fromLabel:'开始',toLabel:'结束',customRangeLabel:'自定义',daysOfWeek:['日','一','二','三','四','五','六'],monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],firstDay:1}}).on('apply.daterangepicker',function(event,picker){this.value=picker.startDate.format('YYYY-MM-DD HH:mm:ss')+' - '+picker.endDate.format('YYYY-MM-DD HH:mm:ss');}).on('cancel.daterangepicker',function(){this.value='';});}
  all('input[data-rule],textarea[data-rule],select[data-rule]').forEach(function(input){if(/required/.test(input.dataset.rule))input.required=true;});
  // Match the stable Form.events.validator initialization in the captured require-form.js.
  all('form[data-toggle="validator"]').forEach(function(form){
    form.classList.add('nice-validator','n-default','n-bootstrap');
    all('.layer-footer [type="submit"],.fixed-footer [type="submit"],.normal-footer [type="submit"]',form).forEach(function(button){button.classList.remove('disabled');});
  });
  if(table){try{var saved=localStorage.getItem(stateKey);if(saved){table.tBodies[0].innerHTML=saved;refreshRows();}}catch(e){}}
  fetch('/backend-routes.json').then(function(response){if(!response.ok)throw new Error('route map');return response.json();}).then(function(result){
    routes=result.routes||result;
    if(Array.isArray(routes))routes=Object.fromEntries(routes.map(function(r){return [r.path,r.file||'/backend-pages/'+r.key+'.html'];}));
    if(shell){navigate(decodeURIComponent(location.hash.slice(1))||'/user/dashboard');}
    else if(parent===window && new URLSearchParams(location.search).has('ref')){location.replace('/user/index/index/#'+encodeURIComponent(location.pathname.replace(/\/$/,'')));}
  }).catch(function(){message('本地页面目录加载失败，请重新构建');});
  fetch('/backend-interactions.json').then(function(response){return response.ok?response.json():{};}).then(function(value){modalLayouts=value;}).catch(function(){});
}());
