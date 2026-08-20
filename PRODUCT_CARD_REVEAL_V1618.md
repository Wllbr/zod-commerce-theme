# ZOD Commerce v1.6.18 — Product Card Reveal

Product cards now enter once with a subtle fade and upward movement when they approach the viewport.

## Behavior

- Desktop: four-card stagger, 400 ms entrance, 14 px travel.
- Mobile: two-card stagger, 340 ms entrance, 9 px travel.
- Each card animates only once, even when the customer scrolls away and returns.
- ZOD custom cards and Salla-native product cards are supported.
- Cards inserted later by Salla sliders, category results, or theme-editor updates are detected automatically.
- Existing card hover movement is preserved because reveal classes are removed after the entrance completes.
- Customers who prefer reduced motion see every card immediately.

The feature does not replace native scrolling and does not preload additional catalog pages.
