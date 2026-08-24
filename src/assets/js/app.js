import './partials/product-card';

class ZodTheme {
  constructor() {
    this.header = document.querySelector('.zod-header');
    this.searchOverlay = document.getElementById('zod-search-overlay');
    this.searchLastFocus = null;
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
        const target = document.querySelector(link.hash);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });

    this.initSearchOverlay();
    this.initSuccessAlertGuard();
    this.initCartExperience();
    this.initLiveShowcasePrices();
    this.initProductCardReveal();
    this.initNativeStockBadges();
    this.initFooterDisclosures();
    this.initDisclosureToggles();
    this.initProfileAvatarUpload();
    window.salla?.onReady?.().then(() => document.dispatchEvent(new CustomEvent('zod::ready')));
  }

  syncOverlayLock() {
    const drawerOpen = document.getElementById('zod-catalog-drawer')?.classList.contains('is-open');
    const searchOpen = this.searchOverlay?.classList.contains('is-open');
    document.documentElement.classList.toggle('zod-lock', Boolean(drawerOpen || searchOpen));
  }

  initSearchOverlay() {
    if (!this.searchOverlay) return;

    // Dismiss search from the X button, Escape, or anywhere outside the live search field/results.
    // composedPath() keeps clicks inside Salla's web component from being mistaken for backdrop clicks.
    this.searchOverlay.addEventListener('click', event => {
      const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
      const insideSearch = path.some(node => node?.matches?.('[data-zod-search-box], [data-zod-search-box] *'))
        || event.target.closest?.('[data-zod-search-box]');
      if (insideSearch) return;
      this.closeSearch();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && this.searchOverlay?.classList.contains('is-open')) this.closeSearch();
    });
  }

  openSearch(trigger) {
    if (!this.searchOverlay) return;
    window.zodMenu?.close?.(false);
    this.searchLastFocus = trigger || document.activeElement;
    this.searchOverlay.classList.add('is-open');
    this.searchOverlay.setAttribute('aria-hidden', 'false');
    this.syncOverlayLock();
    requestAnimationFrame(() => {
      const search = this.searchOverlay.querySelector('salla-search');
      search?.focus?.();
    });
  }

  closeSearch(restoreFocus = true) {
    if (!this.searchOverlay) return;
    this.searchOverlay.classList.remove('is-open');
    this.searchOverlay.setAttribute('aria-hidden', 'true');
    this.syncOverlayLock();
    if (restoreFocus) this.searchLastFocus?.focus?.();
  }

  // Backward-compatible method used by any old internal trigger.
  focusSearch() { this.openSearch(document.activeElement); }


  uiText(key, fallback = '') {
    return window.zodSettings?.i18n?.[key] || fallback;
  }

  initSuccessAlertGuard() {
    if (window.__zodAlertGuardInstalled) return;
    window.__zodAlertGuardInstalled = true;
    const nativeAlert = window.alert.bind(window);
    window.alert = message => {
      const text = String(message ?? '').trim();
      const isCartPage = document.body?.classList?.contains('cart-page') || /\/cart(?:\/|$|\?)/i.test(location.pathname + location.search);
      const isCartAdded = /تمت?\s+إضافة\s+المنتج.*بنجاح/i.test(text)
        || /product\s+(was\s+)?added.*(cart|success)/i.test(text)
        || /added\s+to\s+(your\s+)?cart/i.test(text);
      const isCartUpdated = isCartPage && (
        /تم\s+تحديث\s+(?:البيانات|السلة).*بنجاح/i.test(text)
        || /(?:cart|data|item).*updated.*success/i.test(text)
        || /updated\s+successfully/i.test(text)
      );
      const isCartRemoved = isCartPage && (
        /تم\s+حذف\s+المنتج.*بنجاح/i.test(text)
        || /تمت\s+إزالة\s+المنتج.*(?:السلة|بنجاح)/i.test(text)
        || /(?:cart\s+)?item.*(?:deleted|removed).*success/i.test(text)
        || /product.*removed.*cart/i.test(text)
      );

      if (isCartAdded) {
        this.showCartToast(this.uiText('cartAdded', 'Product added to cart'), 'added');
        return;
      }
      if (isCartUpdated) {
        this.showCartToast(this.uiText('cartUpdated', 'Cart updated'), 'updated');
        document.dispatchEvent(new CustomEvent('zod:cart-update-success'));
        return;
      }
      if (isCartRemoved) {
        this.showCartToast(this.uiText('cartRemoved', 'Product removed from cart'), 'removed');
        document.dispatchEvent(new CustomEvent('zod:cart-delete-success'));
        return;
      }
      return nativeAlert(message);
    };
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
    const current = sale !== null && sale > 0 ? sale : base;
    return {
      current,
      regular: regular !== null && current !== null && regular > current ? regular : null
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
    const bind = async () => {
      const nodes = [...document.querySelectorAll('[data-zod-live-price][data-product-id]')]
        .filter(node => {
          if (node.dataset.priceReady === '1') {
            node.hidden = false;
            return false;
          }
          return true;
        });
      if (!nodes.length) return;

      await Promise.all(nodes.map(async node => {
        const productId = Number(node.dataset.productId);
        if (!productId) return;
        let applied = false;
        try {
          const response = await salla.product.getPrice(productId);
          applied = this.applyLivePrice(node, this.extractProductPrice(response));
        } catch (_) {}
        if (!applied) {
          try {
            const response = await salla.product.getDetails(productId);
            this.applyLivePrice(node, this.extractProductPrice(response));
          } catch (_) {}
        }
      }));
    };
    if (window.salla?.onReady) window.salla.onReady().then(bind).catch(()=>{});
    else document.addEventListener('zod::ready', bind, {once:true});
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
    try {
      const response = await salla.cart.details();
      const liveCount = this.extractCartCount(response, false);
      if (liveCount === null) throw new Error('Cart count missing from Salla response');
      this.updateCartBadge(liveCount, animate);
      if (recoverCartPage) this.recoverEmptyCartPage(liveCount);
      return liveCount;
    } catch (_) {
      const storedCount = this.getStoredCartCount();
      this.updateCartBadge(storedCount, animate);
      return storedCount;
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
      // Never paint a cached count as authoritative. The live Salla cart owns the badge.
      this.updateCartBadge(0);
      const cartEvents = salla?.cart?.event;
      cartEvents?.onItemAdded?.((response, productId) => {
        this.animateProductToCart(productId);
        this.showCartToast(this.uiText('cartAdded', 'Product added to cart'), 'added');
        const responseCount = this.extractCartCount(response, false);
        if (responseCount !== null) this.updateCartBadge(responseCount, true);
        setTimeout(() => this.refreshCartBadge({ animate: responseCount === null }), 100);
      });
      cartEvents?.onItemDeleted?.((response) => {
        this.showCartToast(this.uiText('cartRemoved', 'Product removed from cart'), 'removed');
        const responseCount = this.extractCartCount(response, false);
        if (responseCount !== null) this.updateCartBadge(responseCount);
        setTimeout(() => this.refreshCartBadge(), 100);
      });
      this.refreshCartBadge({ recoverCartPage: true });
      document.addEventListener('visibilitychange', () => { if (!document.hidden) this.refreshCartBadge(); });
    };
    if (window.salla?.onReady) window.salla.onReady().then(bind).catch(()=>{});
    else document.addEventListener('zod::ready', bind, {once:true});
  }


  initNativeStockBadges() {
    const outAr = 'نفدت الكمية';
    const outEn = 'Out of stock';
    const label = document.documentElement.lang?.toLowerCase().startsWith('ar') ? outAr : outEn;
    const isOutStatus = value => ['out','out-of-stock','out_of_stock','sold-out','sold_out','out-and-notify'].includes(String(value || '').toLowerCase());

    const decorate = card => {
      if (!card || card.matches('custom-salla-product-card')) return;
      const p = card.product || card.productData || card.data?.product || {};
      const qty = p.quantity !== undefined && p.quantity !== null && p.quantity !== '' ? Number(p.quantity) : null;
      let isOut = Boolean(p.is_out_of_stock || isOutStatus(p.status) || isOutStatus(card.getAttribute('product-status')) || isOutStatus(card.getAttribute('status')) || (Number.isFinite(qty) && qty <= 0));
      const roots = [card, card.shadowRoot].filter(Boolean);
      for (const root of roots) {
        const add = root.querySelector?.('salla-add-product-button,button[disabled],[product-status]');
        const status = add?.getAttribute?.('product-status') || add?.getAttribute?.('status');
        const text = root.textContent || '';
        if (isOutStatus(status) || /نفدت\s*الكمية|out\s+of\s+stock/i.test(text)) isOut = true;
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
