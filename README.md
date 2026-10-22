# AREC — Alliance for Robotics Education and Competition

Static site for the AREC robotics league. Deployed to GitHub Pages by
`.github/workflows/static.yml` — push to `main` and it goes live.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home: about, how it works, the league, sponsors, donate, contact |
| `game.html` | 2027 season — 3D game piece viewer plus the full season timeline |
| `register.html` | Pre-registration — creating a team on the TMS *is* the registration |
| `volunteer.html` | Volunteering — email → account → booking link, plus the role list |
| `assets/site.css` | Shared stylesheet for every page |
| `assets/game.js` | Three.js viewer used by `game.html` |
| `assets/game-element.stl` | The game piece model (see below) |

There is no build step. Edit a file, push, done.

## The game piece model

The viewer loads `assets/game-element.stl`. To update the model, drop the new
file at that exact path:

```
assets/game-element.stl        <- drop your file here, same filename
```

Nothing else needs changing. The viewer fetches the file with the cache
disabled, so a new model shows up on the next reload — no hard refresh, no
cache-busting query string to update.

The model is auto-centred and auto-scaled to a consistent size on screen, so
units do not matter, and both binary and ASCII STL are accepted. If the file is
missing or fails to load, the viewer falls back to a generated placeholder block
and says so in the corner, rather than showing an empty canvas.

### Viewer features

- Orbit (drag), zoom (scroll), auto-spin with a pause button
- Hover tilts the piece toward the pointer and lights it up in the accent colour
- Clicking the piece spins it, pulses it, and sends a ring across the floor
- Grid arena floor with real-time shadows
- Respects `prefers-reduced-motion`

Three.js is loaded from a CDN via an import map, so no dependencies are vendored
into the repo.

## Registration

Pre-registration runs entirely through the TMS at
`tms.arecrobotics.com`. Creating a team there is the pre-registration; any
discount is applied to the account automatically. Accounts live on the auth
server at `auth.albt.qzz.io`.

## Volunteering

Three steps, no form:

1. Email `info@arecrobotics.com` with the subject "I want to volunteer"
2. Create an account at `auth.albt.qzz.io`
3. We email a meeting-booking link to the address used in step 1
