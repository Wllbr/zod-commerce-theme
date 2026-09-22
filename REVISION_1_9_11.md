# ZOD Commerce 1.9.11 — optional hosted media

Review candidate, 22 September 2026. Not published live.

- Generated hero and laser images uploaded to Salla media gallery; banner images belong to saved component settings, not theme defaults.
- Removed all nine bundled WebP campaign/showcase images from source and production output. Only the tiny neutral missing-product SVG remains as a functional fallback.
- Removed legacy department sample product/category IDs and fixed links. Existing merchant selections remain editable.
- Empty hero image slots are omitted. With no hero images, the banner is absent; optional shipping/offer content may still render.
- Replaced named campaign selectors with a draggable range track synchronized to automatic/manual slide changes. One image hides the track; no images safely skip initialization. New optional switch: إظهار شريط التنقل أسفل البنر.
- Image fields are optional across components; added guards for missing images. Actual catalog product/category/brand images remain supplied by Salla.
- Strict upload archive maximum: 1,000,000 bytes. Full source and production assets are retained in the package.

## Publication checks

Build, test and native staging results are recorded in QA_REPORT.md. Final inspected draft: 2041070824, code 201ba45. Image assignments are saved in demo store 261553813 and must also be configured in the destination merchant store. Approval-specific native components remain required. Merchant shipping campaign values must match the active Salla rules. Payment completion and physical-device testing are separate gates; no payment will be submitted in this review.
