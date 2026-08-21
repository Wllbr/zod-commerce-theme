import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures=[];
const assert=(cond,msg)=>{if(!cond) failures.push(msg)};
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const walk=(dir,exts=[])=>{
  const out=[]; const abs=path.join(root,dir); if(!fs.existsSync(abs)) return out;
  for(const item of fs.readdirSync(abs,{withFileTypes:true})){
    const rel=path.join(dir,item.name);
    if(item.isDirectory()) out.push(...walk(rel,exts));
    else if(!exts.length||exts.some(e=>item.name.endsWith(e))) out.push(rel);
  }
  return out;
};

const jsonFiles=['package.json','twilight.json','src/locales/ar.json','src/locales/en.json'];
for(const f of jsonFiles){
  try{JSON.parse(read(f));}catch(e){failures.push(`${f}: invalid JSON (${e.message})`);}
}

const pkg=JSON.parse(read('package.json'));
const config=JSON.parse(read('twilight.json'));
assert(pkg.name==='zod-commerce-theme','package.json: unexpected project name');
assert(pkg.version==='1.6.26','package.json: expected v1.6.26');
assert(pkg.packageManager?.startsWith('pnpm@') || !pkg.packageManager,'package.json: invalid packageManager');
assert(config.name?.ar&&config.name?.en,'twilight.json: bilingual name required');
assert(config.name?.ar==='زود للتجارة','twilight.json: Arabic theme name is incorrect');
assert(Array.isArray(config.components)&&config.components.length>=8,'twilight.json: expected commerce components');

const componentPaths=new Set();
const componentKeys=new Set();
for(const c of config.components||[]){
  assert(c.path && !componentPaths.has(c.path),`twilight.json: duplicate component path ${c.path}`);
  componentPaths.add(c.path);
  assert(c.key && !componentKeys.has(c.key),`twilight.json: duplicate/missing component key ${c.key||c.path}`);
  componentKeys.add(c.key);
  const f=`src/views/components/${String(c.path).replaceAll('.','/')}.twig`;
  assert(fs.existsSync(path.join(root,f)),`Missing component template: ${f}`);
  if(c.is_default){
    for(const field of c.fields||[]){
      const value=field.value;
      const empty=value===null || value===undefined || value==='' || (Array.isArray(value)&&value.length===0);
      assert(!(field.required && empty),`Default component ${c.path} has required empty field ${field.id}`);
    }
  }
}

const settingIds=new Set();
for(const setting of config.settings||[]){
  if(!setting.id) continue;
  assert(!settingIds.has(setting.id),`twilight.json: duplicate setting id ${setting.id}`);
  settingIds.add(setting.id);
}

// Business/store data must come from Salla, not duplicate theme settings.
for(const forbidden of ['show_announcement_bar','announcement_text','store_name','store_logo','store_phone','store_email','store_whatsapp','tax_number','vat_number','currency','language']){
  assert(!settingIds.has(forbidden),`twilight.json: ${forbidden} duplicates a Salla dashboard/store setting`);
}
assert(!componentPaths.has('home.trust-strip'),'twilight.json: custom trust strip duplicates Salla Store Features; use component-store-features');
assert((config.features||[]).includes('component-store-features'),'twilight.json: Salla Store Features support must remain enabled');

const ar=JSON.parse(read('src/locales/ar.json'));
const en=JSON.parse(read('src/locales/en.json'));
const flatten=(o,p='')=>Object.entries(o).flatMap(([k,v])=>v&&typeof v==='object'&&!Array.isArray(v)?flatten(v,p?`${p}.${k}`:k):[p?`${p}.${k}`:k]);
const ak=new Set(flatten(ar)), ek=new Set(flatten(en));
for(const k of ak) assert(ek.has(k),`English locale missing ${k}`);
for(const k of ek) assert(ak.has(k),`Arabic locale missing ${k}`);

const twig=walk('src/views',['.twig']);
let transRefs=0;
const arabic=/[\u0600-\u06FF]/;
for(const f of twig){
  const s=read(f);
  const opens=(s.match(/{%/g)||[]).length, closes=(s.match(/%}/g)||[]).length;
  const vo=(s.match(/{{/g)||[]).length, vc=(s.match(/}}/g)||[]).length;
  assert(opens===closes,`${f}: Twig statement delimiters unbalanced`);
  assert(vo===vc,`${f}: Twig output delimiters unbalanced`);
  assert(!/{%\s*(?:import|from)\b/.test(s),`${f}: Twig import/from is disabled by Salla's production renderer`);
  assert(!arabic.test(s),`${f}: hard-coded Arabic found; use locales/multilanguage data instead`);
  for(const m of s.matchAll(/trans\(['"](zod\.[^'"]+)['"]\)/g)){
    transRefs++;
    assert(ek.has(m[1]),`${f}: missing translation ${m[1]}`);
  }
}

const requiredTemplates=[
  'src/views/layouts/master.twig','src/views/layouts/customer.twig',
  'src/views/components/header/header.twig','src/views/components/footer/footer.twig',
  'src/views/pages/index.twig','src/views/pages/product/single.twig','src/views/pages/product/index.twig',
  'src/views/pages/cart.twig','src/views/pages/brands/index.twig','src/views/pages/brands/single.twig',
  'src/views/pages/blog/index.twig','src/views/pages/blog/single.twig','src/views/pages/testimonials.twig',
  'src/views/pages/customer/profile.twig','src/views/pages/customer/wishlist.twig',
  'src/views/pages/customer/orders/index.twig','src/views/pages/customer/orders/single.twig'
];
for(const f of requiredTemplates) assert(fs.existsSync(path.join(root,f)),`Required storefront template missing: ${f}`);

const single=read('src/views/pages/product/single.twig');
const cartTwig=read('src/views/pages/cart.twig');
const productSwitcher=read('src/views/components/home/product-type-switcher.twig');
const productSwitcherConfig=(config.components||[]).find(component=>component.path==='home.product-type-switcher');
assert(productSwitcherConfig?.fields?.some(field=>field.id==='groups'),'Product type switcher must preserve the existing groups collection');
assert(productSwitcher.includes("component['groups']"),'Product type switcher must use explicit bracket access for the groups field');
assert(!productSwitcher.includes('component.groups'),'Product type switcher must not use ambiguous dot access for the groups field');
assert(cartTwig.includes('data-zod-cart-grand-total'),'Cart must expose the grand total for mobile and desktop');
assert(cartTwig.includes('cart.total|money'),'Cart must render Salla cart.total');
assert(cartTwig.includes('store-cart-checkout-mobile'),'Cart must keep a mobile checkout action');

assert(single.includes('<salla-reviews-summary item-id="{{ product.id }}">'), 'product page: Salla reviews summary is required');
assert(single.includes('<salla-payments>'), 'product page: Salla-native payment methods are required');
assert(single.includes("show_product_reviews_summary"), 'product page: review summary setting is required');

const headerTwig=read('src/views/components/header/header.twig');
const footerTwig=read('src/views/components/footer/footer.twig');
assert(headerTwig.includes('<salla-advertisement'),'Header must use Salla native advertisement bar');
assert(headerTwig.includes('store.settings.is_multilingual'),'Header must respect Salla multilingual setting');
assert(headerTwig.includes('<salla-localization-modal'),'Header must use Salla localization component');
for(const token of ['store.logo','store.name','<salla-search','<salla-user-menu','<salla-cart-summary']) assert(headerTwig.includes(token),`Header missing native Salla source: ${token}`);
for(const token of ['store.description','<salla-menu','store.contacts','<salla-social','<salla-trust-badges','store.settings.tax.number','<salla-payments']) assert(footerTwig.includes(token),`Footer missing native Salla source: ${token}`);
assert(headerTwig.includes('zod-search-overlay'),'Header must include the ZOD fluid search overlay');
assert(headerTwig.includes('zod-catalog-drawer'),'Header must include the universal catalog drawer');
assert(!footerTwig.toLowerCase().includes('newsletter'),'Footer must not include a newsletter section');

const appCss=read('src/assets/styles/app.scss');
for(const selector of ['.zod-header','.zod-hero','.zod-product-card','.zod-product-main','.zod-catalog-layout','.zod-footer','.zod-mobile-dock','.zod-option-support']){
  assert(appCss.includes(selector),`app.scss missing ${selector}`);
}
assert(/@media\(max-width:767px\)[\s\S]*?\.zod-header-cart-wrap\{display:none!important\}/.test(appCss),'Mobile must use the bottom dock as its single cart entry');

const jsFiles=walk('src/assets/js',['.js']);
for(const f of jsFiles){
  const result=spawnSync(process.execPath,['--check',path.join(root,f)],{encoding:'utf8'});
  assert(result.status===0,`${f}: JavaScript syntax error ${result.stderr?.trim()||''}`);
}

const approval=read('pnpm-workspace.yaml');
for(const dep of ['@parcel/watcher','bufferutil','es5-ext','utf-8-validate']){
  assert(approval.includes(dep),`pnpm-workspace.yaml missing build approval for ${dep}`);
}
assert(!/set this to true or false/i.test(approval),'pnpm-workspace.yaml contains unfinished approval placeholders');

const projectText=[...twig,...jsFiles,'README.md','CHANGELOG.md','twilight.json'].map(read).join('\n').toLowerCase();
for(const oldTerm of ['zod-twilight-theme','professional v1.1','commerce edition v1.3','neon gaming']){
  assert(!projectText.includes(oldTerm),`Old theme reference found: ${oldTerm}`);
}

if(failures.length){
  console.error(`\nTheme validation failed (${failures.length} issue${failures.length===1?'':'s'}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`✓ ZOD Commerce validation passed: ${twig.length} Twig templates, ${config.components.length} custom components, ${transRefs} ZOD translation references, ${jsFiles.length} JavaScript files.`);
