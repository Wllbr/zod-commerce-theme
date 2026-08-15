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
    this.init();
  }

  init() {
    this.initDescription();
    this.initStockStatus();
    this.initStickyPurchase();
    this.initPriceMirror();
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
        let available = this.inferButtonAvailability();
        try {
          const hasOut = await this.options.hasOutOfStockOption?.();
          if (typeof hasOut === 'boolean') available = !hasOut && this.inferButtonAvailability();
        } catch (_) {}
        requestAnimationFrame(() => this.setStock(available));
      });
    }
  }

  initPriceMirror() {
    if (!this.mainPrice || !this.stickyPrice) return;
    const sync = () => {
      const current = this.mainPrice.querySelector('.total-price');
      if (current?.textContent?.trim()) this.stickyPrice.textContent = current.textContent.trim();
    };
    sync();
    new MutationObserver(sync).observe(this.mainPrice, { childList: true, subtree: true, characterData: true });
  }

  initStickyPurchase() {
    if (!this.buyAnchor || !this.buyBar || !document.body.classList.contains('is-sticky-product-bar')) return;
    let docked = false;
    let raf = 0;

    const headerOffset = () => {
      const header = document.querySelector('.zod-header');
      return (header?.getBoundingClientRect().height || 0) + 12;
    };

    const setDocked = next => {
      if (next === docked) return;
      docked = next;
      if (next) {
        this.buyAnchor.style.minHeight = `${this.buyBar.getBoundingClientRect().height}px`;
        this.buyBar.classList.add('is-docked');
        document.body.classList.add('zod-product-dock-visible');
      } else {
        this.buyBar.classList.remove('is-docked');
        document.body.classList.remove('zod-product-dock-visible');
        this.buyAnchor.style.minHeight = '';
      }
    };

    const update = () => {
      raf = 0;
      const trigger = this.mainPrice || this.buyAnchor;
      const rect = trigger.getBoundingClientRect();
      setDocked(rect.bottom < headerOffset());
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
  }
}

document.addEventListener('DOMContentLoaded', () => new ZodProductPage());
