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

const initHome = (root = document) => {
  initFaq(root);
  root.querySelectorAll('[data-zod-interactive-showcase]').forEach(initInteractiveShowcase);
};

document.addEventListener('DOMContentLoaded', () => {
  initHome();
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches?.('[data-zod-interactive-showcase]')) initInteractiveShowcase(node);
        initHome(node);
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
