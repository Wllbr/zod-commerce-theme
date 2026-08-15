# ZOD Commerce v1.5.2 — Cart Total & Checkout Handoff

## What changed

- Mobile cart now keeps the live cart total visible next to the checkout action.
- The sticky mobile checkout area uses a two-part layout: total + primary checkout CTA.
- Total is refreshed from Salla Cart Details / cart summary after quantity and delete operations.
- Added a short secure-checkout reassurance line without replacing any Salla checkout logic.
- Desktop cart summary also exposes the grand total explicitly before Salla's native cart summary card.

## Important Salla boundary

The hosted Salla checkout/payment screen is not a Twilight theme page. Twilight's documented theme pages include Cart and Thank You, but do not include a checkout Twig template. Therefore the theme can redesign the cart and the transition into checkout, but it should not add a fake `checkout.twig` or attempt to replace Salla's payment/address/shipping flow.

Keep these in Salla Dashboard because they directly affect the checkout experience:

- Store logo and identity
- Primary store/theme color
- Enabled payment methods
- Shipping companies and rates
- Customer address/location settings
- Pickup/branch settings
- Coupon/payment restrictions

## Mobile test

1. Add several products.
2. Open cart at 360–430 px width.
3. Confirm the total is visible without scrolling.
4. Change item quantities and confirm the total refreshes.
5. Delete an item and confirm the total refreshes.
6. Tap Checkout and verify Salla's checkout opens normally.
