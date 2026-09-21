# QA and release report — ZOD Commerce 1.8.3

## Status

Local production build and repository release gate passed. The v1.8.3 ZIP has not been uploaded to Salla, rendered in its draft, published, or submitted for marketplace approval. The inspected Salla draft is an earlier installed state and cannot verify this new archive.

## Verified locally

- Frozen-lockfile install completed with pnpm 11.19.0 on Node 22.18.0. The project declares pnpm 11.21.0; the lockfile was not modified.
- Webpack 5.109.2 production build completed. BUILD_MANIFEST.json records 100 inputs and 18 public outputs with webpack-production provenance. The release:check production gate passed.
- Repository tests passed: 56 Twig templates, 18 custom components, 222 ZOD translation references, 16 source JavaScript files, shopping/controller regressions, approval guards, packaged JavaScript syntax and hash integrity.
- Compiled CSS measured 62,321 gzip bytes for app.css and 6,975 gzip bytes for refinement.css, 69,296 combined. Webpack warned that the raw 376 KiB app.css and 419 KiB app entry exceed its recommended size. These are asset sizes, not page-load or Core Web Vitals measurements.
- The retained approval fixes were checked in source and output. Product cards use listing data. Their one getDetails call is inside explicit Quick View.
- The new catalog guard checks whether Salla's native error element is visible. A controller test covers a hidden error becoming visible.

## Draft inspection

The authenticated Salla draft editor loaded, and the storefront preview was opened directly. The Arabic homepage, exhaust category, KDK exhaust-fan product page and populated cart rendered. On the category page, 15 cards loaded while a theme retry message appeared. Inspection showed Salla's native error element existed with display:none. The v1.8.3 source fix addresses that false message; it still needs verification after uploading v1.8.3.

The product page showed native purchase controls and offers. The cart showed a single native summary card with a checkout button and Salla supplied totals. These observations apply to the draft already installed, not this local package. The three-category hero component appears in the editor's available elements but is not active on the inspected homepage.
The preview language control switched the exhaust category to English with an LTR document and English theme controls. The category title and product/category names remained Arabic, so English catalog data and merchant content need review.

## Remaining gates

- Upload v1.8.3 to a Salla draft and confirm Twig/schema rendering and the catalog error fix there.
- Configure the three hero category links and images with real store categories; verify the homepage in Arabic and English.
- Exercise real category sorting, filters, pagination, search, Quick View and back navigation, including a failing list request.
- Test a real cart and checkout handoff with offers, coupons, taxes, shipping, quantities, unavailable products, notes and uploads. Verify product options and out-of-stock behavior.
- Verify customer order details, review controls, invoice/payment states and mobile Chrome/Safari at 360–390 px and larger widths. Complete keyboard, screen-reader, contrast and performance review.
- Obtain Salla approval and explicit user approval before live publication.

No live publication or draft upload was performed in this pass. The previous v1.8.2 QA report is superseded by this report.
The bundled BROWSER_QA.json, TEMPLATE_FIXTURE_QA.json, INTEGRITY_QA.json, SOURCE_CHANGES.json and UPGRADE_COMPATIBILITY.json retain historical v1.8.2 evidence; they are not claims of fresh v1.8.3 browser or upload validation.
