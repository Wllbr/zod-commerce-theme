# Product Card & Purchase Controls — v1.6.35

## Product cards
- Compact centered layout based on the approved visual reference.
- Small percentage discount badge in the image corner.
- Optional promotion title on the opposite corner.
- Desktop View Product + Wishlist actions animate into view on hover/focus.
- Mobile keeps Wishlist visible and removes hover-only View Product.
- Direct product category is shown as a compact pill when available.
- Brand identity is logo-only; the row disappears when no logo is available.
- If list data includes a brand but not its logo, the theme hydrates it once per brand from Salla product details and shares the result across cards.
- Title, tax note, rating, and price are centered with compact spacing.
- Sale price is emphasized and old price is struck through.
- Out-of-stock products keep a stronger diagonal stock stamp and disabled purchase action.

## Product purchase controls
- One Salla add-product component owns both Add to Cart and native Quick Buy/Fast Checkout.
- Removed the second explicit quick-buy component that caused duplicate `Buy Now` actions.
- Sticky dock is not forced on page load. It docks only after the original purchase controls have been scrolled past.
- Returning to the original purchase controls undocks it.
- Mobile dock sits above the persistent bottom navigation and reserves matching page space so it does not cover content.
