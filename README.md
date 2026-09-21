# ZOD Commerce v1.8.3

This package is for Salla draft/staging review. It contains a complete Webpack production build. It has not been uploaded as v1.8.3, published live, or approved by Salla.

## What changed

The exhaust category preview showed 15 loaded products and a theme retry message at the same time. Salla retained a hidden native error element; the theme treated its mere presence as a visible failure. The catalog now shows its retry panel only when the native error is actually displayed.

Production release tests now accept minified Webpack output while still checking required compiled features and every input/output hash. The v1.8.0 approval fixes remain: add-product toast in the master layout, order-item review in customer order details, and no automatic product-detail requests from listing cards. Quick View still requests details only after a shopper opens it.

## Build and verification

Use Node 22.18.0 or a version allowed by package.json. Dependencies are locked in pnpm-lock.yaml.

```sh
pnpm install --frozen-lockfile
pnpm production
pnpm test
pnpm release:check
```

The supplied BUILD_MANIFEST.json records a webpack-production build. Edit source, scripts, or documentation only before rebuilding, because the integrity check hashes all build inputs. The locally executed release gate passed. The package does not prove Salla's Twig/schema renderer, browser compatibility, checkout, or marketplace approval.

## Salla draft checklist

1. Keep v1.8.2 for rollback. Upload this ZIP to a draft, not the live theme.
2. In the home editor, add the available “واجهة الأقسام الرئيسية — زود” component and select the actual exhaust, intercom, and insect-control categories, imagery, and localized text. It is available in the editor but currently not active on the inspected draft homepage.
3. Check category sorting/filtering, the exhaust list retry state, product options, native offers, cart summary and checkout handoff in Arabic RTL and English LTR on desktop and mobile.
4. Check order review, attachments, saved notes, payment states, and assistive technology with real account/order data. Test before any publication.

See STORE_SETUP.md, MERCHANT_GUIDE_AR.md, COMPONENTS.md and QA_REPORT.md for configuration and remaining gates.
