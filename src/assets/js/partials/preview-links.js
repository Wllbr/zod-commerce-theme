const PREVIEW_HOST = 'salla.design';
const DEMO_HOST = 'demostore.salla.sa';

const isDraftPath = pathname => pathname
  .split('/')
  .filter(Boolean)
  .some(segment => segment.startsWith('dev-'));

const isThemeEditorFrame = (documentLike, windowLike) => {
  const referrer = String(documentLike?.referrer || '');
  if (/^https:\/\/s\.salla\.sa\/themes\/editor\//i.test(referrer)) return true;
  try {
    return [...(windowLike?.location?.ancestorOrigins || [])]
      .some(origin => /^https:\/\/s\.salla\.sa$/i.test(origin));
  } catch (_) {
    return false;
  }
};

export function normalizePreviewStoreUrl(href, locationLike, documentLike = {}, windowLike = {}) {
  if (!href || !locationLike?.href) return href;

  let target;
  try {
    target = new URL(href, locationLike.href);
  } catch (_) {
    return href;
  }

  const currentHost = String(locationLike.hostname || '').toLowerCase();
  const isPreview = currentHost === PREVIEW_HOST || currentHost.endsWith(`.${PREVIEW_HOST}`)
    || isThemeEditorFrame(documentLike, windowLike);
  if (!isPreview || target.hostname.toLowerCase() !== DEMO_HOST || !isDraftPath(target.pathname)) return href;

  target.protocol = 'https:';
  target.host = PREVIEW_HOST;
  if (!target.search && currentHost.includes(PREVIEW_HOST) && locationLike.search) {
    target.search = locationLike.search;
  }
  return target.toString();
}

// Only opt-in category links within this store may inherit the page locale.
// External destinations and another draft/store are never rewritten.
export function normalizeCategoryLocale(href, locationLike, language) {
  if (!['ar', 'en'].includes(language)) return href;
  try {
    const current = new URL(locationLike.href);
    const target = new URL(href, current);
    if (target.origin !== current.origin || !/^https?:$/.test(target.protocol)) return href;
    const currentParts = current.pathname.split('/').filter(Boolean);
    const targetParts = target.pathname.split('/').filter(Boolean);
    if (!['ar', 'en'].includes(targetParts[0]) || !/\/c\d+\/?$/.test(target.pathname)) return href;
    if (current.hostname === PREVIEW_HOST || current.hostname.endsWith(`.${PREVIEW_HOST}`)) {
      if (!currentParts[1]?.startsWith('dev-') || targetParts[1] !== currentParts[1]) return href;
    }
    targetParts[0] = language;
    target.pathname = '/' + targetParts.join('/');
    return target.toString();
  } catch (_) { return href; }
}

export function installPreviewLinkRouting(documentLike = document, windowLike = window) {
  const locationLike = windowLike.location;
  const route = anchor => {
    if (!anchor?.href) return;
    let routed = normalizePreviewStoreUrl(anchor.href, locationLike, documentLike, windowLike);
    if (anchor.hasAttribute?.('data-zod-category-link')) {
      routed = normalizeCategoryLocale(routed, locationLike, documentLike.documentElement.lang);
    }
    if (routed !== anchor.href) {
      anchor.href = routed;
      anchor.dataset.zodPreviewRouted = '1';
    }
  };
  const scan = root => {
    if (root?.matches?.('a[href]')) route(root);
    root?.querySelectorAll?.('a[href]').forEach(route);
  };

  scan(documentLike);
  documentLike.addEventListener('click', event => route(event.target.closest?.('a[href]')), true);
  const observer = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(scan)));
  observer.observe(documentLike.documentElement, { childList: true, subtree: true });
  return observer;
}
