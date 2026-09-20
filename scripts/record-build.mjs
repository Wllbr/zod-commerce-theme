import {recordManifest} from './build-manifest.mjs';
if (process.argv[2] !== 'production') throw new Error('Use this recorder after a successful Webpack production build.');
const manifest = recordManifest('webpack-production');
console.log(`Production manifest: ${Object.keys(manifest.inputs).length} inputs, ${Object.keys(manifest.files).length} outputs.`);
