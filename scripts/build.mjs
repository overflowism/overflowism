import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const path of ['index.html', 'styles.css', 'gallery-data.js', 'app.js', 'images']) {
  await cp(path, `dist/${path}`, { recursive: true });
}
console.log('Built static gallery in dist/');
