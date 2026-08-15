# ZOD Commerce v1.5.3 — Cart Interactions

## Quantity updates
- Browser success alerts for cart quantity updates are intercepted only on the cart page.
- Customers see a compact non-blocking "Cart updated" / "تم تحديث السلة" toast instead.
- The edited cart row shows a subtle sweep while Salla updates the item, followed by a confirmation pulse.
- Visible cart totals refresh from `salla.cart.details()` and animate when the amount changes.

## Checkout journey
The old "Secure checkout / إتمام طلب آمن" label has been replaced with a visual journey:

Cart → Delivery → Payment

The current Cart step pulses gently while the connector line animates forward. On mobile this visual is hidden to preserve space; the fixed total + checkout action remains the primary conversion control.

## Salla behavior
The theme does not replace Salla quantity or checkout logic. `salla-quantity-input`, `salla.form.onChange('cart.updateItem', event)`, cart details, and the hosted checkout remain native.
