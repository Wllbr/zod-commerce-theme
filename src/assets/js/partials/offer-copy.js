// Preserve the actual offer amounts and conditions; never guess the payment method.
export const readableOfferCopy = (text, arabic) => text.replaceAll('{payment_method}', arabic ? 'طريقة الدفع المؤهلة للعرض' : 'the payment method eligible for this offer');
export const initOfferCopy = () => {
  let queued = false;
  const scan = () => {
    queued = false;
    document.querySelectorAll('salla-offer .s-offer-card-description').forEach(node => {
      if (node.textContent.includes('{payment_method}')) node.textContent = readableOfferCopy(node.textContent,document.documentElement.lang.startsWith('ar'));
    });
  };
  new MutationObserver(() => {if(!queued){queued=true;requestAnimationFrame(scan)}}).observe(document.body,{childList:true,subtree:true,characterData:true});
  scan();
};
