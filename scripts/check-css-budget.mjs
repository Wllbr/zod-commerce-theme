import fs from 'node:fs';
import { gzipSync } from 'node:zlib';

const cssPath = new URL('../public/app.css', import.meta.url);
if (!fs.existsSync(cssPath)) {
  throw new Error('public/app.css is missing. Run the production build first.');
}

const css = fs.readFileSync(cssPath);
const compressed = gzipSync(css, { level: 9 });
// The gzip cap reflects storefront transfer cost; the raw cap leaves a small
// allowance for responsive component rules while remaining intentionally tight.
const rawLimit = 328 * 1024;
const gzipLimit = 55 * 1024;

if (css.length > rawLimit || compressed.length > gzipLimit) {
  throw new Error(`CSS budget exceeded: ${css.length} bytes raw, ${compressed.length} bytes gzip.`);
}

console.log(`CSS budget OK: ${css.length} bytes raw, ${compressed.length} bytes gzip.`);
