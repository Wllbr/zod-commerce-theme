/* ZOD 1.8.0 — backward-compatible full-width-purchase product card.
 * This patches the shared custom card after app.js defines it, so we can keep
 * all newer product-page/Twilight fixes while returning the storefront card UI
 * to the older Eye + Heart + full-width purchase layout.
 */
(() => {
  const CARD_TAG = 'custom-salla-product-card';

  const patch = () => {
    const Card = customElements.get(CARD_TAG);
    if (!Card || Card.prototype.__zodLegacyCardV1723) return;
    Card.prototype.__zodLegacyCardV1723 = true;

    Card.prototype.cardUrl = function(product = this.product) {
      const p = product || {};
      return p.url || p.urls?.customer || p.urls?.product || p.permalink || p.link || '';
    };

    Card.prototype.render = function() {
      const p = this.product || {};
      if (!p.id) return;

      try { this.stopMediaCycle?.(false); } catch (_) {}

      const url = this.cardUrl(p);
      const image = this.imageUrl?.(p.image) || p.thumbnail || this.productImages?.(p)?.[0] || window.salla?.url?.asset?.('images/placeholder.svg') || '';
      const imageAlt = this.esc?.(p?.image?.alt || p.name || '') || '';
      const isOut = this.isOutOfStock?.(p) ?? false;
      const status = isOut
        ? (window.notify_when_available_in_card !== false && !['donating', 'financial_support'].includes(p.type) ? 'out-and-notify' : 'out')
        : p.status;
      const addLabel = p.add_to_cart_label || this.t?.(
        p.type === 'booking' ? 'pages.cart.book_now' : 'pages.cart.add_to_cart',
        this.isArabic?.() ? 'أضف إلى السلة' : 'Add to cart'
      ) || (this.isArabic?.() ? 'أضف إلى السلة' : 'Add to cart');
      const outLabel = this.t?.('pages.products.out_of_stock', this.isArabic?.() ? 'نفدت الكمية' : 'Out of stock') || (this.isArabic?.() ? 'نفدت الكمية' : 'Out of stock');
      const wishlistLabel = this.esc?.(this.t?.('zod.header.wishlist', this.isArabic?.() ? 'المفضلة' : 'Wishlist') || 'Wishlist') || 'Wishlist';
      const quickViewLabel = this.esc?.(this.isArabic?.() ? 'عرض سريع' : 'Quick view') || 'Quick view';
      const category = this.getCategory?.(p);
      const inWishlist = this.initialWishlistState?.(p) || false;
      const promo = this.templateText?.(p.promotion_title ?? p.promotional_title ?? p.promo_title ?? p.promotion?.title, p) || '';
      const subtitle = this.templateText?.(p.subtitle ?? p.sub_title ?? p.promotional_subtitle ?? p.promotion_sub_title ?? p.promotion?.sub_title, p) || '';
      const taxLabel = p.is_taxable === false ? '' : (this.t?.('pages.products.tax_included', this.isArabic?.() ? 'شامل ضريبة القيمة المضافة' : 'VAT included') || '');
      const optionCount = Array.isArray(p.options) ? p.options.length : 0;
      const hasOptions = Boolean(p.has_options || optionCount);
      const needsProductForm = Boolean(hasOptions || p.can_add_note || p.can_upload_file || p.has_custom_form || p.has_bundle_products);
      const chooseOptionsLabel = this.t?.('zod.product.choose_options_card', this.isArabic?.() ? 'اختر الخيارات' : 'Choose options') || (this.isArabic?.() ? 'اختر الخيارات' : 'Choose options');
      const discount = this.priceValues?.(p)?.onSale ? (this.discountPercent?.(p) || 0) : 0;

      const values = this.priceValues?.(p) || { current: 0, original: 0, onSale: false };
      let priceHtml = '';
      if (values.onSale) {
        priceHtml = `<div class="zpc-price is-sale"><strong>${this.money?.(values.current) ?? values.current}</strong><del>${this.money?.(values.original) ?? values.original}</del></div>`;
      } else {
        priceHtml = this.price?.(p) || '';
      }

      this.classList.add('zod-product-card', 'zod-product-card--legacy');
      this.classList.remove('zod-product-card--marketplace');
      this.removeAttribute('data-zpc-dir');
      this.setAttribute('data-product-id', String(p.id));

      this.innerHTML = `
        <div class="zpc-media ${isOut ? 'is-out' : ''}">
          <a class="zpc-product-link" href="${this.esc?.(url || '#') || '#'}" aria-label="${imageAlt}">
            <img src="${this.esc?.(image) || ''}" alt="${imageAlt}" loading="lazy" decoding="async" width="400" height="400">
          </a>
          ${discount ? `<span class="zpc-discount-badge" title="${discount}%">${discount}%</span>` : ''}
          ${promo ? `<span class="zpc-offer-badge" title="${this.esc?.(promo) || promo}">${this.esc?.(promo) || promo}</span>` : ''}
          ${isOut ? `<span class="zpc-stock-stamp">${this.esc?.(outLabel) || outLabel}</span>` : ''}
          <div class="zpc-hover-actions" aria-label="${this.isArabic?.() ? 'إجراءات المنتج' : 'Product actions'}">
            <button type="button" class="zpc-action zpc-quick-view" aria-label="${quickViewLabel}"><i class="sicon-eye"></i></button>
            <button type="button" class="zpc-action zpc-wishlist ${inWishlist ? 'is-active' : ''}" data-id="${this.esc?.(p.id) || p.id}" aria-label="${wishlistLabel}" aria-pressed="${inWishlist ? 'true' : 'false'}"><svg class="zpc-heart-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/></svg></button>
          </div>
        </div>
        <div class="zpc-body">
          ${category ? (category.url
            ? `<a class="zpc-category" href="${this.esc?.(category.url) || category.url}">${this.esc?.(category.name) || category.name}</a>`
            : `<span class="zpc-category">${this.esc?.(category.name) || category.name}</span>`) : ''}
          <h3><a href="${this.esc?.(url || '#') || '#'}">${this.esc?.(p.name) || p.name || ''}</a></h3>
          ${subtitle ? `<p class="zpc-subtitle">${this.esc?.(subtitle) || subtitle}</p>` : ''}
          ${p.rating?.stars ? `<div class="zpc-meta"><span class="zpc-rating"><i class="sicon-star2"></i>${this.esc?.(p.rating.stars) || p.rating.stars}${p.rating.count ? ` <small>(${this.esc?.(p.rating.count) || p.rating.count})</small>` : ''}</span></div>` : '<div class="zpc-meta"></div>'}
          <div class="zpc-bottom">${priceHtml}</div>
          ${taxLabel ? `<p class="zpc-tax">${this.esc?.(taxLabel) || taxLabel}</p>` : ''}
          ${needsProductForm
            ? `<a class="zpc-add zpc-add--options" href="${this.esc?.(url || '#') || '#'}"><span>${this.esc?.(hasOptions ? chooseOptionsLabel : (this.isArabic?.() ? 'عرض المنتج' : 'View product')) || chooseOptionsLabel}</span></a>`
            : `<salla-add-product-button class="zpc-add" fill="outline" width="wide" product-id="${this.esc?.(p.id) || p.id}" product-status="${this.esc?.(status || '') || ''}" product-type="${this.esc?.(p.type || 'product') || 'product'}"${p.is_require_shipping ? ' required-shipping' : ''}${p.has_preorder_campaign ? ' has-pre-order' : ''}${p.base_currency_price != null ? ` amount="${this.esc?.(p.base_currency_price) || p.base_currency_price}"` : ''}>${this.esc?.(isOut ? outLabel : addLabel) || (isOut ? outLabel : addLabel)}</salla-add-product-button>`}
        </div>`;

      this.querySelector('.zpc-quick-view')?.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        this.openQuickView?.(p);
      });

      this.querySelector('.zpc-wishlist')?.addEventListener('click', async event => {
        event.preventDefault();
        event.stopPropagation();
        await this.toggleWishlist?.(event.currentTarget, p.id);
      });

      this.dispatchEvent(new CustomEvent('zod:product-data', { bubbles: true, detail: p }));

      this.onclick = event => {
        if (!url || event.defaultPrevented || event.target.closest('a,button,input,select,textarea,salla-add-product-button,salla-button')) return;
        window.location.assign(url);
      };
    };

    // Re-render cards that may have upgraded before this patch executed.
    document.querySelectorAll(CARD_TAG).forEach(card => {
      try { if (card.product?.id) card.render(); } catch (_) {}
    });
  };

  if (customElements.get(CARD_TAG)) patch();
  else customElements.whenDefined(CARD_TAG).then(patch).catch(() => {});
})();
