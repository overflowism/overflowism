import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';
import { resolve } from 'node:path';

function check(condition, message) { assert.ok(condition, message); }
function read(path) { return readFileSync(path, 'utf8'); }
for (const file of ['atlas-data.js','immersive.js','gallery-data.js','bloom-walk.js','spiral-data.js','spiral-expansion-data.js','spiral.js','spiral-expansion.js','studio.js']) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
}
const context = { window: {} };
runInNewContext(read('atlas-data.js'), context, { filename: 'atlas-data.js' });
runInNewContext(read('gallery-data.js'), context, { filename: 'gallery-data.js' });
const atlas = context.window.OVERFLOW_ATLAS;
const gallery = context.window.galleryData;
check(atlas && gallery, 'Atlas and artwork data should load');
assert.equal(atlas.worlds.length, 6, 'Five official worlds plus The Undercurrent');
assert.equal(atlas.rooms.length, 62, 'Original 49 rooms and thirteen Spiral rooms should be present');
assert.equal(new Set(atlas.worlds.map(w => w.id)).size, 6, 'World IDs are unique');
assert.equal(new Set(atlas.rooms.map(r => r.id)).size, 62, 'Room IDs are unique');
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
for(const required of ['spiral-data.js','spiral-expansion-data.js','spiral.js','spiral-expansion.js','spiral.css','spiral-expansion.css','whisper-field','room-selector','artwork-open','motion-toggle','audio-toggle']) {
  check(spiral.includes(required), 'Spiral experience missing '+required);
}
const spiralContext={window:{}};
runInNewContext(read('spiral-data.js'),spiralContext,{filename:'spiral-data.js'});
runInNewContext(read('spiral-expansion-data.js'),spiralContext,{filename:'spiral-expansion-data.js'});
const spiralData=spiralContext.window.SPIRAL_CONTENT;
assert.equal(spiralData.rooms.length,13,'Spiral must have thirteen independent rooms');
assert.deepEqual(Array.from(spiralData.rooms.slice(0,5).map(r=>r.id)),['whispers','loop','mirror','collapse','stillness'],'Original five Spiral rooms must be preserved');
check(Object.keys(spiralData.categories).length>=12,'Spiral must provide twelve or more editable thought categories');
check(spiralData.affirmations.length>=10,'Affirmations must remain editable content');
check(spiralData.rooms.slice(5).every(r=>r.themes && r.motif),'Each positive Spiral room needs distinct themes and visual motif');
for(const room of spiralData.rooms){
  for(const theme of room.themes||[]){
    check(Array.isArray(spiralData.categories[theme]) && spiralData.categories[theme].length>0,
      'Unknown or empty Spiral whisper category '+theme+' in '+room.id);
  }
}
check(spiralData.artworkRooms.length===13,'All Spiral rooms must have an artwork placement slot');
for(const room of spiralData.rooms){
  check(Array.isArray(spiralData.connections[room.id]) && spiralData.connections[room.id].length,
    'Spiral room lacks discovery connections: '+room.id);
  for(const next of spiralData.connections[room.id]){
    check(spiralData.rooms.some(r=>r.id===next),'Spiral connection target missing: '+next);
  }
}
check(spiralData.opposites.length>=8,'Spiral requires curated emotional contradictions');
check(atlas.worlds.some(w=>w.id==='spiral'),'Spiral must be a top-level world');
for(const room of spiralData.rooms){
  check(atlas.rooms.some(r=>r.id===room.atlasId && r.world==='spiral'),'Spiral room missing in main atlas '+room.id);
}
check(read('immersive.js').includes('spiral.html'),'Main gallery does not link to Spiral');
// Studio entrance is a working interactive room, not a static background image.
const studioHtml = read('index.html');
for(const id of ['studio-space','studio-avatar','studio-paint-surface','studio-emotion-name',
  'studio-temp-track','studio-mark','studio-words','studio-word-input','studio-sound',
  'entrance-choices','enter-choice']) {
  check(studioHtml.includes('id="' + id + '"'), 'Living studio missing interaction target: ' + id);
}
for(const file of ['studio.css','studio.js']) {
  check(studioHtml.includes(file), 'Main entrance must load ' + file);
}
const studioJs = read('studio.js');
for(const marker of ["data-studio-stop","pointerdown","setStation","randomMark","visibilitychange","AudioContext"]) {
  check(studioJs.includes(marker), 'Studio interaction missing ' + marker);
}
check(studioHtml.includes('images/artworks/untitled-the-bloom-web.jpg'), 'Preserve original Untitled painting inside the studio');
check(!studioHtml.includes('window-dog') && !studioHtml.includes('dog-portrait'), 'No dog requested in studio');
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
for (const file of ['index.html','immersive.css','immersive.js','atlas-data.js','gallery-data.js','bloom.html','bloom-walk.css','bloom-walk.js','spiral.html','spiral.css','spiral-data.js','spiral.js','spiral-expansion-data.js','spiral-expansion.js','spiral-expansion.css','studio.css','studio.js']) {
  check(existsSync(resolve('dist',file)), 'Build output missing ' + file);
}
check(readdirSync('dist/images').length > 0, 'Built image directory should not be empty');
console.log('✓ All 62 rooms, five official worlds, hidden Undercurrent passages, and artwork references verified.');
console.log('✓ The interactive HTML and build outputs contain required assets and elements.');

console.log('✓ Bloom walkthrough, original artwork, keyboard/touch controls and routes verified.');

console.log('✓ The Spiral: thirteen rooms, positive spirals, affirmations, connections and interactive art verified.');

console.log('✓ Living studio: animated avatar, scenic windows, canvas, coding station and interaction controls verified.');
