import 'lite-youtube-embed/src/lite-yt-embed.js';
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
    this.initCartExperience();
    this.initFooterDisclosures();
    this.initDisclosureToggles();
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


  getStoredCartCount() {
    try {
      const summary = salla.storage.get('cart.summery') || salla.storage.get('cart.summary') || {};
      const count = Number(summary?.count ?? 0);
      return Number.isFinite(count) && count > 0 ? count : 0;
    } catch (_) { return 0; }
  }

  extractCartCount(payload) {
    const values = [
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
    return this.getStoredCartCount();
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

  animateProductToCart(productId) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = document.querySelector(`custom-salla-product-card[data-product-id="${productId}"]`);
    const source = card?.querySelector('.zpc-media img');
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

  initCartExperience() {
    const bind = () => {
      this.updateCartBadge();
      const cartEvents = salla?.cart?.event;
      cartEvents?.onItemAdded?.((response, productId) => {
        this.animateProductToCart(productId);
        setTimeout(() => this.updateCartBadge(this.extractCartCount(response), true), 60);
      });
      cartEvents?.onItemDeleted?.((response) => setTimeout(() => this.updateCartBadge(this.extractCartCount(response)), 60));
      document.addEventListener('visibilitychange', () => { if (!document.hidden) this.updateCartBadge(); });
    };
    if (window.salla?.onReady) window.salla.onReady().then(bind).catch(()=>{});
    else document.addEventListener('zod::ready', bind, {once:true});
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
