# ZOD Commerce v1.5.1 — Cart & Mobile Navigation

## Cart
- Product rows use compact ZOD cards on mobile and roomy technical-commerce cards on desktop.
- Salla's native quantity, offers, options, coupons, loyalty, gifting and cart-summary components remain the source of truth.
- Mobile has a fixed **Checkout / إتمام الطلب** bar above the bottom navigation.

## Mobile language selector
The theme instantiates Salla's `<salla-localization-modal>` only once. The desktop/mobile ZOD language buttons call that component's official `open()` method. This avoids duplicate localization components while keeping language/currency changes available on phones.

## Test checklist
1. Add 2–4 products.
2. Change a quantity and remove one item.
3. Verify the Salla summary updates.
4. On mobile, verify the red checkout button remains visible above the bottom dock.
5. Tap the language control and switch Arabic/English.
6. Confirm RTL/LTR and currency stay correct.
