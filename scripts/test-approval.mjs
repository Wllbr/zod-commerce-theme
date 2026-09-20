import fs from 'node:fs';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const master=read('src/views/layouts/master.twig'),order=read('src/views/pages/customer/orders/single.twig');
assert.match(master,/<salla-add-product-toast\b/);
assert.match(master,/add-product-toast\.js/);
assert.match(order,/<salla-review-order-item product-id="\{\{ item\.product\.id \}\}"/);
assert.doesNotMatch(order,/<salla-order-details\b[^>]*\border-id=/);
assert.match(order,/<salla-order-details order-details="\{\{ item\|json_encode \}\}"/);
const card=read('src/assets/js/partials/product-card.js');
const calls=[...card.matchAll(/salla\.product\.getDetails\(/g)];
assert.equal(calls.length,1,'exactly one detail request remains in the card controller');
const quickStart=card.indexOf('async openQuickView('), renderStart=card.indexOf('\n  render()',quickStart);
assert(quickStart>=0 && calls[0].index>quickStart && calls[0].index<renderStart,'details call must be inside explicit Quick View');
assert.doesNotMatch(card,/loadMediaImages\s*\(/);
for(const file of ['src/assets/js/app.js','src/assets/js/home.js','src/assets/js/legacy-product-card.js','public/home.js','public/legacy-product-card.js']){
 assert.doesNotMatch(read(file),/\.getDetails\s*\(/,file+' must not enrich listings with extra detail requests');
}
assert(!fs.existsSync(path.join(root,'public/product-card-marketplace.js')));
const toast=read('src/assets/js/partials/add-product-toast.js');
assert.match(toast,/salla\.event\.on\('Product Added'/);
assert.match(toast,/cart\.api\.details\(null, \['options'\]\)/);
assert.match(toast,/token === this\.request/);
assert.match(toast,/this\.hovered \|\| this\.focused/);
assert.doesNotMatch(toast,/\.getDetails\s*\(/);
if(JSON.parse(read('BUILD_MANIFEST.json')).builder !== 'webpack-production') assert.equal(toast,read('public/add-product-toast.js'));
// Production output is transpiled/minified; hash integrity is verified separately.
assert.equal(read('src/assets/styles/refinement.css'),read('public/refinement.css'));
assert.match(master,/zod-skip-link/);
assert.doesNotMatch(read('src/views/pages/page-single.twig'),/<main\b/,'no nested main landmark');
const laser=read('src/views/components/home/laser-showcase.twig');
assert.match(laser,/data-zod-laser-products-template/);
assert.match(laser,/<salla-products-list source="selected"/);
assert.match(laser,/position\|default\(0\)/,'multiple laser components get unique IDs');
const config=JSON.parse(read('twilight.json'));
assert.equal(config.components.filter(c=>c.path==='home.hero-hub').length,1);
const hero=read('src/views/components/home/hero-hub.twig');
assert.match(hero,/category\.url\|default\(null\)/);
assert.doesNotMatch(hero,/href="#"/);
for(const lang of ['en','ar']){
 const locale=JSON.parse(read(`src/locales/${lang}.json`)).zod;
 for(const slot of ['exhaust','intercom','insect'])for(const suffix of ['title','text','tag'])assert(locale.hub[`${slot}_${suffix}`]);
}
for(const filename of fs.readdirSync(path.join(root,'public')).filter(f=>f.endsWith('.js'))){
 const result=spawnSync(process.execPath,['--check',path.join(root,'public',filename)],{encoding:'utf8'});
 assert.equal(result.status,0,`Packaged script parse failed: ${filename}: ${result.stderr}`);
}
console.log('PASS: 1.8 approval guards, list-only card data, native toast/reviews, lazy laser panels, locale keys and packaged JavaScript syntax.');
