# Product Page, Product Card & Purchase Dock — v1.6.36

## Product page
- Desktop density is intentionally compact so 100% browser zoom feels like the previously preferred 75% view.
- Product title is reduced to a 24–29px desktop range.
- Main gallery is capped around 640px with contained product imagery.
- Existing single brand exploration block, wishlist and share actions remain intact.

## Persistent purchase dock
- The one native Salla purchase component is fixed on screen for the whole product-page session.
- It keeps quantity, Add to Cart and native Quick Buy synchronized with options, price and stock.
- ZOD does not use Salla support-sticky-bar on this component, preventing a competing sticky implementation.
- On mobile the dock sits above the ZOD bottom navigation and reserves safe page space.

## Product cards
- Theme-aware discount / promotion badges use `--color-primary`.
- Desktop: Eye + Heart are revealed together on hover/focus.
- Mobile: Eye + Heart are always visible; Eye is left and Heart is right.
- Category pill, product title and price are larger and easier to scan.
- Out-of-stock remains a semantic red stamp and Add to Cart stays disabled.
- Brand logo is shown only when an actual logo exists; otherwise no brand row is reserved.
