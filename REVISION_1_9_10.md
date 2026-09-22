# ZOD Commerce 1.9.10

22 September 2026. Review branch only; do not publish without merchant approval.

## Changes

- Compact campaigns with editable Arabic HTML headings, descriptions and shopping buttons over generated text-free backgrounds. Generated dark installed-product scenes: COMMAX 70QT/40K at an entrance, KDK 25AUA through a room wall, and the merchant's exact Ocarina reference suspended in a covered seating area. Separate desktop and mobile compositions preserve product visibility. The same Arabic copy and imagery are used on English pages. Alt descriptions remain available to assistive technology.
- Default artwork area is 320px on desktop, 280px on tablet and 220px on mobile; longer merchant copy or enlarged text can grow the area for accessibility. Corners are rounded, with three named selectors below. Arabic transitions move physically left to right; English page transitions reverse while using the same Arabic artwork. Touch swipe, desktop mouse drag, named selection, keyboard, Escape, focus/hover pause, reduced motion and background pause are supported. Manual navigation stops rotation.
- Laser browse-all moved into the header. A horizontal rail with previous/next controls supports up to 35 configured products. Inactive product lists mount only when selected; video visibility/pause behavior is preserved.
- One reusable department entry replaces 16 department-specific entries. Existing intercom component key/path retained, with editable heading/image and up to 12 groups. Repeat this component for any brand or department. Legacy templates are retained for migration; older department definitions remain in the preceding release ZIP. Existing sections using removed entries need migration before a live upgrade.
- Interactive showcase now offers 24 icons and up to 12 benefits. Active icons animate only in view; reduced-motion preference stops animation. Manual benefit selection stops automatic rotation, and focus pauses it.
- Mobile dock and header share the same cart quantity updates. Zero hides the badge, and quantities above 99 display 99+.
- Removed the cart's extra summary/proceed-style link. The existing native checkout button is the sole checkout action; it remains fixed at the bottom on desktop and in the native mobile dock.
- Shipping target independence, native approval components and the ban on automatic product-details calls remain unchanged.

## Zud

The installed app's visible bundle editor includes quantity discounts, gifts, targeting and conversion/revenue analytics. Pricing, gifts and analytics require app/backend services. Those features remain in Zud; no imitated checkout discounts or analytics component was added.

## Build/QA status

Production build and the complete automated suite passed. Manifest: 147 inputs / 24 compiled outputs. 79 Twig templates, 21 custom components, 331 locale references, 21 JavaScript files. Combined stylesheet transfer: 72,536 gzip bytes. Two existing Webpack raw asset-size recommendations remain; no build errors.

Earlier native draft 1289633877, code commit 219fa3b (before the compact overlay refinement): laser header browse button measured at physical left, rail navigation changed the active product; native editor lists one reusable department and 24 icon options. Existing intercom content retained all four groups. Featured dimension/power icons saved in the native editor and verified after reloading the storefront. Mobile cart count changed 3 → 4 → 3 and was restored; only one checkout button rendered. Desktop native checkout measured fixed at bottom (440px width, 16px bottom inset).

## Images and performance

Built-in image generation was used. Original PNGs and exact prompts are retained in outputs/hero-v1.9.10 in the delivery workspace. Files ending desktop-background/mobile-background are the final artwork; older baked-text files are superseded. Optimized WebP images total 201,200 bytes (six responsive images; only the selected device source loads); first image eager/high-priority, later images lazy. The local ZIP budget rises to 1.25 MiB because the package contains both source and compiled image copies. This is a project budget, not a claimed Salla platform limit.

## Final compact-hero staging check

Draft 1712384850 served code commit 5fa0dc2 from codex/zod-1.9.0-review. Measured in the native storefront: 320px artwork height at 1425px content width; 220px at 375px. All three mobile compositions were visually inspected, with readable Arabic HTML copy, a real category CTA and no horizontal overflow. Three selector buttons changed the active campaign. A desktop drag advanced COMMAX to ventilation. The English/LTR page retained the Arabic campaigns, used English category routes and remained 220px without overflow. Bidirectional touch/mouse behavior and cancellation are covered by automated tests; a physical touchscreen was not tested. Native editor exposes all nine copy fields and three separate mobile-image fields. No live publication.

The Salla preview console still reports its page-view POST 405, getInitialData timeout and live-reload disconnection, plus a Twilight CDN listener-count warning. These were not traced to a final root cause in this pass and remain documented; the storefront must not be described as error-free. The banner itself rendered and its controls worked.

## Remaining gates

- Merchant review of the new artwork and category links.
- Migrate any saved department-specific sections to the reusable department before live upgrade.
- Physical-device and complete storefront/accessibility/performance audit have not been completed in this revision.
- Checkout payment completion, shipping-rule configuration and Zud discount calculations were not altered or transacted.
