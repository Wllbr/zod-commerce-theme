# ZOD Commerce 1.9.8 — manual free-shipping goal

21 September 2026. Requested change: replace eligibility-dependent shipping UI with a merchant-managed amount and editable messages. Review branch only. No live publication or shipping-rule edits.

## Changes

- One shared manual target controls the floating icon, hero tile and standalone homepage component. Default 350 in store currency; no cart.free_shipping_bar dependency.
- Merchant can edit target, initial message, remaining message, success message, supporting terms, truck/completion symbols, notifications, campaign visibility and whether discounts reduce progress.
- Default calculation: cart product subtotal minus discounts, excluding shipping/payment fees. Remaining amount and progress update on native cart additions, quantities, removal and coupon events. The circle and bar fill, switch to the completion icon and show the success message at the target. Decreasing the cart reverses completion.
- Message placeholders: {remaining} and {target}. Copy is rendered as text, avoiding HTML execution. Currency formatting uses Salla's text money formatter.
- Automatic notices last 5.5 seconds and pause for keyboard focus. Manual opening stays open. Reduced-motion preference disables the celebration animation.
- Invalid/zero target or disabled master campaign hides every shipping surface. Failed and incomplete cart requests preserve the last confirmed progress; stale responses cannot overwrite newer ones.

## Verification

Full production build and automated suite passed: 141 inputs and 20 outputs match the production manifest; 79 Twig templates, 36 custom components and 347 translation references validated. CSS unchanged: 396065 raw / 64958 gzip app, 38753 raw / 7134 gzip refinement, 72092 combined gzip. Webpack's two existing raw-size advisories remain.

Shipping tests cover editable thresholds 350/500, Arabic digits, discount basis, empty cart, exact decimal boundary, invalid inputs, currency amount objects, custom text, campaign/notification switches, stale and failed responses, popup focus and timers. Existing approval, cart, offer, purchase, laser and notification regression checks pass.

Code b9a75b1 was pushed to codex/zod-1.9.0-review. Native draft 1546873372 loaded matching app.css. The existing cart exceeded 350: the homepage and floating popup showed a full bar, celebration icon and “مبروك! شحنك مجاني 🎉”; the visible progress attribute was 100. Component catalog includes “هدف الشحن المجاني — إعداد يدوي”. No cart quantities or contents were changed during this revision.

## Editor limitation and remaining checks

The native design-options page remained on three loading placeholders, including after one reload. Therefore saving a different target/custom message through Salla's editor was not verified. The fields are in twilight.json; instructions are in STORE_SETUP.md. Automated tests verify their runtime behavior, but native save/reload and a below-target-to-complete cart transition still need a working settings form. No other browser mechanism or private API was used to bypass the stalled form.

This is a manual promotional display. It does not change checkout fees, carrier/address/weight restrictions or Salla rules. The merchant must align the actual shipping offer with the configured message and amount. Unlike v1.9.7, changing or disabling a Salla rule alone does not automatically change this manual campaign.

Prior general storefront blockers remain: original live 1.8.0 error trace, full desktop/English/physical-device/accessibility/performance audit, final empty-cart reload notice, saved homepage copy/arrangement and enabled installment/review data. This focused revision does not certify a whole-store 9/10 or marketplace approval. All three approval guards remain intact.
