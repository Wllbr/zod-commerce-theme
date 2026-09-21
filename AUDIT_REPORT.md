# ZOD Commerce 1.9.6 — commerce and visual audit

21 September 2026. Development review branch only. No live publication or purchase.

## Result

Production build and the complete automated suite pass: 138 build inputs and 20 outputs match the release manifest. CSS is 72,292 bytes combined gzip. Two Webpack raw-size advisories remain. The current revision is a staging candidate, not a certified 9/10 storefront or Salla marketplace approval.

## The three “Not Found!” messages in the v1.8.0 screenshot

The exact fan 1845 (p489401632) and KDK p2058856094 were opened in the development store. Neither reproduced the three alerts; the final inspected fan page contained zero theme notices. The old production request that generated those errors was not captured, so its original cause is not conclusively diagnosed. The fan is unavailable in this draft, unlike the supplied published screenshot; this is an important difference in coverage.

Repeated identical notices now collapse into one. Errors expire after 6.5 seconds; success messages after 3.5 seconds. Notices have a close button, Escape support and keyboard-focus pause. The required native add-product toast remains and dismisses after 5 seconds of active viewing. Its richer content uses the confirmed cart item. Add, quantity-update and delete use the native Salla events. Last-item deletion now carries a short-lived, single-use success flag across the empty-cart reload.

## Visual findings and fixes

1. Initial mobile cart audit found a hidden native summary. An obsolete display:none rule was responsible. Salla moves its mobile summary to body, outside the previous scoped visibility override. Removed that rule and supported the actual native placement. There is one native checkout summary, with native validation and no proxy checkout button.
2. Mobile navigation is present on product and cart pages. The first new draft exposed two style conflicts: bunched navigation icons and an off-screen purchase panel. Corrected the grid layout and old centering overrides. Native screenshots of draft 1575812903 show evenly spaced navigation below the cart checkout and product purchase controls.
3. The cart displays Salla's monetary breakdown: four KDK units, subtotal 320 SAR, discount 16 SAR, total 304 SAR. Product-line amount is 304 SAR and unit amount 76 SAR. The PDP offer price is 80 SAR before the additional cart offer. No invented savings or tax arithmetic.
4. Added and removed the KDK item during testing, then restored the original four units. The native summary again showed four units, discount 16 SAR, total 304 SAR. Add confirmation and automatic dismissal were observed. Quantity update feedback and its dismissal were observed. Removing the final item reached the native empty-cart page; its reload revealed the short confirmation lifetime fixed in the final follow-up.
5. A native offer description exposed the literal {payment_method}. It now reads “طريقة الدفع المؤهلة للعرض”. Actual merchant offer amount and conditions remain untouched. The merchant's offer wording still says “خصم 5” without identifying percent versus amount; this requires correction in Salla's offer content, not a guessed theme suffix.
6. Stand-fan category, HTM brand, footer and header were inspected. Compact HTM header replaces the large mobile brand block. Category cards, native stock state, category links, footer contact/policy/social links and enabled payment icons rendered. The native preview exposes bank transfer and COD; enabled Tabby/Tamara and real review data were not demonstrated.

## Shipping progress component

The new “تقدم الشحن المجاني — عروض سلة” component appears in Salla's component catalog. The homepage hero tile and floating progress icon use the same cart.free_shipping_bar data. The native minimum amount, remaining amount, percentage and eligibility determine the UI; the fixed SAR350 target and subtotal fallback were removed. Missing, disabled or incomplete shipping-offer data hides the UI. The currently inspected draft did not expose an active progress offer, and the old unsupported free-delivery promise disappeared.

Automated cases cover different native thresholds (including 350 and 500), incomplete/disabled data, eligibility, late requests, failures and focus behavior. A real active offer and merchant threshold changes still need a controlled staging check. No merchant shipping or discount rule was changed in this audit.

## Preview consistency

Initial draft 237554428 was audited before edits. First candidate 1858942425 exposed the dock conflicts. Corrected code b898330 was inspected in draft 1575812903. Keeping an older generated preview active caused linked pages to load that older draft's assets. After closing the older generated tab and reopening the current draft, page assets were verified as /themes/draft/1575812903/app.css. This was not treated as proof of a production navigation defect. Browser timeouts also occurred; screenshots and loaded asset paths were used to verify actions instead of assuming success.

## Remaining before final storefront approval

- Verify the final last-item removal confirmation in a fresh native preview; its one-time, expiry and same-page behavior pass automated tests. The final preview launch returned to Salla sign-in, so this last native check needs a restored editor session.
- Reproduce or capture the original live v1.8.0 Not Found requests if they persist after staging installation. No original failure trace is available.
- Confirm a real active free-shipping rule, changed threshold and disabled state in the intended merchant store. Theme code does not create an offer.
- Complete the saved homepage hero copy and department-instance arrangement from STORE_SETUP.md. The older saved generic hero headline still appears over intercom artwork. LED and Bigboi remain hidden by default until inventory is ready.
- Complete final desktop/mobile homepage and laser playback review, enabled installment/review verification, English content, physical-device and screen-reader checks. No Lighthouse measurement, payment transaction or Salla certification was performed.

The earlier fixed-350 shipping behavior, suppressed mobile PDP/cart navigation, and prior blanket native-browser blocker are superseded by this report. The three approval guards remain: salla-add-product-toast in master, salla-review-order-item in customer order details, and no automatic product-details calls during card/list initialization.
