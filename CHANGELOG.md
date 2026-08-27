## 1.6.41 — Unified card actions and purchase controls

- Added Quick View to Salla-native product cards and moved their native wishlist control into the same centered image action cluster used by ZOD cards.
- Kept Eye + Heart hover-only on desktop and permanently visible on touch/mobile layouts.
- Removed Salla's smaller duplicate out-of-stock image badge while preserving the approved ZOD stamp.
- Fixed native and custom Add to Cart controls so both fill the card width and use the same compact pill shape.
- Corrected custom out-of-stock buttons to show the stock label instead of a disabled Add to Cart label.
- Reverified the product-page quantity, Add to Cart and Buy Now controls in both their normal and sticky desktop/mobile states.

## 1.6.40 — Unified reference product cards

- Unified Salla-native and ZOD custom product cards so hydration timing no longer changes the storefront design.
- Added consistent square `contain` image framing with internal breathing room for mixed merchant image dimensions.
- Matched the reference card rhythm with compact centered typography, equal content heights and full-width low-profile pill purchase buttons.
- Widened product-led desktop sections and standardized six/five/two-card responsive density.
- Preserved the prominent out-of-stock stamp while improving its proportions and keeping the underlying product visible.
- Moved Quick View and wishlist controls fully onto the image so they no longer create empty space above card content.

## 1.6.39 — Catalog and purchase-state fixes

- Quick View now respects Salla's explicit availability and unlimited-quantity flags instead of treating a placeholder zero quantity as out of stock.
- The native purchase controls remain in the product form and dock only after their original position has scrolled out of view.
- Category, brand, landing and wishlist lists target Salla's actual light-DOM product wrapper for responsive six-card desktop density.
- Brand directory rendering now follows Salla's official grouped-by-character collection shape and ignores incomplete entries.

## 1.6.38 — Salla-native behavior refactor

- Removed the global `window.alert` monkey-patch so ZOD no longer overrides browser/platform behavior globally.
- Wishlist buttons on product cards and product pages now use one native `salla.wishlist.toggle(String(id))` call, matching current Theme Raed ID handling and avoiding duplicate add/remove requests.
- Wishlist state is synchronized between the product page and matching visible product cards after a successful native toggle.
- Quick View now refreshes product details through `salla.product.getDetails()` before rendering, while retaining the compact ZOD modal design.
- Quick View uses native Salla quantity and add-product web components; simple eligible products expose native Quick Buy, while products with options direct customers to the full product page instead of submitting incomplete option data.
- Kept Salla/Twilight product lists as the catalog/brand/wishlist data source and retained the custom ZOD card only as the visual presentation layer.
- VAT labels continue to use Salla's official `pages.products.tax_included` translation and `product.is_taxable` state.
- Persistent product purchase dock still reuses the single native Salla quantity/add-product controls rather than creating a second cart implementation.

## 1.6.37 — Orkida product density + quick view + wishlist repair

- Reworked wide desktop product shelves and product lists to target six visible cards at 1440px+ widths, with five cards on medium desktops and four on smaller desktops.
- Removed product-card brand-logo rows to keep the approved clean card composition.
- Fixed Eye + Heart positioning so the two controls never overlap: desktop reveals the pair on hover, while mobile keeps both visible.
- Added a lightweight Quick View overlay with product image, category, price, stock, short details, quantity, Add to Cart and a full-details link.
- Wishlist interactions now stay non-blocking and suppress Salla's legacy already-added browser alert; active hearts remain ZOD red regardless of theme accent.
- Switched VAT copy to Salla's native `pages.products.tax_included` translation instead of the broken ZOD translation key.
- Reduced desktop product-title and gallery scale again so normal 100% zoom matches the preferred compact visual density.
- Slimmed the desktop header.
- Rebuilt the mobile sticky purchase dock as two compact rows: quantity first, then the native Add to Cart + Buy Now actions, with the product-summary row removed on mobile.

## 1.6.36 — Compact product page + persistent purchase dock

- Reworked desktop product-page density so normal 100% browser zoom visually matches the previously preferred 75% zoom composition.
- Reduced product-title scale and gallery footprint while preserving the single brand exploration card, wishlist, share, description and Salla-native product data.
- Restored the synchronized always-visible product purchase dock with product summary, quantity and the single native Salla Add to Cart / Quick Buy component.
- Removed the Salla `support-sticky-bar` flag so ZOD owns the one fixed dock and avoids competing sticky behavior.
- Product-card discount and promotion badges now inherit the active Salla theme color instead of fixed red/green colors.
- Desktop product cards keep hover-only Eye + Heart controls; mobile keeps both visible at all times with Eye on the left and Heart on the right.
- Increased product-card category, title and price readability while keeping the compact card height and out-of-stock stamp.

## 1.6.35 — Product card + purchase dock repair

- Rebuilt the global custom product card around the approved compact reference: discount badge, optional promotion badge, category pill, logo-only brand row, centered title/price, and compact cart action.
- Added desktop hover actions for View Product and Wishlist; wishlist uses a white inactive circle and solid accent active state.
- Kept mobile wishlist accessible without relying on hover.
- Strengthened out-of-stock stamping and removed the dead title-to-price spacing.
- Added one-per-brand lazy brand-logo hydration using Salla product details when product-list data contains the brand but omits its logo.
- Removed the duplicated explicit Buy Now component. A single native Salla add-product component now owns Add to Cart + native fast checkout.
- Sticky purchase controls remain in-flow until the customer scrolls past them, then dock cleanly above the mobile bottom navigation.

# v1.6.34 — Catalog, brands, product cards and purchase controls

- Fixed category pages collapsing product results into the narrow filter column when filters are unavailable.
- Category and brand product listings now use the ZOD custom product card and explicit responsive grid sizing.
- Fixed Salla grouped brand collections so the brands directory renders real brand cards instead of blank placeholders.
- Product cards now center logo, title, metadata and price; brand identity remains logo-only and disappears when no logo exists.
- Product page now has one polished brand block above the title with the localized “Explore more from this brand” action.
- Removed the duplicate secondary brand block.
- Restored persistent Add to Cart plus native Buy Now/quick-buy controls and made the sticky purchase dock resilient to old saved settings.
- Hardened category editor previews against missing category context.
- Added official customized information-page hook support and safe preview fallbacks.

# v1.6.33 — Type icon visibility + brand logo experience

- Enlarged Product Type Switcher labels and custom icons on desktop and mobile for better readability.
- Removed the grey backing box behind uploaded type icons so transparent 128×128 artwork displays cleanly.
- Replaced plain-text product-card brand names with the actual brand logo when Salla supplies one.
- Hides the product-card brand area completely when no brand logo exists.
- Replaced the plain-text brand name on the product page with a logo-only brand link.
- Added a localized brand exploration card: `استكشف المزيد من هذه العلامة التجارية` / `Explore more from this brand`.
- Hides all brand presentation areas when the product has no brand logo.

# v1.6.32 — Product type media showcase + wide desktop

- Completely redesigned Product Type Switcher to match the approved compact mockup.
- Added custom image icons for each of up to six type tabs.
- Added direct MP4/WebM banner video URL support with responsive image poster/fallback.
- Updated banner image guidance to 1600×300 desktop and 1080×420 mobile.
- Added compact localized banner copy and animated popup product visual.
- Preserved up to 36 products per type and mobile product auto-slide behavior.
- Added efficient banner video pause/play handling for hidden tabs, off-screen sections, and reduced-motion users.
- Added a wider 1600px desktop container mode to create a more open desktop layout without forcing browser zoom.

## 1.6.31 — Product type micro-showcase

- Redesigned `منتجات حسب النوع` as a clean, universal six-option selector with no heavy boxed navigation.
- Added a compact responsive banner that changes with the selected type, including localized title/description and an optional browse-all action.
- Added per-type desktop/mobile popup product imagery and banner background imagery with dimension guidance directly in Salla editor fields.
- Added subtle banner/product reveal motion while respecting `prefers-reduced-motion`.
- Increased manual product selection and category slider limits to 36 products per type.
- Added mobile auto-slide every 4.4 seconds with interaction pause/resume and visibility safeguards.
- Preserved one-category-per-type behavior and Arabic/English RTL/LTR layout.

## 1.6.30 — Product card label visibility
- Moved the promotional title to a full-width lower image label so it never sits behind the wishlist heart.
- Increased promotional title size and weight on desktop and mobile.
- Expanded the out-of-stock stamp nearly edge-to-edge across the product image with larger, bolder Arabic/English text.
- Added a fallback overlay for native Salla product cards that are out of stock but do not render the custom ZOD card.
- Preserved RTL/LTR behavior and existing product interactions.

## 1.6.29 — Product card label consistency
- Enlarged promotional title labels and reserved clear space away from the wishlist heart.
- Made the out-of-stock stamp larger, bolder, and more visible over the product image.
- Standardized homepage/native product sliders on `custom-salla-product-card` so out-of-stock products show the same stamp instead of only appearing greyed out.
- Kept RTL/LTR behavior and responsive mobile sizing.

## 1.6.28
- Enlarged promotional product labels so they read as intentional product badges.
- Replaced the tiny out-of-stock chip with a faded centered stamp over the product image.
- Dimmed out-of-stock product imagery while preserving wishlist and product-card interaction.

# v1.6.27 — Product Type Switcher Rendering Fix

- Normalizes Salla category selector values whether returned as scalar IDs, item objects, or one-item arrays.
- Normalizes manually selected products to product IDs and renders them with `salla-products-slider source="selected"`.
- Category fallback renders with `source="categories"` using the normalized single category ID.
- Keeps one category per type and preserves the existing ZOD tabs, RTL/LTR behavior, and native product cards.
- No unrelated storefront behavior changed.

# v1.6.26 — Product Type Switcher & Visible Image Requirements

- Fixed `منتجات حسب النوع` so category data works whether Salla returns one category object or an older one-item array.
- Each type now accepts one category only instead of multiple categories.
- All category product sliders are rendered up front, then the active panel is shown/refreshed when the customer changes tabs.
- Replaced the missing component icon with the supported `sicon-layout-grid`.
- Image dimensions are now written directly in each upload-field label and also supplied through width/height settings so they are visible inside the Salla editor.
- Existing Arabic/English, RTL/LTR, selected-product override, and Browse All behavior are preserved.

# v1.6.25 — Image Upload Guidance

- Added clear recommended pixel dimensions directly below every component image-upload field in the Salla theme editor.
- Added responsive crop guidance for desktop/mobile hero images, Shop by Need cards, promotional banners, locations, buying guides, product spotlight, interactive product poster, and wholesale imagery.
- Kept all existing component behavior and storefront rendering unchanged.

# v1.6.24 — Product Type Switcher Reliability & Polish

- Reworks the Products by Type section into a cleaner ZOD segmented-tab surface for desktop and mobile.
- Keeps the existing saved `groups` collection, categories, selected products, and custom links intact.
- Reliably mounts inactive Salla product sliders only when selected, then refreshes their layout after they become visible.
- Prevents tab centering from vertically moving the page; only the horizontal tab rail scrolls.
- Keeps keyboard navigation and correct RTL/LTR arrow behavior.
- Updates the active Browse All link to the selected product type and keeps mobile product cards swipeable.

# v1.6.22 — Existing Product Tabs Rendered

- Preserves the existing `groups` collection so saved tabs and product selections are not discarded.
- Reads the collection with explicit Twig bracket access to avoid Salla's ambiguous `component.groups` resolution.
- Fixes the current product-type section without deleting or recreating it.
- Adds validation that rejects ambiguous dot access while retaining the saved field schema.

# v1.6.21 — Product Type Sources Restored

- Renames the switcher's collection from the conflicting `groups` key to `product_types`.
- Restores the product-type section in Salla's storefront renderer.
- Keeps automatic category products and manually selected products supported per tab.
- Adds validation that blocks the conflicting collection key from returning.

# v1.6.20 — One Mobile Cart Entry

- Hides the header cart on mobile while keeping it available on desktop.
- Leaves the bottom navigation cart as the single, easy-to-find mobile cart entry.
- Preserves Salla's native add-to-cart submission and the v1.6.19 live cart synchronization.
- Adds a theme validation check that prevents the duplicate mobile cart from returning.

# v1.6.19 — Mobile Cart State Synchronization

- Stops the header cart badge from treating Salla's cached browser count as authoritative.
- Refreshes the badge from `salla.cart.details()` on page load, cart changes, and returning to the storefront.
- Recognizes counts supplied directly or through live cart item quantities.
- Performs one guarded recovery reload when Salla reports live items but the server-rendered cart page is empty.
- Keeps the cached count only as a network-failure fallback.

# v1.6.18 — Smooth Product Card Reveal

- Adds a short, one-time fade-and-rise entrance as product cards reach the viewport.
- Supports both ZOD custom cards and Salla-native cards, including dynamically injected slider and catalog results.
- Uses a restrained row stagger, with shorter movement and timing on mobile.
- Leaves browser scrolling native and removes reveal styles after each entrance so existing hover interactions remain unchanged.
- Shows products immediately when reduced motion is preferred or Intersection Observer is unavailable.

# v1.6.17 — Salla Twig Compatibility

- Removed the disabled Twig `import`/macro pattern from the product type switcher.
- Inlined group product rendering so the component works in Salla's production preview renderer.
- Verified the issue and fix path against the accepted preview connected to the real ZOD Store.

# v1.6.16 — Universal Product Type Switcher

- Adds a reusable home-page section for ventilation, intercoms, batteries, extensions, insect traps, and any future catalog department.
- Each tab can load products automatically from one Salla category or use manually selected products instead.
- The active tab updates its matching “Browse all” category or custom link.
- Additional tabs are lazy-mounted only when selected to reduce initial storefront work.
- Uses the existing ZOD product card, restrained red active state, soft-neutral optional background, two-card mobile layout, and accessible RTL/LTR tab controls.

# v1.6.15 — Arabic Gallery Direction Fix

- Gallery pagination dots now follow the storefront language direction.
- English remains left-to-right.
- Arabic now renders the dot sequence right-to-left instead of being forced LTR.
- Keeps the centered dot rail and one-shot selection beep from v1.6.14.

# v1.6.14 — Gallery Dot Selection Beep

- Removed the continuous glow from the selected gallery dot.
- The selected dot now stays clean and solid red.
- Added one small ring pulse only when the active image changes.
- Repeated slider lifecycle events no longer retrigger the effect for the same image.

# v1.6.13 — Gallery Dot Centering Hotfix

- Centers the product gallery dot rail using physical + logical zero insets and automatic margins, so Arabic RTL and English LTR render identically.
- Removes the direction-dependent `left:50% / translateX(-50%)` positioning conflict.
- Keeps the dot rail background fully transparent and pins dot ordering to a stable LTR sequence.

# v1.6.12 — Product Gallery + Actions Cleanup

- Explicitly calls Salla Social Share `open()` from the custom share trigger, with browser-share fallback.
- Centers gallery dots on desktop and mobile and removes the translucent pill/background entirely.
- Removes the redundant wishlist button floating over the product image.
- Desktop now uses one share + wishlist pair beside the product heading; mobile uses one pair below the gallery.
- Removes the decorative blank square from the left side of the three product confidence cards.

# v1.6.11 — Stable Gallery Actions + Avatar Upload

- Rebased on the last known-good v1.6.9 package to remove the malformed v1.6.10 CSS/Twig changes.
- Uses translucent glowing gallery dots on desktop and mobile.
- Adds clean custom heart/share controls with hover/click glow; wishlist fills only the heart glyph red.
- Configures profile-image upload with Salla's documented `/upload-image` flow and saves the returned URL with the profile SDK.
- Preserves all v1.6.9 navigation, performance, pricing, mobile dock, trust-card and product-page fixes.

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
