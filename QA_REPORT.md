# ZOD Commerce 1.9.9 — product hero and independent shipping targets

21 September 2026. Review branch only; no live publication or shipping-rule edits.

## Changes

- Each homepage shipping component has its own target, text, icons and discount basis. The hero's shipping tile also has its own controls. The floating icon retains the global theme controls. A single cart refresh feeds separate calculations for every instance.
- Existing saved components can return empty new fields; target fallback keeps these visible until their individual values are saved.
- Rebuilt the hero with generated COMMAX CDV-70QT / DRC-40K, KDK 25AUA and Ocarina metal insect-zapper artwork. No stock campaign imagery or AFC references. The exact Ocarina model was unspecified; brand-only copy avoids wattage/coverage claims.
- Removed visible play/pause, arrows, dots, edition labels and numbering. Swipe, RTL keyboard navigation, focus/hover pause and reduced-motion behavior remain. Equal-height slides prevent the next section moving when heading length changes.
- Separate readable text and imagery on desktop; compact vertical layout on mobile. Copy/images/category destinations remain editable. Obsolete campaign fields removed from the editor.
- Relevant COMMAX/KDK artwork reused in department panels; superseded assets removed from the package. The three optimized hero images total 98,488 bytes.

## Build and tests

Production build and the complete automated suite pass. Manifest: 142 inputs / 21 outputs. Validation: 79 Twig templates, 36 custom components, 332 translation references and 21 JavaScript files. CSS: app 394,136 raw / 64,651 gzip, refinement 38,753 raw / 7,134 gzip; combined 71,785 gzip. Two Webpack raw-size recommendations remain; no build errors.

New regression checks use two targets (350 and 500) against the same cart, with the component first in DOM order. They prove separate progress and a single shared request. Existing decimal, Arabic-digit, discount, invalid data, notification, stale response and focus checks pass. The hero is tested without buttons/dots and supports keyboard navigation and Escape. All three Salla approval guards remain intact.

## Native visual checks

Code b087522 is on codex/zod-1.9.0-review. Final draft 602971975 loads its matching app.css. All three shipping surfaces render target 350 and the completion state for the existing cart. No cart contents or quantities were changed.

The COMMAX, KDK and Ocarina campaigns were visually inspected. Desktop split layout tested at 1440 wide; compact mobile layout at 390 wide. Mobile viewport measured 391px high on all three slides; desktop remained 458.61px. No visible hero buttons, dots or numbering. Mobile bottom navigation and floating shipping icon remain visible.

The native editor recovered after slow form loading. Existing shipping component 1718646479 was saved with target 1000 and custom remaining copy. After storefront reload, the hero and floating icon stayed at target 350 / 100%, while this component showed target 1000 / 67% and “باقي 327.97 ر.س للوصول إلى 1000 ر.س”. Target 350 and the original message were then restored and verified after another reload. This confirms native per-instance save, persistence, custom placeholders and independent calculations. No cart mutation was needed.

## Preview console observations

The Salla preview still logs a native page-view POST 405, a getInitialData timeout and a disconnected live-reload server. The inspected hero and shipping UI worked despite these messages. These are not evidence that every storefront console issue is resolved; production/preview service validation remains open.

## Remaining wider storefront checks

This focused revision does not certify a whole-store 9/10 or Salla marketplace approval. Earlier remaining checks include the original live 1.8.0 error trace, complete English / physical-device / accessibility / performance audit, final empty-cart reload notification, saved homepage content review, and enabled installment/review data. Manual shipping advertising must match actual Salla checkout rules.
