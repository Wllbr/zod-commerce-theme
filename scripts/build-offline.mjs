/** Dependency-free incremental bundler for this release snapshot.
 * Only local ES module imports/exports are supported. It deliberately fails on
 * unsupported imports instead of silently shipping broken output. The original
 * compiled app.css/product.js and their dependency bundles are retained.
 * For a complete supported toolchain build: pnpm install --frozen-lockfile;
 * pnpm production. That is separate from this deterministic offline build.
 */
import fs from 'node:fs';
import path from 'node:path';
import { recordManifest } from './build-manifest.mjs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const output = (p, value) => fs.writeFileSync(path.join(root, p), value);
const hash = text => crypto.createHash('sha256').update(text).digest('hex');
const version = JSON.parse(read('package.json')).version;
const manifest = { files: {} };
const baseline = JSON.parse(read('scripts/SNAPSHOT_BASELINE.json'));
for (const [file, expected] of Object.entries(baseline.files)) {
  if (hash(fs.readFileSync(path.join(root,file))) !== expected) throw new Error(`Snapshot input changed: ${file}. Run the full production build; offline rebuilding cannot validate it.`);
}
const pkg = JSON.parse(read('package.json'));
const sortObject = value => value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key=>[key,sortObject(value[key])])) : value;
if (hash(JSON.stringify(sortObject({dependencies:pkg.dependencies,devDependencies:pkg.devDependencies}))) !== baseline.dependencies) throw new Error('Dependency versions changed. A complete production build is required.');
function bundle(entry) {
  const modules = new Map();
  function visit(filename) {
    filename = filename.replaceAll('\\', '/');
    if (modules.has(filename)) return;
    modules.set(filename, '');
    let text = read(filename);
    text = text.replace(/^import\s+(?:(\{[^\n]+\})\s+from\s+)?['"]([^'"]+)['"];?\s*$/gm, (_, names, request) => {
      if (!request.startsWith('.')) throw new Error(`Unsupported external import: ${request}`);
      let dependency = path.posix.normalize(path.posix.join(path.posix.dirname(filename), request));
      if (!dependency.endsWith('.js')) dependency += '.js';
      visit(dependency);
      return names ? `const ${names} = require(${JSON.stringify(dependency)});` : `require(${JSON.stringify(dependency)});`;
    });
    const exports = [];
    text = text.replace(/^export\s+(const|let|function|class)\s+(\w+)/gm, (_, type, name) => {
      exports.push(name); return `${type} ${name}`;
    });
    if (/^\s*(?:import\s|export\s)/m.test(text)) throw new Error(`Unsupported module syntax in ${filename}`);
    modules.set(filename, text + '\n' + exports.map(name => `exports.${name} = ${name};`).join('\n'));
  }
  visit(entry);
  const table = [...modules].map(([id, body]) => `${JSON.stringify(id)}:function(module,exports,require){\n${body}\n}`).join(',\n');
  return `/* ZOD ${version}: generated from source by scripts/build-offline.mjs */\n(()=>{\n'use strict';\nconst modules={\n${table}\n};\nconst cache=Object.create(null);\nfunction require(id){if(cache[id])return cache[id].exports;if(!modules[id])throw new Error('Missing module '+id);const m=cache[id]={exports:{}};modules[id](m,m.exports,require);return m.exports;}\nrequire(${JSON.stringify(entry)});\n})();\n`;
}
for (const [name, source] of Object.entries({ app:'app', 'zod-menu':'partials/zod-menu', products:'products', pages:'pages' })) {
  const file=`public/${name}.js`; const data=bundle(`src/assets/js/${source}.js`); output(file,data);
  manifest.files[file]={sha256:hash(data),mode:'local-esm-bundle'};
}
// Reuse the exact already-supplied lite-youtube implementation; do not fetch a
// new version. It executes only when a lite-youtube element exists on the page.
const home=read('src/assets/js/home.js');
const vendor=read('public/675.d18f08966778e4fd7975.js');
const match=vendor.match(/\{675\(\)\{([\s\S]*)\}\}\]\);\s*$/);
if(!match) throw new Error('Original lite-youtube snapshot not found; run pnpm production instead.');
const homeOutput=home.replace("import('lite-youtube-embed/src/lite-yt-embed.js')", `Promise.resolve().then(() => { if (!customElements.get('lite-youtube')) { ${match[1]} } })`);
if (/^\s*(?:import\s|export\s)/m.test(homeOutput) || /\bimport\s*\(/.test(homeOutput)) throw new Error('Home entry gained unsupported imports. Run the full production build.');
output('public/home.js', `/* ZOD ${version} offline entry; unchanged lite-youtube snapshot embedded. */\n(()=>{\n${homeOutput}\n})();\n`);
manifest.files['public/home.js']={sha256:hash(read('public/home.js')),mode:'source-plus-original-vendor'};
for(const [name,source] of Object.entries({'legacy-product-card':'legacy-product-card','add-product-toast':'partials/add-product-toast','product-purchase-v1726':'product-purchase-v1726','product-runtime-compat':'product-runtime-compat','digital-files':'partials/digital-files'})){
  const file=`public/${name}.js`,data=read(`src/assets/js/${source}.js`);
  if (/^\s*(?:import\s|export\s)/m.test(data) || /\bimport\s*\(/.test(data)) throw new Error(`Standalone entry ${source} gained module syntax. Run the full production build.`);
  output(file,data);manifest.files[file]={sha256:hash(data),mode:'copy-no-imports'};
}
const css=read('src/assets/styles/refinement.css');output('public/refinement.css',css);manifest.files['public/refinement.css']={sha256:hash(css),mode:'plain-css'};
// Record unchanged compiled payloads as retained, not newly rebuilt.
for(const file of ['app.css','product.js','675.d18f08966778e4fd7975.js']){
 const filename=`public/${file}`;manifest.files[filename]={sha256:hash(read(filename)),mode:'retained-original-compiled-asset'};
}
recordManifest('offline-local-esm-snapshot', Object.fromEntries(Object.entries(manifest.files).map(([file,details])=>[file,details.mode])));
console.log('Offline release bundles refreshed; snapshot prerequisites verified. Full production toolchain NOT executed.');
