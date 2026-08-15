# Changelog

## 1.4.1
- Replaced blocking add-to-cart success alerts with a non-blocking ZOD cart toast in preview/storefront.
- Interactive featured product now refreshes its displayed price from Salla live product APIs.
- Removed the interactive showcase eyebrow / “Featured Offer” line.
- Added a Salla-native WhatsApp contact component that reads the number from store settings.
- Rebuilt footer customer-service contacts as icon-only controls with glow interactions.

## 1.4.0 — Mobile Commerce Pass

- Replaced the visible native header cart summary with a clean count-only cart button while keeping Salla cart state as the source of truth.
- Empty cart badges are hidden; no red `0` is shown.
- Removed the duplicate top-header search trigger on phone layouts because the bottom navigation owns search on mobile.
- Added smooth add-to-cart feedback: product-card confirmation pulse, cart bump, badge pop, and a lightweight product-image fly-to-cart animation.
- Rebuilt selected homepage product shelves around controlled two-card mobile carousels.
- Reduced mobile card image, typography, badges, wishlist, price, spacing, and button proportions.
- Updated custom featured product slide density from a one-card 72vw layout to a two-card mobile layout.


## 1.3.1 — Native MP4 Showcase

- Replaced YouTube embedding in **Interactive Featured Product / منتج مميز تفاعلي** with native HTML5 MP4 video.
- Added a direct HTTPS MP4 URL field in the Salla component editor.
- Reused the component image field as the native video poster and image fallback.
- Video now uses autoplay, muted, loop, playsinline and preload=none to match the intended storefront interaction.
- Product price, Add to Cart, countdown and interactive feature-icon behavior remain unchanged.

## 1.3.0 — Motion Commerce

- Converted category cards into an autoplay horizontal carousel.
- Converted brand cards into an autoplay horizontal carousel.
- Enabled native Salla autoplay on ZOD product shelves and selected-product slider.
- Removed large hero navigation arrows while keeping autoplay, swipe and pagination.
- Added the new bilingual **Interactive Featured Product / منتج مميز تفاعلي** component.
- Interactive feature icons auto-cycle, glow when active and can be selected manually.
- Interactive component originally shipped with YouTube support in v1.3.0; v1.3.1 replaces it with direct native MP4 playback while preserving image fallback, native Salla product price, sale price, countdown, Add to Cart and View Product.
- Restyled native Salla **Store Features / مميزات المتجر** to match ZOD Commerce.
- Added reduced-motion handling and responsive mobile behavior.
## 1.5.0 — Product Commerce
- Reordered product page so description sits directly below price and live stock state.
- Added green/red pulsing availability indicator synced with Salla product/options state.
- Replaced always-on mobile sticky behavior with a scroll-activated purchase dock on desktop and mobile.
- Purchase dock mirrors the live displayed price and keeps the original Salla form/options/quantity controls.
- Removed the sticky product-tabs layer that could visually collide with the fixed header while scrolling.
- Added compact product facts for category, weight, SKU/model and sold count when Salla allows it.
- Added Read More / Show Less for long descriptions.
