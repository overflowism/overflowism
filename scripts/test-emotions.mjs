import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const read=p=>readFileSync(p,'utf8');
const ctx={window:{}};
runInNewContext(read('studio-emotions.js'),ctx,{filename:'studio-emotions.js'});
const model=ctx.window.OVERFLOW_EMOTIONS;
assert.ok(model,'Emotional model must initialize');
assert.equal(model.names.length,7,'Include seven distinct emotional worlds/states');
for(const name of ['bloom','heart','noise','spiral','watchers','sadness','peace']){
  assert.ok(model.STATES[name],'Missing emotion '+name);
}
const visits=new Set();
for(let i=0;i<80;i++){
  let n=0;
  const rng=()=>((i*13+n++*17)%101)/101;
  const plan=model.next('peace',rng);
  visits.add(plan.name);
  assert.notEqual(plan.name,'peace','No fixed self-loop');
  assert.ok(plan.dwell>=model.LIMITS.minDwell&&plan.dwell<=model.LIMITS.maxDwell,'Dwell range');
  assert.ok(plan.weight>.07&&plan.weight<.37,'Emotional undertones should blend');
  assert.ok(plan.intensity>=0&&plan.intensity<=1);
  assert.ok(plan.light.length===3&&plan.shadow.length===3,'Three-channel lighting');
  assert.ok(model.STATES[plan.name].artist,'An artist activity exists');
}
assert.ok(visits.size>3,'Vary emotional journeys rather than fixed cycle');

// Simulate the browser controller: no network, storage, animation or actual DOM needed.
const handlers={};
function events(){
  const map={};
  return {map,addEventListener(t,fn){(map[t]??=[]).push(fn);},
    dispatchEvent(e){(map[e.type]||[]).forEach(fn=>fn(e));return true;}};
}
function classes(){
  const values=new Set();
  return {add(x){values.add(x)},remove(x){values.delete(x)},contains(x){return values.has(x)}};
}
function node(){
  return {...events(),dataset:{},style:{values:{},setProperty(k,v){this.values[k]=v}},classList:classes(),children:[],appendChild(x){this.children.push(x)}};
}
const room=node(),layer=node(),dust=node(),embers=node(),phaseA=node(),phaseB=node(),motion=node();
room.hidden=false;
layer.querySelector=s=>s==='.studio-atmo-dust'?dust:s==='.studio-atmo-embers'?embers:null;
layer.querySelectorAll=s=>s==='.studio-atmo-phase'?[phaseA,phaseB]:[];
const root=node();
let currentTimer=0;
const timers=new Map();
let observer;
const doc={
  ...events(),hidden:false,documentElement:root,
  querySelector:s=>s==='#entrance.studio-entrance'?room:null,
  getElementById:id=>id==='studio-atmosphere'?layer:id==='motion-toggle'?motion:null,
  createElement:()=>node()
};
const browser={
  ...events(),OVERFLOW_EMOTIONS:model,
  setTimeout(fn,ms){assert.ok(ms>0);const id=++currentTimer;timers.set(id,{fn,ms});return id},
  clearTimeout(id){timers.delete(id)}
};
const context={window:browser,document:doc,clearTimeout:id=>timers.delete(id),
  CustomEvent:class{constructor(type,opts){this.type=type;this.detail=opts?.detail}},
  MutationObserver:class{constructor(fn){observer={fn}}observe(){}},
  queueMicrotask:fn=>fn()};
runInNewContext(read('studio-atmosphere.js'),context,{filename:'studio-atmosphere.js'});
assert.equal(room.dataset.atmosphereReady,'yes','Atmo initialized');
assert.equal(room.dataset.atmosphere,'peace','First render preserves warm and gentle arrival');
assert.equal(timers.size,1,'One scheduled state change');
assert.equal(dust.children.length,11);
assert.equal(embers.children.length,4);
assert.equal(phaseA.classList.contains('is-active'),true,'First visual light layer active');
root.classList.add('motion-off');
observer.fn();
assert.equal(timers.size,0,'Pause Motion stops emotional changes');
assert.equal(layer.classList.contains('studio-atmo-paused'),true,'Ambient layers paused');
root.classList.remove('motion-off');
observer.fn();
assert.equal(timers.size,1,'Resume Motion schedules future changes');
let emitted=null;
room.addEventListener('studio:atmosphere',e=>{emitted=e.detail});
const nextTimer=[...timers.entries()][0];
timers.delete(nextTimer[0]);
nextTimer[1].fn();
assert.notEqual(room.dataset.atmosphere,'peace','Unattended visitor experiences change');
assert.ok(emitted?.station,'Change coordinates artist activity');
assert.equal(timers.size,1,'A variable dwell is scheduled');
assert.equal(phaseB.classList.contains('is-active'),true,'Next lighting layer takes over');
assert.equal(phaseA.classList.contains('is-active'),false,'Old lighting layer fades');
doc.hidden=true;
(doc.map.visibilitychange||[]).forEach(fn=>fn());
assert.equal(timers.size,0,'Background tab stops timers');
assert.equal(room.dataset.atmosphereReady,'yes','DOM contract remains stable');
const html=read('index.html');
assert.ok(html.includes('id="studio-atmosphere"'));
assert.ok(html.includes('studio-emotions.js')&&html.includes('studio-atmosphere.js'));
assert.ok(html.includes('Walk into<br><em>my mind.</em>'));
assert.ok(!html.includes('class="studio-featured-original"'),'Painting overlay must stay removed');
assert.ok(read('studio-hero.css').includes('images/studio-entrance.png'),'Approved background remains untouched');
console.log('✓ Living Mind: emotional variation, blended lighting, autonomous changes, pause/resume, and background-tab safety verified.');
