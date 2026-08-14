class ZodMainMenu extends HTMLElement {
  connectedCallback() {
    this.innerHTML='<div class="zod-menu-skeleton"><span></span><span></span><span></span><span></span></div>';
    this.bindGlobalInteractions();
    this.waitForSalla().then(()=>salla.onReady()).then(()=>salla.api.component.getMenus()).then(({data})=>{
      this.menus=Array.isArray(data)?data:[];
      this.render();
      window.zodMenu?.setMenus(this.menus);
    }).catch(()=>{ this.innerHTML=''; });
  }
  bindGlobalInteractions(){
    document.addEventListener('click',event=>{
      if(this.classList.contains('catalog-open') && !this.contains(event.target) && !event.target.closest('.zod-all-categories')) this.classList.remove('catalog-open');
    });
    document.addEventListener('keydown',event=>{
      if(event.key!=='Escape') return;
      this.classList.remove('catalog-open');
      window.zodMenu?.closeMobile();
    });
  }
  waitForSalla(timeout=8000){
    return new Promise((resolve,reject)=>{
      const started=Date.now();
      const check=()=>{
        if(window.salla?.onReady && window.salla?.api?.component) return resolve(window.salla);
        if(Date.now()-started>=timeout) return reject(new Error('Salla SDK unavailable'));
        setTimeout(check,50);
      };
      check();
    });
  }
  esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  childColumn(menu){
    const children=menu.children||[];
    return `<div class="zod-mega-column"><a class="zod-mega-heading" href="${this.esc(menu.url||'#')}">${this.esc(menu.title||'')}</a>${children.map(ch=>`<a href="${this.esc(ch.url||'#')}">${this.esc(ch.title||'')}</a>${ch.children?.length?`<div class="zod-mega-nested">${ch.children.slice(0,5).map(x=>`<a href="${this.esc(x.url||'#')}">${this.esc(x.title||'')}</a>`).join('')}</div>`:''}`).join('')}</div>`;
  }
  render(){
    const roots=this.menus.slice(0,7);
    const navLabel=this.esc(this.getAttribute('aria-label')||'');
    this.innerHTML=`<nav class="zod-main-nav" aria-label="${navLabel}">${roots.map(menu=>`<div class="zod-main-nav__item"><a href="${this.esc(menu.url||'#')}">${this.esc(menu.title||'')}</a>${menu.children?.length?`<div class="zod-mega"><div class="zod-mega-grid">${menu.children.slice(0,5).map(ch=>this.childColumn(ch)).join('')}${menu.image?`<a href="${this.esc(menu.url||'#')}" class="zod-mega-feature"><img src="${this.esc(menu.image)}" alt="${this.esc(menu.title)}"><b>${this.esc(menu.title)}</b></a>`:''}</div></div>`:''}</div>`).join('')}</nav><div class="zod-all-catalog-panel"><div class="zod-all-catalog-grid">${this.menus.map(m=>this.childColumn(m)).join('')}</div></div>`;
  }
  toggleCatalog(){this.classList.toggle('catalog-open');}
}
if (!customElements.get('zod-main-menu')) customElements.define('zod-main-menu', ZodMainMenu);

window.zodMenu={
  menus:[],stack:[],
  setMenus(menus){this.menus=menus||[];this.renderMobile(this.menus,null);},
  toggleCatalog(){document.querySelector('zod-main-menu')?.toggleCatalog();},
  openMobile(){const el=document.getElementById('zod-mobile-menu');if(!el)return;this.lastFocus=document.activeElement;el.classList.add('is-open');el.setAttribute('aria-hidden','false');document.documentElement.classList.add('zod-lock');this.stack=[];this.renderMobile(this.menus,null);requestAnimationFrame(()=>el.querySelector('.zod-mobile-menu__head button')?.focus());},
  closeMobile(){const el=document.getElementById('zod-mobile-menu');if(!el)return;el.classList.remove('is-open');el.setAttribute('aria-hidden','true');document.documentElement.classList.remove('zod-lock');this.lastFocus?.focus?.();},
  waitForSalla(timeout=8000){
    return new Promise((resolve,reject)=>{
      const started=Date.now();
      const check=()=>{
        if(window.salla?.onReady && window.salla?.api?.component) return resolve(window.salla);
        if(Date.now()-started>=timeout) return reject(new Error('Salla SDK unavailable'));
        setTimeout(check,50);
      };
      check();
    });
  },
  esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));},
  renderMobile(items,title){const box=document.getElementById('zod-mobile-menu-content');if(!box)return;const back=this.stack.length?`<button type="button" class="zod-mobile-back" data-zod-back><i class="sicon-keyboard_arrow_right rtl:rotate-180"></i>${this.esc(title||'')}</button>`:'';box.innerHTML=`${back}<div class="zod-mobile-level">${(items||[]).map((m,i)=>`<div class="zod-mobile-menu-item">${m.children?.length?`<button type="button" data-zod-next="${i}">${m.image?`<img src="${this.esc(m.image)}" alt="">`:''}<span>${this.esc(m.title||'')}</span><i class="sicon-keyboard_arrow_left rtl:rotate-180"></i></button>`:`<a href="${this.esc(m.url||'#')}">${m.image?`<img src="${this.esc(m.image)}" alt="">`:''}<span>${this.esc(m.title||'')}</span></a>`}</div>`).join('')}</div>`;box.querySelectorAll('[data-zod-next]').forEach(btn=>btn.addEventListener('click',()=>{const m=(items||[])[Number(btn.dataset.zodNext)];this.stack.push({items,title});this.renderMobile(m.children,m.title);}));box.querySelector('[data-zod-back]')?.addEventListener('click',()=>{const prev=this.stack.pop();if(prev)this.renderMobile(prev.items,prev.title);});},
};
