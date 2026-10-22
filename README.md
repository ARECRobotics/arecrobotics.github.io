# AREC | Alliance for Robotics Education and Competition

Static site for the AREC robotics league. Deployed to GitHub Pages by
`.github/workflows/static.yml`. Push to `main` and it goes live.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home. What AREC is, what a team gets, sponsors and partners |
| `league.html` | How the league works, the 2027 season timeline, the game piece, sponsors |
| `robot.html` | The robot rules. The brain, the WiFi rule, the size, weight and power limits |
| `register.html` | Pre-registration, step by step, plus the questions we get most |
| `volunteer.html` | Volunteering, step by step, plus the role list |
| `assets/css/styles.css` | The stylesheet |
| `assets/css/vendor.css` | Template vendor stylesheet, slick and PhotoSwipe |
| `assets/js/arec.js` | The header tools menu |
| `assets/js/game.js` | Three.js viewer for the game piece |
| `assets/game-element.stl` | The game piece model |

No build step. Edit a file, push, done.

## The design

The site is built on the Flare template from StyleShout. The template
stylesheet is used as it ships, with one exception: the colour variables.
The template's pink accent is replaced with AREC red.

| Variable | Value | Used for |
| --- | --- | --- |
| `--color-1` | `hsla(5, 65%, 47%, 1)` | The accent. Links, buttons, the contact block, the footer |
| `--color-1-lighter` | `hsla(5, 65%, 63%, 1)` | Link hover |
| `--color-1-light` | `hsla(5, 65%, 55%, 1)` | |
| `--color-1-dark` | `hsla(5, 65%, 37%, 1)` | |
| `--color-1-darker` | `hsla(5, 65%, 27%, 1)` | The rule beside the about section |

Everything else in the stylesheet is the template's, unchanged. There are
no new class names and no new CSS libraries.

### Things that needed a decision

- **No stock photography.** The hero uses `assets/images/hero-bg.jpg`, a
  dark branded graphic made for the site. The about section has no photo
  block, and the portfolio grid is not used.
- **The header tools menu** is built in `assets/js/arec.js` with inline
  styles, because the template has no dropdown component and we are not
  adding class names. On a phone the same links are dropped into the
  slide down menu instead of the button.
- **The game piece viewer** uses the template's `video-container` class for
  the stage, so the viewer needed no new CSS.
- **Font Awesome is not shipped.** The social icons are inline SVG.

## Type

Two families, loaded from Google Fonts by the template stylesheet.

- **Montserrat**, headings, navigation, display type.
- **Nunito Sans**, body copy and prose.

## The robot rules

The one rule that matters: the brain is driven over WiFi from a laptop or
a tablet, using the AREC driver app, and no other communication method is
allowed. Bluetooth is not allowed, not even for telemetry.

Any COTS board with WiFi works as the brain. The ESP32 family, and an
Arduino Uno, Nano or Mega with WiFi.

| Limit | Value |
| --- | --- |
| Maximum size | 18 inches on a side |
| Maximum weight | 30 pounds, ready to compete |
| Maximum voltage | 12 volts |

The optional build bundle in the store is a ready made robot for teams
who would rather not start from a box of parts. Building your own robot
from your own parts is just as welcome.

## The game piece model

The viewer loads `assets/game-element.stl`. To update the model, drop the
new file at that exact path:

```
assets/game-element.stl        <- drop your file here, same filename
```

Nothing else needs changing. The viewer fetches the file with the cache
disabled, so a new model shows up on the next reload. The model is auto
centred and auto scaled, so units do not matter. Binary and ASCII STL
both work. If the file is missing the viewer falls back to a generated
placeholder block and says so under the viewer.

Three.js loads from a CDN through an import map, so nothing is vendored
into the repository.

## Placeholders

These are marked as placeholders and should be replaced as real content
arrives.

- `assets/images/icons/clients/your-logo-here.svg` is the sponsor logo
  placeholder in the home page strip.
- `assets/images/avatars/placeholder.svg` is the testimonial avatar.
- The two testimonial quotes on the home page are placeholders.

## Registration

Pre-registration runs entirely through the TMS at `tms.arecrobotics.com`.
Creating a team there is the registration. Any discount is applied to the
account automatically. Accounts live on the auth server at
`auth.albt.qzz.io`.

## Volunteering

Three steps, no form.

1. Email `info@arecrobotics.com` with the subject "I want to volunteer"
2. Create an account at `auth.albt.qzz.io`
3. We email a meeting booking link to the address used in step 1
