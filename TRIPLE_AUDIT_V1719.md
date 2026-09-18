# ZOD Commerce v1.7.19 triple audit

Checked 2026-09-18 against the packaged v1.7.18 theme and current Theme Raed master.

## Concrete issues found and corrected

1. Latest Theme Raed exposes several storefront settings as globals. ZOD already bridged the stock-notification setting later from `app.js`, but the layout itself did not expose the current Raed globals, making some behavior dependent on initialization order. v1.7.19 exports the current Raed globals directly in the document head, keeps typed ZOD settings beside them, and parses both typed and string boolean values safely.
2. The initial Twig discount was rounded, but an option/variant price update refreshed the sale and regular prices without refreshing the discount label. v1.7.19 synchronizes the badge on every Salla price update and hides it when there is no active discount.
3. Two custom homepage product showcases still performed a numeric Twig comparison (`sale_price > 0`). Since Salla documents price fields can expose `-` in storefront contexts, v1.7.19 removes those numeric comparisons and uses the product sale flag plus the documented hidden-price sentinel.
4. Wishlist state was synchronized when the ZOD button itself was clicked, but not from Salla's global wishlist add/remove events. v1.7.19 binds the official events so every duplicate card and the product page stay in sync.

## Rechecked

- Standard product-card surfaces use `custom-salla-product-card`; Laser Showcase remains intentionally custom.
- Arabic card heart and quick-add are on the left; English equivalents are on the right.
- Active wishlist heart is solid red.
- Promotion strip uses pale pink with red text.
- Product page avoids unsafe Twig numeric comparisons with Salla price values.
- Product page keeps option-aware gallery, digital files, gifting, quick order, reviews, offers, quick-buy, native hooks and Salla product options.
- Current Theme Raed master reports package version `1.358.0` and a Twilight baseline of `^2.14.551`; ZOD v1.7.19 remains pinned to `2.14.580`.
- Runtime compatibility files are kept source/public identical; the product discount listener can still bind if another native price handler initialized first.
- JS syntax, JSON parsing, theme validation, regression suite, CSS budget and ZIP integrity are checked before packaging.
