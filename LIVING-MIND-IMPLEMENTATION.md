# OVERFLOWISM — The Living Mind: implementation checkpoint

## Approved foundation (unchanged)
The cinematic entrance remains the original `images/studio-entrance.png` render. Existing HTML, typography, navigation, gallery routes, original artwork, and the artist's present shape/appearance remain in place. This checkpoint does not redraw flowers, windows, furniture, artwork, or the character. In particular, the original *Untitled* painting is not reintroduced as a homepage overlay.

## Implemented on this branch
- `studio-emotions.js`: reusable, testable emotional model with Bloom, Heart, Noise, Spiral, Watchers, sadness, and peace. Intensity is a spectrum rather than a good/bad mood. Each autonomous shift blends a primary emotion with an undertone; timing and next states vary.
- `studio-atmosphere.js`: lifecycle controller which runs only when the entrance is visible and motion is enabled; schedules variable emotional changes, coordinates an existing artist station, and respects manual interaction for a short period.
- `studio-atmosphere.css`: subtle composited light crossfades, floating dust, firelight and tiny ember effects. The original render remains the visual base.
- `studio.js`: connects the existing artist's movement/actions to the autonomous engine, without running the old fixed 10-second tour at the same time. All current studio buttons remain usable.
- `scripts/test-emotions.mjs`: tests mood variety/blending, independent state changes, Pause Motion, recovery, hidden-tab shutdown, and preservation of the featured-artwork removal.
- Build/verification: copies new assets; adds a browser smoke check and a mobile preview artifact where a browser is available.

## Known limitations and asset requirements
**The approved studio is a flattened raster scene**, not a separately rendered 3D room. The overlays add a real atmospheric layer but do **not** make individual window skies, flowers, candles, water, or paintings independently movable. Their precise animation needs aligned and quality-approved transparent layers, masks, animation frames, depth maps, or high-resolution rendered footage from the same camera position. This initial implementation does not fake physical blooming, rain behind window glass, interactive 3D walking, or complex human motion with CSS-only substitutes.

The current avatar is an SVG figure, not a properly rigged cinematic character. Natural walking, sitting, dancing, brushwork, and precise lighting integration require a rigged character or a set of matched high-fidelity animation renders approved against the baseline.

The original `images/studio-entrance.png` asset remains roughly 2.8 MB. An optimized responsive WebP/AVIF derivative and browser visual QA remain important before a full public release.

## Test and release gate
- Run `npm test`; review the Playwright/Chromium preview artifacts if the runner captures them.
- Confirm the current hero composition is unchanged at desktop/mobile widths.
- Verify the atmosphere shifts independently after a variable delay, with no visitor action.
- Use Pause Motion: both ongoing particles and future mood changes must stop; resume must restore change.
- Check all existing gallery routes, mobile touch, canvas painting, canvas keyboard activation, buttons and sound opt-in.
- Ask Cerebe Factory to review the exact branch SHA; respond to blocking findings.
- Keep the PR reviewable. Do **not** merge or deploy unless checks and visual inspection pass.

## Next visual phase
Obtain the original layered source or artist-approved aligned asset plates (foreground, window glass, exterior skyline, flowers, candles, fire, shadows). Then build accurate masked local motion and intentional environmental object interactions without losing the cinematic quality.
