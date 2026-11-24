/* Overflowism · the artist's living studio.
   The avatar, paintings, light and sound respond to the room; no visitor data is stored.
   This augments the existing emotional atlas instead of replacing its navigation. */
(function(){
  'use strict';
  const room=document.querySelector('#entrance.studio-entrance');
  if(!room)return;
  const $=selector=>room.querySelector(selector);
  const avatar=$('#studio-avatar'),paint=$('#studio-paint-surface'),ctx=paint?.getContext('2d');
  const name=$('#studio-emotion-name'),line=$('#studio-emotion-line'),temp=$('#studio-temp-fill'),track=$('#studio-temp-track');
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const stations=[
    {id:'paint',x:50,y:54,mood:'creative',heat:76,title:'CREATING',line:'The feeling becomes another layer of color.'},
    {id:'code',x:77,y:63,mood:'wonder',heat:62,title:'BUILDING',line:'Code is another kind of canvas.'},
    {id:'dance',x:54,y:56,mood:'joy',heat:91,title:'JOY',line:'Sometimes happiness has to move.'},
    {id:'roses',x:68,y:58,mood:'love',heat:72,title:'LOVE',line:'Some feelings bloom before they have a name.'},
    {id:'windows',x:63,y:46,mood:'stillness',heat:29,title:'WONDER',line:'A faraway horizon changes the room inside.'},
    {id:'fire',x:60,y:61,mood:'chaos',heat:86,title:'THE THRESHOLD',line:'Even the difficult feelings belong here.'}
  ];
  const stationMap=new Map(stations.map(s=>[s.id,s]));
  let index=0,autoplay=null,marked=0,painting=false,paintMoves=0,brushColor=0,audio=null,scheduled=null;
  let audioStarting=false,audioGeneration=0;
  const colors=['#b32141','#315a9c','#f5c15a','#e19ab6','#223c39','#ec7650','#f2ead4'];
  const announce=txt=>{const live=$('#studio-announcement');if(live)live.textContent=txt;};
  const mark=(txt,spoken=false)=>{const output=$('#studio-words-output');if(output)output.textContent=txt;if(spoken)announce(txt);};
  function paintSeed(){
    if(!ctx)return;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,paint.width,paint.height);
    const grd=ctx.createLinearGradient(0,0,paint.width,paint.height);
    grd.addColorStop(0,'#e4cfbd');grd.addColorStop(.52,'#f3e3c7');grd.addColorStop(1,'#bcaaa8');
    ctx.fillStyle=grd;ctx.fillRect(0,0,paint.width,paint.height);
    // Make room for an unfinished painting; initial smudges are a work in progress.
    for(let i=0;i<25;i++){
      const x=(Math.sin(i*14.1)+1)*paint.width*.45;
      const y=(Math.cos(i*7.2)+1)*paint.height*.4;
      ctx.fillStyle=i%3?'#bb8d8655':'#30202b25';
      ctx.fillRect(x,y,10+i%6*3,5+i%5*4);
    }
  }
  function stroke(x,y,spoken=false){
    if(!ctx)return;
    const r=12+(marked%8)*4;
    ctx.save();
    ctx.globalAlpha=.85;
    ctx.fillStyle=colors[brushColor%colors.length];
    for(let p=0;p<5;p++){
      const angle=Math.PI*2*p/5;
      ctx.beginPath();
      ctx.ellipse(x+Math.cos(angle)*r*.75,y+Math.sin(angle)*r*.75,r*.52,r*.83,angle,0,Math.PI*2);
      ctx.fill();
    }
    ctx.fillStyle=marked%3?'#e7a551':'#271923';ctx.beginPath();ctx.arc(x,y,r*.35,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=colors[(brushColor+3)%colors.length];ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(x,y+r);ctx.quadraticCurveTo(x-13,y+r*2,x+10,y+r*3);ctx.stroke();
    ctx.restore();marked++;brushColor++;
    mark('A feeling became a mark. ' + marked + ' layers of release.',spoken);
  }
  function randomMark(spoken=false){
    const x=35+((marked*83+41)%(paint.width-70));
    const y=65+((marked*59+39)%(paint.height-140));
    stroke(x,y,spoken);
  }
  paintSeed();
  const at=(event)=>{
    const box=paint.getBoundingClientRect();
    return{x:(event.clientX-box.left)/box.width*paint.width,y:(event.clientY-box.top)/box.height*paint.height};
  };
  paint.addEventListener('pointerdown',event=>{
    painting=true;paintMoves=0;paint.setPointerCapture?.(event.pointerId);
    const p=at(event);stroke(p.x,p.y,true);
  });
  paint.addEventListener('pointermove',event=>{
    if(!painting)return;
    paintMoves++;
    if(paintMoves%2!==0)return; // Independent of the mark count; drawing cannot deadlock.
    const p=at(event);stroke(p.x,p.y);
  });
  paint.addEventListener('pointerup',()=>{painting=false;});
  paint.addEventListener('pointercancel',()=>{painting=false;});
  paint.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){event.preventDefault();randomMark(true);}
  });
  $('#studio-mark')?.addEventListener('click',()=>{
    setStation('paint',true);randomMark(true);
  });
  function setStation(id,manual=false){
    const s=stationMap.get(id);
    if(!s)return;
    index=stations.indexOf(s);
    room.dataset.mood=s.mood;
    const moving=!media.matches&&!document.documentElement.classList.contains('motion-off');
    avatar.dataset.action=moving?'walk':s.id;
    avatar.style.setProperty('--avatar-x',s.x+'%');
    avatar.style.setProperty('--avatar-y',s.y+'%');
    name.textContent=s.title;line.textContent=s.line;
    temp.style.width=s.heat+'%';
    track.setAttribute('aria-valuenow',String(s.heat));
    room.querySelectorAll('[data-studio-stop]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.studioStop===id)));
    // Walk into the station, then act in place.
    clearTimeout(scheduled);
    if(moving){
      scheduled=window.setTimeout(()=>{avatar.dataset.action=s.id;},2200);
    }
    if(id==='paint'&&!manual&&marked<16)randomMark();
    $('.laptop-screen')?.classList.toggle('coding',id==='code');
    if(manual){announce(s.title+'. '+s.line);room.dispatchEvent(new CustomEvent('studio:manual-action'));resetTour();}
  }
  const allowAuto=()=>!media.matches&&!document.documentElement.classList.contains('motion-off')&&!document.hidden&&!room.hidden;
  function autoplayStep(){
    if(!allowAuto())return;
    setStation(stations[(index+1)%stations.length].id);
  }
  function resetTour(){
    if(autoplay)window.clearInterval(autoplay);
    if(document.getElementById('studio-atmosphere'))return; // The Living Mind now drives autonomous behavior.
    autoplay=window.setInterval(autoplayStep,10000);
  }
  room.querySelectorAll('[data-studio-stop]').forEach(b=>{
    b.addEventListener('click',()=>setStation(b.dataset.studioStop,true));
  });
  room.addEventListener('studio:atmosphere',event=>{
    const station=event.detail?.station;
    if(stationMap.has(station))setStation(station);
  });
  setStation('paint');resetTour();
  const toggle=$('#studio-words-toggle'),form=$('#studio-words'),text=$('#studio-word-input');
  toggle?.addEventListener('click',()=>{
    const open=form.hidden;
    form.hidden=!open;toggle.setAttribute('aria-expanded',String(open));
    if(open)text.focus();
  });
  form?.addEventListener('submit',event=>{
    event.preventDefault();
    const msg=text.value.trim().slice(0,90);
    if(!msg){text.focus();return;}
    // Render plain text only: a private thought is never transmitted or persisted.
    setStation('paint',true);randomMark();text.value='';
    mark('“'+msg+'” — released into the room.',true);
  });
  // Optional synthesized room tone. One in-flight initialization at a time;
  // contexts are closed on off, hidden, navigation, and errors.
  const soundButton=$('#studio-sound');
  function soundLabel(enabled){
    if(!soundButton)return;
    soundButton.textContent=enabled?'SOUND ON ♫':'SOUND OFF ♫';
    soundButton.setAttribute('aria-pressed',String(enabled));
  }
  async function soundOff(){
    audioGeneration++; // Invalidates pending resume() on a hidden/unloaded page.
    const previous=audio;
    audio=null;
    soundLabel(false);
    if(previous){
      try{previous.osc.stop();}catch(e){}
      try{previous.osc.disconnect();previous.gain.disconnect();}catch(e){}
      try{await previous.ctx.close();}catch(e){}
    }
  }
  soundButton?.addEventListener('click',async()=>{
    // Guard synchronous double clicks while resume() or close() is in flight.
    if(audioStarting)return;
    audioStarting=true;
    soundButton.disabled=true;
    let localContext=null,localOsc=null,localGain=null;
    try{
      if(audio){await soundOff();return;}
      const C=window.AudioContext||window.webkitAudioContext;
      if(!C){soundButton.textContent='AUDIO UNAVAILABLE';return;}
      const generation=++audioGeneration;
      localContext=new C();
      await localContext.resume();
      if(generation!==audioGeneration)return; // Visibility/pagehide canceled start.
      localOsc=localContext.createOscillator();
      localGain=localContext.createGain();
      localOsc.type='sine';localOsc.frequency.value=109;localGain.gain.value=.014;
      localOsc.connect(localGain);localGain.connect(localContext.destination);
      localOsc.start();
      audio={ctx:localContext,osc:localOsc,gain:localGain};
      // The active object now owns this context; the finally block must not close it.
      localContext=null;localOsc=null;localGain=null;
      soundLabel(true);
    }catch(e){
      await soundOff();
      soundButton.textContent='AUDIO UNAVAILABLE';
    }finally{
      if(localOsc){try{localOsc.stop();localOsc.disconnect();}catch(e){}}
      if(localGain){try{localGain.disconnect();}catch(e){}}
      if(localContext){try{await localContext.close();}catch(e){}}
      audioStarting=false;
      if(soundButton.textContent!=='AUDIO UNAVAILABLE')soundButton.disabled=false;
    }
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)void soundOff();});
  window.addEventListener('pagehide',()=>{
    if(autoplay)clearInterval(autoplay);
    clearTimeout(scheduled);
    void soundOff();
  });
  // Decorative elements can be paused from the site's existing PAUSE MOTION button.
  room.dataset.studioReady='yes';
})();