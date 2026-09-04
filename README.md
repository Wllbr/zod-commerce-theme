# ZOD Commerce Theme

**Version 1.6.48** — Salla Twilight storefront for ZOD.

## v1.6.48 consumer-readiness fixes

- Opens native modal search without covering the results on Salla versions that ignore inline mode.
- Routes mobile checkout through Salla's native form validation and submission control.
- Refreshes cart line totals from confirmed server data as well as the grand total.
- Adds category-menu retry and empty states, keyboard containment, and focus restoration when navigating subcategories.
- Passed local regression checks and production compilation; live verification of this release remains pending while Salla holds the previous submission under review.

## v1.6.47 storefront fixes

- Fresh product details take precedence over cached stock; unlimited stock is handled consistently.
- Quick View ignores superseded requests, contains keyboard focus, restores its trigger, and labels controls in the active language.
- Cart totals use successful mutations and fresh responses, with no stale storage fallback. Salla notifications use a dismissible, nonblocking interface.
- Certificate links open the actual certificate; gallery controls are translated, and purchase buttons retain readable contrast with pale accents.
- WhatsApp uses the store contact before its fallback and ignores blank contact entries. Branch navigation respects reduced motion.
- Production builds preserve the original videos. Run `npm test` for validation and regression checks.

This local version does not replace an existing Salla review submission automatically.

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

The timed Screen Advertisement is a fixed overlay, so its editor position does not affect the visual order. Add only one WhatsApp Contact component; it now renders as a fixed language-aware contact control rather than an in-page section.

Only the product shelf is enabled as a safe default so a new store can render without fake banners, fake category imagery, fake trust claims, or placeholder reviews. Configure the remaining sections in the Salla theme editor with real store content.

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
- `WhatsApp contact` is a floating homepage control with up to four configurable WhatsApp destinations and a Salla contact-number fallback.
- Footer customer-service contacts are icon-only, sourced from Salla, with hover/focus glow interactions.

## v1.5.2 cart / checkout handoff

The cart now keeps the grand total visible in the mobile sticky checkout dock and refreshes it from Salla cart data after cart changes. The actual hosted checkout/payment screen is controlled by Salla rather than a Twilight `checkout.twig`; see `CHECKOUT_EXPERIENCE_V152.md` for the supported customization boundary and recommended Salla dashboard settings.
