/*
 * Runtime compatibility layer for ZOD marketplace cards.
 * Kept as its own entry so a packaged theme works even when public/app.js was
 * produced by an earlier build. The next production build compiles this file.
 */
(() => {
  const patch = () => {
    const Card = customElements.get('custom-salla-product-card');
    if (!Card || Card.prototype.__zodMarketplaceV1717) return;
    const proto = Card.prototype;
    proto.__zodMarketplaceV1717 = true;

    proto.productUrl = function(product = this.product) {
      const p = product || {};
      const candidates = [p.url, p.urls?.customer, p.customer_url, p.customerUrl, p.permalink, p.link];
      for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate.trim() && candidate !== '#') return candidate.trim();
        if (candidate && typeof candidate === 'object') {
          const value = candidate.url || candidate.href || candidate.customer;
          if (typeof value === 'string' && value.trim() && value !== '#') return value.trim();
        }
      }
      return '';
    };

    proto.resolveProductUrl = async function(product = this.product) {
      const direct = this.productUrl(product);
      if (direct) return direct;
      const id = product?.id;
      if (!id || typeof salla?.product?.getDetails !== 'function') return '';
      window.__zodProductUrlCache = window.__zodProductUrlCache || new Map();
      const cacheKey = String(id);
      if (!window.__zodProductUrlCache.has(cacheKey)) {
        window.__zodProductUrlCache.set(cacheKey, (async () => {
          try {
            const response = await salla.product.getDetails(cacheKey);
            const details = this.unwrapProductDetails?.(response, product)
              || response?.data?.data?.product || response?.data?.product || response?.product
              || response?.data?.data || response?.data || response || product;
            const url = this.productUrl(details);
            if (url) {
              this.product = { ...(this.product || product), ...details };
              this.querySelectorAll?.('[data-zpc-product-link]').forEach(link => link.setAttribute('href', url));
            }
            return url;
          } catch (_) {
            return '';
          }
        })());
      }
      return window.__zodProductUrlCache.get(cacheKey);
    };

    proto.bindProductLink = function(link, product = this.product) {
      if (!link) return;
      link.addEventListener('click', async event => {
        if (this.productUrl(product)) return;
        event.preventDefault();
        event.stopPropagation();
        const resolved = await this.resolveProductUrl(product);
        if (resolved) window.location.assign(resolved);
      });
    };

    proto.normalizedTags = function(product = this.product) {
      const tags = Array.isArray(product?.tags) ? product.tags : [];
      return tags.map(tag => {
        if (typeof tag === 'string') return { name: tag, slug: tag };
        return {
          name: this.localized?.(tag?.name ?? tag?.title ?? tag?.label) || String(tag?.name || tag?.title || tag?.label || ''),
          slug: String(tag?.slug ?? tag?.key ?? tag?.name ?? '').trim()
        };
      }).filter(tag => tag.name || tag.slug);
    };

    proto.bestSellerTag = function(product = this.product) {
      if (window.zodSettings?.showTags === false) return null;
      const normalize = value => String(value || '')
        .toLowerCase().normalize('NFKD').replace(/[\u064b-\u065f\u0670]/g, '')
        .replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
      const patterns = [
        'best seller', 'best sellers', 'bestseller', 'top seller', 'top selling',
        'الأكثر مبيعا', 'الاكثر مبيعا', 'أفضل المنتجات', 'افضل المنتجات', 'الأكثر طلبا', 'الاكثر طلبا'
      ].map(normalize);
      return this.normalizedTags(product).find(tag => {
        const haystack = `${normalize(tag.name)} ${normalize(tag.slug)}`;
        return patterns.some(pattern => haystack.includes(pattern));
      }) || null;
    };

    proto.ratingValues = function(product = this.product) {
      const rating = product?.rating || {};
      const stars = this.number?.(rating.stars ?? rating.rate ?? rating.average ?? rating.value) || 0;
      const count = Math.max(0, Math.round(this.number?.(rating.count ?? rating.reviews ?? rating.total) || 0));
      return { stars, count };
    };

    proto.price = function(product = this.product, options = {}) {
      const { current, original, onSale } = this.priceValues(product);
      const discount = this.discountPercent(product);
      if (onSale) {
        const discountLabel = this.isArabic() ? `خصم ${discount}%` : `${discount}% OFF`;
        const showDiscountLabel = discount > 0 && !options.hideDiscountLabel;
        return `<div class="zpc-price is-sale"><strong>${this.money(current)}</strong><del>${this.money(original)}</del>${showDiscountLabel ? `<span class="zpc-price-discount">${this.esc(discountLabel)}</span>` : ''}</div>`;
      }
      if (this.number(product?.starting_price) > 0) {
        return `<div class="zpc-price"><small>${this.t('pages.products.starting_price', this.isArabic() ? 'يبدأ من' : 'From')}</small><strong>${this.money(product.starting_price)}</strong></div>`;
      }
      return `<div class="zpc-price"><strong>${this.money(current)}</strong></div>`;
    };

    proto.promotionRepeatsDiscount = function(product = this.product, promotion = '') {
      const discount = this.discountPercent(product);
      if (!discount || !promotion) return false;
      const normalized = String(promotion).replace(/\s+/g, ' ').trim();
      return new RegExp(`(^|[^0-9])${discount}\\s*%(?:[^0-9]|$)`).test(normalized);
    };

    proto.render = function() {
      const p = this.product || {};
      if (!p.id) return;
      this.mediaImages = this.productImages(p);
      const image = this.mediaImages[0] || '';
      const imageAlt = this.esc(p?.image?.alt || p.name || '');
      const isOut = this.isOutOfStock(p);
      const status = isOut ? (window.notify_when_available_in_card !== false && !['donating', 'financial_support'].includes(p.type) ? 'out-and-notify' : 'out') : p.status;
      const addLabel = p.add_to_cart_label || this.t(p.type === 'booking' ? 'pages.cart.book_now' : 'pages.cart.add_to_cart', this.isArabic() ? 'أضف إلى السلة' : 'Add to cart');
      const outLabel = this.t('pages.products.out_of_stock', this.isArabic() ? 'نفدت الكمية' : 'Out of stock');
      const wishlistLabel = this.esc(this.t('zod.header.wishlist', this.isArabic() ? 'المفضلة' : 'Wishlist'));
      const inWishlist = this.initialWishlistState(p);
      const promo = this.templateText(p.promotion_title ?? p.promotional_title ?? p.promo_title ?? p.promotion?.title, p);
      const promoRepeatsDiscount = this.promotionRepeatsDiscount(p, promo);
      const bestSeller = this.bestSellerTag(p);
      const bestSellerLabel = this.t('zod.product.best_seller', this.isArabic() ? 'أفضل المنتجات' : 'Best Seller');
      const { stars, count } = this.ratingValues(p);
      const productUrl = this.productUrl(p);
      const optionCount = Array.isArray(p.options) ? p.options.length : 0;
      const hasOptions = Boolean(p.has_options || optionCount);
      const needsProductForm = Boolean(hasOptions || p.can_add_note || p.can_upload_file || p.has_custom_form || p.has_bundle_products);
      const chooseOptionsLabel = this.t('zod.product.choose_options_card', this.isArabic() ? 'اختر الخيارات' : 'Choose options');
      const linkHref = productUrl || '#';

      this.classList.add('zod-product-card', 'zod-product-card--marketplace');
      this.setAttribute('data-product-id', p.id);
      this.innerHTML = `
        <div class="zpc-media ${isOut ? 'is-out' : ''}">
          <a class="zpc-product-link" data-zpc-product-link href="${this.esc(linkHref)}" aria-label="${imageAlt}"><img src="${this.esc(image)}" alt="${imageAlt}" loading="lazy" data-zpc-image data-index="0"></a>
          ${bestSeller ? `<span class="zpc-bestseller-badge">${this.esc(bestSellerLabel)}</span>` : ''}
          ${isOut ? `<span class="zpc-stock-stamp">${this.esc(outLabel)}</span>` : ''}
          <button type="button" class="zpc-action zpc-wishlist ${inWishlist ? 'is-active' : ''}" data-id="${p.id}" aria-label="${wishlistLabel}" aria-pressed="${inWishlist ? 'true' : 'false'}"><i class="sicon-heart"></i></button>
          ${!isOut ? (needsProductForm
            ? `<a class="zpc-media-add zpc-media-add--options" data-zpc-product-link href="${this.esc(linkHref)}" aria-label="${this.esc(hasOptions ? chooseOptionsLabel : (this.isArabic() ? 'عرض المنتج' : 'View product'))}"><span aria-hidden="true">+</span></a>`
            : `<salla-add-product-button class="zpc-media-add" fill="outline" product-id="${p.id}" product-status="${this.esc(status || '')}" product-type="${this.esc(p.type || 'product')}"${p.is_require_shipping ? ' required-shipping' : ''}${p.has_preorder_campaign ? ' has-pre-order' : ''}${p.base_currency_price != null ? ` amount="${this.esc(p.base_currency_price)}"` : ''} aria-label="${this.esc(addLabel)}"><span aria-hidden="true">+</span></salla-add-product-button>`)
            : ''}
        </div>
        ${promo ? `<div class="zpc-deal-strip" title="${this.esc(promo)}"><span aria-hidden="true">◆</span><b>${this.esc(promo)}</b></div>` : ''}
        <div class="zpc-body">
          <h3><a data-zpc-product-link href="${this.esc(linkHref)}">${this.esc(p.name || '')}</a></h3>
          <div class="zpc-meta">${stars > 0 || count > 0 ? `<span class="zpc-rating"><i class="sicon-star2"></i>${stars > 0 ? this.esc(stars.toFixed(stars % 1 ? 1 : 0)) : ''}${count ? ` <small>(${this.esc(count)})</small>` : ''}</span>` : ''}</div>
          <div class="zpc-bottom">${this.price(p, { hideDiscountLabel: promoRepeatsDiscount })}</div>
        </div>`;

      this.querySelector('.zpc-wishlist')?.addEventListener('click', async event => {
        event.preventDefault();
        event.stopPropagation();
        await this.toggleWishlist(event.currentTarget, p.id);
      });
      this.querySelectorAll('[data-zpc-product-link]').forEach(link => this.bindProductLink(link, p));
      if (!productUrl) this.resolveProductUrl(p);

      if (!this.dataset.zpcBlankNavigationBound) {
        this.dataset.zpcBlankNavigationBound = '1';
        this.addEventListener('click', async event => {
          if (event.defaultPrevented || event.target.closest('a,button,input,select,textarea,salla-add-product-button,salla-button')) return;
          const url = this.productUrl(this.product) || await this.resolveProductUrl(this.product);
          if (url) window.location.assign(url);
        });
      }
    };

    document.querySelectorAll('custom-salla-product-card').forEach(card => {
      try { card.render(); } catch (_) {}
    });
  };

  if (customElements.get('custom-salla-product-card')) patch();
  else customElements.whenDefined('custom-salla-product-card').then(patch).catch(() => {});
})();
