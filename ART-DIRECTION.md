# OVERFLOWISM — V2 Art Direction & Build Notes

> **Foundational manifesto takes precedence:** This document is a V2 visual chapter, not the definition of Overflowism. For Marcela Thomas's 2026 movement, central statement, full range of overflow (including joy, music, nature, spirituality, beauty, travel and love), and future design guardrails, read [FOUNDATIONAL-MANIFESTO.md](FOUNDATIONAL-MANIFESTO.md) first. The visual direction below must not narrow the movement to mental health, emotional suffering, or one aesthetic.
## Creative north star

**Welcome to the inside of my mind.** Overflowism is an artist-led, immersive emotional gallery, not a conventional portfolio or a clinical map. Every painting gets to live inside an atmosphere that feels like walking into a physical installation. The gallery should feel mysterious, welcoming, cinematic, and alive.

**Tagline:** When experience can no longer be contained, it becomes creation.

## Arrival sequence

1. A dark, architectural foyer with a sculpture that seems to overflow with flowers and color.
2. Minimal poetic invitation. Visitors select an optional emotional starting point or explore freely.
3. A central atrium offers four major gallery wings; THE UNDERCURRENT sits between the others.
4. Room installations include framed artwork, optional emotional tags, and doorways connecting other experiences.

## Palette and lighting system

| World | Dark | Mid | Light | Mood |
| --- | --- | --- | --- | --- |
| THE WATCHERS | #161b34 | #7777aa | #c3b4de | cool museum shadows, mirrors and pale reflected light |
| THE NOISE | #181448 | #6652da | #e65ab0 | cobalt, violet and electric light |
| THE BLOOM | #164d4d | #66a58a | #f6ba72 | Medellín mountain light, greenery, sun and colored flowers |
| THE HEART | #491a3c | #be5d81 | #f0b1b6 | velvet, wine, candlelit blush |
| THE UNDERCURRENT | #1d2437 | #60788d | #b5a9c7 | fog, reflection and quiet blue-gray |

The architecture uses arched entrances, foreground and background visual planes, perspective floors, soft pools of light and distinct spatial cues. The experience is intentionally stylized and dreamlike rather than photorealistic.

## Movement and behavior

- Entry sculpture floats subtly; cursor movement adds gentle parallax when motion is enabled.
- World portals breathe with color and respond to hover or keyboard focus.
- THE BLOOM features a sunlit mountain panorama, garden pathway, gently moving flowers, and fluttering butterflies. THE FAIRY-TALE FOREST adds tree silhouettes.
- THE NOISE uses animated electric thought lines; THE HEART drifting symbolic petals; THE WATCHERS reflective arches; THE UNDERCURRENT slow water-reflection shapes.
- The header provides a pause-motion control. System reduced-motion preferences remove automatic animation.
- Keep navigational links and buttons available for keyboard and touch users; do not rely on movement, color or sound to navigate.
- Audio is not added yet; any future ambient sound should be muted by default and explicitly opt-in.

## Artwork

The existing **Untitled** original (white flowers in a yellow-green vase against blue) is retained in THE BLOOM and currently appears in the Butterfly Garden Walkway and Fairy-Tale Forest while artwork inventory is small. Other rooms use clearly identified placeholder frames. We can later give every painting its own artwork inventory entry, alt text, materials, date, edition and dedicated room location. Do not identify placeholder work as original.

## Architecture and code organization

- `atlas-data.js`: 49 editable rooms, emotional categories, links, 5 worlds and entry routes.
- `immersive.js`: route/navigation and generated scene decor; all room IDs and descriptions derive from the atlas.
- `immersive.css`: architectural design system and breathing environments.
- `gallery-data.js`: current paintings and contact.
- `index.html`: accessible entrance, atrium, world/room views, atlas, artist information and artwork dialog.
- `scripts/build.mjs`: build copies required files and images into `dist/`.

`npm run build` then `npm run preview` locally. Merge the review branch into `main` to trigger GitHub Pages if enabled. Please review mobile layouts, keyboard traversal, painting image loads and reduced-motion settings before publishing.

## Next iteration

Replace stylized CSS environment artwork with high-quality scene assets or a WebGL/canvas scene engine if the artist chooses. Prefer performance, mobile battery life and accessibility over gratuitous effects. Develop THE BLOOM's actual walkable garden scene and object interactions first, then bring that quality bar to the other worlds.
