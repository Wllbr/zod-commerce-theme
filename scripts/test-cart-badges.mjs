import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../src/assets/js/app.js',import.meta.url),'utf8');
const start=source.indexOf('  updateCartBadge('),end=source.indexOf('  recoverEmptyCartPage(',start);
const badges=[{},{}],links=[{classList:{toggle(){}}},{classList:{toggle(){}}}];
const ctx={document:{querySelectorAll:s=>s==='[data-zod-cart-count]'?badges:links}};
vm.runInNewContext('this.controller=({'+source.slice(start,end)+'}).updateCartBadge',ctx);
for(const count of [3,6,1,0,100]){
 ctx.controller(count);assert.equal(badges[0].textContent,count>99?'99+':String(count));
 assert.equal(badges[0].textContent,badges[1].textContent);assert.equal(badges[1].hidden,count===0);
}
console.log('PASS: header and mobile badges stay synchronized across additions, updates, removal and large quantities.');
