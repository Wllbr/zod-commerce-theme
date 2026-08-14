document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.zod-faq-item').forEach(item=>item.addEventListener('toggle',()=>{
    if(item.open) document.querySelectorAll('.zod-faq-item[open]').forEach(other=>{if(other!==item) other.open=false;});
  }));
});
