# ZOD Commerce v1.9.0 — QA and release report

Date: 21 September 2026. Scope: three improvement rounds, continuing v1.8.2. This report supersedes earlier QA summaries.

## Release status

Production build and local regression suite passed. Code and generated artwork are on `codex/zod-1.9.0-review` in Wllbr/zod-commerce-theme. Salla development previews were created from that branch. No live publication, main-branch merge or marketplace submission was performed. The release is ready for continued staging review, not certified approval or a fully tested checkout launch.

## Round 1 — header, cards and purchase hierarchy

Audit: dense header, repeated card SKU metadata, long product copy ahead of buying controls, competing persistent purchase code. Keep native Salla prices, offers, options, add-to-cart and order reviews.

Changes: rounded compact header; simplified card metadata and title/subtitle limits; moved long description, facts, tags and review summary below the purchase area; made purchase controls begin inline and dock only after scrolling past them; disabled setting leaves them inline. Retained native quick buy. No new marketing claims.

## Round 2 — discovery and consistency

Audit: shelves needed explicit category/offer sources; selected category payloads varied; native purchase button width was constrained by legacy grid rules. Keep existing component IDs, merchant catalog and working secondary homepage sections.

Changes: category and optional native offers sources added to product shelves; curated products take precedence and latest fallback remains opt-in; widened native purchase actions; refined product information hierarchy; saved draft homepage order with three-category hero followed by ventilation, intercom and insect shelves. Preserved campaigns, brands, wholesale, guides, FAQ and contact. No fabricated best-seller ranking.

## Round 3 — user corrections and staging validation

Audit: user wanted icon-only search; category hero links were absent with scalar selector payloads; decorative imagery was unsuitable for the requested product references; old mobile art rules faded/cropped the generated products.

Changes: removed header search row and department strip; desktop icon retained; mobile header search hidden when bottom navigation supplies search, retained on cart/no-bottom-navigation configurations. Added compatible category selection and explicit destination fallback fields. Saved real category destinations. Generated original hero artwork from actual KDK 20AUA fan, Commax CDV-43K kit and AFC trap references, bundled as WebP defaults, and made mobile artwork sit below copy. Product catalog photography remains real. Native category error visibility guard observes class/style/hidden changes. No stock imagery introduced.

## Editorial scorecard

Scores are design/implementation assessments, not measured conversion improvements or Salla certification. Three-round limit reached; outstanding gates keep overall readiness below 9.

| Criterion | Round 1 | Round 2 | Round 3 |
|---|---:|---:|---:|
| Visual design | 8.0 | 8.5 | 9.0 |
| UX | 7.8 | 8.3 | 8.7 |
| Trust and safety feel | 7.5 | 7.8 | 8.0 |
| Mobile experience | 7.5 | 8.1 | 8.6 |
| Product discovery | 7.0 | 8.5 | 9.0 |
| Conversion readiness | 7.0 | 7.7 | 8.0 |
| Salla compatibility | 8.0 | 8.4 | 8.8 |
| Publishing readiness | 7.0 | 6.7 | 7.0 |
| Mean | 7.5 | 8.0 | 8.4 |

Round 2 publishing score reflected unresolved draft category-link configuration rather than a source regression.

## Build and automated evidence

- Node 22.18.0, pnpm 11.19.0; project declares pnpm 11.21.0. Frozen-lockfile dependency installation succeeded without changing the lockfile.
- Webpack 5.109.2 production build. BUILD_MANIFEST.json fingerprints 104 inputs and 21 public outputs; production gate checks all hashes.
- Validators: 56 Twig templates, 18 custom components, 218 ZOD translation references, 16 source JavaScript files.
- Regression suites: inventory/unlimited stock, Quick View ordering/offline fallback, cart races, menu recovery, native offers/checkout ownership, numeric and zero-promotion handling, notes/attachments, catalog query and failure behavior, sticky setting, inline/docked/return-to-flow transitions and one native purchase component.
- Approval guards retained: salla-add-product-toast in layouts/master.twig; salla-review-order-item in customer order details; no automatic salla.product.getDetails calls from card/listing initialization. Explicit Quick View may request details after user action.
- Combined CSS gzip remains under the unchanged 73 KiB project budget. Webpack still warns about raw app.css (~376 KiB) and app entry (~419 KiB). These are file sizes, not Core Web Vitals results.
- Three added 720px WebP images total 70,684 bytes. Original generated PNGs are delivered separately. Images are promotional interpretations of reference products, not technical specification evidence.

## Browser evidence and limits

Authenticated Salla development previews rendered updated Twig, real native components and store data. Observed icon-only header, no search row, bottom-center mobile search, rounded header, English LTR and Arabic RTL, real product shelves and generated hero images. All three hero destinations were configured; exhaust navigation reached the actual category. Mobile preview measured 488px with no horizontal overflow on the English homepage. Local source fixtures also exercised Arabic at 390px and English desktop; fixture native-control stand-ins are not Salla transaction tests.

Observed native PDP price/offer display and one native purchase component; controls moved inline → docked after scroll → inline on return. The earlier inspected populated cart had one native summary and native checkout control; final cart interactions and payment were not exercised. Account/order, blog and specialized product surfaces received source/regression review, not authenticated end-to-end action testing.

Salla editor occasionally rendered unhydrated settings or timed out; reload and completion of loading recovered it. Preview-only live-reload connection errors occurred. No claim of a complete browser-console or network audit is made.

## Page/component coverage

| Surface | Work and evidence |
|---|---|
| Master/header/footer | Approval toast retained, icon search, rounded header, mobile navigation, real footer policies/contact inspected |
| Homepage hero | New generated actual-product artwork; three real category destinations; Arabic/English default copy |
| Product shelves/type switchers | Category/offers/curated sources; actual ventilation, intercom and insect shelves observed |
| Listing/search | Native listing data; sort/controller guards tested; category rendering inspected |
| PDP | Title/price/CTA hierarchy, description below purchase, native offers/options, scroll docking tested |
| Cart/checkout | Preserved native summary and server totals; regression coverage; final transaction gate outstanding |
| Customer/orders/blog | Native review retained; source and regression checks only |
| Other 16 custom components | IDs retained; existing merchandising preserved; not all configurations visually retested |

## Remaining blockers before publication

1. Exercise full cart edits, coupon, shipping/tax recalculation, options, unavailable products, attachments and checkout handoff in the final draft. Complete an authorized payment test separately.
2. Verify real order details/review, pending-payment and invoice states; booking, digital and other applicable product types.
3. Test physical iOS Safari/Android Chrome, 360–390px screens, keyboard and screen reader, contrast and measured performance. Browser resizing and source tests do not replace these.
4. Review English catalog/merchant content: some data remains Arabic. Explicit hero fallback URLs currently use the Arabic preview routes; confirm desired language retention and replace staging-domain URLs with actual store category URLs before live rollout.
5. Review imported test tags and all merchant claims (availability of support, shipping speed, guarantees); no invented trust claims were added by this revision.
6. Marketplace acceptance remains a Salla decision. Obtain explicit user approval before live publication.

## Final setup

Use STORE_SETUP.md / MERCHANT_GUIDE_AR.md. Keep the hero first, followed by the three focused product groups. Generated artwork is bundled; store layout and selected products remain Salla configuration. For future promotional imagery generate from the actual corresponding product, never unrelated models or stock photos. Existing representative-product fields are retained for compatibility; manual generated images override bundled hero defaults.

## Official compatibility references

- [Native add-product component](https://docs.salla.dev/422692m0)
- [Product page](https://docs.salla.dev/422561m0)
- [Native product slider sources](https://docs.salla.dev/422722m0)
- [Twig helpers and assets](https://docs.salla.dev/twilight-engine/flavoured-twig)
