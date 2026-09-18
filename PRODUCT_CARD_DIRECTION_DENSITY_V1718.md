# Product Card Direction + Density v1.7.18

- Arabic marketplace cards: wishlist and quick-add controls are locked to the left; title/rating/price remain right aligned.
- English marketplace cards: wishlist and quick-add controls are locked to the right; title/rating/price remain left aligned.
- Wishlist active state now uses a real SVG heart with a solid red fill.
- Promotion strip changed to Noon-like pale pink with red text.
- Audited all normal Salla product slider/list Twig paths to use `custom-salla-product-card`; Laser Showcase remains intentionally independent.
- Desktop density pass widens content containers, shortens compact header/section spacing, reduces card footprint, and shows more products/content at 100% browser zoom.
- Product page desktop layout is more compact while preserving native Salla/Raed hooks and product behavior.
- Product-page discount percentage is rounded to an integer and localized (`خصم 30%` / `30% OFF`) instead of exposing long decimal percentages.
- Theme Raed product contract was rechecked on 2026-09-17; current native image slider, wishlist/product-state, gifting, digital-file, quick-order, metadata, and hooks remain preserved.
