document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-zod-order-open]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!window.salla?.order?.show || !link.dataset.orderId) return; // Working link before the SDK is ready.
      event.preventDefault();
      if (link.getAttribute('aria-busy') === 'true') return;
      link.setAttribute('aria-busy', 'true');
      const release = () => link.removeAttribute('aria-busy');
      const fallback = () => { release(); window.location.assign(link.href); };
      try {
        Promise.resolve(window.salla.order.show({ order_id: link.dataset.orderId, url: link.href })).then(release, fallback);
      } catch (_) { fallback(); }
    });
  });
  document.querySelectorAll('[data-accordion-trigger]').forEach(btn=>btn.addEventListener('click',()=>btn.closest('[data-accordion]')?.classList.toggle('is-open')));

  const cartPage=document.querySelector('[data-zod-cart-page]');
  if(!cartPage) return;

  // Prices and eligibility come from confirmed cart responses, never cached
  // totals or reconstructed subtotal/tax/discount formulas. The native summary
  // handles checkout validation, coupons, shipping and all monetary breakdowns.
  const totalNodes = [...document.querySelectorAll('[data-zod-cart-grand-total]')];
  const pendingItems = new Map();
  let revision = 0;
  let refreshTimer;
  const flag = value => value === true || value === 1 || value === '1' || value === 'true';
  const moneyNumber = value => {
    const raw = value && typeof value === 'object' ? value.amount : value;
    if (raw === null || raw === undefined || raw === '' || typeof raw === 'boolean') return null;
    if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
    const normalized = String(raw).trim()
      .replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
      .replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
      .replace(/٬/g, '').replace(/٫/g, '.');
    if (!/^-?\d+(?:\.\d+)?$/.test(normalized)) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  };
  const cartFrom = payload => {
    const roots = [payload?.data?.cart, payload?.cart, payload?.data?.data, payload?.data, payload];
    return roots.find(root => root && typeof root === 'object'
      && ('total' in root || 'items' in root || 'free_shipping_bar' in root)) || null;
  };
  const paintMoney = (node, value) => {
    const amount = moneyNumber(value);
    if (!node || amount === null) return;
    try { node.innerHTML = salla.money(amount); }
    catch (_) { node.textContent = String(amount); }
  };
  const clearItemState = (item, success = false) => {
    const timer = pendingItems.get(item);
    clearTimeout(timer); pendingItems.delete(item);
    item.classList.remove('is-updating'); item.removeAttribute?.('aria-busy');
    if (success) {
      item.classList.add('is-updated');
      setTimeout(() => item.classList.remove('is-updated'), 720);
    }
  };
  const settlePending = success => [...pendingItems.keys()].forEach(item => clearItemState(item, success));
  const paintItem = item => {
    if (item?.id == null) return;
    const form = document.getElementById(`item-${item.id}`);
    if (!form) return;
    const row = form.querySelector('[data-zod-cart-item]');
    const total = form.querySelector('[data-testid="store-cart-item-total"]');
    if (item.is_available !== undefined && !flag(item.is_available)) {
      if (total) total.textContent = row?.dataset.unavailableLabel || salla.lang.get('pages.cart.out_of_stock');
    } else {
      const special = item.detailed_offers?.length ? moneyNumber(item.total_special_price) : null;
      paintMoney(total, special === null ? item.total : special);
    }
    paintMoney(form.querySelector('[data-testid="store-cart-item-price"]'), item.price);
    const original = form.querySelector('.item-original-price');
    if (original && item.is_on_sale !== undefined) {
      original.hidden = !flag(item.is_on_sale);
      if (!original.hidden) paintMoney(original, item.original_price);
    }
    const weight = form.querySelector('.item-weight');
    if (weight && item.weight_label !== undefined) {
      weight.textContent = item.weight_label || '';
      const weightRow = form.querySelector('.item-weight-row');
      if (weightRow) weightRow.hidden = !item.weight_label;
    }
    const quantity = form.querySelector('salla-quantity-input');
    if (quantity && item.max_quantity !== undefined && item.max_quantity !== null) quantity.setAttribute('max', String(item.max_quantity));
    if (Array.isArray(item.detailed_offers)) {
      const offers = form.querySelector('salla-cart-item-offers');
      offers?.setAttribute('offers', JSON.stringify(item.detailed_offers));
      if (item.quantity !== undefined) offers?.setAttribute('quantity', String(item.quantity));
      const details = form.querySelector('.zod-cart-item-offer-details');
      if (details) details.hidden = !item.detailed_offers.length && !item.offer;
      const legacy = form.querySelector('.zod-cart-legacy-offer');
      if (legacy) { legacy.textContent = item.offer?.names || ''; legacy.hidden = Boolean(item.detailed_offers.length || !item.offer?.names); }
    }
  };
  const paintShipping = cart => {
    // Missing shipping data in a partial mutation response does not mean "free".
    if (!Object.prototype.hasOwnProperty.call(cart, 'free_shipping_bar')) return;
    const host = document.querySelector('[data-zod-free-shipping]');
    if (!host) return;
    const shipping = cart.free_shipping_bar;
    host.hidden = !shipping;
    if (!shipping) return;
    const text = host.querySelector('[data-zod-free-shipping-message]');
    const remaining = moneyNumber(shipping.remaining);
    if (text && (flag(shipping.has_free_shipping) || remaining !== null)) {
      const key = flag(shipping.has_free_shipping) ? 'pages.cart.has_free_shipping' : 'pages.cart.free_shipping_alert';
      text.innerHTML = salla.lang.get(key, { amount: salla.money(remaining ?? 0) });
    }
    const progress = host.querySelector('[data-zod-free-shipping-progress]');
    const percent = moneyNumber(shipping.percent);
    if (progress && percent !== null) {
      const value = Math.max(0, Math.min(100, percent));
      progress.setAttribute('aria-valuenow', String(value));
      const bar = progress.querySelector('i');
      if (bar) bar.style.width = `${value}%`;
    }
  };
  const paint = payload => {
    const cart = cartFrom(payload);
    if (!cart) return;
    totalNodes.forEach(node => paintMoney(node, cart.total));
    if (Array.isArray(cart.items)) cart.items.forEach(paintItem);
    paintShipping(cart);
  };
  const refresh = () => {
    const request = ++revision;
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(async () => {
      try {
        const response = await salla.cart.details();
        if (request === revision) paint(response);
      } catch (_) { /* Keep server-rendered values; do not substitute zero. */ }
    }, 260);
  };
  let bound = false;
  const boot = () => {
    if (bound) return;
    bound = true;
    refresh();
    const afterMutation = response => {
      ++revision; settlePending(true); paint(response); refresh();
    };
    // Canonical cart updates include changes made inside native coupon/shipping widgets.
    salla.event?.cart?.onUpdated?.(afterMutation);
    const events = salla.cart?.event;
    events?.onItemAdded?.(afterMutation);
    events?.onItemDeleted?.(afterMutation);
    events?.onItemUpdated?.(afterMutation);
    events?.onCouponAdded?.(afterMutation);
    events?.onCouponDeleted?.(afterMutation);
    events?.onItemUpdatedFailed?.(() => { ++revision; settlePending(false); refresh(); });
  };
  if (window.salla?.onReady) Promise.resolve(window.salla.onReady()).then(boot).catch(() => {});
  else if (typeof salla !== 'undefined') boot();
  else document.addEventListener('zod::ready', boot, { once: true });

  document.addEventListener('change', event => {
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [event.target];
    const row = path.map(node => node?.closest?.('[data-zod-cart-item]')).find(Boolean);
    if (!row) return;
    ++revision; clearTimeout(refreshTimer);
    clearTimeout(pendingItems.get(row));
    row.classList.remove('is-updated'); row.classList.add('is-updating'); row.setAttribute('aria-busy', 'true');
    // A timeout clears the spinner only; it must never imply a successful mutation.
    pendingItems.set(row, setTimeout(() => clearItemState(row, false), 12000));
  }, true);
  document.addEventListener('zod:cart-update-success', event => { settlePending(true); paint(event.detail); refresh(); });
  document.addEventListener('zod:cart-delete-success', event => { paint(event.detail); refresh(); });
});
