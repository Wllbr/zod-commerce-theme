import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const code=fs.readFileSync(new URL('../src/assets/js/partials/campaign.js',import.meta.url),'utf8').replaceAll('export const ','const ');
const element=()=>({dataset:{},attrs:{},events:{},hidden:false,isConnected:true,addEventListener(n,f){this.events[n]=f},setAttribute(n,v){this.attrs[n]=v},querySelector(){return {textContent:''}},contains(){return false}});
function fixture(reduced=false,controls=true){
 const slides=[element(),element(),element()],dots=[element(),element(),element()],toggle=element(),viewport=element(),prev=element(),next=element(),section=element();section.dataset={autoplay:'true',play:'Play',pause:'Pause'};
 section.querySelectorAll=s=>s.includes('slide')?slides:controls?dots:[];section.querySelector=s=>({'[data-campaign-pause]':controls?toggle:null,'[data-campaign-viewport]':viewport,'[data-campaign-next]':controls?next:null,'[data-campaign-prev]':controls?prev:null}[s]);
 const timers=new Map();let serial=0;const doc={hidden:false,documentElement:{dir:'rtl'},events:{},addEventListener(n,f){this.events[n]=f}};
 const context={document:doc,window:{matchMedia:()=>({matches:reduced,addEventListener(){}})},clearTimeout:n=>timers.delete(n),setTimeout:f=>{timers.set(++serial,f);return serial}};
 vm.runInNewContext(code+'\nthis.init=initCampaign;this.brand=initBrandWorld;',context);context.init(section);
 return{slides,dots,toggle,prev,next,section,viewport,timers,doc,context};
}
let f=fixture();assert.equal(f.timers.size,1);assert.deepEqual(f.slides.map(s=>s.hidden),[false,true,true]);
f.section.events.focusin();assert.equal(f.timers.size,0,'keyboard focus stops rotation');f.section.events.focusout({relatedTarget:null});assert.equal(f.timers.size,1);
f.next.events.click();assert.deepEqual(f.slides.map(s=>s.hidden),[true,false,true]);assert.equal(f.timers.size,0,'manual navigation pauses rotation');
f.prev.events.click();assert.equal(f.dots[0].attrs['aria-pressed'],'true');
f.toggle.events.click();assert.equal(f.timers.size,1);f.doc.hidden=true;f.doc.events.visibilitychange();assert.equal(f.timers.size,0);
f=fixture(true);assert.equal(f.timers.size,0,'reduced motion disables autoplay');f.next.events.click();assert.equal(f.slides[1].hidden,false,'manual controls still work');
f=fixture();f.viewport.events.touchstart({changedTouches:[{clientX:30,clientY:30}]});f.viewport.events.touchend({changedTouches:[{clientX:150,clientY:35}]});assert.equal(f.slides[1].hidden,false,'RTL swipe advances');
const tabs=[element(),element()],panels=[element(),element()];let mounts=0;panels[0].querySelector=()=>null;panels[1].querySelector=()=>mounts?null:{content:{cloneNode:()=>({})},replaceWith(){mounts++}};tabs.forEach(t=>t.focus=()=>{});const section=element();section.querySelectorAll=s=>s.includes('tab')?tabs:panels;f.context.brand(section);tabs[0].events.keydown({key:'ArrowLeft',preventDefault(){}});assert.equal(tabs[1].attrs['aria-selected'],'true');assert.equal(mounts,1);tabs[1].events.click();assert.equal(mounts,1,'inactive product collections mount once');
console.log('PASS: campaign keyboard-focus pause, manual navigation, reduced motion, background pause, RTL swipe and lazy brand tabs.');

f=fixture(false,false);assert.equal(f.timers.size,1,'hero works without visible controls');
f.viewport.events.keydown({key:'ArrowLeft',preventDefault(){}});assert.equal(f.slides[1].hidden,false,'RTL keyboard navigation works without buttons');assert.equal(f.timers.size,0);
f.viewport.events.keydown({key:'End',preventDefault(){}});assert.equal(f.slides[2].hidden,false);
f=fixture(false,false);f.viewport.events.keydown({key:'Escape'});assert.equal(f.timers.size,0,'Escape stops autoplay');
console.log('PASS: hero without buttons/dots retains keyboard navigation and pause.');

// Native animation frames must travel in the requested physical direction,
// and cancellation must never leave an older slide visible over a new one.
for (const dir of ['rtl','ltr']) {
 f=fixture(false,false);f.doc.documentElement.dir=dir;
 const calls=[];
 f.slides.forEach(slide=>slide.animate=(frames,options)=>{
   const animation={frames,options,cancelled:false,onfinish:null,cancel(){this.cancelled=true}};
   calls.push(animation);return animation;
 });
 const tick=()=>[...f.timers.values()][0]();tick();
 assert.equal(calls[1].frames[0].transform,`translateX(${dir==='rtl'?-100:100}%)`);
 assert.equal(f.slides[0].inert,true,'outgoing slide cannot receive focus');
 const older=calls[0];tick();
 assert.equal(older.cancelled,true);assert.equal(older.onfinish,null,'stale completion is detached');
 assert.equal(f.slides[0].hidden,true);
 calls.at(-2).onfinish();assert.equal(f.slides[1].hidden,true);
 tick();assert.equal(f.slides[0].inert,false,'wraparound activates first slide');
 assert.equal(calls.at(-1).frames[0].transform,`translateX(${dir==='rtl'?-100:100}%)`,'wrap continues in the same direction');
}
console.log('PASS: Arabic/English animation direction, rapid transitions, inert outgoing slides and seamless wrap direction.');
for (const dir of ['rtl','ltr']) {
 f=fixture(); f.doc.documentElement.dir=dir;
 const down={pointerType:'mouse',button:0,pointerId:1,clientX:150,clientY:30,target:{closest:()=>null},preventDefault(){}};
 f.viewport.events.pointerdown(down);
 f.viewport.events.pointerup({pointerId:1,clientX:dir==='rtl'?250:50,clientY:35});
 assert.equal(f.slides[1].hidden,false,'desktop drag advances in locale direction');
 assert.equal(f.timers.size,0,'drag pauses autoplay');
 f.dots[2].events.click(); assert.equal(f.slides[2].hidden,false,'label selector opens chosen campaign');
 f.viewport.events.pointerdown({...down,target:{closest:()=>({})}});
 f.viewport.events.pointerup({pointerId:1,clientX:350,clientY:30});
 assert.equal(f.slides[2].hidden,false,'CTA clicks do not start a drag');
 f.viewport.events.pointerdown(down); f.viewport.events.pointercancel();
 f.viewport.events.pointerup({pointerId:1,clientX:350,clientY:30});
 assert.equal(f.slides[2].hidden,false,'cancelled drag does not navigate');
}
console.log('PASS: desktop drag in both directions, selector navigation and CTA/cancelled-drag protection.');
