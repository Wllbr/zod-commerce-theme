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
  document.addEventListener('visibilitychange', () => document.hidden ? stopAutoplay() : startAutoplay());
  mobileQuery.addEventListener?.('change', startAutoplay);
  reducedMotionQuery.addEventListener?.('change', startAutoplay);
  window.addEventListener('load', () => {
    refreshPanel(panels[activeIndex]);
    startAutoplay();
  }, { once: true });

  activate(0);
};

const initHome = (root = document) => {
  initFaq(root);
  root.querySelectorAll('[data-zod-interactive-showcase]').forEach(initInteractiveShowcase);
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
      if (node.matches?.('[data-zod-interactive-showcase]')) initInteractiveShowcase(node);
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
