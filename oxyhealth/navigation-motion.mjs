// The upward direction is user-observed; the original asset list confirms Framer
// Motion, but does NOT establish its timing. These provisional parameters are
// documented in inspection/navigation-current/evidence.json, not certified exact.
export const navigationMotion = {duration:600, distance:40, easing:'cubic-bezier(0.22, 1, 0.36, 1)'};
const storageKey='oxyhealth:route-arrival';

export function installNavigationMotion(paths){
  const routes=new Set(paths);
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  let arrival=false;
  try{
    const pending=JSON.parse(sessionStorage.getItem(storageKey)||'null');
    sessionStorage.removeItem(storageKey);
    arrival=Boolean(pending&&pending.path===location.pathname&&Date.now()-pending.time<15000);
  }catch{/* Storage can be unavailable in private browsing; links still work. */}
  if(arrival&&!reduced())document.documentElement.dataset.routeArrival='pending';

  // Keep real document navigation, native history, modifier keys and downloads.
  document.addEventListener('click',event=>{
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const link=event.target.closest?.('a[href]');
    if(!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
    const url=new URL(link.href,location.href);
    if(url.origin!==location.origin||url.pathname===location.pathname||!routes.has(url.pathname)||reduced())return;
    try{sessionStorage.setItem(storageKey,JSON.stringify({path:url.pathname,time:Date.now()}));}catch{/* Native link fallback. */}
  });
  addEventListener('pageshow',()=>delete document.documentElement.dataset.routeArrival);
  return ()=>{
    if(!arrival||reduced())return;
    arrival=false;
    const main=document.querySelector('main');
    delete document.documentElement.dataset.routeArrival;
    if(!main?.animate)return;
    const animation=main.animate([
      {opacity:0,transform:`translateY(${navigationMotion.distance}px)`},
      {opacity:1,transform:'translateY(0)'}
    ],{duration:navigationMotion.duration,easing:navigationMotion.easing});
    animation.id='route-arrival';
    // Releasing the transform afterwards preserves sticky/fixed descendants.
    animation.finished.then(()=>animation.cancel()).catch(()=>{});
  };
}
