# Consumer readiness review — 5 September 2026

Status: v1.6.48 prepared locally. Not deployed and not certified ready for customer orders.

## Implemented in v1.6.48

- Search: the preview's readonly search trigger opens a native Salla results dialog at z-index 200, behind the theme overlay at 1010. The updated theme detects native-trigger mode and opens Salla search directly. Inline-capable versions keep the existing theme overlay. Local regression verifies handoff; deployed verification pending.
- Mobile checkout: replaced direct checkout URL navigation with forwarding to Salla's own summary submit control, preserving platform validation. The native control ID was confirmed both in installed Salla source and in the preview DOM.
- Cart: refresh line totals from confirmed item snapshots alongside existing grand-total refresh. No client-side discount or tax calculations.
- Menu: failures can be retried instead of being cached forever as an empty menu. Added Arabic/English loading, error and empty states; category drill-down restores keyboard focus. Menu and inline search contain Tab focus.

## Validation

- Theme validator: 51 Twig templates, 15 custom components, 143 translation references, 9 JavaScript files.
- Regression suite passed, including existing stock/Quick View/cart-race checks and new menu retry, empty menu, native search handoff, native checkout forwarding and cart line total checks.
- Production build passed. Existing combined app entrypoint size warning remains (276 KiB).
- Seven original video files preserved (11,409,520 bytes total).
- Separate v1.6.48 source and Salla upload ZIPs created with the existing packaging script. Private recovery documents are excluded by the whitelist.

## Live observations (older preview version 1219841289)

- Used the signed-in editor's embedded preview. A separate-tab signed URL navigation was blocked by automatic approval review; no bypass was attempted.
- Inspected Arabic mobile product/home/cart and desktop home/cart layouts.
- Searched KDK; results were hidden behind the theme overlay. Closing the overlay exposed the native results, and selecting KDK 15WUD navigated to the correct available product at 131.61 SAR.
- Cart baseline: horn quantity 5 and standing fan quantity 3, total 5,767.40 SAR. Temporarily increased fan quantity to 4; grand total became 6,003.20 while the row still showed 707.40. Restored quantity 3. A fresh preview confirmed quantities 5/3 and total 5,767.40. No products were removed and no order was placed.
- The direct mobile checkout URL returned 410. The native submit control was exercised, but delivery/payment completion was not established in this demo. Production checkout still needs a real-store check without placing an order.
- English switching works and major homepage content is translated. Catalog/category names and policy remain Arabic. Arabic was selected again after testing.
- Footer email is the verified store email. Footer phone remains 8001111210; Instagram/X/YouTube still point to Salla sample accounts.
- Partners explicitly reports the theme under review and read-only, with withdrawal required to edit the submission. No withdrawal, push or publication was performed.

## Launch gates

1. Apply the corrected release through Salla's allowed workflow and repeat live search, quantity/line total, add/remove, Quick View, option validation and checkout tests on the deployed version.
2. Replace/verify the demo phone and sample social links through store settings. Prior handover notes that phone changes require SMS verification and social saving encounters YouTube validation; these remain unresolved.
3. Confirm actual inventory, shipping/payment setup and final customer policies in the target production store. The demo and connected production merchant are distinct; demo tests do not certify production configuration.
4. Review English catalog/policy content if English customers are in scope. Product names may legitimately remain untranslated, but this review does not certify complete English content.

Release files: `release/ZOD-Commerce-v1.6.48-Salla-Upload.zip` and `release/ZOD-Commerce-v1.6.48-Source.zip`.
