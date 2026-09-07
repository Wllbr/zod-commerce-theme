document.addEventListener('DOMContentLoaded',()=>{
  const filter=document.getElementById('zod-filters');
  const open=()=>{filter?.classList.add('is-open');document.body.classList.add('zod-filter-open');};
  const close=()=>{filter?.classList.remove('is-open');document.body.classList.remove('zod-filter-open');};
  document.querySelectorAll('[data-filter-open]').forEach(x=>x.addEventListener('click',open));
  document.querySelectorAll('[data-filter-close]').forEach(x=>x.addEventListener('click',close));
  const sort=document.getElementById('product-filter');
  sort?.addEventListener('change',()=>{
    const url=new URL(window.location.href);url.searchParams.set('sort',sort.value);window.location.href=url.toString();
  });

  const list=document.querySelector('salla-products-list');
  const recovery=document.querySelector('[data-zod-catalog-recovery]');
  const retry=recovery?.querySelector('[data-zod-catalog-retry]');
  const failurePattern=/تعذ(?:ر|ّر)|فشل|failed\s+to\s+load|could\s+not\s+load|try\s+again/i;
  const syncRecovery=()=>{
    if(!list||!recovery) return;
    const hasCards=Boolean(list.querySelector('custom-salla-product-card,salla-product-card,.s-product-card-entry'));
    const failed=Boolean(list.querySelector('.s-infinite-scroll-error,.s-products-list-error,.is-error'))||failurePattern.test(list.textContent||'');
    recovery.hidden=hasCards||!failed;
  };
  if(list&&recovery){
    new MutationObserver(syncRecovery).observe(list,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class']});
    syncRecovery();
  }
  retry?.addEventListener('click',()=>window.location.reload());
});
