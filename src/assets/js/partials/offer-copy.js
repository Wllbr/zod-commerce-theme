// Preserve the actual offer amounts and conditions; never guess the payment method.
export const readableOfferCopy = (text, arabic) => text.replaceAll('{payment_method}', arabic ? 'طريقة الدفع المؤهلة للعرض' : 'the payment method eligible for this offer');
export const initOfferCopy = () => {
  let queued = false;
  const scan = () => {
    queued = false;
    document.querySelectorAll('salla-offer .s-offer-card-description').forEach(node => {
      if (node.textContent.includes('{payment_method}')) node.textContent = readableOfferCopy(node.textContent,document.documentElement.lang.startsWith('ar'));
    });
    document.querySelectorAll('[data-offer-disclosure]').forEach(drawer => {
      const titles = [...new Set([...drawer.querySelectorAll('salla-offer .s-offer-card-title')].map(node=>node.textContent.trim()).filter(Boolean))];
      const hidden = !titles.length;
      if (drawer.hidden !== hidden) drawer.hidden = hidden;
      if (!titles.length) return;
      const title = drawer.querySelector('[data-offer-summary]');
      const text = titles[0] + (titles.length > 1 ? ` (+${titles.length-1})` : '');
      if (title && title.textContent !== text) title.textContent = text;
    });
  };
  new MutationObserver(() => {if(!queued){queued=true;requestAnimationFrame(scan)}}).observe(document.body,{childList:true,subtree:true,characterData:true});
  scan();
};
