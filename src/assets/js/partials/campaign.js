export const initCampaign = section => {
  if (section.dataset.campaignReady) return;
  section.dataset.campaignReady = 'true';
  const slides = [...section.querySelectorAll('[data-campaign-slide]')];
  const dots = [...section.querySelectorAll('[data-campaign-dot]')];
  const toggle = section.querySelector('[data-campaign-pause]');
  const viewport = section.querySelector('[data-campaign-viewport]');
  const progress = section.querySelector('[data-campaign-progress]');
  if (!viewport || !slides.length) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animations = [];
  let index = 0, timer, paused = section.dataset.autoplay === 'false' || motion.matches;
  let hovered = false, focused = false, visible = true, touchX = null, touchY = null;
  const stop = () => { clearTimeout(timer); timer = null; };
  const schedule = () => {
    stop();
    if (slides.length > 1 && !paused && !hovered && !focused && visible && !document.hidden && !motion.matches && section.isConnected) timer = setTimeout(() => show(index + 1), 6500);
  };
  const updateToggle = () => {
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? section.dataset.play : section.dataset.pause);
    toggle.querySelector('span').textContent = paused ? '▶' : 'Ⅱ';
  };
  const show = next => {
    if (!slides.length) return;
    const previous = index;
    animations.forEach(animation => { animation.onfinish = null; animation.cancel(); });
    animations = [];
    index = (next + slides.length) % slides.length;
    slides.forEach((slide,i) => { slide.hidden = i !== index; slide.inert = i !== index; slide.setAttribute('aria-hidden', String(i !== index)); });
    if (previous !== index && !motion.matches && slides[index].animate) {
      const direction = (document.documentElement.dir === 'rtl' ? 1 : -1) * (next >= previous ? 1 : -1);
      const outgoing = slides[previous], incoming = slides[index];
      outgoing.hidden = false;
      const options = { duration: 650, easing: 'cubic-bezier(.22,.61,.36,1)' };
      const leave = outgoing.animate([{transform:'translateX(0)'},{transform:`translateX(${direction * 100}%)`}], options);
      const enter = incoming.animate([{transform:`translateX(${-direction * 100}%)`},{transform:'translateX(0)'}], options);
      leave.onfinish = () => { outgoing.hidden = true; };
      animations = [leave, enter];
    }
    dots.forEach((dot,i) => dot.setAttribute('aria-pressed', String(i === index)));
    if (progress) {
      progress.value = String(index + 1);
      progress.setAttribute('aria-valuetext', slides[index].getAttribute('aria-label') || String(index + 1));
    }
    schedule();
  };
  const manual = next => { paused = true; updateToggle(); show(next); };
  section.querySelector('[data-campaign-next]')?.addEventListener('click', () => manual(index + 1));
  section.querySelector('[data-campaign-prev]')?.addEventListener('click', () => manual(index - 1));
  dots.forEach((dot,i) => dot.addEventListener('click', () => manual(i)));
  progress?.addEventListener('input', () => {
    const next = Number(progress.value) - 1;
    if (Number.isInteger(next) && next >= 0 && next < slides.length) manual(next);
  });
  toggle?.addEventListener('click', () => { paused = !paused; updateToggle(); schedule(); });
  section.addEventListener('mouseenter', () => { hovered = true; stop(); });
  section.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  section.addEventListener('focusin', () => { focused = true; stop(); });
  section.addEventListener('focusout', event => { if (!section.contains(event.relatedTarget)) { focused = false; schedule(); } });
  viewport.addEventListener('touchstart', event => { touchX = event.changedTouches[0].clientX; touchY = event.changedTouches[0].clientY; }, {passive:true});
  viewport.addEventListener('touchend', event => {
    if (touchX === null) return;
    const x = event.changedTouches[0].clientX - touchX, y = event.changedTouches[0].clientY - touchY;
    if (Math.abs(x) > 55 && Math.abs(x) > Math.abs(y) * 1.5) manual(index + ((x > 0) === (document.documentElement.dir === 'rtl') ? 1 : -1));
    touchX = touchY = null;
  }, {passive:true});
  viewport.addEventListener('touchcancel', () => { touchX = touchY = null; });
  let drag = null;
  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('a,button')) return;
    drag = {x:event.clientX,y:event.clientY,id:event.pointerId};
    viewport.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });
  viewport.addEventListener('pointerup', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const x = event.clientX - drag.x, y = event.clientY - drag.y;
    drag = null;
    if (Math.abs(x) > 55 && Math.abs(x) > Math.abs(y) * 1.5) manual(index + ((x > 0) === (document.documentElement.dir === 'rtl') ? 1 : -1));
  });
  viewport.addEventListener('pointercancel', () => { drag = null; });
  viewport.addEventListener('lostpointercapture', () => { drag = null; });
  viewport.addEventListener('keydown', event => {
    if (event.key === 'Escape') {paused=true;stop();return;}
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const rtl=document.documentElement.dir==='rtl';
    manual(event.key==='Home'?0:event.key==='End'?slides.length-1:index+((event.key==='ArrowRight')===rtl?-1:1));
  });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener?.('change', () => { if (motion.matches) paused = true; updateToggle(); schedule(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries.some(e=>e.isIntersecting); schedule(); }).observe(section);
  updateToggle(); show(0);
};

export const initBrandWorld = section => {
  if (section.dataset.worldReady) return;
  section.dataset.worldReady = 'true';
  const tabs = [...section.querySelectorAll('[data-world-tab]')];
  const panels = [...section.querySelectorAll('[data-world-panel]')];
  const show = (index, focus = false) => {
    index = (index + tabs.length) % tabs.length;
    tabs.forEach((tab,i) => { tab.setAttribute('aria-selected',String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    panels.forEach((panel,i) => { panel.hidden = i !== index; });
    const template = panels[index]?.querySelector('[data-world-products]');
    if (template) template.replaceWith(template.content.cloneNode(true));
    if (focus) tabs[index].focus();
  };
  tabs.forEach((tab,i) => {
    tab.addEventListener('click',()=>show(i));
    tab.addEventListener('keydown',event=>{
      const rtl = document.documentElement.dir === 'rtl';
      const next = {Home:0,End:tabs.length-1,ArrowRight:i+(rtl?-1:1),ArrowLeft:i+(rtl?1:-1)}[event.key];
      if (next !== undefined) { event.preventDefault(); show(next,true); }
    });
  });
  if (tabs.length) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(e => e.isIntersecting)) return;
        const active = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
        show(active < 0 ? 0 : active); observer.disconnect();
      }, {rootMargin:'160px 0px'});
      observer.observe(section);
    } else show(0);
  }
};
