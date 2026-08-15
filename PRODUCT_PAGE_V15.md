# ZOD Commerce v1.5 — Product Page Pass

This release rebuilds the product detail flow around the purchase pattern requested for ZOD while preserving Salla-native product state and checkout behavior.

## Product information order

1. Brand
2. VAT context
3. Product title
4. Rating
5. Price / sale price
6. Live availability pulse
7. Product description with Read More / Show Less
8. Product facts: category, weight, SKU/model, sold count when Salla permits it
9. Installments / location availability
10. Product options and purchase controls
11. Trust / gifting / quick order
12. Technical specifications and shipping
13. Reviews and related products

## Live availability

- Green pulsing indicator = product/add-button status is `sale`.
- Red pulsing indicator = `out` or `out-and-notify`.
- Product option changes are watched through Salla's `salla-product-options` `changed` event and `hasOutOfStockOption()` method.
- The Salla add-product button `product-status` attribute is also observed so the visual badge follows Salla's actual purchasability state.

## Sticky purchase dock

The normal purchase controls stay in the page until the customer scrolls past them. Then the same form controls become a fixed purchase dock:

- Desktop: product price + quantity + Add to Cart / native quick-buy behavior.
- Mobile: compact price + quantity + Add to Cart, positioned above the ZOD bottom navigation.
- The original form remains the source of selected options and quantity; nothing is duplicated into a separate fake purchase form.

## Description

The product description now sits directly below price/availability, matching the preferred discovery-to-purchase flow. Products marked by Salla as having long descriptions receive a compact Read More / Show Less treatment.
