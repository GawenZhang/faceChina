import React,{useState} from 'react';
import schemas from './landing-evidence.json';
import {chamberModels,landingPages} from './extended-data.mjs';
import './source-landing.css';
import CapturedPage from './CapturedPage.jsx';
import livePages from './landing-live-data.json';

// Only content hierarchy/counts are source-observed. See evidence-extended-current/audit.json
// for the unavailable original browser capture and unverified visual geometry.
const placeholder='Explore the details of the chamber and the setting where it will be used. Gather the relevant information, compare the available options, and note the questions you would like to discuss with the team. The model documentation and your own requirements provide a useful starting point for that conversation.';
function copy(length=45){const list=placeholder.split(' ');return Array.from({length:Math.max(12,Math.min(length,150))},(_,i)=>list[i%list.length]).join(' ').replace(/[.,;:]?$/,'.');}
function Paragraphs({counts=[45]}){return counts.map((count,i)=><p key={i}>{copy(count)}</p>);}
function Actions({primary='Get Started'}){return <div className="ex-actions"><button className="ex-button" data-quote>{primary}</button><a className="ex-button ex-button-outline" href="tel:5629068888">Call 562-906-8888</a></div>;}
function SourceForm({practice=false}){const[submitted,setSubmitted]=useState(false);return <form className="sl-form" onSubmit={e=>{e.preventDefault();setSubmitted(true);}}><div className="sl-form-grid">{['First Name','Last Name','Email','Phone',...(practice?['Practice Name','Your Role']:[])].map(label=><label key={label}>{label} *<input required type={label==='Email'?'email':label==='Phone'?'tel':'text'} name={label.toLowerCase().replaceAll(' ','-')} autoComplete={label==='Email'?'email':label==='Phone'?'tel':undefined}/></label>)}</div>{practice&&<label>About your practice<textarea rows="4" placeholder="Tell us about your space and chamber requirements"/></label>}<label>Security Verification *<span className="sl-captcha" aria-label="Preview verification code">PREVIEW</span><input required pattern="PREVIEW" placeholder="Enter PREVIEW"/></label><button className="ex-button" type="submit">{practice?'Talk to a Product Specialist':'Get Pricing and Financing Options'}</button>{submitted&&<p role="status">Preview only — your information has not been sent. Call our team to continue.</p>}<p className="ex-note">Prefer to talk now? <a href="tel:5629068888">Call 562-906-8888</a></p></form>;}
function modelForText(text){return [...chamberModels].sort((a,b)=>b.name.length-a.name.length).find(m=>text.includes(m.name));}
// Preserve the observed one-to-five-word feature lines without expanding them into prose.
function modelFeatureCopy(length){return ({1:'Documentation',2:'Model information',3:'Review product specifications',4:'Explore chamber setup details',5:'Discuss your equipment setup requirements'})[length]||copy(length);}
function ModelGroup({groups}){
 return <div className="sl-models">{groups.map((g,i)=>{
  const model=modelForText(g.title);
  return <article key={i}>
   {model&&<p className="ex-eyebrow">{model.type} · {model.pressure}</p>}
   <h3>{g.title}</h3><Paragraphs counts={g.paragraphs.length?g.paragraphs:[65]}/>
   {g.bullets?.length>0&&<ul className="sl-model-features">{g.bullets.map((length,index)=><li key={index}>{modelFeatureCopy(length)}</li>)}</ul>}
   {model&&<div className="ex-actions"><a href={'/products/'+model.slug}>Explore {model.name} →</a><button data-quote>Request Pricing</button></div>}
  </article>;
 })}</div>;
}
function SourceTable({rows}){const filtered=rows.filter(r=>!r.every(c=>/^[-:\s]*$/.test(c)));return <div className="ex-table-scroll" tabIndex="0" role="region" aria-label="Comparison table"><table><thead><tr>{filtered[0]?.map((x,i)=><th key={i}>{x}</th>)}</tr></thead><tbody>{filtered.slice(1).map((row,i)=><tr key={i}>{row.map((x,j)=><td key={j}>{Boolean(modelForText(x))?<a href={'/products/'+modelForText(x).slug}>{x}</a>:x}</td>)}</tr>)}</tbody></table></div>;}
function Group({group,index}){return <article><h3>{group.title}</h3><Paragraphs counts={group.paragraphs.length?group.paragraphs:[38]}/>{group.bullets.length>0&&<ul>{group.bullets.map((n,i)=><li key={i}>{copy(Math.min(n,22))}</li>)}</ul>}</article>;}
function SourceSection({section,index,compact,path}){
 const s=section;const title=s.title;
 const modelGroups=s.groups.filter(g=>chamberModels.some(m=>g.title.includes(m.name)));
 const faq=/FAQ|Questions practitioners ask|Cost Questions/.test(title);
 const related=/Explore (More|Related|Hyperbaric|Chamber Resources)|Related (Pages|Resources)/.test(title);
 const stats=/Statistics|by the Numbers|Physicians and Families Choose|Thousands Choose/.test(title);
 const cta=/^(Ready|Find Your Portable|Choose an FDA|Start Your Longevity|Have Questions|Request rental|Ask about refurbished|Talk with a hyperbaric|Have your room|Not sure\?)/.test(title);
 const pricing=path==='/hyperbaric-chamber-cost'&&index===0;
 const practiceForm=path==='/hbot-for-your-practice'&&title==='Talk to a product specialist';
 return <section id={pricing?'pricing':undefined} className={'ex-section sl-section '+(compact?'':index%2?'ex-soft':'')+(cta?' ex-cta':'')} data-source-section={index}><div className="ex-wrap"><h2>{title}</h2><div className="sl-section-intro"><Paragraphs counts={s.paragraphs}/></div>
 {pricing||practiceForm?<SourceForm practice={practiceForm}/>:faq?<div className="ex-faq">{s.groups.filter(g=>g.title!=='Related guides').map((g,i)=><details key={i}><summary>{g.title}<span aria-hidden="true">+</span></summary><div className="sl-answer"><Paragraphs counts={g.paragraphs.length?g.paragraphs:[45]}/></div></details>)}</div>:related?<nav className="sl-related" aria-label="Related resources">{landingPages.filter(p=>p.path!==path).slice(0,6).map(p=><a href={p.path} key={p.path}>{p.title} →</a>)}</nav>:stats?<div className="ex-proof-grid">{(s.groups.length?s.groups:Array.from({length:4},(_,i)=>({title:['Research overview','Clinical context','Published findings','Further reading'][i],paragraphs:[]}))).map((g,i)=><article key={i}><span aria-hidden="true">—</span><h3>{g.title}</h3><Paragraphs counts={g.paragraphs}/></article>)}</div>:<>
 {s.table.length>0&&<SourceTable rows={s.table}/>}
 {modelGroups.length===s.groups.length&&modelGroups.length>0?<ModelGroup groups={modelGroups}/>:<div className={compact?'sl-reading-groups':s.groups.length===2?'ex-split':s.groups.length>=3?'sl-card-grid':'sl-reading-groups'}>{s.groups.filter(()=>!(path==='/hbot-for-your-practice'&&title.includes('right chamber'))).map((g,i)=><Group key={i} group={g} index={i}/>)}</div>}
 {s.bullets.length>0&&<ul className="sl-list">{title==='OxyHealth chamber models'?chamberModels.map(m=><li key={m.slug}><a href={'/products/'+m.slug}>{m.name}</a> — {m.type} chamber</li>):s.bullets.map((n,i)=><li key={i}>{copy(Math.min(n,32))}</li>)}</ul>}
 </>}
 {cta&&<Actions primary="Contact Our Team"/>}
 {/Financing/.test(title)&&!pricing&&<a className="ex-button" href="/finance">Explore Financing →</a>}
 {path==='/hbot-for-your-practice'&&title.includes('right chamber')&&<><h3>Clinical chamber configurations</h3><ModelGroup groups={chamberModels.slice(3).map(m=>({title:m.name,paragraphs:[48]}))}/><h3>Portable chamber configurations</h3><ModelGroup groups={chamberModels.slice(0,3).map(m=>({title:m.name,paragraphs:[48]}))}/></>}
 </div></section>;
}
export function hasSourceLanding(path){return Boolean(livePages[path]||schemas[path]);}
export default function SourceLanding({page}){if(livePages[page.path])return <CapturedPage html={livePages[page.path].html} className={livePages[page.path].className} template="landing"/>;const source=schemas[page.path],practice=page.path==='/hbot-for-your-practice';return <main className={'ex-page sl-page '+(source.compact?'sl-compact ':'')+(practice?'sl-practice':'')} data-template="landing" data-source-verification="structure-only"><section className={'ex-hero '+(source.compact?'ex-hero-light':'')}><div className={'ex-wrap '+(practice?'sl-practice-hero':'')}><div>{source.compact&&<nav className="ex-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/resources">Resources</a><span>/</span><span>{page.title}</span></nav>}<p className="ex-eyebrow">{source.eyebrow}</p><h1>{source.title}</h1><div className="ex-lead"><Paragraphs counts={source.intro.length?source.intro:[45]}/></div>{practice&&<ul className="sl-list"><li>Equipment documentation for your practice</li><li>Training and setup support from our team</li><li>Portable and clinical chamber configurations</li></ul>}{page.path==='/hyperbaric-chamber-cost'?<div className="ex-actions"><a className="ex-button" href="#pricing">Get Pricing and Financing Options</a></div>:!source.compact&&page.path!=='/hyperbaric-chamber-buying-guide'&&<Actions primary={practice?'Talk to a Product Specialist':'Get Started'}/>}</div>{practice&&<img src="https://www.oxyhealth.com/OxyImages/homepage/updated/carousel-fortius-exp-render.webp" alt="Clinical hyperbaric chamber configuration"/>}</div></section>{practice&&<section className="sl-practice-stats"><div className="ex-wrap ex-proof-grid">{['Experience','Chambers delivered','Physician community','Warranty coverage'].map(title=><div key={title}><span>—</span><p>{title}</p></div>)}</div></section>}{source.sections.map((section,index)=><SourceSection key={index} section={section} index={index} compact={source.compact} path={page.path}/>)}</main>;}
