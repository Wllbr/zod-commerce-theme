(() => {
  const ready = callback => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, { once: true });
    else callback();
  };

  const numeric = value => {
    const number = Number(value?.amount ?? value);
    return Number.isFinite(number) ? number : null;
  };

  const money = value => {
    if (typeof window.salla?.money === 'function') return window.salla.money(value);
    return String(value ?? '');
  };

  const localized = (ar, en) => document.documentElement.lang?.toLowerCase().startsWith('ar') ? ar : en;

  const setQuantity = async (input, value) => {
    if (!input) return;
    try {
      if (typeof input.setValue === 'function') await input.setValue(value);
      else input.value = value;
    } catch (_) {
      input.value = value;
    }
    input.setAttribute('value', String(value));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const initPersistentDock = page => {
    const dock = page.querySelector('[data-zod-sticky-buy]');
    if (!dock) return;

    dock.dataset.zodStickyEnabled = '1';
    dock.classList.add('zod-dock-persistent-v1726', 'is-docked', 'is-ready');
    document.body.classList.add('zod-product-dock-always');

    const measure = () => {
      const height = Math.ceil(dock.getBoundingClientRect().height || 0);
      if (height > 0) document.documentElement.style.setProperty('--zod-product-dock-height', `${height}px`);
    };

    const enforce = () => {
      if (!dock.classList.contains('zod-dock-persistent-v1726') || !dock.classList.contains('is-docked') || !dock.classList.contains('is-ready')) {
        dock.classList.add('zod-dock-persistent-v1726', 'is-docked', 'is-ready');
      }
      if (!document.body.classList.contains('zod-product-dock-always')) document.body.classList.add('zod-product-dock-always');
      measure();
    };

    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        enforce();
      });
    };

    enforce();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('orientationchange', schedule, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(dock);

    // Older product.js builds may remove is-docked when the inline controls are visible.
    // Keep this release's persistent dock authoritative without replacing Salla's form logic.
    new MutationObserver(schedule).observe(dock, { attributes: true, attributeFilter: ['class'] });
  };

  const initVolumeOffers = page => {
    const section = page.querySelector('[data-zod-volume-offers]');
    const source = section?.querySelector('salla-offer');
    const list = section?.querySelector('[data-zod-volume-tier-list]');
    const quantityInput = page.querySelector('salla-quantity-input[data-testid="store-product-quantity"]');
    if (!section || !source || !list || !quantityInput) return;

    let basePrice = numeric(section.dataset.zodUnitPrice);
    let tiers = [];
    let selectedQuantity = 1;

    const render = () => {
      list.replaceChildren();
      if (!tiers.length) {
        section.hidden = true;
        return;
      }

      const maxPercent = Math.max(...tiers.map(tier => tier.percentage || 0));
      tiers.forEach((tier, index) => {
        const quantity = tier.quantity;
        const percent = tier.percentage;
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'zod-volume-tier';
        card.classList.toggle('has-discount', percent > 0);
        card.dataset.quantity = String(quantity);
        card.setAttribute('aria-pressed', quantity === selectedQuantity ? 'true' : 'false');
        card.classList.toggle('is-selected', quantity === selectedQuantity);

        const radio = document.createElement('span');
        radio.className = 'zod-volume-tier__radio';
        radio.setAttribute('aria-hidden', 'true');

        const copy = document.createElement('span');
        copy.className = 'zod-volume-tier__copy';
        const title = document.createElement('strong');
        title.textContent = quantity === 1
          ? localized('قطعة واحدة', 'One piece')
          : quantity === 2
            ? localized('قطعتان', '2 pieces')
            : localized(`${quantity} قطع`, `${quantity} pieces`);
        const description = document.createElement('small');
        description.textContent = quantity === 1
          ? localized('جرّبها الآن', 'Try it now')
          : localized(`اشترِ ${quantity} ووفّر ${percent}% على كل قطعة`, `Buy ${quantity} and save ${percent}% on each item`);
        copy.append(title, description);

        const price = document.createElement('span');
        price.className = 'zod-volume-tier__price';
        if (basePrice != null) {
          const unitPrice = basePrice * (1 - percent / 100);
          const current = document.createElement('b');
          current.innerHTML = money(unitPrice);
          const per = document.createElement('small');
          per.textContent = localized('/ قطعة', '/ item');
          price.append(current, per);
          if (percent > 0) {
            const before = document.createElement('del');
            before.innerHTML = money(basePrice);
            price.append(before);
          }
        }

        if (percent > 0) {
          const saving = document.createElement('span');
          saving.className = 'zod-volume-tier__saving';
          saving.textContent = localized(`توفير ${percent}% / قطعة`, `Save ${percent}% / item`);
          copy.insertBefore(saving, description);
        }

        if (percent > 0) {
          const ribbon = document.createElement('span');
          ribbon.className = 'zod-volume-tier__ribbon';
          ribbon.textContent = percent === maxPercent
            ? localized('الأوفر', 'Best saving')
            : localized('وفر أكثر', 'Save more');
          card.append(ribbon);
        }

        card.append(radio, copy, price);
        card.addEventListener('click', async () => {
          selectedQuantity = quantity;
          await setQuantity(quantityInput, quantity);
          render();
        });
        list.append(card);
      });
      section.hidden = false;
    };

    const buildFromSalla = () => {
      const offers = Array.isArray(source.offersList) ? source.offersList : [];
      const offer = offers.find(item => item?.type === 'discounts_table' && Array.isArray(item?.details?.discounts) && item.details.discounts.length);
      if (!offer) return false;

      const seen = new Map([[1, { quantity: 1, percentage: 0 }]]);
      offer.details.discounts.forEach(discount => {
        const quantity = Math.max(1, Math.round(numeric(discount.quantity) || 0));
        const percentage = Math.max(0, numeric(discount.percentage) || 0);
        if (quantity > 1 && percentage > 0) seen.set(quantity, { quantity, percentage });
      });
      tiers = [...seen.values()].sort((a, b) => a.quantity - b.quantity);
      if (tiers.length < 2) return false;
      render();
      return true;
    };

    let attempts = 0;
    const waitForOffers = () => {
      if (buildFromSalla()) return;
      if (attempts++ < 18) window.setTimeout(waitForOffers, 180);
      else section.hidden = true;
    };

    quantityInput.addEventListener('change', event => {
      const next = Math.max(1, Math.round(numeric(event.detail?.value ?? quantityInput.value ?? quantityInput.getAttribute('value')) || 1));
      selectedQuantity = next;
      if (tiers.length) render();
    });

    const bindPrice = () => {
      window.salla?.product?.event?.onPriceUpdated?.(response => {
        const data = response?.data || response;
        const next = numeric(data?.price);
        if (next != null && next > 0) {
          basePrice = next;
          if (tiers.length) render();
        }
      });
    };

    if (window.salla?.onReady) Promise.resolve(window.salla.onReady()).then(() => { bindPrice(); waitForOffers(); }).catch(waitForOffers);
    else waitForOffers();
  };

  ready(() => {
    if (window.__zodPurchaseV1726Initialized) return;
    window.__zodPurchaseV1726Initialized = true;
    const page = document.querySelector('[data-zod-product-page]');
    if (!page) return;
    initPersistentDock(page);
    initVolumeOffers(page);
  });
})();
