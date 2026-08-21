# ZOD Commerce v1.6.27 — Product Type Switcher Rendering Fix

## Root cause

The Salla editor can serialize dynamic category/product fields in more than one shape. The previous template expected full product objects for manual selections and a narrow category object shape. In the editor, selected items can instead arrive as IDs or item wrappers, so the product card received unusable data and the category fallback could resolve to no ID.

## Fix

- Normalize the single category selector to a scalar category ID.
- Normalize manually selected products to product IDs.
- Render manual products through the native `salla-products-slider` with `source="selected"`.
- Render category products through the native slider with `source="categories"`.
- Preserve the one-category-per-type editor schema and the existing tab interaction.
