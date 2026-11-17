/* Overflowism — emotional atlas. Edit or add rooms here, not in the rendering code. */
(function () {
  'use strict';
  const worlds = [
    { id: 'watchers', name: 'THE WATCHERS', label: 'Fear · Identity · Protection', line: 'What happens when the mind never stops watching?', symbol: '◉', colors: ['#161b34', '#7777aa', '#c3b4de'] },
    { id: 'noise', name: 'THE NOISE', label: 'Intensity · Chaos · Energy', line: "Some minds don't whisper. They arrive all at once.", symbol: '✳', colors: ['#181448', '#6652da', '#e65ab0'] },
    { id: 'bloom', name: 'THE BLOOM', label: 'Joy · Growth · Wonder', line: 'Even the most complicated mind can grow something beautiful.', symbol: '✿', colors: ['#164d4d', '#66a58a', '#f6ba72'] },
    { id: 'heart', name: 'THE HEART', label: 'Love · Loss · Attachment', line: "Some people leave. Their feelings don't.", symbol: '♡', colors: ['#491a3c', '#be5d81', '#f0b1b6'] },
    { id: 'spiral', name: 'THE SPIRAL', label: 'Contradiction · Thinking · Becoming', line: 'The walls begin whispering.', symbol: '◎', colors: ['#0c0b13', '#51263e', '#c3a5c7'] },
    { id: 'undercurrent', name: 'THE UNDERCURRENT', label: 'Stillness · In-between · Rest', line: "For everything that doesn't have a name yet.", symbol: '◌', colors: ['#1d2437', '#60788d', '#b5a9c7'] }
  ];
  // id | world | name | feelings | poetic invitation
  const rooms = "the-alarm|watchers|The Alarm|Fear, anxiety, panic|Some thoughts sound like sirens.\nthe-gaze|watchers|The Gaze|Judgment, insecurity, embarrassment|Who are you when nobody is looking?\nthe-spiral|watchers|The Spiral|Overthinking, rumination, worry|The same question in a thousand voices.\nthe-mask|watchers|The Mask|Shame, masking, hiding|How much of yourself do you hide?\nthe-mirror|watchers|The Mirror|Identity, self-doubt, reflection|There is more than one version of a truth.\nthe-waiting-room|watchers|The Waiting Room|Dread, anticipation, uncertainty|What if the answer never arrives?\nthe-exit-sign|watchers|The Exit Sign|Fear of rejection, abandonment|Not every goodbye means you were forgotten.\nthe-guard-tower|watchers|The Guard Tower|Hypervigilance, distrust|I learned to notice everything.\nthe-verdict|watchers|The Verdict|Guilt, harsh self-criticism|You are more than your hardest thought.\nthe-boundary|watchers|The Boundary|Self-protection, defensiveness|A boundary can be a way to love.\n100-tabs-open|noise|100 Tabs Open|Distractibility, curiosity, overwhelm|A million ideas and nowhere to put them.\nthe-static|noise|The Static|Sensory overload, overstimulation|Everything is talking.\nthe-spark|noise|The Spark|Curiosity, excitement, invention|One idea becomes a universe.\nthe-tunnel|noise|The Tunnel|Hyperfocus, deep absorption|For a moment, nothing else exists.\nthe-stuck-door|noise|The Stuck Door|Task paralysis, frustration|I know where I want to go.\nthe-fuse|noise|The Fuse|Anger, frustration, resentment|Some emotions refuse to whisper.\nthe-impulse|noise|The Impulse|Urgency, impulsivity|Not every open door needs opening.\nthe-accelerator|noise|The Accelerator|Elevated energy, racing thoughts|The ceiling is suddenly too low.\nthe-collision|noise|The Collision|Contradiction, agitation, mixed feelings|Two truths can happen at once.\nthe-burnout|noise|The Burnout|Exhaustion, depletion, overwhelm|Even bright things need rest.\nbutterfly-garden-walkway|bloom|Butterfly Garden Walkway|Anticipation, discovery, curiosity|Follow what makes you feel alive.\nfairy-tale-forest|bloom|Fairy-Tale Forest|Wonder, imagination, awe|The world is still full of magic.\nthe-first-light|bloom|The First Light|Hope, optimism|Perhaps tomorrow is beautiful.\nthe-sunroom|bloom|The Sunroom|Joy, contentment, happiness|You are allowed to feel good.\nthe-playground|bloom|The Playground|Playfulness, spontaneity|Let the serious world wait.\nthe-greenhouse|bloom|The Greenhouse|Growth, resilience, progress|Look how much has grown.\nthe-roots|bloom|The Roots|Belonging, safety, acceptance|There is room for you here.\nthe-slow-garden|bloom|The Slow Garden|Calm, relief, peace|Nothing needs to be solved right now.\nthe-celebration|bloom|The Celebration|Gratitude, pride, accomplishment|Even the small victories count.\nthe-open-sky|bloom|The Open Sky|Freedom, courage, possibility|There is always more sky.\nafter-the-rain|bloom|After the Rain|Renewal, healing, compassion|The rain belonged here too.\nthe-pull|heart|The Pull|Attraction, desire, infatuation|Some connections feel like gravity.\nthe-thread|heart|The Thread|Love, attachment, connection|What joins us is often invisible.\nthe-open-hand|heart|The Open Hand|Tenderness, trust, vulnerability|It takes courage to stay soft.\nthe-unsent-letter|heart|The Unsent Letter|Longing, unfinished conversations|Everything I never said lives here.\nthe-empty-chair|heart|The Empty Chair|Grief, absence, mourning|Love does not vanish with someone.\nthe-fracture|heart|The Fracture|Heartbreak, betrayal, hurt|Some endings make new shapes.\nthe-tightrope|heart|The Tightrope|Jealousy, insecurity, fear of loss|Closeness can feel fragile.\nthe-echo|heart|The Echo|Nostalgia, bittersweet memories|I can still hear what is gone.\nthe-apology|heart|The Apology|Regret, remorse, forgiveness|There are words we wish we had said.\nthe-release|heart|The Release|Acceptance, closure, letting go|Letting go is not erasing.\nthe-void|undercurrent|The Void|Emptiness, disconnection|Even nothing has a shape.\nthe-fog|undercurrent|The Fog|Low mood, heaviness, anhedonia|Sometimes the world feels far away.\nthe-deep-water|undercurrent|The Deep Water|Sadness, despair, sorrow|There are depths without words.\nthe-distance|undercurrent|The Distance|Numbness, detachment, dissociation|Present, but a world away.\nthe-alone-room|undercurrent|The Alone Room|Loneliness, isolation|Silence has its own weather.\nthe-weight|undercurrent|The Weight|Fatigue, emotional heaviness|Some days gravity feels different.\nthe-crossroads|undercurrent|The Crossroads|Confusion, ambivalence, uncertainty|You do not have to know yet.\nthe-landing|undercurrent|The Landing|Rest, grounding, emotional regulation|You can stay a while.".trim().split('\n').map((line, index) => {
    const [id, world, name, feelings, quote] = line.split('|');
    return { id, world, name, feelings: feelings.split(',').map(s => s.trim()), quote, index };
  });
  // THE SPIRAL: fifth official world with its own entrance, while retaining THE UNDERCURRENT.
  // These are discovery records for the central gallery; the immersive experience runs in spiral.html.
  const spiralRooms = [
    ['spiral-whispers','The Whispers','Contradiction, unsaid thoughts, longing','Everything you never said.'],
    ['spiral-loop','The Loop','Overthinking, repetition, uncertainty','Here we go again.'],
    ['spiral-mirror','The Mirror','Identity, insecurity, reflection',"The thoughts you don't want to admit."],
    ['spiral-collapse','The Collapse','Overwhelm, emotional intensity, release','When everything becomes too much.'],
    ['spiral-stillness','The Stillness','Rest, hope, uncertainty','And then, for a moment, silence.'],
    ['spiral-creative','The Creative Spiral','Inspiration, imagination, creative momentum','One idea becomes a universe.'],
    ['spiral-joy','The Joy Spiral','Happiness, delight, playfulness','Happiness has a way of multiplying.'],
    ['spiral-love','The Love Spiral','Affection, anticipation, connection','Some feelings just keep growing.'],
    ['spiral-wonder','The Wonder Spiral','Curiosity, discovery, awe',"There's always something more to discover."],
    ['spiral-gratitude','The Gratitude Spiral','Appreciation, contentment, abundance','The more beauty you notice, the more you discover.'],
    ['spiral-possibility','The Possibility Spiral','Hope, anticipation, optimism','But what if it all works out?'],
    ['spiral-becoming','The Becoming Spiral','Growth, transformation, self-discovery','You can change without losing yourself.'],
    ['spiral-affirmation','The Affirmation Spiral','Confidence, self-worth, courage','What you nurture in your mind begins to take form.']
  ];
  spiralRooms.forEach(([id,name,feelings,quote])=>rooms.push({
    id,world:'spiral',name,feelings:feelings.split(',').map(s=>s.trim()),quote,index:rooms.length
  }));
  const links = {
    'the-empty-chair': ['the-sunroom', 'the-echo', 'the-deep-water'],
    'the-sunroom': ['the-empty-chair', 'the-celebration'],
    'the-fuse': ['the-thread', 'the-burnout'],
    'the-thread': ['the-fuse', 'the-open-hand', 'the-unsent-letter'],
    'the-alarm': ['the-first-light', 'the-landing', 'the-spiral'],
    '100-tabs-open': ['the-spark', 'the-tunnel', 'the-stuck-door'],
    'the-exit-sign': ['the-thread', 'the-void', 'the-roots'],
    'the-mirror': ['the-mask', 'the-crossroads'],
    'the-accelerator': ['the-collision', 'the-landing'],
    'the-fog': ['the-first-light', 'the-weight'],
    'fairy-tale-forest': ['the-open-sky', 'the-greenhouse'],
    'the-unsent-letter': ['the-release', 'the-echo'],
    'the-void': ['the-roots', 'the-landing'],
    'the-crossroads': ['the-mirror', 'the-spark'],
    'the-landing': ['the-slow-garden', 'the-alarm'],
    'spiral-whispers': ['spiral-loop', 'spiral-mirror'],
    'spiral-loop': ['spiral-whispers', 'spiral-mirror', 'spiral-collapse', 'spiral-creative', 'spiral-possibility'],
    'spiral-mirror': ['spiral-loop', 'spiral-collapse', 'spiral-stillness'],
    'spiral-collapse': ['spiral-stillness', 'spiral-whispers', 'spiral-joy'],
    'spiral-stillness': ['spiral-whispers', 'spiral-collapse', 'spiral-wonder', 'spiral-creative', 'the-landing'],
    'spiral-creative': ['spiral-loop', 'spiral-wonder', 'spiral-becoming'],
    'spiral-joy': ['spiral-collapse', 'spiral-gratitude', 'spiral-love'],
    'spiral-love': ['spiral-whispers', 'spiral-affirmation', 'spiral-joy'],
    'spiral-wonder': ['spiral-creative', 'spiral-possibility', 'spiral-stillness'],
    'spiral-gratitude': ['spiral-joy', 'spiral-affirmation'],
    'spiral-possibility': ['spiral-loop', 'spiral-wonder', 'spiral-becoming'],
    'spiral-becoming': ['spiral-possibility', 'spiral-affirmation', 'spiral-stillness'],
    'spiral-affirmation': ['spiral-becoming', 'spiral-love', 'spiral-joy']
  };
  const pathways = [
    { id: 'everything', label: 'I FEEL EVERYTHING', room: '100-tabs-open', detail: 'Begin where every thought has a voice.' },
    { id: 'nothing', label: 'I FEEL NOTHING', room: 'the-void', detail: 'Begin with a place for silence.' },
    { id: 'unknown', label: "I DON'T KNOW WHAT I FEEL", room: 'the-mirror', detail: 'Begin without needing an answer.' },
    { id: 'surprise', label: 'SURPRISE ME', room: 'the-crossroads', detail: 'Take an unexpected path.' }
  ];
  const firstChapter = ['the-mirror','the-exit-sign','100-tabs-open','the-static',
    'butterfly-garden-walkway','fairy-tale-forest','the-unsent-letter',
    'the-empty-chair','the-void','the-landing'];
  window.OVERFLOW_ATLAS = { worlds, rooms, links, pathways, firstChapter };
})();
