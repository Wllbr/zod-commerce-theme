# Product Type + Brand UI — v1.6.33

- Type switcher icons use 128×128 transparent source artwork and render at ~34px desktop / 29px mobile with no icon background box.
- Product cards render a brand logo only when `product.brand.logo` is available; no brand text fallback is shown.
- Product pages render a logo-only brand link and a localized explore-brand card only when a brand logo exists.
- No brand logo means no brand UI placeholder or empty brand card.
