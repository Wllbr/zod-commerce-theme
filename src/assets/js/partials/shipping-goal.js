// This is a promotional progress indicator; checkout remains owned by Salla.
export const goalState = (cart, threshold = 350) => {
  const number = value => {
    value = value?.amount ?? value;
    if (value === null || value === undefined || value === '' || typeof value === 'boolean') return null;
    const n = Number(value); return Number.isFinite(n) ? n : null;
  };
  const native = cart?.free_shipping_bar;
  if (number(native?.minimum_amount) === threshold && number(native?.remaining) !== null) {
    const remaining = Math.max(0, number(native.remaining));
    return {remaining, percent:Math.max(0, Math.min(100, 100 * (threshold - remaining) / threshold)), complete:remaining === 0};
  }
  // Never count shipping charges, taxes or payment fees towards the target.
  const subtotal = number(cart?.sub_total);
  const discount = number(cart?.real_discount ?? cart?.discount);
  if (subtotal === null || discount === null) return null;
  const eligible = Math.max(0, subtotal - discount);
  const remaining = Math.max(0, threshold - eligible);
  return {remaining, percent:Math.min(100, eligible / threshold * 100), complete:remaining === 0};
};

export const initShippingGoal = () => {
  const widget = document.querySelector('[data-shipping-widget]');
  if (!widget || widget.dataset.ready) return;
  widget.dataset.ready = 'true';
  const threshold = Number(widget.dataset.threshold) || 350;
  const ar = document.documentElement.lang === 'ar';
  const format = n => new Intl.NumberFormat(ar ? 'ar-SA' : 'en', {maximumFractionDigits:2}).format(n);
  const toggle = widget.querySelector('[data-shipping-toggle]');
  const popup = widget.querySelector('[data-shipping-popup]');
  const live = widget.querySelector('[data-shipping-live]');
  let revision = 0, timer, closeTimer, previous, showNotice = false;
  const close = () => { popup.hidden = true; toggle.setAttribute('aria-expanded','false'); };
  const open = () => { clearTimeout(closeTimer); popup.hidden = false; toggle.setAttribute('aria-expanded','true'); };
  toggle.addEventListener('click', () => popup.hidden ? open() : close());
  widget.querySelector('[data-shipping-close]').addEventListener('click', close);
  widget.addEventListener('keydown', e => { if (e.key === 'Escape') { close(); toggle.focus(); } });
  const render = (cart, notify) => {
    const currency = cart?.currency?.code ?? cart?.currency;
    if (typeof currency === 'string' && currency !== 'SAR') { widget.hidden = true; return; }
    const state = goalState(cart, threshold);
    if (!state) return;
    widget.hidden = false;
    const message = state.complete ? (ar ? 'مبروك! شحنك علينا' : 'You unlocked free delivery!') :
      (ar ? `باقي لك ${format(state.remaining)} ر.س للشحن المجاني` : `SAR ${format(state.remaining)} away from free delivery`);
    document.querySelectorAll('[data-shipping-goal]').forEach(host => {
      host.style.setProperty('--shipping-progress', `${state.percent}%`);
      host.classList.toggle('is-complete', state.complete);
      host.querySelectorAll('[data-shipping-message]').forEach(n => { n.textContent = message; });
      host.querySelectorAll('[data-shipping-progress]').forEach(n => {
        n.setAttribute('aria-valuenow', String(Math.round(state.percent)));
        n.setAttribute('aria-valuetext', message);
      });
      host.querySelectorAll('[data-shipping-icon]').forEach(n => { n.textContent = state.complete ? '🎉' : '🚚'; });
    });
    toggle.setAttribute('aria-label', message);
    if (notify && previous !== message) {
      live.textContent = message; open(); clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        // Do not remove the close control while a keyboard user is using it.
        if (!popup.contains(document.activeElement)) close();
      }, 5500);
      widget.classList.remove('is-celebrating');
      if (state.complete && previous && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        widget.classList.add('is-celebrating');
        setTimeout(() => widget.classList.remove('is-celebrating'), 1300);
      }
    }
    previous = message;
  };
  const refresh = (notify = false) => {
    const current = ++revision; showNotice = showNotice || notify; clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        const response = await window.salla.cart.details();
        if (current !== revision) return;
        const roots = [response?.data?.cart, response?.cart, response?.data?.data, response?.data, response];
        const cart = roots.find(r => r && typeof r === 'object' && ('sub_total' in r || 'free_shipping_bar' in r));
        render(cart, showNotice); showNotice = false;
      } catch (_) { /* Preserve confirmed values; a failed request never means an empty cart. */ }
    }, 180);
  };
  const boot = () => {
    refresh();
    const events = window.salla.cart?.event;
    events?.onItemAdded?.(() => refresh(true));
    ['onItemUpdated','onItemDeleted','onCouponAdded','onCouponDeleted'].forEach(name => events?.[name]?.(() => refresh(true)));
    window.salla.event?.cart?.onUpdated?.(() => refresh(true));
    ['zod:cart-update-success','zod:cart-delete-success'].forEach(name => document.addEventListener(name, () => refresh(true)));
  };
  window.salla?.onReady?.().then(boot).catch(() => {});
};
