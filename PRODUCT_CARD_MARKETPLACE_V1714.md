# Product Card Marketplace v1.7.14

## Visual
- Noon-style compact marketplace card for Arabic and English.
- Green Best Seller badge from Salla product tags.
- Promotion title in a solid ZOD red strip.
- Minimal wishlist heart and square `+` purchase/option action.
- Three-line title, compact rating, strong current price, old price and real discount percentage.
- Product images remain `contain` so technical products are not cropped.

## Data rules
- `show_tags` controls whether the Best Seller tag can appear.
- Recognized Best Seller tag names include common Arabic and English variants.
- Promotion strip uses Salla promotion title only.
- No fake delivery countdown, free-delivery claim or best-price claim is generated.

## Navigation fix
- Uses direct `product.url` when present.
- Also accepts `product.urls.customer`, `customer_url`, `permalink` and `link`.
- If a listing payload has no storefront URL, the card resolves current product details through `salla.product.getDetails()` and updates all card links before navigating.
