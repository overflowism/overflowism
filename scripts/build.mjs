import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const path of [
  'index.html',
  'bloom.html',
  'bloom-walk.css',
  'bloom-walk.js',
  'immersive.css',
  'immersive.js',
  'atlas-data.js',
  'gallery-data.js',
  'images'
]) {
  await cp(path, `dist/${path}`, { recursive: true });
}
console.log('Built the Overflowism immersive emotional atlas in dist/');
