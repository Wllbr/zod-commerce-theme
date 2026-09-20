import fs from 'node:fs';
import { gzipSync } from 'node:zlib';

const cssPath = new URL('../public/app.css', import.meta.url);
if (!fs.existsSync(cssPath)) {
  throw new Error('public/app.css is missing. Run the production build first.');
}

const css = fs.readFileSync(cssPath);
const compressed = gzipSync(css, { level: 9 });
// The gzip cap reflects storefront transfer cost; the raw cap leaves a small
// allowance for the bilingual product-card, persistent purchase dock, supported Salla offer layers, compact mobile cart, and footer policy grid while remaining intentionally tight.
const rawLimit = 392 * 1024;
const gzipLimit = 64 * 1024;

if (css.length > rawLimit || compressed.length > gzipLimit) {
  throw new Error(`CSS budget exceeded: ${css.length} bytes raw, ${compressed.length} bytes gzip.`);
}

console.log(`CSS budget OK: ${css.length} bytes raw, ${compressed.length} bytes gzip.`);

// The refinement layer has its own strict allowance; legacy CSS budget unchanged.
const refinement = fs.readFileSync(new URL('../public/refinement.css', import.meta.url));
const refinementGzip = gzipSync(refinement, { level: 9 });
if(refinement.length > 39 * 1024 || refinementGzip.length > 9 * 1024) throw new Error('Refinement CSS budget exceeded.');
if(compressed.length + refinementGzip.length > 73 * 1024) throw new Error('Combined transfer budget exceeded.');
console.log(`Refinement CSS: ${refinement.length} bytes raw, ${refinementGzip.length} bytes gzip. Combined: ${compressed.length + refinementGzip.length} bytes gzip.`);
