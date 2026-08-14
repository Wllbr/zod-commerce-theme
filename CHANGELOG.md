# Changelog

## 1.2.0 — Fluid navigation shell
- Rebuilt desktop header to use the same compact menu interaction as mobile.
- Added a right-side category drawer with smooth background blur.
- Category drawer closes with X, Escape, or an outside click.
- Added a full-page blurred search overlay using the Salla search component and the store logo.
- Search closes with X, Escape, or a click outside the search field/results area.
- Rebuilt the footer as a light retail footer sourced from Salla store data.
- Removed newsletter UI entirely.
- Footer continues to use Salla description, footer menu, contacts, social links, trust badges, tax details, payments, and copyright.

## 1.0.0 — 2026-08-14

Initial fresh ZOD Commerce release.

### Foundation
- New project created independently from every previous ZOD theme.
- Arabic RTL and English LTR storefront architecture.
- Current Salla/Twilight baseline pinned for predictable installs.
- pnpm 11 build approvals included to avoid ignored-build installation failures.
- Static validator for theme JSON, component paths, locale parity, Twig structure, JavaScript syntax and project hygiene.

### Commerce experience
- Announcement and utility bar.
- Responsive sticky header with large native Salla live search.
- Desktop multi-level mega-menu and mobile drill-down catalog navigation.
- Mobile bottom navigation dock.
- Commerce hero, category discovery, Shop by Need, product shelves, spotlight, promotions, brands, locations, trust, buying guides, FAQ and wholesale CTA components.
- Responsive category/catalog pages with subcategories, filters and sorting.
- Technical product page with media gallery, options, bundles, size guides, notes/uploads, stock/price states, specifications, delivery/warranty information, reviews and related products.
- Native Salla Add to Cart, quick-buy, availability notification and mobile sticky purchase support.
- Cart with offers, coupons, loyalty, gifting, options and order summary.
- Brand, blog, content, loyalty, testimonials, landing, thank-you and customer account pages.
- Responsive footer with policy/navigation areas and mobile accordions.

### Design system
- Light premium retail surfaces with restrained ZOD accent color.
- Product-first cards and technical-specification layouts.
- Responsive behavior for mobile, tablet and desktop.
- Reduced-motion handling and keyboard-friendly navigation states.
- No fabricated reviews, promotions, branches, category selections or product claims enabled by default.

## 1.0.1 — Salla import compatibility
- Restored importer-safe Twilight author/support metadata used by the previously accepted ZOD theme structure.
- Added current Theme Raed built-in feature declarations for parallax and square-photo components.
- Replaced manual dropdown keys with UUID-form keys used by current Raed.
- Removed nonessential custom-component `is_default` flags from the initial import schema.
- Normalized the spotlight product selector to an array-backed single-product selection.
