import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const stock = await import(`data:text/javascript;base64,${Buffer.from(read('src/assets/js/partials/stock.js')).toString('base64')}`);
const {isOutOfStock, mergeProductDetails} = stock;
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

// The server-rendered total must survive stale cache and late pre-mutation responses.
const handlers = {};
const cartHandlers = {};
const cartTimers = new Map();
const pending = [];
let cartTimerId=0;
const totalNode = {innerHTML:'100',classList:classes(),closest:()=>null};
const cartDocument = {
  addEventListener:(name,fn)=>{handlers[name]=fn;},
  querySelector:()=>({}),
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
cartHandlers.onItemDeleted({data:{cart:{total:0}}});
assert.equal(totalNode.innerHTML,'0','zero is a valid total');
console.log('PASS: stock snapshots, unlimited inventory, Quick View ordering/offline fallback, and cart stale-cache/request races.');
