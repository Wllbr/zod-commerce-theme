import 'fslightbox';

class ZodProductPage {
  constructor() {
    this.page = document.querySelector('[data-zod-product-page]');
    if (!this.page) return;
    this.stock = this.page.querySelector('[data-zod-stock-status]');
    this.addButton = this.page.querySelector('salla-add-product-button[data-testid="store-product-add-to-cart"]');
    this.options = this.page.querySelector('salla-product-options');
    this.buyAnchor = this.page.querySelector('[data-zod-buy-anchor]');
    this.buyBar = this.page.querySelector('[data-zod-sticky-buy]');
    this.mainPrice = this.page.querySelector('[data-zod-main-price]');
    this.stickyPrice = this.page.querySelector('[data-zod-sticky-price]');
    this.gallery = this.page.querySelector('[data-zod-gallery-slider]');
    this.resetInitialScroll();
    this.init();
  }


  resetInitialScroll() {
    if (window.location.hash) return;
    const nav = performance.getEntriesByType?.('navigation')?.[0];
    if (nav?.type === 'back_forward') return;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const reset = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    reset();
    requestAnimationFrame(reset);
  }

  init() {
    this.initGallery();
    this.initDescription();
    this.initStockStatus();
    this.initPriceMirror();
    this.initWishlist();
    this.initShareActions();
    this.initStickyPurchase();
    this.initOptionPanels();
  }

  initGallery() {
    if (!this.gallery) return;

    const prev = this.page.querySelector('[data-zod-gallery-prev]');
    const next = this.page.querySelector('[data-zod-gallery-next]');
    const thumbRail = this.page.querySelector('[data-zod-gallery-thumbs]');
    const thumbs = thumbRail ? [...thumbRail.querySelectorAll('[data-zod-thumb-index]')] : [];

    const activeIndexFromEvent = event => {
      const detail = event?.detail;
      const candidates = [detail?.realIndex, detail?.activeIndex, detail?.swiper?.realIndex, detail?.swiper?.activeIndex, detail?.[0]?.realIndex, detail?.[0]?.activeIndex];
      return candidates.find(value => Number.isInteger(value));
    };

    let lastThumbIndex = -1;
    let beepTimer;

    const syncThumb = index => {
      if (!Number.isInteger(index) || index < 0) return;
      const changed = index !== lastThumbIndex;
      thumbs.forEach((thumb, thumbIndex) => {
        const active = thumbIndex === index;
        thumb.classList.toggle('is-active', active);
        if (!active) thumb.classList.remove('is-beeping');
        thumb.setAttribute('aria-current', active ? 'true' : 'false');
      });
      const activeThumb = thumbs[index];
      if (activeThumb && changed) {
        clearTimeout(beepTimer);
        activeThumb.classList.remove('is-beeping');
        void activeThumb.offsetWidth;
        activeThumb.classList.add('is-beeping');
        beepTimer = window.setTimeout(() => activeThumb.classList.remove('is-beeping'), 380);
      }
      lastThumbIndex = index;
      if (activeThumb && thumbRail) {
        const railRect = thumbRail.getBoundingClientRect();
        const thumbRect = activeThumb.getBoundingClientRect();
        const delta = (thumbRect.left + thumbRect.width / 2) - (railRect.left + railRect.width / 2);
        if (Math.abs(delta) > 2) thumbRail.scrollBy({ left: delta, behavior: 'smooth' });
      }
    };

    prev?.addEventListener('click', () => {
      const action = document.documentElement.dir === 'rtl' ? this.gallery.slideNext?.bind(this.gallery) : this.gallery.slidePrev?.bind(this.gallery);
      Promise.resolve(action?.(320, true)).catch(() => {});
    });

    next?.addEventListener('click', () => {
      const action = document.documentElement.dir === 'rtl' ? this.gallery.slidePrev?.bind(this.gallery) : this.gallery.slideNext?.bind(this.gallery);
      Promise.resolve(action?.(320, true)).catch(() => {});
    });

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const index = Number(thumb.dataset.zodThumbIndex);
        if (!Number.isInteger(index)) return;
        syncThumb(index);
        Promise.resolve(this.gallery.slideTo?.(index, 320, true)).catch(() => {});
      });
    });

    const onSlideChange = event => {
      const eventIndex = activeIndexFromEvent(event);
      if (Number.isInteger(eventIndex)) {
        syncThumb(eventIndex);
        return;
      }
      requestAnimationFrame(() => {
        const active = this.page.querySelector('[data-zod-slide-index].swiper-slide-active');
        if (active) syncThumb(Number(active.dataset.zodSlideIndex));
      });
    };

    this.gallery.addEventListener('afterInit', onSlideChange);
    this.gallery.addEventListener('slideChange', onSlideChange);
    this.gallery.addEventListener('slideChangeTransitionEnd', onSlideChange);
    syncThumb(0);
  }

  initDescription() {
    const body = this.page.querySelector('[data-zod-description-body]');
    const toggle = this.page.querySelector('[data-zod-description-toggle]');
    if (!body || !toggle) return;

    const update = () => {
      const collapsed = body.classList.contains('is-collapsed');
      toggle.textContent = collapsed ? toggle.dataset.more : toggle.dataset.less;
      toggle.setAttribute('aria-expanded', String(!collapsed));
    };

    toggle.addEventListener('click', () => {
      body.classList.toggle('is-collapsed');
      update();
    });
    update();
  }

  initOptionPanels() {
    this.page.querySelectorAll('[data-show]').forEach(button => {
      button.addEventListener('click', () => {
        const target = document.getElementById(button.dataset.show);
        if (!target) return;
        const opening = !target.classList.contains('is-open');
        target.classList.toggle('is-open', opening);
        button.classList.toggle('is-active', opening);
      });
    });
  }

  setStock(available) {
    if (!this.stock) return;
    const pulse = this.stock.querySelector('.zod-live-stock__pulse');
    const text = this.stock.querySelector('[data-zod-stock-text]');
    pulse?.classList.toggle('is-available', available);
    pulse?.classList.toggle('is-out', !available);
    if (text) text.textContent = available ? this.stock.dataset.inLabel : this.stock.dataset.outLabel;
    this.stock.dataset.status = available ? 'sale' : 'out';
  }

  inferButtonAvailability() {
    const status = this.addButton?.getAttribute('product-status');
    if (!status) return this.stock?.dataset.status === 'sale';
    return status === 'sale';
  }

  initStockStatus() {
    this.setStock(this.inferButtonAvailability());

    if (this.addButton) {
      new MutationObserver(() => this.setStock(this.inferButtonAvailability()))
        .observe(this.addButton, { attributes: true, attributeFilter: ['product-status', 'disabled'] });
      this.addButton.addEventListener('success', () => this.setStock(this.inferButtonAvailability()));
    }

    if (this.options) {
      this.options.addEventListener('changed', async () => {
        await Promise.resolve();
        let available = this.inferButtonAvailability();
        try {
          const hasOut = await this.options.hasOutOfStockOption?.();
          if (typeof hasOut === 'boolean') available = !hasOut && this.inferButtonAvailability();
        } catch (_) {}
        requestAnimationFrame(() => this.setStock(available));
      });
    }
  }

  getVisiblePrice() {
    if (!this.mainPrice) return null;
    return this.mainPrice.querySelector('.price_is_on_sale:not(.hidden) .total-price')
      || this.mainPrice.querySelector('.starting-or-normal-price:not(.hidden) .total-price')
      || [...this.mainPrice.querySelectorAll('.total-price')].find(el => getComputedStyle(el).display !== 'none');
  }

  initPriceMirror() {
    if (!this.mainPrice || !this.stickyPrice) return;
    const sync = () => {
      const current = this.getVisiblePrice();
      const value = current?.textContent?.trim();
      if (value) this.stickyPrice.textContent = value;
    };
    sync();
    new MutationObserver(sync).observe(this.mainPrice, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    this.options?.addEventListener('changed', () => requestAnimationFrame(sync));
  }

  initWishlist() {
    const buttons = [...this.page.querySelectorAll('[data-zod-wishlist]')];
    if (!buttons.length) return;
    const productId = Number(this.page.dataset.productId || buttons[0]?.dataset.id);

    const sync = active => {
      buttons.forEach(button => {
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    };

    buttons.forEach(button => {
      button.addEventListener('click', async event => {
        event.preventDefault();
        event.stopPropagation();
        button.classList.remove('is-pulsing');
        void button.offsetWidth;
        button.classList.add('is-pulsing');
        window.setTimeout(() => button.classList.remove('is-pulsing'), 560);

        if (!window.salla) return;
        if (salla.config.isGuest()) {
          const modal = document.querySelector('salla-login-modal');
          if (typeof modal?.open === 'function') await modal.open(event);
          return;
        }

        button.setAttribute('aria-busy', 'true');
        try {
          await salla.wishlist.toggle(productId);
          sync(button.getAttribute('aria-pressed') !== 'true');
        } catch (_) {
          // Keep Salla's native state unchanged if the request fails.
        } finally {
          button.removeAttribute('aria-busy');
        }
      });
    });
  }

  initShareActions() {
    this.page.querySelectorAll('[data-zod-share]').forEach(button => {
      button.addEventListener('click', async event => {
        event.preventDefault();
        event.stopPropagation();

        button.classList.remove('is-pulsing');
        void button.offsetWidth;
        button.classList.add('is-pulsing');
        window.setTimeout(() => button.classList.remove('is-pulsing'), 560);

        const shareComponent = button.closest('salla-social-share');
        try {
          if (window.customElements?.whenDefined) {
            await window.customElements.whenDefined('salla-social-share');
          }
          if (shareComponent && typeof shareComponent.open === 'function') {
            await shareComponent.open();
            return;
          }
        } catch (_) {
          // Fall through to the browser share sheet when Salla's menu cannot open.
        }

        if (navigator.share) {
          try {
            await navigator.share({ title: document.title, url: window.location.href });
            return;
          } catch (error) {
            if (error?.name === 'AbortError') return;
          }
        }

        try {
          await navigator.clipboard?.writeText(window.location.href);
        } catch (_) {
          // Nothing else to do; Salla/native sharing is unavailable in this browser.
        }
      });
    });
  }

  initStickyPurchase() {
    if (!this.buyBar) return;

    // v1.6.36: keep the native Salla purchase dock available at all times.
    // This is the same purchase component used by the form, so quantity,
    // Add to Cart and Buy Now stay synchronized with options and stock.
    document.body.classList.add('is-sticky-product-bar');

    let raf = 0;

    const measureDock = () => {
      const height = Math.ceil(this.buyBar.getBoundingClientRect().height || 0);
      if (height > 0) {
        document.documentElement.style.setProperty('--zod-product-dock-height', `${height}px`);
      }
    };

    const activateDock = () => {
      this.buyBar.classList.add('is-docked');
      document.body.classList.add('zod-product-dock-visible');
      if (this.buyAnchor) this.buyAnchor.style.minHeight = '1px';

      requestAnimationFrame(() => {
        this.buyBar.classList.add('is-ready');
        measureDock();
      });
    };

    const scheduleMeasure = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        measureDock();
      });
    };

    activateDock();

    window.addEventListener('resize', scheduleMeasure, { passive: true });
    window.addEventListener('orientationchange', scheduleMeasure, { passive: true });

    if ('ResizeObserver' in window) {
      new ResizeObserver(scheduleMeasure).observe(this.buyBar);
    }

    if (window.customElements?.whenDefined) {
      Promise.allSettled([
        window.customElements.whenDefined('salla-add-product-button'),
        window.customElements.whenDefined('salla-quantity-input')
      ]).then(() => requestAnimationFrame(measureDock));
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new ZodProductPage());
