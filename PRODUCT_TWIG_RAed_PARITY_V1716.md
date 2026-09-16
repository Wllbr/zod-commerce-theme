# Product Twig — Theme Raed parity (v1.7.16)

Checked on 2026-09-16 against the current `SallaApp/theme-raed` `master` product page template.

This release does **not** replace ZOD's custom product page with Raed's visual markup. It keeps ZOD's gallery, buy box, trust blocks, reviews and sticky purchase UI, while carrying over current Raed contract/behavior points that matter for compatibility.

## Synced behavior

- Product prices remain Twig-safe when `product.price` is the string `-`.
- Product IDs passed to storefront JS remain quoted strings.
- Product slider keeps `data-images` and `listen-to-thumbnails-option`.
- Lightbox anchors now carry caption/infinite metadata used by the current Raed markup.
- Brand logo follows Raed's current `product.brand.logo` URL-string contract.
- Barcode is rendered when supplied.
- Tags default to shown when a merchant setting is not present, matching Raed.
- Metadata, digital-file settings, gifting, quick order, product hooks and recommendation hooks remain supported.
- Gifting is inside the product form and receives `gifting_intro`.
- Sticky-bar support follows the merchant theme setting rather than being forced on.
- Comments follow Salla's product-rating visibility setting.

## Intentionally ZOD-specific

- Gallery remains ZOD's custom centered/dot/arrow design rather than Raed's thumbnail layout.
- Wishlist/share controls remain ZOD styled.
- Offer UI remains ZOD's offer drawer.
- Purchase dock, trust cards, payment block, reviews heading and related-product styling remain ZOD-specific.
