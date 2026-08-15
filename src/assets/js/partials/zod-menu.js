class ZodMainMenu extends HTMLElement {
  connectedCallback() {
    this.waitForSalla()
      .then(() => salla.onReady())
      .then(() => salla.api.component.getMenus())
      .then(({ data }) => {
        const menus = Array.isArray(data) ? data : [];
        window.zodMenu?.setMenus(menus);
      })
      .catch(() => window.zodMenu?.setMenus([]));
  }

  waitForSalla(timeout = 8000) {
    return new Promise((resolve, reject) => {
      const started = Date.now();
      const check = () => {
        if (window.salla?.onReady && window.salla?.api?.component) return resolve(window.salla);
        if (Date.now() - started >= timeout) return reject(new Error('Salla SDK unavailable'));
        setTimeout(check, 50);
      };
      check();
    });
  }
}

if (!customElements.get('zod-main-menu')) customElements.define('zod-main-menu', ZodMainMenu);

const syncOverlayLock = () => {
  const drawerOpen = document.getElementById('zod-catalog-drawer')?.classList.contains('is-open');
  const searchOpen = document.getElementById('zod-search-overlay')?.classList.contains('is-open');
  document.documentElement.classList.toggle('zod-lock', Boolean(drawerOpen || searchOpen));
};

window.zodMenu = {
  menus: [],
  stack: [],
  lastFocus: null,

  setMenus(menus) {
    this.menus = menus || [];
    this.stack = [];
    this.renderLevel(this.menus, null);
  },

  open(trigger) {
    const el = document.getElementById('zod-catalog-drawer');
    if (!el) return;
    window.zodTheme?.closeSearch?.(false);
    this.lastFocus = trigger || document.activeElement;
    this.stack = [];
    this.renderLevel(this.menus, null);
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
        this.stack.push({ items, title });
        this.renderLevel(menu.children || [], menu.title || '');
      });
    });

    box.querySelector('[data-zod-back]')?.addEventListener('click', () => {
      const previous = this.stack.pop();
      if (previous) this.renderLevel(previous.items, previous.title);
    });
  }
};

document.addEventListener('click', event => {
  // The backdrop covers every pixel outside the drawer panel, so clicking anywhere
  // outside the category area behaves exactly like clicking the close X.
  if (event.target.closest('[data-zod-menu-close]')) window.zodMenu?.close();
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (document.getElementById('zod-catalog-drawer')?.classList.contains('is-open')) {
    window.zodMenu?.close();
  }
});
