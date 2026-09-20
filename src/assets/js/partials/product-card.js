import { isOutOfStock, mergeProductDetails } from './stock';
import { containDialogFocus } from './dialog-focus';

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

  localized(value) {
    if (value === undefined || value === null) return '';
    if (typeof value !== 'object') return String(value).trim();
    const language = this.isArabic() ? 'ar' : 'en';
    return String(value[language] ?? value.value ?? value.name ?? value.title ?? '').trim();
  }

  imageUrl(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value.url || value.original || value.medium || value.small || value.thumbnail || '';
    }
    return '';
  }

  productImages(product = this.product) {
    // Salla often repeats the primary image in both `image`/`thumbnail` and
    // `images`. Prefer the gallery when it exists so hover never starts with
    // the same image twice.
    const gallery = Array.isArray(product?.images) && product.images.length
      ? product.images
      : [product?.image, product?.thumbnail, ...(Array.isArray(product?.gallery) ? product.gallery : []), ...(Array.isArray(product?.media) ? product.media : [])];
    const seen = new Set();
    return gallery.map(item => this.imageUrl(item?.image || item)).filter(url => {
      if (!url) return false;
      const key = url.split('?')[0].replace(/-(?:small|medium|large|thumbnail)(?=\.[a-z]+$)/i, '');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  setMediaIndex(index, animate = true) {
    const image = this.querySelector('[data-zpc-image]');
    if (!image || !this.mediaImages?.length) return;
    const next = ((index % this.mediaImages.length) + this.mediaImages.length) % this.mediaImages.length;
    const apply = () => {
      image.src = this.mediaImages[next];
      image.dataset.index = String(next);
      this.querySelectorAll('[data-zpc-dot]').forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === next);
        dot.setAttribute('aria-current', dotIndex === next ? 'true' : 'false');
      });
      image.classList.remove('is-changing');
    };
    if (animate && image.src && image.src !== this.mediaImages[next]) {
      image.classList.add('is-changing');
      window.clearTimeout(this.mediaTransitionTimer);
      this.mediaTransitionTimer = window.setTimeout(apply, 130);
    } else apply();
  }

  renderMediaDots() {
    const dots = this.querySelector('[data-zpc-dots]');
    if (!dots) return;
    if ((this.mediaImages?.length || 0) < 2) {
      dots.hidden = true;
      dots.innerHTML = '';
      return;
    }
    dots.hidden = false;
    dots.innerHTML = this.mediaImages.map((_, index) => `<button type="button" data-zpc-dot="${index}" class="${index === 0 ? 'is-active' : ''}" aria-current="${index === 0 ? 'true' : 'false'}" aria-label="${this.esc(this.isArabic() ? `الصورة ${index + 1}` : `Image ${index + 1}`)}"></button>`).join('');
    dots.querySelectorAll('[data-zpc-dot]').forEach(dot => dot.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      this.stopMediaCycle(false);
      this.setMediaIndex(Number(event.currentTarget.dataset.zpcDot));
    }));
  }

  startMediaCycle() {
    // Listing payload only: NEVER hydrate cards with getDetails on hover/focus.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    if (this.mediaImages.length < 2 || this.mediaTimer) return;
    let index = Number(this.querySelector('[data-zpc-image]')?.dataset.index || 0);
    this.mediaTimer = window.setInterval(() => {
      if (document.hidden) return;
      index = (index + 1) % this.mediaImages.length;
      this.setMediaIndex(index);
    }, 1800);
  }

  stopMediaCycle(reset = true) {
    if (this.mediaTimer) window.clearInterval(this.mediaTimer);
    this.mediaTimer = 0;
    if (reset) this.setMediaIndex(0);
  }

  disconnectedCallback() {
    this.stopMediaCycle(false);
    window.clearTimeout(this.mediaTransitionTimer);
  }

  getCategory(product = this.product) {
    const raw = product?.category || product?.main_category || product?.categories?.[0] || null;
    if (!raw) return null;
    if (typeof raw === 'string') return { name: raw, url: '' };
    const name = raw.name || raw.title || raw.label || '';
    if (!name) return null;
    return { name, url: raw.url || raw.link || '' };
  }

  getBrand(product = this.product) {
    const raw = product?.brand || product?.brand_info || product?.manufacturer || null;
    if (!raw) {
      const name = this.localized(product?.brand_name);
      return name ? { name, url: '' } : null;
    }
    if (typeof raw === 'string') return { name: raw, url: '' };
    const name = this.localized(raw.name ?? raw.title ?? raw.label);
    if (!name) return null;
    return { name, url: raw.url || raw.link || '' };
  }

  priceValues(product = this.product) {
    const p = product || {};
    const listed = this.number(p.price);
    const sale = this.number(p.sale_price ?? p.offer_price ?? p.discounted_price);
    const regular = this.number(p.regular_price ?? p.original_price ?? p.old_price ?? p.price_before_discount);
    const original = regular > sale ? regular : (sale > 0 && listed > sale ? listed : regular);
    // Salla applies sale dates before exposing is_on_sale. A scheduled or
    // expired sale_price must not become a live discount on the card.
    const onSale = p.is_on_sale === false ? false : sale > 0 && original > sale;
    return { current: onSale ? sale : (listed || sale || regular), original: onSale ? original : 0, onSale };
  }

  discountPercent(product = this.product) {
    const p = product;
    const raw = p.discount_percentage ?? p.discountPercent ?? p.discount;
    const parsed = this.number(raw);
    if (parsed > 0) return Math.round(parsed);
    const { current, original, onSale } = this.priceValues(p);
    if (onSale) return Math.max(1, Math.round(((original - current) / original) * 100));
    return 0;
  }

  templateText(value, product = this.product) {
    let text = this.localized(value);
    if (!text) return '';
    const { current, original, onSale } = this.priceValues(product);
    const replacements = {
      percent: onSale ? `${this.discountPercent(product)}%` : '',
      discount: onSale ? this.money(original - current) : '',
      brand: this.getBrand(product)?.name || ''
    };
    Object.entries(replacements).forEach(([key, replacement]) => {
      text = text.replace(new RegExp(`\\{${key}\\}`, 'gi'), replacement);
    });
    return text.replace(/\{(?:percent|discount|brand)\}/gi, '').replace(/\s+/g, ' ').trim();
  }

  price(product = this.product) {
    const p = product;
    const { current, original, onSale } = this.priceValues(p);
    const discount = this.discountPercent(p);
    if (onSale) {
      return `<div class="zpc-price is-sale"><strong>${this.money(current)}</strong><del>${this.money(original)}</del>${discount ? `<span class="zpc-price-discount">${this.esc(discount)}%</span>` : ''}</div>`;
    }
    if (this.number(p.starting_price) > 0) {
      return `<div class="zpc-price"><small>${this.t('pages.products.starting_price', this.isArabic() ? 'يبدأ من' : 'From')}</small><strong>${this.money(p.starting_price)}</strong></div>`;
    }
    return `<div class="zpc-price"><strong>${this.money(current)}</strong></div>`;
  }

  isOutOfStock(product = this.product) {
    return isOutOfStock(product);
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
        <button type="button" class="zod-qv__close" data-zod-qv-close aria-label="${this.isArabic() ? 'إغلاق' : 'Close'}"><i class="sicon-cancel"></i></button>
        <div class="zod-qv__content"></div>
      </section>`;
    document.body.appendChild(modal);

    const close = () => {
      modal.__zodRequest = (modal.__zodRequest || 0) + 1;
      modal.classList.remove('is-open');
      document.body.classList.remove('zod-qv-open');
      modal.__zodCloseTimer = setTimeout(() => { modal.hidden = true; }, 180);
      modal.__zodLastFocus?.focus?.({ preventScroll: true });
    };
    modal.querySelectorAll('[data-zod-qv-close]').forEach(el => el.addEventListener('click', close));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !modal.hidden) close();
      if (modal.classList.contains('is-open')) containDialogFocus(event, modal);
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

    return mergeProductDetails(fallback, full);
  }

  async openQuickView(product = this.product) {
    const modal = this.ensureQuickView();
    clearTimeout(modal.__zodCloseTimer);
    const request = modal.__zodRequest = (modal.__zodRequest || 0) + 1;
    if (!modal.contains(document.activeElement)) modal.__zodLastFocus = document.activeElement;
    const content = modal.querySelector('.zod-qv__content');
    modal.hidden = false;
    content.innerHTML = `<div class="zod-qv__loading" role="status"><span class="zod-qv__spinner"></span><span id="zod-qv-title">${this.esc(this.isArabic() ? 'جارٍ تحميل المنتج…' : 'Loading product…')}</span></div>`;
    requestAnimationFrame(() => {
      if (request !== modal.__zodRequest) return;
      modal.classList.add('is-open');
      document.body.classList.add('zod-qv-open');
      modal.querySelector('.zod-qv__close')?.focus({ preventScroll: true });
    });

    let details = product;
    try {
      if (typeof salla.product?.getDetails === 'function') {
        const response = await salla.product.getDetails(String(product.id));
        details = this.unwrapProductDetails(response, product);
      }
    } catch (_) {}
    if (modal.hidden || request !== modal.__zodRequest) return;

    const image = this.imageUrl(details?.image) || details.thumbnail || this.imageUrl(product?.image) || product.thumbnail || '';
    const category = this.getCategory(details) || this.getCategory(product);
    const isOut = this.isOutOfStock(details);
    const stockLabel = isOut ? this.t('pages.products.out_of_stock', this.isArabic() ? 'نفدت الكمية' : 'Out of stock') : (this.isArabic() ? 'متوفر' : 'In stock');
    const addLabel = details.add_to_cart_label || this.t(details.type === 'booking' ? 'pages.cart.book_now' : 'pages.cart.add_to_cart', this.isArabic() ? 'أضف إلى السلة' : 'Add to cart');
    const detailsLabel = this.isArabic() ? 'عرض التفاصيل كاملة' : 'View full details';
    const optionLabel = this.isArabic() ? 'اختر الخيارات من صفحة المنتج' : 'Choose options on the product page';
    const description = this.stripHtml(details.short_description || details.subtitle || details.description || '').slice(0, 220);
    const status = isOut ? (window.notify_when_available_in_card !== false && !['donating', 'financial_support'].includes(details.type) ? 'out-and-notify' : 'out') : details.status;
    const hasOptions = Boolean(details.has_options || (Array.isArray(details.options) && details.options.length));
    const needsProductForm = Boolean(hasOptions || details.can_add_note || details.can_upload_file || details.has_custom_form || details.has_bundle_products);
    const quickBuy = details.can_quick_buy && !needsProductForm && !isOut ? ' quick-buy' : '';

    content.innerHTML = `
      <div class="zod-qv__media"><img src="${this.esc(image)}" alt="${this.esc(details.name || '')}"></div>
      <div class="zod-qv__info">
        ${category ? `<span class="zod-qv__category">${this.esc(category.name)}</span>` : ''}
        <h2 id="zod-qv-title">${this.esc(details.name || '')}</h2>
        <div class="zod-qv__price">${this.price(details)}</div>
        ${details.is_taxable === false ? '' : `<small class="zod-qv__tax">${this.esc(this.t('pages.products.tax_included', this.isArabic() ? 'شامل ضريبة القيمة المضافة' : 'VAT included'))}</small>`}
        <div class="zod-qv__stock ${isOut ? 'is-out' : 'is-in'}"><i></i>${this.esc(stockLabel)}</div>
        ${description ? `<p>${this.esc(description)}</p>` : ''}
        ${needsProductForm ? `<div class="zod-qv__options-note"><i class="sicon-list"></i>${this.esc(hasOptions ? optionLabel : detailsLabel)}</div>` : `
        <div class="zod-qv__purchase">
          ${!details.is_hidden_quantity && details.type !== 'booking' ? `<salla-quantity-input value="1" name="quantity" max="${this.esc(details.max_quantity || '')}"></salla-quantity-input>` : '<input type="hidden" name="quantity" value="1">'}
          <salla-add-product-button${quickBuy}${details.is_require_shipping ? ' required-shipping' : ''}${details.has_preorder_campaign ? ' has-pre-order' : ''} width="wide" fill="outline" product-id="${this.esc(details.id)}" product-status="${this.esc(status || '')}" product-type="${this.esc(details.type || 'product')}"${details.base_currency_price != null ? ` amount="${this.esc(details.base_currency_price)}"` : ''}>${this.esc(addLabel)}</salla-add-product-button>
        </div>`}
        <a class="zod-qv__details" href="${this.esc(details.url || product.url || '#')}">${this.esc(detailsLabel)} <i class="sicon-arrow-left"></i></a>
      </div>`;
    modal.querySelector('.zod-qv__close')?.focus({ preventScroll: true });
  }

  render() {
    this.stopMediaCycle(false);
    window.clearTimeout(this.mediaTransitionTimer);
    const p = this.product;
    this.mediaImages = this.productImages(p);
    const image = this.mediaImages[0] || (window.salla?.url?.asset?.('images/placeholder.svg') || '');
    const imageAlt = this.esc(p?.image?.alt || p.name || '');
    const isOut = this.isOutOfStock(p);
    const status = isOut ? (window.notify_when_available_in_card !== false && !['donating', 'financial_support'].includes(p.type) ? 'out-and-notify' : 'out') : p.status;
    const addLabel = p.add_to_cart_label || this.t(p.type === 'booking' ? 'pages.cart.book_now' : 'pages.cart.add_to_cart', this.isArabic() ? 'أضف إلى السلة' : 'Add to cart');
    const outLabel = this.t('pages.products.out_of_stock', this.isArabic() ? 'نفدت الكمية' : 'Out of stock');
    const wishlistLabel = this.esc(this.t('zod.header.wishlist', this.isArabic() ? 'المفضلة' : 'Wishlist'));
    const category = this.getCategory(p);
    const brand = this.getBrand(p);
    const inWishlist = this.initialWishlistState(p);
    const promo = this.templateText(p.promotion_title ?? p.promotional_title ?? p.promo_title ?? p.promotion?.title, p);
    const subtitle = this.templateText(p.subtitle ?? p.sub_title, p);
    const taxLabel = p.is_taxable === false ? '' : this.t('pages.products.tax_included', this.isArabic() ? 'شامل ضريبة القيمة المضافة' : 'VAT included');
    const optionCount = Array.isArray(p.options) ? p.options.length : 0;
    const hasOptions = Boolean(p.has_options || optionCount);
    const needsProductForm = Boolean(hasOptions || p.can_add_note || p.can_upload_file || p.has_custom_form || p.has_bundle_products);
    const optionsLabel = this.t('zod.product.options_available', this.isArabic() ? 'خيارات متاحة' : 'Options available');
    const chooseOptionsLabel = this.t('zod.product.choose_options_card', this.isArabic() ? 'اختر الخيارات' : 'Choose options');

    this.classList.add('zod-product-card');
    this.setAttribute('data-product-id', p.id);
    this.innerHTML = `
      <div class="zpc-media ${isOut ? 'is-out' : ''}">
        <a class="zpc-product-link" href="${this.esc(p.url || '#')}" aria-label="${imageAlt}"><img src="${this.esc(image)}" alt="${imageAlt}" loading="lazy" data-zpc-image data-index="0"></a>
        ${promo ? `<span class="zpc-offer-badge" title="${this.esc(promo)}">${this.esc(promo)}</span>` : ''}
        ${isOut ? `<span class="zpc-stock-stamp">${this.esc(outLabel)}</span>` : ''}
        <button type="button" class="zpc-action zpc-wishlist ${inWishlist ? 'is-active' : ''}" data-id="${p.id}" aria-label="${wishlistLabel}" aria-pressed="${inWishlist ? 'true' : 'false'}"><i class="sicon-heart"></i></button>
        <div class="zpc-media-dots" data-zpc-dots ${this.mediaImages.length < 2 ? 'hidden' : ''}></div>
        ${!isOut ? (needsProductForm
          ? `<a class="zpc-media-add zpc-media-add--options" href="${this.esc(p.url || '#')}" aria-label="${this.esc(hasOptions ? chooseOptionsLabel : (this.isArabic() ? 'عرض المنتج' : 'View product'))}"><span aria-hidden="true">+</span></a>`
          : `<salla-add-product-button class="zpc-media-add" fill="outline" product-id="${p.id}" product-status="${this.esc(status || '')}" product-type="${this.esc(p.type || 'product')}"${p.is_require_shipping ? ' required-shipping' : ''}${p.has_preorder_campaign ? ' has-pre-order' : ''}${p.base_currency_price != null ? ` amount="${this.esc(p.base_currency_price)}"` : ''} aria-label="${this.esc(addLabel)}"><span aria-hidden="true">+</span></salla-add-product-button>`)
          : ''}
      </div>
      <div class="zpc-body">
        ${category ? `${category.url ? `<a class="zpc-category" href="${this.esc(category.url)}">${this.esc(category.name)}</a>` : `<span class="zpc-category">${this.esc(category.name)}</span>`}` : ''}
        <h3><a href="${this.esc(p.url || '#')}">${this.esc(p.name)}</a></h3>
        ${subtitle ? `<p class="zpc-subtitle">${this.esc(subtitle)}</p>` : ''}
        ${brand ? `${brand.url ? `<a class="zpc-brand" href="${this.esc(brand.url)}">${this.esc(brand.name)}</a>` : `<span class="zpc-brand">${this.esc(brand.name)}</span>`}` : ''}
        ${p.rating?.stars ? `<div class="zpc-meta"><span class="zpc-rating"><i class="sicon-star2"></i>${this.esc(p.rating.stars)}${p.rating.count ? ` <small>(${this.esc(p.rating.count)})</small>` : ''}</span></div>` : ''}
        <div class="zpc-bottom">${this.price()}</div>
        ${taxLabel ? `<p class="zpc-tax">${this.esc(taxLabel)}</p>` : ''}
        ${needsProductForm ? `<a class="zpc-options" href="${this.esc(p.url || '#')}"><i class="sicon-list"></i><span>${this.esc(hasOptions ? optionsLabel : (this.isArabic() ? 'عرض تفاصيل المنتج' : 'View product details'))}</span>${hasOptions && optionCount ? `<b>${this.esc(optionCount)}</b>` : ''}</a>` : ''}
      </div>`;

    this.renderMediaDots();
    const media = this.querySelector('.zpc-media');
    media?.addEventListener('mouseenter', () => this.startMediaCycle());
    media?.addEventListener('mouseleave', () => this.stopMediaCycle());
    media?.addEventListener('focusin', () => this.startMediaCycle());
    media?.addEventListener('focusout', event => {
      if (!media.contains(event.relatedTarget)) this.stopMediaCycle();
    });

    this.querySelector('.zpc-wishlist')?.addEventListener('click', async event => {
      event.preventDefault();
      event.stopPropagation();
      await this.toggleWishlist(event.currentTarget, p.id);
    });

    // One delegated handler even if Salla renders this node again.
    if (!this.cardNavigationBound) {
      this.cardNavigationBound = true;
      this.addEventListener('click', event => {
        if (event.defaultPrevented || event.target.closest('a,button,input,select,textarea,salla-add-product-button,salla-button')) return;
        if (this.product?.url) window.location.assign(this.product.url);
      });
    }
    // Showcase consumers reuse this exact payload; this never fetches anything.
    this.dispatchEvent(new CustomEvent('zod:product-data', { bubbles: true, detail: p }));
  }
}

if (!customElements.get('custom-salla-product-card')) customElements.define('custom-salla-product-card', ZodProductCard);

// Native Salla cards do not expose Quick View. Keep one shared controller so
// native and custom cards open the exact same live-data modal.
window.zodOpenQuickView = product => {
  const controller = document.createElement('custom-salla-product-card');
  return controller.openQuickView(product || {});
};
