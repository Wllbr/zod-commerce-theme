# ZOD Commerce v1.5.4 — Checkout Handoff

- Cart journey is simplified to **Cart → Delivery & Payment**.
- Clicking checkout fills the journey line and opens a short branded ZOD transition before handing off to Salla Checkout.
- The transition uses the native Salla checkout URL; it does not replace or embed the payment flow.
- The Thank You page shows a completed journey after a successful order.
- Salla Checkout itself is platform-hosted and is not a Twilight theme template, so its internal address/shipping/payment layout cannot be replaced by theme Twig/CSS.
