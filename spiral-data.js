/* OVERFLOWISM — THE SPIRAL / editable world content.
   The mind's contradictions become visible form. No psychiatric diagnosis or visitor profiling.
   Add quotations, rooms, and artwork assignments here without changing the renderer. */
(function () {
  'use strict';
  const rooms = [
    { id:'whispers', atlasId:'spiral-whispers', name:'THE WHISPERS', subtitle:'Everything you never said.',
      caption:'The walls begin whispering.', palette:['#0c0b13','#51263e','#c3a5c7'],
      opening:['Are you listening?','Or are you thinking again?','Welcome to the inside of your mind.'],
      phrases:['I miss you.','I hope you never come back.','Do you think about me?','Why do I care?','I wish you could hear my thoughts.','Maybe everything will work out.','I am capable of being surprised by happiness.'] },
    { id:'loop', atlasId:'spiral-loop', name:'THE LOOP', subtitle:'Here we go again.',
      caption:'A thought. Again. And again.', palette:['#0a0b16','#3a2b65','#b2a8cd'],
      opening:['What if?','What if?','WHAT IF?'],
      phrases:['Did I do something wrong?','Maybe I should check again.','I already know the answer.','Then why am I asking?','What if I am allowed not to know?','I keep returning to the beginning.'] },
    { id:'mirror', atlasId:'spiral-mirror', name:'THE MIRROR', subtitle:"The thoughts you don't want to admit.",
      caption:'Not every reflection tells the same story.', palette:['#0b1523','#4d375b','#b7b5d5'],
      opening:['What if I am the one standing in my own way?','I do not always recognize myself.'],
      phrases:['Am I afraid of losing them or being alone?',"Why do I want approval from someone who doesn't see me?",'What if I am the one standing in my own way?',"I don't always recognize myself.",'I am more than my worst thought.'] },
    { id:'collapse', atlasId:'spiral-collapse', name:'THE COLLAPSE', subtitle:'When everything becomes too much.',
      caption:'The thoughts cross a threshold.', palette:['#160811','#762343','#e6a6bd'],
      opening:['LEAVE ME ALONE.','PLEASE STAY.','I CAN DO THIS.','WHAT IF I CAN’T?'],
      phrases:["I'M FINE.","I'M NOT FINE.",'I LOVE THIS.','I HATE THIS.','I WANT EVERYTHING.','I WANT NOTHING.','THIS IS TOO MUCH.','SOMEHOW, I AM STILL HERE.'] },
    { id:'stillness', atlasId:'spiral-stillness', name:'THE STILLNESS', subtitle:'And then, for a moment, silence.',
      caption:'Not an ending. A place to rest.', palette:['#11131d','#3b384d','#f3d2ab'],
      opening:["I don't have to figure everything out tonight.",'Not every thought is the truth.'],
      phrases:['I can feel everything and still be okay.','Maybe the unknown can be beautiful.','I am allowed to begin again.','There is room for uncertainty.','And what if tomorrow is different?'] }
  ];
  // Ten editable emotional categories; keep the full range of Overflowism.
  const categories = {
    dark:['Nobody understands me.','Everything is falling apart.','The room feels too small.'],
    hopeful:["Maybe I haven't met my people yet.","What if it's falling into place?",'This moment does not define the next.'],
    romantic:['I miss you.','Do you think about me?','I keep the words I never sent.'],
    insecure:['What if I am not enough?','Did I do something wrong?','What if I misunderstood everything?'],
    obsessive:['Maybe I should check again.','What if?','I can ask the same question forever.'],
    unhinged:['LEAVE ME ALONE.','PLEASE STAY.','I WANT EVERYTHING. I WANT NOTHING.'],
    joyful:['I am finally happy.','This could be the beginning of something beautiful.','I never want this moment to end.'],
    contradictory:['I never want to see you again. God, I miss you.','I love this. I hate this.','I am finally happy. Then why am I crying?'],
    reflective:['Why do I care?','I do not always recognize myself.','How did I get here?'],
    comforting:['Not every thought is the truth.','I still deserve to take up space.',"I don't have to figure everything out tonight."]
  };
  const opposites = [
    {first:'Nobody understands me.',second:"Maybe I haven't met my people yet.",family:'belonging'},
    {first:"I'm terrified of failing.",second:'What if I succeed beyond my imagination?',family:'possibility'},
    {first:'I hate how much I care.',second:'The ability to feel deeply is part of being human.',family:'love'},
    {first:'Everything is falling apart.',second:"What if it's falling into place?",family:'uncertainty'},
    {first:'I never want to see you again.',second:'God, I miss you.',family:'longing'},
    {first:"I'm finally happy.",second:'Then why am I crying?',family:'contradiction'},
    {first:'Everything is going to be okay.',second:"But what if it isn't?",family:'fear'},
    {first:'I can do this.',second:"What if I can't?",family:'courage'},
    {first:'I want to leave.',second:'I want to be found.',family:'connection'},
    {first:'I am not ready.',second:'What if I already am?',family:'growth'},
    {first:'I am afraid to feel this.',second:'This joy is mine too.',family:'joy'}
  ];
  const thresholds = { whispers:5,loop:6,mirror:4,collapse:9,stillness:4 };
  window.SPIRAL_CONTENT = { rooms,categories,opposites,thresholds };
})();