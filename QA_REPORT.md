# QA and release report — ZOD Commerce 1.8.2

## Release status

**Locally tested staging snapshot. Not a completed dependency-backed production build, actual Salla rendering, live-store verification or marketplace approval.** No account login, remote upload, publication, payment, invoice email, order review or real attachment submission was performed. Earlier ZIPs were left unchanged.

This continuation modifies v1.8.1. All 18 component identifiers, dependency declarations, lockfiles, engine declaration and package-manager version were compared with that archive and preserved. `UPGRADE_COMPATIBILITY.json` records that comparison. The new `show_product_selection_help` page setting defaults to true; no homepage component is added or removed.

## Changes in this pass

| Area | Implemented change | Local evidence |
|---|---|---|
| Cart summary | One visible `salla-cart-summary-card` on desktop and mobile; its own checkout remains in control. Removed calculated tax/discount/savings summaries and proxy checkout. | Source guards, converted templates, browser visibility and mock checkout action |
| Cart pricing | Use native detailed-offer line totals, including valid zero. Keep unit and line prices separate; never convert unknown values to a fabricated zero. | Numeric/data tests and browser DOM update checks |
| Cart updates | Canonical cart event handling, mutation busy/failure states, delayed-read revision guard, refreshed availability, unit price, weight and offer state | Controller tests; real DOM under mocked SDK |
| Free shipping | Preserve omitted partial-response state; hide on explicit removal; bound the progress graphic | Controller cases; responsive layouts |
| Notes and files | Retain cart-item identifier and existing file data in the native uploader; accessible note/file disclosures | Converted templates, browser saved-file/note displays and mocked form-change event |
| Catalog | Initial native request and selected sorting agree. Native reload preserves filter state; query parameters retained and pagination reset; busy/retry controls avoid duplicate requests | Source-derived templates, controller harness and browser interaction |
| Mobile filters | Native changed event closes panel; focus restoration, inert state, Escape/tab behavior, and responsive modal state | Browser focus/breakpoint interactions |
| Product offers | One native offer display outside the product form; removed inferred discount tiers and per-unit savings | Source guards and converted-template/browser checks |
| Product preferences | Sticky purchase disabled means inline purchase. Disabled reviews have no dangling review links. Optional selection reminder uses actual metadata link when available. | Enabled/disabled template variants and browser cases |
| Shared design | Cart progress, product rows, inline guidance, summary spacing and mobile layout coordinated with existing refinement styles; cart navigation dock intentionally omitted | Screenshot inspection and width checks |

The previous approval fixes remain: required master toast, per-product order review component, listing-payload-only product cards, explicitly opened Quick View details, and deferred inactive laser panels. Existing approval regression guards passed in this run. This does not establish approval or actual network behavior in a connected store.

## Important upgrade differences

The previous custom mobile checkout summary and estimated volume-offer tiers are deliberately removed, not renamed. Salla owns offer eligibility, tax, shipping, discount application and checkout. Configure promotions in Salla rather than entering inferred pricing rules into theme text.

A store with `sticky_add_to_cart` previously set to false now receives the inline layout. Mobile bottom navigation is absent on cart pages to avoid competing with checkout. Review visibility follows the merchant setting. The new purchase reminder is general guidance, not a compatibility guarantee.

Homepage configuration from earlier versions still applies: choose products for category-specific shelves; latest-products fallback requires explicit opt-in. No inventory, category, contact detail or real product specification was created from fixture data.

## Repository tests and build measurements

Final dependency-free snapshot build and `npm test` passed under **Node v24.11.1**. A fresh extraction of the final theme ZIP was tested separately with the same runtime; see `ZOD-v1.8.2-Package-QA.json` beside the delivered artifacts for the recorded final archive hash and test outcome.

- 56 Twig templates checked structurally, 18 custom components and 222 ZOD translation references validated.
- 16 source JavaScript files checked; packaged JavaScript syntax checks passed.
- Existing inventory, Quick View, list-data, menu, toast, order/blog, native options and focus regression suites passed.
- **20 new shopping/controller scenarios:** 17 cart/PDP/template guards and three actual catalog-controller scenarios.
- **100 build inputs and 18 public outputs** match the recorded build manifest.
- Base CSS: 389,436 bytes raw / 63,635 gzip. Refinement CSS: 38,296 raw / 7,896 gzip. Combined CSS: **71,531 gzip bytes**. These are asset-size measurements, not Lighthouse, performance scores or Core Web Vitals results.

`LOCAL_TEST_RESULTS.txt` in `scripts/` contains the console output. The old test expectations requiring fabricated offer tiers, calculated mobile pricing and proxy checkout were replaced with explicit native-ownership, zero-price, selected-sort, preference and attachment checks. Unrelated regression coverage was retained. This change is a feature migration, not evidence that a payment engine was tested locally.

## Template and browser evidence

**Eight converted-template assertion groups** cover Arabic and English selected/default sorting, search source, cart totals/attachments/offer placement and enabled/disabled product settings. These use an intentionally limited Twig-to-Jinja adapter. They do **not** compile or execute native Twig or validate the full Salla schema.

**24 fresh responsive layout cases:** cart, empty cart and inline product variants, in Arabic and English, at widths 360, 390, 768 and 1440. Full document and relevant main-content width checks passed. Offscreen section paint culling is disabled for complete measurement. Intentional clipped shipping-progress decoration and offcanvas filter elements are excluded from descendant overflow reports; full document width is still checked. No captured JavaScript page errors occurred in the completed batches.

**Nine fresh browser interaction checks:**

1. Native sorting/reload once, busy state, preserved filter state and no extra product-detail fetch.
2. Explicit native error markers trigger retry; a product name containing “Failed” does not.
3. Native filter change closes the mobile panel, restores focus and sets inert state.
4. Desktop/mobile transitions remove obsolete modal state and keep focus out of hidden controls.
5. A single visible native-summary stand-in and its checkout counter; no competing cart dock.
6. Existing note/file display, disclosure states and delegation to the mocked form-change handler.
7. Confirmed cart updates repaint actual DOM with zero-offer totals and unavailable state.
8. Disabled sticky purchasing, review links and selection guidance remain disabled; offers stay outside the form.
9. Enabled purchase dock and selection reminder work without detail enrichment.

`BROWSER_QA.json` contains only the new 24 + 9 results, not the 72 + 11 historical v1.8.1 results. `TEMPLATE_FIXTURE_QA.json` records the eight template groups. The separate preview package contains individual browser reports, renderers, runners and fresh shopping screenshots.

### What the browser evidence cannot establish

The SDK, list responses, uploader, offers, reviews, summary and checkout are **mocked**. Checkout increments a test counter; no payment or native checkout validation occurs. The tests do not prove real tax/discount eligibility, native widget appearance, persisted attachments, live search results or Salla network traffic.

Browser URL navigation is restricted in this environment. The browser sorting case replaces `history.replaceState` with a recorder. Actual query/campaign preservation, page removal and normal-navigation fallback are separately tested using the real controller in a JavaScript VM harness. Those cases are not presented as end-to-end navigation.

Source-derived shopping bodies sit in a local fixture shell, not a Salla-rendered header/footer. Screenshots contain illustrative products, prices, images and mock widget text. Offscreen content-visibility is temporarily disabled for full-page exports to avoid blank unpainted sections. Fixed purchase bars appear at the viewport boundary within a tall capture. No screenshot proves live Safari behavior or assistive-technology conformance.

## Six deliberate-failure integrity tests

All six checks were rerun with Node v24.11.1. Destructive mutations were made only in disposable copies:

1. Changed source after a recorded build is rejected.
2. Modified public output is rejected.
3. Retained PDP source changes block the offline builder.
4. Retained base Sass changes block the offline builder.
5. Unsupported imports in a standalone entry block the offline builder.
6. The production-only release gate refuses snapshot provenance.

Every check returned an error with the expected diagnostic. `INTEGRITY_QA.json` records the results. Hash integrity detects mismatches, not semantic correctness. The last result is an intentionally enforced release gate, not a failure of the normal repository test suite.

## Toolchain and retained assets

The final local build/test runtime was Node v24.11.1, satisfying `^22.18.0 || >=24.11.0`. Running the project's Corepack/pnpm bootstrap still failed while downloading the declared package manager from `registry.npmjs.org`, with **EAI_AGAIN** DNS resolution failure. The full frozen-lockfile installation and Webpack production command were not executed. `scripts/TOOLCHAIN_ATTEMPT.txt` records the failure.

`BUILD_MANIFEST.json` identifies the builder as **offline-local-esm-snapshot**. Editable app/menu/catalog/pages entries were bundled from current local source; import-free entries and refinement CSS were refreshed. Home uses current source with the unchanged existing lite-youtube snapshot. Original compiled `app.css`, `product.js` and the vendor chunk were retained with pinned source/output hashes. The snapshot builder rejects unsupported changes rather than silently pretending to rebuild them.

Dependencies, lockfiles and the snapshot baseline are unchanged. A full Sass/Tailwind/Webpack/Babel build and target-browser output remain necessary. The PowerShell packaging script was not executed; the delivered archive was created and inspected independently with Python.

## Required checks in Salla before publication

Run the README production workflow in an environment with registry access; require `pnpm release:check` to pass after the real build. Then validate the theme schema and actual Twig rendering in the merchant preview.

Test native cart updates, coupons, taxes, shipping, promotional free items, quantity limits, removal of the last item, unavailable products and a real checkout hand-off. Verify required options, donation/digital products where applicable, saved notes and file uploads, including after quantity changes. Confirm native summary and offer widgets render correctly at mobile widths.

Check catalog search queries, sort/default order, pagination, filters, retries and browser back navigation against actual products. Confirm no automatic per-card product-details requests on listing initialization or hover; user-triggered Quick View remains permitted.

Check all merchant preference variants, reviews, stock notifications, real options/custom inputs and product metadata. Recheck previous blog, orders, pending/expired payment, tracking, invoice and order-review flows. Test mobile Chrome and Safari, long Arabic text, LTR English, zoom, keyboard and actual assistive technology. Replace example imagery/content with real store data. Salla review/acceptance is still a separate final gate.

## Primary implementation references

- https://raw.githubusercontent.com/SallaApp/theme-raed/master/src/assets/js/cart.js
- https://raw.githubusercontent.com/SallaApp/theme-raed/master/src/views/pages/cart.twig
- https://raw.githubusercontent.com/SallaApp/theme-raed/master/src/assets/js/products.js
- https://raw.githubusercontent.com/SallaApp/theme-raed/master/src/views/pages/product/index.twig
- https://raw.githubusercontent.com/SallaApp/theme-raed/master/src/views/pages/product/single.twig
- https://raw.githubusercontent.com/SallaApp/theme-raed/master/src/views/pages/partials/product/options.twig
- https://docs.salla.dev/twilight-js-components/products-list
- https://docs.salla.dev/twilight-js-components/filters
- https://docs.salla.dev/twilight-js-components/offer
- https://github.com/SallaApp/theme-raed/pull/767
- https://github.com/SallaApp/theme-raed/pull/963

These sources guided integration choices. They do not certify this package or replace store-level testing.
