# ZOD Commerce v1.7.15 — Product Page Runtime Compatibility

## Problem

Some products could open to a page that never rendered. The product template had reintroduced numeric Twig comparisons around Salla price fields. Salla's Theme Raed contract explicitly allows `product.price` to be a string (`-`) when a merchant does not expose a zero price, so server-side arithmetic/comparisons are not safe across every product type and price state.

## Fix

- Product price markup now follows Theme Raed's tolerant pattern: render Salla values directly and let native product price events update option/variant prices in the browser.
- Invalid zero-sale presentation is corrected client-side instead of coercing price values in Twig.
- Native `product::price.updated.failed`, `salla.product.event.onPriceUpdated`, and `salla.product.getPrice(...)` flows are supported.
- The product gallery now exposes Salla's image JSON and listens to thumbnail-option changes.
- Missing primary images fall back safely to the first gallery image or the theme placeholder.
- Digital products load the same `digital-files-settings` component pattern used by Theme Raed.

## Scope

This hotfix preserves the ZOD product-page layout and purchase dock. It changes runtime compatibility and data handling rather than redesigning the page.
