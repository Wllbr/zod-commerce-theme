# ZOD Commerce v1.6.38 — Salla-native behavior pass

This release keeps ZOD's visual customization while moving core commerce actions back toward Salla/Twilight native behavior.

## Native sources of truth

- Product listings: `salla-products-list` / `salla-products-slider`
- Wishlist mutations: `salla.wishlist.toggle(String(productId))`
- Product details used by Quick View: `salla.product.getDetails(String(productId))`
- Quantity controls: `salla-quantity-input`
- Cart/quick-buy actions: `salla-add-product-button` with native `quick-buy` where eligible
- VAT state/text: `product.is_taxable` + `pages.products.tax_included`

## ZOD-owned presentation

- Six-card desktop density and responsive card sizing
- Eye + Heart interaction layout
- Compact Quick View modal
- Red semantic wishlist active state
- Persistent purchase dock positioning/layout
- ZOD typography, spacing, badges and motion

The goal is to avoid duplicate commerce logic while keeping the custom storefront design.
