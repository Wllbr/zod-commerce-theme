# ZOD Commerce v1.5.5

- Uses translated strings embedded by Twig for cart add/update/remove feedback.
- Suppresses blocking success alerts for add/update/remove and replaces them with non-blocking feedback.
- Adds animated cart item removal using Salla `cart.deleteItem`.
- Removes the custom checkout interception introduced in v1.5.4; checkout navigation is native Salla again.
- Product purchase dock appears immediately with product image, title, price, quantity, Add to Cart and official Salla Quick Buy when available.
- Product dock slides up smoothly and stays locked above mobile navigation.
