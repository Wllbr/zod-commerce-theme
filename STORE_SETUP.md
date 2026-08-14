# ZOD Commerce — Store Setup & Launch Guide

This guide assumes the theme will be launched as a **new Salla theme and dedicated new Git repository**.

## A. Local installation

Recommended folder on Windows:

```text
D:\ZOD\zod-commerce-theme
```

Open CMD in the extracted theme folder and run:

```cmd
node -v
pnpm -v
pnpm install
pnpm test
pnpm production
```

If pnpm is missing:

```cmd
npm install -g pnpm
```

The project already contains explicit pnpm build approvals for the native dependencies that commonly trigger pnpm 11's ignored-build warning.

## B. Create a completely new GitHub repository

Suggested repository name:

```text
zod-commerce-theme
```

Create an empty repository under the GitHub account connected to Salla Partners. Do not initialize it with another README or theme.

Then, from the new theme folder:

```cmd
git init
git branch -M main
git add -A
git commit -m "Initial ZOD Commerce theme"
git remote add origin https://github.com/Wllbr/zod-commerce-theme.git
git push -u origin main
```

On GitHub, confirm `main` is the default branch.

## C. Import as a new Salla theme

```cmd
salla login
salla theme create
```

Choose:

```text
Store Theme
→ Import a theme
→ Wllbr
→ zod-commerce-theme
```

Then enter the Salla-created local theme folder (if the CLI creates one) and run:

```cmd
pnpm test
pnpm production
salla theme preview --with-editor
```

## D. Theme editor — homepage build order

The fresh project intentionally does not ship fake customer content or invented campaign artwork. Build the live homepage with real store content in this order:

### 1. Commerce Hero
Use 1–3 strong campaigns at launch, not six competing banners.

For every slide configure:
- desktop image
- mobile image
- Arabic + English title
- optional short supporting text
- CTA label
- destination

### 2. Category Navigation
Choose the most important top-level categories. Aim for 6–10 categories before adding secondary catalog groups.

Each selected Salla category should have:
- clear category name in both languages
- professional category image
- correct parent/child hierarchy

### 3. Shop by Need
Create customer-intent pathways rather than duplicating category names. Examples should be based on actual catalog/customer needs, not placeholder copy.

Each card needs:
- problem/need image
- short bilingual title
- optional one-line explanation
- destination category, product collection, guide, or page

### 4. Best Sellers
Use `Product Shelf`. Select real best sellers or leave product selection empty for the current fallback feed while testing.

### 5. Product Spotlight
Use only for products/campaigns that deserve a mini landing-page treatment. Combine one product with a strong image/video and 3–4 meaningful benefits.

### 6. Category Product Shelves
Duplicate Product Shelf for important catalog families. Keep each shelf focused and provide a View All destination.

### 7. Promotion Grid
Enable only when there is a real promotion. Do not keep fake discounts or expired urgency messages on the homepage.

### 8. Brands
Select important manufacturer brands and ensure each brand has a clean logo and useful Salla brand page.

### 9. Wholesale / Business CTA
Link to a real business/quotation/contact page. Keep this separate from consumer Add to Cart flows.

### 10. Buying Guides
Link to real Salla blog articles or useful content pages. Guides should answer compatibility/selection questions and link back to relevant products.

### 11. FAQ
Use questions that remove buying objections: delivery, warranty, returns, oversized products, installation/support, business quotations, etc. Answers must match actual store policies.

### 12. Locations / Contact
If customers can visit a showroom, branch or pickup location, add only verified locations, business hours, contact number and directions link. Keep this section disabled if there is no customer-facing location.

### 13. Reviews
Use Salla's real review/testimonial data. Do not create fabricated names or reviews.

### 14. Trust & Service
Use only claims the business can actually support. Keep each point short.

## E. Menu architecture

Keep category trees meaningful and customer-friendly. A technical store benefits from a three-path navigation model:

1. **By category** — what the product is.
2. **By need** — what the customer is trying to solve.
3. **By brand** — for model/brand-aware shoppers.

The desktop theme renders deep menus as a mega-menu; mobile renders them as a drill-down catalog drawer.

## F. Search quality checklist

Because the theme uses Salla's live search, search quality depends heavily on product data.

For every technical product keep these consistent:
- complete model number in title or SKU
- brand attached in Salla
- Arabic and English product name
- searchable common terms in description/content
- correct category
- accurate stock
- real price
- clear primary image

Test model-number variants and Arabic/English searches before launch.

## G. Product page data checklist

For each product:
- 5–7 useful images when possible
- clean primary image
- model / SKU
- brand
- price and real discount if applicable
- accurate stock
- variants/options
- Salla metadata/specifications
- description focused on benefits + intended use
- warranty terms
- delivery/shipping behavior
- size/install dimensions when relevant
- what's in the box
- video/3D asset only when it genuinely helps

## H. Policy and trust pages

Before public launch, verify and publish real pages for:
- Shipping & Delivery
- Returns / Exchanges
- Warranty / Service
- Privacy
- Terms
- Contact
- About ZOD
- Wholesale / Business Quotations

Link them through the Salla footer menu so the theme renders them automatically.

## I. Bilingual QA

Test every important page twice: Arabic and English.

Arabic:
- RTL menu/navigation
- Arabic component content
- price/quantity controls
- long product titles
- mobile filter sheet
- cart/checkout path

English:
- LTR navigation
- no leftover Arabic storefront content
- long technical model names
- filters/options
- cart/checkout path

Avoid important text baked into campaign images unless separate Arabic/English artwork is intentionally used.

## J. Device QA

Minimum preview widths:
- 360 px mobile
- 390–430 px modern phone
- 768 px tablet
- 1024 px small desktop/tablet landscape
- 1366 px laptop
- 1440/1920 px desktop

Test:
- header/menu
- live search
- category pages
- filters/sort
- product gallery/video
- product options
- Add to Cart
- Quick Buy when enabled
- out of stock / notify availability
- cart options/notes/uploads
- coupons/offers
- wishlist/account
- footer accordions

## K. Pre-launch commands

```cmd
pnpm install
pnpm test
pnpm production
salla theme preview --with-editor
```

Commit only after the build and Salla preview are clean:

```cmd
git add -A
git commit -m "Prepare ZOD Commerce for launch"
git push origin main
```

## L. Consumer launch rule

Do not publish just because the code builds. Publish only after the live Salla preview has been checked with **real ZOD content** in Arabic and English on desktop and mobile, including at least:
- one normal product
- one discounted product
- one product with options
- one out-of-stock product
- one large/technical product
- cart and checkout
