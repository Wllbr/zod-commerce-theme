# ZOD Commerce v1.9.2

Production-built revision for Salla draft review. See QA_REPORT.md for the exact verified scope and remaining publication gates. No live publication is authorized or performed.

## Main changes

- Rounded header. Desktop search icon only; no search bar or department strip. Mobile uses its bottom-navigation search. When that navigation is absent (including cart), the header icon remains available.
- Shared cards omit the redundant SKU line, contain long names/subtitles, and preserve native purchase actions.
- Product page puts price, availability, options and purchasing ahead of the long description and specification facts. One purchase controller docks after scrolling past the inline action and restores it on return.
- Hero categories use original generated artwork based on the actual KDK, Commax and AFC products. Merchant artwork overrides remain available; catalog product photographs remain unchanged. Native category URLs take precedence over manual fallback URLs; same-store hero links preserve Arabic/English selection.
- Product shelves support selected products, category feeds, native offers or opt-in latest products, in that priority order. No fabricated best-seller ranking.
- Catalog error recovery observes changes in native error visibility as well as added/removed content.

## Build

Use Node matching package.json, then run:

```sh
pnpm install --frozen-lockfile
pnpm production
pnpm test
pnpm release:check
pnpm release
```

BUILD_MANIFEST.json hashes source, configuration, scripts and production outputs. Rebuild after editing build inputs. ZIP packaging requires production provenance and excludes credentials, dependencies and Git metadata.

## Draft and rollout

Review branch: codex/zod-1.9.1-review in Wllbr/zod-commerce-theme. Keep the previous release for rollback. Preview changes in Salla before merging to main or requesting publication. Store page order and chosen products are merchant settings; they are not embedded in a portable theme ZIP.

The required toast and order-item review components remain in place. Listing initialization makes no automatic product-detail calls; explicit Quick View retains its single on-demand call.
