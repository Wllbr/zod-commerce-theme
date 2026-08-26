# Catalog + Brand + Purchase Repair — v1.6.34

This pass repairs category and brand page rendering and restores the product-page purchase experience.

## Catalog
- No-filter category pages use the full content width instead of the reserved 250px filter track.
- Product listing grid is 4 columns desktop, 3 tablet, 2 mobile.
- Category listings use `custom-salla-product-card`.
- Generic editor previews tolerate missing category/page context.

## Brands
- Brand index handles Salla's grouped-by-letter `brands` collection.
- Brand product pages use ZOD product cards.
- Product cards and product pages show logos only; no logo means no brand area.

## Product cards
- Brand logo, product title, rating/meta and price are centered.
- Failed logo images remove their own logo slot instead of leaving an empty gap.

## Product page
- A single brand exploration card is above the title.
- Add to Cart and Buy Now are separate actions when Salla quick-buy is available.
- Sticky purchase controls are restored regardless of stale saved sticky settings.

## Information pages
- Customized information pages now render `information_page.information_page`.
- Standard information pages keep the ZOD content layout and comments.

- Applied the same custom ZOD product card to category, brand, landing-page, and wishlist product lists for consistent centered titles/prices and logo-only branding.
