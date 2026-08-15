# ZOD Commerce v1.3.1 — Motion Components

## What changed

- Commerce Hero: autoplay, swipe and pagination remain; large previous/next arrows are disabled.
- Shop by Category: horizontal autoplay carousel, still swipe/drag friendly.
- Brands: horizontal autoplay logo carousel, still swipe/drag friendly.
- Product Shelf: uses Salla native `autoplay` on `salla-products-slider`.
- Native Products Slider / Fixed Products / Featured Products: motion-first carousel behavior where supported by the theme template.
- Store Features: still uses Salla's real Store Features data, now presented as ZOD-styled feature cards.
- New component: **Interactive Featured Product / منتج مميز تفاعلي**.

## Interactive Featured Product — recommended COMMAX 70QT setup

1. Add **منتج مميز تفاعلي** in the Salla theme editor.
2. Product: select COMMAX 70QT.
3. Media:
   - For video, enter a direct HTTPS MP4 URL (for example `https://example.com/video.mp4`).
   - Upload an image in the media field to use it as the video poster and fallback image.
   - If no MP4 URL is entered, the poster/product image is shown normally.
4. Eyebrow:
   - AR: `عرض مميز`
   - EN: `FEATURED OFFER`
5. Title:
   - AR: `انتركم COMMAX بشاشة 7 بوصة واتصال Wi-Fi`
   - EN: `COMMAX 70QT 7-Inch Wi-Fi Video Intercom`
6. Description:
   - AR: `حل متطور للتواصل والتحكم عند المدخل بتصميم عصري وشاشة كبيرة للمنازل والمكاتب.`
   - EN: `A modern entrance communication solution with a large display designed for homes and offices.`
7. Countdown: enable only while a genuine promotion is active.
   - Date example: `Dec 30, 2026 23:59:59`
8. Add four interactive features:
   - Display — icon `شاشة / Display`
   - Wi-Fi — icon `واي فاي / Wi-Fi`
   - Entrance control — icon `مدخل / Door`
   - Modern design — icon `عام / General`
9. View product button:
   - AR: `عرض المنتج`
   - EN: `View Product`

The feature icons automatically cycle and glow. Clicking an icon immediately selects it and shows its related content. Product price/sale price and Add to Cart remain Salla-native.

## Motion principles

Motion is intentionally slow enough not to make the storefront noisy:
- Hero: ~6 second interval.
- Categories: ~2.8 second interval.
- Brands: ~1.8 second interval with a slower transition.
- Interactive features: ~3.6 second interval.
- Product sliders: native Salla autoplay.

Animations respect `prefers-reduced-motion` where custom motion is used.
