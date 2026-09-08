const SEARCH_CARD_SELECTOR = '.s-search-grid-item';
const INTERACTIVE_SELECTOR = 'a,button,input,select,textarea,summary,[role="button"],[role="link"]';

export const getSearchCardLink = card => {
  if (!card?.querySelector) return null;
  return card.querySelector('salla-search-product-card a[href], a[href]')
    || card.querySelector('salla-search-product-card')?.shadowRoot?.querySelector('a[href]')
    || null;
};

export const shouldOpenSearchCard = (path, card) => !path.some(node =>
  node !== card && node?.matches?.(INTERACTIVE_SELECTOR)
);

export function installSearchCardNavigation(root = document, browserWindow = window) {
  const decorate = card => {
    if (!card || card.dataset.zodCardLink === '1') return;
    const link = getSearchCardLink(card);
    if (!link) return;
    card.dataset.zodCardLink = '1';
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    const label = link.getAttribute('aria-label') || link.textContent?.trim();
    if (label) card.setAttribute('aria-label', label);
  };

  const scan = scope => {
    if (scope?.matches?.(SEARCH_CARD_SELECTOR)) decorate(scope);
    decorate(scope?.closest?.(SEARCH_CARD_SELECTOR));
    scope?.querySelectorAll?.(SEARCH_CARD_SELECTOR).forEach(decorate);
  };

  root.addEventListener('click', event => {
    const path = event.composedPath?.() || [];
    const card = path.find(node => node?.matches?.(SEARCH_CARD_SELECTOR))
      || event.target?.closest?.(SEARCH_CARD_SELECTOR);
    if (!card || !shouldOpenSearchCard(path, card)) return;
    const link = getSearchCardLink(card);
    if (!link?.href) return;
    browserWindow.location.assign(link.href);
  });

  root.addEventListener('keydown', event => {
    if (!['Enter', ' '].includes(event.key)) return;
    const card = event.target?.closest?.(SEARCH_CARD_SELECTOR);
    if (!card || event.target !== card) return;
    const link = getSearchCardLink(card);
    if (!link?.href) return;
    event.preventDefault();
    browserWindow.location.assign(link.href);
  });

  scan(root);
  if ('MutationObserver' in browserWindow) {
    new browserWindow.MutationObserver(records => records.forEach(record =>
      record.addedNodes.forEach(node => node.nodeType === 1 && scan(node))
    )).observe(root.documentElement || root, { childList: true, subtree: true });
  }
}
