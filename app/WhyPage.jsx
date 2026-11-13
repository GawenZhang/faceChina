import React from 'react';
import CapturedPage from './CapturedPage.jsx';
import sourceHtml from './why-source.html?raw';
import './why-page.css';

// Page-local scroll behavior, based on the authorized 2026-11-13 live capture.
function setupStory(main){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=n=>Math.max(0,Math.min(1,n));
 const journey=main.querySelector('[aria-labelledby="journey-heading"]');
 const chapters=[...journey.querySelectorAll('ol>li')];
 const photos=[...journey.querySelectorAll('.sticky>div>div.absolute')];
 const photoLabel=journey.querySelector('.sticky .tabular-nums');
 const progress=journey.querySelector('ol>span.origin-top');
 const dossier=main.querySelector('.why-dossier');
 const cards=[...dossier.querySelectorAll('[data-credential]')];
 const hero=main.querySelector('section');
 const heroNumber=hero.firstElementChild;
 const count=main.querySelector('[aria-labelledby="count-heading"]');
 const counter=main.querySelector('#count-heading>span');
 const meter=dossier.querySelector('.why-credential-meter');
 let pending=0;
 function update(){
  pending=0;
  const list=chapters[0].parentElement;
  const journeyProgress=clamp((innerHeight*.6-list.getBoundingClientRect().top)/list.offsetHeight);
  const active=Math.min(4,Math.floor(journeyProgress*5));
  chapters.forEach((el,i)=>{
   el.dataset.active=String(i===active);
   const lit=reduced.matches||i<=active;
   el.querySelector('h3').style.color=lit?'#fff':'rgba(255,255,255,.45)';
   el.querySelector('p').style.color=lit?'#c8a165':'rgba(255,255,255,.4)';
   const dot=el.querySelector('span');dot.style.background=lit?'#c8a165':'#000';dot.style.borderColor=lit?'#c8a165':'rgba(255,255,255,.3)';
  });
  photos.forEach((el,i)=>{el.style.opacity=i===(reduced.matches?0:active)?'1':'0';el.style.transform=`scale(${!reduced.matches&&i===active?1:1.05})`;});
  if(photoLabel)photoLabel.textContent=`0${active+1} / 05`;
  if(progress)progress.style.transform=`scaleY(${reduced.matches?1:journeyProgress})`;
  const heroProgress=reduced.matches?0:clamp(-hero.getBoundingClientRect().top/hero.offsetHeight);
  heroNumber.style.opacity=String(1-clamp(heroProgress/.7));heroNumber.style.transform=`translateY(${-heroProgress*35}%)`;
  const countProgress=clamp((innerHeight*.95-count.getBoundingClientRect().top)/(count.offsetHeight*.5+innerHeight*.4));
  const amount=Math.round(countProgress*19000);
  counter.textContent=Math.round(amount/100)*100>=19000?'19,000+':amount.toLocaleString('en-US');
  const stageProgress=clamp(-dossier.getBoundingClientRect().top/Math.max(1,dossier.offsetHeight-innerHeight));
  const credential=Math.min(5,Math.floor(stageProgress*6));
  meter.querySelectorAll('i').forEach((el,i)=>el.dataset.active=String(i<=credential));meter.querySelector('span').textContent=`${credential+1} of 6`;
  if(innerWidth>=1024&&!reduced.matches){
   cards.forEach((card,i)=>{
    const start=i/6,enter=clamp((stageProgress-start)/(.5/6));
    const scale=i===5?1:1-clamp((stageProgress-(i+1)/6)/(1-(i+1)/6))*.03*(5-i);
    card.style.transform=`translateY(${i===0?0:(1-enter)*110}vh) rotate(${[-2.2,1.6,-1.1,2.4,-1.8,1][i]}deg) scale(${scale})`;
    card.style.zIndex=String(i+1);card.style.pointerEvents=i===credential?'auto':'none';
    const seal=card.lastElementChild;seal.style.opacity=String(clamp((stageProgress-start-.5/6)/(.1/6)));seal.style.transform=`scale(${1.8-.8*clamp((stageProgress-start-.5/6)/(.18/6))})`;
   });
  }else cards.forEach((card,i)=>{card.style.transform=`rotate(${[-.88,.64,-.44,.96,-.72,.4][i]}deg)`;card.style.removeProperty('z-index');card.style.removeProperty('pointer-events');card.lastElementChild.style.removeProperty('opacity');card.lastElementChild.style.removeProperty('transform');});
 }
 const schedule=()=>{if(!pending)pending=requestAnimationFrame(update);};
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);reduced.addEventListener('change',schedule);update();
 return()=>{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule);cancelAnimationFrame(pending);};
}

export default function WhyPage(){return <CapturedPage html={sourceHtml} template="why-oxyhealth" className="why-source" onReady={setupStory}/>;}
