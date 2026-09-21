import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
class Node {
  constructor(){this.children=[];this.dataset={};this.events={};this.className='';this.classList={contains:name=>this.className.split(' ').includes(name),add:name=>this.className+=' '+name};}
  append(...nodes){for(const node of nodes){node.parent=this;this.children.push(node)}}
  appendChild(node){this.append(node)}
  remove(){if(this.parent)this.parent.children=this.parent.children.filter(node=>node!==this)}
  setAttribute(){}
  addEventListener(name,fn){this.events[name]=fn}
  contains(node){return this.children.includes(node)}
  get firstElementChild(){return this.children[0]}
  querySelectorAll(){return this.children.filter(node=>!node.classList.contains('is-error'))}
}
const body=new Node(),timers=new Map();let serial=0;
const doc={body,documentElement:{lang:'ar'},getElementById:id=>body.children.find(node=>node.id===id),createElement:()=>new Node()};
const context={document:doc,DOMParser:class{parseFromString(text){return {body:{textContent:text.replace(/<[^>]*>/g,'')}}}},setTimeout:(fn,ms)=>{timers.set(++serial,{fn,ms});return serial},clearTimeout:id=>timers.delete(id)};
const source=fs.readFileSync(new URL('../src/assets/js/partials/notifications.js',import.meta.url),'utf8').replaceAll('export const','const');
const storage=new Map();let now=100;
Object.assign(context,{location:{pathname:'/cart'},Date:{now:()=>now},sessionStorage:{setItem:(k,v)=>storage.set(k,v),getItem:k=>storage.get(k),removeItem:k=>storage.delete(k)}});
vm.runInNewContext(source+'\nthis.show=showNotification;this.remember=rememberCartRemoval;this.consume=consumeCartRemoval;',context);
context.remember();assert(context.consume(),'last removal survives empty-cart reload');assert(!context.consume(),'flash is consumed once');
context.remember();now+=10001;assert(!context.consume(),'expired removal is not announced');
context.remember();context.location.pathname='/product';assert(!context.consume(),'another page cannot announce cart removal');context.location.pathname='/cart';
const fire=ms=>{const entry=[...timers].find(([,timer])=>timer.ms===ms);assert(entry);timers.delete(entry[0]);entry[1].fn()};
context.show('Not Found!','error');context.show('Not Found!','error');context.show('Not Found!','error');
const region=body.children[0];assert.equal(region.children.length,1,'repeated errors collapse');
fire(6500);fire(350);assert.equal(region.children.length,0,'errors expire without manual close');
context.show('Cart updated','success');context.show('Item removed','success');assert.equal(region.children.length,1,'latest cart notice replaces the previous success');
const notice=region.children[0];notice.events.focusin();assert.equal([...timers.values()].filter(t=>t.ms===3500).length,1,'removed notice timeout is harmless; focused current notice is paused');
notice.events.focusout({relatedTarget:null});assert([...timers.values()].some(t=>t.ms===3500));
notice.children[2].events.click();fire(350);assert.equal(region.children.length,0,'close is available for success messages');
for(let i=0;i<4;i++)context.show('Error '+i,'error');assert.equal(region.children.length,3,'distinct errors have a bounded stack');
console.log('PASS: errors expire, duplicate errors collapse, success messages replace, focus pauses dismissal, close works and stack stays bounded.');
