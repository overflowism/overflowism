import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';
import { resolve } from 'node:path';

function check(condition, message) { assert.ok(condition, message); }
function read(path) { return readFileSync(path, 'utf8'); }
for (const file of ['atlas-data.js','immersive.js','gallery-data.js','bloom-walk.js']) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
}
const context = { window: {} };
runInNewContext(read('atlas-data.js'), context, { filename: 'atlas-data.js' });
runInNewContext(read('gallery-data.js'), context, { filename: 'gallery-data.js' });
const atlas = context.window.OVERFLOW_ATLAS;
const gallery = context.window.galleryData;
check(atlas && gallery, 'Atlas and artwork data should load');
assert.equal(atlas.worlds.length, 5, 'Exactly five connected world groups');
assert.equal(atlas.rooms.length, 49, 'All 49 room concepts should be present');
assert.equal(new Set(atlas.worlds.map(w => w.id)).size, 5, 'World IDs are unique');
assert.equal(new Set(atlas.rooms.map(r => r.id)).size, 49, 'Room IDs are unique');
const worldIds = new Set(atlas.worlds.map(w => w.id));
const roomIds = new Set(atlas.rooms.map(r => r.id));
for (const room of atlas.rooms) {
  check(worldIds.has(room.world), 'Unknown world: ' + room.world);
  check(room.name && room.quote && room.feelings.length, 'Incomplete room: ' + room.id);
}
for (const [from, targets] of Object.entries(atlas.links)) {
  check(roomIds.has(from), 'Portal origin missing: ' + from);
  for (const target of targets) check(roomIds.has(target), 'Portal destination missing: ' + target);
}
assert.equal(atlas.firstChapter.length, 10, 'First chapter has ten highlight rooms');
for (const room of atlas.firstChapter) check(roomIds.has(room), 'Missing first-chapter room: ' + room);
for (const entry of atlas.pathways) check(roomIds.has(entry.room), 'Missing emotional entry: ' + entry.room);
check(gallery.artworks.some(a => a.title === 'Untitled' && a.placeholder === false),
  'Keep the original Untitled artwork');
for (const art of gallery.artworks) {
  check(existsSync(art.image), 'Missing artwork asset ' + art.image);
  check(art.alt, 'Missing alt text for ' + art.title);
}
const html = read('index.html');
for (const path of ['immersive.css','immersive.js','atlas-data.js','gallery-data.js']) {
  check(existsSync(path), 'Missing asset ' + path);
  check(html.includes(path), 'HTML does not load ' + path);
}
for (const page of ['entrance','atrium','world','room','atlas','about']) {
  check(html.includes('data-screen="' + page + '"'), 'Missing section ' + page);
}
for (const id of ['intro-title','entrance-choices','enter-choice','world-grid','world-hero',
  'world-label','world-title','world-line','world-symbol','world-count','room-grid',
  'installation','room-back','room-position','room-title','room-quote','room-emblem',
  'room-feelings','frame-image','frame-label','look-art','portal-links',
  'room-previous','room-next','atlas-search','atlas-filters','atlas-results',
  'atlas-count','motion-toggle','motion-label','art-dialog','dialog-close',
  'dialog-visual','art-dialog-title','dialog-description','dialog-details','dialog-inquire']) {
    check(html.includes('id="' + id + '"'), 'Missing DOM target: ' + id);
}
const bloom = read('bloom.html');
for (const key of ['garden','start-walk','examine-art','touch-pad','intro-veil','motion-toggle','landmark-panel']) {
  check(bloom.includes(key), 'Walk-through is missing interaction: ' + key);
}
for (const asset of ['bloom-walk.css','bloom-walk.js','gallery-data.js']) {
  check(bloom.includes(asset), 'Walk-through missing loaded script/style: ' + asset);
}
const bloomScript = read('bloom-walk.js');
check(bloomScript.includes('requestAnimationFrame(loop)'), 'Walk-through animation loop missing');
check(bloomScript.includes('drawPainting'), 'Walk-through original artwork render missing');
check(read('immersive.js').includes('bloom.html'), 'Main gallery is not linked to Bloom walk');
check(existsSync('dist/index.html'), 'Build output is missing; run npm run build first');
for (const file of ['index.html','immersive.css','immersive.js','atlas-data.js','gallery-data.js','bloom.html','bloom-walk.css','bloom-walk.js']) {
  check(existsSync(resolve('dist',file)), 'Build output missing ' + file);
}
check(readdirSync('dist/images').length > 0, 'Built image directory should not be empty');
console.log('✓ All 49 rooms, five worlds, emotional pathways and artwork references verified.');
console.log('✓ The interactive HTML and build outputs contain required assets and elements.');

console.log('✓ Bloom walkthrough, original artwork, keyboard/touch controls and routes verified.');
