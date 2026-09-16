(() => {
  const start = () => {
    const page = document.querySelector('[data-zod-product-page]');
    if (!page || window.__zodProductNativePriceCompatBound) return;

    const mainPrice = page.querySelector('[data-zod-main-price]');
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

        const price = Number(data.price);
        const regularPrice = Number(data.regular_price);
        const isOnSale = Boolean(data.has_sale_price)
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

    if (window.salla?.onReady) {
      Promise.resolve(window.salla.onReady()).then(bind).catch(() => bind());
    } else {
      bind();
      document.addEventListener('theme::ready', bind, { once: true });
      document.addEventListener('zod::ready', bind, { once: true });
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
