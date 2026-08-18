# ZOD Commerce Theme

**Version 1.7.0** — catalog-first Salla Twilight storefront for ZOD.

This repository is an independent, clean-start Salla theme project.

## v1.5.3 cart interaction polish

- Cart quantity changes no longer require a blocking browser OK alert.
- Quantity updates show a compact ZOD toast and animate the changed cart row.
- Cart totals animate when the live amount changes.
- The old Secure Checkout label is replaced by a Cart → Delivery → Payment journey indicator on desktop.

## Product philosophy

The storefront is built around three jobs:

1. **Discover** — strong search, mega-menu navigation, categories, and shopping by need.
2. **Buy** — product shelves, campaign storytelling, technical product pages, clear stock/price/options, and mobile purchase controls.
3. **Trust** — delivery/warranty information, real Salla reviews, brands, guides, business/wholesale pathways, policy navigation, and a complete footer.

The visual direction is light, premium retail: white and soft-neutral surfaces, charcoal typography, restrained ZOD red accents, product-led imagery, large search, spacious cards, and responsive components designed independently for desktop and mobile behavior.

## Included storefront areas

- Announcement / utility bar
- Sticky desktop and mobile header
- Native Salla live search
- Multi-level desktop mega-menu
- Mobile drill-down catalog menu
- Mobile bottom navigation dock
- Hero campaigns with separate mobile artwork
- Category discovery
- Shop by need
- Product shelves
- Product spotlight / storytelling
- Promotion grid
- Brands
- Trust/service strip
- Buying guides
- FAQ
- Wholesale/business CTA
- Optional locations / branch contact section
- Product catalog with subcategories, filtering and sorting
- Technical product detail experience
- Product options, bundles, size guides, notes and uploads
- Add-to-cart toast + Salla quick-buy support
- Mobile sticky product purchase bar
- Cart with offers, coupon, loyalty, gifting and summary
- Brands pages
- Blog / buying-guide pages
- Reviews page
- Customer account, wishlist, wallet and orders
- Landing/content/loyalty/thank-you pages
- Responsive footer with mobile accordions
- Arabic RTL + English LTR locale parity

## Requirements

Use pnpm. Do not run `npm install` in this project.

```bash
pnpm install
pnpm test
pnpm production
salla theme preview --with-editor
```

See `STORE_SETUP.md` for the complete new-repository and launch checklist.
See `DESIGN_SYSTEM.md` for the visual and responsive rules.

## Recommended homepage order

1. Commerce Hero
2. Category Navigation
3. Shop by Need
4. Best Sellers
5. Product Spotlight
6. Category Product Shelves
7. Promotion Grid (only when there is a real campaign)
8. Brands
9. Wholesale / Business CTA
10. Buying Guides
11. FAQ
12. Locations / Contact (when applicable)
13. Real Salla Reviews / Testimonials component
14. Trust & Service

Version 1.7.0 ships with the **Ready ZOD Homepage** enabled by default. It uses real ZOD catalog imagery and Salla-native product feeds, with no generated product renders or fabricated reviews. Disable `homepage_ready_layout` in theme settings only when you want to build the homepage entirely with Salla editor components.

## Repository recommendation

Create a dedicated empty repository for this theme:

`Wllbr/zod-commerce-theme`

## v1.4.0 interaction behavior

- Catalog navigation uses one right-side drawer on desktop and mobile. The page behind it blurs smoothly; X, Escape, or any click outside the drawer closes it.
- Search opens as a full-page blurred overlay using the current Salla store logo and native `salla-search`. X, Escape, or any click outside the search field/results closes it.
- The footer has no newsletter form. Store description/slogan, footer menu, contacts, social links, tax/trust information, payment methods and copyright remain sourced from Salla.



## v1.3 Motion Commerce

The homepage now uses motion intentionally: hero slides autoplay without large arrow controls; category, brand and product rails move horizontally; and the new Interactive Featured Product component combines product media, native Salla commerce data and auto-cycling clickable benefit icons. The native Salla Store Features component is styled by the theme rather than duplicated as store data.


## Mobile commerce density

Version 1.4 uses a count-only header cart badge (hidden at zero), bottom-dock search on phones, two-card mobile product rails, and animated add-to-cart feedback.

## v1.4.1 polish

- Blocking add-to-cart success alerts are intercepted and replaced by a non-blocking ZOD cart confirmation pill.
- Interactive showcase price refreshes from Salla's live storefront product APIs.
- Interactive showcase no longer renders an eyebrow / featured-offer line.
- `WhatsApp contact` is a custom homepage component that reads the WhatsApp number from Salla store contacts.
- Footer customer-service contacts are icon-only, sourced from Salla, with hover/focus glow interactions.

## v1.5.2 cart / checkout handoff

The cart now keeps the grand total visible in the mobile sticky checkout dock and refreshes it from Salla cart data after cart changes. The actual hosted checkout/payment screen is controlled by Salla rather than a Twilight `checkout.twig`; see `CHECKOUT_EXPERIENCE_V152.md` for the supported customization boundary and recommended Salla dashboard settings.
