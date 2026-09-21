# Component manual — ZOD 1.9.0 / دليل المكونات


All 18 IDs from v1.8.0 are preserved; `home.hero-hub` was introduced in that release. Existing settings are not automatically populated. The first configuration field of each component now includes usage guidance in the theme editor. Image sizes below are editorial suggestions, not Salla API limits.


## 1. Specialist category hero / واجهة الأقسام الرئيسية — زود

Template: `home.hero-hub`

Placement: Top of homepage; your recommended primary hero. / بداية الصفحة الرئيسية.

Setup: Select the three actual categories; edit bilingual copy and optional square cutouts. No category URL means no fake CTA. Media priority: manual generated image, then bundled generated KDK/Commax/AFC artwork. Actual catalog photos are references for generation. / اربط التصنيفات الثلاثة وأضف صوراً اختيارية.

Destination fallback fields: `exhaust_url`, `intercom_url`, `insect_url`. Legacy representative-product selectors remain compatible but do not override the generated artwork.

Fields: `title`, `intro`, `exhaust_category`, `exhaust_title`, `exhaust_text`, `exhaust_image`, `intercom_category`, `intercom_title`, `intercom_text`, `intercom_image`, `insect_category`, `insect_title`, `insect_text`, `insect_image`.



## 2. Commerce hero / واجهة المتجر الرئيسية

Template: `home.hero`

Placement: Alternative to the new hero, not a mandatory second hero. / بديل للواجهة الجديدة.

Setup: Configure slides, device-appropriate images and real destination links. Prefer one or two strong slides; check reduced motion and crop. No invented prices.

Fields: `slides`.



## 3. Shop by category / تصفح حسب التصنيف

Template: `home.category-grid`

Placement: After the primary hero. / بعد الواجهة الرئيسية.

Setup: Choose real catalog categories and enable the all-categories link only when useful. Manual browsing replaces unnecessary autoplay. Suggested square category media.

Fields: `title`, `subtitle`, `categories`, `show_all`.



## 4. Shop by need / تسوق حسب احتياجك

Template: `home.shop-by-need`

Placement: After priority products. / بعد المنتجات الرئيسية.

Setup: Use purpose-led cards such as bathroom ventilation, entrance communication or insect control. Each item needs a relevant link. Suggested landscape photography.

Fields: `title`, `subtitle`, `items`.



## 5. Product shelf / صف منتجات

Template: `home.product-shelf`

Placement: Repeat separately for exhaust, intercom and insect control. / صف مستقل لكل قسم مهم.

Setup: Select products explicitly for category-specific headings. Empty selection now hides the shelf. Enable `show_latest_when_empty` only for a deliberate general latest-products row. / القائمة الفارغة تخفي الصف؛ فعّل خيار أحدث المنتجات فقط لصف عام. Real list payloads own price and availability; no extra details request per card.

Fields: `title`, `subtitle`, `products`, `display_all_url`, `soft_background`, `show_latest_when_empty`.



## 6. Product type switcher / منتجات حسب النوع

Template: `home.product-type-switcher`

Placement: Optional instead of several long shelves. / بديل اختياري لصفوف كثيرة.

Setup: Add groups with clear labels and relevant selected products. Check keyboard navigation, empty groups and native slider behavior inside Salla. Avoid duplicate stock-heavy sections.

Fields: `title`, `subtitle`, `groups`, `soft_background`.



## 7. Product spotlight / منتج مميز

Template: `home.product-spotlight`

Placement: One important product lower on the page. / منتج مميز.

Setup: Select the actual product and matching media. Keep benefits factual. Do not manually label an image with a live price. If no authoritative price is present, the theme does not invent or fetch one on load.

Fields: `products`, `media`, `eyebrow`, `title`, `text`, `benefit_one`, `benefit_two`, `benefit_three`, `button`.



## 8. Interactive featured product / منتج مميز تفاعلي

Template: `home.interactive-product-showcase`

Placement: Optional rich product explanation. / عرض تفاعلي اختياري.

Setup: Choose product/media and feature tabs. Optional video must have a useful poster. Countdown is optional: only use a genuine time-limited event; do not imply a sale solely because a timer exists. Verify feature tab text and reduced motion.

Fields: `products`, `media`, `video_url`, `title`, `text`, `show_countdown`, `countdown_date`, `features`, `view_button`.



## 9. Laser experience / عالم الليزر

Template: `home.laser-showcase`

Placement: Lower priority than your three hero categories. / أسفل الأقسام الرئيسية.

Setup: Each item needs one real selected product; add poster, optional MP4 and verified feature text. Native selected-product lists supply purchase data. Inactive lists are mounted on tab interaction. Video sound is user-controlled. Do not invent eye-safety or laser-class claims.

Fields: `title`, `subtitle`, `browse_label`, `browse_url`, `items`.



## 10. Promotional banners / بنرات ترويجية

Template: `home.promo-grid`

Placement: Between product sections, sparingly. / بنرات محدودة بين الأقسام.

Setup: Configure banner image/copy and a valid link. Suggested 1200×700 landscape sources. Empty banners are not substitute products; do not hard-code transient prices.

Fields: `banners`.



## 11. Brands / الماركات التجارية

Template: `home.brands`

Placement: After product discovery. / بعد المنتجات.

Setup: Choose real brands, use clean transparent logos and check all-brands navigation. Suggested square padded logo files. Do not imply authorized-distributor status without evidence.

Fields: `title`, `subtitle`, `brands`, `show_all`.



## 12. Locations & contact / الفروع والتواصل

Template: `home.locations`

Placement: Near contact/wholesale information. / بجوار التواصل.

Setup: Enter actual branches, address/contact fields and genuine map destinations. Validate each phone and map link. Remove example branches.

Fields: `title`, `subtitle`, `items`.



## 13. Buying guides / أدلة الشراء

Template: `home.buying-guides`

Placement: Near the lower homepage. / قرب نهاية الصفحة.

Setup: Create short practical guides, then link each card to a real content page. Suggested landscape 1200×800 images. Match claims to manufacturer data; the component does not generate article pages automatically.

Fields: `title`, `subtitle`, `items`.



## 14. Timed screen advertisement / إعلان منبثق مؤقت

Template: `home.screen-ad`

Placement: Optional campaign only; leave absent by default. / اختياري للحملات.

Setup: Supply desktop/mobile creatives and actual link; choose frequency, duration and delay carefully. Keep close controls available. Avoid an immediate popup on every visit. Test keyboard access and native checkout overlays.

Fields: `desktop_image`, `mobile_image`, `image_alt`, `url`, `open_new_tab`, `duration`, `delay`, `frequency`, `auto_close`, `backdrop_close`.



## 15. WhatsApp contact / تواصل واتساب

Template: `home.whatsapp-contact`

Placement: Optional contact route. / تواصل اختياري.

Setup: Enter real international-format numbers and team labels; verify destination on a phone. Do not use placeholder/fallback numbers as live contacts. Avoid overlapping mobile purchase controls.

Fields: `title`, `text`, `button`, `fallback_phone`, `contacts`.



## 16. FAQ / الأسئلة الشائعة

Template: `home.faq`

Placement: Before the footer. / قبل الفوتر.

Setup: Use actual warranty, delivery and compatibility answers. Opening a question closes another only within the same FAQ section. Do not paste unverified policy wording.

Fields: `title`, `subtitle`, `items`.



## 17. Animated visual comparison / مقارنة بصرية متحركة

Template: `home.dual-showcase`

Placement: Optional editorial visual comparison. / مقارنة بصرية اختيارية.

Setup: Supply the two appropriate images and concise labels. Suggested equal-size square/landscape originals. A visual comparison is not evidence of technical superiority.

Fields: `title`, `subtitle`, `center_label`, `items`.



## 18. Wholesale CTA / طلب جملة ومشاريع

Template: `home.wholesale-cta`

Placement: Near the bottom, only when the service is available. / طلبات الجملة والمشاريع.

Setup: Use a genuine quote/contact link, relevant image and truthful commercial copy. Do not promise stock, project approval or response times without operational support.

Fields: `image`, `eyebrow`, `title`, `text`, `button`, `url`.



## Native storefront components

Native Salla product lists, variants, add-to-cart, stock notification, cart/customer/account controls, rating controls, contacts, footer menu and payment/trust data are retained. Do not replace these with static HTML from the preview. Native home components offered by your Salla environment can be used alongside the custom ones; their exact live rendering and settings need Salla preview verification.

## Defaults and missing content

Category hero: drawings and localized text remain; missing category selection removes its link. Product shelves: existing latest-products fallback remains when empty. Laser items without a selected product are skipped. Brand/contact/promo sections depend on the selected merchant content. It is usually better to omit an incomplete component than show empty media or a placeholder contact.

## Performance rules for future edits

Do not reintroduce getDetails into card connectedCallback, render, media hover/focus, list mutation observers or homepage initialization. Use available list data. Detail fetches belong only to PDP logic or explicit Quick View interaction. Keep inactive optional product panels deferred; do not add an observer that silently hydrates them.

## Photo and accessibility review

Keep editable text outside images; give meaningful editorial images useful alternative text when the component exposes it; decorative hero artwork stays hidden from assistive technology. Test phone crop, text contrast, keyboard focus, reduced motion and long Arabic labels for each configured component.


## Native pages updated in 1.8.1 / صفحات سلة الأساسية

These are page templates, not additional draggable homepage components. / هذه قوالب صفحات وليست مكونات إضافية للرئيسية.

- Blog index and article: populate articles/categories in Salla; the merchant blog setting owns comments. / أضف المقالات والتصنيفات من سلة واضبط خيار التعليقات.
- Thank-you page: order instructions, payment state, email invoice and shipment data are native. No manual payment-status fields. / تُقرأ تعليمات الطلب وحالته والفاتورة والشحنات من سلة.
- Customer order: carrier links, branches and preorder dates appear only when the real order contains them. / تظهر بيانات الناقل والفرع والطلب المسبق عند توفرها في الطلب.

## Shared page controls in 1.8.2 / إعدادات الصفحات

These are not extra homepage components; the 18 existing component IDs are unchanged.

- `sticky_add_to_cart`: enable the persistent purchase bar, or disable it for inline purchase controls. / شريط شراء ثابت أو شراء داخل محتوى الصفحة.
- `show_product_selection_help`: optional neutral reminder to verify the real product specifications. / تذكير اختياري بمراجعة المواصفات.
- Product review visibility follows the merchant's native review setting. / التقييمات تتبع إعداد التاجر.
- Native cart summary and native product offers need no duplicate theme component. Promotions are configured in Salla. / لا تضف ملخص سلة أو حساب خصومات موازياً.
- Mobile bottom navigation is omitted on the cart page. / يُخفى التنقل السفلي في السلة لإعطاء الأولوية لإتمام الطلب.


## v1.9.0 shelf and header updates

home.product-shelf adds category and show_offers_when_empty. Selected products remain first priority, followed by category, offers, then opt-in latest. Set three focused shelves for the hero categories; use sales reports to curate best sellers. All 18 component IDs are retained.

Header search-bar and department-rail settings are retained only for configuration compatibility. Their former bars no longer render. Desktop search is an icon; mobile bottom navigation owns search where enabled.
