# v1.8.3 — production build and catalog recovery

- Completed a frozen-lockfile dependency install and full Webpack production build under Node 22.18.0. The production manifest and release gate pass.
- Fixed the catalog retry panel appearing when Salla retains an error element that is hidden after products load. Added a controller regression case for hidden and visible native errors.
- Updated release tests to validate compiled production assets without requiring minified output to equal source byte for byte.
- Inspected the Salla draft homepage, exhaust category, product detail page and cart. This revision is packaged locally; it has not been uploaded to the draft or published.

---

# v1.8.2 — shopping-flow correctness and coordinated page controls

Staging snapshot, not a completed production build or Salla approval. See QA_REPORT.md.

- Replaced theme-calculated cart summary/proxy checkout with one visible native cart summary and its checkout. Removed obsolete mobile fixed-bar spacing and competing cart navigation.
- Native zero-aware special totals, distinct unit/line labels, canonical cart events, shipping/stock/weight refresh, mutation busy/failure handling and stale-response protection.
- Preserved cart notes and attachments with `cart-item-id` and native file payload; accessible disclosures.
- Aligned the first catalog request with the selected sort; native reload, query/filter preservation, busy/retry feedback and fallback navigation.
- Mobile filter dialog now handles native changed events and desktop/mobile breakpoint focus consistently.
- Removed heuristic volume tiers in favor of native offers outside the product form. Honored sticky/reviews controls and added optional selection guidance.
- Added 20 shopping/controller regression scenarios, eight converted-template assertion groups, 24 browser layout cases and nine browser interactions. Existing approval guards retained.
- Node 24.11.1 used for the final dependency-free build/test run. Declared package-manager bootstrap still fails with registry DNS EAI_AGAIN; full production gate is not complete.

---

# v1.8.1 — native page completion and build integrity

- Replaced blog content/image assumptions with article.body and article.image.url; restored native pagination, categories, related content, tags, conditional comments and empty states.
- Added shared responsive editorial cards, article surfaces and pending-payment confirmation styling.
- Restored native order instructions/messages, received/pending/expired state distinction, order-details action with URL fallback, and invoice form.
- Restored shipment carrier/branch/tracking information and preorder availability dates on customer orders.
- Empty product shelves now hide unless the merchant explicitly enables the latest-products fallback.
- Corrected skip-link keyboard focus.
- Made validation compatible with local dependency/output folders, while retaining archive checks; production toast validation no longer requires byte-identical minified and source JavaScript.
- Added source/output hash verification, a production-only release gate, snapshot prerequisite checks, and safe packaging defaults.
- Re-ran existing browser checks and added blog/article/confirmation checks: 72 local layout checks, 11 interaction/state checks, plus 6 expected-failure integrity checks. These are not native Twig/live Salla tests.
- Full dependency-backed production build still outstanding: pnpm download failed on registry DNS and local Node is below the declared engine range.

# v1.8.0 — specialist storefront / Salla approval fixes

- Added required add-product toast and per-item order review integration.
- Corrected order-item details props; preserved native totals, shipments, branches, rating and pending-payment links.
- Removed listing-card media detail hydration and automatic homepage product-details enrichment.
- Deferred inactive laser native lists until selection; retained Quick View detail loading only on interaction.
- Added configurable three-category hero, visible native-search launcher and category rail.
- Added shared refinement.css, consistent containers, readable card/SKU styling, actual PDP title styling, account/order/footer surfaces and mobile LTR drawer containment.
- Added skip navigation, filter focus/Escape behavior, safer toast text/race handling and reduced-motion refinements.
- Preserved old component IDs and dependency lock; added editor guidance and bilingual merchant documentation.
- Shipped incremental offline-built changed bundles with a hash manifest; full pnpm/Webpack production build and live Salla approval remain separate gates.

## v1.7.32

- Silenced the Salla `quantity unavailable` / `product service error` notifier messages only during product-option interaction.
- Removed redundant theme-triggered variant price requests; native Salla product options now own variant resolution.
- Out-of-stock selection still updates the inline out-of-stock state and purchase controls.

## v1.7.31
- Replaced private `<salla-offer>` state inspection with Salla Product Offer Details event/API integration and resilient response normalization.
- Added product-only scoping and merged separate quantity percentage offers.
- Product cards now show both promotional title and discount; discount is physical-right and promo is physical-left.
- Reduced product-page promotional badge size.
- Removed Business Platform certificate from product payment strips while preserving it in footer trust certificates.
- Improved collapsed mobile cart totals/savings presentation.
- Made mobile footer policies permanently visible in a centered 3-column grid.

## v1.7.30

- Merged multiple applicable Salla percentage quantity offers into a single product-page tier selector.
- Added current product ID to the offer selector and filters explicit product-targeted offers before rendering.
- Prevented cross-product Buy-X/Get-Y promotions from appearing as per-unit quantity discounts.
- Keeps the selector hidden when the current product has no applicable quantity-discount offer.
- Duplicate quantity thresholds resolve to the highest advertised percentage.

## v1.7.29

- Removed the floating wishlist/quick-view cluster from product cards on mobile; desktop keeps Eye + Wishlist.
- Product cards now surface Salla subtitle/sub-title metadata under the product title and continue to prefer the promotional title for the image badge.
- Forced promotional badge/subtitle alignment to the physical right in Arabic and left in English on cards and product pages.
- Audited `تسوق حسب التصنيف`: both selected-product and category feeds explicitly use the shared `custom-salla-product-card`.
- Mobile cart order summary is compact by default with a View details toggle; VAT, discount, original total and savings expand on demand.
- Per-item offer breakdowns remain collapsed by default on mobile.
- Moved payment methods to the centered footer bottom strip with bounded horizontal overflow so they cannot overlap the copyright.
- Grouped Business Platform certificate with the other trust/certificate badges, including VAT/company trust content.


## v1.7.28 — Product scroll stability and smart mobile header

- Fixed product-page scroll jumping caused by two sticky-dock controllers fighting over the same classes.
- Persistent purchase dock is now centered on desktop/editor preview.
- Mobile header hides while scrolling down and returns immediately on a small upward scroll.
- Product page no longer uses `starting_price` as the primary visible/sticky price, preventing stray savings values such as `35 ر.س` from appearing below the title.

# v1.7.27

- Custom-theme offer selector now reads current Salla Discount Table / tiered-offer payload shapes (`options`, `details.discounts`, and `tiers`) instead of assuming one legacy structure.
- The selector stays Salla-backed: choosing a tier changes the native quantity; Salla remains the pricing/checkout authority.
- Added an Orkida-inspired mobile cart summary driven by live `salla.cart.details()` values: pre-tax subtotal, VAT, discount, crossed-out pre-discount total, final total, and savings badge.
- Mobile summary refreshes after quantity, delete, add, and coupon events.
- Preserved native Salla cart summary/checkout validation and all v1.7.26 purchase-dock behavior.

# v1.7.26

- Restored an always-visible product purchase dock on desktop and mobile.
- Added an Orkida-inspired purchase hierarchy while retaining ZOD red branding.
- Removed the sale countdown from product pages.
- Added a buy-more/save-more quantity selector powered only by Salla Discount Table offer data.
- Selecting a tier updates the native `salla-quantity-input`; Salla remains the source of truth for discounts.
- Preserved native quick buy / fast checkout / Apple Pay and v1.7.25 non-blocking notifications.

## 1.7.25 — Non-blocking cart notifications
- Replaces Twilight's default blocking JavaScript `alert()` notifier with ZOD's existing non-blocking toast notification UI using the supported `salla.notify.setNotifier()` hook.
- Removes the simultaneous `<salla-add-product-toast>` renderer so add-to-cart feedback is not duplicated.
- Cart add, quantity update, item delete, coupon, and related Salla success/error messages now use one notification path without interrupting the storefront.
- Keeps all v1.7.24 product-card, countdown, header, gallery and sticky purchase-dock refinements unchanged.

## 1.7.24 — Product-card and product-page refinement
- Keeps the restored pre-marketplace Eye + Heart + full-width purchase card; no new card redesign.
- Shows one pale-pink/red promotion/discount badge instead of two competing percentage badges.
- Makes Quick View (eye) desktop-only while keeping wishlist available on touch/mobile layouts.
- Uses a real SVG wishlist heart so active state fills solid red reliably.
- Reduces card media height, category-pill weight and internal vertical gaps while preserving a fixed two-line title area.
- Keeps long discount countdowns valid (for example 103 days) and adds a compact localized “Offer ends in” wrapper instead of treating a long campaign as an error.
- Slims desktop announcement/header chrome, gallery progress dots, description/facts spacing and the active purchase dock.
- Sticky purchase controls now remain inline initially and dock only after the customer scrolls past the original purchase controls; the merchant sticky-cart setting is respected.
- Preserves current Salla uploaded-video media handling and all product Twig price/discount safety work.

## 1.7.23 — Restore pre-marketplace product cards
- Corrected the rollback target: v1.7.12 was the actual marketplace-card rebuild, so v1.7.13 was already too new.
- Restored the documented pre-v1.7.12 Orkida card structure: Eye + Heart image actions, category pill, compact title/rating/price, VAT note, discount/promotion corner badges, and a full-width purchase button.
- Keeps all newer product-page/Twilight/video compatibility work and leaves Laser World untouched.
- Adds a standalone legacy card runtime loaded after app.js so the Salla upload works without requiring a local rebuild.

## 1.7.22 — 2026-09-18

- Restored the shared product-card design and behavior from ZOD Commerce v1.7.13, before the later Noon/marketplace card redesign experiments.
- Removed the v1.7.14+ marketplace-card runtime override so the compiled v1.7.13 card is used again on every standard product surface.
- Restored the earlier card structure: image gallery dots, category, subtitle, brand, rating, price, VAT label, option/details row, original promotion badge, original wishlist icon and original card spacing.
- Kept all later non-card fixes, including current product-page Twig hardening, uploaded-product-video support, discount runtime safety and the wider storefront density/layout work.
- Removed the obsolete marketplace-card webpack entry and runtime assets so future production builds cannot silently re-enable the rejected redesign.

## 1.7.21 — 2026-09-18

- Fixed the Arabic marketplace card controls after tracing the exact cause: old logical `inset-inline-*` resets were cancelling the physical `left/right` rules. The conflicting logical resets are removed; RTL heart/quick-add are physically left and LTR physically right.
- Kept Arabic product-card copy right aligned and English copy left aligned independent of Salla editor/preview wrapper direction.
- Removed type-sensitive Twig formatting from `product.discount_percentage`; discounted product pages now pass raw data to a defensive JavaScript formatter, preventing blank renders when Salla returns a numeric discount instead of a percent string.
- Initial and option-updated product discounts are rounded to clean labels (`خصم 30%` / `30% OFF`) in the runtime layer.
- Preserved Salla uploaded-video support through `image.video_type ?? 'image'`.
- Added source/public parity checks, guards against reintroducing conflicting logical inset resets, Chromium layout verification, and discounted-product Twig render-safety checks.

## 1.7.20 — Salla uploaded product video support

- Applied Salla's September 16, 2026 Twilight media update exactly on the product gallery.
- Product gallery media type now reads `image.video_type ?? 'image'`, supporting both uploaded videos (`video`) and YouTube (`youtube`) without URL-based type inference.
- Preserves the existing gallery lightbox, video URL source, thumbnails, 3D media, and option-aware image synchronization.
- Audited all Twig media references; no other product-image media-type inference path requires this change.

## 1.7.19 — Triple-audit hardening

- Rechecked the product Twig and shared layout against Theme Raed master as updated on 2026-09-18.
- Aligned the shared layout with current Raed/Twilight storefront globals for sticky header, image zoom, wallet access, more-menu, add-product toast and card stock notification behavior, and exposes them in the document head before theme initialization.
- Hardened out-of-stock card notification handling so it prefers ZOD's typed setting, safely parses Raed string booleans, and no longer depends on later app initialization to expose the compatible value.
- Added official Salla wishlist event synchronization so every copy of a product card and the product page immediately reflects add/remove state with the solid red heart.
- Keeps the product discount badge rounded and updates it after option/variant price changes, preventing stale percentages.
- Removed the last unsafe homepage Twig sale-price numeric comparisons from Product Spotlight and Interactive Product Showcase.
- Added a permanent `data-zod-discount` hook so runtime price updates can safely show/hide the discount badge.
- Expanded regression coverage for all standard card surfaces, RTL/LTR action placement, wishlist fill, pale-pink promotion strip, Raed globals and dynamic product discount behavior.

## 1.7.18 — Direction, Density & Product Twig Pass

- Locked marketplace card heart and quick-add placement to left in Arabic and right in English.
- Added solid red filled wishlist heart state.
- Switched promotion strip to pale pink with red text.
- Audited all normal product-card component paths and kept Laser Showcase independent.
- Increased desktop information density without CSS zoom/transform scaling.
- Reduced header, section, card and product-page spacing for a Noon-like 100% zoom feel.
- Rounded product-page discount percentages and localized the label.
- Rechecked product Twig against current Theme Raed master on 2026-09-17.

## 1.7.17 — Compact bilingual cards and storefront density fix

- Enforces Arabic card actions on the left and English card actions on the right, including both wishlist and quick-add controls.
- Enforces Arabic titles/commerce text as right-aligned and English as left-aligned.
- Removes the large empty lower half of product cards by using a fixed compact title/rating/price rhythm and preventing Swiper from stretching cards.
- Shortens the media stage and trims mobile/desktop section spacing so substantially more storefront content is visible at normal 100% browser zoom.
- Shrinks the sold-out stamp so product imagery remains readable.
- Keeps the promotion strip ZOD red, but makes it slimmer.
- Suppresses the duplicate green percentage when the red promotion title already contains the same percentage.
- Removes the custom Salla notifier override so the native add-product toast is the single cart-feedback surface.
- Adds edge breathing room and denser responsive carousel widths to reduce clipping and improve visible-card count.

## 1.7.16 — Theme Raed product Twig parity refresh

- Reviewed `src/views/pages/product/single.twig` against the current Theme Raed `master` product template (checked 2026-09-16).
- Preserved the custom ZOD product-page design while aligning native Salla/Twilight behaviors.
- Treats `product.brand.logo` as the current Raed URL-string contract instead of probing `.url`.
- Added product barcode support to the ZOD facts area.
- Restored Raed's default `show_tags=true` fallback while still respecting the merchant setting.
- Added gallery `data-caption` and `data-infinite` attributes used by Raed's current lightbox markup.
- Restored native conditional `support-sticky-bar` behavior from the theme setting.
- Restored native `quick-buy` attribute behavior and keeps product status handling on the Salla component.
- Moved `salla-gifting` inside the product form and restored `widget-subtitle="{{ gifting_intro }}"`, matching current Raed placement.
- Customer comments now obey `store.settings.rating.show_on_product`, matching current Raed.
- Keeps the v1.7.15 price/runtime guards, digital-files loader, native hooks, metadata, quick order, related-products hooks and ZOD styling.

## 1.7.15 — Product page runtime compatibility hotfix

- Removed server-side numeric price comparisons from the product template. Theme Raed documents that `product.price` can be the string `-`, so those comparisons could abort Twig rendering for specific products.
- Restored Theme Raed-style direct price rendering and native Salla installment pricing.
- Added Salla native option-price success/failure handling and fresh price requests after valid option changes.
- Added `data-images` and `listen-to-thumbnails-option` to keep variant images synchronized with Salla product options.
- Made the sticky product image null-safe for products without a primary image.
- Restored Theme Raed's digital-files web component and conditional asset loading for digital products.

## 1.7.14 — Marketplace product cards and product-link recovery

- Rebuilt the custom Salla product card to match the approved bilingual marketplace reference: larger product media, plain wishlist heart, corner `+`, compact rating and stronger price hierarchy.
- Best Seller is driven by matching Salla product tags and respects the theme `show_tags` setting.
- Promotion titles render as a ZOD red deal strip (not pink).
- Removed category, brand, subtitle, VAT copy and gallery dots from the compact card surface.
- Added robust product URL resolution for list payloads that omit `product.url`; links can use `urls.customer` and fall back to `salla.product.getDetails()` before navigation.
- Added a standalone marketplace-card compatibility entry so packaged public assets receive the fix even before the next production rebuild.

## 1.7.13 — Merchant product data and desktop Laser World
- Render Salla subtitle and brand data on custom product cards, including resolved discount, percentage, and brand placeholders.
- Detect valid sale prices from the product payload even when the sale flag is delayed or omitted.
- Give desktop Laser World more video space with compact vertical selectors while preserving its mobile layout.

## 1.7.12 — Marketplace product cards and Laser World layout
- Rebuilt the shared product card for brand, category, homepage, wishlist and recommendation surfaces with a language-aware favorite corner, compact image add action, inline discount pricing, live rating treatment and hover-loaded product galleries with synchronized image dots.
- Removed the Quick View eye action from both custom and fallback native product cards.
- Moved the Laser World catalog link above its desktop product selector and expanded its information column and feature icons for a more balanced presentation.

## 1.7.11 — Complete sticky Buy Now integration
- Declared native sticky-bar support on the product purchase component so Salla can keep Add to Cart, Buy Now and eligible wallet actions synchronized with ZOD's persistent purchase dock.

## 1.7.10 — Restore native Buy Now checkout
- Restored Salla's required `form.product-form` hook on product pages so the native Buy Now / fast-checkout widget can find the product form and proceed to checkout.

## 1.7.9 — Restore saved laser product compatibility
- Restores the proven Salla product-selection parser so existing laser component data renders in fresh previews.

## 1.7.8 — Full-bleed laser video and category-link selector
- Makes every laser video cover its complete media frame on phone, tablet and desktop without empty side bands.
- Uses Salla's supported variable-link field restricted to store categories for the browse-all action.

## 1.7.7 — Reliable laser editing, category link and media fit
- Normalized saved Salla product and category values so editing text does not remove the laser component.
- Converted the browse-all destination into a searchable single-category selector.
- Preserved the full video frame across mobile, tablet and desktop while expanding the desktop media area.

## 1.7.6 — Laser selector and video balance
- Narrowed and shortened the desktop laser selector cards, with a larger readable price.
- Expanded the video area and removed the selected-card scale that caused clipping.

## 1.7.5 — Laser showcase desktop balance and mobile media fit
- Widened the desktop laser showcase and enlarged the product selector cards.
- Changed the active selector animation to expand inward without clipping.
- Preserved the complete mobile video frame with centered contain sizing.

## 1.7.4 — Laser selector finishing pass

- Hides the native mobile rail scrollbar and lets the selected product image reach its intended larger size.

## 1.7.3 — Mobile laser selector correction

- Keeps enlarged mobile laser cards in a horizontal rail and gives the selected product a larger image and clearer type.

## 1.7.2 — Laser selector and atmosphere polish

- Enlarges and reshapes the Laser World product selectors for clearer product recognition.
- Expands the selected card with a stronger switch animation on desktop and mobile.
- Adds animated ultraviolet side waves and purpose-built laser, coverage, and control icons.

## 1.7.1 — Laser navigation and product-card polish

- Moves laser product selectors into a compact animated desktop side rail while preserving the mobile bottom rail.
- Removes the live-preview badge, adds icon-led benefits, and supports a configurable browse-all-lasers action.
- Makes unused product-card space clickable and keeps a compact wishlist action visible on touch devices.
- Keeps selector scrolling inside its own horizontal or vertical rail without moving the page.

## 1.7.0 — Compact laser showcase and explicit sound control

- Reduces the laser experience height and spacing on desktop and mobile while preserving a cinematic product-focused layout.
- Keeps product switching inside its selector rail so choosing another laser no longer shifts the storefront horizontally.
- Replaces decorative play icons with a clear animated sound control; videos remain muted until the shopper explicitly enables audio.

## 1.6.99 — Reliable Riyal symbol in laser prices

- Formats laser showcase prices locally and uses the theme's native Riyal icon, avoiding escaped Salla currency markup in preview builds.

## 1.6.98 — Correct laser showcase currency rendering

- Renders Salla's formatted Riyal currency output correctly in the active product panel and product selector.

## 1.6.97 — Laser product data and mobile layout

- Loads complete product details from Salla for nested component selections, restoring real names, prices, availability, images, links and add-to-cart actions.
- Uses a wider mobile video frame so the showcase stays compact and keeps product information visible.
- Supports repeated product selections safely and keeps loading or unavailable states clear in Arabic and English.

## 1.6.96 — Laser experience component

- Adds a bilingual, responsive laser showcase for up to 12 merchant-selected Salla products.
- Uses live Salla product images, prices, availability and links with optional externally hosted MP4/WebM previews.
- Plays only the visible product video, pauses media offscreen, supports keyboard navigation and respects reduced-motion preferences.

## 1.6.95 — Latest Salla Twilight compatibility

- Updates `@salla.sa/twilight` and `@salla.sa/twilight-components` from 2.14.572 to 2.14.580.
- Refreshes the complete Salla dependency graph and locks the verified versions for reproducible builds.

## 1.6.94 — Final marketplace footer reliability

- Keeps cached Salla categories visible immediately while refreshing them in the background, so returning shoppers never see an empty footer.
- Reserves the complete desktop category grid during first load to prevent layout movement.
- Adds restrained social-icon entrance motion with platform colors on touch screens and a reduced-motion fallback.
## 1.6.85 — Complete desktop quantity control

- Reserves enough space for the minus, value and plus controls in the persistent desktop purchase dock.
- Keeps the desktop purchase actions flexible without changing the connected mobile dock.

## 1.6.84 — Connected mobile purchase surface

- Joins the persistent purchase dock directly to the mobile navigation with shared edges, background and elevation.
- Seats the search control on the shared boundary so navigation and purchasing read as one intentional mobile surface.

## 1.6.83 — Corrected mobile purchase dock

- Moves quantity fully inside the mobile dock so it no longer covers the Add to Cart and Buy Now actions.
- Gives required-option prompts their own row while preserving the persistent navigation and Apple Pay layout.

## 1.6.82 — Purchase-dock critique phase two

- Tightens the available-product dock on desktop while retaining room for all three purchase methods.
- Removes quantity controls from unavailable products and improves mobile action-label legibility.

## 1.6.81 — Purchase-dock critique phase one

- Compresses the desktop dock when a product is unavailable so its disabled action and product summary remain visually connected.
- Improves quantity-control contrast and gives Apple Pay a clear full-width row on mobile when it is available.

## 1.6.80 — Purchase choices and complete search cards

- Rebalances the persistent purchase dock for quantity, Add to cart, Buy Now and Apple Pay on mobile and desktop.
- Shows a compact prompt when required product options are missing and takes shoppers directly to the product choices.
- Makes the full visible search-result card open its product while preserving the card's native links and controls.

## 1.6.79 — Balanced desktop product offers

- Restores the Heart, Share and brand controls to the full-width product header on desktop.
- Places available offers in a compact horizontal panel above the product-description divider so expanded Salla offer content remains readable without squeezing the title and price.

## 1.6.78 — Visible product offers

- Moves available product offers beside the price and stock summary on desktop, using the previously empty outer space without separating the offer from the buying decision.
- Places the same compact offer card immediately below price and availability on mobile, while hiding it automatically when Salla provides no offer content.

## 1.6.77 — Product-card controls and draft routing

- Reduces the Eye and Heart controls, gives them a translucent glass treatment, and seats them lower on product images on mobile and desktop.
- Keeps product and category links inside the Salla draft preview so opening a product continues to use the current ZOD product page instead of the demo store's active theme.

## 1.6.76 — Resilient category drawer

- Keeps category navigation available when Salla's main-menu request is temporarily unavailable by using the categories API, a short session cache, and server-rendered homepage categories as fallbacks.
- Adds request timeouts so the drawer never remains on an endless loading indicator.

## 1.6.75 — Mobile layering and product-led imagery

- Moves the category drawer into the top page layer so the sticky announcement can never cover it on mobile.
- Prevents Salla's native mobile cart summary from overlapping the theme checkout dock while retaining coupons, offers and loyalty tools.
- Keeps Arabic and English showcase links inside the visitor's active storefront language.
- Unifies compact header, category and brand carousel spacing across mobile and desktop.
- Adds a responsive KDK ventilation visual derived from the store's real KDK product photo.

## 1.6.74 — Mobile density and WhatsApp edge panel

- Replaces the wide floating WhatsApp pill with a compact left-edge tab that expands inward into a readable contact panel on mobile and desktop.
- Tightens mobile category introductions, subcategory cards and product galleries so products, prices and buying information appear sooner.
- Stops automatic movement in repeated product rails while retaining motion in the hero, category and brand discovery sections.
- Preserves the mobile navigation and persistent product purchase dock with collision-safe WhatsApp positioning.

## 1.6.73 — Salla repository size compliance

- Removes historical release archives and unused preview videos from the Git-tracked theme delivered to Salla while retaining local copies for development.
- Adds automated checks that reject development/output directories or individual files larger than 1 MB if they are accidentally tracked again.
- Keeps compiled production assets in the standard `public/` directory used by Salla Twilight themes.

## 1.6.72 — Final storefront spacing and direction polish

- Reduces the desktop floating header height while preserving accessible controls and the existing glass treatment.
- Tightens product-led section spacing on desktop and mobile so long homepages scan more naturally.
- Keeps the WhatsApp control close to the viewport edge while clearing mobile navigation, cart checkout and product purchase docks.
- Corrects forward arrow direction for English calls to action without changing Arabic presentation.

## 1.6.71 — Consumer readiness and Salla content integrity

- Stops theme JavaScript from altering product descriptions or titles, leaving merchant content and translations fully controlled by Salla.
- Restores readable two-line mobile product titles and 44 px touch targets for card, filter, menu and header actions.
- Reduces oversized hero height on desktop and mobile while retaining separate mobile artwork configured in Salla.
- Shows VAT-included messaging consistently on product cards and Quick View, matching the store pricing policy.
- Adds a translated, accessible retry panel when Salla reports that a category product list failed to load.
- Adds consistent keyboard focus treatment, correct Quick View arrow direction and a reduced-motion fallback.

## 1.6.70 — VAT and Riyal display consistency

- Marks product prices as VAT included, matching the store's pricing policy.
- Preserves Salla's official Riyal currency symbol when the live price is mirrored into the persistent purchase dock.
- Stops decorative trust-card motion and hydrated hidden skeleton animations to reduce needless browser rendering work.

## 1.6.69 — Product-page conversion and clarity

- Balances the desktop gallery and product information columns, increases key copy sizes, and keeps the purchase dock visible in a compact centered card.
- Removes an exact duplicate product-title paragraph from the displayed description and repairs unmatched warranty parentheses without changing merchant data.
- Makes VAT status explicit, surfaces ratings when product rating data exists, and increases trust-card readability.
- Collapses product offers into a compact disclosure and places available related products before out-of-stock recommendations.

## 1.6.68 — Cart clarity and checkout reliability

- Collapses detailed product and cart offers into compact disclosures and replaces raw payment-method placeholders in asynchronous Salla offer content.
- Reduces the mobile checkout dock height while keeping the total, checkout action, and bottom navigation visible.
- Adds an early coupon shortcut, accessible removal controls, resilient native checkout triggering, and a richer empty-cart experience.
- Removes the duplicate custom desktop total so Salla's native summary remains the single source of truth.

## 1.6.67 — Lighter mobile scale

- Reduces the mobile type scale and product-page spacing by a small amount while preserving native browser zoom and accessibility.
- Shortens the mobile product gallery so product information enters view sooner.

## 1.6.66 — Balanced mobile purchase controls

- Gives the quantity selector more room and slightly reduces the purchase button sizing so every control remains readable on narrow phones.

## 1.6.65 — Mobile purchase dock alignment

- Keeps the mobile navigation and its search action visible, with the persistent purchase dock attached directly above it.
- Restores a compact quantity selector beside the purchase actions without increasing the dock height.

## 1.6.64 — Mobile product-page breathing room

- Keeps the purchase dock visible while reducing it to a compact mobile action row and temporarily moving the mobile navigation out of the way.
- Caps the mobile product gallery height so the product title and price enter view sooner.
- Improves spacing and type sizing through the mobile product details.
- Replaces the oversized cart notification with a centered compact toast featuring a brief shine and inward-collapse exit, with a reduced-motion fallback.

## 1.6.63 — Salla public-theme compliance

- Updates `@salla.sa/twilight` and `@salla.sa/twilight-components` to 2.14.572.
- Keeps the global `salla-search` component in `layouts/master.twig` for Webview pages.
- Adds the required order totals, pickup branch, split shipments, order editing, profile settings, verification, next-order coupon and review-factor components in their official Salla locations.
- Moves cart deletion behavior out of inline Twig markup and translates the ZOD labels used on index pages.
- Adds a deterministic Salla upload packager that excludes caches, videos, release archives and nested projects, then rejects any upload larger than 1 MB.

## 1.6.48 — Search, checkout and navigation readiness

- Prevents the theme search overlay from covering Salla's native modal results.
- Uses native checkout validation/submission from the custom mobile purchase action.
- Refreshes cart line totals from server snapshots without calculating discounts locally.
- Adds recoverable category loading failures and explicit empty-menu copy in Arabic and English.
- Improves category drill-down focus and contains keyboard navigation in menu/search dialogs.
- Adds regression coverage for retry, empty states, native search handoff, line totals and mobile checkout forwarding.
- Prepared locally; not published or verified as deployed while the existing Salla submission remains under review.

## 1.6.47 — Stock, cart and accessibility fixes

- Unifies stock detection and makes fresh Quick View stock override older cards.
- Prevents older detail requests and delayed closing from replacing a newer Quick View.
- Contains keyboard focus in Quick View and screen ads and restores Quick View focus.
- Replaces Salla's default blocking alerts through its supported notifier; errors stay dismissible and visible.
- Updates cart totals from confirmed changes, rejects late responses and avoids stale cached totals/counts.
- Makes certificate links functional, translates gallery labels, improves purchase-button contrast and fixes WhatsApp fallback precedence.
- Preserves source videos during production builds and adds regression checks for the reproduced issues.

## 1.6.46 — Screen ads, floating WhatsApp options and mobile branch carousel

- Adds a configurable homepage image advertisement with desktop/mobile artwork, countdown, skip/close controls, optional auto-close, link, delay and visit-frequency controls.
- Replaces the non-floating WhatsApp section with a fixed flat green pill that moves from the left in Arabic to the right in English and expands into animated circular contact choices.
- Keeps the WhatsApp control above Salla's mobile navigation and permanent product purchase dock.
- Converts the mobile Locations & Contact grid into a right-to-left swipe rail with scroll snapping and active progress dots while preserving the desktop grid.
- Respects keyboard controls, session memory and reduced-motion preferences across the new interactions.

## 1.6.45 — Natural video banners without covered mobile media

- Sizes video banners from each video's intrinsic aspect ratio so desktop media is no longer forced into an excessively wide, empty strip.
- Keeps the complete video frame visible with natural proportions instead of splitting the banner into artificial media and blank halves.
- Keeps the mobile overlay concept but shrinks its glass blur to a compact text-sized card so most of the video remains visible.
- Preserves the single-row desktop tabs and swipeable mobile type navigation.

## 1.6.44 — Ratio-matched video fitting and responsive banner balance

- Compares each video's intrinsic ratio with the rendered banner ratio before allowing full-bleed cover, preventing false wide-video classification and excessive cropping.
- Reclassifies video fitting automatically whenever the banner changes size between desktop, tablet and mobile layouts.
- Limits the mobile glass copy panel to 62–64% of the banner so the product video remains visible.
- Keeps all configured product-type tabs in one desktop/tablet row while preserving the swipeable mobile rail.

## 1.6.43 — Adaptive product-type video banners

- Detects each banner video's intrinsic aspect ratio and applies a suitable wide, landscape or portrait presentation automatically.
- Keeps normal landscape, square and portrait videos fully visible instead of forcing every source through an aggressive full-width crop.
- Preserves full-bleed treatment for genuinely ultra-wide banner videos.
- Replaces the hard half-white division with a softer responsive wash and a translucent copy surface.
- Removes the unrelated decorative star and increases the Browse All button size on desktop and mobile.

## 1.6.42 — Floating storefront chrome and permanent purchase dock

- Changed the product purchase dock to remain active from initial page load on desktop and mobile instead of waiting for the original controls to scroll away.
- Reworked the compact header into a rounded floating glass surface with translucent color, blur, border and adaptive shadow.
- Expanded the light footer into a reference-inspired connect strip, four-column information area, contact actions, trust/tax details and a structured payment/copyright bar.
- Added store-data fallbacks so the footer remains intentionally designed while Salla contact and menu data are still being configured.
- Redesigned normal information and policy pages with a spacious hero, readable content card and responsive mobile typography.

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
# 1.6.91

- Redesigned the footer around Salla-native customer-service channels so mobile, phone, email, WhatsApp, and Telegram can all appear when configured.
- Added marketplace-specific social hover and keyboard-focus motion for Instagram, X, Snapchat, TikTok, YouTube, Facebook, Pinterest, and WhatsApp.
- Separated the Saudi Business Center certificate from payment methods visually and improved trust, tax, payment, mobile, tablet, RTL, and LTR layouts.
