# v1.7.28 scroll stability QA

- Removed the legacy scroll-triggered product dock controller when the persistent v1.7.26 dock is present.
- Persistent dock no longer rewrites its own classes on every scroll event.
- Desktop dock is centered with midpoint anchoring for normal storefront and Salla editor preview.
- Mobile sticky chrome hides on downward scroll and reveals on a small upward scroll.
- Product page primary/sticky price no longer falls back to `starting_price`, avoiding stray savings-like values beneath the title.
