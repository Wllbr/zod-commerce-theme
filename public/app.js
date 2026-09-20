/* ZOD 1.8.2: generated from source by scripts/build-offline.mjs */
(()=>{
'use strict';
const modules={
"src/assets/js/app.js":function(module,exports,require){
require("src/assets/js/partials/product-card.js");
const { isOutOfStock, isOutStatus } = require("src/assets/js/partials/stock.js");
const { containDialogFocus } = require("src/assets/js/partials/dialog-focus.js");
const { installPreviewLinkRouting } = require("src/assets/js/partials/preview-links.js");
const { installSearchCardNavigation } = require("src/assets/js/partials/search-card-navigation.js");
class ZodTheme {
  constructor() {
    this.header = document.querySelector('.zod-header');
    // Expose the core controller before optional enhancements initialize. A
    // storefront-specific failure must never leave header controls inert.
    window.zodTheme = this;
    this.init();
  }

  init() {
    document.documentElement.classList.add('zod-js');

    if (this.header?.dataset.sticky === '1') {
      const onScroll = () => this.header.classList.toggle('is-scrolled', window.scrollY > 20);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    document.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (link && link.hash?.length > 1) {
        let id;
        try { id = decodeURIComponent(link.hash.slice(1)); } catch (_) { return; }
        const target = document.getElementById(id);
        if (target) {
          event.preventDefault();
          if (link.classList.contains('zod-skip-link')) target.focus({ preventScroll: true });
          target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        }
      }
    });

    [
      'initAnnouncementBar',
      'initMobileSmartHeader',
      'initPreviewLinkRouting',
      'initSearchCardNavigation',
      'initCartExperience',
      'initLiveShowcasePrices',
      'initProductCardReveal',
      'initNativeStockBadges',
      'initNativeCardActions',
      'initScreenAds',
      'initWhatsAppFloat',
      'initLocationsCarousel',
      'initFooterDisclosures',
      'initDisclosureToggles',
      'initProfileAvatarUpload',
    ].forEach(feature => {
      try {
        this[feature]();
      } catch (error) {
        console.error(`[ZodTheme] ${feature} failed`, error);
      }
    });
    window.salla?.onReady?.().then(() => document.dispatchEvent(new CustomEvent('zod::ready')));
  }

  syncOverlayLock() {
    const drawerOpen = document.getElementById('zod-catalog-drawer')?.classList.contains('is-open');
    document.documentElement.classList.toggle('zod-lock', Boolean(drawerOpen));
  }

  initMobileSmartHeader() {
    if (!this.header) return;

    const media = window.matchMedia('(max-width: 767px)');
    let lastY = Math.max(0, window.scrollY || 0);
    let hidden = false;
    let frame = 0;

    const target = () => this.header.closest('.zod-sticky-chrome') || this.header;

    const apply = () => {
      const node = target();
      node.classList.toggle('zod-mobile-smart-header', media.matches);
      node.classList.toggle('is-mobile-hidden', media.matches && hidden);
    };

    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY || 0);

      if (!media.matches) {
        hidden = false;
        lastY = y;
        apply();
        return;
      }

      const delta = y - lastY;
      if (y <= 12) {
        hidden = false;
      } else if (delta > 5 && y > 72) {
        hidden = true;
      } else if (delta < -1) {
        // A small upward gesture should reveal the header immediately.
        hidden = false;
      }

      lastY = y;
      apply();
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('orientationchange', schedule, { passive: true });
    media.addEventListener?.('change', schedule);
    apply();
    update();
  }

  initPreviewLinkRouting() {
    installPreviewLinkRouting(document, window);
  }

  initSearchCardNavigation() {
    installSearchCardNavigation(document, window);
  }

  initAnnouncementBar() {
    const advertisement = document.querySelector('.app-inner > salla-advertisement');
    if (!advertisement || !this.header || this.header.dataset.sticky !== '1') return;

    const parent = advertisement.parentElement;
    const stickyChrome = document.createElement('div');
    stickyChrome.className = 'zod-sticky-chrome';
    advertisement.classList.add('zod-announcement');
    parent.insertBefore(stickyChrome, advertisement);
    stickyChrome.append(advertisement, this.header);

    const setupTicker = () => {
      const content = advertisement.querySelector('.s-advertisement-content');
      const message = advertisement.querySelector('.s-advertisement-content-main');
      if (!content || !message || content.querySelector('.zod-announcement-track')) return false;

      const track = document.createElement('div');
      track.className = 'zod-announcement-track';
      track.style.setProperty('--zod-announcement-duration', `${Math.min(28, Math.max(14, message.textContent.trim().length * 0.32))}s`);
      content.insertBefore(track, message);
      track.appendChild(message);
      for (let index = 0; index < 5; index += 1) {
        const copy = message.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        copy.querySelectorAll('a, button').forEach(control => control.setAttribute('tabindex', '-1'));
        track.appendChild(copy);
      }
      return true;
    };

    if (!setupTicker()) {
      const hydrationObserver = new MutationObserver(() => {
        if (setupTicker()) hydrationObserver.disconnect();
      });
      hydrationObserver.observe(advertisement, { childList: true, subtree: true });
    }

    advertisement.addEventListener('click', event => {
      if (!event.target.closest('.s-advertisement-action')) return;
      advertisement.classList.add('is-closing');
      window.setTimeout(() => advertisement.classList.add('is-closed'), 320);
    }, true);
  }


  uiText(key, fallback = '') {
    return window.zodSettings?.i18n?.[key] || fallback;
  }

  showCartToast(message = null, variant = 'added') {
    const now = Date.now();
    if (this.lastCartToastAt && now - this.lastCartToastAt < 650) return;
    this.lastCartToastAt = now;
    let toast = document.getElementById('zod-cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'zod-cart-toast';
      toast.className = 'zod-cart-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = '<span class="zod-cart-toast__icon"><i class="sicon-check"></i></span><span data-zod-cart-toast-text></span>';
      document.body.appendChild(toast);
    }
    const fallback = this.uiText('cartAdded', 'Product added to cart');
    const text = message || fallback;
    const textNode = toast.querySelector('[data-zod-cart-toast-text]');
    if (textNode) textNode.textContent = text;
    toast.classList.toggle('is-update', variant === 'updated');
    toast.classList.toggle('is-remove', variant === 'removed');
    const icon = toast.querySelector('.zod-cart-toast__icon i');
    if (icon) icon.className = variant === 'updated' ? 'sicon-refresh' : (variant === 'removed' ? 'sicon-trash' : 'sicon-check');
    toast.classList.remove('is-visible');
    void toast.offsetWidth;
    toast.classList.add('is-visible');
    clearTimeout(this.cartToastTimer);
    this.cartToastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2100);
  }

  moneyNumber(value) {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    if (typeof value === 'string') {
      const n = Number(value.replace(/[^0-9.\-]/g, ''));
      return Number.isFinite(n) ? n : null;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        const n = this.moneyNumber(item);
        if (n !== null) return n;
      }
    } else if (typeof value === 'object') {
      for (const key of ['amount','value','price','amount_with_tax','amount_without_tax']) {
        const n = this.moneyNumber(value?.[key]);
        if (n !== null) return n;
      }
    }
    return null;
  }

  extractProductPrice(payload) {
    const root = payload?.data?.data ?? payload?.data ?? payload ?? {};
    const product = root?.product ?? root;
    const sale = this.moneyNumber(product?.sale_price ?? product?.salePrice);
    const base = this.moneyNumber(product?.price ?? product?.current_price ?? root?.price) ?? this.moneyNumber(product);
    const regular = this.moneyNumber(product?.regular_price ?? product?.regularPrice ?? product?.original_price);
    const current = product.is_on_sale !== false && sale !== null && sale > 0 ? sale : base;
    return {
      current,
      regular: product.is_on_sale !== false && regular !== null && current !== null && regular > current ? regular : null
    };
  }

  applyLivePrice(node, priceData) {
    if (!node || !priceData?.current || priceData.current <= 0) return false;
    const current = node.querySelector('[data-zod-price-current]');
    const regular = node.querySelector('[data-zod-price-regular]');
    try { current.textContent = salla.money(priceData.current); }
    catch (_) { current.textContent = String(priceData.current); }
    if (regular) {
      if (priceData.regular && priceData.regular > priceData.current) {
        try { regular.textContent = salla.money(priceData.regular); }
        catch (_) { regular.textContent = String(priceData.regular); }
        regular.hidden = false;
      } else {
        regular.hidden = true;
        regular.textContent = '';
      }
    }
    node.hidden = false;
    return true;
  }

  initLiveShowcasePrices() {
    document.querySelectorAll('[data-zod-live-price][data-product-id]').forEach(node => {
      node.hidden = node.dataset.priceReady !== '1';
    });
    // Reuse already loaded native list payloads; do not request extra product data.
    document.addEventListener('zod:product-data', event => {
      const product = event.detail;
      if (!product?.id) return;
      document.querySelectorAll('[data-zod-live-price][data-product-id]').forEach(node => {
        if (String(node.dataset.productId) === String(product.id)) {
          this.applyLivePrice(node, this.extractProductPrice(product));
        }
      });
    });
  }

  initProductCardReveal() {
    const selector = 'custom-salla-product-card, .s-product-card-entry';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const seen = new WeakSet();
    const pending = new Set();
    let revealObserver = null;

    const show = card => {
      if (!card?.isConnected) return;
      pending.delete(card);
      revealObserver?.unobserve(card);
      if (reducedMotion.matches) return;

      card.classList.add('is-visible');
      let cleanupTimer = null;
      const onAnimationEnd = event => {
        if (event.target === card && event.animationName === 'zodProductCardReveal') cleanup();
      };
      const cleanup = () => {
        card.removeEventListener('animationend', onAnimationEnd);
        window.clearTimeout(cleanupTimer);
        card.classList.remove('zod-product-reveal', 'is-visible');
        card.style.removeProperty('--zod-reveal-delay');
      };
      card.addEventListener('animationend', onAnimationEnd);
      cleanupTimer = window.setTimeout(cleanup, 720);
    };

    if ('IntersectionObserver' in window && !reducedMotion.matches) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) show(entry.target); });
      }, { rootMargin: '0px 0px -5% 0px', threshold: 0.08 });
    }

    const registerCards = cards => {
      const columns = window.matchMedia('(max-width: 640px)').matches ? 2 : 4;
      cards.forEach((card, index) => {
        if (seen.has(card)) return;
        seen.add(card);
        if (reducedMotion.matches || !revealObserver) return;
        card.classList.add('zod-product-reveal');
        card.style.setProperty('--zod-reveal-delay', `${(index % columns) * (columns === 2 ? 45 : 50)}ms`);
        pending.add(card);
        revealObserver.observe(card);
      });
    };

    const collectCards = roots => {
      const cards = [];
      roots.forEach(root => {
        if (!(root instanceof Element)) return;
        if (root.matches(selector)) cards.push(root);
        cards.push(...root.querySelectorAll(selector));
      });
      registerCards([...new Set(cards)]);
    };

    collectCards([document.body]);
    let queued = false;
    const addedRoots = new Set();
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
        if (node instanceof Element) addedRoots.add(node);
      }));
      if (queued || !addedRoots.size) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        collectCards([...addedRoots]);
        addedRoots.clear();
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    reducedMotion.addEventListener?.('change', event => {
      if (!event.matches) return;
      pending.forEach(card => {
        revealObserver?.unobserve(card);
        card.classList.remove('zod-product-reveal', 'is-visible');
        card.style.removeProperty('--zod-reveal-delay');
      });
      pending.clear();
    });
  }


  getStoredCartCount() {
    try {
      const summary = salla.storage.get('cart.summery') || salla.storage.get('cart.summary') || {};
      const count = Number(summary?.count ?? 0);
      return Number.isFinite(count) && count > 0 ? count : 0;
    } catch (_) { return 0; }
  }

  extractCartCount(payload, allowStoredFallback = payload == null) {
    const values = [
      payload?.data?.data?.cart?.summary?.count,
      payload?.data?.data?.summary?.count,
      payload?.data?.data?.count,
      payload?.data?.cart?.summary?.count,
      payload?.data?.summary?.count,
      payload?.data?.cart?.count,
      payload?.data?.count,
      payload?.cart?.summary?.count,
      payload?.summary?.count,
      payload?.count
    ];
    for (const value of values) {
      const count = Number(value);
      if (Number.isFinite(count) && count >= 0) return count;
    }

    const lists = [
      payload?.data?.data?.cart?.items,
      payload?.data?.data?.items,
      payload?.data?.cart?.items,
      payload?.data?.items,
      payload?.cart?.items,
      payload?.items,
      Array.isArray(payload?.data?.data) ? payload.data.data : null,
      Array.isArray(payload?.data) ? payload.data : null
    ];
    for (const list of lists) {
      if (!Array.isArray(list)) continue;
      return list.reduce((total, item) => {
        const quantity = Number(item?.quantity ?? 1);
        return total + (Number.isFinite(quantity) && quantity > 0 ? quantity : 1);
      }, 0);
    }
    return allowStoredFallback ? this.getStoredCartCount() : null;
  }

  updateCartBadge(count = this.getStoredCartCount(), animate = false) {
    const badge = document.querySelector('[data-zod-cart-count]');
    const cart = document.querySelector('.zod-cart-link');
    if (!badge || !cart) return;
    const safeCount = Math.max(0, Number(count) || 0);
    badge.textContent = safeCount > 99 ? '99+' : String(safeCount);
    badge.hidden = safeCount === 0;
    cart.classList.toggle('has-items', safeCount > 0);
    if (animate && safeCount > 0) {
      cart.classList.remove('is-bumping');
      void cart.offsetWidth;
      cart.classList.add('is-bumping');
      setTimeout(() => cart.classList.remove('is-bumping'), 650);
    }
  }

  recoverEmptyCartPage(count) {
    const cartPage = document.querySelector('[data-zod-cart-page]');
    if (!cartPage) return;
    const emptyState = document.querySelector('[data-testid="store-cart-empty"]');
    if (!emptyState || count <= 0) {
      try { sessionStorage.removeItem('zod::cart-recovery-attempted'); } catch (_) {}
      return;
    }
    try {
      if (sessionStorage.getItem('zod::cart-recovery-attempted') === '1') return;
      sessionStorage.setItem('zod::cart-recovery-attempted', '1');
      window.setTimeout(() => window.location.reload(), 80);
    } catch (_) {}
  }

  async refreshCartBadge({ recoverCartPage = false, animate = false } = {}) {
    const request = this.cartBadgeRequest = (this.cartBadgeRequest || 0) + 1;
    try {
      const response = await salla.cart.details();
      if (request !== this.cartBadgeRequest) return null;
      const liveCount = this.extractCartCount(response, false);
      if (liveCount === null) throw new Error('Cart count missing from Salla response');
      this.updateCartBadge(liveCount, animate);
      if (recoverCartPage) this.recoverEmptyCartPage(liveCount);
      return liveCount;
    } catch (_) {
      return null;
    }
  }

  animateProductToCart(productId) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = document.querySelector(`custom-salla-product-card[data-product-id="${productId}"]`) || document.querySelector(`[data-zod-interactive-showcase][data-product-id="${productId}"]`);
    const source = card?.querySelector('.zpc-media img, .zod-interactive-showcase__media img');
    const target = document.querySelector('.zod-cart-link');
    if (!source || !target) return;
    const a = source.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    if (!a.width || !b.width) return;
    const flyer = source.cloneNode(true);
    flyer.className = 'zod-fly-to-cart';
    Object.assign(flyer.style, {left:`${a.left}px`, top:`${a.top}px`, width:`${Math.min(a.width,72)}px`, height:`${Math.min(a.height,72)}px`});
    document.body.appendChild(flyer);
    const dx = (b.left + b.width/2) - (a.left + Math.min(a.width,72)/2);
    const dy = (b.top + b.height/2) - (a.top + Math.min(a.height,72)/2);
    const anim = flyer.animate([
      {transform:'translate3d(0,0,0) scale(1)', opacity:.95},
      {transform:`translate3d(${dx*.55}px,${dy*.35-35}px,0) scale(.72)`, opacity:.85, offset:.55},
      {transform:`translate3d(${dx}px,${dy}px,0) scale(.18)`, opacity:.08}
    ], {duration:620,easing:'cubic-bezier(.2,.8,.25,1)'});
    anim.finished.finally(() => flyer.remove());
    card?.classList.add('is-added');
    setTimeout(() => card?.classList.remove('is-added'), 700);
  }

  async deleteCartItem(itemId, selector) {
    const form = selector ? document.querySelector(selector) : null;
    const card = form?.querySelector('[data-zod-cart-item]') || form;
    card?.classList.add('is-removing');
    try {
      const response = await salla.cart.deleteItem(itemId);
      document.dispatchEvent(new CustomEvent('zod:cart-delete-success', { detail: response }));
      card?.classList.remove('is-removing');
      card?.classList.add('is-removed');
      setTimeout(() => form?.remove(), 360);
      const count = this.extractCartCount(response, false);
      if (count !== null) this.updateCartBadge(count, false);
      else this.refreshCartBadge();
      if (count === 0) setTimeout(() => window.location.reload(), 430);
      return response;
    } catch (error) {
      card?.classList.remove('is-removing');
      throw error;
    }
  }

  initCartExperience() {
    const bind = () => {
      // Twilight uses the browser's blocking alert() as its default notifier.
      // Product additions use the required salla-add-product-toast. Its official
      // event metadata suppresses only the duplicate success notice, never errors.
      // Selecting an unavailable variant is an inline product-state change, not a
      // storefront error. Salla may emit stock/service notifier messages while
      // <salla-product-options> resolves that selection; keep those messages silent
      // and let the product price/stock/button UI communicate the unavailable state.
      if (!this.variantNotificationSilencerBound) {
        this.variantNotificationSilencerBound = true;
        const markVariantInteraction = event => {
          const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
          const insideOptions = path.some(node => node?.tagName === 'SALLA-PRODUCT-OPTIONS')
            || event.target?.closest?.('salla-product-options');
          if (insideOptions) this.variantNotificationSilenceUntil = Date.now() + 2500;
        };
        document.addEventListener('pointerdown', markVariantInteraction, true);
        document.addEventListener('click', markVariantInteraction, true);
        document.addEventListener('change', markVariantInteraction, true);
      }

      const shouldSilenceVariantNotification = message => {
        if ((this.variantNotificationSilenceUntil || 0) < Date.now()) return false;
        if (!document.querySelector('salla-product-options')) return false;
        const text = String(message || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
        return /الكمية\s*غير\s*متوفرة|خطأ\s*في\s*خدمة\s*المنتج|quantity[^.]{0,40}(?:unavailable|not available)|(?:out of stock|product service error)/i.test(text);
      };

      salla.notify?.setNotifier?.((message, type, data) => {
        if (window.enable_add_product_toast === true &&
            document.querySelector('salla-add-product-toast')?.dataset.ready === 'true' &&
            data?.data?.googleTags?.event === 'addToCart' && type !== 'error') return;
        if (shouldSilenceVariantNotification(message)) return;
        this.showNotification(message, type);
      });
      // Never paint a cached count as authoritative. The live Salla cart owns the badge.
      this.updateCartBadge(0);
      const cartEvents = salla?.cart?.event;
      cartEvents?.onItemUpdated?.(() => this.refreshCartBadge());
      cartEvents?.onItemAdded?.((response, productId) => {
        this.animateProductToCart(productId);
        const responseCount = this.extractCartCount(response, false);
        if (responseCount !== null) this.updateCartBadge(responseCount, true);
        setTimeout(() => this.refreshCartBadge({ animate: responseCount === null }), 100);
      });
      cartEvents?.onItemDeleted?.((response) => {
        const responseCount = this.extractCartCount(response, false);
        if (responseCount !== null) this.updateCartBadge(responseCount);
        setTimeout(() => this.refreshCartBadge(), 100);
      });
      if (!this.cartDeleteBound) {
        this.cartDeleteBound = true;
        document.addEventListener('click', event => {
          const button = event.target.closest?.('[data-zod-cart-delete-item]');
          if (!button || button.dataset.zodBusy === '1') return;
          const itemId = button.dataset.zodCartDeleteItem;
          if (!itemId) return;
          event.preventDefault();
          button.dataset.zodBusy = '1';
          this.deleteCartItem(itemId, `#item-${CSS.escape(itemId)}`)
            .catch(() => {})
            .finally(() => { delete button.dataset.zodBusy; });
        });
      }
      this.refreshCartBadge({ recoverCartPage: true });
      document.addEventListener('visibilitychange', () => { if (!document.hidden) this.refreshCartBadge(); });
    };
    if (window.salla?.onReady) window.salla.onReady().then(bind).catch(()=>{});
    else document.addEventListener('zod::ready', bind, {once:true});
  }

  showNotification(message, type = 'info') {
    let region = document.getElementById('zod-notifications');
    if (!region) {
      region = document.createElement('div');
      region.id = 'zod-notifications';
      document.body.appendChild(region);
    }
    if (type !== 'error') region.querySelectorAll('.zod-notice:not(.is-error)').forEach(item => item.remove());

    const notice = document.createElement('div');
    notice.className = `zod-notice ${type === 'error' ? 'is-error' : 'is-success'}`;
    notice.setAttribute('role', type === 'error' ? 'alert' : 'status');
    const icon = document.createElement('i');
    icon.className = type === 'error' ? 'sicon-cancel' : 'sicon-check-circle';
    icon.setAttribute('aria-hidden', 'true');
    const copy = document.createElement('span');
    // Notifications may contain markup; show its text without injecting HTML.
    const parsed = new DOMParser().parseFromString(String(message || ''), 'text/html');
    copy.textContent = parsed.body.textContent;
    let removed = false;
    const dismiss = () => {
      if (removed) return;
      removed = true;
      notice.classList.add('is-collapsing');
      notice.addEventListener('animationend', () => notice.remove(), { once: true });
      setTimeout(() => notice.remove(), 650);
    };

    notice.append(icon, copy);
    if (type === 'error') {
      const close = document.createElement('button');
      close.type = 'button';
      close.textContent = '×';
      close.setAttribute('aria-label', document.documentElement.lang.startsWith('ar') ? 'إغلاق' : 'Close');
      close.addEventListener('click', event => {
        event.stopPropagation();
        dismiss();
      });
      notice.append(close);
    } else {
      notice.tabIndex = 0;
      notice.setAttribute('aria-label', `${copy.textContent}. ${document.documentElement.lang.startsWith('ar') ? 'اضغط للإغلاق' : 'Press to dismiss'}`);
      notice.addEventListener('click', dismiss);
      notice.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') dismiss();
      });
    }
    region.appendChild(notice);
    if (type !== 'error') setTimeout(dismiss, 2600);
  }


  initNativeStockBadges() {
    const outAr = 'نفدت الكمية';
    const outEn = 'Out of stock';
    const label = document.documentElement.lang?.toLowerCase().startsWith('ar') ? outAr : outEn;

    const decorate = card => {
      if (!card || card.matches('custom-salla-product-card')) return;
      const p = card.product || card.productData || card.data?.product || {};
      const hasStock = ['is_available', 'is_out_of_stock', 'unlimited_quantity', 'quantity', 'status'].some(key => p[key] != null);
      let isOut = isOutOfStock(p);
      if (!hasStock) isOut = isOutStatus(card.getAttribute('product-status')) || isOutStatus(card.getAttribute('status'));
      const roots = [card, card.shadowRoot].filter(Boolean);
      for (const root of roots) {
        const add = root.querySelector?.('salla-add-product-button,button[disabled],[product-status]');
        const status = add?.getAttribute?.('product-status') || add?.getAttribute?.('status');
        const text = root.textContent || '';
        if (!hasStock && (isOutStatus(status) || /نفدت\s*الكمية|out\s+of\s+stock/i.test(text))) isOut = true;
      }
      card.classList.toggle('zod-native-out-of-stock', isOut);
      if (isOut) card.setAttribute('data-zod-stock-label', label);
      else card.removeAttribute('data-zod-stock-label');
    };

    const scan = () => document.querySelectorAll('salla-product-card').forEach(decorate);
    scan();
    const observer = new MutationObserver(() => requestAnimationFrame(scan));
    observer.observe(document.documentElement, {childList:true, subtree:true, attributes:true, attributeFilter:['product-status','status','disabled']});
    setTimeout(scan, 450);
    setTimeout(scan, 1400);
    setTimeout(scan, 3000);
  }

  initNativeCardActions() {
    const decorate = card => {
      if (!card || card.matches('custom-salla-product-card') || card.dataset.zodNativeActions === '1') return;
      const media = card.querySelector('.s-product-card-image');
      const wishlist = card.querySelector('salla-button.s-product-card-wishlist-btn');
      if (!media || !wishlist) return;

      const actions = document.createElement('div');
      actions.className = 'zod-native-card-actions';
      actions.append(wishlist);
      media.appendChild(actions);
      card.dataset.zodNativeActions = '1';
    };

    const scan = () => document.querySelectorAll('salla-product-card').forEach(decorate);
    scan();
    const observer = new MutationObserver(() => requestAnimationFrame(scan));
    observer.observe(document.documentElement, { childList:true, subtree:true });
    setTimeout(scan, 450);
    setTimeout(scan, 1400);
    setTimeout(scan, 3000);
  }

  initScreenAds() {
    document.querySelectorAll('[data-zod-screen-ad]').forEach(ad => {
      if (ad.dataset.zodReady === '1') return;
      ad.dataset.zodReady = '1';

      const duration = Math.max(1, Number(ad.dataset.zodAdDuration) || 5);
      const delay = Math.max(0, Number(ad.dataset.zodAdDelay) || 0) * 1000;
      const frequency = ad.dataset.zodAdFrequency || 'session';
      const autoClose = ad.dataset.zodAdAutoClose !== '0';
      const backdropClose = ad.dataset.zodAdBackdropClose !== '0';
      const storageKey = `zod-screen-ad:${ad.dataset.zodAdKey || 'home'}`;
      const skip = ad.querySelector('[data-zod-ad-skip]');
      const closeButton = ad.querySelector('[data-zod-ad-close]');
      const backdrop = ad.querySelector('[data-zod-ad-backdrop]');
      const count = ad.querySelector('[data-zod-ad-count]');
      const countWrap = ad.querySelector('[data-zod-ad-count-wrap]');
      const progress = ad.querySelector('[data-zod-ad-progress]');
      let interval = 0;
      let remaining = duration;
      let lastFocus = null;

      const wasSeen = () => {
        try {
          if (frequency === 'visit') return false;
          if (frequency === 'daily') return localStorage.getItem(storageKey) === new Date().toISOString().slice(0, 10);
          return sessionStorage.getItem(storageKey) === '1';
        } catch (_) { return false; }
      };

      const remember = () => {
        try {
          if (frequency === 'daily') localStorage.setItem(storageKey, new Date().toISOString().slice(0, 10));
          else if (frequency !== 'visit') sessionStorage.setItem(storageKey, '1');
        } catch (_) {}
      };

      const updateTimer = () => {
        if (count) count.textContent = String(Math.max(0, remaining));
        if (progress) progress.style.setProperty('--zod-ad-progress', `${Math.max(0, remaining / duration) * 100}%`);
      };

      const hide = () => {
        if (ad.hidden) return;
        window.clearInterval(interval);
        remember();
        ad.classList.remove('is-visible');
        ad.setAttribute('aria-hidden', 'true');
        document.documentElement.classList.remove('zod-screen-ad-open');
        window.setTimeout(() => { ad.hidden = true; }, 220);
        lastFocus?.focus?.();
      };

      const onKeydown = event => {
        if (event.key === 'Escape' && !ad.hidden) hide();
        if (ad.classList.contains('is-visible')) containDialogFocus(event, ad);
      };
      document.addEventListener('keydown', onKeydown);
      skip?.addEventListener('click', hide);
      closeButton?.addEventListener('click', hide);
      if (backdropClose) backdrop?.addEventListener('click', hide);

      if (wasSeen()) return;
      window.setTimeout(() => {
        if (!ad.isConnected || document.hidden) return;
        lastFocus = document.activeElement;
        remaining = duration;
        updateTimer();
        ad.hidden = false;
        ad.setAttribute('aria-hidden', 'false');
        document.documentElement.classList.add('zod-screen-ad-open');
        requestAnimationFrame(() => ad.classList.add('is-visible'));
        skip?.focus?.({ preventScroll: true });
        interval = window.setInterval(() => {
          remaining -= 1;
          updateTimer();
          if (remaining > 0) return;
          window.clearInterval(interval);
          if (countWrap) countWrap.hidden = true;
          if (autoClose) hide();
        }, 1000);
      }, delay);
    });
  }

  initWhatsAppFloat() {
    document.querySelectorAll('[data-zod-whatsapp-float]').forEach(widget => {
      if (widget.dataset.zodReady === '1') return;
      widget.dataset.zodReady = '1';
      const toggle = widget.querySelector('[data-zod-whatsapp-toggle]');
      const options = widget.querySelector('[data-zod-whatsapp-options]');
      if (!toggle || !options) return;

      const close = () => {
        widget.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        window.setTimeout(() => { if (!widget.classList.contains('is-open')) options.hidden = true; }, 180);
      };
      const open = () => {
        options.hidden = false;
        requestAnimationFrame(() => widget.classList.add('is-open'));
        toggle.setAttribute('aria-expanded', 'true');
      };

      toggle.addEventListener('click', event => {
        event.stopPropagation();
        widget.classList.contains('is-open') ? close() : open();
      });
      document.addEventListener('click', event => { if (!widget.contains(event.target)) close(); });
      document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
      widget.querySelectorAll('.zod-whatsapp-float__option').forEach(link => link.addEventListener('click', close));

      requestAnimationFrame(() => widget.classList.add('is-intro'));
      window.setTimeout(() => widget.classList.remove('is-intro'), 1800);
    });
  }

  initLocationsCarousel() {
    document.querySelectorAll('[data-zod-locations-rail]').forEach(rail => {
      if (rail.dataset.zodReady === '1') return;
      rail.dataset.zodReady = '1';
      const cards = [...rail.querySelectorAll('.zod-location-card')];
      const dotsWrap = rail.parentElement?.querySelector('[data-zod-locations-dots]');
      const dots = [...(dotsWrap?.querySelectorAll('[data-zod-location-dot]') || [])];
      if (cards.length < 2 || !dots.length) return;

      const setActive = index => dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === index);
        dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
      });
      const update = () => {
        const railRect = rail.getBoundingClientRect();
        const center = railRect.left + railRect.width / 2;
        let active = 0;
        let distance = Infinity;
        cards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const nextDistance = Math.abs(rect.left + rect.width / 2 - center);
          if (nextDistance < distance) { distance = nextDistance; active = index; }
        });
        setActive(active);
      };
      let frame = 0;
      rail.addEventListener('scroll', () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(update);
      }, { passive: true });
      dots.forEach((dot, index) => dot.addEventListener('click', () => cards[index]?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest', inline: 'center' })));
      setActive(0);
    });
  }

  initProfileAvatarUpload() {
    const uploader = document.querySelector('[data-zod-profile-avatar]');
    if (!uploader) return;

    uploader.addEventListener('uploaded', async event => {
      const avatar = typeof event.detail === 'string' ? event.detail : '';
      if (!avatar || !window.salla?.profile?.update) return;
      uploader.classList.add('is-saving-avatar');
      try {
        await salla.profile.update({ avatar });
        uploader.setAttribute('value', avatar);
      } catch (_) {
        // Salla's native profile endpoint owns the user-facing error state.
      } finally {
        uploader.classList.remove('is-saving-avatar');
      }
    });
  }

  initDisclosureToggles() {
    document.querySelectorAll('.collapse-content').forEach(panel => panel.hidden = true);
    document.addEventListener('click', event => {
      const trigger = event.target.closest('[data-show]');
      if (!trigger) return;
      const id = trigger.getAttribute('data-show');
      if (!id) return;
      const panel = document.getElementById(id);
      if (!panel) return;
      event.preventDefault();
      panel.hidden = !panel.hidden;
      trigger.setAttribute('aria-expanded', String(!panel.hidden));
    });
  }

  initFooterDisclosures() {
    const items = [...document.querySelectorAll('[data-footer-disclosure]')];
    if (!items.length) return;
    const mq = window.matchMedia('(max-width: 640px)');
    const sync = () => items.forEach(item => { item.open = !mq.matches; });
    sync();
    mq.addEventListener?.('change', sync);
  }
}

window.notify_when_available_in_card = window.zodSettings?.notifyWhenAvailable !== false;
window.zodTheme = new ZodTheme();

/* ZOD v1.7.31 — keep Salla's Business Platform certificate with the footer
 * trust certificates and remove it from every payment-method strip (including
 * the product page). */
(() => {
  const initBusinessCertificatePlacement = () => {
    if (typeof document?.querySelector !== 'function') return;
    const certificateHost = document.querySelector('[data-zod-business-certificate]');
    const paymentHosts = [...document.querySelectorAll('salla-payments')];
    if (!paymentHosts.length) return;

    const syncHost = payments => {
      const root = payments.shadowRoot || payments;
      const image = root.querySelector?.('.s-payments-sbc-image');
      if (!image) return false;
      const item = image.closest?.('.s-payments-list-item') || image.parentElement;
      const src = image.getAttribute?.('src') || image.src || '';

      // Only the footer copy is moved into the certificate area. Product-page
      // and other payment strips simply hide the certificate item.
      if (certificateHost && src && payments.closest?.('[data-zod-footer-bottom-payments]')) {
        const current = certificateHost.querySelector('img');
        if (!current || current.getAttribute('src') !== src) {
          certificateHost.innerHTML = '';
          const card = document.createElement('span');
          card.className = 'zod-footer-business-certificate__card';
          const cloned = image.cloneNode(true);
          cloned.removeAttribute('class');
          cloned.alt = document.documentElement.lang?.startsWith('ar') ? 'شهادة منصة الأعمال' : 'Business Platform certificate';
          const label = document.createElement('span');
          label.textContent = cloned.alt;
          card.append(cloned, label);
          certificateHost.appendChild(card);
        }
        certificateHost.hidden = false;
      }
      if (item) {
        item.hidden = true;
        item.setAttribute('aria-hidden', 'true');
        item.style.setProperty('display', 'none', 'important');
      }
      return true;
    };

    customElements.whenDefined('salla-payments').then(() => {
      paymentHosts.forEach(payments => {
        const run = () => syncHost(payments);
        run();
        setTimeout(run, 300);
        setTimeout(run, 900);
        const root = payments.shadowRoot || payments;
        try { new MutationObserver(run).observe(root, { childList:true, subtree:true, attributes:true, attributeFilter:['src','class'] }); } catch (_) {}
      });
    }).catch(() => {});
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initBusinessCertificatePlacement, { once:true });
  else initBusinessCertificatePlacement();
})();


},
"src/assets/js/partials/product-card.js":function(module,exports,require){
const { isOutOfStock, mergeProductDetails } = require("src/assets/js/partials/stock.js");
const { containDialogFocus } = require("src/assets/js/partials/dialog-focus.js");
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


},
"src/assets/js/partials/stock.js":function(module,exports,require){
const isOutStatus = value => ['out', 'out-of-stock', 'out_of_stock', 'sold-out', 'sold_out', 'out-and-notify'].includes(String(value || '').toLowerCase());

function isOutOfStock(product = {}) {
  if (product.is_available === false || product.is_out_of_stock === true) return true;
  if (product.is_available === true || product.unlimited_quantity === true) return false;
  if (isOutStatus(product.status)) return true;
  const quantity = product.quantity == null || product.quantity === '' ? NaN : Number(product.quantity);
  return Number.isFinite(quantity) && quantity <= 0 && !['donating', 'financial_support'].includes(product.type);
}

function mergeProductDetails(fallback, full) {
  const merged = { ...fallback, ...full };
  // Stock fields form one snapshot. Never combine new stock with old availability.
  const keys = ['is_available', 'is_out_of_stock', 'unlimited_quantity', 'status', 'quantity'];
  if (keys.some(key => full[key] !== undefined && full[key] !== null && full[key] !== '')) {
    keys.forEach(key => { delete merged[key]; });
    keys.forEach(key => { if (full[key] != null) merged[key] = full[key]; });
  }
  return merged;
}

exports.isOutStatus = isOutStatus;
exports.isOutOfStock = isOutOfStock;
exports.mergeProductDetails = mergeProductDetails;
},
"src/assets/js/partials/dialog-focus.js":function(module,exports,require){
// Include controls inside Salla's open shadow roots in keyboard order.
function containDialogFocus(event, dialog) {
  if (event.key !== 'Tab') return;
  const controls = [];
  const visit = root => Array.from(root.children || []).forEach(element => {
    if (element.hidden || element.inert || getComputedStyle(element).display === 'none') return;
    if (element.matches('button, a[href], input, select, textarea, [tabindex]') && element.tabIndex >= 0 && !element.disabled && element.getClientRects().length) controls.push(element);
    if (element.shadowRoot) visit(element.shadowRoot);
    visit(element);
  });
  visit(dialog);
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  const index = controls.indexOf(active);
  if (!controls.length) { event.preventDefault(); dialog.focus(); return; }
  if (index < 0 || (event.shiftKey ? index === 0 : index === controls.length - 1)) {
    event.preventDefault();
    controls[event.shiftKey ? controls.length - 1 : 0].focus();
  }
}

exports.containDialogFocus = containDialogFocus;
},
"src/assets/js/partials/preview-links.js":function(module,exports,require){
const PREVIEW_HOST = 'salla.design';
const DEMO_HOST = 'demostore.salla.sa';

const isDraftPath = pathname => pathname
  .split('/')
  .filter(Boolean)
  .some(segment => segment.startsWith('dev-'));

const isThemeEditorFrame = (documentLike, windowLike) => {
  const referrer = String(documentLike?.referrer || '');
  if (/^https:\/\/s\.salla\.sa\/themes\/editor\//i.test(referrer)) return true;
  try {
    return [...(windowLike?.location?.ancestorOrigins || [])]
      .some(origin => /^https:\/\/s\.salla\.sa$/i.test(origin));
  } catch (_) {
    return false;
  }
};

function normalizePreviewStoreUrl(href, locationLike, documentLike = {}, windowLike = {}) {
  if (!href || !locationLike?.href) return href;

  let target;
  try {
    target = new URL(href, locationLike.href);
  } catch (_) {
    return href;
  }

  const currentHost = String(locationLike.hostname || '').toLowerCase();
  const isPreview = currentHost === PREVIEW_HOST || currentHost.endsWith(`.${PREVIEW_HOST}`)
    || isThemeEditorFrame(documentLike, windowLike);
  if (!isPreview || target.hostname.toLowerCase() !== DEMO_HOST || !isDraftPath(target.pathname)) return href;

  target.protocol = 'https:';
  target.host = PREVIEW_HOST;
  if (!target.search && currentHost.includes(PREVIEW_HOST) && locationLike.search) {
    target.search = locationLike.search;
  }
  return target.toString();
}

function installPreviewLinkRouting(documentLike = document, windowLike = window) {
  const locationLike = windowLike.location;
  const route = anchor => {
    if (!anchor?.href) return;
    const routed = normalizePreviewStoreUrl(anchor.href, locationLike, documentLike, windowLike);
    if (routed !== anchor.href) {
      anchor.href = routed;
      anchor.dataset.zodPreviewRouted = '1';
    }
  };
  const scan = root => {
    if (root?.matches?.('a[href]')) route(root);
    root?.querySelectorAll?.('a[href]').forEach(route);
  };

  scan(documentLike);
  documentLike.addEventListener('click', event => route(event.target.closest?.('a[href]')), true);
  const observer = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(scan)));
  observer.observe(documentLike.documentElement, { childList: true, subtree: true });
  return observer;
}

exports.normalizePreviewStoreUrl = normalizePreviewStoreUrl;
exports.installPreviewLinkRouting = installPreviewLinkRouting;
},
"src/assets/js/partials/search-card-navigation.js":function(module,exports,require){
const SEARCH_CARD_SELECTOR = '.s-search-grid-item';
const INTERACTIVE_SELECTOR = 'a,button,input,select,textarea,summary,[role="button"],[role="link"]';

const getSearchCardLink = card => {
  if (!card?.querySelector) return null;
  return card.querySelector('salla-search-product-card a[href], a[href]')
    || card.querySelector('salla-search-product-card')?.shadowRoot?.querySelector('a[href]')
    || null;
};

const shouldOpenSearchCard = (path, card) => !path.some(node =>
  node !== card && node?.matches?.(INTERACTIVE_SELECTOR)
);

function installSearchCardNavigation(root = document, browserWindow = window) {
  const decorate = card => {
    if (!card || card.dataset.zodCardLink === '1') return;
    const link = getSearchCardLink(card);
    if (!link) return;
    card.dataset.zodCardLink = '1';
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    const label = link.getAttribute('aria-label') || link.textContent?.trim();
    if (label) card.setAttribute('aria-label', label);
  };

  const scan = scope => {
    if (scope?.matches?.(SEARCH_CARD_SELECTOR)) decorate(scope);
    decorate(scope?.closest?.(SEARCH_CARD_SELECTOR));
    scope?.querySelectorAll?.(SEARCH_CARD_SELECTOR).forEach(decorate);
  };

  root.addEventListener('click', event => {
    const path = event.composedPath?.() || [];
    const card = path.find(node => node?.matches?.(SEARCH_CARD_SELECTOR))
      || event.target?.closest?.(SEARCH_CARD_SELECTOR);
    if (!card || !shouldOpenSearchCard(path, card)) return;
    const link = getSearchCardLink(card);
    if (!link?.href) return;
    browserWindow.location.assign(link.href);
  });

  root.addEventListener('keydown', event => {
    if (!['Enter', ' '].includes(event.key)) return;
    const card = event.target?.closest?.(SEARCH_CARD_SELECTOR);
    if (!card || event.target !== card) return;
    const link = getSearchCardLink(card);
    if (!link?.href) return;
    event.preventDefault();
    browserWindow.location.assign(link.href);
  });

  scan(root);
  if ('MutationObserver' in browserWindow) {
    new browserWindow.MutationObserver(records => records.forEach(record =>
      record.addedNodes.forEach(node => node.nodeType === 1 && scan(node))
    )).observe(root.documentElement || root, { childList: true, subtree: true });
  }
}

exports.getSearchCardLink = getSearchCardLink;
exports.shouldOpenSearchCard = shouldOpenSearchCard;
exports.installSearchCardNavigation = installSearchCardNavigation;
}
};
const cache=Object.create(null);
function require(id){if(cache[id])return cache[id].exports;if(!modules[id])throw new Error('Missing module '+id);const m=cache[id]={exports:{}};modules[id](m,m.exports,require);return m.exports;}
require("src/assets/js/app.js");
})();
