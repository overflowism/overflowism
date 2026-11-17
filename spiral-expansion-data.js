/* OVERFLOWISM — THE SPIRAL: 8 added rooms, editable content and positive spirals.
   Extends the five original rooms without rewriting or removing them.
   Source of truth: Marcela Thomas's 2026 Overflowism manifesto. */
(function () {
  'use strict';
  const d=window.SPIRAL_CONTENT;
  if(!d)throw new Error('Load spiral-data.js before spiral-expansion-data.js');
  const additional=[
    {id:'creative',name:'THE CREATIVE SPIRAL',subtitle:'One idea becomes a universe.',caption:'A thought becomes a thousand possibilities.',palette:['#141029','#6242b0','#ffb8e4'],opening:['It started as a single thought.','Then one color became a universe.'],phrases:['What if I made something no one has seen?','An idea does not have to ask permission.','The unfinished thing is already alive.','Every mark invites another.','I create what I cannot contain.'],themes:['creative','curious','joyful','hopeful'],motif:'brushstrokes'},
    {id:'joy',name:'THE JOY SPIRAL',subtitle:'Happiness has a way of multiplying.',caption:'Joy can overflow too.',palette:['#174f5b','#e7a25e','#fff0a9'],opening:['Something beautiful is happening.','I want to stay inside this moment.'],phrases:['I did not expect this much happiness.','What if the good keeps growing?','I can feel joy without explaining it.','Look at all the little miracles.','I am allowed to celebrate.'],themes:['joyful','playful','grateful','hopeful'],motif:'bloom'},
    {id:'love',name:'THE LOVE SPIRAL',subtitle:'Some feelings just keep growing.',caption:'Affection moves in both directions.',palette:['#35132b','#b65782','#ffc5c7'],opening:['I feel the pull.','What if I let this be beautiful?'],phrases:['I love the way this feeling grows.','I can love without losing myself.','Being seen is its own kind of magic.','My heart can hold two truths.','Some connections are quiet and enormous.'],themes:['romantic','joyful','contradictory','comforting'],motif:'ribbons'},
    {id:'wonder',name:'THE WONDER SPIRAL',subtitle:"There's always something more to discover.",caption:'An infinite world inside a small detail.',palette:['#122642','#346ba0','#c0e8fc'],opening:['Look closer.','There is a universe inside this doorway.'],phrases:['I wonder what is beyond this horizon.','Every answer opens another door.','What if I have only begun to see?','A small detail contains another world.','Curiosity is a kind of courage.'],themes:['curious','creative','playful','hopeful'],motif:'portals'},
    {id:'gratitude',name:'THE GRATITUDE SPIRAL',subtitle:'The more beauty you notice, the more you discover.',caption:'Small things become a constellation.',palette:['#253323','#648a57','#f3d996'],opening:['I noticed one good thing.','Then I began to see more.'],phrases:['There is beauty in the ordinary.','I remember who helped me grow.','I am grateful for this exact moment.','Even the smallest light counts.','Appreciation turns attention into art.'],themes:['grateful','joyful','reflective','comforting'],motif:'constellation'},
    {id:'possibility',name:'THE POSSIBILITY SPIRAL',subtitle:'But what if it all works out?',caption:'Every door holds a different possibility.',palette:['#183d48','#5877ba','#ffd4a0'],opening:['What if it all works out?','What if the next door surprises me?'],phrases:['The future has more than one doorway.','I can choose without knowing the ending.','There might be more room than I imagined.','A new path is not a promise, it is an invitation.','What if the unexpected is wonderful?'],themes:['hopeful','curious','creative','affirming'],motif:'doorways'},
    {id:'becoming',name:'THE BECOMING SPIRAL',subtitle:'You can change without losing yourself.',caption:'The architecture changes with you.',palette:['#193b39','#708a95','#c5e5b1'],opening:['I am not who I was.','I still recognize the part that matters.'],phrases:['I can become without erasing my past.','Growth changes the shape of a room.','I am learning as I go.','What if change looks beautiful from here?','The next version is still me.'],themes:['affirming','reflective','hopeful','creative'],motif:'metamorphosis'},
    {id:'affirmation',name:'THE AFFIRMATION SPIRAL',subtitle:'What you nurture in your mind begins to take form.',caption:'A living positive thought, never a forced ending.',palette:['#34254a','#a487cf','#ffe2a9'],opening:['I am allowed to take up space.','I can be a work in progress and still be worthy.'],phrases:['I deserve good things.','I trust myself to figure things out.','My creativity has no limits.','Good things can happen to me, too.','I am becoming someone I am proud of.'],themes:['affirming','comforting','hopeful','grateful'],motif:'affirmation'}
  ];
  additional.forEach(r=>{r.atlasId='spiral-'+r.id;d.rooms.push(r);d.thresholds[r.id]=r.id==='affirmation'?7:5;});
  Object.assign(d.categories,{
    anxious:['What if I am not ready?','I can feel uncertain and still move.','What if I choose wrong?'],
    creative:['One idea becomes a universe.','The color keeps speaking.','What if I create the impossible?'],
    curious:['What exists behind this door?','Look closer.','Maybe the small things hold more.'],
    grateful:['I notice the light on the wall.','This moment is enough to remember.','I am thankful for what I have learned.'],
    affirming:['I deserve good things.','I can learn to trust myself.','I am allowed to begin again.'],
    playful:['What if we follow the butterflies?','This feels like magic.','I can be serious about joy.']
  });
  d.affirmations=[
    'I am allowed to take up space.',
    'What if everything works out better than I imagined?',
    'I deserve good things.',
    'I am capable of creating beautiful things.',
    'I trust myself to figure things out.',
    "I don't have to have everything figured out.",
    'My creativity has no limits.',
    'I am allowed to begin again.',
    'Good things can happen to me, too.',
    "I am becoming someone I'm proud of.",
    'I can be a work in progress and still be worthy.',
    'My voice and my imagination matter.',
    'I am allowed to feel joy today.'
  ];
  d.connections={
    loop:['creative','possibility'],collapse:['joy','stillness'],whispers:['love','affirmation'],
    stillness:['wonder','creative'],creative:['wonder','becoming'],joy:['gratitude','love'],
    love:['whispers','affirmation'],wonder:['creative','possibility'],
    gratitude:['joy','affirmation'],possibility:['loop','becoming'],
    becoming:['stillness','affirmation'],affirmation:['becoming','joy','whispers']
  };
  d.worldStatement="A spiral doesn't always mean you're falling apart. Sometimes it means you're expanding.";
  d.artworkRooms=d.rooms.map(r=>({world:'spiral',room:r.id,artwork:null}));
})();