# THE SPIRAL — World 05

**The walls begin whispering.**

An immersive gallery world within Overflowism, where thoughts repeat, contradict, intensify, cross a threshold, and become abstract art.

> Experience → Feeling → Threshold → Release → Form

The founding Overflowism statement remains **"I create what I can't contain."** The Spiral is one expression of an artistic movement that also celebrates joy, beauty, spirituality, music, travel, nature, and love. It is not a clinical model or an assessment of the visitor.

## Standalone world

- The four original official worlds remain unchanged: THE WATCHERS, THE NOISE, THE BLOOM, and THE HEART.
- THE SPIRAL is the fifth official world with its **own entrance** at `spiral.html`, separate from THE NOISE or THE HEART.
- THE UNDERCURRENT continues to exist as a hidden connecting layer, not counted among the five official worlds.
- The existing `The Spiral` room inside THE WATCHERS remains intact; it does not replace or stand in for the new world.
- The main atrium links directly to `spiral.html`; the central atlas and world directory link to its five dedicated rooms.
- The complete atlas now contains 54 rooms: 49 previous entries + five Spiral installations.

## Five rooms

1. **THE WHISPERS:** discover hidden thoughts by clicking or touching them; conflicting messages appear.
2. **THE LOOP:** reappearing questions and repetitive symbols become visual patterns.
3. **THE MIRROR:** reflecting thoughts reveal internal confessions and contrasting perspectives.
4. **THE COLLAPSE:** accumulated contradictions transform into a layered abstract canvas; no flashes or aggressive camera shake.
5. **THE STILLNESS:** temporary quiet, warmth and uncertainty, not a forced happy ending.

## Core interaction

- `spiral-data.js` is the editable content system containing room descriptions, ten whisper categories, curated emotional opposites, and room thresholds.
- `spiral.js` implements the whisper engine, overlays, canvas transformation, room navigation, artwork lookup, and optional hum.
- `spiral.css` defines cinematic corridor architecture, fog, mirrored light, text, and responsive motion.
- `spiral.html` is the immersive entrance and accessible interaction UI.

The engine reveals text in varied locations and lets visitors click a thought to uncover an opposite. After enough interactions, its language seeds an original interactive digital abstract composition. The composition is **not presented as one of Marcela's paintings**.

## Artworks

Each room includes a gallery alcove. Until an authentic original work is assigned, it explicitly displays a placeholder. Existing paintings in other worlds are not reused or removed.

To assign a future piece, add a non-placeholder entry to `gallery-data.js` with `world:'spiral'` and a `room` equal to one of: `whispers`, `loop`, `mirror`, `collapse`, or `stillness` (or use `roomId:'spiral-whispers'`, etc.).

## Controls and inclusion

- Desktop: click/tap thought fragments; navigate with room links, Previous / Next buttons, or left/right arrow keys when focus is not on a button.
- Mobile: room navigation and controls remain touch-sized and text remains accessible.
- Pause Motion stops all decorative animation, and `prefers-reduced-motion` disables it by default.
- Sound starts **off** and becomes a subtle synthesized low hum only after explicit opt-in. There are no recorded spoken whispers, and the UI never pretends there are audio files.
- Native artwork dialog, visible focus states, descriptive labels and alternate return-to-gallery links are provided.
- Content is local and curated; no camera permission, diagnosis, visitor profiling, analytics, or visitor-supplied private thoughts.

## Validate

```sh
npm test
```

This verifies the original atlas, original artwork references, Bloom walkthrough, new Spiral data and all built assets. Deployment continues through the repository's existing GitHub Pages workflow after review and merge into `main`.

**Do not bypass GitHub tests or any configured Cerebe quality gate.**
