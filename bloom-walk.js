/* OVERFLOWISM / THE BLOOM — an original, dependency-free perspective garden.
   A real interactive camera with walk and turn controls, canvas art displays,
   atmospheric depth, touch navigation and reduced-motion support. */
(function () {
  'use strict';
  const canvas = document.querySelector('#garden');
  const ctx = canvas.getContext('2d', { alpha: false });
  const $ = selector => document.querySelector(selector);
  const artwork = (window.galleryData?.artworks || []).find(a => a.title === 'Untitled' && !a.placeholder);
  const image = new Image();
  if (artwork) image.src = artwork.image;
  const mobile = matchMedia('(pointer: coarse)').matches;
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const state = {
    x: 0, z: 0, yaw: 0, keys: new Set(), started: false, paused: motionPreference.matches,
    last: performance.now(), elapsed: 0, width: 0, height: 0, ratio: 1, scale: 1,
    scene: 0, nearArt: false, showingCompletion: false, dragging: false, dragX: 0, pointerId: null
  };
  const maxZ = 106;
  const interactionZ = 30;
  const pieces = [
    { type: 'painting', x: -4.25, z: 29.5, size: 2.2, paint: true },
    { type: 'painting', x: 4.7, z: 76, size: 2.1, paint: false }
  ];
  // Original seeded layout; no live fetches, tracking, or third-party dependencies.
  let seed = 71;
  function random() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  const objects = [];
  for (let i = 0; i < 220; i++) {
    const z = 5 + random() * 119;
    const side = random() > .5 ? 1 : -1;
    const distance = 2.55 + random() * 11.5;
    objects.push({
      type: random() < .28 ? 'bloom' : 'flower',
      x: side * distance, z, size: .35 + random() * 1.1,
      tone: Math.floor(random() * 5), phase: random() * Math.PI * 2
    });
  }
  for (let i = 0; i < 44; i++) {
    const z = 8 + i * 2.7 + random() * 2;
    const side = i % 2 ? 1 : -1;
    objects.push({ type: 'tree', x: side * (7 + random() * 7), z,
      size: 3.4 + random() * 4.5, phase: random() * 7, tone: i % 4 });
  }
  for (let i = 0; i < 17; i++) {
    objects.push({ type: 'butterfly', x: (random() - .5) * 12, z: 10 + random() * 100,
      size: .22 + random() * .28, phase: random() * Math.PI * 2, tone: i % 4 });
  }
  objects.push(...pieces);

  function colorFor(tone) {
    return ['#ff8bb6', '#f9dc66', '#c89df2', '#fff8e8', '#efaa6f'][tone % 5];
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    state.width = Math.max(1, rect.width);
    state.height = Math.max(1, rect.height);
    state.ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(state.width * state.ratio);
    canvas.height = Math.round(state.height * state.ratio);
    ctx.setTransform(state.ratio, 0, 0, state.ratio, 0, 0);
    state.scale = Math.max(state.width, state.height) * .95;
  }
  function project(x, y, z) {
    const dx = x - state.x, dz = z - state.z;
    const cs = Math.cos(state.yaw), sn = Math.sin(state.yaw);
    const side = dx * cs - dz * sn;
    const depth = dx * sn + dz * cs;
    if (depth < .7 || depth > 165) return null;
    const f = state.scale / depth;
    return { x: state.width * .5 + side * f, y: state.height * .53 - (y - 1.75) * f, f, depth };
  }
  function polygon(points, fill, stroke, width) {
    if (points.some(p => !p)) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.lineWidth = width || 1; ctx.strokeStyle = stroke; ctx.stroke(); }
  }
  function ellipse(x, y, rx, ry, fill, angle = 0) {
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(rx,.01), Math.max(ry,.01), angle, 0, Math.PI * 2);
    ctx.fillStyle = fill; ctx.fill();
  }
  function paintSky(t) {
    const w = state.width, h = state.height;
    const sky = ctx.createLinearGradient(0,0,0,h);
    sky.addColorStop(0,'#59b4d6');
    sky.addColorStop(.34,'#9ed9df');
    sky.addColorStop(.61,'#f8e4ad');
    sky.addColorStop(1,'#669b68');
    ctx.fillStyle = sky; ctx.fillRect(0,0,w,h);
    const sunX=w * .78 - Math.sin(state.yaw)*w*.45;
    const sunY=h*.17;
    const glow=ctx.createRadialGradient(sunX,sunY,3,sunX,sunY,w*.31);
    glow.addColorStop(0,'#fff7cdcf');glow.addColorStop(.16,'#fff1b45c');glow.addColorStop(1,'#fff1b400');
    ctx.fillStyle=glow; ctx.fillRect(0,0,w,h);
    ellipse(sunX,sunY,Math.min(w*.044,43),Math.min(w*.044,43),'#fff4be');
    // Atmospheric mountain silhouettes below the horizon.
    for(let layer=0;layer<3;layer++){
      const base=h*(.52+layer*.075);
      ctx.beginPath();ctx.moveTo(0,h);
      for(let x=-40;x<=w+40;x+=30){
        const y=base-Math.sin(x/w*5.5+layer*2.3+state.yaw*.26)*h*(.035+.017*layer)
          -Math.sin(x/w*15+layer)*h*.025;
        ctx.lineTo(x,y);
      }
      ctx.lineTo(w,h);ctx.closePath();
      ctx.fillStyle=['#8fb9a6','#548e7a','#2c6859'][layer];ctx.fill();
    }
  }
  function ground() {
    const w=state.width,h=state.height;
    ctx.fillStyle='#356d4a';
    ctx.fillRect(0,h*.69,w,h*.31);
    // World-space ground tiles and perspective path maintain depth during walking.
    for(let z=Math.floor((state.z+152)/3)*3;z>=state.z+.72;z-=3){
      const a=Math.max(z,state.z+.73),b=z+3;
      polygon([project(-90,0,a),project(90,0,a),project(90,0,b),project(-90,0,b)], '#387850');
      const mid = z > 60 ? '#f5d8b1' : '#f3d0a7';
      polygon([project(-1.93,0,a),project(1.93,0,a),project(1.93,0,b),project(-1.93,0,b)], mid);
      if (z % 9 === 0) {
        polygon([project(-1.95,.015,a),project(-1.82,.015,a),project(-1.82,.015,b),project(-1.95,.015,b)],'#cfaf8f');
        polygon([project(1.82,.015,a),project(1.95,.015,a),project(1.95,.015,b),project(1.82,.015,b)],'#cfaf8f');
      }
    }
    const fade=ctx.createLinearGradient(0,h*.55,0,h);
    fade.addColorStop(0,'#e0eab400');fade.addColorStop(.63,'#f6dfba00');fade.addColorStop(1,'#173f3033');
    ctx.fillStyle=fade;ctx.fillRect(0,h*.55,w,h*.45);
  }
  function drawTree(o, p, t) {
    const f=p.f, y=p.y, h=o.size*f;
    if (h<2 || p.x<-3*h || p.x>state.width+3*h)return;
    const sway=state.paused?0:Math.sin(t*.55+o.phase)*Math.min(6,h*.019);
    ctx.fillStyle='#674b36';
    ctx.beginPath();ctx.moveTo(p.x-h*.064,p.y);ctx.lineTo(p.x-h*.06+sway,p.y-h*.72);
    ctx.lineTo(p.x+h*.045+sway,p.y-h*.73);ctx.lineTo(p.x+h*.065,p.y);ctx.closePath();ctx.fill();
    const greens=['#3d8556','#468e54','#72a85d','#4e9b6a'];
    const cx=p.x+sway,cy=p.y-h*.8;
    ellipse(cx,cy,h*.34,h*.29,greens[o.tone],-.17);
    ellipse(cx-h*.23,cy+h*.075,h*.24,h*.22,'#5caa6a');
    ellipse(cx+h*.19,cy+h*.068,h*.26,h*.24,'#408b59');
    ellipse(cx-h*.09,cy-h*.11,h*.21,h*.23,'#8ebc75');
    if(o.z>58) {
      for(let k=0;k<5;k++){
        const x=cx+(k-2)*h*.095;
        ellipse(x,cy+Math.sin(k*3+o.phase)*h*.16,h*.035,h*.047, colorFor((k+o.tone)%5));
      }
    }
  }
  function drawFlower(o,p,t) {
    const sz=o.size*p.f, x=p.x, y=p.y;
    if(sz<1 || x<-100 || x>state.width+100)return;
    const shift=state.paused?0:Math.sin(t*.8+o.phase)*Math.min(8,sz*.2);
    ctx.strokeStyle='#2d744a';ctx.lineWidth=Math.max(1,sz*.07);
    ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+sz*.24,y-sz*.65,x+shift,y-sz*1.2);ctx.stroke();
    const cx=x+shift,cy=y-sz*1.2;
    if(o.type==='bloom'){
      ellipse(cx,cy,sz*.28,sz*.29,'#9bcb7d');
      ellipse(cx-sz*.22,cy+sz*.06,sz*.24,sz*.22,'#5fac6e');
    }
    for(let k=0;k<5;k++){
      const a=k*Math.PI*2/5+o.phase*.12;
      ellipse(cx+Math.cos(a)*sz*.22,cy+Math.sin(a)*sz*.22,sz*.21,sz*.23,colorFor(o.tone),a);
    }
    ellipse(cx,cy,sz*.17,sz*.17,'#ffdf74');
    ellipse(cx-sz*.06,cy-sz*.065,sz*.045,sz*.045,'#fff5cf');
  }
  function drawButterfly(o,p,t) {
    const s=o.size*p.f;
    if(s<1.5)return;
    const wobble=state.paused?0:Math.sin(t*.8+o.phase)*s*.5;
    const x=p.x+wobble, y=p.y-s*3-Math.sin(t*1.1+o.phase)*s*.25;
    const wing=state.paused?.9:(.45+.5*Math.abs(Math.sin(t*8+o.phase)));
    ctx.save();ctx.translate(x,y);
    ellipse(-s*.5*wing,0,s*.67*wing,s*.8,'#eb8fc3',-.32);
    ellipse(s*.5*wing,0,s*.67*wing,s*.8,'#a990e1',.32);
    ellipse(-s*.4*wing,s*.64,s*.44*wing,s*.4,'#f4d58e');
    ellipse(s*.4*wing,s*.64,s*.44*wing,s*.4,'#ec9dc9');
    ellipse(0,s*.15,s*.09,s*.65,'#332e3e');ctx.restore();
  }
  function drawPainting(o,p) {
    const h=3*p.f, w=o.size*p.f;
    if(h<7)return;
    const x=p.x-w/2, y=p.y-h;
    if(x>state.width+200 || x+w < -200)return;
    ctx.save();
    ctx.shadowColor='#173c32a8';ctx.shadowBlur=Math.min(70,Math.max(6,p.f*.6));
    ctx.fillStyle='#322a25';ctx.fillRect(x-w*.065,y-h*.06,w*1.13,h*1.14);
    ctx.shadowBlur=0;
    ctx.fillStyle='#dfc4a1';ctx.fillRect(x-w*.03,y-h*.025,w*1.06,h*1.055);
    ctx.fillStyle='#634d3d';ctx.fillRect(x,y,w,h);
    if(o.paint && image.complete && image.naturalWidth) {
      ctx.drawImage(image,x+w*.045,y+h*.04,w*.91,h*.92);
    } else {
      const gradient=ctx.createLinearGradient(x,y,x+w,y+h);
      gradient.addColorStop(0,'#64bcbd');gradient.addColorStop(.5,'#ecb6d2');gradient.addColorStop(1,'#eacb7c');
      ctx.fillStyle=gradient;ctx.fillRect(x+w*.05,y+h*.045,w*.9,h*.91);
      if(w>30){
        ctx.font=Math.max(12,Math.min(40,w*.23))+'px Georgia';
        ctx.textAlign='center';ctx.fillStyle='#fffaee';ctx.fillText('✿',x+w*.5,y+h*.55);
      }
    }
    if(p.f>10){
      ctx.textAlign='center';ctx.fillStyle='#fff8e7dd';ctx.font=Math.max(10,Math.min(15,p.f*.14))+'px "DM Sans",sans-serif';
      ctx.fillText(o.paint?'UNTITLED · ORIGINAL PAINTING':'THE GARDEN GROWS',p.x,p.y+Math.min(31,p.f*.34));
    }
    ctx.restore();
    // Sculptural post / easel makes frame exist in the physical scene.
    ctx.strokeStyle='#6b5135';ctx.lineWidth=Math.max(2,p.f*.06);
    ctx.beginPath();ctx.moveTo(p.x,p.y+5);ctx.lineTo(p.x,p.y+Math.max(10,p.f*.8));ctx.stroke();
  }
  function drawLantern(z,side,t) {
    const p=project(side*2.3,2.15,z);
    if(!p)return;
    const f=p.f;const y=p.y;
    if(f<3 || f>350)return;
    ctx.strokeStyle='#496849';ctx.lineWidth=Math.max(1,f*.045);
    ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x,p.y+2.15*f);ctx.stroke();
    const rr=Math.min(20,f*.23);
    ellipse(p.x,y-rr*.6,rr,rr*.6,'#fff0b2');
    ellipse(p.x,y-rr*.6,rr*.65,rr*.4,'#fff8dc');
  }
  function draw(t) {
    const w=state.width,h=state.height;
    ctx.clearRect(0,0,w,h);
    paintSky(t);ground();
    const visible=objects.map(o=>({o,p:project(o.x,o.type==='butterfly'?1.7:0,o.z)}))
      .filter(v=>v.p && v.p.depth>1.2)
      .sort((a,b)=>b.p.depth-a.p.depth);
    visible.forEach(({o,p})=>{
      if(o.type==='tree')drawTree(o,p,t);
      else if(o.type==='flower'||o.type==='bloom')drawFlower(o,p,t);
      else if(o.type==='butterfly')drawButterfly(o,p,t);
      else if(o.type==='painting')drawPainting(o,p);
    });
    for(let z=18;z<110;z+=18){
      if(z>state.z+1){drawLantern(z,-1,t);drawLantern(z+5,1,t);}
    }
    // A dreamlike atmospheric layer ties distant objects together.
    const air=ctx.createLinearGradient(0,h*.33,0,h*.87);
    air.addColorStop(0,'#fff9db0d');air.addColorStop(.5,'#f0f6da0b');air.addColorStop(1,'#d1edbb00');
    ctx.fillStyle=air;ctx.fillRect(0,h*.32,w,h*.55);
    const vignette=ctx.createRadialGradient(w*.5,h*.47,w*.16,w*.5,h*.5,w*.85);
    vignette.addColorStop(0,'#071d1600');vignette.addColorStop(1,'#092c2770');
    ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
  }
  function update(dt) {
    if(!state.started || $('#art-dialog').open || !$('#guide').hidden || !$('#completion').hidden)return;
    const k=state.keys;
    let walk=0,turn=0;
    if(k.has('arrowup')||k.has('w')||k.has('forward'))walk+=1;
    if(k.has('arrowdown')||k.has('s')||k.has('back'))walk-=1;
    if(k.has('arrowleft')||k.has('a')||k.has('left'))turn-=1;
    if(k.has('arrowright')||k.has('d')||k.has('right'))turn+=1;
    state.yaw=Math.max(-.83,Math.min(.83,state.yaw+turn*dt*1.03));
    if(walk){
      state.z=Math.max(0,Math.min(maxZ,state.z+Math.cos(state.yaw)*walk*dt*8.4));
      state.x=Math.max(-1.3,Math.min(1.3,state.x+Math.sin(state.yaw)*walk*dt*2));
    }
    const chapter=state.z>=55?1:0;
    if(state.scene!==chapter) {
      state.scene=chapter;
      $('#chapter-index').textContent=chapter?'02 / 02 — FAIRY-TALE FOREST':'01 / 02 — BUTTERFLY GARDEN WALKWAY';
      $('#chapter-title').innerHTML=chapter?'The world is <em>still magic.</em>':'A little closer <em>to the light.</em>';
      $('#chapter-line').textContent=chapter?'Even the forest has room for every feeling.':'Not everything that grows started in the sun.';
      $('#direction-help').textContent=chapter?'WANDER THROUGH THE FAIRY-TALE FOREST':'WALK THROUGH THE GARDEN';
    }
    $('#journey-fill').style.width=(100*state.z/maxZ).toFixed(1)+'%';
    const artDistance=Math.hypot(state.z-interactionZ,state.x+4.25);
    const nearby=artDistance<11;
    if(nearby!==state.nearArt) {
      state.nearArt=nearby;
      $('#landmark-panel').hidden=!nearby;
      if(nearby){
        $('#landmark-title').textContent=artwork?.title||'Untitled';
        $('#landmark-description').textContent=artwork?.description||'An original painting by the artist.';
      }
    }
    if(state.z>=maxZ-1 && !state.showingCompletion) {
      state.showingCompletion=true;
      $('#completion').hidden=false;
    }
  }
  function loop(now) {
    const dt=Math.min((now-state.last)/1000,.065);
    state.last=now;
    if(!state.paused)state.elapsed+=dt;
    update(dt);
    draw(state.elapsed);
    requestAnimationFrame(loop);
  }
  function openArt() {
    if(!state.nearArt || !artwork)return;
    const dialog=$('#art-dialog');
    $('#art-title').textContent=artwork.title;
    $('#art-description').textContent=artwork.description;
    $('#art-details').textContent=artwork.details;
    $('#art-image').src=artwork.image;
    $('#art-image').alt=artwork.alt;
    $('#art-inquire').href='mailto:'+encodeURIComponent(window.galleryData.contactEmail||'')+
      '?subject='+encodeURIComponent('Inquiry: '+artwork.title);
    if(!dialog.open)dialog.showModal();
  }
  $('#examine-art').addEventListener('click',openArt);
  $('#close-art').addEventListener('click',()=>$('#art-dialog').close());
  $('#art-dialog').addEventListener('click',e=>{if(e.target===$('#art-dialog'))e.target.close();});
  $('#start-walk').addEventListener('click',()=>{
    state.started=true;
    $('#intro-veil').hidden=true;
    if(!mobile)canvas.focus?.();
  });
  $('#begin-again').addEventListener('click',()=>{
    state.z=0;state.x=0;state.yaw=0;state.showingCompletion=false;
    $('#completion').hidden=true;state.scene=-1;
    $('#landmark-panel').hidden=true;state.nearArt=false;
  });
  $('#motion-toggle').addEventListener('click',()=>{
    state.paused=!state.paused;
    document.documentElement.classList.toggle('motion-off',state.paused);
    $('#motion-toggle').setAttribute('aria-pressed',String(state.paused));
    $('#motion-label').textContent=state.paused?'RESUME':'PAUSE';
    $('#motion-toggle').setAttribute('aria-label',state.paused?'Resume environmental animations':'Pause environmental animations');
  });
  function toggleGuide(open) {
    $('#guide').hidden=!open;
    $('#guide-toggle').setAttribute('aria-expanded',String(open));
    if(open)$('#guide-close').focus();
    else $('#guide-toggle').focus();
  }
  $('#guide-toggle').addEventListener('click',()=>toggleGuide($('#guide').hidden));
  $('#guide-close').addEventListener('click',()=>toggleGuide(false));
  $('#guide-done').addEventListener('click',()=>toggleGuide(false));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape' && !$('#guide').hidden){toggleGuide(false);return;}
    if(e.target.closest('button,a,input,dialog') && e.key!=='Escape')return;
    const key=e.key.toLowerCase();
    if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(key)){
      e.preventDefault();state.keys.add(key);
    }
    if(key==='e' && state.nearArt && state.started)openArt();
  });
  document.addEventListener('keyup',e=>state.keys.delete(e.key.toLowerCase()));
  window.addEventListener('blur',()=>state.keys.clear());
  document.querySelectorAll('[data-move]').forEach(button=>{
    const key=button.dataset.move;
    button.addEventListener('pointerdown',e=>{
      e.preventDefault();button.setPointerCapture(e.pointerId);state.keys.add(key);
    });
    for(const name of ['pointerup','pointercancel','lostpointercapture'])
      button.addEventListener(name,()=>state.keys.delete(key));
  });
  canvas.addEventListener('pointerdown',e=>{
    if(!state.started)return;
    state.dragging=true;state.dragX=e.clientX;state.pointerId=e.pointerId;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove',e=>{
    if(!state.dragging||e.pointerId!==state.pointerId)return;
    const dx=e.clientX-state.dragX;state.dragX=e.clientX;
    state.yaw=Math.max(-.83,Math.min(.83,state.yaw+dx*.0032));
  });
  const endDrag=e=>{
    if(e.pointerId!==state.pointerId)return;
    state.dragging=false;state.pointerId=null;
  };
  canvas.addEventListener('pointerup',endDrag);
  canvas.addEventListener('pointercancel',endDrag);
  motionPreference.addEventListener?.('change',e=>{
    if(!$('#motion-toggle').dataset.userSet){
      state.paused=e.matches;
      document.documentElement.classList.toggle('motion-off',state.paused);
      $('#motion-toggle').setAttribute('aria-pressed',String(state.paused));
      $('#motion-label').textContent=state.paused?'RESUME':'PAUSE';
    }
  });
  $('#motion-toggle').addEventListener('click',()=>$('#motion-toggle').dataset.userSet='true');
  document.documentElement.classList.toggle('motion-off',state.paused);
  $('#motion-toggle').setAttribute('aria-pressed',String(state.paused));
  if(state.paused)$('#motion-label').textContent='RESUME';
  addEventListener('resize',resize,{passive:true});
  resize();requestAnimationFrame(loop);
})();
