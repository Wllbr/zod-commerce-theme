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
