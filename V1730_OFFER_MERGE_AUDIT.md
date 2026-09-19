# v1.7.30 Offer Merge Audit

The custom product page keeps Salla as the pricing authority while presenting multiple Salla offers as one quantity-tier selector.

## Rules

- Current product id is embedded as `data-zod-product-id`.
- Separate percentage offers are merged by exact quantity.
- Explicit product targets must include the current product.
- Explicit exclusions always win.
- Cross-product Buy-X/Get-Y promotions are not represented as a per-unit discount tier.
- No applicable tier means the custom selector stays hidden.
- Duplicate thresholds keep the higher percentage.

## Important Salla behavior

Separate active offers can compete in the cart. The theme does not override Salla's selected backend discount. For a guaranteed progressive 2/3/4 quantity schedule, configure one Salla Discount Table/Tiered Offer rather than overlapping independent product offers.
