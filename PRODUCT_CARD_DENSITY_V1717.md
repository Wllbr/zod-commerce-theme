# ZOD Commerce v1.7.17 — Product card density and direction

This release makes the shared Salla product card compact at normal browser zoom and removes conflicting historical sizing overrides.

## Direction contract
- Arabic (`dir=rtl`): wishlist and quick-add are on the left; title/rating/price align right.
- English (`dir=ltr`): wishlist and quick-add are on the right; title/rating/price align left.

## Density
- Shorter product media stage.
- Two-line title, reserved compact rating row, price immediately below.
- Swiper slides align to the top and do not stretch cards to the tallest sibling.
- Seven cards at very wide desktop, six on standard desktop, five on compact desktop, two on mobile.

## Feedback / offers
- Salla's native add-product toast is the only cart notification surface.
- The red promotion strip remains, but is slimmer.
- If the promotion text already repeats the exact discount percentage, the green percentage beside price is hidden to avoid duplicate discount copy.
- Sold-out stamp is reduced so it no longer dominates product imagery.
