document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-accordion-trigger]').forEach(btn=>btn.addEventListener('click',()=>btn.closest('[data-accordion]')?.classList.toggle('is-open')));

  const cartPage=document.querySelector('[data-zod-cart-page]');
  if(!cartPage) return;

  const totalNodes=[...document.querySelectorAll('[data-zod-cart-grand-total]')];
  let activeCartItem=null;
  let mutationFallbackTimer=null;
  const findCartItem=event=>{
    const path=typeof event?.composedPath==='function'?event.composedPath():[];
    for(const node of path){
      if(node?.matches?.('[data-zod-cart-item]')) return node;
      const item=node?.closest?.('[data-zod-cart-item]'); if(item) return item;
    }
    return event?.target?.closest?.('[data-zod-cart-item]')||null;
  };
  const beginItemUpdate=item=>{
    if(!item) return;
    activeCartItem=item;
    item.classList.remove('is-updated');
    item.classList.add('is-updating');
    clearTimeout(mutationFallbackTimer);
    mutationFallbackTimer=setTimeout(()=>finishItemUpdate(item),1800);
  };
  const finishItemUpdate=(item=activeCartItem)=>{
    if(!item) return;
    item.classList.remove('is-updating');
    item.classList.add('is-updated');
    setTimeout(()=>item.classList.remove('is-updated'),720);
    if(activeCartItem===item) activeCartItem=null;
  };

  const moneyNumber=value=>{
    if(value===null||value===undefined||value==='') return null;
    if(typeof value==='number') return Number.isFinite(value)?value:null;
    if(typeof value==='string'){
      const normalized=value.replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[^0-9.\-]/g,'');
      const n=Number(normalized); return Number.isFinite(n)?n:null;
    }
    if(typeof value==='object'){
      for(const key of ['amount','value','total','total_price','grand_total']){
        const n=moneyNumber(value?.[key]); if(n!==null) return n;
      }
    }
    return null;
  };
  const extractTotal=payload=>{
    const roots=[payload?.data?.data,payload?.data,payload,payload?.cart,payload?.data?.cart].filter(Boolean);
    for(const root of roots){
      for(const key of ['total','total_price','grand_total']){
        const n=moneyNumber(root?.[key]); if(n!==null) return n;
      }
      const n=moneyNumber(root?.summary?.total); if(n!==null) return n;
    }
    try{
      const summary=salla.storage.get('cart.summery')||salla.storage.get('cart.summary')||{};
      return moneyNumber(summary.total);
    }catch(_){return null;}
  };
  const paintTotal=value=>{
    if(!totalNodes.length) return;
    const amount=moneyNumber(value); if(amount===null) return;
    let formatted=String(amount);
    try{formatted=salla.money(amount);}catch(_){}
    totalNodes.forEach(node=>{
      if(node.innerHTML!==formatted){
        node.innerHTML=formatted;
        const host=node.closest('.zod-cart-grand-total,.zod-cart-mobile-checkout__meta')||node;
        host.classList.remove('is-total-updated');
        void host.offsetWidth;
        host.classList.add('is-total-updated');
        setTimeout(()=>host.classList.remove('is-total-updated'),620);
      }
    });
  };
  let timer;
  const refresh=()=>{
    clearTimeout(timer);
    timer=setTimeout(async()=>{
      try{
        const details=await salla.cart.details();
        const total=extractTotal(details);
        if(total!==null) paintTotal(total);
      }catch(_){
        const total=extractTotal(null);
        if(total!==null) paintTotal(total);
      }
    },260);
  };
  const boot=()=>{
    const stored=extractTotal(null); if(stored!==null) paintTotal(stored);
    refresh();
    salla.cart?.event?.onItemAdded?.(refresh);
    salla.cart?.event?.onItemDeleted?.(()=>{finishItemUpdate();refresh();});
    salla.cart?.event?.onDetailsFetched?.(response=>{const total=extractTotal(response);if(total!==null)paintTotal(total);});
  };
  if(window.salla?.onReady) window.salla.onReady().then(boot).catch(()=>{}); else boot();

  document.addEventListener('change',event=>{
    const path=typeof event.composedPath==='function'?event.composedPath():[];
    const isCartChange=path.some(node=>node?.matches?.('.zod-cart-item, salla-quantity-input, form[id^="item-"]')) || event.target?.closest?.('.zod-cart-item, form[id^="item-"]');
    if(isCartChange){beginItemUpdate(findCartItem(event));refresh();}
  },true);
  document.addEventListener('zod:cart-update-success',()=>{finishItemUpdate();refresh();});
  document.addEventListener('zod:cart-delete-success',refresh);
});
