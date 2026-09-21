// Merchant-managed campaign. This display does not configure checkout shipping.
const shippingNumber = value => {
  value = value?.amount ?? value;
  if (value === null || value === undefined || typeof value === 'boolean') return null;
  const text = String(value).trim().replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace('٫','.');
  if (!text) return null;
  const n = Number(text); return Number.isFinite(n) ? n : null;
};
export const goalState = (cart, target, afterDiscount = true) => {
  const threshold = shippingNumber(target), subtotal = shippingNumber(cart?.sub_total);
  const discount = cart?.discount == null ? 0 : shippingNumber(cart.discount);
  if (threshold === null || threshold <= 0 || subtotal === null || subtotal < 0 || (afterDiscount && (discount === null || discount < 0))) return null;
  const cents = Math.round(threshold * 100);
  if (!Number.isSafeInteger(cents) || cents < 1) return null;
  const amount = Math.max(0,Math.round(subtotal*100) - (afterDiscount ? Math.round(discount*100) : 0));
  const remaining = Math.max(0,cents-amount)/100;
  return {threshold:cents/100,remaining,percent:Math.min(100,amount/cents*100),complete:amount>=cents};
};
export const shippingMessage = (template, remaining, target) => String(template).replaceAll('{remaining}',remaining).replaceAll('{target}',target);

const shippingController = (host, widget) => {
  const config = host.dataset;
  const ar = document.documentElement.lang.startsWith('ar');
  const format = n => new Intl.NumberFormat(ar ? 'ar-SA' : 'en', {maximumFractionDigits:2}).format(n);
  const money = n => {
    try { return String(window.salla.money(n,false)).replace(/<[^>]*>/g,''); } catch (_) { return format(n); }
  };
  const target = shippingNumber(config.shippingTarget);
  if (config.shippingEnabled === 'false' || target === null || target <= 0) return;
  const afterDiscount = config.shippingAfterDiscount !== 'false';
  const notifyEnabled = config.shippingNotify !== 'false';
  const progressText = config.shippingRemaining || (ar ? 'باقي لك {remaining} للشحن المجاني' : '{remaining} away from free delivery');
  const successText = config.shippingSuccess || (ar ? 'مبروك! شحنك مجاني 🎉' : 'You unlocked free delivery! 🎉');
  const initialText = config.shippingInitial || (ar ? 'شحن مجاني للطلبات من {target}' : 'Free delivery on orders from {target}');
  const termsText = config.shippingTermsCopy || '';
  const normalIcon = config.shippingIcon || '🚚', completeIcon = config.shippingCompleteIcon || '🎉';
  const toggle = widget?.querySelector('[data-shipping-toggle]');
  const popup = widget?.querySelector('[data-shipping-popup]');
  const live = widget?.querySelector('[data-shipping-live]');
  let closeTimer, previous, wasComplete = false;
  const close = () => { if(popup) popup.hidden = true; toggle?.setAttribute('aria-expanded','false'); };
  const open = () => { clearTimeout(closeTimer); if(popup) popup.hidden = false; toggle?.setAttribute('aria-expanded','true'); };
  toggle?.addEventListener('click', () => popup.hidden ? open() : close());
  widget?.querySelector('[data-shipping-close]')?.addEventListener('click', close);
  widget?.addEventListener('keydown', e => { if (e.key === 'Escape') { close(); toggle.focus(); } });
  const render = (state, notify) => {
    const message = shippingMessage(state ? (state.complete ? successText : progressText) : initialText, money(state?.remaining ?? target), money(target));
    [host].forEach(host => {
      host.hidden = false; host.closest?.('[data-shipping-section]')?.removeAttribute('hidden');
      host.classList.toggle('is-unconfirmed',!state);
      host.classList.toggle('is-complete',Boolean(state?.complete));
      host.style.setProperty('--shipping-progress', `${state?.percent ?? 0}%`);
      host.querySelectorAll('[data-shipping-terms]').forEach(node => {node.textContent=termsText;node.hidden=!termsText;});
      host.querySelectorAll('[data-shipping-message]').forEach(node => {node.textContent=message;});
      host.querySelectorAll('[data-shipping-check]').forEach(node => {node.hidden=Boolean(state);});
      host.querySelectorAll('[data-shipping-icon]').forEach(node => {node.textContent=state?.complete ? completeIcon : normalIcon;});
      host.querySelectorAll('[data-shipping-progress]').forEach(node => {
        node.hidden=!state;
        node.setAttribute('aria-valuenow',String(Math.round(state?.percent ?? 0)));
        node.setAttribute('aria-valuetext',message);
      });
    });
    toggle?.setAttribute('aria-label',message);
    if (notifyEnabled && notify && previous !== message && widget) {
      if(live) live.textContent=message;
      open(); clearTimeout(closeTimer);
      closeTimer=setTimeout(()=>{if(!popup.contains(document.activeElement)) close();},5500);
      widget.classList.remove('is-celebrating');
      if(state?.complete && !wasComplete && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        widget.classList.add('is-celebrating');
        setTimeout(()=>widget.classList.remove('is-celebrating'),1300);
      }
    }
    wasComplete=Boolean(state?.complete); previous=message;
  };
  render(null,false);
  return (cart,notify)=>{const state=goalState(cart,target,afterDiscount);if(state)render(state,notify);};
};

export const initShippingGoal = () => {
  const hosts=[...document.querySelectorAll('[data-shipping-goal]')];
  if(!hosts.length || document.documentElement.dataset.shippingReady)return;
  document.documentElement.dataset.shippingReady='true';
  const widget=document.querySelector('[data-shipping-widget]');
  const controllers=hosts.map(host=>shippingController(host,host===widget?widget:null)).filter(Boolean);
  if(!controllers.length)return;
  let revision=0,timer,showNotice=false;
  const refresh=(notify=false)=>{
    const current=++revision;showNotice=showNotice||notify;clearTimeout(timer);
    timer=setTimeout(async()=>{
      try{
        const response=await window.salla.cart.details();
        if(current!==revision)return;
        const roots=[response?.data?.cart,response?.cart,response?.data?.data,response?.data,response];
        const cart=roots.find(r=>r && typeof r==='object' && 'sub_total' in r);
        if(cart){controllers.forEach(render=>render(cart,showNotice));showNotice=false;}
      }catch(_){}
    },180);
  };
  const boot=()=>{
    refresh();
    const events=window.salla.cart?.event;
    ['onItemAdded','onItemUpdated','onItemDeleted','onCouponAdded','onCouponDeleted'].forEach(name=>events?.[name]?.(()=>refresh(true)));
    window.salla.event?.cart?.onUpdated?.(()=>refresh(true));
    ['zod:cart-update-success','zod:cart-delete-success'].forEach(name=>document.addEventListener(name,()=>refresh(true)));
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
  };
  window.salla?.onReady?.().then(boot).catch(()=>{});
};
