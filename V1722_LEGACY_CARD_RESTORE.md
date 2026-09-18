# v1.7.22 — v1.7.13 product card restoration

This release restores the exact shared product-card source from ZOD Commerce v1.7.13 while retaining later non-card fixes.

- Source restored byte-for-byte from the v1.7.13 project snapshot.
- `product-card-marketplace.js` runtime override removed from the layout and package.
- Marketplace webpack entry removed so future builds cannot re-enable the rejected card renderer.
- Standard product surfaces continue to use `custom-salla-product-card`, so the restored card applies consistently across homepage product sections, product type switcher, catalog, brands, wishlist, cart recommendations and related products.
- Product-page Twig safety, uploaded product video support, and discount runtime compatibility remain from v1.7.21.
