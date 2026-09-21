// The last-item deletion reloads the cart to render its native empty state.
// Carry only a short-lived success flag across that same-page reload.
export const rememberCartRemoval = () => {
  try { sessionStorage.setItem('zod:cart-removed', JSON.stringify({path:location.pathname,at:Date.now()})); } catch (_) {}
};
export const consumeCartRemoval = () => {
  try {
    const value = JSON.parse(sessionStorage.getItem('zod:cart-removed') || 'null');
    sessionStorage.removeItem('zod:cart-removed');
    return value?.path === location.pathname && Date.now() - value.at >= 0 && Date.now() - value.at < 10000;
  } catch (_) { return false; }
};
export const showNotification = (message, type = 'info') => {
  const parsed = new DOMParser().parseFromString(String(message || ''), 'text/html');
  const text = parsed.body.textContent.trim();
  if (!text) return;
  let region = document.getElementById('zod-notifications');
  if (!region) { region=document.createElement('div');region.id='zod-notifications';document.body.appendChild(region); }
  const error = type === 'error';
  // Collapse repeated server errors instead of stacking the same message.
  if ([...region.children].some(node => node.dataset.message === text && !node.classList.contains('is-collapsing'))) return;
  if (!error) region.querySelectorAll('.zod-notice:not(.is-error)').forEach(node=>node.remove());
  while (region.children.length >= 3) region.firstElementChild.remove();
  const notice=document.createElement('div');notice.className=`zod-notice ${error?'is-error':'is-success'}`;notice.dataset.message=text;
  notice.setAttribute('role',error?'alert':'status');
  const icon=document.createElement('i');icon.className=error?'sicon-cancel':'sicon-check-circle';icon.setAttribute('aria-hidden','true');
  const copy=document.createElement('span');copy.textContent=text;
  const close=document.createElement('button');close.type='button';close.textContent='×';
  close.setAttribute('aria-label',document.documentElement.lang.startsWith('ar')?'إغلاق':'Close');
  let timer,removed=false;
  const dismiss=()=>{if(removed)return;removed=true;clearTimeout(timer);notice.classList.add('is-collapsing');setTimeout(()=>notice.remove(),350)};
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(dismiss,error?6500:3500)};
  close.addEventListener('click',dismiss);
  notice.addEventListener('keydown',event=>{if(event.key==='Escape')dismiss()});
  notice.addEventListener('focusin',()=>clearTimeout(timer));
  notice.addEventListener('focusout',event=>{if(!notice.contains(event.relatedTarget))schedule()});
  notice.append(icon,copy,close);region.appendChild(notice);schedule();
};
