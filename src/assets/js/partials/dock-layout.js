// Measure the visible native controls rather than assuming a fixed checkout height.
export const initDockLayout = () => {
  const root = document.documentElement;
  const observed = new WeakSet();
  let frame;
  const measure = () => {
    frame = null;
    const height = selector => Math.ceil(document.querySelector(selector)?.getBoundingClientRect().height || 0);
    const mobile = window.matchMedia('(max-width:1023px)').matches;
    const nav = mobile ? height('.zod-mobile-dock') : 0;
    const action = mobile ? Math.max(height('salla-cart-summary-card'),height('.zod-buy-controls.is-docked')) : 0;
    root.style.setProperty('--zod-navigation-height', `${nav}px`);
    root.style.setProperty('--zod-fixed-action-height', `${action}px`);
  };
  const queue = () => { if (!frame) frame = requestAnimationFrame(measure); };
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(queue) : null;
  const scan = () => {
    document.querySelectorAll('.zod-mobile-dock,salla-cart-summary-card,.zod-buy-controls').forEach(node => {
      if (!observed.has(node)) { observed.add(node); observer?.observe(node); }
    });
    queue();
  };
  // Native cart summary moves to body on mobile; observe its new location too.
  new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('resize',queue,{passive:true});
  scan();
};
