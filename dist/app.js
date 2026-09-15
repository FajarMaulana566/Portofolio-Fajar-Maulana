// Progressive enhancement: static content stays readable without JavaScript.
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const systemTheme=matchMedia('(prefers-color-scheme: dark)');
let preference='system',controller,observer,pageToken=0;
try{preference=localStorage.getItem('fajar-theme')||'system';}catch{}
if(!['system','dark','light'].includes(preference))preference='system';
function applyTheme(){
 const actual=preference==='system'?(systemTheme.matches?'dark':'light'):preference;
 document.documentElement.dataset.theme=actual;
 const names={system:'Sistem',dark:'Gelap',light:'Terang'};
 const button=document.querySelector('.theme-toggle');
 if(button){button.querySelector('.theme-label').textContent=names[preference];button.setAttribute('aria-label','Tema '+names[preference]+'. Klik untuk beralih ke '+names[{system:'dark',dark:'light',light:'system'}[preference]]);button.title='Tema: '+names[preference];}
 document.querySelector('meta[name="theme-color"]').content=actual==='dark'?'#101111':'#f5f6f8';
}
systemTheme.addEventListener('change',applyTheme);
function enhance(){
 controller?.abort();observer?.disconnect();controller=new AbortController();const {signal}=controller;applyTheme();
 document.querySelector('.theme-toggle')?.addEventListener('click',()=>{preference={system:'dark',dark:'light',light:'system'}[preference];try{localStorage.setItem('fajar-theme',preference);}catch{}applyTheme();},{signal});
 const menu=document.querySelector('.menu-toggle');
 menu?.addEventListener('click',()=>{const open=document.querySelector('header').classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Tutup navigasi':'Buka navigasi');},{signal});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelector('header')?.classList.remove('menu-open');menu?.setAttribute('aria-expanded','false');}},{signal});
 if(!reduced.matches&&'IntersectionObserver' in window){
  observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}},{threshold:.08});
  document.querySelectorAll('.about-strip,.casual-section,.bottom-cta,.tool,.project,.robot-feature,.detail-gallery figure').forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--reveal-delay',Math.min(i%3*55,110)+'ms');observer.observe(el);});
 }
 document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  const chosen=button.dataset.filter;let count=0;
  document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});
  document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=chosen!=='Semua'&&card.dataset.category!==chosen;if(!card.hidden){count++;card.classList.add('is-visible');}});
  let status=document.getElementById('filter-status');if(!status){status=document.createElement('p');status.id='filter-status';status.className='sr-only';status.setAttribute('role','status');button.closest('.filters').after(status);}status.textContent=count+' proyek ditampilkan';
 },{signal}));
 document.querySelectorAll('[data-lightbox]').forEach(button=>button.addEventListener('click',async()=>{try{const module=await import('/modules/lightbox.js');if(button.isConnected)module.openLightbox(button);}catch{location.href=button.dataset.lightbox;}},{signal}));
 document.querySelector('[data-compare]')?.addEventListener('input',e=>{document.querySelector('.before-image').style.clipPath='inset(0 '+(100-e.target.value)+'% 0 0)';},{signal});
 const stages=document.querySelectorAll('[data-depth]');
 if(stages.length&&!reduced.matches)import('/modules/depth.js').then(m=>{if(!signal.aborted)m.attachDepth(stages,signal);}).catch(()=>{});
 const form=document.querySelector('#contact-form');
 if(form){const service=new URLSearchParams(location.search).get('service');if(service)form.elements.service.value=service==='tech'?'Teknologi':'Kreatif';form.addEventListener('submit',async e=>{e.preventDefault();const submit=form.querySelector('[type="submit"]'),result=document.getElementById('form-result');submit.disabled=true;try{
   const response=await fetch('/data/socials.json');if(!response.ok)throw Error('contact');const contact=await response.json(),data=new FormData(form);
   const message='Halo Fajar, saya '+data.get('name')+' ('+data.get('email')+').\nKebutuhan: '+data.get('service')+'\n\n'+data.get('message');
   if(contact.whatsapp)location.href='https://wa.me/'+contact.whatsapp+'?text='+encodeURIComponent(message);
   else if(contact.email)location.href='mailto:'+contact.email+'?subject='+encodeURIComponent('Diskusi proyek '+data.get('service'))+'&body='+encodeURIComponent(message);
   else{result.replaceChildren();const p=document.createElement('p');p.textContent='Pesan siap, belum terkirim. Kontak pemilik belum tersedia. Salin pesan berikut:';const area=document.createElement('textarea');area.readOnly=true;area.rows=6;area.setAttribute('aria-label','Pesan siap disalin');area.value=message;result.append(p,area);area.focus();area.select();}
  }catch{result.textContent='Kontak belum dapat dimuat. Silakan coba lagi; pesan Anda tetap tersimpan di formulir.';}finally{submit.disabled=false;}
 },{signal});}
}
async function navigate(url,pop=false){
 const token=++pageToken;
 try{
  const response=await fetch(url.pathname+url.search,{headers:{'X-Requested-With':'portfolio-navigation'}});if(!response.ok)throw Error('page');
  const doc=new DOMParser().parseFromString(await response.text(),'text/html');const next=doc.querySelector('#app');if(!next)throw Error('page');if(token!==pageToken)return;
  const update=()=>{document.getElementById('app').replaceWith(next);document.title=doc.title;for(const selector of ['meta[name="description"]','link[rel="canonical"]','meta[property="og:title"]','meta[property="og:description"]','meta[property="og:url"]','meta[name="twitter:title"]','meta[name="twitter:description"]']){const replacement=doc.querySelector(selector);if(replacement)document.querySelector(selector)?.replaceWith(replacement);}if(!pop)history.pushState({},'',url);enhance();scrollTo({top:0,behavior:'instant'});document.querySelector('#main')?.focus({preventScroll:true});};
  if(document.startViewTransition&&!reduced.matches)document.startViewTransition(update);else update();
 }catch{if(token===pageToken)location.href=url.href;}
}
document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.hasAttribute('download'))return;const url=new URL(a.href);if(url.origin!==location.origin||!url.pathname.endsWith('/'))return;if(url.pathname===location.pathname&&url.hash)return;e.preventDefault();navigate(url);});
addEventListener('popstate',()=>navigate(new URL(location.href),true));
// Legacy hash links remain usable.
if(location.hash.startsWith('#/')){const [legacy,query]=location.hash.slice(2).split('?');location.replace((legacy?'/'+legacy.replace(/\/$/,'')+'/':'/')+(query?'?'+query:''));}else enhance();
reduced.addEventListener('change',()=>{document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-visible'));enhance();});
