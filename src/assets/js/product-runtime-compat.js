(() => {
  const start = () => {
    const page = document.querySelector('[data-zod-product-page]');
    if (!page) return;

    const mainPrice = page.querySelector('[data-zod-main-price]');
    const discountBadge = page.querySelector('[data-zod-discount]');
    const saleBranch = mainPrice?.querySelector('.price_is_on_sale');
    const normalBranch = mainPrice?.querySelector('.starting-or-normal-price');
    const outOfStock = page.querySelector('[data-testid="store-product-out-of-stock"]');
    const stock = page.querySelector('[data-zod-stock-status]');

    // Keep invalid/empty sale payloads out of the UI without performing any numeric
    // comparisons in Twig. Salla allows product.price to be the string "-".
    if (mainPrice?.dataset.zodIsOnSale === '1') {
      const salePrice = Number(mainPrice.dataset.zodSalePrice);
      if (!Number.isFinite(salePrice) || salePrice <= 0) {
        saleBranch?.classList.add('hidden');
        normalBranch?.classList.remove('hidden');
      }
    }

    const bind = () => {
      if (window.__zodProductNativePriceCompatBound || !window.salla) return;
      window.__zodProductNativePriceCompatBound = true;

      const setStock = available => {
        if (!stock) return;
        const pulse = stock.querySelector('.zod-live-stock__pulse');
        const label = stock.querySelector('[data-zod-stock-text]');
        pulse?.classList.toggle('is-available', available);
        pulse?.classList.toggle('is-out', !available);
        if (label) label.textContent = available ? stock.dataset.inLabel : stock.dataset.outLabel;
        stock.dataset.status = available ? 'sale' : 'out';
      };

      window.salla.event?.on?.('product::price.updated.failed', () => {
        mainPrice?.classList.add('hidden');
        outOfStock?.classList.remove('hidden');
        outOfStock?.setAttribute('aria-hidden', 'false');
        setStock(false);
      });

      window.salla.product?.event?.onPriceUpdated?.(response => {
        const data = response?.data || response;
        if (!data) return;

        mainPrice?.classList.remove('hidden');
        outOfStock?.classList.add('hidden');
        outOfStock?.setAttribute('aria-hidden', 'true');
        mainPrice?.querySelector('.starting-price-title')?.classList.add('hidden');

        const numeric = value => Number(value?.amount ?? value);
        const price = numeric(data.price);
        const regularPrice = numeric(data.regular_price);
        const saleFlag = data.has_sale_price ?? data.is_on_sale;
        const isOnSale = (saleFlag == null || Boolean(saleFlag))
          && Number.isFinite(price)
          && Number.isFinite(regularPrice)
          && regularPrice > price;
        const money = value => typeof window.salla.money === 'function'
          ? window.salla.money(value)
          : String(value ?? '');

        page.querySelectorAll('.total-price').forEach(element => {
          element.innerHTML = money(data.price);
        });
        page.querySelectorAll('.before-price').forEach(element => {
          element.innerHTML = money(data.regular_price);
        });
        page.querySelectorAll('.product-weight').forEach(element => {
          element.textContent = data.weight ?? '';
        });
        page.querySelectorAll('.product-sku').forEach(element => {
          element.textContent = data.sku ?? '';
        });

        saleBranch?.classList.toggle('hidden', !isOnSale);
        normalBranch?.classList.toggle('hidden', isOnSale);
      });

      const form = page.querySelector('.product-form');
      form?.addEventListener('change', () => {
        const elements = [...(form.elements || [])];
        const isComplete = elements.every(element => !element.willValidate || element.validity?.valid !== false);
        if (!isComplete || typeof window.salla.product?.getPrice !== 'function') return;
        Promise.resolve(window.salla.product.getPrice(new FormData(form))).catch(() => {});
      });
    };

    const bindDiscountOnly = () => {
      if (window.__zodProductDiscountCompatBound || !window.salla || !discountBadge) return;
      window.__zodProductDiscountCompatBound = true;
      window.salla.product?.event?.onPriceUpdated?.(response => {
        const data = response?.data || response;
        if (!data) return;
        const numeric = value => Number(value?.amount ?? value);
        const price = numeric(data.price);
        const regularPrice = numeric(data.regular_price);
        const saleFlag = data.has_sale_price ?? data.is_on_sale;
        const isOnSale = (saleFlag == null || Boolean(saleFlag))
          && Number.isFinite(price)
          && Number.isFinite(regularPrice)
          && regularPrice > price;
        const percent = isOnSale ? Math.round(((regularPrice - price) / regularPrice) * 100) : 0;
        discountBadge.classList.toggle('hidden', !(percent > 0));
        discountBadge.textContent = percent > 0
          ? (document.documentElement.lang?.toLowerCase().startsWith('ar') ? `خصم ${percent}%` : `${percent}% OFF`)
          : '';
      });
    };

    const bindAll = () => { bindDiscountOnly(); bind(); };

    if (window.salla?.onReady) {
      Promise.resolve(window.salla.onReady()).then(bindAll).catch(() => bindAll());
    } else {
      bindAll();
      document.addEventListener('theme::ready', bindAll, { once: true });
      document.addEventListener('zod::ready', bindAll, { once: true });
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
