// Build-time-only transformation of the authorized, rendered source captures.
// Keep visual content and classes; remove executable code and external submissions.
import {allRoutes} from './route-manifest.mjs';
const localRoutes=new Set(allRoutes.map(route=>route.path));
const captcha='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="70"><rect width="200" height="70" fill="#f5f5f7"/><text x="100" y="43" text-anchor="middle" font-family="sans-serif" font-size="24" font-style="italic" letter-spacing="5" fill="#1d1d1f">PREVIEW</text></svg>');
export function capturedMainClass(html) {
 return html.match(/<main\b[^>]*\bclass="([^"]*)"/i)?.[1]||'';
}
export function capturedMain(html,images=[]) {
 const match=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
 if(!match)throw new Error('The source capture has no main landmark');
 const dialogs=[...html.slice(match.index+match[0].length).matchAll(/<dialog\b[^>]*>[\s\S]*?<\/dialog>/gi)].map(match=>match[0]).join('');
 return (match[1]+dialogs)
  .replace(/<(script|iframe|object|embed)\b[^>]*>[\s\S]*?<\/\1>/gi,'')
  .replace(/<(script|iframe|object|embed)\b[^>]*\/?>/gi,'')
  .replace(/\s+on[a-z]+=(?:"[^"]*"|'[^']*')/gi,'')
  .replace(/\s+(?:action|formaction)=(?:"[^"]*"|'[^']*')/gi,'')
  .replace(/<input\b(?=[^>]*\btype="hidden")[^>]*>/gi,'')
  .replace(/<img\b(?=[^>]*\bid="wf_tr_)[^>]*>/gi,'')
  .replace(/<img\b(?=[^>]*\balt="Captcha verification image")[^>]*>/gi,'<img src="'+captcha+'" alt="Captcha verification image" width="200" height="70" class="rounded-lg border border-neutral-200" data-preview-captcha>')
  .replace(/(<input\b(?=[^>]*\bname="enterdigest")[^>]*)(>)/gi,(_,input,end)=>input.replace(/\splaceholder="[^"]*"/,'')+' pattern="PREVIEW" placeholder="Enter PREVIEW"'+end)
  .replace(/<option\b(?=[^>]*\bdisabled)([^>]*)value="-None-"([^>]*)>/gi,'<option$1value=""$2>')
  .replace(/\s+(href|src)="javascript:[^"]*"/gi,'')
  .replace(/href="((?:https:\/\/(?:www\.)?oxyhealth\.com)?\/[^"\s]*)"/gi,(_,href)=>{
   const url=new URL(href,'https://www.oxyhealth.com');
   const pathname=url.pathname.replace(/\/+$/,'')||'/';
   return 'href="'+(localRoutes.has(pathname)?pathname+url.search+url.hash:url.href)+'"';
  })
  .replace(/(src|poster)="(\/[^"\s]*)"/gi,(_,attr,url)=>attr+'="https://www.oxyhealth.com'+url+'"')
  .replace(/srcset="([^"]*)"/gi,(_,value)=>'srcset="'+value.replace(/(^|,\s*)(\/[^\s,]+)/g,'$1https://www.oxyhealth.com$2')+'"')
  // Scroll-reveal wrappers were captured before entering the viewport. They must
  // remain readable in the static rebuild; this does not open FAQ answer panels.
  .replace(/style="\s*opacity:\s*[01](?:\.0+)?;?\s*transform:\s*(?:translateY\([^)]*\)|none);?\s*"/gi,'')
  .replace(/<!--[^]*?-->/g,'')
  .replace(/<img\b[^>]*>/gi,tag=>{
   if(/aspect-|aspect-ratio:|data-preview-captcha/.test(tag))return tag;
   const src=tag.match(/\bsrc="([^"]*)"/)?.[1];
   const asset=images.find(image=>image.src===src);
   if(!asset?.w||!asset?.h)return tag;
   const ratio='aspect-ratio:'+asset.w+' / '+asset.h+';';
   return tag.includes('style="')?tag.replace('style="','style="'+ratio):tag.replace(/>$/,' style="'+ratio+'">');
  });
}
