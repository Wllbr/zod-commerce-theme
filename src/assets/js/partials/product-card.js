class ZodProductCard extends HTMLElement {
  connectedCallback() {
    try {
      this.product = this.product || JSON.parse(this.getAttribute('product') || '{}');
    } catch (_) { this.product = {}; }
    if (!this.product?.id) return;
    this.waitForSalla().then(()=>salla.onReady()).then(()=>{
      if(salla.lang?.onLoaded) salla.lang.onLoaded(()=>this.render());
      else this.render();
    }).catch(()=>{});
  }
  waitForSalla(timeout=8000) {
    if (window.__zodSallaReadyPromise) return window.__zodSallaReadyPromise;
    window.__zodSallaReadyPromise = new Promise((resolve,reject)=>{
      const started=Date.now();
      const check=()=>{
        if(window.salla?.onReady) return resolve(window.salla);
        if(Date.now()-started>=timeout) return reject(new Error('Salla SDK unavailable'));
        setTimeout(check,80);
      };
      check();
    });
    return window.__zodSallaReadyPromise;
  }
  esc(value='') { return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }
  money(value) { if (value === undefined || value === null) return ''; try { return salla.money(value); } catch (_) { return value; } }
  number(value) {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    if (typeof value === 'string') { const n=Number(value.replace(/[^0-9.\-]/g,'')); return Number.isFinite(n)?n:0; }
    if (value && typeof value === 'object') return this.number(value.amount ?? value.value ?? value.price);
    return 0;
  }
  t(key, fallback='') { try { return salla.lang.get(key) || fallback; } catch (_) { return fallback; } }
  price() {
    const p=this.product;
    const sale=this.number(p.sale_price);
    const regular=this.number(p.regular_price);
    if (p.is_on_sale && sale>0 && (!regular || regular>sale)) return `<div class="zpc-price"><strong>${this.money(p.sale_price)}</strong>${regular?`<del>${this.money(p.regular_price)}</del>`:''}${p.discount_percentage?`<span>-${this.esc(p.discount_percentage)}</span>`:''}</div>`;
    if (this.number(p.starting_price)>0) return `<div class="zpc-price"><small>${this.t('pages.products.starting_price','From')}</small><strong>${this.money(p.starting_price)}</strong></div>`;
    return `<div class="zpc-price"><strong>${this.money(p.price)}</strong></div>`;
  }
  render() {
    const p=this.product;
    const image=p?.image?.url || p.thumbnail || '';
    const imageAlt=this.esc(p?.image?.alt || p.name || '');
    const status=(p.is_out_of_stock && window.notify_when_available_in_card !== false && !['donating','financial_support'].includes(p.type)) ? 'out-and-notify' : p.status;
    const addLabel=p.add_to_cart_label || this.t(p.type==='booking'?'pages.cart.book_now':'pages.cart.add_to_cart','Add to cart');
    const outLabel=this.t('pages.products.out_of_stock','Out of stock');
    const wishlistLabel=this.esc(this.t('zod.header.wishlist','Wishlist'));
    const inWishlist=!salla.config.isGuest() && (salla.storage.get('salla::wishlist',[])||[]).includes(Number(p.id));
    this.classList.add('zod-product-card');
    this.setAttribute('data-product-id', p.id);
    this.innerHTML=`
      <div class="zpc-media">
        <a href="${this.esc(p.url||'#')}" aria-label="${imageAlt}"><img src="${this.esc(image)}" alt="${imageAlt}" loading="lazy"></a>
        ${p.promotion_title?`<span class="zpc-badge">${this.esc(p.promotion_title)}</span>`:''}
        ${p.is_out_of_stock?`<span class="zpc-stock-badge">${this.esc(outLabel)}</span>`:''}
        <button type="button" class="zpc-wishlist ${inWishlist?'is-active':''}" data-id="${p.id}" aria-label="${wishlistLabel}"><i class="sicon-heart"></i></button>
      </div>
      <div class="zpc-body">
        ${p.brand?.name?`<a class="zpc-brand" href="${this.esc(p.brand.url||'#')}">${this.esc(p.brand.name)}</a>`:''}
        <h3><a href="${this.esc(p.url||'#')}">${this.esc(p.name)}</a></h3>
        ${p.subtitle?`<p>${this.esc(p.subtitle)}</p>`:''}
        <div class="zpc-meta">${p.rating?.stars?`<span class="zpc-rating"><i class="sicon-star2"></i>${this.esc(p.rating.stars)}${p.rating.count?` <small>(${this.esc(p.rating.count)})</small>`:''}</span>`:''}</div>
        <div class="zpc-bottom">${this.price()}</div>
        <salla-add-product-button class="zpc-add" width="wide" fill="outline" product-id="${p.id}" product-status="${this.esc(status||'')}" product-type="${this.esc(p.type||'product')}">${this.esc(addLabel)}</salla-add-product-button>
      </div>`;
    this.querySelector('.zpc-wishlist')?.addEventListener('click', async e=>{
      e.preventDefault();
      e.stopPropagation();
      const btn=e.currentTarget;
      if (salla.config.isGuest()) {
        const modal=document.querySelector('salla-login-modal');
        if (typeof modal?.open==='function') await modal.open(e);
        return;
      }
      btn.setAttribute('aria-busy','true');
      try {
        await salla.wishlist.toggle(p.id);
        btn.classList.toggle('is-active');
      } catch (_) {
        // Leave the current UI state unchanged on failure.
      } finally {
        btn.removeAttribute('aria-busy');
      }
    });
  }
}
if (!customElements.get('custom-salla-product-card')) customElements.define('custom-salla-product-card', ZodProductCard);
