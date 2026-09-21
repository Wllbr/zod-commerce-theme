/** Required Twilight add toast. The native Product Added event is the only trigger.
 * Cart details are read after a successful user purchase action, never on list load.
 * Authoritative Salla cart fields are used; no product-details requests or local totals.
 */
class ZodAddProductToast extends HTMLElement {
  connectedCallback() {
    if (this.started) return;
    this.started = true;
    this.hidden = true;
    this.classList.add('zod-add-toast');
    this.request = 0;
    this.hovered = false;
    this.focused = false;
    this.addEventListener('pointerenter', () => { this.hovered = true; });
    this.addEventListener('pointerleave', () => { this.hovered = false; });
    this.addEventListener('focusin', () => { this.focused = true; });
    this.addEventListener('focusout', e => { this.focused = this.contains(e.relatedTarget); });
    this.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); });
    const bind = () => {
      if (this.dataset.ready === 'true' || !window.salla?.event?.on) return;
      this.dataset.ready = 'true';
      salla.event.on('Product Added', items => this.handleAdded(items));
    };
    if (window.salla?.onReady) salla.onReady().then(bind).catch(() => {});
    document.addEventListener('zod::ready', bind, { once: true });
  }

  disconnectedCallback() { this.request++; clearInterval(this.timer); }

  safeUrl(value) {
    try {
      const parsed = new URL(typeof value === 'string' ? value : '', location.href);
      return value && ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : '';
    } catch (_) { return ''; }
  }

  node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = String(text);
    return element;
  }

  async handleAdded(items) {
    if (!this.isConnected || !Array.isArray(items) || !items.length) return;
    const token = ++this.request;
    // Give immediate feedback even when a later cart request is slow/offline.
    this.show(null);
    const itemId = items[0]?.cart_item_id;
    if (!itemId || !window.salla?.cart?.api?.details) return;
    try {
      const response = await salla.cart.api.details(null, ['options']);
      const product = response?.data?.cart?.items?.find(item => String(item.id) === String(itemId));
      if (product && token === this.request && this.isConnected && !this.hidden) this.show(product);
    } catch (_) { /* The generic success and View cart link remain available. */ }
  }

  show(item) {
    const hadFocus = this.contains(document.activeElement);
    clearInterval(this.timer);
    // Do not replace a focused toast while enriching it asynchronously.
    if (hadFocus && item) { this.startTimer(); return; }
    this.replaceChildren();
    this.hidden = false;
    const head = this.node('div', 'zod-add-toast__head');
    const status = this.node('span', 'zod-add-toast__status', this.dataset.labelAdded);
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    head.append(status);
    const close = this.node('button', 'zod-add-toast__close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', this.dataset.labelClose || 'Close');
    close.addEventListener('click', () => this.close());
    head.append(close);
    this.append(head);
    if (item) {
      const body = this.node('div', 'zod-add-toast__body');
      const image = this.safeUrl(typeof item.product_image === 'object' ? item.product_image?.url : item.product_image);
      if (image) {
        const img = this.node('img', 'zod-add-toast__image');
        img.src = image; img.alt = ''; img.width = 64; img.height = 64;
        img.addEventListener('error', () => { img.hidden = true; }, { once: true });
        body.append(img);
      }
      const info = this.node('div', 'zod-add-toast__info');
      const url = this.safeUrl(item.url);
      const name = this.node(url ? 'a' : 'strong', 'zod-add-toast__name', item.product_name || '');
      if (url) name.href = url;
      info.append(name);
      info.append(this.node('small', '', `${this.dataset.labelQuantity || 'Quantity'}: ${item.quantity ?? 1}`));
      // At most two selected option labels; never expose file/map private values.
      (item.options || []).filter(option => !['splitter', 'file', 'image', 'map'].includes(option.type)).slice(0, 2).forEach(option => {
        const values = option.details?.filter(detail => detail.is_selected).map(detail => detail.name).join(', ') || option.value;
        if (typeof values === 'string' || typeof values === 'number') info.append(this.node('small', '', `${option.name}: ${values}`));
      });
      body.append(info);
      if (item.total !== undefined && item.total !== null) {
        let total = '';
        try { total = salla.money(item.total); } catch (_) {}
        if (total) {
          // Formatters can include the SAR icon. Preserve only its known class;
          // all other formatter output becomes inert text, never merchant HTML.
          const formatted = document.createElement('template');
          formatted.innerHTML = String(total);
          const price = this.node('strong', 'zod-add-toast__price', formatted.content.textContent.trim());
          if (formatted.content.querySelector('.sicon-sar')) {
            const sar = this.node('i', 'sicon-sar'); sar.setAttribute('aria-hidden', 'true'); price.append(' ', sar);
          }
          body.append(price);
        }
      }
      this.append(body);
    }
    const actions = this.node('div', 'zod-add-toast__actions');
    const cart = this.node('a', 'zod-btn zod-btn--primary', this.dataset.labelCart);
    cart.href = this.safeUrl(this.dataset.cartUrl) || this.safeUrl(window.salla?.url?.get?.('cart')) || '#';
    const keep = this.node('button', 'zod-add-toast__continue', this.dataset.labelContinue);
    keep.type = 'button'; keep.addEventListener('click', () => this.close());
    actions.append(cart, keep); this.append(actions);
    this.startTimer();
  }

  startTimer() {
    clearInterval(this.timer);
    this.remaining = 5000;
    this.timer = setInterval(() => {
      if (document.hidden || this.hovered || this.focused) return;
      this.remaining -= 250;
      if (this.remaining <= 0) this.close();
    }, 250);
  }

  close() {
    const focused = this.contains(document.activeElement);
    this.request++; clearInterval(this.timer); this.hidden = true;
    // Closing must not strand keyboard focus in hidden content.
    if (focused) {
      const candidates = [...document.querySelectorAll('[data-testid="store-header-cart"], .zod-mobile-dock a[href]')];
      const target = candidates.find(node => node.getClientRects().length && node.href === this.safeUrl(this.dataset.cartUrl)) || candidates.find(node => node.getClientRects().length);
      target?.focus({ preventScroll: true });
    }
  }
}
if (!customElements.get('salla-add-product-toast')) customElements.define('salla-add-product-toast', ZodAddProductToast);
