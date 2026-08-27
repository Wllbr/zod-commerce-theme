class ZodProductCard extends HTMLElement {
  connectedCallback() {
    try {
      this.product = this.product || JSON.parse(this.getAttribute('product') || '{}');
    } catch (_) { this.product = {}; }
    if (!this.product?.id) return;
    this.waitForSalla().then(() => salla.onReady()).then(() => {
      if (salla.lang?.onLoaded) salla.lang.onLoaded(() => this.render());
      else this.render();
    }).catch(() => {});
  }

  waitForSalla(timeout = 8000) {
    if (window.__zodSallaReadyPromise) return window.__zodSallaReadyPromise;
    window.__zodSallaReadyPromise = new Promise((resolve, reject) => {
      const started = Date.now();
      const check = () => {
        if (window.salla?.onReady) return resolve(window.salla);
        if (Date.now() - started >= timeout) return reject(new Error('Salla SDK unavailable'));
        setTimeout(check, 80);
      };
      check();
    });
    return window.__zodSallaReadyPromise;
  }

  esc(value = '') {
    return String(value).replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  stripHtml(value = '') {
    const node = document.createElement('div');
    node.innerHTML = String(value || '');
    return (node.textContent || node.innerText || '').replace(/\s+/g, ' ').trim();
  }

  money(value) {
    if (value === undefined || value === null) return '';
    try { return salla.money(value); } catch (_) { return value; }
  }

  number(value) {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    if (typeof value === 'string') {
      const n = Number(value.replace(/[^0-9.\-]/g, ''));
      return Number.isFinite(n) ? n : 0;
    }
    if (value && typeof value === 'object') return this.number(value.amount ?? value.value ?? value.price);
    return 0;
  }

  t(key, fallback = '') {
    try {
      const value = salla.lang.get(key);
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

  getCategory(product = this.product) {
    const raw = product?.category || product?.main_category || product?.categories?.[0] || null;
    if (!raw) return null;
    if (typeof raw === 'string') return { name: raw, url: '' };
    const name = raw.name || raw.title || raw.label || '';
    if (!name) return null;
    return { name, url: raw.url || raw.link || '' };
  }

  discountPercent() {
    const p = this.product;
    const raw = p.discount_percentage ?? p.discountPercent ?? p.discount;
    const parsed = this.number(raw);
    if (parsed > 0) return Math.round(parsed);
    const sale = this.number(p.sale_price);
    const regular = this.number(p.regular_price);
    if (sale > 0 && regular > sale) return Math.max(1, Math.round(((regular - sale) / regular) * 100));
    return 0;
  }

  price(product = this.product) {
    const p = product;
    const sale = this.number(p.sale_price);
    const regular = this.number(p.regular_price);
    if (p.is_on_sale && sale > 0 && (!regular || regular > sale)) {
      return `<div class="zpc-price is-sale"><strong>${this.money(p.sale_price)}</strong>${regular ? `<del>${this.money(p.regular_price)}</del>` : ''}</div>`;
    }
    if (this.number(p.starting_price) > 0) {
      return `<div class="zpc-price"><small>${this.t('pages.products.starting_price', this.isArabic() ? 'يبدأ من' : 'From')}</small><strong>${this.money(p.starting_price)}</strong></div>`;
    }
    return `<div class="zpc-price"><strong>${this.money(p.price)}</strong></div>`;
  }

  isOutOfStock(product = this.product) {
    const rawStatus = String(product.status || '').toLowerCase();
    const explicitQuantity = (product.quantity !== undefined && product.quantity !== null && product.quantity !== '') ? Number(product.quantity) : null;
    // Salla can return quantity=0 for unlimited products in product details.
    // Explicit availability is more authoritative than that placeholder value.
    if (product.is_available === true || product.unlimited_quantity === true) return false;
    if (product.is_available === false) return true;
    return Boolean(
      product.is_out_of_stock ||
      ['out', 'out-of-stock', 'out_of_stock', 'sold-out', 'sold_out', 'out-and-notify'].includes(rawStatus) ||
      (Number.isFinite(explicitQuantity) && explicitQuantity <= 0 && !['donating', 'financial_support'].includes(product.type))
    );
  }

  initialWishlistState(product = this.product) {
    if (product.is_in_wishlist === true || product.isInWishlist === true || product.in_wishlist === true) return true;
    if (salla.config.isGuest()) return false;
    try {
      return (salla.storage.get('salla::wishlist', []) || []).map(Number).includes(Number(product.id));
    } catch (_) { return false; }
  }


  syncWishlistState(productId, active) {
    const id = String(productId);
    document.querySelectorAll(`custom-salla-product-card[data-product-id="${CSS.escape(id)}"] .zpc-wishlist, [data-zod-product-page][data-product-id="${CSS.escape(id)}"] [data-zod-wishlist]`)
      .forEach(button => {
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
  }

  async toggleWishlist(button, productId) {
    if (!button || button.getAttribute('aria-busy') === 'true') return;
    if (salla.config.isGuest()) {
      const modal = document.querySelector('salla-login-modal');
      if (typeof modal?.open === 'function') await modal.open();
      return;
    }
    const wasActive = button.classList.contains('is-active');
    button.setAttribute('aria-busy', 'true');
    try {
      await salla.wishlist.toggle(String(productId));
      const active = !wasActive;
      this.syncWishlistState(productId, active);
      button.classList.remove('is-pulsing');
      void button.offsetWidth;
      button.classList.add('is-pulsing');
      setTimeout(() => button.classList.remove('is-pulsing'), 360);
    } catch (_) {
      this.syncWishlistState(productId, wasActive);
    } finally {
      button.removeAttribute('aria-busy');
    }
  }

  ensureQuickView() {
    let modal = document.getElementById('zod-quick-view');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'zod-quick-view';
    modal.className = 'zod-qv';
    modal.hidden = true;
    modal.innerHTML = `
      <div class="zod-qv__backdrop" data-zod-qv-close></div>
      <section class="zod-qv__dialog" role="dialog" aria-modal="true" aria-labelledby="zod-qv-title">
        <button type="button" class="zod-qv__close" data-zod-qv-close aria-label="Close"><i class="sicon-cancel"></i></button>
        <div class="zod-qv__content"></div>
      </section>`;
    document.body.appendChild(modal);

    const close = () => {
      modal.classList.remove('is-open');
      document.body.classList.remove('zod-qv-open');
      setTimeout(() => { modal.hidden = true; }, 180);
    };
    modal.querySelectorAll('[data-zod-qv-close]').forEach(el => el.addEventListener('click', close));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !modal.hidden) close();
    });
    modal.__zodClose = close;
    return modal;
  }


  unwrapProductDetails(response, fallback) {
    const candidates = [
      response?.data?.data?.product, response?.data?.product, response?.product,
      response?.data?.data, response?.data, response
    ];
    const full = candidates.find(value => value && typeof value === 'object' && (value.id || value.name));
    if (!full) return fallback;

    const merged = { ...fallback, ...full };
    const fallbackIsAvailable = fallback?.is_available === true || fallback?.unlimited_quantity === true;
    if (fallbackIsAvailable && fallback?.is_out_of_stock !== true) {
      merged.is_available = true;
      merged.is_out_of_stock = false;
      merged.unlimited_quantity = fallback?.unlimited_quantity === true || full?.unlimited_quantity === true;
      if (this.isOutOfStock(full)) merged.status = fallback.status || 'sale';
    }
    return merged;
  }

  async openQuickView(product = this.product) {
    const modal = this.ensureQuickView();
    const content = modal.querySelector('.zod-qv__content');
    modal.hidden = false;
    content.innerHTML = `<div class="zod-qv__loading" role="status"><span class="zod-qv__spinner"></span><span>${this.esc(this.isArabic() ? 'جارٍ تحميل المنتج…' : 'Loading product…')}</span></div>`;
    requestAnimationFrame(() => {
      modal.classList.add('is-open');
      document.body.classList.add('zod-qv-open');
    });

    let details = product;
    try {
      if (typeof salla.product?.getDetails === 'function') {
        const response = await salla.product.getDetails(String(product.id));
        details = this.unwrapProductDetails(response, product);
      }
    } catch (_) {}
    if (modal.hidden) return;

    const image = this.imageUrl(details?.image) || details.thumbnail || this.imageUrl(product?.image) || product.thumbnail || '';
    const category = this.getCategory(details) || this.getCategory(product);
    const isOut = this.isOutOfStock(details);
    const stockLabel = isOut ? this.t('pages.products.out_of_stock', this.isArabic() ? 'نفدت الكمية' : 'Out of stock') : (this.isArabic() ? 'متوفر' : 'In stock');
    const addLabel = details.add_to_cart_label || this.t(details.type === 'booking' ? 'pages.cart.book_now' : 'pages.cart.add_to_cart', this.isArabic() ? 'أضف إلى السلة' : 'Add to cart');
    const detailsLabel = this.isArabic() ? 'عرض التفاصيل كاملة' : 'View full details';
    const optionLabel = this.isArabic() ? 'اختر الخيارات من صفحة المنتج' : 'Choose options on the product page';
    const description = this.stripHtml(details.short_description || details.subtitle || details.description || '').slice(0, 220);
    const status = isOut && window.notify_when_available_in_card !== false && !['donating', 'financial_support'].includes(details.type) ? 'out-and-notify' : details.status;
    const hasOptions = Boolean(details.has_options || (Array.isArray(details.options) && details.options.length));
    const quickBuy = details.can_quick_buy && !hasOptions && !isOut ? ' quick-buy' : '';

    content.innerHTML = `
      <div class="zod-qv__media"><img src="${this.esc(image)}" alt="${this.esc(details.name || '')}"></div>
      <div class="zod-qv__info">
        ${category ? `<span class="zod-qv__category">${this.esc(category.name)}</span>` : ''}
        <h2 id="zod-qv-title">${this.esc(details.name || '')}</h2>
        <div class="zod-qv__price">${this.price(details)}</div>
        ${details.is_taxable ? `<small class="zod-qv__tax">${this.esc(this.t('pages.products.tax_included', this.isArabic() ? 'شامل ضريبة القيمة المضافة' : 'VAT included'))}</small>` : ''}
        <div class="zod-qv__stock ${isOut ? 'is-out' : 'is-in'}"><i></i>${this.esc(stockLabel)}</div>
        ${description ? `<p>${this.esc(description)}</p>` : ''}
        ${hasOptions ? `<div class="zod-qv__options-note"><i class="sicon-list"></i>${this.esc(optionLabel)}</div>` : `
        <div class="zod-qv__purchase">
          ${!details.is_hidden_quantity && details.type !== 'booking' ? `<salla-quantity-input value="1" name="quantity" max="${this.esc(details.max_quantity || '')}"></salla-quantity-input>` : '<input type="hidden" name="quantity" value="1">'}
          <salla-add-product-button${quickBuy} width="wide" fill="outline" product-id="${this.esc(details.id)}" product-status="${this.esc(status || '')}" product-type="${this.esc(details.type || 'product')}">${this.esc(addLabel)}</salla-add-product-button>
        </div>`}
        <a class="zod-qv__details" href="${this.esc(details.url || product.url || '#')}">${this.esc(detailsLabel)} <i class="sicon-arrow-left"></i></a>
      </div>`;
    modal.querySelector('.zod-qv__close')?.focus({ preventScroll: true });
  }

  render() {
    const p = this.product;
    const image = this.imageUrl(p?.image) || p.thumbnail || '';
    const imageAlt = this.esc(p?.image?.alt || p.name || '');
    const isOut = this.isOutOfStock(p);
    const status = (isOut && window.notify_when_available_in_card !== false && !['donating', 'financial_support'].includes(p.type)) ? 'out-and-notify' : p.status;
    const addLabel = p.add_to_cart_label || this.t(p.type === 'booking' ? 'pages.cart.book_now' : 'pages.cart.add_to_cart', this.isArabic() ? 'أضف إلى السلة' : 'Add to cart');
    const outLabel = this.t('pages.products.out_of_stock', this.isArabic() ? 'نفدت الكمية' : 'Out of stock');
    const wishlistLabel = this.esc(this.t('zod.header.wishlist', this.isArabic() ? 'المفضلة' : 'Wishlist'));
    const viewLabel = this.esc(this.isArabic() ? 'عرض سريع' : 'Quick view');
    const category = this.getCategory(p);
    const discount = this.discountPercent();
    const inWishlist = this.initialWishlistState(p);
    const promo = p.promotion_title || p.promotion?.title || '';
    const taxLabel = p.is_taxable ? this.t('pages.products.tax_included', this.isArabic() ? 'شامل ضريبة القيمة المضافة' : 'VAT included') : '';

    this.classList.add('zod-product-card');
    this.setAttribute('data-product-id', p.id);
    this.innerHTML = `
      <div class="zpc-media ${isOut ? 'is-out' : ''}">
        <a class="zpc-product-link" href="${this.esc(p.url || '#')}" aria-label="${imageAlt}"><img src="${this.esc(image)}" alt="${imageAlt}" loading="lazy"></a>
        ${discount ? `<span class="zpc-discount-badge">${this.esc(discount)}%</span>` : ''}
        ${promo ? `<span class="zpc-offer-badge" title="${this.esc(promo)}">${this.esc(promo)}</span>` : ''}
        ${isOut ? `<span class="zpc-stock-stamp">${this.esc(outLabel)}</span>` : ''}
        <div class="zpc-hover-actions" aria-label="${viewLabel}">
          <button type="button" class="zpc-action zpc-quick-view" aria-label="${viewLabel}" title="${viewLabel}"><i class="sicon-eye"></i></button>
          <button type="button" class="zpc-action zpc-wishlist ${inWishlist ? 'is-active' : ''}" data-id="${p.id}" aria-label="${wishlistLabel}" aria-pressed="${inWishlist ? 'true' : 'false'}"><i class="sicon-heart"></i></button>
        </div>
      </div>
      <div class="zpc-body">
        ${category ? `${category.url ? `<a class="zpc-category" href="${this.esc(category.url)}">${this.esc(category.name)}</a>` : `<span class="zpc-category">${this.esc(category.name)}</span>`}` : ''}
        <h3><a href="${this.esc(p.url || '#')}">${this.esc(p.name)}</a></h3>
        ${taxLabel ? `<p class="zpc-tax">${this.esc(taxLabel)}</p>` : ''}
        ${p.rating?.stars ? `<div class="zpc-meta"><span class="zpc-rating"><i class="sicon-star2"></i>${this.esc(p.rating.stars)}${p.rating.count ? ` <small>(${this.esc(p.rating.count)})</small>` : ''}</span></div>` : ''}
        <div class="zpc-bottom">${this.price()}</div>
        <salla-add-product-button class="zpc-add" width="wide" fill="outline" product-id="${p.id}" product-status="${this.esc(status || '')}" product-type="${this.esc(p.type || 'product')}">${this.esc(isOut ? outLabel : addLabel)}</salla-add-product-button>
      </div>`;

    this.querySelector('.zpc-quick-view')?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      this.openQuickView(p);
    });

    this.querySelector('.zpc-wishlist')?.addEventListener('click', async event => {
      event.preventDefault();
      event.stopPropagation();
      await this.toggleWishlist(event.currentTarget, p.id);
    });
  }
}

if (!customElements.get('custom-salla-product-card')) customElements.define('custom-salla-product-card', ZodProductCard);

// Native Salla cards do not expose Quick View. Keep one shared controller so
// native and custom cards open the exact same live-data modal.
window.zodOpenQuickView = product => {
  const controller = document.createElement('custom-salla-product-card');
  return controller.openQuickView(product || {});
};
