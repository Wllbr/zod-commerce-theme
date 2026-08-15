# ZOD Commerce v1.4.0 — Mobile Commerce Pass

## What changed

- Phone header search icon is hidden; the bottom navigation owns mobile search.
- Header cart is count-only: no cart price/value is rendered.
- The cart badge stays hidden at zero and appears only when quantity is greater than zero.
- Add-to-cart feedback includes product-card confirmation, image fly-to-cart motion, cart bump, and count badge pop.
- Selected homepage product shelves use compact mobile carousels with two visible cards.
- Featured custom product carousels no longer use the previous 72vw single-card mobile width.
- Product cards use smaller image padding, badges, wishlist control, title, price, and spacing on phones.

## Test on mobile

1. Empty cart: no red `0` badge.
2. Header: no duplicate search button at the top.
3. Add a product: product image flies toward cart, cart animates, badge becomes `1`.
4. Add more: badge updates to `2`, `3`, etc.
5. Product shelves: two product cards are visible at once on standard phone widths.
6. Swipe product rails manually and verify autoplay continues afterward.
7. Remove cart items and verify badge returns to hidden at zero.
