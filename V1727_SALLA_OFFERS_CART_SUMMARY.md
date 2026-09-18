# v1.7.27 QA notes

- Product offer cards are custom ZOD markup but hydrate only from Salla `salla-offer` data.
- Supported offer payloads: `options`/`condition_threshold`, legacy `details.discounts`, and `tiers`.
- Discount percentage values are never invented by the theme.
- Tier click changes the native Salla quantity input.
- Mobile cart summary reads live cart details and displays subtotal-before-tax, VAT, discount, original total, final total, and savings.
- Native `salla-cart-summary-card` remains responsible for checkout validation.
