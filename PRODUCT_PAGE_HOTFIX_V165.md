# ZOD Commerce v1.6.5 — Product Page Runtime Hotfix

This release is based directly on v1.6.3, the last known-good product page.

## Fixes

1. Restored the v1.6.3 Twig price expressions. The v1.6.4 numeric coercion expressions were removed.
2. Added a scoped CSS fallback so `.price_is_on_sale.hidden` or `.starting-or-normal-price.hidden` is actually hidden. This removes the stray zero-price branch without changing Salla's price data.
3. Wishlist buttons use a JS listener. Guests open the existing `<salla-login-modal>`; signed-in customers use Salla's native wishlist API.
