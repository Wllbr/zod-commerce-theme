# ZOD Commerce 1.9.10

22 September 2026. Review branch only; do not publish without merchant approval.

## Changes

- Arabic-only full-image campaign banners. Generated dark installed-product scenes: COMMAX 70QT/40K at an entrance, KDK 25AUA through a room wall, and the merchant's exact Ocarina reference suspended in a covered seating area. Text is baked into artwork. No separate English artwork or HTML text overlay. Alt descriptions remain available to assistive technology.
- A 2:1 banner stays complete at all widths. Arabic transitions move physically left to right; English page transitions reverse while using the same Arabic artwork. Swipe, keyboard, Escape, focus/hover pause, reduced motion and background pause remain.
- Laser browse-all moved into the header. A horizontal rail with previous/next controls supports up to 35 configured products. Inactive product lists mount only when selected; video visibility/pause behavior is preserved.
- One reusable department entry replaces 16 department-specific entries. Existing intercom component key/path retained, with editable heading/image and up to 12 groups. Repeat this component for any brand or department. Legacy templates are retained for migration; older department definitions remain in the preceding release ZIP. Existing sections using removed entries need migration before a live upgrade.
- Interactive showcase now offers 24 icons and up to 12 benefits. Active icons animate only in view; reduced-motion preference stops animation. Manual benefit selection stops automatic rotation, and focus pauses it.
- Mobile dock and header share the same cart quantity updates. Zero hides the badge, and quantities above 99 display 99+.
- Removed the cart's extra summary/proceed-style link. The existing native checkout button is the sole checkout action; it remains fixed at the bottom on desktop and in the native mobile dock.
- Shipping target independence, native approval components and the ban on automatic product-details calls remain unchanged.

## Zud

The installed app's visible bundle editor includes quantity discounts, gifts, targeting and conversion/revenue analytics. Pricing, gifts and analytics require app/backend services. Those features remain in Zud; no imitated checkout discounts or analytics component was added.

## Build/QA status

Automated behavior checks and production build are being completed with native draft visual validation. See QA_REPORT.md and BROWSER_QA.json for final evidence.

## Images and performance

Built-in image generation was used. Original PNGs and exact prompts are retained in outputs/hero-v1.9.10 in the delivery workspace. Optimized WebP images total 193,492 bytes (three images); first image eager/high-priority, later images lazy. The local ZIP budget rises to 1.25 MiB because the package contains both source and compiled image copies. This is a project budget, not a claimed Salla platform limit.

## Remaining gates

- Merchant review of the new artwork and category links.
- Migrate any saved department-specific sections to the reusable department before live upgrade.
- Physical-device and complete storefront/accessibility/performance audit have not been completed in this revision.
- Checkout payment completion, shipping-rule configuration and Zud discount calculations were not altered or transacted.
