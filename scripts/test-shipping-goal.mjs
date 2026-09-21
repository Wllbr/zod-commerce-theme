import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../src/assets/js/partials/shipping-goal.js',import.meta.url),'utf8').replaceAll('export const ','const ');
const context={};vm.runInNewContext(source+'\nthis.calculate=goalState',context);const calc=context.calculate;
assert.equal(calc({sub_total:200,discount:0}).remaining,150);
assert.equal(calc({sub_total:350,discount:0}).complete,true,'inclusive 350 threshold');
assert.equal(calc({sub_total:375,discount:50}).remaining,25,'discount reduces eligible spend');
assert.equal(calc({sub_total:100,discount:0,total:400}).complete,false,'delivery fees and taxes never fill the goal');
assert.equal(calc({sub_total:0,discount:0}).percent,0,'empty cart');
assert.equal(calc({sub_total:900,discount:0}).percent,100,'clamped over threshold');
assert.equal(calc({total:900}),null,'unknown subtotal is not fabricated');
assert.equal(calc({sub_total:null,discount:0}),null);
assert.equal(calc({sub_total:500}),null,'unknown discount cannot claim free shipping');
assert.equal(calc({sub_total:500,discount:0,free_shipping_bar:{minimum_amount:350,remaining:25}}).remaining,25,'native eligibility wins');
assert.equal(calc({sub_total:350,discount:0,free_shipping_bar:{minimum_amount:500,remaining:150}}).complete,true,'separate configured 350 campaign target');
assert.equal(calc({sub_total:349.99,discount:0}).complete,false);
console.log('PASS: shipping target boundary, discounted spend, fee exclusion, native eligibility, unknown states and progress clamping.');

// Exercise actual event handlers, deferred responses and popup focus behavior.
const node = () => ({events:{},attrs:{},hidden:true,textContent:'',
  addEventListener(name,fn){this.events[name]=fn},
  setAttribute(name,value){this.attrs[name]=value},focus(){doc.activeElement=this}});
const toggle=node(),popup=node(),closeButton=node(),live=node(),message=node(),progress=node(),icon=node();
popup.contains=element=>element===closeButton;
const widget={...node(),dataset:{threshold:'350'},style:{setProperty(){}},classList:{toggle(){},remove(){},add(){}},
  querySelector:selector=>({'[data-shipping-toggle]':toggle,'[data-shipping-popup]':popup,'[data-shipping-close]':closeButton,'[data-shipping-live]':live}[selector]),
  querySelectorAll:selector=>({'[data-shipping-message]':[message],'[data-shipping-progress]':[progress],'[data-shipping-icon]':[icon]}[selector])};
const doc={documentElement:{lang:'en'},activeElement:null,events:{},querySelector:()=>widget,querySelectorAll:()=>[widget],addEventListener(name,fn){this.events[name]=fn}};
const callbacks={},requests=[],timers=new Map();let serial=0;
const event=Object.fromEntries(['onItemAdded','onItemUpdated','onItemDeleted','onCouponAdded','onCouponDeleted'].map(name=>[name,fn=>callbacks[name]=fn]));
const runtime={document:doc,Intl,window:{matchMedia:()=>({matches:false}),salla:{onReady:()=>Promise.resolve(),cart:{event,details:()=>new Promise((resolve,reject)=>requests.push({resolve,reject}))}}},
  setTimeout:(fn,ms)=>{timers.set(++serial,{fn,ms});return serial},clearTimeout:id=>timers.delete(id)};
const tick=async()=>{await Promise.resolve();await Promise.resolve()};
const fire=ms=>{const entry=[...timers].find(([,value])=>value.ms===ms);assert(entry,`expected ${ms}ms timer`);timers.delete(entry[0]);entry[1].fn()};
vm.runInNewContext(source+'\ninitShippingGoal()',runtime);
await tick();fire(180);requests[0].resolve({data:{sub_total:200,discount:0}});await tick();
assert.equal(widget.hidden,false);assert.match(message.textContent,/150/);
callbacks.onItemAdded();fire(180);callbacks.onCouponAdded();fire(180);
requests[2].resolve({data:{cart:{sub_total:350,discount:0}}});await tick();
assert.equal(icon.textContent,'🎉');assert.equal(popup.hidden,false);
requests[1].resolve({data:{sub_total:210,discount:0}});await tick();
assert.equal(icon.textContent,'🎉','late response cannot overwrite current cart');
doc.activeElement=closeButton;fire(5500);assert.equal(popup.hidden,false,'focused popup cannot disappear on timer');
widget.events.keydown({key:'Escape'});assert.equal(popup.hidden,true);assert.equal(doc.activeElement,toggle,'Escape restores focus');
callbacks.onItemDeleted();fire(180);requests[3].resolve({data:{sub_total:100,discount:0}});await tick();
assert.match(message.textContent,/250/);toggle.events.click();toggle.events.click();
assert.equal([...timers.values()].some(timer=>timer.ms===5500),false,'manual reopening cancels notice timeout');
callbacks.onItemUpdated();fire(180);requests[4].reject(new Error('offline'));await tick();
assert.match(message.textContent,/250/,'failed refresh preserves confirmed progress');
console.log('PASS: shipping event refresh, stale response rejection, failed refresh, keyboard focus and manual popup timing.');
