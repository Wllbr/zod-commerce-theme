# ZOD Commerce v1.6.4 — Product Price & Wishlist Fix

## Runtime problems fixed

### Discounted product showing an extra zero price
The product template now normalizes `sale_price`, `regular_price`, and `starting_price` before selecting the visible price state. A sale is valid only when the sale value is greater than zero and lower than the regular value.

The release also includes an explicit `.hidden` fallback for the two mutually-exclusive price blocks in both source SCSS and the packaged `public/app.css`. This prevents editor/runtime CSS gaps from displaying both the sale block and the normal-price block at the same time.

### Wishlist alert for guests
Direct inline calls to `salla.wishlist.toggle` were removed from all three product-page heart buttons. The product page now checks the Salla customer session first:

- Guest: opens the existing native `<salla-login-modal>` and does not call the wishlist API.
- Signed in: uses `salla.wishlist.toggle`, then synchronizes the heart state across the gallery, mobile gallery and buybox controls.

Custom product cards use the same guest-safe pattern.

## Files changed

- `src/views/pages/product/single.twig`
- `src/assets/js/product.js`
- `src/assets/js/partials/product-card.js`
- `src/assets/styles/app.scss`
- `public/app.css`
- `package.json`
- `CHANGELOG.md`
