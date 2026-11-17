# Overflowism — The Emotional Atlas

An immersive, ever-expanding art-gallery experience built on the original Overflowism static website.

> When experience can no longer be contained, it becomes creation.

## The experience

- **The entrance:** a living illustrated sculpture and an optional emotional starting point.
- **The atrium:** THE WATCHERS, THE NOISE, THE BLOOM, and THE HEART.
- **THE UNDERCURRENT:** hidden passages for complicated, unnamed, and quiet feelings.
- **49 rooms:** all browsable now, with interactive visual environments and placeholder artwork.
- **The emotional atlas:** search by room, world, or feeling and move between rooms through portals.
- **Your artwork:** the existing *Untitled* original painting appears within THE BLOOM.
- **Accessible controls:** keyboard navigation, visible focus, native artwork dialogs, pause-motion toggle, reduced-motion support, and responsive layouts.

The rooms are creative interpretations of human emotions, not mental-health assessments or diagnoses.

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
