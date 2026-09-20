/** Shared release provenance. Hashes are evidence of consistency, not Salla approval. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const read = file => fs.readFileSync(path.join(root, file));
export const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
export function walk(dir) {
  return fs.readdirSync(path.join(root, dir), {withFileTypes:true}).flatMap(entry => entry.isDirectory() ? walk(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`]).sort();
}
export function inputFiles() {
  return ['package.json','twilight.json','webpack.config.js','tailwind.config.js','postcss.config.js','pnpm-lock.yaml','pnpm-workspace.yaml','.npmrc', ...walk('src'), ...walk('scripts').filter(p=>p.endsWith('.mjs') || p.endsWith('.ps1') || p.endsWith('SNAPSHOT_BASELINE.json'))].sort();
}
export function recordManifest(builder, modes = {}) {
  const inputs = Object.fromEntries(inputFiles().map(file => [file, sha256(read(file))]));
  const files = Object.fromEntries(walk('public').map(file => [file, {sha256:sha256(read(file)), mode:modes[file] || (builder === 'webpack-production' ? 'webpack-production-output' : 'copied-static-asset')}]));
  const manifest = { version:JSON.parse(read('package.json')).version, builder, toolchain: { node:process.version, platform:process.platform }, inputs, files };
  fs.writeFileSync(path.join(root,'BUILD_MANIFEST.json'), JSON.stringify(manifest,null,2)+'\n');
  return manifest;
}
