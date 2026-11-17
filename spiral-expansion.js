/* Overflowism: immersive additions to THE SPIRAL. All thoughts are curated and local.
   This script decorates the existing scene; it never replaces the original five rooms. */
(function(){
  'use strict';
  const d=window.SPIRAL_CONTENT,app=document.querySelector('#spiral-app');
  if(!d||!app||!document.querySelector('#room-selector'))return;
  const $=s=>document.querySelector(s);
  const scene=$('#scene'),experience=$('#experience');
  const roomById=id=>d.rooms.find(r=>r.id===id);
  const add=(tag,classes,text,parent)=>{
    const el=document.createElement(tag);if(classes)el.className=classes;
    if(text!==undefined)el.textContent=text;
    if(parent)parent.append(el);
    return el;
  };
  const el=add('div','living-installation',undefined,experience);
  el.id='living-installation';
  // In the narrow/mobile layout, the installation sits before room controls.
  experience.insertBefore(el,$('#room-actions'));
  el.setAttribute('aria-label','Living interactive artwork in this room');
  const sky=add('div','living-sky',undefined,scene);
  sky.setAttribute('aria-hidden','true');
  const constellation=document.createElementNS('http://www.w3.org/2000/svg','svg');
  constellation.setAttribute('viewBox','0 0 800 500');
  constellation.setAttribute('preserveAspectRatio','xMidYMid meet');
  constellation.setAttribute('aria-hidden','true');
  constellation.classList.add('thought-constellation');
  el.append(constellation);
  const carried=add('div','carried-affirmation',undefined,experience);
  carried.hidden=true;
  experience.insertBefore(carried,$('.scene-copy'));
  carried.setAttribute('aria-live','polite');
  const carryMark=add('span','carry-symbol','✳',carried);
  const carryText=add('span','carry-text','',carried);
  const carryClear=add('button','carry-clear','RELEASE ×',carried);
  carryClear.type='button';carryClear.setAttribute('aria-label','Stop carrying this affirmation');
  let carriedThought=null,activeRoom='',roomVisit=0,points=[],artPulse=0;
  const newRooms=new Set(['creative','joy','love','wonder','gratitude','possibility','becoming','affirmation']);
  const affirmations=d.affirmations||[];
  const markWords=(text)=>{$('#live-whisper').textContent=text;};
  function showCarry(){
    carried.hidden=!carriedThought;
    carryText.textContent=carriedThought||'';
    app.classList.toggle('has-carried-thought',!!carriedThought);
  }
  carryClear.addEventListener('click',()=>{carriedThought=null;showCarry();markWords('The carried thought has been released.');});
  function pulseThought(message){
    markWords(message);
    const r=roomById(app.dataset.room);
    // The existing whisper engine owns the canvas transformation and progress.
    // Its button click is the single source for adding a new artistic layer.
    if(r&&newRooms.has(r.id))$('#explore')?.click();
    // Announce the chosen interactive thought after the shared engine adds its layer.
    markWords(message);
    artPulse++;
    el.style.setProperty('--pulse-count',String(artPulse));
    el.classList.remove('reacting');
    // Reflow restarts a tiny optional flourish without forced camera movement.
    void el.offsetWidth;
    el.classList.add('reacting');
  }
  function chooseAffirmation(index,source){
    const a=affirmations[(index+affirmations.length)%affirmations.length];
    if(!a)return;
    const phrase=add('p','discovered-affirmation',a,el);
    phrase.dataset.source=source;
    phrase.style.setProperty('--step',String(index%9));
    if(el.querySelectorAll('.discovered-affirmation').length>5)el.querySelector('.discovered-affirmation')?.remove();
    pulseThought(a);
    return a;
  }
  function makeObject(symbol,label,kind,index,action){
    const b=add('button','living-object kind-'+kind,undefined,el);
    b.type='button';b.dataset.kind=kind;b.dataset.step=String(index);
    const artwork=add('span','living-object-art',symbol,b);
    artwork.setAttribute('aria-hidden','true');
    const caption=add('span','living-object-label',label,b);
    b.setAttribute('aria-label',label);
    b.addEventListener('click',()=>action(index,b));
    return b;
  }
  function connectStars(){
    constellation.replaceChildren();
    if(points.length<2)return;
    const poly=document.createElementNS('http://www.w3.org/2000/svg','polyline');
    poly.setAttribute('points',points.map(p=>p.join(',')).join(' '));
    poly.setAttribute('fill','none');
    poly.setAttribute('stroke','#ffe7a5');
    poly.setAttribute('stroke-width','1.8');
    poly.setAttribute('stroke-linecap','round');
    poly.setAttribute('stroke-linejoin','round');
    poly.setAttribute('stroke-dasharray','4 8');
    constellation.append(poly);
    for(const [x,y] of points){
      const circle=document.createElementNS('http://www.w3.org/2000/svg','circle');
      circle.setAttribute('cx',x);circle.setAttribute('cy',y);circle.setAttribute('r','4.5');
      circle.setAttribute('fill','#fff4d8');constellation.append(circle);
    }
  }
  function renderAffirmation(){
    el.classList.add('is-affirmation');
    const mirror=makeObject('◇','MIRROR OF BECOMING','mirror',0,(i,b)=>{
      const chosen=chooseAffirmation((roomVisit+i+artPulse)%affirmations.length,'mirror');
      b.querySelector('.living-object-art').textContent='✧';
      b.setAttribute('aria-label','Mirror affirmation: '+chosen+'. Explore again');
    });
    mirror.classList.add('large-object');
    makeObject('✿','GARDEN OF WORDS','garden',1,(i,b)=>{
      const a=chooseAffirmation((i+artPulse+3)%affirmations.length,'garden');
      b.querySelector('.living-object-art').textContent=artPulse%2?'✿':'❀';
      b.classList.add('bloomed');
      b.setAttribute('aria-label','Flower grew from: '+a+'. Nurture another word');
    });
    makeObject('◎','ECHO A THOUGHT','echo',2,(i,b)=>{
      const first=chooseAffirmation((i+artPulse+5)%affirmations.length,'echo');
      const second=affirmations[(i+artPulse+6)%affirmations.length];
      const echo=add('span','echo-satellite',second,b);
      if(b.querySelectorAll('.echo-satellite').length>2)b.querySelector('.echo-satellite')?.remove();
      markWords('One thought: '+first+' Another: '+second);
    });
    makeObject('✦','AFFIRMATION CONSTELLATION','star',3,(i,b)=>{
      const idx=points.length;
      const locs=[[245,240],[440,155],[565,315],[335,90],[630,125],[180,355],[480,410],[630,405]];
      points.push(locs[idx%locs.length]);connectStars();
      chooseAffirmation((idx+artPulse)%affirmations.length,'constellation');
      b.querySelector('.living-object-art').textContent=idx%2?'✧':'✦';
    });
    const carry=add('div','affirmation-choose',undefined,el);
    add('p','affirmation-instruction','CARRY A THOUGHT INTO ANOTHER ROOM · OPTIONAL',carry);
    const choice=add('select','affirmation-select',undefined,carry);
    choice.setAttribute('aria-label','Choose an affirmation to carry');
    add('option','', 'CHOOSE A THOUGHT',choice).value='';
    affirmations.forEach((a,i)=>{const o=add('option','',a,choice);o.value=String(i);});
    const button=add('button','carry-action','CARRY THIS THOUGHT ↗',carry);
    button.type='button';
    button.addEventListener('click',()=>{
      if(choice.value===''){markWords('Choose an affirmation first, or explore freely.');choice.focus();return;}
      carriedThought=affirmations[Number(choice.value)];
      showCarry();markWords('Carrying: '+carriedThought);
    });
    add('p','affirmation-permission','Every feeling is welcome. You can skip this room or release the thought whenever you like.',carry);
  }
  const scenes={
    creative:{objects:[['✳','FOLLOW AN IDEA','paint'],['◌','ADD A COLOR','paint'],['✺','LET IT MULTIPLY','paint']],intro:'Every idea becomes a mark. Let it grow without needing to finish.'},
    joy:{objects:[['✿','DISCOVER A FLOWER','flower'],['🦋','FOLLOW A BUTTERFLY','butterfly'],['☼','REVEAL THE SUNLIGHT','sun']],intro:'A moment of delight opens another.'},
    love:{objects:[['♡','FOLLOW A THREAD','ribbon'],['❦','LET A PETAL GO','petal'],['∞','LINK TWO FEELINGS','ribbon']],intro:'Affection can grow without asking you to lose yourself.'},
    wonder:{objects:[['◎','LOOK INSIDE THE PORTAL','portal'],['◇','LOOK CLOSER','portal'],['✧','FIND ANOTHER WORLD','portal']],intro:'Each detail holds a doorway to something you have not seen.'},
    gratitude:{objects:[['✦','NOTICE A SMALL LIGHT','star'],['✳','FOLLOW A DETAIL','star'],['❋','LET GRATITUDE GROW','flower']],intro:'Notice one beautiful thing. Another will follow.'},
    possibility:{objects:[['Ⅰ','OPEN ONE DOOR','door'],['Ⅱ','OPEN ANOTHER','door'],['Ⅲ','CHOOSE A NEW PATH','door']],intro:'Each door offers a possibility, never a guaranteed ending.'},
    becoming:{objects:[['◈','SHIFT A SHAPE','morph'],['✦','LET THE LIGHT CHANGE','morph'],['❃','BECOME AGAIN','flower']],intro:'Returning to an old place can show you something new.'}
  };
  function render(){
    const r=roomById(app.dataset.room);
    if(!r||activeRoom===r.id)return;
    activeRoom=r.id;roomVisit++;artPulse=0;points=[];
    el.replaceChildren();el.append(constellation);constellation.replaceChildren();
    el.className='living-installation';el.dataset.room=r.id;
    sky.dataset.room=r.id;
    if(!newRooms.has(r.id)){el.hidden=true;return;}
    el.hidden=false;
    const sceneData=scenes[r.id];
    if(r.id==='affirmation')renderAffirmation();
    else if(sceneData){
      el.classList.add('is-'+r.id);
      const statement=add('p','living-description',sceneData.intro,el);
      statement.id='living-description';
      for(const [i,item] of sceneData.objects.entries()){
        makeObject(item[0],item[1],item[2],i,(ix,b)=>{
          b.classList.toggle('discovered');
          app.style.setProperty('--discovery-shift',String(artPulse+1));
          if(r.id==='wonder')b.classList.toggle('zoomed');
          if(r.id==='becoming')b.querySelector('.living-object-art').textContent=artPulse%2?'❃':'✧';
          const phrase=r.phrases[(ix+artPulse)%r.phrases.length];
          pulseThought(phrase);
        });
      }
    }
    markWords(r.name+'. '+r.subtitle);
  }
  const observer=new MutationObserver(render);
  observer.observe(app,{attributes:true,attributeFilter:['data-room']});
  render();showCarry();
  app.dataset.expanded='yes';
  // Only in-memory state: no visitor text or selected affirmations are persisted or transmitted.
  window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
})();