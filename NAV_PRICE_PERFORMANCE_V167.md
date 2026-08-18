# v1.6.7 — Navigation, Price & Performance Fix

- New product navigations start at the top instead of inheriting a lower scroll position.
- Product-gallery thumbnail syncing now scrolls only the thumbnail rail and cannot drag the whole page vertically.
- Product Spotlight and Interactive Showcase no longer render a zero sale price when Salla returns `sale_price = 0`.
- Product Spotlight now participates in the same live-price fallback logic as the interactive showcase.
- Product cards also reject invalid zero sale-price states.
- Live-price requests are skipped when the server already supplied a valid price and remaining fallbacks run concurrently.
- Main-menu data is fetched lazily only when the menu is opened, reducing work on every page/language reload.
- YouTube code is no longer loaded globally and is requested only on home pages that actually contain a YouTube block.
- Home dynamic-component initialization is batched per frame to reduce DOM churn in the Salla editor.
- The localization modal receives the current language immediately while retaining Salla's single native localization component.
