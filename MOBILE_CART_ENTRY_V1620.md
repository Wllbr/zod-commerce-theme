# ZOD Commerce v1.6.20 — Mobile Cart Entry

## Result

- Desktop keeps the header cart.
- Mobile keeps the bottom navigation cart.
- The duplicate header cart is hidden at widths up to 767px.
- Salla remains responsible for product submission and live cart data.

## Live verification before release

The current Salla-linked preview accepted a homepage product-card add action, changed the live cart count from 0 to 1, displayed Salla's success confirmation, and rendered that product with its correct total on the cart page.

The v1.6.20 change is limited to removing the duplicate mobile entry; it does not replace or bypass Salla's working cart API.
