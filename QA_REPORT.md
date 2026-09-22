# ZOD Commerce 1.9.12 — final media and layout review

22 September 2026. Review candidate, not published live. Version 1.9.12 adds the requested desktop-only checkout placement to the validated 1.9.11 media/layout candidate.

## Completed

- Uploaded nine optimized generated WebPs to the Salla media gallery of demo store 261553813. Saved and reloaded six hero image selections and two laser poster selections. The power campaign remains available in the gallery for optional use.
- Removed all nine campaign/showcase WebPs from source and compiled theme assets. Retained the 308-byte neutral missing-product SVG. Media backups are outside the theme ZIP.
- All 26 component image fields are optional with empty defaults. Empty hero image pairs omit their slide; no images omit the carousel. Other image displays have empty-image guards or use the selected catalog product's actual image.
- Replaced named banner selectors with a small range track. It follows automatic slide changes; dragging or keyboard selection chooses a slide and stops automatic rotation. Added an optional display switch; corrected Salla's null value for existing saved components.
- Removed legacy department sample catalog IDs/links. Existing merchant selections remain editable. Small compatibility templates are retained so saved older components can migrate safely.
- Upload packaging enforces a strict 1,000,000-byte limit, retaining full source and production assets.
- Desktop checkout is in normal flow directly below the native order totals. Mobile keeps its existing fixed checkout and persistent bottom navigation.

## Validation evidence

- Production Webpack build passed; 139 inputs and 15 outputs match the manifest. Existing raw CSS/entrypoint size recommendations remain.
- Full regression suite passed, including approval markers, shopping/cart/notifications, shipping goals, media defaults, campaign navigation, CSS budget and build integrity. After the final Twig null-setting correction, production build and campaign/media/integrity checks passed again.
- Native final draft: three mobile and three desktop hero images load from Salla CDN; range visible, automatic position changes observed, End selects slide 3 and Home selects slide 1 with matching accessible labels.
- Actual rendered hero height: 220 px at 375 px mobile content width; 320 px at 1265 px desktop content width. No horizontal overflow at those inspected widths.
- Mobile KDK 25AUA PDP: compact gallery, persistent purchase controls and mobile navigation; three trust blocks in one row; offer disclosure opens and exposes the supplied Salla offer details. No visible Not Found toasts during this sample.
- Mobile cart: exactly one visible checkout button in the sticky summary; quantity badge 5; native total 1,120.05 SAR and displayed saving 58.95 SAR; shipping celebration visible. Cart contents were not changed during this pass.
- Wall-exhaust category direct destination loads 15 products with consistent header/cards and no desktop horizontal overflow. Footer category, policy, contact and payment content present.
- Approval fixes retained: salla-add-product-toast in master, salla-review-order-item in order details, no automatic product-details requests during product-card/list initialization.

## Adjustments and checks required before publication

1. Images and component settings were saved in the demo store, not copied into a live merchant store. Select/upload these images and actual category/product links in the destination store. Theme installation alone does not migrate those settings. Empty optional sections intentionally stay absent until configured.
2. Clean merchant test content before launch: offer titles include C3453--1/C873-1 and a product badge says «تحب تشوف خصم شوف». Confirm the top 9 SAR shipping announcement agrees with the manually configured 350 SAR free-shipping message and actual Salla delivery rules. The visual progress component does not enable free delivery in checkout.
3. Salla preview console still reports page-view POST 405, live-reload connection failure and getInitialData timeout. Root causes are not established. A footer category click did not navigate in one standalone preview observation although the exact direct destination loaded successfully; retest navigation in the merchant draft before live release.
4. Complete a real-device mobile check and the destination store's address/carrier/checkout test. Only bank payment was exposed in this demo; Tabby/Tamara/Apple Pay and successful payment were not verified. No payment was submitted.
5. Zud's enabled bundle widget supplies quantities/pricing/gifts; reconcile its offers with native Salla offers before launch. No backend discount or analytics behavior was copied into the theme.
6. This is a focused final media/layout regression review, not a complete accessibility/performance certification, a 35-product stress test, or a diagnosis of the old live 1.8.0 PDP errors. No unsupported 9/10 score or marketplace approval is claimed.

## Editing images and navigation

Open «واجهة الحملات والأقسام — زود» in the Salla editor. Choose desktop/mobile images from the gallery for each campaign. Clear both fields to omit that campaign. Toggle «إظهار شريط التنقل أسفل البنر» to hide/show the new track. Text and shopping links remain editable over the images. Catalog images continue to come from Salla.
