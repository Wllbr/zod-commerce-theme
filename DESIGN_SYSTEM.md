# ZOD Commerce Design System

## 1. Visual direction

ZOD Commerce is a specialist retail storefront, not a dark technology showcase. Product photography and product information should carry the page.

- Background: white / soft neutral
- Primary text: charcoal / near-black
- Secondary text: cool gray
- Brand accent: controlled ZOD red
- Borders: subtle neutral gray
- Shadows: low-contrast and used sparingly
- Corners: modern medium radius, not exaggerated pills everywhere
- Motion: short and functional; disabled/reduced for `prefers-reduced-motion`

## 2. Hierarchy

Every page should make one action obvious.

### Home
Discover → compare → trust.

### Category
Understand category → refine → scan products.

### Product
Recognize product → confirm compatibility/specification → understand price/availability → choose options → buy.

### Cart
Confirm selection → edit if necessary → understand total → checkout.

## 3. Header

### Desktop
- Utility/announcement strip above the main header when enabled.
- Main header: logo, dominant live search, account, wishlist, cart.
- Dedicated catalog navigation row beneath.
- Wide mega-menu for deep catalog categories.
- Sticky behavior should compact visually on scroll without hiding search/navigation affordances.

### Mobile
- Compact logo/action row.
- Search receives its own full-width row rather than being squeezed between icons.
- Catalog opens as a drill-down drawer.
- Bottom dock provides Home, Categories, Search, Wishlist/Account, and Cart access based on theme configuration.

## 4. Search

Use Salla's native search component so live inventory/search behavior stays platform-compatible.

Search should visually prioritize:
- product image
- product title/model
- price
- relevant category/brand context

Model-number searches are critical for a technical catalog. Product titles, SKUs and metadata should therefore be entered consistently in Salla.

## 5. Category imagery

Recommended source artwork:
- Category tile: 1:1, at least 800 × 800 px
- Shop-by-need: 4:5 or square, at least 900 px on the short edge
- Desktop hero: approximately 2.3–2.6:1, at least 1800 px wide
- Mobile hero: 4:5 or 1:1, at least 1080 px wide
- Promo/story cards: 4:5 or 3:4
- Brand logos: transparent PNG/SVG with generous internal whitespace

Avoid baking important Arabic/English copy into images. Keep campaign text in theme fields so both languages remain correct.

## 6. Product cards

Card job: recognize, compare, act.

Show only high-value information:
- image
- badge when genuine
- wishlist
- brand (when available)
- product name/model
- rating (when real)
- price / sale price
- Add to Cart or availability action

Do not turn cards into specification tables. Technical detail belongs on the product page.

Desktop grids may show 4–5 cards depending on width. Mobile grids should use two usable columns rather than shrinking desktop cards.

## 7. Product page

Desktop is split into a media gallery and purchase panel. Mobile stacks them.

Purchase panel priority:
1. brand
2. title/subtitle
3. rating + model/SKU
4. stock
5. price/VAT/installments
6. availability
7. product options/bundles/size guide
8. quantity
9. Add to Cart / Quick Buy
10. delivery/warranty/payment/support reassurance

Long-form information appears below in clear blocks:
- Description
- Specifications
- Shipping & delivery
- Warranty/support information
- Reviews
- Related products

The mobile sticky purchase bar appears only when supported by the platform/theme setting and stays above the theme mobile dock.

## 8. Technical specifications

Specifications should be entered as Salla product metadata whenever possible so the native metadata component can render them consistently.

Recommended metadata for technical products:
- Brand
- Model
- Installation type
- Dimensions
- Voltage
- Frequency
- Power
- Capacity / airflow / flow rate (depending on category)
- Weight
- Country of origin
- Warranty
- What's in the box

## 9. Filters

Desktop: sidebar/filter area + sort.
Mobile: large Filter and Sort controls; filter opens as a bottom sheet rather than a tiny sidebar.

Use meaningful product attributes consistently in Salla to make filtering useful.

## 10. Footer

Desktop footer is multi-column and information-rich without becoming a wall of links.
Mobile secondary columns collapse into native accordions.

Footer jobs:
- describe ZOD briefly
- expose catalog navigation
- expose customer service/policies
- expose wholesale/business paths
- show verified contact/business/payment information supplied by Salla/store settings
- provide social links

## 11. Accessibility/responsiveness

- Buttons remain touch-friendly on mobile.
- Focusable controls use semantic Salla/native components where possible.
- Images carry alt text from store content.
- Motion respects reduced-motion preference.
- Arabic uses RTL layout; English uses LTR layout from the same templates.
- Text is not embedded into decorative artwork when it needs translation.
