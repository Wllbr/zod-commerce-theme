import 'fslightbox';
document.addEventListener('DOMContentLoaded',()=>{
  const tabs=document.querySelector('.zod-product-tabs');
  if(tabs){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){tabs.querySelectorAll('a').forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')==='#'+entry.target.id));}}),{rootMargin:'-25% 0px -60%'});
    document.querySelectorAll('#description,#delivery,#reviews,#specifications').forEach(el=>observer.observe(el));
  }
});
