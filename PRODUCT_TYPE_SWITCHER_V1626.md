# ZOD Commerce v1.6.26 — Product Type Switcher

## Fixes

- One category per product type.
- Handles both single category objects and legacy one-item category arrays.
- Category products render through Salla `salla-products-slider` with category IDs encoded as an array, as required by the storefront component.
- Inactive panels are present in the DOM from initial render and are refreshed when activated, avoiding late-template mounting issues in the Salla editor.
- Uses `sicon-layout-grid` so the component has a visible editor icon.
- Image dimension requirements are included in upload labels and width/height settings.
