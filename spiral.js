/* OVERFLOWISM — THE SPIRAL. A five-room interactive thought-to-art installation.
   Content is editable in spiral-data.js; no visitor data is stored or transmitted. */
(function () {
  'use strict';
  const data=window.SPIRAL_CONTENT;
  if (!data) return;
  const $=selector=>document.querySelector(selector);
  const app=$('#spiral-app'), field=$('#whisper-field'), canvas=$('#thought-canvas');
  const ctx=canvas.getContext('2d');
  const motionMedia=window.matchMedia('(prefers-reduced-motion: reduce)');
  const rooms=data.rooms;
  let current=0, counts={}, selected=[], released=false, sequence=0, lastInteraction=0;
  let motionOff=motionMedia.matches, motionOverride=false, interval=null, ambient=null, audioCtx=null;
  let lastFocus=null, activeArtwork=null;
  const wrap=(n,limit)=>((n%limit)+limit)%limit;
  const colors=['#eac8db','#c6a4e9','#f8c9b7','#8b87d8','#d7b3dc','#f5deb8','#5e9a9f','#b85c83'];
  const random=(seed)=>{const x=Math.sin(seed*82.5127+31.988)*42758.545;return x-Math.floor(x)};
  const hashNum=s=>Array.from(s).reduce((n,c)=>((n<<5)-n+c.charCodeAt(0))|0,33);
  const clampWhisperLength=text=>String(text).slice(0,300);
  function room(){return rooms[current];}
  function exploreLabel(r){
    return r.id==='mirror'?'REVEAL A REFLECTION ↗':
      r.id==='collapse'?'LET THE THOUGHTS COLLIDE ↗':
      r.id==='stillness'?'LISTEN TO THE QUIET ↗':'EXPLORE THE WHISPERS ↗';
  }
  function setPhase(phase){app.dataset.phase=phase;}
  function count(){return counts[room().id]||0;}
  function threshold(){return data.thresholds[room().id]||5;}
  function setCount(n){
    counts[room().id]=n;
    const progress=$('#thought-progress');
    progress.setAttribute('aria-valuemax',String(threshold()));
    progress.setAttribute('aria-valuenow',String(Math.min(n,threshold())));
    $('#progress-fill').style.width=(Math.min(n/threshold(),1)*100).toFixed(0)+'%';
    const status=n===0?'A thought appears.':n<threshold()?'The thought repeats. The room remembers.':'THE THOUGHT BECOMES THE ARTWORK.';
    $('#threshold-status').textContent=status;
  }
  function make(tag,className,text){
    const e=document.createElement(tag);
    if(className)e.className=className;
    if(text!==undefined)e.textContent=text;
    return e;
  }
  function seedFor(roomIndex,step){return (roomIndex+11)*137+step*13;}
  function phraseAt(step){
    const r=room(), key=seedFor(current,step);
    if(r.id==='whispers' && step<3) return {text:r.opening[step],tone:'reflective'};
    if(r.id==='loop' && step%4===0) return {text:step%8===0?'What if?':'WHAT IF?',tone:'obsessive'};
    if(r.id==='stillness' && step%4===3) return {text:'But what if I do not know yet?',tone:'reflective'};
    if(step%3===0){
      const pair=data.opposites[Math.floor(random(key)*data.opposites.length)];
      return {text:pair.first,tone:'dark',contrast:pair.second};
    }
    // Sample every curated whisper category over time, not only joy/hope.
    if(step%3===1) {
      const groups=Object.keys(data.categories);
      const group=groups[wrap(Math.floor(step/3)+current*2,groups.length)];
      const list=data.categories[group];
      return {text:list[Math.floor(random(key+4)*list.length)],tone:group};
    }
    const text=r.phrases[Math.floor(random(key+3)*r.phrases.length)];
    return {text,tone:r.id==='stillness'?'comforting':r.id==='collapse'?'contradictory':'reflective'};
  }
  function addWhisper(item,step,paired=false){
    const button=make('button','whisper',clampWhisperLength(item.text));
    button.type='button';
    button.dataset.tone=item.tone||'reflective';
    const positions=[[65,22],[14,42],[55,53],[26,73],[77,63],[43,26],[9,57],[71,77],[48,67],[78,36],[21,20],[51,82]];
    const pos=positions[step%positions.length];
    const shift=(random(seedFor(current,step)+7)-.5)*8;
    button.style.left=Math.min(82,Math.max(3,pos[0]+shift))+'%';
    button.style.top=Math.min(81,Math.max(16,pos[1]+shift))+'%';
    button.style.setProperty('--tilt',((step%4)-1.5)*6+'deg');
    button.setAttribute('aria-label','Thought: '+item.text+'. Select to uncover another thought.');
    button.addEventListener('click',()=>{
      const wasFocused=document.activeElement===button;
      let nextThought;
      if(item.contrast&&!button.dataset.revealed){
        button.dataset.revealed='yes';
        nextThought=addWhisper({text:item.contrast,tone:'hopeful'},step+5,true);
      }else{
        nextThought=addWhisper(phraseAt(sequence++),sequence);
      }
      addStroke(button.textContent);
      setCount(count()+1);
      if(count()>=threshold()) release();
      button.dataset.state='departing';
      // Keep focus on a visible thought when the original disappears.
      if(wasFocused)(nextThought||$('#explore')).focus({preventScroll:true});
      window.setTimeout(()=>button.remove(),800);
    });
    field.append(button);
    if(field.children.length>6){
      const victim=field.firstElementChild;
      if(victim&&victim!==button){victim.dataset.state='departing';window.setTimeout(()=>victim.remove(),800);}
    }
    // Contrasting thoughts must also be announced to assistive technology.
    $('#live-whisper').textContent='Thought: '+item.text;
    return button;
  }
  function addStroke(text) {
    const s=hashNum(text)+current*31+selected.length*19;
    selected.push(s);
    if(selected.length>38)selected.shift();
    drawArt();
  }
  function revealNext(){
    if(app.dataset.phase==='quiet')setPhase('exploring');
    addWhisper(phraseAt(sequence),sequence);
    sequence++;
    setCount(count()+1);
    addStroke(String(sequence)+room().name);
    if(count()>=threshold())release();
    else setPhase('exploring');
  }
  function clearWhispers(){
    field.replaceChildren();
  }
  function release(){
    if(released)return;
    released=true;setPhase('release');
    const r=room();
    $('#explore').textContent='ADD ANOTHER LAYER ↗';
    $('#clear-art').hidden=false;
    $('#silence-action').hidden=false;
    $('#threshold-status').textContent='Experience → Feeling → Threshold → Release → Form';
    $('#live-whisper').textContent='The repeated thoughts have transformed into an abstract artwork.';
    addStroke(r.name+' RELEASE');
  }
  function silence(){
    // A quiet room must contain no hidden interactive whisper buttons.
    clearWhispers();
    setPhase('quiet');
    $('#live-whisper').textContent='The room is quiet.';
  }
  function resetArt(){
    selected=[];released=false;setCount(0);setPhase('exploring');
    $('#explore').textContent=exploreLabel(room());
    $('#clear-art').hidden=true;
    $('#silence-action').hidden=room().id!=='stillness';
    clearWhispers();drawArt();revealNext();
  }
  function roomIndexFromHash(){
    const key=decodeURIComponent(location.hash.replace(/^#(?:room\/)?/,''));
    const index=rooms.findIndex(r=>r.id===key||r.atlasId===key);
    return index<0?0:index;
  }
  function goTo(index,writeUrl=true){
    current=wrap(index,rooms.length);
    const r=room();
    selected=[];released=false;sequence=0;
    app.dataset.room=r.id;
    app.style.setProperty('--room-dark',r.palette[0]);
    app.style.setProperty('--room-mid',r.palette[1]);
    app.style.setProperty('--room-light',r.palette[2]);
    $('#world-eyebrow').textContent='THE WALLS BEGIN WHISPERING · '+String(current+1).padStart(2,'0')+' / 05';
    $('#room-title').textContent=r.name;
    $('#room-subtitle').textContent=r.subtitle;
    $('#room-caption').textContent=r.caption;
    $('#explore').textContent=exploreLabel(r);
    $('#mirror-interact').hidden=r.id!=='mirror';
    $('#silence-action').hidden=r.id!=='stillness';
    $('#clear-art').hidden=true;
    $('#control-hint').textContent=r.id==='loop'?'Watch the same question return in a new form. Tap any thought to uncover another.':r.id==='mirror'?'Touch a reflection to reveal a confession.':r.id==='collapse'?'Collect thoughts until language becomes color. Pause whenever you like.':r.id==='stillness'?'Allow a thought to appear; there is no perfect ending.':'Click a phrase to reveal its contradiction. Use ← / → to explore rooms.';
    $('#previous-room').textContent='← '+rooms[wrap(current-1,rooms.length)].name;
    $('#next-room').textContent=rooms[wrap(current+1,rooms.length)].name+' →';
    clearWhispers();setCount(0);setPhase('opening');
    document.querySelectorAll('.room-selector a').forEach((link,i)=> {
      if(i===current)link.setAttribute('aria-current','step');
      else link.removeAttribute('aria-current');
    });
    $('#scene').style.setProperty('--turn',(current-2)*2.5+'deg');
    $('#scene').style.setProperty('--drift',((current%3)-1)*9+'px');
    updateArtwork();
    drawArt();
    document.title=r.name+' — THE SPIRAL / Overflowism';
    if(writeUrl&&location.hash!=='#room/'+r.id)history.replaceState(null,'','#room/'+r.id);
    if(!$('#intro-veil').hidden)return;
    $('#live-whisper').textContent=r.name+'. '+r.subtitle;
  }
  function updateArtwork(){
    const r=room();
    // Artwork appears here only when explicitly assigned to this world and room.
    const entries=(window.galleryData?.artworks||[]);
    activeArtwork=entries.find(a=>!a.placeholder &&
      (a.world==='spiral'||a.worldId==='spiral') &&
      (a.room===r.id||a.roomId===r.atlasId||a.roomId===r.id))||null;
    $('#artwork-title').textContent=activeArtwork?.title||'A PLACE FOR THE NEXT PAINTING';
    $('#artwork-open').setAttribute('aria-label',activeArtwork?'View artwork '+activeArtwork.title:'View artwork alcove placeholder');
  }
  function showArt(){
    const dialog=$('#art-dialog'), imageRoot=$('#dialog-image');
    lastFocus=document.activeElement;
    imageRoot.replaceChildren();
    if(activeArtwork){
      const image=make('img');
      image.src=activeArtwork.image;
      image.alt=activeArtwork.alt||activeArtwork.title;
      imageRoot.append(image);
      $('#art-dialog-title').textContent=activeArtwork.title;
      $('#art-dialog-description').textContent=activeArtwork.description||'Original Overflowism artwork.';
      $('#art-dialog-details').textContent=activeArtwork.details||'';
      $('#art-inquiry').hidden=false;
      $('#art-inquiry').href='mailto:'+encodeURIComponent(window.galleryData?.contactEmail||'hello@overflowism.com')+'?subject='+encodeURIComponent('Overflowism artwork inquiry: '+activeArtwork.title);
    } else {
      imageRoot.append(make('div','art-placeholder','◇'));
      $('#art-dialog-title').textContent='A space for what comes next.';
      $('#art-dialog-description').textContent='This alcove awaits an original Overflowism artwork. The changing thought composition in this room is interactive digital art, not an existing physical painting.';
      $('#art-dialog-details').textContent='Artwork not yet assigned. Add world: "spiral" and a matching room to an entry in gallery-data.js.';
      $('#art-inquiry').hidden=true;
    }
    dialog.showModal();
  }
  const nav=$('#room-selector');
  rooms.forEach((r,i)=>{
    const link=make('a',null,r.name);
    link.href='#room/'+r.id;
    link.prepend(make('span',null,'0'+(i+1)));
    link.addEventListener('click',e=>{
      e.preventDefault();goTo(i);
    });
    nav.append(link);
  });
  function resizeCanvas(){
    const rect=canvas.getBoundingClientRect();
    const pixelRatio=Math.min(window.devicePixelRatio||1,1.7);
    canvas.width=Math.max(1,Math.round(rect.width*pixelRatio));
    canvas.height=Math.max(1,Math.round(rect.height*pixelRatio));
    drawArt();
  }
  function drawArt(){
    if(!ctx||!canvas.width)return;
    const w=canvas.width,h=canvas.height,d=Math.min(w,h);
    ctx.clearRect(0,0,w,h);
    const tally=selected.length;
    if(!tally)return;
    const cx=w*.53,cy=h*.49;
    ctx.save();
    ctx.globalCompositeOperation='screen';
    const limit=Math.min(tally*7,175);
    for(let i=0;i<limit;i++){
      const seed=selected[i%tally]||i+10;
      const a=(i*.6180339887+random(seed+i)*.3)*Math.PI*2;
      const radius=(.04+Math.pow(i/Math.max(1,limit),.9)*.38)*d;
      const px=cx+Math.cos(a)*radius,py=cy+Math.sin(a)*radius*.65;
      const size=(3+(i%8)*2)*Math.max(.5,d/720);
      ctx.strokeStyle=colors[wrap(Math.abs(seed)+i,colors.length)];
      ctx.fillStyle=colors[wrap(Math.abs(seed)+i+3,colors.length)];
      ctx.globalAlpha=Math.min(.8,.25+tally/70);
      ctx.lineWidth=Math.max(1,d/900);
      ctx.beginPath();
      if(i%4===0){
        for(let p=0;p<5;p++){
          const t=a+p*Math.PI*2/5;
          const x=px+Math.cos(t)*size*2,y=py+Math.sin(t)*size*2;
          ctx.moveTo(px,py);ctx.lineTo(x,y);
          ctx.moveTo(x+size*.44,y);ctx.arc(x,y,size*.44,0,Math.PI*2);
        }
        ctx.stroke();
      }else if(i%3===0){
        ctx.ellipse(px,py,size*2,size*.32,a,0,Math.PI*2);ctx.stroke();
      }else{
        ctx.arc(px,py,size*.52,0,Math.PI*2);ctx.fill();
      }
    }
    if(tally>4){
      ctx.globalAlpha=Math.min(.3,tally/75);
      ctx.strokeStyle='#f9cfec';ctx.lineWidth=Math.max(1,d/700);
      ctx.beginPath();
      for(let i=0;i<limit;i++){
        const t=i/Math.max(1,limit);
        const angle=i*.32+current;
        const rad=(.06+t*.34)*d;
        const x=cx+Math.cos(angle)*rad, y=cy+Math.sin(angle)*rad*.66;
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }ctx.stroke();
    }
    ctx.restore();
  }
  // While the opening veil is visible, background controls cannot receive focus.
  function setEntranceOpen(open){
    for(const node of [$('.masthead'),$('#experience')]){
      node.inert=open;
      if(open)node.setAttribute('aria-hidden','true');
      else node.removeAttribute('aria-hidden');
    }
    $('#intro-veil').hidden=!open;
  }
  setEntranceOpen(true);
  $('#enter-spiral').addEventListener('click',()=>{
    setEntranceOpen(false);
    $('#explore').focus({preventScroll:true});
    revealNext();
  });
  $('#explore').addEventListener('click',revealNext);
  $('#mirror-interact').addEventListener('click',()=>{
    const phrase=room().phrases[sequence%room().phrases.length];
    addWhisper({text:phrase,tone:'reflective',contrast:'I am more than my worst thought.'},sequence+4);
    setCount(count()+1);sequence++;addStroke('MIRROR '+phrase);
    if(count()>=threshold())release();
  });
  $('#silence-action').addEventListener('click',silence);
  $('#clear-art').addEventListener('click',resetArt);
  $('#previous-room').addEventListener('click',()=>goTo(current-1));
  $('#next-room').addEventListener('click',()=>goTo(current+1));
  $('#artwork-open').addEventListener('click',showArt);
  $('#close-art').addEventListener('click',()=>$('#art-dialog').close());
  $('#art-dialog').addEventListener('click',e=>{if(e.target===$('#art-dialog'))e.target.close();});
  $('#art-dialog').addEventListener('close',()=>lastFocus?.focus());
  window.addEventListener('hashchange',()=>goTo(roomIndexFromHash(),false));
  document.addEventListener('keydown',e=>{
    if(!$('#intro-veil').hidden||$('#art-dialog').open||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
    if(e.key==='ArrowRight'&&document.activeElement?.tagName!=='BUTTON'){e.preventDefault();goTo(current+1);}
    if(e.key==='ArrowLeft'&&document.activeElement?.tagName!=='BUTTON'){e.preventDefault();goTo(current-1);}
    if(e.key===' '&&e.target===document.body){e.preventDefault();revealNext();}
  });
  function ambientBeat(){
    if(motionOff||document.hidden||$('#intro-veil').hidden===false)return;
    const now=Date.now();if(now-lastInteraction<8500)return;lastInteraction=now;
    if(field.childElementCount<4&&count()<threshold()&&app.dataset.phase!=='quiet')revealNext();
  }
  function toggleMotion(force){
    motionOff=force;
    document.documentElement.classList.toggle('motion-off',motionOff);
    $('#motion-toggle').setAttribute('aria-pressed',String(motionOff));
    $('#motion-toggle').textContent=motionOff?'RESUME MOTION':'PAUSE MOTION';
  }
  toggleMotion(motionMedia.matches);
  $('#motion-toggle').addEventListener('click',()=>{motionOverride=true;toggleMotion(!motionOff);});
  motionMedia.addEventListener?.('change',e=>{if(!motionOverride)toggleMotion(e.matches);});
  function audioSupported(){return !!(window.AudioContext||window.webkitAudioContext);}
  function setAudioUi(on){
    $('#audio-toggle').textContent=on?'SOUND ON':'SOUND OFF';
    $('#audio-toggle').setAttribute('aria-pressed',String(on));
  }
  function stopSound(){
    if(ambient){
      try{ambient.osc.stop();ambient.osc.disconnect();ambient.gain.disconnect();}catch(e){}
      ambient=null;
    }
    setAudioUi(false);
  }
  $('#audio-toggle').addEventListener('click',async()=>{
    if(ambient){
      stopSound();return;
    }
    if(!audioSupported()){
      $('#audio-toggle').textContent='AUDIO UNAVAILABLE';$('#audio-toggle').disabled=true;return;
    }
    try {
      audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
      await audioCtx.resume();
      const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
      osc.type='sine';osc.frequency.value=83;
      gain.gain.value=.016;
      osc.connect(gain);gain.connect(audioCtx.destination);osc.start();
      ambient={osc,gain};
      setAudioUi(true);
    }catch(e){stopSound();$('#audio-toggle').textContent='AUDIO UNAVAILABLE';}
  });
  window.addEventListener('pagehide',()=>{
    stopSound();
    if(interval!==null){window.clearInterval(interval);interval=null;}
  });
  window.addEventListener('resize',resizeCanvas,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSound();});
  // Modest timer: text appears slowly, never flashes or accelerates uncontrollably.
  interval=window.setInterval(ambientBeat,12500);
  goTo(roomIndexFromHash(),false);
  resizeCanvas();
  $('#enter-spiral').focus({preventScroll:true});
  $('#spiral-app').dataset.ready='yes';
})();