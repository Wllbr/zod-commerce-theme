# ZOD Commerce — v1.8.2

Continuation of the previously delivered v1.8.1, based on your original v1.7.32. **This package is a locally tested staging snapshot, not a verified production build or Salla approval.** No store was published or changed remotely.

## Start here

Read **MERCHANT_GUIDE_AR.md** (Arabic setup), **STORE_SETUP.md** (English), **COMPONENTS.md** (all 18 custom components), and **QA_REPORT.md** (evidence and remaining release gates). Open **START_HERE.html** for a quick orientation. Existing component IDs and the original dependency lock are preserved.

## What's new in 1.8.2

- The cart keeps a single visible native `salla-cart-summary-card` on desktop and mobile. Its own checkout remains the authority; the former fixed proxy checkout and theme-calculated tax, discount and savings breakdowns have been removed.
- Cart rows display native special line totals, including legitimate zero-price promotions, separately from unit prices. Confirmed updates refresh stock, weight, offers and free-shipping state; stale delayed responses cannot overwrite newer mutations.
- Saved cart notes and attachments retain the native cart-item context. Option disclosures have connected labels and expanded states.
- Catalog initial sorting matches the selected control and native list. Changes use native reload, preserve query parameters and filter state, avoid repeated busy requests, and provide ordinary-navigation fallbacks. Mobile filters handle Escape, changed events and responsive focus transitions.
- Product offers use one native `salla-offer` outside the add-to-cart form. Heuristic volume-discount tiers are removed. Sticky purchasing and review links now respect merchant settings.
- Optional bilingual purchase-selection reminder (`show_product_selection_help`) encourages checking the supplied specifications without inventing compatibility claims. All 18 custom component IDs are preserved.

**Upgrade note:** a merchant who previously disabled sticky purchasing will now get the inline purchase layout. The mobile navigation dock deliberately does not appear on cart pages. Configure promotions in Salla; the theme no longer estimates eligibility or per-unit savings.

All 1.8.0 approval fixes remain: master toast, per-product order reviews, list-payload-only cards, explicitly opened Quick View details, and deferred laser panels. The three-category hero for exhaust fans, intercom and insect control remains the recommended homepage entry.

## Full production workflow — still required

Use a supported Node version declared in `package.json` (`^22.18.0 || >=24.11.0`) and the declared `pnpm@11.21.0`. Dependencies/lockfile were not upgraded.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm production
pnpm test
pnpm release:check
```

`production` runs Webpack first and records a production manifest only after that command succeeds. `test` checks the freshly built source/output hashes. Editing source after building requires another build. `release:check` rejects a snapshot manifest even when its hashes match.

The full workflow **was not executed here**. Corepack failed to download pnpm because `registry.npmjs.org` could not be resolved (`EAI_AGAIN`). The final snapshot build and repository tests ran with Node 24.11.1, which satisfies the declared engine range. Dependency installation and Webpack remain blocked; passing local checks does not certify the complete toolchain.

## Shipped snapshot workflow

```sh
node scripts/build-offline.mjs
npm test
npm run build:verify
```

The offline builder refreshes supported local JavaScript entries and plain refinement CSS. It retains the previously supplied compiled base stylesheet, PDP bundle and vendor snapshot. Their hashes, mapped source, dependency declarations and build configuration are pinned in `scripts/SNAPSHOT_BASELINE.json`. Unsupported imports or edits to retained inputs stop the offline builder rather than silently using stale output. It is **not** a replacement for Sass/Tailwind/Webpack/Babel or the Salla renderer.

`BUILD_MANIFEST.json` identifies every source/configuration input and public output. These hashes prove consistency with the recorded snapshot, not runtime correctness or approval. `npm run release:check` is intentionally expected to fail on this delivered snapshot until a full production build is completed.

## Packaging and rollback

On Windows, `pnpm release` verifies production provenance before packaging. An explicitly labelled staging snapshot may be packaged with:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/package-release.ps1 -AllowSnapshot
```

The PowerShell packaging script was updated but could not be executed here; the delivered archive was independently created and inspected with Python. ZIP roots contain `twilight.json`, `src/` and `public/`. Keep the old ZIP and merchant settings for rollback. The 1 MiB compressed size threshold is this project's own budget, not a claim about a current Salla limit.

Preview products/prices, mock widgets, fixture illustrations and browser screenshots belong only to the separate preview package. No font files or fixture data are shipped in the theme ZIP.

## Before live publication

Complete the full production build, Salla schema validation and actual Twig rendering, then test real native widgets, product options, carts, search, order reviews, pending-payment orders and checkout in your store's staging preview. See the detailed checklist in QA_REPORT.md. Nothing in the local test results substitutes for those gates.
