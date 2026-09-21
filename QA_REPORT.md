# ZOD Commerce v1.9.3 — Arabic UI and components

Date: 21 September 2026. Scope: UI/layout/components only, per user direction. No live publication, payment, checkout or shipping-settings changes.

## Design changes

- Replaced the three product-reference hero tiles with an original 3-slide architectural/conceptual campaign. Home comfort, electrical energy and living-space artwork generated with the built-in image tool. No input reference images or AFC imagery. Arabic headings remain selectable HTML text.
- Added clear category shortcuts and optional shipping/mada offer tiles. Shipping design says orders above SAR 350; actual shipping rules are unchanged. Mada stays hidden unless enabled with a terms link; the proposed discount is not activated by the theme.
- Added reusable brand collections: editable identity, banner, headline, up to six keyboard-accessible tabs, selected products or native category feeds (12 products per group). Inactive groups load only on selection. Selected products take priority.
- Prepared KDK as a brand example that the merchant can later change to Ocarina. The inspected draft has only two STAC products and no Ocarina brand page; no additional product inventory was invented.
- Removed obsolete hero fields that no longer affect the design. Custom campaign-image overrides remain available. Replaced older AFC-based default comparison artwork with conceptual campaign images.
- Corrected a visible currency-markup leak in the existing interactive showcase price display. Native server prices remain authoritative.

## Validation

- Local Arabic desktop composition inspected at actual 1280px. Corrected RTL headline alignment.
- Local 390px-wide iframe composition inspected visually (browser-wide viewport override did not change actual viewport). Salla editor mobile preview also inspected.
- Campaign next/dot control and electrical destination verified in Salla. Shipping tile and autoplay setting saved in the development draft.
- New regression checks exercise manual navigation, focus pause, reduced motion, hidden-page pause, RTL swipe and one-time lazy tab content mounting.
- Production build passed (109 inputs / 20 outputs); full regression suite passed. CSS remains within the existing budgets (72,232 bytes combined gzip). Webpack retains two raw asset-size advisory warnings.
- Native Salla draft 1693037723: KDK second tab loaded two industrial fans; electrical tabs loaded transformers, ten stabilizers and twelve extensions; STAC displayed its two catalog products. No broken loaded images or horizontal desktop overflow observed. No literal currency HTML remained visible.
- Saved order: campaign, category grid, three primary departments, KDK, electrical explorer, STAC, then broader brand/secondary content. Old duplicate hero and full-screen promotion are hidden in the draft.

## Limits

This is an Arabic design revision, not a new Salla approval score. Storefront English campaign copy is not completed. Real mobile devices and screen readers have not been tested. Checkout testing is outside the requested UI-only round. Native stock, prices and catalog names are preserved, including unavailable items and merchant test labels. Published-store shipping and mada eligibility/terms must be configured and checked before these promotions are used live.

## Final delivery

Final Salla draft: 884901354 (code commit 75560ef). Final 1600px desktop inspected after the last copy refinement. Full native feed interaction was checked in preceding draft 1693037723 with identical collection behavior. Production release gate passed; the archive contains 142 files and is below the project's 1 MiB budget. No live publication.
