# ZOD Commerce 1.9.5 — continuation audit

## Local fixes and evidence

- Corrected all 16 department collection default objects to use full editor field IDs such as groups.title. This follows [Salla's reference theme configuration](https://github.com/SallaApp/theme-raed/blob/master/twilight.json). The new contract test failed against 1.9.4 and passes after the correction. This is a plausible cause of the previously incomplete Commax form, not a verified native diagnosis.
- Corrected the department product-picker label to its actual eight-product limit.
- Reworked the actual native homepage store-features component into three compact columns. The previous refresh styled only the separate custom trust and PDP components.
- Visually inspected the compiled CSS in local 320px, 390px and 768px iframe fixtures with existing Arabic merchant copy. All three columns remain visible. At 320px, grid width 240.8px and scroll width 241px (rounding only). The fixture uses placeholder symbols, not native Salla icon fonts; native validation is still required.
- Shipping popup no longer closes while its close control has keyboard focus; manually reopening it cancels the automatic timeout. Added event-level tests covering late responses, failures, focus restoration and popup timing.

Production build and full regression suite pass. This is a local continuation pass; it does not count as a completed full-storefront visual audit. The native browser policy restriction was not bypassed or retried. The 9/10 target remains unverified, with the same saved-content and editor-arrangement work below outstanding. No live publication.

---

## Previous draft evidence (1.9.4)
# ZOD Commerce 1.9.4 — audit and release status

21 September 2026. Arabic UI, layout and components. Development draft only; no live publication.

## Result

Production build and automated regression checks pass. Visual audit round 1 is incomplete. The requested 9/10 target has NOT been established; no overall score is awarded from partial observations. Rounds 2 and 3 have not been performed. This package is a development review candidate, not a visually approved final release.

## Implemented

- Original generated intercom, extension and ventilation campaign artwork, without product references or AFC imagery. Generated art illustrates categories, not exact sale models.
- Removed duplicate hero category shortcuts; retained the separate category grid.
- SAR350 progress ring and bar, remaining amount, cart-update notice and completion celebration with reduced-motion support. Uses matching native eligibility when available, otherwise confirmed discounted subtotal; excludes delivery fees and taxes.
- Persistent product purchase dock; removed the pre-order reminder; retained native installment/review components. Product pages retain header search because their bottom navigation is suppressed.
- Smaller mobile cards, department headings, trust items and footer spacing.
- Laser video starts muted when its section enters view, pauses outside and respects manual pause and reduced motion. Transparent card surfaces replace white wrappers.
- Sixteen editable department components, category tabs, deferred native product feeds, empty group suppression, hidden LED and Bigboi defaults. See DEPARTMENTS_AR.md.

## Evidence from round 1

Code ba32cf4 was pushed to the review branch and Salla created development draft 1313754418. Its mobile homepage rendered the new artwork. The editor preview displayed the completed shipping state (party icon and free-delivery text) after cart data loaded. New department components appeared in Salla's add-component list.

The saved hero still displayed previous headlines and copy. The Commax create form did not finish loading editable controls. No new department instances were saved or arranged. Browser security then blocked further access with a URL-policy rejection. No workaround was attempted.

Local review then fixed a mobile product-page search issue: its header search had been hidden by the bottom-navigation class even though the purchase dock hides that navigation. This final correction requires another native preview.

## Remaining work before 9/10 can be claimed

1. Edit saved hero 879805737 to the matching intercom and extension copy in STORE_SETUP.md; correct the second slide destination.
2. Verify new component forms accept and retain default groups, save the desired department instances, arrange them among campaigns/brands, and hide obsolete duplicate shelves and comparison 453963266.
3. Inspect final desktop and mobile homepage, PDP, category, cart and footer. Check actual card sizing, trust layout, fixed dock clearance, search access and laser white surfaces/playback.
4. Verify native installment visibility using enabled Tabby/Tamara settings and reviews with actual review data. Their native components remain in the PDP but this round did not verify active providers or reviews.
5. Configure and verify the actual SAR350 shipping rule before advertising live eligibility; theme UI does not activate it. Mada promotion remains optional and requires an actual discount rule and terms.
6. Populate missing subtype inventory and exact air-curtain sizes. LED and Bigboi remain hidden. No random unrelated products are intentionally shown as substitutes.

## Scoring method for the remaining rounds

Assess visual hierarchy and image/copy relevance (2), category discovery and content completeness (2), mobile sizing/spacing (2), PDP/laser/shipping interaction (2), and accessibility/footer consistency (2). Award 9/10 only after the final native draft is inspected and material issues are fixed. Build tests alone cannot establish this score.

## Build and limits

Production Webpack build and full local test suite passed: schema/templates, approval guards, shopping state, persistent purchase layout, laser visibility, campaign behavior, shipping boundaries and build provenance. All three approval fixes remain: native add-product toast, native order-item review, and no automatic product-details calls during card/list initialization. Existing CSS size gates pass; Webpack retains two raw size advisories.

No new checkout/payment transaction tests, physical-device tests, screen-reader tests, Lighthouse score or Salla approval certification. English campaign/department copy remains incomplete by the current Arabic-first scope. Editor configuration/order is stored in Salla and is not transported by the ZIP.


