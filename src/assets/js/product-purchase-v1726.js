(() => {
  const ready = callback => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, { once: true });
    else callback();
  };

  const initPersistentDock = page => {
    const dock = page.querySelector('[data-zod-sticky-buy]');
    if (!dock || dock.dataset.zodStickyEnabled === '0') return;

    dock.dataset.zodStickyEnabled = '1';
    dock.classList.add('zod-dock-persistent-v1726', 'is-docked', 'is-ready');
    document.body.classList.add('zod-product-dock-always');

    const measure = () => {
      const height = Math.ceil(dock.getBoundingClientRect().height || 0);
      if (height > 0) document.documentElement.style.setProperty('--zod-product-dock-height', `${height}px`);
    };

    const enforce = () => {
      if (!dock.classList.contains('zod-dock-persistent-v1726') || !dock.classList.contains('is-docked') || !dock.classList.contains('is-ready')) {
        dock.classList.add('zod-dock-persistent-v1726', 'is-docked', 'is-ready');
      }
      if (!document.body.classList.contains('zod-product-dock-always')) document.body.classList.add('zod-product-dock-always');
      measure();
    };

    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        enforce();
      });
    };

    enforce();
    // The dock is persistent, so scroll events must not rewrite its class list.
    // Re-measure only when the viewport or the dock's own size changes.
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('orientationchange', schedule, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(dock);
  };

  ready(() => {
    if (window.__zodPurchaseV1726Initialized) return;
    window.__zodPurchaseV1726Initialized = true;
    const page = document.querySelector('[data-zod-product-page]');
    if (!page) return;
    initPersistentDock(page);
    // Promotional content and eligibility are rendered by the native salla-offer component.
  });
})();
