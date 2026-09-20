/** v1.8.2 shopping regressions. DOM/SDK doubles test theme logic, not Salla APIs. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read = name => fs.readFileSync(new URL(`../${name}`, import.meta.url),'utf8');
const tests=[];
const check=(name,fn)=>{fn();tests.push(name);};
class Element {
  constructor(){this.attrs={};this.dataset={};this.style={};this.children={};this.hidden=false;this.innerHTML='';this.textContent='';this.names=new Set();this.classList={add:(...v)=>v.forEach(x=>this.names.add(x)),remove:(...v)=>v.forEach(x=>this.names.delete(x)),contains:v=>this.names.has(v)};}
  querySelector(s){return this.children[s]||null;}
  setAttribute(k,v){this.attrs[k]=String(v);}
  getAttribute(k){return this.attrs[k]??null;}
  removeAttribute(k){delete this.attrs[k];}
}
const selectors=['[data-zod-cart-item]','[data-testid="store-cart-item-total"]','[data-testid="store-cart-item-price"]','.item-original-price','.item-weight','.item-weight-row','salla-quantity-input','salla-cart-item-offers','.zod-cart-item-offer-details','.zod-cart-legacy-offer'];
const form=new Element();selectors.forEach(s=>form.children[s]=new Element());
const row=form.children['[data-zod-cart-item]'];row.dataset.unavailableLabel='Unavailable';row.closest=()=>row;
const line=form.children['[data-testid="store-cart-item-total"]'];line.innerHTML='100';
const grand=new Element();grand.innerHTML='100';const shipping=new Element();
shipping.children['[data-zod-free-shipping-message]']=new Element();
const progress=shipping.children['[data-zod-free-shipping-progress]']=new Element();progress.children.i=new Element();
const listeners={},sdkListeners={},timers=new Map(),requests=[];let timerId=0;
const document={querySelectorAll:s=>s==='[data-zod-cart-grand-total]'?[grand]:[],querySelector:s=>s==='[data-zod-cart-page]'?new Element():s==='[data-zod-free-shipping]'?shipping:null,getElementById:id=>id==='item-42'?form:null,addEventListener:(n,f)=>listeners[n]=f};
const sdk={money:n=>`M${n}`,lang:{get:(key,data)=>key+':'+(data?.amount||'')},event:{cart:{onUpdated:f=>sdkListeners.canonical=f}},cart:{details:()=>new Promise(resolve=>requests.push(resolve)),event:Object.fromEntries(['onItemUpdated','onItemDeleted','onItemAdded','onCouponAdded','onCouponDeleted','onItemUpdatedFailed'].map(n=>[n,f=>sdkListeners[n]=f]))}};
vm.runInNewContext(read('src/assets/js/pages.js'),{document,window:{},salla:sdk,setTimeout:(fn,delay)=>{timers.set(++timerId,{fn,delay});return timerId;},clearTimeout:id=>timers.delete(id)});
listeners.DOMContentLoaded();
const update=cart=>sdkListeners.canonical(cart);
const item=data=>update({items:[{id:42,...data}]});
check('canonical updates use server total, never derive tax/savings',()=>{update({total:121.37,sub_total:900,tax:500,discount:600});assert.equal(grand.innerHTML,'M121.37');});
check('special line total uses valid zero; unit/original prices stay distinct',()=>{item({total:100,total_special_price:0,detailed_offers:[{id:1}],price:25,original_price:40,is_on_sale:true,quantity:4,max_quantity:9});assert.equal(line.innerHTML,'M0');assert.equal(form.children['[data-testid="store-cart-item-price"]'].innerHTML,'M25');assert.equal(form.children['.item-original-price'].innerHTML,'M40');assert.equal(form.children['salla-quantity-input'].attrs.max,'9');assert.equal(form.children['salla-cart-item-offers'].attrs.quantity,'4');});
check('special totals apply only with native detailed offers',()=>{item({total:80,total_special_price:10,detailed_offers:[]});assert.equal(line.innerHTML,'M80');assert.equal(form.children['.zod-cart-item-offer-details'].hidden,true);});
check('unknown price is not fabricated as zero; localized digits accepted',()=>{for(const total of ['-',null,false,{},'',undefined]){update({total});assert.equal(grand.innerHTML,'M121.37');}update({total:{amount:'١٬٢٣٤٫٥'}});assert.equal(grand.innerHTML,'M1234.5');update({total:0});assert.equal(grand.innerHTML,'M0');});
check('unavailable status replaces stale item amount',()=>{item({is_available:false,total:80});assert.equal(line.textContent,'Unavailable');item({is_available:true,total:70});assert.equal(line.innerHTML,'M70');});
check('stock/weight/offer state refreshes without reading native internals',()=>{item({is_on_sale:false,weight_label:'',detailed_offers:[{id:2}],offer:{names:'<script>unsafe</script>'},quantity:3});assert.equal(form.children['.item-original-price'].hidden,true);assert.equal(form.children['.item-weight-row'].hidden,true);assert.equal(form.children['.zod-cart-item-offer-details'].hidden,false);assert.equal(form.children['salla-cart-item-offers'].attrs.offers,'[{"id":2}]');assert.equal(form.children['.zod-cart-legacy-offer'].hidden,true);item({detailed_offers:[],offer:{names:'<script>unsafe</script>'}});assert.equal(form.children['.zod-cart-legacy-offer'].textContent,'<script>unsafe</script>');});
check('shipping partial response preserves state; explicit removal hides it',()=>{update({free_shipping_bar:{remaining:20,percent:120,has_free_shipping:false}});assert.equal(shipping.hidden,false);assert.equal(progress.attrs['aria-valuenow'],'100');assert.equal(progress.children.i.style.width,'100%');assert.match(shipping.children['[data-zod-free-shipping-message]'].innerHTML,/M20/);update({total:300});assert.equal(shipping.hidden,false);update({free_shipping_bar:null});assert.equal(shipping.hidden,true);});
const begin=()=>listeners.change({target:row,composedPath:()=>[row]});
check('failed item mutation clears busy state without claiming success',()=>{begin();assert(row.names.has('is-updating'));assert.equal(row.attrs['aria-busy'],'true');sdkListeners.onItemUpdatedFailed();assert(!row.names.has('is-updating'));assert(!row.names.has('is-updated'));assert.equal(row.attrs['aria-busy'],undefined);});
check('mutation timeout is not a success signal',()=>{begin();const [id,task]=[...timers].find(([,v])=>v.delay===12000);timers.delete(id);task.fn();assert(!row.names.has('is-updating'));assert(!row.names.has('is-updated'));});
check('confirmed successful mutation ends busy state',()=>{begin();item({total:73});assert(!row.names.has('is-updating'));assert(row.names.has('is-updated'));assert.equal(line.innerHTML,'M73');});
const flush=()=>{const entry=[...timers].find(([,v])=>v.delay===260);assert(entry);timers.delete(entry[0]);return entry[1].fn();};
const old=flush();update({total:444});requests[0]({data:{cart:{total:111}}});await old;
check('late pre-mutation read cannot replace canonical total',()=>assert.equal(grand.innerHTML,'M444'));
const fresh=flush();requests[1]({data:{cart:{total:445}}});await fresh;
check('latest confirmed refresh can update total',()=>assert.equal(grand.innerHTML,'M445'));
const cart=read('src/views/pages/cart.twig'),pdp=read('src/views/pages/product/single.twig'),catalog=read('src/views/pages/product/index.twig'),options=read('src/views/pages/partials/product/options.twig'),master=read('src/views/layouts/master.twig');
check('native offer outside product form; reviews follow merchant setting',()=>{assert.equal((pdp.match(/<salla-offer\b/g)||[]).length,1);const start=pdp.indexOf('<salla-offer');assert(pdp.lastIndexOf('</form>',start)>pdp.lastIndexOf('<form',start));assert.match(pdp,/{% set show_product_reviews = store.settings.rating.show_on_product %}/);assert.doesNotMatch(pdp,/data-zod-volume-tier/);});
check('catalog first fetch matches selected sort, with explicit fallback',()=>{assert.match(catalog,/if sort.is_selected.*set initial_sort = sort.id/);assert.match(catalog,/set initial_sort = \(sorting\|first\).id/);assert.match(catalog,/sort-by="{{ initial_sort }}"/);assert.match(catalog,/sort.id == initial_sort/);});
check('cart attachment uploader retains native item context and files',()=>{assert.match(options,/is_page\('cart'\)[\s\S]*files="{{ product.attachments\|json_encode }}" cart-item-id="{{ product.id }}"/);assert.match(options,/aria-controls="note_{{ product.id }}"/);assert.match(cart,/id="item-{{ product_option.id }}"/);});
check('checkout summary is unique and no proxy action or invented breakdown remains',()=>{assert.equal((cart.match(/<salla-cart-summary-card\b/g)||[]).length,1);assert.doesNotMatch(cart,/store-cart-checkout-mobile|zod-cart-mobile-summary|data-zod-cart-tax/);assert.match(master,/show_mobile_bottom_nav[\s\S]*not is_page\('cart'\)/);});
check('sticky setting false leaves purchase controller inactive',()=>{let touched=false;const dock={dataset:{zodStickyEnabled:'0'},classList:{add(){touched=true;}}};vm.runInNewContext(read('src/assets/js/product-purchase-v1726.js'),{document:{readyState:'complete',querySelector:()=>({querySelector:()=>dock})},window:{}});assert.equal(touched,false);assert.match(pdp,/sticky_enabled \? '1' : '0'/);});
console.log(`PASS: ${tests.length} shopping regression checks: ${tests.join('; ')}.`);

// Execute the actual catalog controller with DOM/SDK doubles. Browser navigation
// is restricted in the local preview sandbox; URL/recovery logic is verified here.
{
  const handlers={}, sort=new Element(), list=new Element(), loading=new Element(), recovery=new Element(), retry=new Element(), count=new Element();
  const nativeFilters={brand:7};let resolveReload;let reloads=0;let ready;
  sort.value='latest';sort.options=[{value:'latest'},{value:'price-asc'}];sort.addEventListener=(n,f)=>handlers[n]=f;
  recovery.children['[data-zod-catalog-retry]']=retry;retry.addEventListener=(n,f)=>handlers.retry=f;
  list.nativeFilters=nativeFilters;list.querySelectorAll=()=>[];list.reload=()=>{reloads++;return new Promise(r=>resolveReload=r);};
  const selectors={'salla-products-list':list,'[data-zod-catalog-loading]':loading,'[data-zod-catalog-count]':count,'[data-zod-catalog-recovery]':recovery};
  const location={href:'https://store.example.test/search?q=fan+220&page=3&campaign=sample',assign:url=>location.assigned=url,reload:()=>location.reloaded=true};
  const history={state:{preserve:true},replaceState:(state,title,url)=>{history.saved=state;location.href=url;}};
  const source=read('src/assets/js/products.js').replace(/^import[^\n]+\n/,'');
  vm.runInNewContext(source,{URL,MutationObserver:class {constructor(f){this.fn=f;}observe(){}},containDialogFocus:()=>{},document:{getElementById:id=>id==='product-filter'?sort:null,querySelectorAll:()=>[],querySelector:s=>selectors[s]||null,addEventListener:(n,f)=>{if(n==='DOMContentLoaded')ready=f;}},window:{location,history,matchMedia:()=>({matches:false,addEventListener:()=>{}})}});
  ready();const pending=handlers.change();
  assert(sort.disabled && !loading.hidden);assert.equal(list.sortBy,'latest');assert.strictEqual(list.nativeFilters,nativeFilters);
  const url=new URL(location.href);assert.equal(url.searchParams.get('q'),'fan 220');assert.equal(url.searchParams.get('campaign'),'sample');assert.equal(url.searchParams.get('sort'),'latest');assert(!url.searchParams.has('page'));assert.strictEqual(history.saved,history.state);
  await handlers.change();assert.equal(reloads,1,'repeated changes are ignored while native reload is pending');
  resolveReload();await pending;assert(!sort.disabled && loading.hidden);
  sort.value='price-asc';list.reload=()=>Promise.reject(new Error('fixture rejection'));await handlers.change();
  assert.equal(new URL(location.assigned).searchParams.get('sort'),'price-asc');assert.equal(new URL(location.assigned).searchParams.get('q'),'fan 220');
  delete location.assigned;list.reload=undefined;sort.value='latest';await handlers.change();assert.equal(new URL(location.assigned).searchParams.get('sort'),'latest');
  console.log('PASS: 3 catalog controller scenarios — preserved queries/filter state + duplicate-request guard; rejected reload navigation; absent reload navigation.');
}
