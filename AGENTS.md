# Repository agent guidance — Overflowism

**Read `FOUNDATIONAL-MANIFESTO.md` before any creative, visual, content, or architecture change.** That document preserves Marcela Thomas's foundational 2026 concept and takes precedence over later chapter-level design notes.

## Non-negotiable creative constraints

- **Overflowism is an artistic movement, not solely a mental-health website or a gallery of pain.**
- Its creative process is **Experience → Feeling → Threshold → Release → Form**.
- Preserve the exact central statement: **"I create what I can't contain."**
- Any experience can overflow: joy, beauty, wonder, desire, spirituality, nature, music, travel, love, heartbreak, anxiety, and anything in between. **Intensity, not source, defines overflow.**
- The mind, body, and spirit are the first vessel; art is the second.
- Let feeling dictate form; do not impose one aesthetic or medium.
- Preserve emotional truth rather than conventional perfection.
- Treat existing worlds as chapters of one expandable movement, not an exhaustive taxonomy.
- Keep diagnoses distinct from feelings; never label visitors, infer mental-health conditions, or turn the creative entrance into an assessment.

## Working on this codebase

- `README.md`: running, extending and deploying the site.
- `FOUNDATIONAL-MANIFESTO.md`: source of truth for movement definition and brand direction.
- `ART-DIRECTION.md`: earlier visual treatment; subordinate to the manifesto.
- `atlas-data.js`: worlds, rooms, connections and optional emotional entry paths.
- `gallery-data.js` and `images/artworks/`: existing original artwork data and files. Do not change or replace an original work without authorization.
- `index.html`, `immersive.js`, `immersive.css`, `bloom.css`: current website.
- `bloom.html`, `bloom-walk.js`, `bloom-walk.css`: existing walkable Bloom experience. Preserve these routes and controls while making unrelated changes.

## Review gates

- Describe how each creative PR aligns with the manifesto, especially if it changes entry messaging, art presentation, visual tone, or the site's world architecture.
- Keep future media and gallery structures extensible; don't hardcode that the four worlds are the *only* ways experience can overflow.
- Ensure responsive design, accessible keyboard and touch navigation, reduced-motion controls, and opt-in audio.
- Run `npm test` before proposing merge and respect project review checks, including Cerebe where configured; do not bypass failing checks.
- If requested changes conflict with the manifesto, state the conflict and request a deliberate artistic decision instead of silently redefining the movement.
