class ZodProductCard extends HTMLElement {
  connectedCallback() {
    try {
      this.product = this.product || JSON.parse(this.getAttribute('product') || '{}');
    } catch (_) { this.product = {}; }
    if (!this.product?.id) return;
    this.waitForSalla().then(()=>salla.onReady()).then(()=>{
      if (salla.lang?.onLoaded) salla.lang.onLoaded(()=>this.render());
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

  esc(value='') {
    return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }

  money(value) {
    if (value === undefined || value === null) return '';
    try { return salla.money(value); } catch (_) { return value; }
  }

  number(value) {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    if (typeof value === 'string') {
      const n=Number(value.replace(/[^0-9.\-]/g,''));
      return Number.isFinite(n)?n:0;
    }
    if (value && typeof value === 'object') return this.number(value.amount ?? value.value ?? value.price);
    return 0;
  }

  t(key, fallback='') {
    try {
      const value=salla.lang.get(key);
      return value && value !== key ? value : fallback;
    } catch (_) { return fallback; }
  }

  isArabic() {
    return (document.documentElement.lang || '').toLowerCase().startsWith('ar');
  }

  imageUrl(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value.url || value.original || value.medium || value.small || value.thumbnail || '';
    }
    return '';
  }

  getBrand(product=this.product) {
    const brand=product?.brand || product?.manufacturer || null;
    const logo=this.imageUrl(brand?.logo || brand?.image || product?.brand_logo || product?.brandLogo);
    return {
      id: brand?.id || product?.brand_id || product?.brandId || '',
      name: brand?.name || product?.brand_name || product?.brandName || '',
      url: brand?.url || product?.brand_url || product?.brandUrl || '#',
      logo
    };
  }

  getCategory(product=this.product) {
    const raw=product?.category || product?.main_category || product?.categories?.[0] || null;
    if (!raw) return null;
    if (typeof raw === 'string') return { name: raw, url: '' };
    const name=raw.name || raw.title || raw.label || '';
    if (!name) return null;
    return { name, url: raw.url || raw.link || '' };
  }

  discountPercent() {
    const p=this.product;
    const raw=p.discount_percentage ?? p.discountPercent ?? p.discount;
    const parsed=this.number(raw);
    if (parsed>0) return Math.round(parsed);
    const sale=this.number(p.sale_price);
    const regular=this.number(p.regular_price);
    if (sale>0 && regular>sale) return Math.max(1,Math.round(((regular-sale)/regular)*100));
    return 0;
  }

  price() {
    const p=this.product;
    const sale=this.number(p.sale_price);
    const regular=this.number(p.regular_price);
    if (p.is_on_sale && sale>0 && (!regular || regular>sale)) {
      return `<div class="zpc-price is-sale"><strong>${this.money(p.sale_price)}</strong>${regular?`<del>${this.money(p.regular_price)}</del>`:''}</div>`;
    }
    if (this.number(p.starting_price)>0) {
      return `<div class="zpc-price"><small>${this.t('pages.products.starting_price',this.isArabic()?'يبدأ من':'From')}</small><strong>${this.money(p.starting_price)}</strong></div>`;
    }
    return `<div class="zpc-price"><strong>${this.money(p.price)}</strong></div>`;
  }

  async hydrateBrandLogo(brandKey) {
    if (!brandKey || !window.salla?.product?.getDetails) return;
    window.__zodBrandLogoCache ||= new Map();

    if (!window.__zodBrandLogoCache.has(brandKey)) {
      const productId=this.product.id;
      window.__zodBrandLogoCache.set(brandKey, (async()=>{
        try {
          const response=await salla.product.getDetails(productId);
          const root=response?.data?.data ?? response?.data ?? response ?? {};
          const detailed=root?.product ?? root;
          const brand=this.getBrand(detailed);
          return brand.logo ? brand : null;
        } catch (_) { return null; }
      })());
    }

    const brand=await window.__zodBrandLogoCache.get(brandKey);
    if (!brand?.logo || !this.isConnected || this.querySelector('.zpc-brand-logo')) return;

    const category=this.querySelector('.zpc-category');
    const anchor=document.createElement('a');
    anchor.className='zpc-brand-logo';
    anchor.href=brand.url || '#';
    anchor.setAttribute('aria-label',brand.name || 'Brand');
    anchor.title=brand.name || '';
    anchor.innerHTML=`<img src="${this.esc(brand.logo)}" alt="${this.esc(brand.name||'')}" loading="lazy" decoding="async">`;
    anchor.querySelector('img')?.addEventListener('error',()=>anchor.remove(),{once:true});
    if (category?.nextSibling) category.parentNode.insertBefore(anchor,category.nextSibling);
    else this.querySelector('.zpc-body')?.prepend(anchor);
  }

  render() {
    const p=this.product;
    const image=this.imageUrl(p?.image) || p.thumbnail || '';
    const imageAlt=this.esc(p?.image?.alt || p.name || '');
    const rawStatus=String(p.status || '').toLowerCase();
    const explicitQuantity=(p.quantity !== undefined && p.quantity !== null && p.quantity !== '') ? Number(p.quantity) : null;
    const isOut=Boolean(
      p.is_out_of_stock ||
      ['out','out-of-stock','out_of_stock','sold-out','sold_out','out-and-notify'].includes(rawStatus) ||
      (Number.isFinite(explicitQuantity) && explicitQuantity <= 0 && !['donating','financial_support'].includes(p.type))
    );
    const status=(isOut && window.notify_when_available_in_card !== false && !['donating','financial_support'].includes(p.type)) ? 'out-and-notify' : p.status;
    const addLabel=p.add_to_cart_label || this.t(p.type==='booking'?'pages.cart.book_now':'pages.cart.add_to_cart',this.isArabic()?'أضف إلى السلة':'Add to cart');
    const outLabel=this.t('pages.products.out_of_stock',this.isArabic()?'نفدت الكمية':'Out of stock');
    const wishlistLabel=this.esc(this.t('zod.header.wishlist',this.isArabic()?'المفضلة':'Wishlist'));
    const viewLabel=this.esc(this.isArabic()?'عرض المنتج':'View product');
    const brand=this.getBrand(p);
    const category=this.getCategory(p);
    const discount=this.discountPercent();
    const inWishlist=!salla.config.isGuest() && (salla.storage.get('salla::wishlist',[])||[]).map(Number).includes(Number(p.id));
    const promo=p.promotion_title || p.promotion?.title || '';
    const taxLabel=p.is_taxable ? this.t('zod.product.tax_included',this.isArabic()?'شامل ضريبة القيمة المضافة':'VAT included') : '';

    this.classList.add('zod-product-card');
    this.setAttribute('data-product-id', p.id);
    this.innerHTML=`
      <div class="zpc-media ${isOut ? 'is-out' : ''}">
        <a class="zpc-product-link" href="${this.esc(p.url||'#')}" aria-label="${imageAlt}"><img src="${this.esc(image)}" alt="${imageAlt}" loading="lazy"></a>
        ${discount?`<span class="zpc-discount-badge">${this.esc(discount)}%</span>`:''}
        ${promo?`<span class="zpc-offer-badge" title="${this.esc(promo)}">${this.esc(promo)}</span>`:''}
        ${isOut?`<span class="zpc-stock-stamp">${this.esc(outLabel)}</span>`:''}
        <div class="zpc-hover-actions" aria-label="${viewLabel}">
          <a class="zpc-action zpc-quick-view" href="${this.esc(p.url||'#')}" aria-label="${viewLabel}" title="${viewLabel}"><i class="sicon-eye"></i></a>
          <button type="button" class="zpc-action zpc-wishlist ${inWishlist?'is-active':''}" data-id="${p.id}" aria-label="${wishlistLabel}" aria-pressed="${inWishlist?'true':'false'}"><i class="sicon-heart"></i></button>
        </div>
      </div>
      <div class="zpc-body">
        ${category?`${category.url?`<a class="zpc-category" href="${this.esc(category.url)}">${this.esc(category.name)}</a>`:`<span class="zpc-category">${this.esc(category.name)}</span>`}`:''}
        ${brand.logo?`<a class="zpc-brand-logo" href="${this.esc(brand.url)}" aria-label="${this.esc(brand.name)}" title="${this.esc(brand.name)}"><img src="${this.esc(brand.logo)}" alt="${this.esc(brand.name)}" loading="lazy" decoding="async"></a>`:''}
        <h3><a href="${this.esc(p.url||'#')}">${this.esc(p.name)}</a></h3>
        ${taxLabel?`<p class="zpc-tax">${this.esc(taxLabel)}</p>`:''}
        ${p.rating?.stars?`<div class="zpc-meta"><span class="zpc-rating"><i class="sicon-star2"></i>${this.esc(p.rating.stars)}${p.rating.count?` <small>(${this.esc(p.rating.count)})</small>`:''}</span></div>`:''}
        <div class="zpc-bottom">${this.price()}</div>
        <salla-add-product-button class="zpc-add" width="wide" fill="outline" product-id="${p.id}" product-status="${this.esc(status||'')}" product-type="${this.esc(p.type||'product')}">${this.esc(addLabel)}</salla-add-product-button>
      </div>`;

    this.querySelector('.zpc-brand-logo img')?.addEventListener('error', e=>e.currentTarget.closest('.zpc-brand-logo')?.remove(), {once:true});
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
        const active=!btn.classList.contains('is-active');
        btn.classList.toggle('is-active',active);
        btn.setAttribute('aria-pressed',String(active));
        btn.classList.remove('is-pulsing');
        void btn.offsetWidth;
        btn.classList.add('is-pulsing');
        setTimeout(()=>btn.classList.remove('is-pulsing'),420);
      } catch (_) {
        // Leave the current UI state unchanged on failure.
      } finally {
        btn.removeAttribute('aria-busy');
      }
    });

    if (!brand.logo) {
      const brandKey=String(brand.id || brand.name || '').trim().toLowerCase();
      if (brandKey) this.hydrateBrandLogo(brandKey);
    }
  }
}

if (!customElements.get('custom-salla-product-card')) customElements.define('custom-salla-product-card', ZodProductCard);
