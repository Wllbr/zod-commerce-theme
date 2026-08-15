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
    this.initPriceMirror();
    this.initStickyPurchase();
    this.initOptionPanels();
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

  initStickyPurchase() {
    if (!this.buyAnchor || !this.buyBar || !document.body.classList.contains('is-sticky-product-bar')) return;

    const dock = () => {
      this.buyAnchor.style.minHeight = '0px';
      this.buyBar.classList.add('is-docked');
      document.body.classList.add('zod-product-dock-visible');
      requestAnimationFrame(() => this.buyBar.classList.add('is-ready'));
    };

    requestAnimationFrame(() => requestAnimationFrame(dock));
  }
}

document.addEventListener('DOMContentLoaded', () => new ZodProductPage());
