# ZOD Commerce v1.9.1 — QA and release report

Date: 21 September 2026. Scope: three initial improvement rounds continuing v1.8.2, plus the user’s explicit follow-up to refine current components until ready for review. This report supersedes earlier QA summaries.

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

Scores are design/implementation assessments, not measured conversion improvements or Salla certification. The initial three rounds are recorded below; the subsequent user-authorized design refinement is recorded separately. Outstanding launch gates keep overall readiness below 9.

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
- Webpack 5.109.2 production build. BUILD_MANIFEST.json fingerprints 107 inputs and 22 public outputs; production gate checks all hashes.
- Validators: 56 Twig templates, 18 custom components, 222 ZOD translation references, 16 source JavaScript files.
- Regression suites: inventory/unlimited stock, Quick View ordering/offline fallback, cart races, menu recovery, native offers/checkout ownership, numeric and zero-promotion handling, notes/attachments, catalog query and failure behavior, sticky setting, inline/docked/return-to-flow transitions and one native purchase component.
- Approval guards retained: salla-add-product-toast in layouts/master.twig; salla-review-order-item in customer order details; no automatic salla.product.getDetails calls from card/listing initialization. Explicit Quick View may request details after user action.
- Combined CSS gzip remains under the unchanged 73 KiB project budget. Webpack still warns about raw app.css (~384 KiB) and app entry (~427 KiB). These are file sizes, not Core Web Vitals results.
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

### Final category check

The exhaust category rendered 15 products. Selecting ascending price changed the selected native sort and the first results to lower-priced accessories; no visible retry message remained. Final combined CSS gzip: 69,465 bytes.

### Final draft artwork verification

Salla draft 128254000 rendered all three bundled images successfully in Arabic RTL at an observed 488px viewport. All three category buttons were present. Images used full opacity and normal mobile flow; document scroll width was 469px. The bottom-center search opened the native search dialog and focused its search field. No live publication was performed.


## v1.9.1 follow-up — laser and product-card redesign

User explicitly requested further component improvements after the initial rounds. Rebuilt the laser section with a dark integrated native purchase area, larger horizontal selectors, stronger typography and two original generated posters tied only to their corresponding actual products (p1934775882 spider fixture and p1520863528 six-lens bar). Preserved the original merchant demo clips; they are now opt-in. The white product-card box and initial white collage/poster are removed from this showcase. Actual catalog photos remain unchanged.

Enlarged homepage carousel cards to 280px on desktop and 68vw with a 290px cap on mobile; reduced image padding. Product listing grids remain responsive and use four desktop columns. One-time card scroll reveals run through IntersectionObserver; content stays visible before scripting, and reduced-motion CSS disables animation. Native add-to-cart, listing payloads and deferred inactive laser panels remain intact.

Browser checks on the redesign: mobile 488px and desktop 1600px showed 290px and 280px cards respectively, with no horizontal page overflow. Laser product switching loaded the correct second product and neither clip had a src before playback. Watch demo started the first clip muted and its currentTime advanced; Pause demo was exercised. The mobile native purchase area had transparent background and a full-width button. Desktop inspection found a squeezed selector rail; this was corrected before final packaging.

Added execution tests cover initial no-download/no-autoplay, explicit play and pause, hidden-page pause, sound opt-in, panel reset, interaction under reduced motion and variable scope. The full regression suite passed; the final CSS-only correction passed production build, playback regression, CSS budget and manifest checks. Final CSS: app 393,233 raw / 63,670 gzip bytes; refinement 38,883 raw / 7,145 gzip; combined 70,815 gzip (unchanged 73KiB limit). Two optimized laser posters total 62,374 bytes. Unreferenced legacy KDK artwork was archived outside the package to preserve the unchanged 1MiB release budget.

Current editorial assessment: visual 9.2, UX 9.0, trust 8.2, mobile 8.9, discovery 9.0, conversion 8.2, compatibility 8.8, publishing readiness 7.0; mean 8.5/10. Design is ready for review; the publication blockers listed above still apply. No live publication was performed.

Final design draft: **1617631033**, source commit **717478b**. The corrected desktop selectors measured 250px each at 1600px; both generated poster URLs resolved to their matching draft assets, and the second clip remained unloaded before play.

Final English check: native language switch produced lang=en and dir=ltr at 1600px, both laser playback labels read Watch demo, and the document had no horizontal overflow.

