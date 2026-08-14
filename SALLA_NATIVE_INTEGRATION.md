# Salla Native Integration — Source of Truth

ZOD Commerce must treat the Salla dashboard as the source of truth for business/store data. The theme owns presentation and optional merchandising only.

## Data that must come from Salla

| Area | Source | Theme rule |
|---|---|---|
| Store name, logo, icon, slogan, description | Salla store settings (`store.*`) | Never duplicate as theme text fields |
| Announcement / promotional bar | Salla advertisement system | Render with `salla-advertisement`; no separate announcement text setting |
| Languages & currencies | Salla store settings | Show one `salla-localization-modal` only when enabled |
| Main navigation / categories | Salla menus + category data | Custom visual mega-menu may style native menu data, never maintain a second category list |
| Footer pages | Salla footer menu | Render `salla-menu source="footer"` |
| Contacts | Salla contact settings | Render `salla-contacts`; custom location phone is only for a branch-specific override |
| Social links | Salla social settings | Render `salla-social` |
| Brands | Salla brand catalog | Brand components select/render native Salla brands |
| VAT / tax certificate | Salla tax settings | Read `store.settings.tax.*` |
| Payments | Enabled Salla payment methods | Render `salla-payments` |
| Trust badges | Salla trust badges | Render `salla-trust-badges` |
| Mobile apps | Salla store app data | Render `salla-apps-icons` |
| Branch/scope selector | Salla scopes | Use `store.scope` / `salla-scopes` |
| Products, stock, variants, options, prices, discounts | Salla product data | Never enter a second price/stock value in theme settings |
| Product offers | Salla offers | Use native offer/add-to-cart components |
| Ratings & reviews | Salla ratings/reviews | Use `salla-rating-stars`, `salla-comments`, `salla-reviews` |
| Shipping rates / availability | Salla shipping and checkout settings | Theme can explain that delivery is calculated/confirmed at checkout; never calculate rates independently |
| Coupons / loyalty / gifting / installments | Salla storefront components/settings | Use native components where available |

## Data the theme may own

These are visual merchandising choices that do not duplicate store configuration:

- hero artwork and optional bilingual campaign copy;
- Shop by Need artwork/copy and links to native categories/products/pages;
- optional promotional image cards;
- product spotlight media and marketing benefits, while product name/price/stock/Add to Cart remain native;
- optional buying-guide cards;
- optional FAQ content;
- optional wholesale/project call-to-action;
- optional physical-location cards for address/hours/map when that information is not represented by a Salla storefront component;
- purely visual settings such as sticky header, mobile dock, image fit, breadcrumbs, and sticky purchase bar.

## Multilingual contract

- UI/system strings live in `src/locales/ar.json` and `src/locales/en.json` and use `trans()`.
- Every custom merchant text field that has `multilanguage: true` is resolved against `language.code`.
- Empty custom titles, subtitles and CTA labels remain empty; the theme does not force demo copy into the live storefront.
- The language/currency selector is rendered only when the corresponding Salla store setting is enabled.

## Product-page contract

- Price, sale price, VAT state, stock, options, quantity rules, notify-availability and Add to Cart come from the Salla product object/components.
- Sold count is only shown when Salla allows it (`product.can_show_sold`) and the theme display toggle is on.
- Remaining quantity follows `product.can_show_remained_quantity`.
- Warranty is not globally hard-coded because coverage may differ per product/manufacturer. Warranty details should be entered in the product content/metadata or another product-specific Salla-supported source.
- Shipping information is not hard-coded into checkout logic. The theme may show a neutral message that delivery options/ETA are confirmed at checkout.

## Current intentional non-feature

The theme does not ship a fake newsletter form. A newsletter field will only be added when it is connected to a supported Salla marketing/app workflow that actually stores subscriptions.
