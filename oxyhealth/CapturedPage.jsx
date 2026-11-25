import React,{useEffect,useRef} from 'react';
import './captured-source.css';

// Captured markup is sanitized at generation time. No original scripts are run.
// Shared shell interactions and preview-only forms remain owned by this app.
export default function CapturedPage({html,template,className='',onReady}) {
 const ref=useRef(null);
 useEffect(()=>{
  const main=ref.current;
  main.querySelectorAll('button[aria-expanded]:not([aria-controls])').forEach((button,index)=>{
   const answer=button.closest('h3')?.nextElementSibling||button.nextElementSibling;
   if(answer?.getAttribute('role')!=='region')return;
   if(!answer.id)answer.id='captured-answer-'+index;
   button.setAttribute('aria-controls',answer.id);
  });
  main.querySelectorAll('button[aria-controls]').forEach(button=>{
   const answer=main.querySelector('[id="'+button.getAttribute('aria-controls')+'"]');
   if(!answer)return;
   if(!button.id)button.id=answer.getAttribute('aria-labelledby')||answer.id+'-question';
   answer.setAttribute('aria-labelledby',button.id);
  });
  main.querySelectorAll('button:not([aria-controls])').forEach(button=>{
   if(main.querySelector('dialog')&&button.getAttribute('aria-haspopup')==='dialog')button.setAttribute('data-captured-dialog','');
   else if(!button.closest('form')&&/quote|pricing|specialist|get started|contact|learn more|explore your options|submit an inquiry/i.test(button.textContent))button.setAttribute('data-quote','');
  });
  const click=event=>{
   const dialog=main.querySelector('dialog');
   if(event.target.closest('[data-captured-dialog]')){event.preventDefault();dialog?.showModal();return;}
   if(event.target.closest('button[aria-label="Close form"]')){dialog?.close();return;}
   if(dialog&&event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();return;}
   const reload=event.target.closest('button[aria-label="Reload captcha image"]');
   if(reload){const input=reload.closest('form')?.querySelector('input[name="enterdigest"]');if(input){input.value='';input.focus();}return;}
   const button=event.target.closest('button[aria-controls]');
   if(!button||!main.contains(button))return;
   const answer=main.querySelector('[id="'+button.getAttribute('aria-controls')+'"]');
   if(!answer)return;
   const open=button.getAttribute('aria-expanded')!=='true';
   button.setAttribute('aria-expanded',String(open));
   if(answer.hasAttribute('aria-hidden'))answer.setAttribute('aria-hidden',String(!open));
   answer.style.maxHeight=open?answer.scrollHeight+'px':'0px';
   answer.style.opacity=open?'1':'0';
   button.querySelector('svg')?.style.setProperty('transform',open?'rotate(180deg)':'none');
  };
  const submit=event=>{
   event.preventDefault();
   const form=event.target;
   if(!form.checkValidity())return form.reportValidity();
   let status=form.querySelector('[data-preview-status]');
   if(!status){status=document.createElement('p');status.setAttribute('role','status');status.dataset.previewStatus='';status.style.cssText='margin-top:16px;font-size:14px;line-height:1.5';form.append(status);}
   status.textContent='Preview only — your information has not been sent. Call our team to continue.';
  };
  main.addEventListener('click',click);
  main.addEventListener('submit',submit);
  const cleanup=onReady?.(main);
  return()=>{main.removeEventListener('click',click);main.removeEventListener('submit',submit);cleanup?.();};
 },[html,onReady]);
 return <main ref={ref} className={'captured-source '+className} data-template={template} data-source-verification="live-sampled" dangerouslySetInnerHTML={{__html:html}}/>;
}
