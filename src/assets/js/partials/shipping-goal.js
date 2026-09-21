// Eligibility, target and progress come only from the active Salla shipping offer.
export const goalState = cart => {
  const number = value => {
    value = value?.amount ?? value;
    if (value === null || value === undefined || value === '' || typeof value === 'boolean') return null;
    const n = Number(value); return Number.isFinite(n) ? n : null;
  };
  const native = cart?.free_shipping_bar;
  const threshold = number(native?.minimum_amount);
  const remaining = number(native?.remaining);
  const percent = number(native?.percent);
  if (!native || threshold === null || threshold <= 0 || remaining === null || percent === null) return null;
  const complete = native.has_free_shipping === true || native.has_free_shipping === 1 || native.has_free_shipping === '1';
  return {threshold,remaining:Math.max(0,remaining),percent:Math.max(0,Math.min(100,percent)),complete};
};

export const initShippingGoal = () => {
  const widget = document.querySelector('[data-shipping-widget]');
  const hosts = [...document.querySelectorAll('[data-shipping-goal]')];
  if (!hosts.length || document.documentElement.dataset.shippingReady) return;
  document.documentElement.dataset.shippingReady = 'true';
  const ar = document.documentElement.lang === 'ar';
  const format = n => new Intl.NumberFormat(ar ? 'ar-SA' : 'en', {maximumFractionDigits:2}).format(n);
  const toggle = widget?.querySelector('[data-shipping-toggle]');
  const popup = widget?.querySelector('[data-shipping-popup]');
  const live = widget?.querySelector('[data-shipping-live]');
  let revision = 0, timer, closeTimer, previous, showNotice = false;
  const close = () => { if(popup) popup.hidden = true; toggle?.setAttribute('aria-expanded','false'); };
  const open = () => { clearTimeout(closeTimer); if(popup) popup.hidden = false; toggle?.setAttribute('aria-expanded','true'); };
  toggle?.addEventListener('click', () => popup.hidden ? open() : close());
  widget?.querySelector('[data-shipping-close]')?.addEventListener('click', close);
  widget?.addEventListener('keydown', e => { if (e.key === 'Escape') { close(); toggle.focus(); } });
  const render = (cart, notify) => {
    const state = goalState(cart);
    hosts.forEach(host => { host.hidden = !state; host.closest?.('[data-shipping-section]')?.toggleAttribute('hidden',!state); });
    if (!state) { close(); previous = null; return; }
    // Use Salla's current currency formatter, not a hard-coded SAR campaign.
    let amount = format(state.remaining);
    try { amount = window.salla.money(state.remaining); } catch (_) {}
    const message = state.complete ? (ar ? 'مبروك! شحنك علينا' : 'You unlocked free delivery!') :
      (ar ? `باقي لك ${amount} للشحن المجاني` : `${amount} away from free delivery`);
    let plainMessage = message.replace(/<[^>]*>/g,'');
    hosts.forEach(host => {
      host.style.setProperty('--shipping-progress', `${state.percent}%`);
      host.classList.toggle('is-complete', state.complete);
      host.querySelectorAll('[data-shipping-message]').forEach(n => { n.innerHTML = message; });
      host.querySelectorAll('[data-shipping-progress]').forEach(n => {
        n.setAttribute('aria-valuenow', String(Math.round(state.percent)));
        n.setAttribute('aria-valuetext', plainMessage);
      });
      host.querySelectorAll('[data-shipping-icon]').forEach(n => { n.textContent = state.complete ? '🎉' : '🚚'; });
    });
    toggle?.setAttribute('aria-label', plainMessage);
    if (notify && previous !== message && widget) {
      live.textContent = plainMessage; open(); clearTimeout(closeTimer);
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
    document.addEventListener('visibilitychange', () => { if(!document.hidden) refresh(); });
  };
  window.salla?.onReady?.().then(boot).catch(() => {});
};
