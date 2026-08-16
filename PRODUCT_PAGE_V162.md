# ZOD Product Page v1.6.2

## Purpose
This pass keeps Salla responsible for checkout and payment behavior while aligning the product-page layout with the ZOD/Orkida-inspired visual direction.

## Purchase flow
- Quantity is presented above the purchase actions on mobile.
- `<salla-add-product-button quick-buy>` is the only quick-purchase integration.
- Salla Fast Checkout controls Buy Now and supported payment actions.
- Apple Pay appears/opens only when Salla has Apple Pay enabled and the customer is using a supported Apple/Safari environment.
- On Windows/Android, Salla shows Add to Cart + Buy Now instead.

## Reviews + installments
- `salla-reviews-summary` is inside the buybox above installments.
- `salla-installment` remains directly below it and therefore follows Salla's Tabby/Tamara eligibility.
- `salla-comments` remains lower on the page for the complete review/question experience.

## Removed
- The redundant lower Shipping & Delivery / support contact panel.

## Still Salla-native
Product price, stock, options, availability, installments, fast checkout, Apple Pay eligibility, reviews, metadata, payment methods, offers, gifting, and related products remain sourced from Salla.
