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
});
