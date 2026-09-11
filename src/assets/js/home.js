if (document.querySelector('lite-youtube')) {
  import('lite-youtube-embed/src/lite-yt-embed.js').catch(() => {});
}

const initFaq = (root = document) => {
  root.querySelectorAll('.zod-faq-item:not([data-zod-faq-ready])').forEach(item => {
    item.dataset.zodFaqReady = 'true';
    item.addEventListener('toggle', () => {
      if (item.open) document.querySelectorAll('.zod-faq-item[open]').forEach(other => { if (other !== item) other.open = false; });
    });
  });
};

const initDualShowcase = (section) => {
  if (!section || section.dataset.zodDualReady === 'true') return;
  section.dataset.zodDualReady = 'true';
  if (!('IntersectionObserver' in window)) {
    section.classList.add('is-visible');
    return;
  }
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    section.classList.add('is-visible');
    observer.disconnect();
  }, { threshold: 0.18 });
  observer.observe(section);
};

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-inview');
    motionObserver.unobserve(entry.target);
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) : null;

const initSectionMotion = (root = document) => {
  const selector = '.zod-section:not(.zod-hero):not(.zod-dual-showcase), .zod-trust-strip';
  const sections = [];
  if (root instanceof Element && root.matches(selector)) sections.push(root);
  root.querySelectorAll?.(selector).forEach(section => sections.push(section));

  sections.forEach(section => {
    if (section.dataset.zodMotionReady === 'true') return;
    section.dataset.zodMotionReady = 'true';
    section.classList.add('zod-motion-ready');
    if (reducedMotionQuery.matches || !motionObserver) section.classList.add('is-inview');
    else motionObserver.observe(section);
  });
};

const initHeroSlider = (slider) => {
  if (!slider || slider.dataset.zodHeroReady === 'true') return;
  slider.dataset.zodHeroReady = 'true';

  let frame = 0;
  const refresh = () => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(() => {
      try { slider.update?.(); } catch (_) {}
      try { slider.swiper?.update?.(); } catch (_) {}
      try { slider.slider?.update?.(); } catch (_) {}
      try { slider.swiper?.loopFix?.(); } catch (_) {}
      try { slider.slider?.loopFix?.(); } catch (_) {}
    });
  };

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(refresh);
    observer.observe(slider);
  }

  window.addEventListener('resize', refresh, { passive: true });
  window.addEventListener('orientationchange', refresh, { passive: true });
  window.setTimeout(refresh, 120);
  window.setTimeout(refresh, 500);
};

const initInteractiveShowcase = (section) => {
  if (!section || section.dataset.zodShowcaseReady === 'true') return;
  section.dataset.zodShowcaseReady = 'true';

  const triggers = [...section.querySelectorAll('[data-zod-feature-trigger]')];
  const panels = [...section.querySelectorAll('[data-zod-feature-panel]')];
  if (!triggers.length || !panels.length) return;

  let activeIndex = 0;
  let timer = null;
  const delay = 3600;

  const activate = (index, userInitiated = false) => {
    activeIndex = (index + triggers.length) % triggers.length;
    triggers.forEach((trigger, i) => {
      const active = i === activeIndex;
      trigger.classList.toggle('is-active', active);
      trigger.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach((panel, i) => panel.classList.toggle('is-active', i === activeIndex));
    if (userInitiated) restart();
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  const start = () => {
    stop();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || triggers.length < 2) return;
    timer = window.setInterval(() => activate(activeIndex + 1), delay);
  };

  const restart = () => start();

  triggers.forEach((trigger, i) => trigger.addEventListener('click', () => activate(i, true)));
  section.addEventListener('mouseenter', stop);
  section.addEventListener('mouseleave', start);
  section.addEventListener('focusin', stop);
  section.addEventListener('focusout', (event) => {
    if (!section.contains(event.relatedTarget)) start();
  });
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

  activate(0);
  start();
};

const initLaserShowcase = (section) => {
  if (!section || section.dataset.zodLaserReady === 'true') return;
  section.dataset.zodLaserReady = 'true';

  const triggers = [...section.querySelectorAll('[data-zod-laser-trigger]')];
  const panels = [...section.querySelectorAll('[data-zod-laser-panel]')];
  if (!triggers.length || triggers.length !== panels.length) return;

  let activeIndex = 0;
  let isVisible = true;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const number = value => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    if (typeof value === 'string') return Number(value.replace(/[^0-9.\-]/g, '')) || 0;
    if (value && typeof value === 'object') return number(value.amount ?? value.value ?? value.price);
    return 0;
  };
  const imageUrl = value => typeof value === 'string' ? value : (value?.url || value?.original || value?.medium || value?.small || value?.thumbnail || '');
  const money = value => {
    try { return salla.money(value); } catch (_) { return String(value || ''); }
  };
  const unwrap = response => {
    const candidates = [response?.data?.product, response?.data, response?.product, response];
    return candidates.find(value => value && typeof value === 'object' && (value.id || value.name)) || null;
  };

  const applyProduct = (productId, product) => {
    if (!product) return;

    const name = product.name || section.dataset.labelError;
    const sale = number(product.sale_price);
    const regular = number(product.regular_price);
    const base = number(product.price);
    const current = sale > 0 ? sale : base;
    const image = imageUrl(product.image) || product.thumbnail || imageUrl(product.images?.[0]);
    const isOut = product.status === 'out' || product.status === 'out-and-notify' || product.is_available === false;

    panels.forEach((panel, index) => {
      if (panel.dataset.productId !== String(productId)) return;
      const trigger = triggers[index];
      panel.querySelector('[data-zod-laser-name]').textContent = name;
      panel.querySelector('[data-zod-laser-price]').textContent = money(current);
      const regularNode = panel.querySelector('[data-zod-laser-regular]');
      regularNode.hidden = !(regular > current && current > 0);
      regularNode.textContent = regularNode.hidden ? '' : money(regular);
      const stock = panel.querySelector('[data-zod-laser-stock]');
      stock.classList.toggle('is-available', !isOut);
      stock.querySelector('[data-zod-laser-stock-label]').textContent = isOut ? section.dataset.labelUnavailable : section.dataset.labelAvailable;

      const link = panel.querySelector('[data-zod-laser-link]');
      const productUrl = typeof product.url === 'string' ? product.url : (product.url?.url || product.link);
      link.href = productUrl || `/product/${productId}`;
      link.removeAttribute('aria-disabled');
      const mediaImage = panel.querySelector('[data-zod-laser-image]');
      const video = panel.querySelector('[data-zod-laser-video]');
      if (image) {
        if (mediaImage && !mediaImage.src) { mediaImage.src = image; mediaImage.hidden = false; mediaImage.alt = name; }
        if (video && !video.poster) video.poster = image;
        const thumb = trigger.querySelector('[data-zod-laser-thumb]');
        if (thumb && !thumb.src) { thumb.src = image; thumb.hidden = false; }
      }
      trigger.querySelector('[data-zod-laser-trigger-name]').textContent = name;
      trigger.querySelector('[data-zod-laser-trigger-price]').textContent = money(current);

      const host = panel.querySelector('[data-zod-laser-add]');
      const button = document.createElement('salla-add-product-button');
      button.setAttribute('fill', 'solid');
      button.setAttribute('product-id', productId);
      button.setAttribute('product-status', product.status || (isOut ? 'out' : 'sale'));
      button.setAttribute('product-type', product.type || 'product');
      button.textContent = product.add_to_cart_label || section.dataset.labelAdd;
      host.replaceChildren(button);
      panel.classList.remove('is-loading');
    });
  };

  const loadProducts = async () => {
    if (!window.salla?.product?.getDetails) return;
    const ids = [...new Set(panels.map(panel => panel.dataset.productId).filter(Boolean))];
    await Promise.all(ids.map(async productId => {
      try { applyProduct(productId, unwrap(await salla.product.getDetails(productId))); }
      catch (_) {
        panels.filter(panel => panel.dataset.productId === productId).forEach(panel => {
          panel.querySelector('[data-zod-laser-name]').textContent = section.dataset.labelError;
        });
      }
    }));
  };

  const syncVideo = () => {
    panels.forEach((panel, index) => {
      const video = panel.querySelector('[data-zod-laser-video]');
      if (!video) return;
      const shouldPlay = index === activeIndex && isVisible && !document.hidden && !reducedMotion.matches;
      if (shouldPlay) {
        if (!video.src && video.dataset.videoSrc) video.src = video.dataset.videoSrc;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  };

  const activate = (index, { focus = false, scroll = false } = {}) => {
    activeIndex = (index + triggers.length) % triggers.length;
    panels.forEach((panel, panelIndex) => {
      const active = panelIndex === activeIndex;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
    triggers.forEach((trigger, triggerIndex) => {
      const active = triggerIndex === activeIndex;
      trigger.classList.toggle('is-active', active);
      trigger.setAttribute('aria-selected', active ? 'true' : 'false');
      trigger.tabIndex = active ? 0 : -1;
    });
    if (focus) triggers[activeIndex].focus({ preventScroll: true });
    if (scroll) triggers[activeIndex].scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
    syncVideo();
  };

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => activate(index, { scroll: true }));
    trigger.addEventListener('keydown', event => {
      const rtl = document.documentElement.dir === 'rtl';
      let nextIndex = null;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = triggers.length - 1;
      if (event.key === 'ArrowRight') nextIndex = index + (rtl ? -1 : 1);
      if (event.key === 'ArrowLeft') nextIndex = index + (rtl ? 1 : -1);
      if (nextIndex === null) return;
      event.preventDefault();
      activate(nextIndex, { focus: true, scroll: true });
    });
  });

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    isVisible = entries.some(entry => entry.isIntersecting);
    syncVideo();
  }, { threshold: 0.18 }) : null;
  observer?.observe(section);
  document.addEventListener('visibilitychange', syncVideo);
  reducedMotion.addEventListener?.('change', syncVideo);
  activate(0);
  if (window.salla?.onReady) window.salla.onReady().then(loadProducts).catch(() => {});
  else document.addEventListener('zod::ready', loadProducts, { once: true });
};

const initProductSwitcher = (section) => {
  if (!section || section.dataset.zodProductSwitcherReady === 'true') return;
  section.dataset.zodProductSwitcherReady = 'true';

  const tabsRail = section.querySelector('[data-zod-product-switcher-tabs]');
  const tabs = [...section.querySelectorAll('[data-zod-product-switcher-tab]')];
  const panels = [...section.querySelectorAll('[data-zod-product-switcher-panel]')];
  if (!tabs.length || tabs.length !== panels.length) return;

  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let autoplayTimer = 0;
  let autoplayResumeTimer = 0;

  const findSliderApi = (panel) => {
    if (!panel) return null;
    const productSliders = [...panel.querySelectorAll('salla-products-slider')];
    for (const productsSlider of productSliders) {
      const inner = productsSlider.shadowRoot?.querySelector?.('salla-slider');
      const candidates = [
        productsSlider.swiper,
        productsSlider.slider,
        inner?.swiper,
        inner?.slider
      ].filter(Boolean);
      const api = candidates.find(candidate => typeof candidate?.slideNext === 'function');
      if (api) return api;
    }
    const direct = panel.querySelector('salla-slider');
    return [direct?.swiper, direct?.slider].find(candidate => typeof candidate?.slideNext === 'function') || null;
  };

  const refreshPanel = (panel) => {
    const refresh = () => {
      panel?.querySelectorAll('salla-slider').forEach(slider => {
        try { slider.update?.(); } catch (_) {}
        try { slider.swiper?.update?.(); } catch (_) {}
        try { slider.slider?.update?.(); } catch (_) {}
      });

      panel?.querySelectorAll('salla-products-slider').forEach(productsSlider => {
        try { productsSlider.update?.(); } catch (_) {}
        try { productsSlider.swiper?.update?.(); } catch (_) {}
        try { productsSlider.slider?.update?.(); } catch (_) {}

        const innerSlider = productsSlider.shadowRoot?.querySelector?.('salla-slider');
        if (innerSlider) {
          try { innerSlider.update?.(); } catch (_) {}
          try { innerSlider.swiper?.update?.(); } catch (_) {}
          try { innerSlider.slider?.update?.(); } catch (_) {}
        }
      });
    };

    requestAnimationFrame(() => requestAnimationFrame(() => {
      refresh();
      window.dispatchEvent(new Event('resize'));
    }));
    window.setTimeout(refresh, 220);
    window.setTimeout(refresh, 700);
  };

  const centerTab = (tab, smooth = true) => {
    if (!tabsRail || !tab || tabsRail.scrollWidth <= tabsRail.clientWidth + 4) return;
    const railRect = tabsRail.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    const delta = (tabRect.left + tabRect.width / 2) - (railRect.left + railRect.width / 2);
    if (Math.abs(delta) < 4) return;
    tabsRail.scrollBy({ left: delta, behavior: smooth ? 'smooth' : 'auto' });
  };

  const sectionIsVisible = () => {
    const rect = section.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };

  const stopAutoplay = () => {
    window.clearInterval(autoplayTimer);
    autoplayTimer = 0;
  };

  const advanceMobileSlider = () => {
    if (!mobileQuery.matches || reducedMotionQuery.matches || document.hidden || !sectionIsVisible()) return;
    const api = findSliderApi(panels[activeIndex]);
    if (!api) return;
    try {
      if (api.isEnd && typeof api.slideTo === 'function') api.slideTo(0);
      else api.slideNext();
    } catch (_) {}
  };

  const startAutoplay = () => {
    stopAutoplay();
    window.clearTimeout(autoplayResumeTimer);
    autoplayResumeTimer = 0;
    if (!mobileQuery.matches || reducedMotionQuery.matches || document.hidden) return;
    autoplayTimer = window.setInterval(advanceMobileSlider, 4400);
  };

  const pauseForInteraction = () => {
    stopAutoplay();
    window.clearTimeout(autoplayResumeTimer);
    autoplayResumeTimer = window.setTimeout(startAutoplay, 6500);
  };

  const classifyBannerVideo = video => {
    const showcase = video.closest('[data-zod-product-switcher-showcase]');
    if (!showcase) return;
    const applyFit = () => {
      const width = Number(video.videoWidth) || 0;
      const height = Number(video.videoHeight) || 0;
      if (!width || !height) return;
      const videoRatio = width / height;
      const layoutRatio = Math.min(3.2, Math.max(1.25, videoRatio));
      showcase.style.setProperty('--zod-video-aspect', String(layoutRatio));
      showcase.dataset.zodVideoFit = videoRatio < 1.2 ? 'portrait' : 'natural';
    };
    if (video.readyState >= 1) applyFit();
    else video.addEventListener('loadedmetadata', applyFit, { once: true });
  };

  panels.forEach(panel => {
    const video = panel.querySelector('[data-zod-product-switcher-video]');
    if (video) classifyBannerVideo(video);
  });

  const syncBannerVideos = (activePanel = panels[activeIndex]) => {
    panels.forEach(panel => {
      const video = panel.querySelector('[data-zod-product-switcher-video]');
      if (!video) return;
      const shouldPlay = panel === activePanel && !document.hidden && !reducedMotionQuery.matches && sectionIsVisible();
      if (!shouldPlay) {
        try { video.pause(); } catch (_) {}
        return;
      }
      try {
        video.muted = true;
        const playPromise = video.play?.();
        playPromise?.catch?.(() => {});
      } catch (_) {}
    });
  };

  const activate = (index, { focus = false, scroll = false } = {}) => {
    const nextIndex = (index + tabs.length) % tabs.length;
    const nextPanel = panels[nextIndex];
    const nextTab = tabs[nextIndex];

    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === nextIndex;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;
    });

    panels.forEach((panel, panelIndex) => {
      const active = panelIndex === nextIndex;
      panel.hidden = !active;
      panel.setAttribute('aria-hidden', active ? 'false' : 'true');
      panel.classList.toggle('is-active', active);
    });

    activeIndex = nextIndex;
    if (focus) nextTab.focus({ preventScroll: true });
    if (scroll) centerTab(nextTab, true);
    refreshPanel(nextPanel);
    syncBannerVideos(nextPanel);
    startAutoplay();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index, { scroll: true }));
    tab.addEventListener('keydown', event => {
      const rtl = document.documentElement.dir === 'rtl';
      let nextIndex = null;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (event.key === 'ArrowRight') nextIndex = index + (rtl ? -1 : 1);
      if (event.key === 'ArrowLeft') nextIndex = index + (rtl ? 1 : -1);
      if (event.key === 'Enter' || event.key === ' ') nextIndex = index;
      if (nextIndex === null) return;
      event.preventDefault();
      activate(nextIndex, { focus: true, scroll: true });
    });
  });

  section.addEventListener('pointerdown', pauseForInteraction, { passive: true });
  section.addEventListener('touchstart', pauseForInteraction, { passive: true });
  section.addEventListener('wheel', pauseForInteraction, { passive: true });
  section.addEventListener('zod:product-switcher-refresh', () => {
    refreshPanel(panels[activeIndex]);
    startAutoplay();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
    syncBannerVideos();
  });
  mobileQuery.addEventListener?.('change', startAutoplay);
  reducedMotionQuery.addEventListener?.('change', () => {
    startAutoplay();
    syncBannerVideos();
  });
  window.addEventListener('load', () => {
    refreshPanel(panels[activeIndex]);
    syncBannerVideos();
    startAutoplay();
  }, { once: true });

  const bannerObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) syncBannerVideos();
    else panels.forEach(panel => panel.querySelector('[data-zod-product-switcher-video]')?.pause?.());
  }, { threshold: 0.08 }) : null;
  bannerObserver?.observe(section);

  activate(0);
};

const initHome = (root = document) => {
  initFaq(root);
  initSectionMotion(root);
  root.querySelectorAll('.zod-hero-slider').forEach(initHeroSlider);
  root.querySelectorAll('[data-zod-dual-showcase]').forEach(initDualShowcase);
  root.querySelectorAll('[data-zod-interactive-showcase]').forEach(initInteractiveShowcase);
  root.querySelectorAll('[data-zod-laser-showcase]').forEach(initLaserShowcase);
  root.querySelectorAll('[data-zod-product-switcher]').forEach(initProductSwitcher);
};

document.addEventListener('DOMContentLoaded', () => {
  initHome();
  let queued = false;
  const pending = new Set();
  const flush = () => {
    queued = false;
    pending.forEach(node => {
      if (!node.isConnected) return;
      if (node.matches?.('[data-zod-dual-showcase]')) initDualShowcase(node);
      if (node.matches?.('[data-zod-interactive-showcase]')) initInteractiveShowcase(node);
      if (node.matches?.('[data-zod-laser-showcase]')) initLaserShowcase(node);
      if (node.matches?.('[data-zod-product-switcher]')) initProductSwitcher(node);
      initHome(node);
    });
    pending.clear();
  };
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(node => { if (node instanceof HTMLElement) pending.add(node); });
    }
    if (!queued && pending.size) {
      queued = true;
      requestAnimationFrame(flush);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
