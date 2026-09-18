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
    // The dock is persistent, so scroll events must not rewrite its class list.
    // Re-measure only when the viewport or the dock's own size changes.
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('orientationchange', schedule, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(dock);
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

    const quantityFrom = value => {
      const number = numeric(value);
      return number == null ? null : Math.max(1, Math.round(number));
    };
    const percentFrom = value => {
      const number = numeric(value);
      return number == null ? null : Math.max(0, Math.min(100, number));
    };
    const normalizeType = offer => String(offer?.offer_type || offer?.type || offer?.offerType || '').toLowerCase();

    const collectTiers = offer => {
      const found = new Map([[1, { quantity: 1, percentage: 0 }]]);
      const put = (quantityValue, percentValue) => {
        const quantity = quantityFrom(quantityValue);
        const percentage = percentFrom(percentValue);
        if (!quantity || quantity <= 1 || !percentage) return;
        const previous = found.get(quantity);
        if (!previous || percentage > previous.percentage) found.set(quantity, { quantity, percentage });
      };

      // Current Merchant API Discount Table shape (2026): `options` + `based_on`.
      (Array.isArray(offer?.options) ? offer.options : []).forEach(option => {
        const applyType = String(option?.discount_apply_type || option?.discount_type || '').toLowerCase();
        if (applyType && !applyType.includes('percent')) return;
        put(
          option?.condition_threshold ?? option?.quantity ?? option?.min_items ?? option?.minimum_quantity,
          option?.discount_amount ?? option?.percentage ?? option?.discount_percentage
        );
      });

      // Older/storefront Discount Table shape.
      const discounts = offer?.details?.discounts || offer?.discounts || offer?.details?.options;
      (Array.isArray(discounts) ? discounts : []).forEach(discount => {
        const applyType = String(discount?.discount_apply_type || discount?.discount_type || '').toLowerCase();
        if (applyType && !applyType.includes('percent')) return;
        put(
          discount?.condition_threshold ?? discount?.quantity ?? discount?.min_items ?? discount?.minimum_quantity,
          discount?.discount_amount ?? discount?.percentage ?? discount?.discount_percentage
        );
      });

      // Tiered-offer shape.
      (Array.isArray(offer?.tiers) ? offer.tiers : []).forEach(tier => {
        const applyType = String(tier?.discount_apply_type || tier?.discount_type || tier?.type || '').toLowerCase();
        if (applyType && !applyType.includes('percent') && numeric(tier?.percentage) == null) return;
        put(
          tier?.condition_threshold ?? tier?.quantity ?? tier?.min_items ?? tier?.minimum_quantity ?? tier?.from,
          tier?.discount_amount ?? tier?.percentage ?? tier?.discount_percentage ?? tier?.value
        );
      });

      // Some Salla storefront builds expose a simple buy/get percentage offer.
      const offerType = normalizeType(offer);
      if (offerType === 'buy_x_get_y' || offerType.includes('buy')) {
        const getType = String(offer?.get?.discount_type || '').toLowerCase();
        if (getType.includes('percent')) {
          const buyQty = quantityFrom(offer?.buy?.quantity ?? offer?.buy?.min_items ?? offer?.min_items_count);
          const getQty = quantityFrom(offer?.get?.quantity) || 0;
          const threshold = buyQty ? Math.max(2, buyQty + (getQty && offer?.get?.products?.length ? 0 : 0)) : null;
          put(threshold, offer?.get?.discount_amount);
        }
      }

      return [...found.values()].sort((a, b) => a.quantity - b.quantity);
    };

    const render = () => {
      list.replaceChildren();
      if (tiers.length < 2) {
        section.hidden = true;
        return;
      }

      const maxPercent = Math.max(...tiers.map(tier => tier.percentage || 0));
      tiers.forEach(tier => {
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

    const offersFromSource = () => {
      const candidates = [source.offersList, source.offers, source.data?.offers, source.offer ? [source.offer] : null];
      return candidates.find(Array.isArray) || [];
    };

    const buildFromSalla = () => {
      const offers = offersFromSource();
      if (!offers.length) return false;

      const supported = offers
        .map(offer => ({ offer, tiers: collectTiers(offer) }))
        .filter(entry => entry.tiers.length > 1)
        .sort((a, b) => Math.max(...b.tiers.map(t => t.percentage)) - Math.max(...a.tiers.map(t => t.percentage)));
      if (!supported.length) return false;

      tiers = supported[0].tiers;
      render();
      return true;
    };

    let attempts = 0;
    const waitForOffers = () => {
      if (buildFromSalla()) return;
      if (attempts++ < 40) window.setTimeout(waitForOffers, 200);
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

    const start = () => {
      bindPrice();
      waitForOffers();
      // Web-component data can arrive after definition/upgrades; retry whenever the
      // host mutates as well as on the timed fallback above.
      try { new MutationObserver(() => buildFromSalla()).observe(source, { childList: true, subtree: true, attributes: true }); } catch (_) {}
    };

    if (window.customElements?.whenDefined) {
      window.customElements.whenDefined('salla-offer').then(start).catch(start);
    } else if (window.salla?.onReady) {
      Promise.resolve(window.salla.onReady()).then(start).catch(start);
    } else start();
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
