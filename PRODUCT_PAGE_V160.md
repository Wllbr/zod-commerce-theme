# ZOD Commerce v1.6.0 — Salla-native Product Page

This release rebuilds the product page around Salla's real product/store data instead of duplicating merchant settings in the theme.

## Salla-controlled data respected

- Brand and brand logo
- Product title/subtitle
- Taxable/VAT state
- Product price, sale price and starting price
- Product options and option availability
- Stock status and notify-when-available state
- Remaining quantity only when Salla allows it
- Sold quantity only when Salla allows it
- Category, SKU/model and weight
- Product metadata/specifications
- Installment methods
- Branch/product availability
- Product reviews only when enabled in store rating settings
- Giftability
- Quick order
- Related products
- Product offers
- Notes, uploads, size guide and bundles when present

## Theme-controlled presentation

- Responsive desktop/mobile product hierarchy
- Gallery layout and image fit
- Description directly below price/availability
- Compact product facts
- Green/red pulsing availability state
- Immediate sticky purchase dock when the theme sticky-purchase setting is enabled
- Product image + title + live mirrored price in the dock
- Quantity + Add to Cart + Salla Quick Buy
- Mobile-safe placement above ZOD bottom navigation
- Technical specifications and support sections

## Test checklist

Test at least:

1. A normal in-stock product.
2. An out-of-stock product with notify availability.
3. A product with variants/options where one option is out of stock.
4. A discounted product.
5. A product with metadata/specifications.
6. A product with Tabby/Tamara installment eligibility.
7. Arabic and English.
8. Desktop and mobile widths.
9. Add to Cart and Buy Now.
10. Product with reviews enabled/disabled from Salla.
