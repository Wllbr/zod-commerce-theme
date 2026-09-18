# v1.7.21 Fix Audit

This release addresses the two live storefront failures shown in the Salla preview screenshots.

## 1. Arabic card actions were still on the right

The exact cause was found: earlier direction rules mixed physical `left` / `right` declarations with logical `inset-inline-start` / `inset-inline-end` declarations set to `auto`. In RTL those logical declarations map back onto the same physical sides and, because they were written later at the same `!important` priority, they cancelled the intended physical position.

v1.7.21 removes that conflict. The card resolves its own storefront language direction, stores `data-zpc-dir`, writes only physical left/right positions inline with `!important`, and keeps matching physical CSS fallbacks:

- Arabic / RTL: wishlist heart = left 7px, quick add = left 8px, body text = right aligned.
- English / LTR: wishlist heart = right 7px, quick add = right 8px, body text = left aligned.
- Active wishlist SVG is filled and stroked ZOD red.

A headless Chromium layout check measured the controls against the actual card media box in both directions and passed 100 consecutive direction cycles.

## 2. Discounted product could render a blank page

The previous product Twig formatted `product.discount_percentage` using `replace` / `round`. Salla documents this field as a percentage string, while real payloads can also surface numeric-looking values. Type-sensitive server-side formatting can therefore abort Twig rendering before any page HTML reaches the browser.

v1.7.21 removes all discount arithmetic/string conversion from Twig. Twig now passes raw sale, regular and discount values through data attributes. `product-runtime-compat.js` normalizes digits and money/percent strings, computes a fallback percentage when necessary, and rounds the visible label in JavaScript (`خصم 30%` / `30% OFF`). Variant price updates use the same formatter.

The product gallery keeps Salla's uploaded-product-video contract exactly as `data-type="{{ image.video_type ?? 'image' }}"`.

## Component routing

All standard `salla-products-slider` / `salla-products-list` Twig routes audited in the theme explicitly use `product-card-component="custom-salla-product-card"`, including Product Type Switcher. Laser Showcase is intentionally untouched because it uses its own approved design.

## Verification

- Normal validation/regression/CSS-budget suite: pass after the final patch.
- Critical source/public parity and Twig/card assertions: 100 consecutive passes.
- Headless Chromium RTL/LTR physical-layout + active-heart check: 100 consecutive cycles, both Arabic and English each cycle.
- Final archive is checked separately for integrity, forbidden development folders, and Salla upload size.

A live Salla server render still has to be confirmed by uploading the ZIP to the Salla preview, because the local environment cannot execute Salla's hosted Twilight renderer.
