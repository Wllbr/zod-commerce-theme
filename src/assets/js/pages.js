document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-accordion-trigger]').forEach(btn=>btn.addEventListener('click',()=>btn.closest('[data-accordion]')?.classList.toggle('is-open')));
});
