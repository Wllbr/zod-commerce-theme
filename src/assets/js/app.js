import 'lite-youtube-embed/src/lite-yt-embed.js';
import './partials/product-card';

class ZodTheme {
  constructor(){this.header=document.querySelector('.zod-header');this.init();}
  init(){
    document.documentElement.classList.add('zod-js');
    if(this.header?.dataset.sticky==='1'){
      const onScroll=()=>this.header.classList.toggle('is-scrolled',window.scrollY>20);
      onScroll();window.addEventListener('scroll',onScroll,{passive:true});
    }
    document.addEventListener('click',e=>{
      const link=e.target.closest('a[href^="#"]');if(link&&link.hash?.length>1){const target=document.querySelector(link.hash);if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}}
    });
    this.initFooterDisclosures();
    this.initDisclosureToggles();
    window.salla?.onReady?.().then(()=>{document.dispatchEvent(new CustomEvent('zod::ready'));});
  }

  initDisclosureToggles(){
    document.querySelectorAll('.collapse-content').forEach(panel=>panel.hidden=true);
    document.addEventListener('click',event=>{
      const trigger=event.target.closest('[data-show]');
      if(!trigger) return;
      const id=trigger.getAttribute('data-show');
      if(!id) return;
      const panel=document.getElementById(id);
      if(!panel) return;
      event.preventDefault();
      panel.hidden=!panel.hidden;
      trigger.setAttribute('aria-expanded',String(!panel.hidden));
    });
  }
  initFooterDisclosures(){
    const items=[...document.querySelectorAll('[data-footer-disclosure]')];
    if(!items.length) return;
    const mq=window.matchMedia('(max-width:640px)');
    const sync=()=>items.forEach(item=>{ item.open=!mq.matches; });
    sync();
    mq.addEventListener?.('change',sync);
  }
  focusSearch(){
    const modal=[...document.querySelectorAll('salla-search')].find(el=>!el.hasAttribute('inline'));
    if(modal?.open){modal.open();return;}
    const mobile=document.querySelector('[data-zod-mobile-search] salla-search');mobile?.scrollIntoView({behavior:'smooth',block:'center'});
  }
}
window.notify_when_available_in_card = window.zodSettings?.notifyWhenAvailable !== false;
window.zodTheme=new ZodTheme();
