# v1.6.10 — Gallery Actions + Profile Avatar Fix

- Uses translucent glowing gallery dots on desktop and mobile; thumbnail images no longer cover product artwork.
- Replaces product wishlist controls with theme-owned SVG hearts so the selected heart itself fills red while the button circle stays white.
- Adds a matching minimalist share icon with hover/click glow and keeps Salla's native social-share menu.
- Configures the profile avatar uploader with Salla's supported `/upload-image` endpoint and persists the returned image through `salla.profile.update({ avatar })`.
- Keeps reduced-motion behavior for accessibility.

# v1.6.9 — Mobile Gallery Controls Polish

- Replaced mobile gallery image thumbnails with small translucent pagination dots so they no longer cover product artwork or specification images.
- Added a subtle primary-color glow/pulse to the currently selected gallery dot.
- Removed the extra theme-drawn circles and hover halo from the mobile share and wishlist wrappers, leaving Salla's native single circular controls visible.
- Desktop floating image thumbnails remain unchanged.

# v1.6.8 — Mobile Dock Account Navigation

- Removed the duplicate Language shortcut from the mobile bottom navigation.
- The fourth dock position is now Cart.
- The fifth/leftmost position in Arabic RTL is now My Account / حسابي.
- Kept language switching in the mobile header next to the cart, avoiding duplicated navigation.
- Added a lightweight inline account icon so the dock does not depend on an uncertain icon-font glyph.

# v1.6.7 — Navigation, Price & Performance Fix

- New product navigations start at the top instead of inheriting a lower scroll position.
- Product-gallery thumbnail syncing now scrolls only the thumbnail rail and cannot drag the whole page vertically.
- Product Spotlight and Interactive Showcase no longer render a zero sale price when Salla returns `sale_price = 0`.
- Product Spotlight now participates in the same live-price fallback logic as the interactive showcase.
- Product cards also reject invalid zero sale-price states.
- Live-price requests are skipped when the server already supplied a valid price and remaining fallbacks run concurrently.
- Main-menu data is fetched lazily only when the menu is opened, reducing work on every page/language reload.
- YouTube code is no longer loaded globally and is requested only on home pages that actually contain a YouTube block.
- Home dynamic-component initialization is batched per frame to reduce DOM churn in the Salla editor.
- The localization modal receives the current language immediately while retaining Salla's single native localization component.

# v1.6.6 — Mobile Trust Cards Polish

- Fixed the product confidence/trust cards on mobile so they no longer break into a clipped horizontal strip.
- Replaced the middle trust icon with a valid Salla icon (`sicon-shield-check`) so the secure-payment card displays correctly.
- Added subtle floating/pulsing animation to the three trust icons for a cleaner premium feel.
- Kept desktop trust-card styling intact while giving phones a stable full-width stacked layout.

# v1.6.5 — Product Page Runtime Hotfix

- Rebased the fix on the last known-good v1.6.3 product template.
- Removed the numeric-coercion Twig expressions introduced in v1.6.4, which could prevent Salla from rendering the product page.
- Fixed the visible `0` price by explicitly hiding only the inactive product-price branch.
- Guest wishlist clicks now open Salla's native login modal before any wishlist API call.
- Signed-in wishlist clicks continue through `salla.wishlist.toggle`.

# Changelog

## 1.6.3 — Product Gallery + Sale Price Fix
- Prevent invalid zero sale prices from rendering when Salla reports an on-sale state with a zero `sale_price`.
- Replace the below-gallery thumbnail strip with a floating, swipeable thumbnail rail inside the product image stage.
- Replace native filled gallery controls with transparent arrow-only controls backed by Salla Slider methods.
- Add small mobile share + wishlist controls directly below the product gallery.
- Keep the gallery swipe/lightbox behavior and Salla product image data native.

## 1.6.2 — Native Fast Checkout + Product Layout Polish

- Removed the redundant large Shipping & Delivery / contact panel from the lower product page.
- Moved the Salla reviews summary into the product buybox, directly above Tabby/Tamara installments.
- Kept the full Salla comments/review form lower on the product page without duplicating the rating summary.
- Replaced the custom standalone `<salla-quick-buy>` implementation with Salla's supported `quick-buy` property on `<salla-add-product-button>`.
- This enables Salla Fast Checkout to surface Add to Cart + Buy Now and, on supported Apple/Safari environments with Apple Pay enabled, the Apple Pay action.
- Mobile sticky purchase dock now stacks product summary → quantity → purchase actions for easier thumb use.
- Desktop purchase dock keeps the product summary while grouping quantity and native Salla purchase actions cleanly.
- Added Salla mini-checkout sizing variables so fast-checkout controls match the ZOD radius/height system without overriding Salla checkout logic.

## 1.6.1 — Salla-Native Trust & Reviews

- Added the native `salla-reviews-summary` component beside Salla product comments to create an Orkida-style ratings/reviews area without duplicating review data.
- Added active Salla payment methods to the product page using `salla-payments`.
- Reworked the three product confidence cards into Original Products, Trusted Payment, and Fast Delivery with ZOD styling.
- Added merchant switches for product payment methods and the review summary.
- Kept review visibility controlled by Salla's `store.settings.rating.show_on_product`.
- Added responsive desktop/mobile layouts for reviews, trust cards, and payment methods.

# v1.5.5
- Fixed literal `zod.cart.added` / `zod.cart.updated` feedback.
- Added remove-from-cart feedback and animation.
- Restored native Salla checkout navigation to fix checkout/410 regressions.
- Added an immediate sticky purchase dock with product image/title and explicit Quick Buy.

# Changelog

## 1.5.4
- Simplified cart progress to Cart → Delivery & Payment.
- Added animated progress fill and branded checkout handoff overlay.
- Added completed order journey styling to Thank You page.
- Preserved Salla-hosted checkout for address, shipping, and payment security.

## 1.5.3 — Frictionless Cart Updates

- Replaced Salla cart quantity success alerts with non-blocking ZOD cart-update toast feedback on the cart page.
- Added animated quantity-update state on cart item cards and a confirmation pulse after successful updates.
- Added animated grand-total refresh feedback when quantities change.
- Replaced the plain "Secure checkout" cart heading/accent with a three-step Cart → Delivery → Payment journey indicator.
- Added clearer cart review copy while keeping Salla as the source of truth for quantities, totals and checkout.

# Changelog

## 1.5.2 — Mobile total & checkout handoff
- Added an always-visible mobile cart grand total beside the checkout CTA.
- Added live total refresh using Salla Cart Details / cart summary after quantity and delete changes.
- Refined the sticky mobile checkout handoff with a secure-purchase reassurance line.
- Added an explicit desktop grand-total panel while retaining Salla's native cart summary component.
- Documented the Salla platform boundary: hosted checkout/payment is not a Twilight theme template and remains Salla-controlled.

## 1.5.1 — Cart & mobile navigation
- Redesigned cart cards and summary surfaces to match the ZOD commerce design.
- Added a persistent mobile checkout CTA above the bottom navigation so checkout is always reachable.
- Added a compact custom trigger for Salla's single native localization modal and restored mobile language access.
- Kept checkout/cart data and localization fully Salla-native.

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

## 1.6.0
- Rebuilt the single product page around current Salla/Twilight product data and web components.
- Product description now sits immediately under price and live stock state.
- Added Salla-controlled remaining/sold quantity states without duplicate merchant settings.
- Preserved Salla product hooks and native ratings, installments, product options, availability, gifting, offers and related products.
- Added compact product facts and a dedicated metadata/specifications section.
- Improved desktop gallery/buy-box balance and mobile typography/spacing.
- Improved green/red pulsing availability state and option-driven stock changes.
- Refined immediate purchase dock with product image, title, mirrored live price, quantity, Add to Cart and native Salla Quick Buy.
- Sticky dock now accounts for whether the ZOD mobile bottom navigation is enabled.
- Removed duplicate weight display from the option support area.
