# ZOD Commerce v1.6.19 — Mobile Cart Synchronization

The count-only header badge now synchronizes with Salla's live cart before displaying a value.

## Fix

- A stale `cart.summery` browser-storage value can no longer remain visible after Salla returns an authoritative empty cart.
- Live cart responses are read from their count fields or calculated from item quantities.
- The badge refreshes after add, delete, page return, and initial Salla readiness.
- When the cart API contains products but the server-rendered cart page is empty, the theme makes one guarded reload to let Salla restore the cart session without creating a loop.
- If the live request fails, the stored count remains available as a temporary fallback.
