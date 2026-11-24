import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';
import { resolve } from 'node:path';

function check(condition, message) { assert.ok(condition, message); }
function read(path) { return readFileSync(path, 'utf8'); }
for (const file of ['atlas-data.js','immersive.js','gallery-data.js','bloom-walk.js','spiral-data.js','spiral.js']) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
}
const context = { window: {} };
runInNewContext(read('atlas-data.js'), context, { filename: 'atlas-data.js' });
runInNewContext(read('gallery-data.js'), context, { filename: 'gallery-data.js' });
const atlas = context.window.OVERFLOW_ATLAS;
const gallery = context.window.galleryData;
check(atlas && gallery, 'Atlas and artwork data should load');
assert.equal(atlas.worlds.length, 6, 'Five official worlds plus The Undercurrent');
assert.equal(atlas.rooms.length, 54, 'Original 49 rooms and five Spiral rooms should be present');
assert.equal(new Set(atlas.worlds.map(w => w.id)).size, 6, 'World IDs are unique');
assert.equal(new Set(atlas.rooms.map(r => r.id)).size, 54, 'Room IDs are unique');
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
const spiral = read('spiral.html');
for(const required of ['spiral-data.js','spiral.js','spiral.css','whisper-field','room-selector','artwork-open','motion-toggle','audio-toggle']) {
  check(spiral.includes(required), 'Spiral experience missing '+required);
}
const spiralContext={window:{}};
runInNewContext(read('spiral-data.js'),spiralContext,{filename:'spiral-data.js'});
const spiralData=spiralContext.window.SPIRAL_CONTENT;
assert.equal(spiralData.rooms.length,5,'Spiral must have five independent rooms');
assert.equal(Object.keys(spiralData.categories).length,10,'Spiral must provide ten whisper categories');
check(spiralData.opposites.length>=8,'Spiral requires curated emotional contradictions');
check(atlas.worlds.some(w=>w.id==='spiral'),'Spiral must be a top-level world');
for(const room of spiralData.rooms){
  check(atlas.rooms.some(r=>r.id===room.atlasId && r.world==='spiral'),'Spiral room missing in main atlas '+room.id);
}
check(read('immersive.js').includes('spiral.html'),'Main gallery does not link to Spiral');
// The approved cinematic homepage must never reintroduce the unwanted SVG avatar
// or floating WIP canvas. The actual photographed/rendered studio remains untouched.
const studioHtml = read('index.html');
for(const id of ['studio-space','intro-title','entrance-choices','enter-choice']){
  check(studioHtml.includes('id="'+id+'"'), 'Cinematic studio missing '+id);
}
for(const marker of ['studio-avatar','studio-live-canvas','studio-paint-surface',
  'studio-emotion-ring','studio-spotlight','studio-interactions',
  'BRING THE STUDIO TO LIFE','WORK IN PROGRESS','studio.js']){
  check(!studioHtml.includes(marker), 'Unwanted cartoon studio feature returned: '+marker);
}
for(const file of ['studio.css','studio-hero.css']){
  check(studioHtml.includes(file), 'Main entrance missing '+file);
}
check(studioHtml.includes('Walk into<br><em>my mind.</em>'), 'Approved headline missing');
check(studioHtml.includes('class="studio-choose-feeling"'), 'Preserve optional emotional starting point');
check(!studioHtml.includes('class="studio-featured-original"'), 'Keep painting overlay off homepage');
check(gallery.artworks.some(a=>a.title==='Untitled'), 'Keep original Untitled art in the gallery');
const heroCss = read('studio-hero.css');
check(heroCss.includes('images/studio-entrance.png'), 'Preserve approved cinematic studio image');
check(!heroCss.includes('.studio-entrance .studio-avatar{display:block'), 'Do not restore avatar overlay');
check(!heroCss.includes('.studio-entrance .studio-live-canvas{display:block'), 'Do not restore WIP canvas overlay');
check(!read('scripts/build.mjs').includes("'studio.js'"), 'Do not ship retired animation script');
check(!existsSync('studio.js'), 'Retired avatar/canvas script should not exist');
check(existsSync('images/studio-entrance.png'), 'Approved cinematic image missing');
check(!studioHtml.includes('window-dog') && !studioHtml.includes('dog-portrait'),'No dog requested in studio');
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
for (const file of ['index.html','immersive.css','immersive.js','atlas-data.js','gallery-data.js','bloom.html','bloom-walk.css','bloom-walk.js','spiral.html','spiral.css','spiral-data.js','spiral.js','studio.css','studio-hero.css']) {
  check(existsSync(resolve('dist',file)), 'Build output missing ' + file);
}
check(readdirSync('dist/images').length > 0, 'Built image directory should not be empty');
check(existsSync('dist/images/studio-entrance.png'), 'Cinematic hero asset must be shipped with the site');
check(!existsSync('dist/studio.js'),'Do not ship cartoon avatar/canvas logic');
check(!read('dist/index.html').includes('studio-avatar'),'No duplicate cartoon avatar in published HTML');
check(!read('dist/index.html').includes('studio-live-canvas'),'No floating WIP canvas in published HTML');
console.log('✓ All 54 rooms, five official worlds, hidden Undercurrent passages, and artwork references verified.');
console.log('✓ Gallery HTML and build outputs contain the required assets and elements.');

console.log('✓ Bloom walkthrough, original artwork, keyboard/touch controls and routes verified.');

console.log('✓ The Spiral: five rooms, curated whispers, standalone entrance and gallery integration verified.');

console.log('✓ Homepage preserves cinematic studio and rejects cartoon/avatar/canvas overlay regressions.');
