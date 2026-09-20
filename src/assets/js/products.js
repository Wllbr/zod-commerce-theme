import { containDialogFocus } from './partials/dialog-focus';

// The native list/filter components own the request and filtering state. These
// controls enhance navigation; they never fetch product details for list cards.
document.addEventListener('DOMContentLoaded', () => {
  const filter = document.getElementById('zod-filters');
  const desktop = window.matchMedia('(min-width: 1024px)');
  const triggers = [...document.querySelectorAll('[data-filter-open]')];
  let returnFocus = null;
  const syncPanel = () => {
    if (!filter) return;
    const opened = !desktop.matches && filter.classList.contains('is-open');
    filter.inert = !desktop.matches && !opened;
    if (filter.inert) filter.setAttribute('aria-hidden', 'true');
    else filter.removeAttribute('aria-hidden');
    if (opened) { filter.setAttribute('role', 'dialog'); filter.setAttribute('aria-modal', 'true'); }
    else { filter.removeAttribute('role'); filter.removeAttribute('aria-modal'); }
    document.body.classList.toggle('zod-filter-open', opened);
    triggers.forEach(button => button.setAttribute('aria-expanded', String(opened)));
  };
  const close = (restore = true) => {
    const opened = filter?.classList.contains('is-open');
    // Restore focus before hiding the focused subtree from assistive technology.
    if (opened && restore && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    filter?.classList.remove('is-open');
    syncPanel();
    returnFocus = null;
  };
  const open = () => {
    if (!filter || desktop.matches) return;
    returnFocus = document.activeElement;
    filter.classList.add('is-open'); filter.tabIndex = -1;
    syncPanel();
    (filter.querySelector('[data-filter-close]') || filter).focus();
  };
  syncPanel();
  triggers.forEach(button => button.addEventListener('click', open));
  document.querySelectorAll('[data-filter-close]').forEach(button => button.addEventListener('click', () => close()));
  desktop.addEventListener('change', () => {
    const focusWasInside = filter?.contains(document.activeElement);
    if (focusWasInside && !desktop.matches) triggers[0]?.focus({ preventScroll: true });
    close(false);
    if (focusWasInside && desktop.matches) { filter.tabIndex = -1; filter.focus({ preventScroll: true }); }
  });
  document.addEventListener('keydown', event => {
    if (!filter?.classList.contains('is-open') || desktop.matches) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    containDialogFocus(event, filter);
  });
  // `changed` is the public component event. Also handle the SDK event used by
  // Twilight's list; neither handler resets or reconstructs selected filters.
  const filterChanged = () => { if (!desktop.matches && filter?.classList.contains('is-open')) close(); };
  filter?.querySelector('salla-filters')?.addEventListener('changed', filterChanged);
  const bind = () => window.salla?.event?.on?.('salla-filters::changed', filterChanged);
  if (window.salla?.onReady) Promise.resolve(window.salla.onReady()).then(bind).catch(() => {});
  else document.addEventListener('zod::ready', bind, { once: true });

  const list = document.querySelector('salla-products-list');
  const sort = document.getElementById('product-filter');
  const recovery = document.querySelector('[data-zod-catalog-recovery]');
  const retry = recovery?.querySelector('[data-zod-catalog-retry]');
  const loading = document.querySelector('[data-zod-catalog-loading]');
  const count = document.querySelector('[data-zod-catalog-count]');
  let busy = false;
  const setBusy = value => {
    busy = value;
    if (sort) sort.disabled = value;
    if (retry) retry.disabled = value;
    if (loading) loading.hidden = !value;
    list?.setAttribute('aria-busy', String(value));
  };
  const syncList = () => {
    if (!list) return;
    // Do not inspect product names for words like "failed": they are not errors.
    const failed = Boolean(list.querySelector('.s-infinite-scroll-error,.s-products-list-error'));
    if (recovery && !busy) recovery.hidden = !failed;
    const cards = list.querySelectorAll('custom-salla-product-card,salla-product-card');
    if (count) {
      const value = cards.length ? `${cards.length} ${count.dataset.label || ''}`.trim() : '';
      if (count.textContent !== value) count.textContent = value;
    }
  };
  if (list) { new MutationObserver(syncList).observe(list, { childList: true, subtree: true }); syncList(); }
  sort?.addEventListener('change', async () => {
    const value = sort.value;
    if (busy || ![...sort.options].some(option => option.value === value)) return;
    const url = new URL(window.location.href);
    url.searchParams.set('sort', value);
    url.searchParams.delete('page');
    if (typeof list?.reload !== 'function') { window.location.assign(url.toString()); return; }
    setBusy(true);
    if (recovery) recovery.hidden = true;
    try {
      // Keep search terms, other URL parameters and native filter state intact.
      window.history.replaceState(window.history.state, '', url.toString());
      list.sortBy = value;
      await list.reload();
    } catch (_) {
      // A full navigation is the non-JS-equivalent recovery path, not a second API client.
      window.location.assign(url.toString());
    } finally { setBusy(false); syncList(); }
  });
  retry?.addEventListener('click', async () => {
    if (busy) return;
    if (typeof list?.reload !== 'function') { window.location.reload(); return; }
    setBusy(true); recovery.hidden = true;
    try { await list.reload(); }
    catch (_) { window.location.reload(); }
    finally { setBusy(false); syncList(); }
  });
});
