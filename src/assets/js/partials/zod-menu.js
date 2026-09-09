import { containDialogFocus } from './dialog-focus';

class ZodMainMenu extends HTMLElement {
  connectedCallback() {
    window.zodMenuSource = this;
    const hydrateFooter = () => {
      if (!document.querySelector('[data-zod-footer-categories]')) return;
      this.loadFooterCategories().then(items => this.renderFooterCategories(items)).catch(() => this.renderFooterCategories([]));
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hydrateFooter, { once: true });
    else requestAnimationFrame(hydrateFooter);
  }

  text(ar, en) {
    return (document.documentElement.lang || '').toLowerCase().startsWith('ar') ? ar : en;
  }

  normalizeMenus(items = []) {
    return (Array.isArray(items) ? items : []).map(item => ({
      title: item?.title || item?.name || '',
      url: item?.url || '#',
      image: item?.image?.url || (typeof item?.image === 'string' ? item.image : ''),
      children: this.normalizeMenus(item?.children || item?.sub_categories || [])
    })).filter(item => item.title);
  }

  readCache() {
    try {
      const value = JSON.parse(sessionStorage.getItem(`zod-menu:${document.documentElement.lang || 'ar'}`) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  }

  writeCache(items) {
    try {
      if (items.length) sessionStorage.setItem(`zod-menu:${document.documentElement.lang || 'ar'}`, JSON.stringify(items));
    } catch (_) {}
    return items;
  }

  fromDocument(root = document) {
    if (!root?.querySelectorAll) return [];
    const links = [...root.querySelectorAll('.zod-category-section .zod-category-card[href]')];
    return links.map(link => ({
      title: link.querySelector('.zod-category-card__name')?.textContent?.trim() || link.getAttribute('aria-label') || '',
      url: link.href || link.getAttribute('href') || '#',
      image: link.querySelector('img')?.currentSrc || link.querySelector('img')?.src || '',
      children: []
    })).filter(item => item.title);
  }

  escape(value = '') {
    return String(value).replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));
  }

  async loadFooterCategories() {
    const cacheKey = `zod-footer-categories:${document.documentElement.lang || 'ar'}`;
    try {
      const cached = JSON.parse(sessionStorage.getItem(cacheKey) || '[]');
      if (Array.isArray(cached) && cached.length) return cached;
    } catch (_) {}

    try {
      await this.waitForSalla();
      await salla.onReady();
      if (typeof salla.product?.categories === 'function') {
        const { data } = await this.withTimeout(salla.product.categories());
        const categories = this.normalizeMenus(data);
        if (categories.length) {
          try { sessionStorage.setItem(cacheKey, JSON.stringify(categories)); } catch (_) {}
          return categories;
        }
      }
    } catch (_) {}

    return this.loadMenus();
  }

  renderFooterCategories(items = []) {
    const box = document.querySelector('[data-zod-footer-categories]');
    if (!box) return;
    const categories = (Array.isArray(items) ? items : []).slice(0, 8);
    if (!categories.length) {
      box.innerHTML = `<p class="zod-footer-category-empty">${this.text('تصفح جميع الأقسام للوصول إلى المنتجات.', 'Browse all categories to find products.')}</p>`;
      return;
    }

    box.innerHTML = categories.map((category, index) => {
      const children = (category.children || []).slice(0, 6);
      const childLinks = children.map(child => `<a href="${this.escape(child.url || '#')}">${this.escape(child.title)}</a>`).join('');
      return `<details class="zod-footer-category-group" data-zod-footer-category open>
        <summary><span>${this.escape(category.title)}</span><i class="sicon-keyboard_arrow_down"></i></summary>
        <div class="zod-footer-category-group__links">
          <a class="zod-footer-category-group__all" href="${this.escape(category.url || '#')}">${this.text('عرض القسم', 'View category')}</a>
          ${childLinks}
        </div>
      </details>`;
    }).join('');

    const media = window.matchMedia('(max-width: 767px)');
    const sync = () => box.querySelectorAll('[data-zod-footer-category]').forEach((group, index) => { group.open = !media.matches || index === 0; });
    sync();
    if (!this.footerMediaBound) {
      media.addEventListener?.('change', sync);
      this.footerMediaBound = true;
    }
  }

  async fromHomepage() {
    if (typeof fetch !== 'function' || typeof DOMParser === 'undefined') return [];
    const homeUrl = this.dataset?.homeUrl || document.querySelector?.('[data-testid="store-header-logo"]')?.href || '/';
    const response = await fetch(homeUrl, { credentials: 'same-origin', headers: { Accept: 'text/html' } });
    if (!response.ok) throw new Error(`Homepage categories unavailable (${response.status})`);
    return this.fromDocument(new DOMParser().parseFromString(await response.text(), 'text/html'));
  }

  withTimeout(promise, timeout = 4500) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Menu request timed out')), timeout))
    ]);
  }

  waitForSalla(timeout = 8000) {
    if (this.readyPromise) return this.readyPromise;
    this.readyPromise = new Promise((resolve, reject) => {
      const started = Date.now();
      const check = () => {
        if (window.salla?.onReady && (window.salla?.api?.component || window.salla?.product?.categories)) return resolve(window.salla);
        if (Date.now() - started >= timeout) { this.readyPromise = null; return reject(new Error('Salla SDK unavailable')); }
        setTimeout(check, 80);
      };
      check();
    });
    return this.readyPromise;
  }

  loadMenus() {
    if (this.menuPromise) return this.menuPromise;
    this.menuPromise = this.waitForSalla()
      .then(() => salla.onReady())
      .then(async () => {
        const cached = this.readCache();
        if (cached.length) return cached;

        const currentPageCategories = this.fromDocument();
        const requests = [];
        if (typeof salla.api?.component?.getMenus === 'function') {
          requests.push(this.withTimeout(salla.api.component.getMenus()).then(({ data }) => {
            const menus = this.normalizeMenus(data);
            if (!menus.length) throw new Error('Main menu is empty');
            return menus;
          }));
        }
        if (typeof salla.product?.categories === 'function') {
          requests.push(this.withTimeout(salla.product.categories()).then(({ data }) => {
            const menus = this.normalizeMenus(data);
            if (!menus.length) throw new Error('Category list is empty');
            return menus;
          }));
        }

        try {
          if (requests.length) return this.writeCache(await Promise.any(requests));
        } catch (_) {}
        if (currentPageCategories.length) return this.writeCache(currentPageCategories);

        const homepageCategories = await this.fromHomepage();
        if (homepageCategories.length) return this.writeCache(homepageCategories);
        throw new Error(this.text('تعذر تحميل الأقسام', 'Could not load categories'));
      })
      .catch(error => { this.menuPromise = null; throw error; });
    return this.menuPromise;
  }
}


if (!customElements.get('zod-main-menu')) customElements.define('zod-main-menu', ZodMainMenu);

const syncOverlayLock = () => {
  const drawerOpen = document.getElementById('zod-catalog-drawer')?.classList.contains('is-open');
  document.documentElement.classList.toggle('zod-lock', Boolean(drawerOpen));
};

const ensureDrawerLayer = () => {
  const drawer = document.getElementById('zod-catalog-drawer');
  // The header lives inside the sticky announcement stack. Keeping the dialog
  // there traps its fixed z-index below that stack on mobile browsers.
  if (drawer && drawer.parentElement !== document.body) document.body.appendChild(drawer);
  return drawer;
};

window.zodMenu = {
  menus: [],
  stack: [],
  lastFocus: null,

  text(ar, en) {
    return (document.documentElement.lang || '').toLowerCase().startsWith('ar') ? ar : en;
  },

  async load() {
    const box = document.getElementById('zod-mobile-menu-content');
    if (!box) return;
    box.innerHTML = `<div class="zod-menu-loading" role="status" aria-label="${this.text('جارٍ تحميل الأقسام', 'Loading categories')}"><span></span><span></span><span></span></div>`;
    try {
      if (!window.zodMenuSource) throw new Error('Menu unavailable');
      this.setMenus(await window.zodMenuSource.loadMenus());
    } catch (_) {
      box.innerHTML = `<div class="zod-menu-message" role="status"><p>${this.text('تعذر تحميل الأقسام. حاول مرة أخرى.', 'Could not load categories. Please try again.')}</p><button type="button" data-zod-menu-retry>${this.text('إعادة المحاولة', 'Try again')}</button></div>`;
      box.querySelector('[data-zod-menu-retry]')?.addEventListener('click', () => this.load());
    }
  },

  setMenus(menus) {
    this.menus = menus || [];
    this.stack = [];
    this.renderLevel(this.menus, null);
  },

  open(trigger) {
    const el = ensureDrawerLayer();
    if (!el) return;
    this.lastFocus = trigger || document.activeElement;
    this.stack = [];
    if (this.menus.length) this.renderLevel(this.menus, null);
    else this.load();
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    trigger?.setAttribute?.('aria-expanded', 'true');
    syncOverlayLock();
    requestAnimationFrame(() => el.querySelector('.zod-overlay-close')?.focus());
  },

  close(restoreFocus = true) {
    const el = document.getElementById('zod-catalog-drawer');
    if (!el) return;
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('.zod-menu-trigger[aria-expanded="true"]').forEach(button => button.setAttribute('aria-expanded', 'false'));
    syncOverlayLock();
    if (restoreFocus) this.lastFocus?.focus?.();
  },

  // Backward-compatible aliases used by the mobile dock.
  openMobile(trigger) { this.open(trigger); },
  closeMobile() { this.close(); },

  esc(value = '') {
    return String(value).replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));
  },

  renderLevel(items, title) {
    const box = document.getElementById('zod-mobile-menu-content');
    if (!box) return;
    if (!items.length) {
      box.innerHTML = `<p class="zod-menu-message" role="status">${this.text('لا توجد أقسام لعرضها حالياً. استخدم البحث للعثور على المنتجات.', 'No categories are available yet. Use search to find products.')}</p>`;
      return;
    }

    const back = this.stack.length
      ? `<button type="button" class="zod-mobile-back" data-zod-back><i class="sicon-keyboard_arrow_right rtl:rotate-180"></i><span>${this.esc(title || '')}</span></button>`
      : '';

    box.innerHTML = `${back}<div class="zod-mobile-level">${(items || []).map((menu, index) => {
      const image = menu.image ? `<img src="${this.esc(menu.image)}" alt="">` : '';
      if (menu.children?.length) {
        return `<div class="zod-mobile-menu-item"><button type="button" data-zod-next="${index}">${image}<span>${this.esc(menu.title || '')}</span><i class="sicon-keyboard_arrow_left rtl:rotate-180"></i></button></div>`;
      }
      return `<div class="zod-mobile-menu-item"><a href="${this.esc(menu.url || '#')}">${image}<span>${this.esc(menu.title || '')}</span></a></div>`;
    }).join('')}</div>`;

    box.querySelectorAll('[data-zod-next]').forEach(button => {
      button.addEventListener('click', () => {
        const menu = (items || [])[Number(button.dataset.zodNext)];
        if (!menu) return;
        this.stack.push({ items, title, index: Number(button.dataset.zodNext) });
        this.renderLevel(menu.children || [], menu.title || '');
        box.querySelector('[data-zod-back]')?.focus();
      });
    });

    box.querySelector('[data-zod-back]')?.addEventListener('click', () => {
      const previous = this.stack.pop();
      if (previous) {
        this.renderLevel(previous.items, previous.title);
        box.querySelector(`[data-zod-next="${previous.index}"]`)?.focus();
      }
    });
  }
};

document.addEventListener('click', event => {
  // The backdrop covers every pixel outside the drawer panel, so clicking anywhere
  // outside the category area behaves exactly like clicking the close X.
  if (event.target.closest('[data-zod-menu-close]')) window.zodMenu?.close();
});

document.addEventListener('keydown', event => {
  const drawer = document.getElementById('zod-catalog-drawer');
  if (drawer?.classList.contains('is-open')) {
    if (event.key === 'Escape') window.zodMenu?.close();
    else containDialogFocus(event, drawer);
  }
});
