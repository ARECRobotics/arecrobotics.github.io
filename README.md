# AREC | Alliance for Robotics Education and Competition

Static site for the AREC robotics league. Deployed to GitHub Pages by
`.github/workflows/static.yml`. Push to `main` and it goes live.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home. Cover, key dates, ways in, donation, contact |
| `league.html` | How it works, what a team gets, sponsors |
| `game.html` | 2027 season. Game piece viewer and the full timeline |
| `register.html` | Pre-registration, step by step |
| `volunteer.html` | Volunteering, step by step, plus the role list |
| `assets/site.css` | Shared stylesheet |
| `assets/game.js` | Three.js viewer used by `game.html` |
| `assets/game-element.stl` | The game piece model |

No build step. Edit a file, push, done.

## Type

Two families, loaded from Google Fonts.

- **Archivo**, variable width. Structure, headings, navigation, prose.
  The width axis is the point. Display type is set at `wdth 125`, section
  titles at `wdth 112`, body at `wdth 100`.
- **IBM Plex Mono**. Technical labels only. Dates, table row labels, status
  lines. Never body copy, never a caption under a heading.

## Colour

| Token | Value |
| --- | --- |
| `--paper` | `#F2EEE4` |
| `--paper-2` | `#E9E4D6` |
| `--paper-3` | `#F8F6F0` |
| `--ink` | `#1A1814` |
| `--ink-2` | `#57534A` |
| `--ink-3` | `#837E72` |
| `--rule` | `#D2CAB7` |
| `--rule-2` | `#A79E87` |
| `--red` | `#C8372A` |
| `--red-deep` | `#9E2419` |
| `--field` | `#17160F` |

Every hex on the site comes from this list. There are no gradients and no
shadows. Rules appear only in tables, on the schedule axis, and at the header
and footer edges. Whitespace does the rest.

## The game piece model

The viewer loads `assets/game-element.stl`. To update the model, drop the new
file at that exact path:

```
assets/game-element.stl        <- drop your file here, same filename
```

Nothing else needs changing. The viewer fetches the file with the cache
disabled, so a new model shows up on the next reload. No hard refresh, no
cache busting string to update.

The model is auto centred and auto scaled, so units do not matter. Binary and
ASCII STL both work. If the file is missing the viewer falls back to a
generated placeholder block and says so in the corner, rather than showing an
empty canvas.

### Viewer behaviour

- Orbit by dragging, zoom by scrolling, auto spin with a pause button
- Hover tilts the piece toward the pointer and lights it in the accent colour
- Clicking spins the piece, pulses it, and sends a ring across the floor
- Grid arena floor with real time shadows
- Honours `prefers-reduced-motion`

Three.js loads from a CDN through an import map, so nothing is vendored into
the repository.

## Registration

Pre-registration runs entirely through the TMS at `tms.arecrobotics.com`.
Creating a team there is the registration. Any discount is applied to the
account automatically. Accounts live on the auth server at `auth.albt.qzz.io`.

## Volunteering

Three steps, no form.

1. Email `info@arecrobotics.com` with the subject "I want to volunteer"
2. Create an account at `auth.albt.qzz.io`
3. We email a meeting booking link to the address used in step 1
