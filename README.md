# ZOD Commerce Theme

**Version 1.0.0** — fresh Salla Twilight storefront for ZOD.

This repository is an independent, clean-start Salla theme project.

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

Only the product shelf is enabled as a safe default so a new store can render without fake banners, fake category imagery, fake trust claims, or placeholder reviews. Configure the remaining sections in the Salla theme editor with real store content.

## Repository recommendation

Create a dedicated empty repository for this theme:

`Wllbr/zod-commerce-theme`
