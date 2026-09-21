import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../src/assets/js/partials/shipping-goal.js',import.meta.url),'utf8').replaceAll('export const ','const ');
const context={};vm.runInNewContext(source+'\nthis.calculate=goalState',context);const calc=context.calculate;
const nativeCart=(threshold,remaining,complete=false)=>({free_shipping_bar:{minimum_amount:threshold,remaining,percent:100*(threshold-remaining)/threshold,has_free_shipping:complete}});
assert.equal(calc(nativeCart(350,150)).remaining,150);
assert.equal(calc(nativeCart(500,150)).threshold,500,'merchant target changes are followed');
assert.equal(calc(nativeCart(500,0,true)).complete,true);
assert.equal(calc(nativeCart(500,0,false)).complete,false,'do not invent eligibility from amount alone');
assert.equal(calc({sub_total:900,discount:0}),null,'no fallback campaign when no native offer exists');
assert.equal(calc({free_shipping_bar:null,sub_total:900}),null,'disabled offer cannot claim progress');
assert.equal(calc({free_shipping_bar:{minimum_amount:350}}),null,'incomplete offer is not fabricated');
assert.equal(calc(nativeCart(350,0.01)).complete,false);
console.log('PASS: native shipping thresholds, eligibility, disabled and incomplete offers.');

// Exercise actual event handlers, deferred responses and popup focus behavior.
const node = () => ({events:{},attrs:{},hidden:true,textContent:'',
  addEventListener(name,fn){this.events[name]=fn},
  setAttribute(name,value){this.attrs[name]=value},focus(){doc.activeElement=this}});
const toggle=node(),popup=node(),closeButton=node(),live=node(),message=node(),progress=node(),icon=node();
popup.contains=element=>element===closeButton;
const widget={...node(),dataset:{threshold:'350'},style:{setProperty(){}},classList:{toggle(){},remove(){},add(){}},
  querySelector:selector=>({'[data-shipping-toggle]':toggle,'[data-shipping-popup]':popup,'[data-shipping-close]':closeButton,'[data-shipping-live]':live}[selector]),
  querySelectorAll:selector=>({'[data-shipping-message]':[message],'[data-shipping-progress]':[progress],'[data-shipping-icon]':[icon]}[selector]||[])};
const doc={documentElement:{lang:'en',dataset:{}},activeElement:null,events:{},querySelector:()=>widget,querySelectorAll:()=>[widget],addEventListener(name,fn){this.events[name]=fn}};
const callbacks={},requests=[],timers=new Map();let serial=0;
const event=Object.fromEntries(['onItemAdded','onItemUpdated','onItemDeleted','onCouponAdded','onCouponDeleted'].map(name=>[name,fn=>callbacks[name]=fn]));
const runtime={document:doc,Intl,window:{matchMedia:()=>({matches:false}),salla:{onReady:()=>Promise.resolve(),cart:{event,details:()=>new Promise((resolve,reject)=>requests.push({resolve,reject}))}}},
  setTimeout:(fn,ms)=>{timers.set(++serial,{fn,ms});return serial},clearTimeout:id=>timers.delete(id)};
const tick=async()=>{await Promise.resolve();await Promise.resolve()};
const fire=ms=>{const entry=[...timers].find(([,value])=>value.ms===ms);assert(entry,`expected ${ms}ms timer`);timers.delete(entry[0]);entry[1].fn()};
vm.runInNewContext(source+'\ninitShippingGoal()',runtime);
assert.equal(widget.hidden,false,'neutral eligibility icon is available before SDK confirmation');
assert.equal(progress.hidden,true,'unknown eligibility must not show a progress claim');
await tick();fire(180);requests[0].resolve({data:nativeCart(350,150)});await tick();
assert.equal(widget.hidden,false);assert.match(message.innerHTML,/150/);
callbacks.onItemAdded();fire(180);callbacks.onCouponAdded();fire(180);
requests[2].resolve({data:{cart:nativeCart(350,0,true)}});await tick();
assert.equal(icon.textContent,'🎉');assert.equal(popup.hidden,false);
requests[1].resolve({data:nativeCart(350,140)});await tick();
assert.equal(icon.textContent,'🎉','late response cannot overwrite current cart');
doc.activeElement=closeButton;fire(5500);assert.equal(popup.hidden,false,'focused popup cannot disappear on timer');
widget.events.keydown({key:'Escape'});assert.equal(popup.hidden,true);assert.equal(doc.activeElement,toggle,'Escape restores focus');
callbacks.onItemDeleted();fire(180);requests[3].resolve({data:nativeCart(500,250)});await tick();
assert.match(message.innerHTML,/250/);toggle.events.click();toggle.events.click();
assert.equal([...timers.values()].some(timer=>timer.ms===5500),false,'manual reopening cancels notice timeout');
callbacks.onItemUpdated();fire(180);requests[4].reject(new Error('offline'));await tick();
assert.match(message.innerHTML,/250/,'failed refresh preserves confirmed progress');
callbacks.onItemUpdated();fire(180);requests[5].resolve({data:{sub_total:900,free_shipping_bar:null}});await tick();
assert.equal(widget.hidden,false,'merchant-enabled eligibility icon stays available');
assert.equal(progress.hidden,true,'inactive or unknown offer hides progress');
assert.equal(icon.textContent,'🚚','removed offer clears the celebration');
assert.match(message.textContent,/Check free-delivery eligibility/);
console.log('PASS: shipping event refresh, stale response rejection, failed refresh, keyboard focus and manual popup timing.');
