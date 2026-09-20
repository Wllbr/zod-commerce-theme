# ZOD Commerce 1.8.2 — English setup

## 1. Keep a rollback copy

Retain your original v1.7.32 ZIP and the previously delivered v1.8.0 and v1.8.1 ZIPs and record the current theme-editor settings and homepage section order. This is an update to the existing theme, not a requirement to create a new repository, theme identity or store. Do not replace a working live storefront before testing a preview/staging copy.

## 2. Build and preview

Upload/import using the Salla workflow already associated with your theme. Where your workflow compiles source, use the dependency versions in package.json and run `pnpm install --frozen-lockfile`, `pnpm production`, `pnpm test`, then `pnpm release:check`. See README for the exact shipped offline-build limitations. The new public/refinement.css and public/add-product-toast.js must remain in the deployment.

Open the theme's Salla preview and confirm it renders before publishing. The local visual-preview pack is only a fixture demonstration and does not replace this step.

## 3. Brand and shared settings

Use the real store logo with a transparent background. Use your established accent color; the release was visually checked in charcoal/white/red. Choose an Arabic font with complete Arabic glyphs in Salla and check English fallback. Set the merchant logo, description, contact details, social accounts, branches, tax/certificate data and payment methods in Salla. Do not enter example information from the preview.

Enable `show_header_search`, `show_department_rail`, `enable_add_product_toast`, `show_mobile_bottom_nav` and stock notifications as appropriate. Search invokes Salla's search experience. The category rail shares the footer's category response rather than making a new request.

## 4. Recommended homepage order

1. **Specialist category hero / واجهة الأقسام الرئيسية — زود** (`home.hero-hub`). Select the real exhaust, intercom and insect-control categories. This is the main introduction; do not stack the old carousel immediately above it.
2. **Shop by category**: show around 8–12 major departments; maintain a useful hierarchy in the Salla catalog.
3. **Exhaust fan product shelf**: choose in-stock priority models with complete installation information.
4. **Intercom product shelf**: distinguish video kits/panels from audio interphones.
5. **Insect-control product shelf**: separate electrical zappers, glue traps and replacement consumables.
6. **Shop by need** or **buying guides**, followed by brands and a truthful wholesale/projects contact block.
7. Optional laser showcase lower down the page; FAQ above the footer. Avoid making every optional component visible simultaneously.

**Changed in 1.8.1:** an empty product shelf is hidden by default. Select products explicitly for category headings. Only turn on **Show latest products when empty** (`show_latest_when_empty`) for a genuinely general-purpose latest-products row. Review existing empty shelves after upgrading.

## 5. Photography and copy

For the new hero, use square 720×720 transparent cutouts, WebP or PNG, with the full product inside a safe margin. The built-in drawings are decorative fallbacks. They must not be presented as a specific product model. Check crop and contrast on mobile; avoid text baked into the image.

For product images, use consistent square source photography and actual model images. Use a clear product name, brand, model/SKU and relevant specifications. Prices, stock, discounts and currency must come from Salla; do not type prices into banners that appear live.

Only publish warranty, delivery-time, authenticity, coverage-area, noise, water-resistance or laser-safety claims supported by your actual policies/manufacturer documentation. Do not imply every fan is suitable for bathrooms or industrial use merely because it is in the same category.

## 6. Catalog structure

Recommended groups and subdivisions are in MERCHANT_GUIDE_AR.md. Keep video intercom and audio interphone as distinct child categories. Place insect replacement tubes/glue boards under their matching products. Distinguish battery chargers and accessories from voltage transformers/stabilizers.

## 7. Required staging checks

Check Arabic and English, desktop and phone, real category selection, search/sorting/filtering, add-to-cart, variant selection, unavailable stock, quantities, checkout hand-off, signed-in account, a delivered order review, footer data and any integrations enabled on your store. Test long Arabic product titles and prices with Salla's actual currency formatter.

Use a real order with multiple products and, where available, split shipments. Submit a product review through the actual Salla control. Check missing/deleted product data, digital attachments and order payment links if those order types apply.

No staging credentials or remote-store deployment were available for this update. Do not treat passing local tests as final marketplace approval.


## 8. Buying guides and order confirmation

Publish real blog articles in Salla and link the homepage buying-guide cards to them. The theme now uses the native article body and image object, categories, next-page list and related articles. Use the merchant blog setting to enable or disable comments; the theme respects that setting. The preview's example advice and images are not installed as content.

The confirmation page automatically reads real order instructions and distinguishes received, pending-payment and expired-payment states. No theme setting should be used to force a paid label. Test a real pending order and the invoice-email action in Salla. Verify carrier/tracking and preorder dates on applicable customer orders.

For developers: `npm run build:verify` validates the current snapshot; `pnpm release:check` requires a fresh full production build. Do not remove the production gate merely to make a snapshot appear production-built.

## 1.8.2 shopping settings and upgrade checks

The cart uses a single native summary on all screen sizes. Its checkout, discounts, shipping and tax remain platform-owned. The previous calculated mobile breakdown and proxy checkout are intentionally removed; cart pages do not show the competing mobile navigation dock.

Configure offers in Salla. The theme now renders native offers rather than inferring discount tiers. Check real cart special totals, including promotional zero prices, together with coupons, shipping, item options and quantity changes.

`sticky_add_to_cart` now controls the persistent product purchase bar. Turning it off keeps purchasing inline. The optional `show_product_selection_help` setting displays a general specifications reminder, not an assertion of technical compatibility. Product review links follow the merchant's review setting. These controls are page settings, not additional homepage components.

Verify saved cart notes/files after quantity changes; test catalog sorting with existing search and filter state. Local fixtures cannot prove server-side checkout validation, attachment persistence or payment correctness.
