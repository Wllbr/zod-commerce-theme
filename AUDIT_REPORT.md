# ZOD Commerce 1.9.7 — mobile product and shipping audit

21 September 2026. Review branch only; no live publication, checkout transaction or shipping-rule change.

## Result

Production build and complete automated suite passed. The manifest verifies 140 inputs and 20 outputs. Validation covers 78 Twig templates, 36 custom components and 347 translation references. CSS: app 396,065 bytes raw / 64,958 gzip; refinement 38,753 raw / 7,134 gzip; combined 72,092 gzip. Two Webpack raw-size advisories remain.

Final code commit: 15eedf9 on codex/zod-1.9.0-review. Native final draft: 383728642. Its app.css asset path was verified. Earlier candidate 2105970949 exposed missing mobile offer arrows, which were corrected and retested in the final draft.

## Mobile product findings and changes

- On available fan p627597650, removed the empty 76px purchase-form reservation, unused brand row and empty installment margins. Reduced buybox padding and vertical spacing without hiding real product options. The native purchase controller remains fixed above persistent bottom navigation.
- Replaced the three PDP trust icons with custom lightweight inline SVGs: specifications, secure payment and delivery. A short stroke animation runs once when the row enters view. Reduced-motion preference disables it. The row remains three columns on mobile.
- Product and cart offers now open from a compact summary. Summary wording comes from the actual native offer titles. No estimated discounts or new commercial claims. Empty offer components remain hidden.
- Final native product check: expanded the panel, used native Next slide controls to reach all three offers, and collapsed it using Enter. Salla normally hides these arrows on mobile; this revision makes them available inside the panel. Native offer descriptions and conditions remain intact.
- Product screenshots verified the compact collapsed panel, three trust icons, native payment methods, eligibility popup, purchase controls and navigation. Current enabled payment evidence was bank transfer; enabled Tabby/Tamara and actual customer reviews were not demonstrated.

## Why the enabled shipping icon was absent

Merchant UI showed an enabled rule: minimum 350 SAR, Saudi Arabia/all cities, Dev Company only, maximum 50kg. Salla explains that address and carrier restrictions can defer eligibility until the customer provides those details. The inspected cart had no native free_shipping_bar progress data. The old component hid everything in that case.

Following the user's explicit choice, the enabled component now shows a neutral truck icon and “تحقق من أهلية الشحن المجاني” before confirmation. Opening it explains that address, delivery method and offer conditions determine eligibility. It links to the cart. No zero-progress bar or free-delivery promise is shown in this state.

When Salla supplies complete cart.free_shipping_bar data, minimum_amount, remaining, percent and has_free_shipping drive the progress bar, remaining amount and celebration. No fixed 350 fallback exists. Different thresholds including 500, incomplete data, disabled/removed data, request races, failed refreshes and popup focus behavior pass automated checks.

Important: absent native data cannot distinguish an ineligible cart from a disabled merchant rule. The neutral eligibility icon therefore remains while its theme setting is enabled, as requested. To remove all shipping prompts, disable the floating icon and the relevant homepage component/hero tile. A removed native rule clears confirmed progress and celebration; it returns to neutral eligibility text.

Final native screenshots verified all three surfaces: homepage hero tile, separately enabled homepage shipping component, and floating icon. The standalone component is placed just before the newly saved intercom department. Merchant layout and shipping settings were preserved.

## Cart and error checks

The existing cart was left unchanged: two units of p627597650 and one of p1313406228. Native rendered subtotal 836.60 SAR, discount 41.83 SAR, total 794.77 SAR. Mobile cart screenshot verified the compact offer row, native sticky checkout, savings amount and navigation. No cart mutations were performed during this revision's audit.

No three persistent Not Found alerts were observed on the sampled product pages. The original live v1.8.0 failure trace is still unavailable, so its exact cause is not proven. Prior v1.9.6 notification fixes and approval guards remain covered by the automated suite. Final empty-cart reload confirmation still requires a controlled native mutation test.

The preview console is not clean: Salla live-reload connection errors and HTTP405 responses for its preview page/track telemetry endpoints were captured. They did not produce the supplied three visible product alerts. No theme-side request suppression or fabricated success was added.

## Remaining validation and content work

- Confirm native progress and celebration after a real eligible address/carrier selection. The restrictive rule did not expose progress before checkout; no address was invented and no order was placed. Native threshold/off-state merchant changes were not performed.
- Finish saved homepage campaign copy and section arrangement. The generic saved first headline remains above intercom artwork. A saved shipping component and intercom department now exist; the earlier statement that no department instances were saved is superseded.
- Complete full desktop/English, physical-device, screen-reader, real review/installment, final laser and performance measurement coverage. The current work focused on the requested Arabic mobile PDP, offers and shipping UI; it does not establish a whole-store 9/10 score.
- Salla marketplace approval is still external. Preserve salla-add-product-toast in master.twig, salla-review-order-item in customer order details and no automatic salla.product.getDetails calls from card/list initialization. These checks pass.

Official shipping behavior reference: https://help.salla.sa/en/article/setting-up-free-shipping-in-your-store/zr6n1k2b8ogmvg8md6lv4rgs

