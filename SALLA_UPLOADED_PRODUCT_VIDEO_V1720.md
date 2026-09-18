# Salla Uploaded Product Video Update — v1.7.20

Checked 2026-09-18.

Salla's Twilight update requires the product gallery to use each image object's `video_type` field instead of inferring media type from the URL.

Implemented in `src/views/pages/product/single.twig`:

```twig
data-type="{{ image.video_type ?? 'image' }}"
```

Expected values:
- `video` — uploaded product video
- `youtube` — YouTube product video
- fallback `image` — ordinary image

The gallery continues to use `image.video_url` as the media source URL and `image.url` as the poster/image fallback.
