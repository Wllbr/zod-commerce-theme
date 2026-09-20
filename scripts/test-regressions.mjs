import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const productCardSource = read('src/assets/js/partials/product-card.js');
const stock = await import(`data:text/javascript;base64,${Buffer.from(read('src/assets/js/partials/stock.js')).toString('base64')}`);
const {isOutOfStock, mergeProductDetails} = stock;
const previewLinks = await import(`data:text/javascript;base64,${Buffer.from(read('src/assets/js/partials/preview-links.js')).toString('base64')}`);
const searchCards = await import(`data:text/javascript;base64,${Buffer.from(read('src/assets/js/partials/search-card-navigation.js')).toString('base64')}`);
const searchLink = {href:'/product/p1',textContent:'Product one',getAttribute:()=>null,matches:selector=>selector.startsWith('a')};
const searchCard = {querySelector:()=>searchLink};
assert.equal(searchCards.getSearchCardLink(searchCard),searchLink,'search card resolves its product link');
assert.equal(searchCards.shouldOpenSearchCard([{},searchCard],searchCard),true,'empty card area opens the product');
assert.equal(searchCards.shouldOpenSearchCard([searchLink,searchCard],searchCard),false,'native product links remain in control');
const previewLocation = {
  href: 'https://salla.design/ar/dev-zod?expires=1&version_id=2',
  hostname: 'salla.design',
  search: '?expires=1&version_id=2'
};
assert.equal(
  previewLinks.normalizePreviewStoreUrl('https://demostore.salla.sa/ar/dev-zod/product/p1', previewLocation),
  'https://salla.design/ar/dev-zod/product/p1?expires=1&version_id=2'
);
assert.equal(
  previewLinks.normalizePreviewStoreUrl('https://demostore.salla.sa/ar/store/product/p1', previewLocation),
  'https://demostore.salla.sa/ar/store/product/p1'
);
assert.equal(
  previewLinks.normalizePreviewStoreUrl('https://demostore.salla.sa/ar/dev-zod/product/p1', {
    href:'https://shop.example/ar', hostname:'shop.example', search:''
  }),
  'https://demostore.salla.sa/ar/dev-zod/product/p1'
);
const available = {id: 1, is_available: true, unlimited_quantity: true, quantity: 0};
assert.equal(isOutOfStock(available), false);
assert.equal(isOutOfStock({quantity: 0}), true);
assert.equal(isOutOfStock({quantity: 0, type: 'donating'}), false);
assert.equal(isOutOfStock(mergeProductDetails(available, {id: 1, is_available: false, quantity: 0})), true);
assert.equal(isOutOfStock(mergeProductDetails(available, {id: 1, status: 'out'})), true);
assert.equal(isOutOfStock(mergeProductDetails(available, {id: 1, quantity: 0})), true);
assert.equal(isOutOfStock(mergeProductDetails({id: 1, is_out_of_stock: true}, available)), false);
assert.equal(isOutOfStock(mergeProductDetails(available, {id: 1, name: 'Updated name'})), false);

const nativeCard = {product:available,matches:()=>false,getAttribute:()=>null,querySelector:()=>null,
  classList:{toggle:(_name,value)=>{nativeCard.markedOut=value;}},setAttribute(){},removeAttribute(){}};
const nativeContext=vm.createContext({window:{},document:{documentElement:{lang:'en'},querySelectorAll:()=>[nativeCard]},
  isOutOfStock,isOutStatus:stock.isOutStatus,MutationObserver:class {observe(){}},setTimeout(){},requestAnimationFrame:fn=>fn()});
vm.runInContext(read('src/assets/js/app.js').replace(/^import .*;\r?\n/gm,'').replace('window.zodTheme = new ZodTheme();','window.Theme = ZodTheme;'),nativeContext);
nativeContext.window.Theme.prototype.initNativeStockBadges();
assert.equal(nativeCard.markedOut,false,'native unlimited cards stay available');
nativeCard.product={is_available:false,quantity:0};
nativeContext.window.Theme.prototype.initNativeStockBadges();
assert.equal(nativeCard.markedOut,true,'native unavailable cards keep the stock stamp');

// A failure in an optional enhancement must not disable core header controls.
nativeContext.document.querySelector=()=>null;
nativeContext.document.getElementById=()=>null;
nativeContext.document.addEventListener=()=>{};
nativeContext.document.documentElement.classList={add(){},toggle(){}};
vm.runInContext(`
  ['initLiveShowcasePrices','initProductCardReveal','initNativeStockBadges',
   'initNativeCardActions','initScreenAds','initWhatsAppFloat','initLocationsCarousel',
   'initFooterDisclosures','initDisclosureToggles','initProfileAvatarUpload'].forEach(name => {
    window.Theme.prototype[name] = function() { if (name === 'initLiveShowcasePrices') this.enhancementReady = true; };
  });
  window.Theme.prototype.initCartExperience = function() { throw new Error('optional feature failed'); };
  new window.Theme();
`,nativeContext);
assert.equal(nativeContext.window.zodTheme.enhancementReady,true,'core controller survives optional feature failure');

// Exercise actual Quick View request ordering and failed detail fetches.
let Card;
const requests = [];
const timers = new Map();
let timerId = 0;
let focusRestored = 0;
const classes = () => ({add(){}, remove(){}, contains(){return true;}});
const content = {innerHTML: ''};
const closeButton = {focus(){}};
const trigger = {focus(){focusRestored++;}};
const modal = {hidden:true, classList:classes(), contains:()=>false,
  querySelector: selector => selector === '.zod-qv__content' ? content : closeButton};
const document = {documentElement:{lang:'en'}, body:{classList:classes()}, activeElement:trigger,
  getElementById:()=>modal};
const context = vm.createContext({HTMLElement:class {}, customElements:{get:()=>null,define:(_name, klass)=>{Card=klass;}}, window:{}, document,
  isOutOfStock, mergeProductDetails, containDialogFocus(){},
  requestAnimationFrame:fn=>fn(), setTimeout:fn=>{timers.set(++timerId,fn);return timerId;}, clearTimeout:id=>timers.delete(id),
  salla:{lang:{get:key=>key}, money:String, product:{getDetails:()=>new Promise((resolve,reject)=>requests.push({resolve,reject}))}}});
vm.runInContext(read('src/assets/js/partials/product-card.js').replace(/^import .*;\r?\n/gm,''),context);
const card = new Card();
card.stripHtml = value => value;
assert.match(productCardSource, /classList\.add\('zod-product-card'\)/, 'shared card keeps the v1.7.13 base class');
assert.doesNotMatch(productCardSource, /zod-product-card--marketplace/, 'rejected marketplace card class is not rendered');
assert.match(productCardSource, /zpc-offer-badge/, 'v1.7.13 promotion badge is restored');
assert.match(productCardSource, /zpc-media-dots/, 'v1.7.13 gallery dots are restored');
assert.match(productCardSource, /zpc-category/, 'v1.7.13 category row is restored');
assert.match(productCardSource, /zpc-subtitle/, 'v1.7.13 subtitle is restored');
assert.match(productCardSource, /zpc-brand/, 'v1.7.13 brand row is restored');
assert.match(productCardSource, /zpc-tax/, 'v1.7.13 tax label is restored');
assert.match(productCardSource, /sicon-heart/, 'v1.7.13 wishlist icon is restored');
assert.doesNotMatch(productCardSource, /zpc-deal-strip|zpc-bestseller-badge|zpc-heart-svg/, 'later Noon-style card elements are absent');
assert.equal(card.priceValues({price:115,regular_price:115,sale_price:80,is_on_sale:false}).onSale,false,
  'scheduled discounts do not appear as active card offers');
assert.equal(card.priceValues({price:115,regular_price:115,sale_price:80,is_on_sale:true}).current,80,
  'active Salla discounts appear at the sale price');
const productTemplate = read('src/views/pages/product/single.twig');
const productPageSource = read('src/assets/js/product.js');
assert.match(productTemplate,
  /store-product-installment" price="\{\{ product\.price \}\}"/,
  'installments keep Theme Raed/Salla native product pricing');
assert.doesNotMatch(productTemplate,
  /sale_price_value|regular_price_value|base_price_value|compare_price_value|starting_price_value|display_price_value|has_valid_sale/,
  'product rendering must not use numeric Twig price-normalization variables');
assert.match(productTemplate,/data-images='\{\{ product\.images\|json_encode \}\}'/,
  'product slider exposes Salla image data for option-linked thumbnails');
assert.match(productTemplate,/listen-to-thumbnails-option/,
  'product slider listens to Salla thumbnail options');
assert.match(productTemplate,/digital-files\.js/,
  'digital products load the Theme Raed-compatible digital-files component');
assert.match(productPageSource,/product::price\.updated\.failed/,
  'product page reacts to Salla price failures');
assert.match(productPageSource,/onPriceUpdated/,
  'product page reacts to Salla native option-price updates');
assert.match(productPageSource,/salla\.product\.getPrice|window\.salla\.product\.getPrice/,
  'valid option changes request a fresh native Salla price');
const first = card.openQuickView({id:1, name:'First', url:'/first'});
const second = card.openQuickView({id:2, name:'Second', url:'/second'});
requests[1].resolve({data:{id:2,name:'Newest',url:'/second',is_available:true}});
await second;
requests[0].resolve({data:{id:1,name:'Stale',url:'/first'}});
await first;
assert.match(content.innerHTML,/Newest/);
assert.doesNotMatch(content.innerHTML,/Stale/);
const failed = card.openQuickView({id:3,name:'Fallback',url:'/fallback',is_available:true});
requests[2].reject(new Error('offline'));
await failed;
assert.match(content.innerHTML,/Fallback/);
assert.equal(modal.__zodLastFocus,trigger);
const noteProduct = card.openQuickView({id:4,name:'Needs a note',url:'/notes',is_available:true});
requests[3].resolve({data:{id:4,name:'Needs a note',url:'/notes',is_available:true,can_add_note:true}});
await noteProduct;
assert.match(content.innerHTML,/View full details/);
assert.doesNotMatch(content.innerHTML,/<salla-add-product-button/,
  'quick view must not bypass Salla product notes or attachment fields');
const nonTaxable = card.openQuickView({id:5,name:'Non-taxable',url:'/non-taxable',is_available:true});
requests[4].resolve({data:{id:5,name:'Non-taxable',url:'/non-taxable',is_available:true,is_taxable:false}});
await nonTaxable;
assert.doesNotMatch(content.innerHTML,/zod-qv__tax/,
  'non-taxable Salla products must not claim VAT is included');

// The server-rendered total must survive stale cache and late pre-mutation responses.
const handlers = {};
const cartHandlers = {};
const cartTimers = new Map();
const pending = [];
let cartTimerId=0;
const totalNode = {innerHTML:'100',classList:classes(),closest:()=>null};
const cartLineTotal={innerHTML:'707.40'};
const cartDocument = {
  getElementById:id=>id==='item-42'?{querySelector:selector=>selector==='[data-testid="store-cart-item-total"]'?cartLineTotal:null}:null,
  addEventListener:(name,fn)=>{handlers[name]=fn;},
  querySelector:selector=>selector==='[data-zod-cart-page]'?{}:null,
  querySelectorAll:selector=>selector==='[data-zod-cart-grand-total]'?[totalNode]:[]
};
const sdk={money:String, storage:{get:()=>({total:999})}, cart:{
  details:()=>new Promise(resolve=>pending.push(resolve)),
  event:Object.fromEntries(['onItemAdded','onItemDeleted','onItemUpdated','onItemUpdatedFailed','onCouponAdded','onCouponDeleted'].map(name=>[name,fn=>{cartHandlers[name]=fn;}]))
}};
vm.runInNewContext(read('src/assets/js/pages.js'),{
  document:cartDocument,window:{},salla:sdk,
  setTimeout:(fn,delay)=>{cartTimers.set(++cartTimerId,{fn,delay});return cartTimerId;},
  clearTimeout:id=>cartTimers.delete(id)
});
handlers.DOMContentLoaded();
assert.equal(totalNode.innerHTML,'100');
const flushRefresh=async()=>{
  const entry=[...cartTimers].find(([,task])=>task.delay===260);
  assert.ok(entry,'a cart refresh is scheduled');
  cartTimers.delete(entry[0]);
  return entry[1].fn();
};
const oldRefresh=flushRefresh();
cartHandlers.onItemUpdated({data:{cart:{total:120}}});
assert.equal(totalNode.innerHTML,'120');
pending[0]({data:{cart:{total:100}}});
await oldRefresh;
assert.equal(totalNode.innerHTML,'120','late details must not undo a successful update');
const newRefresh=flushRefresh();
pending[1]({data:{cart:{total:120}}});
await newRefresh;
cartHandlers.onItemUpdated({data:{cart:{total:6003.2,items:[{id:42,total:943.2}]}}});
assert.equal(cartLineTotal.innerHTML,'943.2','line total must follow confirmed server pricing');
cartHandlers.onItemDeleted({data:{cart:{total:0}}});
assert.equal(totalNode.innerHTML,'0','zero is a valid total');
console.log('PASS: stock snapshots, unlimited inventory, Quick View ordering/offline fallback, and cart stale-cache/request races.');

// A temporary menu API failure must allow a fresh request on retry.
let MenuSource;
let menuAttempts = 0;
const menuBox = {innerHTML:'', querySelector:()=>null, querySelectorAll:()=>[]};
const menuSdk = {onReady:()=>Promise.resolve(),api:{component:{getMenus:async()=>{
  if (++menuAttempts === 1) throw new Error('offline');
  return {data:[{title:'Fans',url:'/fans'}]};
}}}};
const menuWindow = {salla:menuSdk};
const menuContext = {
  HTMLElement:class {},customElements:{get:()=>null,define:(_name,klass)=>{MenuSource=klass;}},
  window:menuWindow,salla:menuSdk,document:{addEventListener(){},documentElement:{lang:'en'},getElementById:()=>menuBox},
  setTimeout,containDialogFocus(){}
};
vm.runInNewContext(read('src/assets/js/partials/zod-menu.js').replace(/^import .*;\r?\n/gm,''),menuContext);
menuWindow.zodMenuSource = new MenuSource();
await menuWindow.zodMenu.load();
assert.match(menuBox.innerHTML,/Could not load categories/);
assert.match(menuBox.innerHTML,/data-zod-menu-retry/);
await menuWindow.zodMenu.load();
assert.equal(menuAttempts,2);
assert.match(menuBox.innerHTML,/Fans/);
menuWindow.zodMenu.setMenus([]);
assert.match(menuBox.innerHTML,/No categories are available/);

// An independent categories request keeps the drawer useful if main menus fail.
const categoryFallbackSdk = {
  onReady:()=>Promise.resolve(),
  api:{component:{getMenus:async()=>{ throw new Error('main menu offline'); }}},
  product:{categories:async()=>({data:[{name:'Ventilation',url:'/ventilation',sub_categories:[{name:'Wall fans',url:'/wall-fans'}]}]})}
};
menuContext.salla = categoryFallbackSdk;
menuWindow.salla = categoryFallbackSdk;
menuWindow.zodMenuSource = new MenuSource();
menuWindow.zodMenu.menus = [];
await menuWindow.zodMenu.load();
assert.match(menuBox.innerHTML,/Ventilation/);
assert.match(menuBox.innerHTML,/data-zod-next/);

console.log('PASS: menu failure recovery and empty menu handling.');

// High-risk responsive fixes must remain present in the compiled source.
const menuSource = read('src/assets/js/partials/zod-menu.js');
const styles = read('src/assets/styles/app.scss');
const dualShowcase = read('src/views/components/home/dual-showcase.twig');
const cartTemplate = read('src/views/pages/cart.twig');
const categoryGridTemplate = read('src/views/components/home/category-grid.twig');
const footerTemplate = read('src/views/components/footer/footer.twig');
const heroTemplate = read('src/views/components/home/hero.twig');
const homeSource = read('src/assets/js/home.js');
const laserTemplate = read('src/views/components/home/laser-showcase.twig');
assert.match(menuSource,/document\.body\.appendChild\(drawer\)/,'catalog drawer escapes the sticky header stacking context');
assert.match(styles,/html\.zod-lock \.zod-announcement/,'announcement is suppressed while the catalog dialog is open');
assert.match(read('src/assets/styles/refinement.css'),/salla-cart-summary-card\.zod-cart-summary-card[^}]*display:block!important/,'native checkout summary stays visible on mobile');
assert.match(dualShowcase,/replace\(\{'\/ar\/':'\/en\/'\}\)/,'English showcase links use the English storefront');
assert.match(cartTemplate,/class="zod-cart-summary-card"/,'cart summary exposes the responsive target class');
assert.doesNotMatch(`${categoryGridTemplate}\n${footerTemplate}\n${cartTemplate}`,/link\(['"]categories['"]\)/,'category calls to action never target Salla’s unavailable categories route');
assert.match(categoryGridTemplate,/aria-controls="zod-catalog-drawer"/,'homepage View all opens the category drawer');
assert.equal((footerTemplate.match(/aria-controls="zod-catalog-drawer"/g)||[]).length,1,'footer exposes one category drawer call to action');
assert.match(styles,/\.zod-hero-slider \.swiper-slide\{width:100%!important;max-width:100%!important;flex:0 0 100%!important\}/,'hero slides fill the frame without exposing an adjacent slide');
assert.match(heroTemplate,/type="fullwidth"[\s\S]*slides-per-view="1"[\s\S]*direction="\{\{ language\.dir \}\}"/,'hero uses one full-width slide with the active storefront direction');
assert.match(heroTemplate,/sicon-arrow-right rtl:rotate-180/,'hero CTA arrow follows the storefront direction');
assert.doesNotMatch(homeSource,/triggers\[activeIndex\]\.scrollIntoView/,'laser selection never moves the entire storefront viewport');
assert.match(homeSource,/selector\.scrollBy\(\{ top, behavior \}\)[\s\S]*selector\.scrollBy\(\{ left, behavior \}\)/,'laser selection stays inside its desktop vertical or mobile horizontal rail');
assert.match(homeSource,/video\.muted = !\(index === activeIndex && soundEnabled\)/,'laser videos stay muted until sound is explicitly enabled');
assert.match(laserTemplate,/data-zod-laser-sound[\s\S]*aria-pressed="false"/,'laser video exposes an accessible muted-by-default sound control');
assert.doesNotMatch(laserTemplate,/sicon-play/,'laser selector does not show decorative play icons');
assert.doesNotMatch(laserTemplate,/motion_preview|zod-laser-panel__live/,'laser media does not show a redundant live-preview badge');
assert.match(laserTemplate,/zod-laser-panel__feature-icon[\s\S]*zod-laser-showcase__browse/,'laser showcase uses icon benefits and a browse-all action');
assert.match(styles,/\.zod-laser-showcase\.is-sound-cue[\s\S]*zodLaserSoundCue/,'laser sound control provides a limited arrival cue');

console.log('PASS: mobile dialog layering, cart dock isolation, bilingual showcase routing, and category drawer calls to action.');

// v1.7.23 restoration audit: every standard product collection still uses the
// shared ZOD card, with the pre-v1.7.12 legacy runtime loaded after app.js.
const masterTemplate = read('src/views/layouts/master.twig');
const productSingleTemplate = read('src/views/pages/product/single.twig');
const productRuntimeCompat = read('src/assets/js/product-runtime-compat.js');
const productTypeSwitcherTemplate = read('src/views/components/home/product-type-switcher.twig');
const standardProductTemplates = [
  'src/views/components/home/fixed-products.twig',
  'src/views/components/home/product-shelf.twig',
  'src/views/components/home/product-type-switcher.twig',
  'src/views/components/home/products-slider.twig',
  'src/views/pages/brands/single.twig',
  'src/views/pages/cart.twig',
  'src/views/pages/customer/wishlist.twig',
  'src/views/pages/landing-page.twig',
  'src/views/pages/product/index.twig',
  'src/views/pages/product/single.twig'
];
for (const path of standardProductTemplates) {
  const template = read(path);
  for (const match of template.matchAll(/<salla-products-(?:slider|list)\b[^>]*>/g)) {
    assert.match(match[0], /product-card-component="custom-salla-product-card"/, `${path} routes every native product collection through the shared ZOD card`);
  }
}
assert.doesNotMatch(standardProductTemplates.map(read).join('\n'), /<salla-product-card\b/, 'standard Twig surfaces never fall back to a different native product card');
assert.equal((productTypeSwitcherTemplate.match(/product-card-component="custom-salla-product-card"/g) || []).length, 2, 'product type switcher uses the shared card for selected and category feeds');
assert.doesNotMatch(masterTemplate, /product-card-marketplace\.js/, 'layout no longer loads the rejected marketplace-card runtime override');
assert.match(masterTemplate, /app\.js[\s\S]*legacy-product-card\.js/, 'legacy card patch loads after the base app bundle');
assert.match(masterTemplate, /window\.header_is_sticky\s*=/, 'master keeps current Raed sticky-header global');
assert.match(masterTemplate, /window\.imageZoom\s*=/, 'master keeps current Raed image-zoom global');
assert.match(masterTemplate, /window\.can_access_wallet\s*=/, 'master keeps current Raed wallet global');
assert.match(masterTemplate, /window\.enable_add_product_toast\s*=/, 'master keeps current Raed add-product-toast global');
assert.match(masterTemplate, /window\.notify_when_available_in_card\s*=/, 'master keeps current Raed card notification global');
assert.ok(masterTemplate.indexOf('window.header_is_sticky') < masterTemplate.indexOf("{% hook 'head:start' %}"), 'Raed-compatible storefront globals are emitted before theme hooks initialize');
assert.match(productSingleTemplate, /data-zod-discount/, 'product Twig exposes a stable discount badge hook');
assert.doesNotMatch(productSingleTemplate, /discount_percentage\s*\|\s*replace|discount_percentage[^\n]*\|\s*round/, 'product Twig never performs type-sensitive discount formatting');
assert.ok(productSingleTemplate.includes(`data-zod-discount-raw="{{ product.discount_percentage|default('') }}"`), 'product Twig passes raw discount data to the safe runtime formatter');
assert.match(productRuntimeCompat, /const renderDiscount = percent =>/, 'runtime owns discount formatting for initial and option prices');
assert.match(productRuntimeCompat, /calculatePercent\([\s\S]*?dataset\.zodDiscountRaw/, 'runtime safely initializes discount from Salla data');
assert.match(productSingleTemplate, /product-runtime-compat\.js[\s\S]*product\.js/, 'product runtime compatibility loads before the main product bundle');

console.log('PASS: legacy-card routing plus current Raed/Twilight product-page hardening.');
const spotlightTemplate = read('src/views/components/home/product-spotlight.twig');
const interactiveShowcaseTemplate = read('src/views/components/home/interactive-product-showcase.twig');
assert.doesNotMatch(`${spotlightTemplate}\n${interactiveShowcaseTemplate}`, /sale_price\s*>\s*0/, 'custom homepage showcases do not perform unsafe numeric Twig comparisons on Salla sale prices');
assert.match(spotlightTemplate, /sale_price != '-'/, 'product spotlight handles Salla hidden-price sentinel without numeric arithmetic');
assert.match(interactiveShowcaseTemplate, /sale_price != '-'/, 'interactive showcase handles Salla hidden-price sentinel without numeric arithmetic');
console.log('PASS: v1.7.19 custom showcase Twig price-safety hardening.');

// v1.7.20 Salla uploaded product video support.
{
  const twig = read('src/views/pages/product/single.twig');
  assert(twig.includes(`data-type="{{ image.video_type ?? 'image' }}"`), 'product gallery must use Salla video_type with image fallback');
  assert(!twig.includes(`image.video_type|default('image')`), 'legacy default-filter media-type lookup must not remain');
}
console.log('PASS: v1.7.20 uploaded product video media-type support.');
// v1.7.24 pre-marketplace card refinement + current product safety.
{
  const cardSource = read('src/assets/js/partials/product-card.js');
  const legacySource = read('src/assets/js/legacy-product-card.js');
  const publicLegacy = read('public/legacy-product-card.js');
  const productTwig = read('src/views/pages/product/single.twig');
  const runtime = read('src/assets/js/product-runtime-compat.js');
  const publicRuntime = read('public/product-runtime-compat.js');
  const webpack = read('webpack.config.js');
  assert.match(legacySource, /zod-product-card--legacy/, 'legacy runtime marks every restored card with the pre-marketplace class');
  assert.match(legacySource, /zpc-hover-actions[\s\S]*zpc-quick-view[\s\S]*zpc-wishlist/, 'legacy runtime keeps desktop Eye + Heart image actions');
  assert.match(legacySource, /zpc-heart-svg/, 'legacy wishlist uses a real SVG so active state can fill solid red');
  assert.match(legacySource, /zpc-discount-badge[\s\S]*zpc-offer-badge/, 'legacy card renders separate discount and promotion badges');
  assert.match(legacySource, /class="zpc-add/, 'legacy runtime restores the full-width purchase action');
  assert.doesNotMatch(legacySource, /zpc-media-add|zpc-media-dots|zpc-brand/, 'legacy runtime does not render marketplace plus/dots/brand rows');
  assert.equal(publicLegacy, legacySource, 'packaged legacy product-card runtime exactly matches source');
  assert.match(webpack, /'legacy-product-card': asset\('js\/legacy-product-card\.js'\)/, 'future production builds include the legacy card patch');
  assert.doesNotMatch(webpack, /product-card-marketplace/, 'future production builds cannot regenerate the rejected marketplace runtime entry');
  assert.equal(publicRuntime, runtime, 'packaged product compatibility runtime exactly matches source runtime');
  assert.doesNotMatch(productTwig, /discount_percentage[^\n]*\|\s*(?:replace|round)/, 'discounted product Twig cannot fail on numeric-vs-string discount types');
  assert.doesNotMatch(productTwig, /(?:sale_price|regular_price|starting_price|discount_percentage)\s*[<>+*\/]/, 'product Twig performs no unsafe arithmetic/comparison on polymorphic Salla price fields');
  assert.match(productTwig, /data-type="\{\{ image\.video_type \?\? 'image' \}\}"/, 'product Twig keeps current uploaded-video media type contract');
  assert.match(runtime, /normalizeDigits/, 'discount runtime accepts localized numeric strings');
  assert.match(runtime, /Math\.round\(percent\)/, 'discount badge is rounded only in JavaScript');
  // Base card source may retain newer helpers, but the loaded legacy patch owns the visible card markup.
  assert.match(cardSource, /customElements\.define\('custom-salla-product-card'/, 'base custom card remains registered for the patch to extend');
  assert.match(read('src/assets/styles/app.scss'), /@media\(max-width:1023px\), \(hover:none\)[\s\S]*?zpc-quick-view[\s\S]*?display:none!important/, 'quick-view eye is hidden outside desktop hover layouts');
  assert.match(read('src/assets/js/product.js'), /if \(rect\.bottom < 0\) activateDock\(\);/, 'sticky purchase bar waits until the inline purchase controls are passed');
  assert.doesNotMatch(productTwig, /sticky-product-bar is-docked is-ready/, 'product Twig does not start with an always-on dock');
  assert.doesNotMatch(productTwig, /data-zod-sale-countdown/, 'sale countdown is removed from the product page');
  assert.equal((productTwig.match(/<salla-offer\b/g)||[]).length, 1, 'one native offer component replaces estimated quantity tiers');
}
console.log('PASS: purchase dock, native Salla offers, and no sale countdown.');


// v1.7.25 notifier regression guard
{
  const fs = await import('node:fs');
  const srcApp = fs.readFileSync(new URL('../src/assets/js/app.js', import.meta.url), 'utf8');
  const publicApp = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  const master = fs.readFileSync(new URL('../src/views/layouts/master.twig', import.meta.url), 'utf8');
  assert.match(srcApp, /salla\.notify\?\.setNotifier\?\./, 'source must register a custom Salla notifier');
  assert.match(publicApp, /salla\.notify\?\.setNotifier\?\./, 'compiled runtime must register a custom Salla notifier');
  assert.doesNotMatch(srcApp, /window\.alert\s*=/, 'must not monkey-patch window.alert globally');
  assert.match(master, /<salla-add-product-toast\b/, 'Salla approval requires its add-product toast');
  assert.match(srcApp, /googleTags\?\.event === 'addToCart'/, 'only native add-to-cart success metadata suppresses duplicate feedback');
  assert.match(srcApp, /type !== 'error'/, 'purchase errors must not be silenced by the native toast');
}

// v1.8.2 supersedes the v1.7.27/30/31 estimated offer and custom-summary contracts.
// Native Salla components now own promotion eligibility and monetary breakdowns.
{
  const purchase = read('src/assets/js/product-purchase-v1726.js');
  const cart = read('src/views/pages/cart.twig');
  const pages = read('src/assets/js/pages.js');
  assert.doesNotMatch(purchase, /condition_threshold|mergeOfferTiers|collectSimplePercentageTier|offerDetails|onOffersFetched|setQuantity/, 'no guessed promotion APIs, eligibility or per-unit formulas');
  assert.doesNotMatch(cart, /data-zod-cart-subtotal|data-zod-cart-saved|data-zod-cart-discount|store-cart-checkout-mobile/, 'native summary replaces custom monetary breakdown and proxy checkout');
  assert.match(cart, /<salla-cart-summary-card/, 'native checkout is retained');
  assert.match(pages, /salla\.event\?\.cart\?\.onUpdated/, 'canonical native cart updates are observed');
  assert.doesNotMatch(pages, /paintMobileSummary|originalTotalNodes|savedBoxes/, 'theme must not reconstruct summary savings or tax');
}
console.log('PASS: native promotion and checkout ownership replaces estimated offer tiers and mobile summary calculations.');

// v1.7.28 product-page scroll stability + smart header hardening.
{
  const productTwig = read('src/views/pages/product/single.twig');
  const productJs = read('src/assets/js/product.js');
  const purchaseJs = read('src/assets/js/product-purchase-v1726.js');
  const appJs = read('src/assets/js/app.js');
  const appCss = read('src/assets/styles/app.scss');
  assert(productTwig.includes("{% set sticky_price_value = product.is_on_sale ? product.sale_price : product.price %}"), 'v1.7.28 sticky price must not use starting_price');
  assert(!productTwig.includes("product.starting_price ? product.starting_price|money : product.price|money"), 'v1.7.28 product page must not render starting_price as the main price');
  assert(productJs.includes("this.buyBar.classList.contains('zod-dock-persistent-v1726')"), 'v1.7.28 old sticky controller must yield to the persistent dock');
  assert(!purchaseJs.includes("window.addEventListener('scroll', schedule"), 'v1.7.28 persistent dock must not rewrite itself on scroll');
  assert(appJs.includes('initMobileSmartHeader') && appJs.includes('delta < -1'), 'v1.7.28 smart mobile header behavior missing');
  assert(appCss.includes('v1.7.28 — product-page scroll stability') && appCss.includes('left:50%!important'), 'v1.7.28 centered desktop dock CSS missing');
}
console.log('PASS: v1.7.28 scroll stability, centered dock, smart mobile header, and price cleanup.');

// v1.7.29 card metadata, compact mobile cart details, and footer regrouping.
{
  const legacySource = read('src/assets/js/legacy-product-card.js');
  const productTwig = read('src/views/pages/product/single.twig');
  const switcherTwig = read('src/views/components/home/product-type-switcher.twig');
  const cartTwig = read('src/views/pages/cart.twig');
  const pagesJs = read('src/assets/js/pages.js');
  const footerTwig = read('src/views/components/footer/footer.twig');
  const appJs = read('src/assets/js/app.js');
  const appCss = read('src/assets/styles/app.scss');
  assert.match(legacySource, /p\.subtitle \?\? p\.sub_title[\s\S]*p\.promotion\?\.sub_title/, 'v1.7.29 legacy card reads Salla subtitle/sub-title variants');
  assert.match(legacySource, /class="zpc-subtitle"/, 'v1.7.29 legacy card renders subtitle under the product title');
  assert.match(appCss, /@media\(max-width:767px\)[\s\S]*zod-product-card--legacy \.zpc-hover-actions[\s\S]*display:none!important/, 'v1.7.29 mobile cards hide floating eye/wishlist actions');
  assert.match(legacySource, /p\.promotion_title[\s\S]*p\.promotion\?\.title/, 'v1.7.29 card still reads Salla promotional-title variants');
  assert.match(appCss, /body\.product-single \.zod-product-subtitle[\s\S]*text-align:right!important/, 'v1.7.29 Arabic product subtitle alignment missing');
  assert.equal((switcherTwig.match(/class="zod-shared-product-slider"/g)||[]).length,2,'v1.7.29 category switcher marks both selected/category feeds as shared-card surfaces');
  assert.equal((switcherTwig.match(/product-card-component="custom-salla-product-card"/g)||[]).length,2,'v1.7.29 category switcher keeps shared custom card for both feeds');
  assert.match(cartTwig, /<details class="zod-cart-item-offer-details"/, 'item offers use a keyboard-operable native disclosure');
  assert.doesNotMatch(cartTwig, /<details[^>]*\bopen(?:[\s>])/, 'offer disclosures start closed without rewriting native content');
  assert.match(footerTwig, /data-zod-business-certificate/, 'v1.7.29 footer has a dedicated Business Platform certificate host');
  assert.match(footerTwig, /data-zod-footer-bottom-payments/, 'v1.7.29 payment methods moved to the footer bottom strip');
  assert.match(appJs, /Business Platform certificate/, 'footer runtime handles the Business Platform certificate');
  assert.match(appCss, /grid-template-columns:max-content minmax\(0,1fr\) max-content/, 'v1.7.29 footer bottom reserves a non-overlapping middle cell for payments');
  assert.match(productTwig, /zod-product-subtitle/, 'product page still renders Salla subtitle metadata');
}
console.log('PASS: v1.7.29 mobile card metadata, compact cart details, shared category cards, and footer regrouping.');

// v1.7.31 supported offers + dual badges + compact cart + footer policy grid.
{
  const purchaseJs = read('src/assets/js/product-purchase-v1726.js');
  const legacySource = read('src/assets/js/legacy-product-card.js');
  const cartTwig = read('src/views/pages/cart.twig');
  const pagesJs = read('src/assets/js/pages.js');
  const footerTwig = read('src/views/components/footer/footer.twig');
  const appJs = read('src/assets/js/app.js');
  const appCss = read('src/assets/styles/app.scss');
  assert.doesNotMatch(purchaseJs, /source\.offersList|source\.data\?\.offers/, 'v1.7.31 must not depend on private salla-offer properties');
  assert.match(legacySource, /zpc-discount-badge[\s\S]*zpc-offer-badge/, 'v1.7.31 product card renders discount and promotional title separately');
  assert.match(appCss, /\.zpc-discount-badge[\s\S]*right:8px!important/, 'v1.7.31 product-card discount is physical right');
  assert.match(appCss, /\.zpc-offer-badge[\s\S]*left:8px!important/, 'v1.7.31 promotional title is physical left');
  assert.match(appCss, /body\.product-single \.zod-product-badge[\s\S]*font-size:10px!important/, 'v1.7.31 product-page promotion tag is compact');
  assert.doesNotMatch(footerTwig, /data-footer-disclosure/, 'v1.7.31 mobile policy links must remain visible rather than collapsed by runtime');
  assert.match(appCss, /grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/, 'v1.7.31 mobile policy links render three per row');
  assert.match(appJs, /querySelectorAll\('salla-payments'\)/, 'v1.7.31 removes the Business Platform certificate from every payment strip');
}
console.log('PASS: dual product badges, product payment cleanup, and 3-column policy footer.');


// v1.7.32 silent unavailable-variant selection.
{
  const appJs = read('src/assets/js/app.js');
  assert.match(appJs, /variantNotificationSilenceUntil/, 'v1.7.32 tracks product-option interaction before filtering stock notifications');
  assert(appJs.includes('الكمية\\s*غير\\s*متوفرة') && appJs.includes('product service error'), 'v1.7.32 filters Salla unavailable-variant notifier messages');
  assert.match(appJs, /SALLA-PRODUCT-OPTIONS/, 'v1.7.32 scopes notification silencing to product option interaction');
}
console.log('PASS: v1.7.32 out-of-stock variant selections stay inline without notification toasts.');
