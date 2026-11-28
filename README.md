# Overflowism — The Emotional Atlas

> **Foundational creative direction:** Overflowism is Marcela Thomas's 2026 artistic movement, not only an emotional or mental-health gallery. The definitive [Foundational Manifesto](FOUNDATIONAL-MANIFESTO.md) anchors the process **Experience → Feeling → Threshold → Release → Form** and the statement **"I create what I can't contain."** Read it before changing the site's creative direction.
An immersive, ever-expanding art-gallery experience built on the original Overflowism static website.

> When experience can no longer be contained, it becomes creation.

## A living studio entrance (interactive first pass)

The website opens inside the artist's **animated personal studio**, not the old head-shaped hero illustration. The artist is represented by an original **stylized curvy brown-haired SVG avatar** moving through six stations: paint, code, dance, roses, view, and reflection. The room includes changing emotional color/temperature, scenic but **unnamed** windows, flickering fireplace and candles, red roses, Catholic votive niche/cross/rosary details, rotating record, a coding laptop and a paintable canvas.

- **Watch** the avatar visit creative stations automatically (when motion is enabled), or choose a station manually.
- **Make a mark** on the unfinished studio canvas using the button, Enter/Space on the canvas, mouse or touch. Marks stay on this page only.
- **Write a thought** and release it into a painted flower; the text isn't saved or sent.
- **Sound** is OFF by default; optional low synthesized ambient tone starts only after an explicit click.
- **Pause motion** in the persistent header and automatic changes stop; reduced-motion preferences are respected.
- **Enter the gallery**, explore the atlas or open the optional "start with a feeling" menu; all existing worlds and Bloom's original *Untitled* painting remain intact.

The opening room is a responsive **2.5D CSS/HTML/SVG experience**, not yet a free-roaming full 3D avatar. The scenic views are deliberately unnamed and the room contains no dog. Additional original paintings are needed as repository image assets before they can be shown faithfully on the walls; decorative CSS paintings are placeholders, not attributed originals.

## The experience

- **The entrance:** an interactive studio with a moving artist avatar, creative stations, adjustable feelings, paintable canvas and optional emotional starting point.
- **The atrium:** THE WATCHERS, THE NOISE, THE BLOOM, THE HEART, and THE SPIRAL (fifth official world).
- **THE UNDERCURRENT:** hidden passages for complicated, unnamed, and quiet feelings.
- **54 rooms:** 49 original spaces plus five dedicated Spiral rooms, all browsable with interactive environments and artwork locations.
- **The emotional atlas:** search by room, world, or feeling and move between rooms through portals.
- **Your artwork:** the existing *Untitled* original painting appears within THE BLOOM.
- **Accessible controls:** keyboard navigation, visible focus, native artwork dialogs, pause-motion toggle, reduced-motion support, and responsive layouts.

The rooms are creative interpretations of human emotions, not mental-health assessments or diagnoses.

## THE SPIRAL — World 05

The standalone immersive world lives at `spiral.html`. Enter a dark whispering corridor and explore five rooms: THE WHISPERS, THE LOOP, THE MIRROR, THE COLLAPSE, and THE STILLNESS. Repeated and contradictory thoughts cross a threshold and become abstract digital artwork. Original physical paintings are added only when assigned by the artist.

The editable whisper engine, emotional opposites, accessibility rules, and artwork data conventions are documented in [SPIRAL-WORLD.md](SPIRAL-WORLD.md). The current four official worlds and THE UNDERCURRENT remain intact.

## Run locally

Requires Node.js 18+.

```sh
npm run build
npm run preview
```

The site has no client runtime dependencies. The output is placed in `dist/`.

## Add paintings

Your existing data is preserved in `gallery-data.js`, and paintings are stored in `images/artworks/`.

1. Upload a painting to `images/artworks/`.
2. Add an entry to the `artworks` array in `gallery-data.js`. Use a real image path, a descriptive `alt` value, and `placeholder: false`.
3. In `immersive.js`, update `matchingArt(room)` to assign that painting to a room. The current first painting, *Untitled*, is assigned to the Butterfly Garden Walkway and Fairy-Tale Forest.
4. Change the opening text, artist statement, or contact details in `index.html` as the project evolves.

## Add or edit emotional rooms

`atlas-data.js` holds the worlds, room names, emotional tags, quotes, portal links, and first-chapter highlights.

Each row inside the data block follows:

```
room-id|world-id|Room Name|Feeling one, Feeling two|A short poetic line.
```

Add a room there and it automatically becomes searchable and gets its own interactive installation. Add its ID to `links` to create special cross-world portal connections.

## Customize visuals

- `immersive.css`: atmospheric palettes, typography, installation visuals, motion, and mobile layouts.
- `immersive.js`: navigation, emotional choices, search, portal links, artwork dialogs, and motion control.
- `atlas-data.js`: world palettes, rooms, and their connections.

All 49 rooms currently use a reusable atmospheric scene template, not unique 3D environments. That is intentional for the first prototype. The planned 3D architecture, custom environmental assets, and richer room-specific interactions are future enhancements.

## Deploy

The existing `.github/workflows/pages.yml` builds and deploys the project from `main` with GitHub Pages. Review this feature branch in its pull request and merge it when ready. The site will then deploy automatically if GitHub Pages is enabled and set to **GitHub Actions** in repository settings.

The existing work, original paintings, and image assets have been preserved.


## THE BLOOM — Walkable Garden (Chapter One)

Visit `bloom.html` (or select **WALK INTO THE GARDEN** from THE BLOOM world page) to enter an original, full-screen garden environment.

- **Arrival:** a cinematic invitation into an imagined Medellín-inspired butterfly garden.
- **Explore:** move forward with W / Up, backward with S / Down, turn with A/D or Left/Right. Drag the scene to look around. Touchscreen visitors can use the on-screen controls.
- **Discover:** approach the original **Untitled** painting along the path, then select **LOOK CLOSER** to see its information and inquire about it.
- **Continue:** the walkway transitions into the Fairy-Tale Forest and ends with a choice to explore more worlds or walk again.
- **Atmosphere:** illustrated depth, garden flowers, butterflies, trees, mountain skyline, spotlighted artwork, and gentle ambient motion. Motion can be paused. No audio automatically plays.
- **Accessibility:** an optional standard gallery route remains available. The controls are explicitly labeled, and browser reduced-motion preferences are respected.

The walk-through uses a lightweight **canvas-based perspective scene** and does not require Three.js, external assets, or a backend service. It is a designed interactive environment, not yet a photorealistic or full free-roaming WebGL museum.

### Maintain the Garden

- `bloom.html` — layout, copy, buttons, overlay and painting information.
- `bloom-walk.css` — typography, overlays, controls and responsive layout.
- `bloom-walk.js` — camera, walking, drawing, garden objects, navigation, interactions.
- `gallery-data.js` — existing original painting and inquiry email.

To replace or add art later, update the artwork inventory and the scene placement logic in `bloom-walk.js`. The current original painting is preserved at `images/artworks/untitled-the-bloom-web.jpg`.
