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
    this.normalizeProductCopy();
    this.initDescription();
    this.initStockStatus();
    this.initPriceMirror();
    this.initWishlist();
    this.initShareActions();
    this.initStickyPurchase();
    this.initOptionPanels();
    this.initProductOffers();
    this.initRelatedProducts();
  }

  normalizeProductCopy() {
    const body = this.page.querySelector('[data-zod-description-body]');
    const title = this.page.querySelector('[data-testid="store-product-title"]')?.textContent;
    if (!body) return;

    const normalize = value => String(value || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
    const normalizedTitle = normalize(title);
    const firstContent = [...body.children].find(element => normalize(element.textContent));
    if (firstContent && normalizedTitle && normalize(firstContent.textContent) === normalizedTitle) {
      firstContent.remove();
    }

    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    const warrantyPattern = /(?:الضمان|warranty)/i;
    let node;
    while ((node = walker.nextNode())) {
      const value = node.nodeValue || '';
      if (!warrantyPattern.test(value)) continue;
      const openCount = (value.match(/\(/g) || []).length;
      const closeCount = (value.match(/\)/g) || []).length;
      if (openCount > closeCount) node.nodeValue = `${value}${')'.repeat(openCount - closeCount)}`;
    }
  }

  initProductOffers() {
    const drawer = this.page.querySelector('[data-zod-product-offers]');
    const offer = drawer?.querySelector('salla-offer');
    if (!drawer || !offer) return;

    const revealWhenReady = () => {
      const visibleContent = offer.getBoundingClientRect().height > 8
        || Boolean(offer.shadowRoot?.textContent?.trim())
        || Boolean(offer.textContent?.trim());
      drawer.open = false;
      drawer.hidden = !visibleContent;
      drawer.classList.remove('is-loading');
      drawer.classList.add('is-ready');
    };

    drawer.classList.add('is-loading');
    drawer.open = true;
    window.customElements?.whenDefined?.('salla-offer')
      .then(() => window.setTimeout(revealWhenReady, 500))
      .catch(() => {});
    window.setTimeout(revealWhenReady, 1600);
  }

  initRelatedProducts() {
    const section = document.querySelector('[data-zod-related-products]');
    if (!section) return;

    let attempts = 0;
    const prioritizeAvailable = () => {
      const wrapper = section.querySelector('.swiper-wrapper');
      const slides = wrapper ? [...wrapper.children].filter(slide => slide.matches('.swiper-slide')) : [];
      if (!wrapper || !slides.length) {
        if (attempts++ < 12) window.setTimeout(prioritizeAvailable, 250);
        return;
      }

      const available = [];
      const unavailable = [];
      slides.forEach(slide => {
        const isUnavailable = Boolean(slide.querySelector('.zpc-media.is-out, salla-add-product-button[disabled], salla-add-product-button[product-status="out-and-notify"]'));
        slide.classList.toggle('zod-related-slide--out', isUnavailable);
        slide.classList.toggle('zod-related-slide--available', !isUnavailable);
        (isUnavailable ? unavailable : available).push(slide);
      });

      if (!available.length || !unavailable.length) return;
      [...available, ...unavailable].forEach(slide => wrapper.appendChild(slide));
      section.classList.add('has-prioritized-availability');

      const slider = section.querySelector('salla-slider');
      const swiper = slider?.swiper || slider?.querySelector?.('.swiper')?.swiper;
      swiper?.update?.();
      swiper?.slideTo?.(0, 0);
    };

    prioritizeAvailable();
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
      if (value) this.stickyPrice.innerHTML = current.innerHTML;
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
    const productId = String(this.page.dataset.productId || buttons[0]?.dataset.id || '');
    const sync = active => {
      document.querySelectorAll(`[data-zod-product-page][data-product-id="${CSS.escape(productId)}"] [data-zod-wishlist], custom-salla-product-card[data-product-id="${CSS.escape(productId)}"] .zpc-wishlist`)
        .forEach(button => {
          button.classList.toggle('is-active', active);
          button.setAttribute('aria-pressed', String(active));
        });
    };
    buttons.forEach(button => {
      button.addEventListener('click', async event => {
        event.preventDefault(); event.stopPropagation();
        if (button.getAttribute('aria-busy') === 'true' || !window.salla) return;
        if (salla.config.isGuest()) {
          const modal = document.querySelector('salla-login-modal');
          if (typeof modal?.open === 'function') await modal.open(event);
          return;
        }
        const wasActive = button.getAttribute('aria-pressed') === 'true' || button.classList.contains('is-active');
        button.setAttribute('aria-busy', 'true');
        try {
          await salla.wishlist.toggle(productId);
          const active = !wasActive;
          sync(active);
          button.classList.remove('is-pulsing'); void button.offsetWidth; button.classList.add('is-pulsing');
          window.setTimeout(() => button.classList.remove('is-pulsing'), 420);
        } catch (_) { sync(wasActive); }
        finally { button.removeAttribute('aria-busy'); }
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

    // Keep the one native Salla purchase control docked from initial load.
    // Desktop uses the viewport bottom; mobile sits above the navigation dock.
    document.body.classList.add('is-sticky-product-bar');

    const measureDock = () => {
      const height = Math.ceil(this.buyBar.getBoundingClientRect().height || 0);
      if (height > 0) {
        document.documentElement.style.setProperty('--zod-product-dock-height', `${height}px`);
      }
    };

    const activateDock = () => {
      if (this.buyAnchor) this.buyAnchor.style.minHeight = '0px';
      this.buyBar.classList.add('is-docked');
      document.body.classList.add('zod-product-dock-visible');

      requestAnimationFrame(() => {
        this.buyBar.classList.add('is-ready');
        measureDock();
      });
    };

    activateDock();
    window.addEventListener('resize', measureDock, { passive: true });
    window.addEventListener('orientationchange', measureDock, { passive: true });

    if ('ResizeObserver' in window) {
      new ResizeObserver(measureDock).observe(this.buyBar);
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
