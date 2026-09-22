import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
for(const folder of ['src/assets/images/','public/images/']) {
 const files=fs.readdirSync(new URL(folder,root));
 assert.deepEqual(files,['placeholder.svg'],`${folder}: decorative artwork must live in merchant media settings`);
}
const config=JSON.parse(fs.readFileSync(new URL('twilight.json',root),'utf8'));
let count=0;
const walk=value=>{
 if(Array.isArray(value))return value.forEach(walk);
 if(!value||typeof value!=='object')return;
 if(value.format==='image'){count++;assert.equal(value.required,false);assert.equal(value.value,null);}
 Object.values(value).forEach(walk);
};walk(config);
for(const file of fs.readdirSync(new URL('src/views/components/home/',root)).filter(f=>f.endsWith('.twig'))){
 const text=fs.readFileSync(new URL('src/views/components/home/'+file,root),'utf8');
 assert.doesNotMatch(text,/images\/(?!placeholder\.svg)[^'"\s]+/,file+' contains bundled campaign media');
 assert.doesNotMatch(text,/https?:\/\/[^'"\s]+\.(?:webp|png|jpg|jpeg)/i,file+' contains a fixed external image');
}
console.log(`PASS: ${count} optional image fields, no bundled campaign art or fixed external image defaults.`);
