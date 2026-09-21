import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../src/assets/js/partials/shipping-goal.js',import.meta.url),'utf8').replaceAll('export const ','const ');
const context={};vm.runInNewContext(source+'\nthis.calculate=goalState',context);const calc=context.calculate;
const cart=(amount,discount=0)=>({sub_total:amount,discount});
assert.equal(calc(cart(200),350).remaining,150);
assert.equal(calc(cart(350),500).remaining,150,'manual threshold changes work without a native offer');
assert.equal(calc(cart(350),350).complete,true);
assert.equal(calc(cart(350,10),350).complete,false,'discounts reduce progress by default');
assert.equal(calc(cart(350,10),350,false).complete,true,'optional before-discount calculation');
assert.equal(calc(cart(349.99),350).remaining,0.01);
assert.equal(calc(cart(0),350).percent,0);
assert.equal(calc(cart(1000),350).percent,100);
assert.equal(calc(cart(200),'٣٥٠').remaining,150);
assert.equal(calc(cart(10.1),10.10).complete,true,'decimal boundary is stable');
for(const target of [0,-1,'',null,'invalid',Infinity]) assert.equal(calc(cart(900),target),null);
assert.equal(calc({total:900},350),null,'incomplete response is not an empty cart');
assert.equal(calc(cart(900,'invalid'),350),null);
assert.equal(calc({sub_total:{amount:200},discount:{amount:10}},350).remaining,160);
console.log('PASS: manual targets, discounts, empty cart, decimals, Arabic digits and invalid data.');

// Exercise actual event handlers, deferred responses and popup focus behavior.
const node = () => ({events:{},attrs:{},hidden:true,textContent:'',
  addEventListener(name,fn){this.events[name]=fn},
  setAttribute(name,value){this.attrs[name]=value},focus(){doc.activeElement=this}});
const toggle=node(),popup=node(),closeButton=node(),live=node(),message=node(),progress=node(),icon=node();
popup.contains=element=>element===closeButton;
const widget={...node(),dataset:{shippingTarget:'350',shippingRemaining:'Only {remaining} to {target}',shippingSuccess:'Delivery is free!'},style:{setProperty(){}},classList:{toggle(){},remove(){},add(){}},
  querySelector:selector=>({'[data-shipping-toggle]':toggle,'[data-shipping-popup]':popup,'[data-shipping-close]':closeButton,'[data-shipping-live]':live}[selector]),
  querySelectorAll:selector=>({'[data-shipping-message]':[message],'[data-shipping-progress]':[progress],'[data-shipping-icon]':[icon]}[selector]||[])};
const componentMessage=node(),componentProgress=node();
const component={...widget,dataset:{shippingTarget:'500',shippingRemaining:'Section {remaining} / {target}'},querySelector:()=>null,querySelectorAll:selector=>({'[data-shipping-message]':[componentMessage],'[data-shipping-progress]':[componentProgress]}[selector]||[])};
const doc={documentElement:{lang:'en',dataset:{}},activeElement:null,events:{},querySelector:()=>widget,querySelectorAll:()=>[component,widget],addEventListener(name,fn){this.events[name]=fn}};
const callbacks={},requests=[],timers=new Map();let serial=0;
const event=Object.fromEntries(['onItemAdded','onItemUpdated','onItemDeleted','onCouponAdded','onCouponDeleted'].map(name=>[name,fn=>callbacks[name]=fn]));
const runtime={document:doc,Intl,window:{matchMedia:()=>({matches:false}),salla:{onReady:()=>Promise.resolve(),cart:{event,details:()=>new Promise((resolve,reject)=>requests.push({resolve,reject}))}}},
  setTimeout:(fn,ms)=>{timers.set(++serial,{fn,ms});return serial},clearTimeout:id=>timers.delete(id)};
const tick=async()=>{await Promise.resolve();await Promise.resolve()};
const fire=ms=>{const entry=[...timers].find(([,value])=>value.ms===ms);assert(entry,`expected ${ms}ms timer`);timers.delete(entry[0]);entry[1].fn()};
vm.runInNewContext(source+'\ninitShippingGoal()',runtime);
assert.equal(widget.hidden,false,'manual target is visible before SDK confirmation');
assert.equal(progress.hidden,true,'unknown eligibility must not show a progress claim');
await tick();fire(180);requests[0].resolve({data:cart(200)});await tick();
assert.equal(widget.hidden,false);assert.equal(message.textContent,'Only 150 to 350');
assert.equal(componentMessage.textContent,'Section 300 / 500','component before widget retains its independent target');
assert.equal(requests.length,1,'multiple components share one cart request');
callbacks.onItemAdded();fire(180);callbacks.onCouponAdded();fire(180);
requests[2].resolve({data:{cart:cart(350)}});await tick();
assert.equal(icon.textContent,'🎉');assert.equal(popup.hidden,false);
assert.equal(componentMessage.textContent,'Section 150 / 500');assert.equal(componentProgress.attrs['aria-valuenow'],'70');
requests[1].resolve({data:cart(210)});await tick();
assert.equal(icon.textContent,'🎉','late response cannot overwrite current cart');
doc.activeElement=closeButton;fire(5500);assert.equal(popup.hidden,false,'focused popup cannot disappear on timer');
widget.events.keydown({key:'Escape'});assert.equal(popup.hidden,true);assert.equal(doc.activeElement,toggle,'Escape restores focus');
callbacks.onItemDeleted();fire(180);requests[3].resolve({data:cart(100)});await tick();
assert.match(message.textContent,/250/);toggle.events.click();toggle.events.click();
assert.equal([...timers.values()].some(timer=>timer.ms===5500),false,'manual reopening cancels notice timeout');
callbacks.onItemUpdated();fire(180);requests[4].reject(new Error('offline'));await tick();
assert.match(message.textContent,/250/,'failed refresh preserves confirmed progress');
callbacks.onItemUpdated();fire(180);requests[5].resolve({data:{total:999}});await tick();
assert.match(message.textContent,/250/,'partial response preserves confirmed progress');
callbacks.onItemDeleted();fire(180);requests[6].resolve({data:cart(0)});await tick();
assert.equal(widget.hidden,false);assert.equal(progress.hidden,false);
assert.equal(icon.textContent,'🚚','removing items clears the celebration');
assert.equal(progress.attrs['aria-valuenow'],'0');
assert.equal(message.textContent,'Only 350 to 350');
widget.dataset.shippingNotify='false';doc.documentElement.dataset={};
vm.runInNewContext(source+'\ninitShippingGoal()',{...runtime});await tick();fire(180);requests[7].resolve({data:cart(0)});await tick();
popup.hidden=true;callbacks.onItemAdded();fire(180);requests[8].resolve({data:cart(350)});await tick();
assert.equal(popup.hidden,true,'merchant can disable automatic notices');assert.equal(message.textContent,'Delivery is free!');
widget.hidden=true;widget.dataset.shippingEnabled='false';doc.documentElement.dataset={};
vm.runInNewContext(source+'\ninitShippingGoal()',{...runtime});assert.equal(widget.hidden,true,'master toggle hides campaign');
console.log('PASS: editable copy, campaign/notification toggles, cart events, stale and failed requests, focus and popup timing.');

