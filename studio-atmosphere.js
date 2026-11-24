/* OVERFLOWISM · The Living Mind atmospheric controller.
   One cinematic source image stays untouched. Independent overlays respond to
   a non-linear emotional model; there is no interval slideshow or autoplay audio. */
(function(){
  'use strict';
  const room=document.querySelector('#entrance.studio-entrance');
  const layer=document.getElementById('studio-atmosphere');
  const model=window.OVERFLOW_EMOTIONS;
  if(!room || !layer || !model)return;

  let timer=null,active=false,started=false,current='peace';
  let manualUntil=0;
  const dust=layer.querySelector('.studio-atmo-dust');
  const embers=layer.querySelector('.studio-atmo-embers');
  const phases=Array.from(layer.querySelectorAll('.studio-atmo-phase'));
  let phaseIndex=-1;
  function particle(host,kind,i){
    const part=document.createElement('i');
    part.className='studio-atmo-particle studio-atmo-'+kind;
    // Layout is deterministic; temporal emotion changes are not.
    part.style.setProperty('--x',((i*37+13)%97)+'%');
    part.style.setProperty('--y',((i*19+11)%67)+'%');
    part.style.setProperty('--delay',((-i*3.7)%23)+'s');
    part.style.setProperty('--duration',(14+i%7*2.1)+'s');
    part.style.setProperty('--size',(i%4+1)+'px');
    host.appendChild(part);
  }
  if(dust)for(let i=0;i<11;i++)particle(dust,'dust',i);
  if(embers)for(let i=0;i<4;i++)particle(embers,'ember',i);

  const hexRgb = rgb=>rgb.join(',');
  function apply(plan,initial=false){
    current=plan.name;
    room.dataset.atmosphere=plan.name;
    room.dataset.atmosphereUndertone=plan.undertone||'';
    room.dataset.atmosphereWeather=plan.weather;
    room.style.setProperty('--atmo-light',hexRgb(plan.light));
    room.style.setProperty('--atmo-shadow',hexRgb(plan.shadow));
    if(phases.length===2){
      const nextIndex=(phaseIndex+1)%2;
      const incoming=phases[nextIndex];
      incoming.style.setProperty('--phase-light',hexRgb(plan.light));
      incoming.style.setProperty('--phase-shadow',hexRgb(plan.shadow));
      incoming.classList.add('is-active');
      if(phaseIndex>=0)phases[phaseIndex].classList.remove('is-active');
      phaseIndex=nextIndex;
    }
    room.style.setProperty('--atmo-fire',plan.fire.toFixed(3));
    room.style.setProperty('--atmo-dust',plan.dust.toFixed(3));
    room.style.setProperty('--atmo-intensity',plan.intensity.toFixed(3));
    if(!initial){
      room.dispatchEvent(new CustomEvent('studio:atmosphere',{
        detail:{mood:plan.name,undertone:plan.undertone,intensity:plan.intensity,weather:plan.weather,station:plan.artist}
      }));
    }
  }
  function initialPlan(){
    const s=model.STATES.peace;
    return {name:'peace',undertone:'bloom',weather:s.weather,light:s.light,shadow:s.shadow,
      fire:s.fire,dust:s.dust,intensity:s.intensity,artist:s.artist};
  }
  function canRun(){
    return !document.hidden && !room.hidden && !document.documentElement.classList.contains('motion-off');
  }
  function stop(){
    if(timer!==null){clearTimeout(timer);timer=null;}
    active=false;
    layer.classList.add('studio-atmo-paused');
  }
  function schedule(ms){
    if(timer!==null)clearTimeout(timer);
    if(!active)return;
    timer=window.setTimeout(()=>{
      timer=null;
      if(!canRun()){stop();return;}
      if(Date.now()<manualUntil){schedule(manualUntil-Date.now()+6000);return;}
      const plan=model.next(current);
      apply(plan);
      schedule(plan.dwell);
    },ms);
  }
  function sync(){
    if(!canRun()){stop();return;}
    if(active)return;
    active=true;
    layer.classList.remove('studio-atmo-paused');
    if(!started){started=true;apply(initialPlan(),true);}
    // Allow visitors time to see the approved sunset scene before the first shift.
    schedule(24000+Math.floor(Math.random()*18000));
  }
  room.addEventListener('studio:manual-action',()=>{
    manualUntil=Date.now()+20000;
    if(active)schedule(26000);
  });
  document.getElementById('motion-toggle')?.addEventListener('click',()=>queueMicrotask(sync));
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('hashchange',()=>queueMicrotask(sync));
  window.addEventListener('pagehide',stop);
  const observer=new MutationObserver(sync);
  observer.observe(room,{attributes:true,attributeFilter:['hidden']});
  observer.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  room.dataset.atmosphereReady='yes';
  sync();
})();
