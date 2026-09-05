import './partials/product-card';
import { isOutOfStock, isOutStatus } from './partials/stock';
import { containDialogFocus } from './partials/dialog-focus';

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
          target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        }
      }
    });

    [
      'initAnnouncementBar',
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

  initAnnouncementBar() {
    const advertisement = document.querySelector('.app-inner > salla-advertisement');
    if (!advertisement || !this.header || this.header.dataset.sticky !== '1') return;

    const root = document.documentElement;
    const syncHeight = () => {
      const styles = window.getComputedStyle(advertisement);
      const height = styles.display === 'none' || styles.visibility === 'hidden'
        ? 0
        : Math.ceil(advertisement.getBoundingClientRect().height);
      root.style.setProperty('--zod-announcement-height', `${height}px`);
      root.classList.toggle('zod-announcement-visible', height > 1);
    };

    syncHeight();
    if ('ResizeObserver' in window) new ResizeObserver(syncHeight).observe(advertisement);
    new MutationObserver(syncHeight).observe(advertisement, {
      attributes: true,
      attributeFilter: ['class', 'hidden', 'style'],
      childList: true,
      subtree: true,
    });
    window.addEventListener('resize', syncHeight, { passive: true });
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
      // Salla's supported notifier replaces its default blocking alert UI.
      salla.notify?.setNotifier?.((message, type) => this.showNotification(message, type));
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
    const notice = document.createElement('div');
    notice.className = `zod-notice ${type === 'error' ? 'is-error' : ''}`;
    notice.setAttribute('role', type === 'error' ? 'alert' : 'status');
    const copy = document.createElement('span');
    // Notifications may contain markup; show its text without injecting HTML.
    const parsed = new DOMParser().parseFromString(String(message || ''), 'text/html');
    copy.textContent = parsed.body.textContent;
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = '×';
    close.setAttribute('aria-label', document.documentElement.lang.startsWith('ar') ? 'إغلاق' : 'Close');
    close.addEventListener('click', () => notice.remove());
    notice.append(copy, close);
    region.appendChild(notice);
    if (type !== 'error') setTimeout(() => notice.remove(), 6500);
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
    const isArabic = document.documentElement.lang?.toLowerCase().startsWith('ar');
    const quickLabel = isArabic ? 'عرض سريع' : 'Quick view';
    const outStatuses = new Set(['out','out-of-stock','out_of_stock','sold-out','sold_out','out-and-notify']);

    const decorate = card => {
      if (!card || card.matches('custom-salla-product-card') || card.dataset.zodNativeActions === '1') return;
      const media = card.querySelector('.s-product-card-image');
      const wishlist = card.querySelector('salla-button.s-product-card-wishlist-btn');
      const add = card.querySelector('salla-add-product-button');
      const link = card.querySelector('.s-product-card-image > a, .s-product-card-content-title a');
      if (!media || !wishlist || !add || !link) return;

      const id = String(add.getAttribute('product-id') || card.id?.replace(/^product-/, '') || '');
      if (!id) return;

      const actions = document.createElement('div');
      actions.className = 'zod-native-card-actions';
      actions.setAttribute('aria-label', quickLabel);

      const quick = document.createElement('button');
      quick.type = 'button';
      quick.className = 'zpc-action zod-native-quick-view';
      quick.setAttribute('aria-label', quickLabel);
      quick.setAttribute('title', quickLabel);
      quick.innerHTML = '<i class="sicon-eye"></i>';

      actions.append(quick, wishlist);
      media.appendChild(actions);
      card.dataset.zodNativeActions = '1';

      quick.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        const status = String(add.getAttribute('product-status') || '');
        const disabled = Boolean(add.querySelector('button')?.disabled);
        const isOut = outStatuses.has(status.toLowerCase()) || card.classList.contains('zod-native-out-of-stock') || disabled;
        window.zodOpenQuickView?.({
          id,
          name: (card.querySelector('.s-product-card-content-title')?.textContent || link.getAttribute('title') || '').trim(),
          url: link.href,
          image: card.querySelector('.s-product-card-image img')?.src || '',
          price: card.querySelector('.s-product-card-price')?.textContent || '',
          status,
          type: add.getAttribute('product-type') || 'product',
          is_available: !isOut,
          is_out_of_stock: isOut
        });
      });
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
