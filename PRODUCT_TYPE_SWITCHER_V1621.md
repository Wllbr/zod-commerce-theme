# ZOD Commerce v1.6.21 — Product Type Switcher

## Cause

Salla kept the editor rows for the switcher but returned the generic `groups` collection as empty to the Twig storefront renderer. The page contained the component's editor markers with no section between them.

## Fix

- The collection now uses the dedicated `product_types` key.
- Each type still supports an automatic category source, up to 12 manually selected products, and an optional browse-all link.
- A validation rule prevents the old conflicting key from being used again.

Existing switcher settings must be saved once in the updated editor so Salla stores the values under the new collection key.
