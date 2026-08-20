# ZOD Commerce v1.6.24 — Product Type Switcher Reliability & Polish

The existing **Products by Type / منتجات حسب النوع** component keeps all merchant-saved rows and now behaves as a reliable category switcher.

## What changed

- Existing `groups` data is preserved. No component recreation is required.
- Tabs use the ZOD white/charcoal interface with a restrained primary-color active marker.
- Inactive product groups are mounted only when selected.
- Newly mounted Salla product sliders are upgraded and refreshed after becoming visible, preventing zero-width or stale carousel layouts.
- Tab centering scrolls only the horizontal tab rail, so selecting a type does not jump the page.
- Arabic RTL and English LTR keyboard navigation remain supported.
- The matching “Browse all” destination updates when the selected product type changes.
- Mobile remains a horizontal product carousel with compact two-across product discovery.
