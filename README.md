# AREC | Alliance for Robotics Education and Competition

Static site for the AREC robotics league. Deployed to GitHub Pages by
`.github/workflows/static.yml`. Push to `main` and it goes live.

No build step and no framework. Edit a file, push, done.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home. What AREC is, how it works, what teams get, the season dates, sponsors |
| `league.html` | The season format, the 2027 timeline, the game piece viewer, sponsors |
| `robot.html` | The WiFi rule, the controller, the size, weight and power limits, a build guide |
| `register.html` | Registration steps, what to have ready, what you get, common questions |
| `volunteer.html` | How to start, the role list, what a first event is like |
| `assets/css/styles.css` | The whole stylesheet |
| `assets/js/site.js` | Header state, mobile menu, tools menu, scroll reveals |
| `assets/js/game.js` | Three.js viewer for the game piece (league page only) |
| `assets/game-element.stl` | The game piece model |
| `assets/images/logo.svg` | The brand mark (also inlined in each page header) |

The only external requests are Google Fonts and, on the league page, Three.js
from a CDN.

## The design

The site is hand-written. There is no template, no Bootstrap, no jQuery and no
icon library.

### Color

| Token | Value | Used for |
| --- | --- | --- |
| `--paper` | `#f6f6f3` | Page background |
| `--surface` | `#ffffff` | Cards and raised panels |
| `--ink` | `#101012` | Body text |
| `--muted` | `#6d6d75` | Secondary text |
| `--accent` | `#2b46f0` | Links, buttons, timeline dates, card numbers |
| `--spark` | `#d8ff5c` | The lime highlight: WiFi in the headline, the live dot, active viewer buttons |
| `--night` | `#0a0a0c` | Hero, contact block, footer |

The accent is cobalt, not the old red. Lime is used sparingly so it still feels
like a highlight.

### Type

- **Geist** for headlines, body copy, navigation and buttons.
- **Geist Mono** for eyebrows, dates, specs, card numbers, the footer meta and
  the contact address. It gives the technical details a different voice from
  the prose.

Both are variable fonts loaded from Google Fonts with `preconnect`. The
fallback stack starts with `system-ui`.

### Layout

- A 1240px shell with clamped side gutters.
- A dark hero and footer around a warm paper body.
- A fixed header that is transparent over the home hero and turns solid paper
  once you scroll.
- 22px cards with hairline borders, pill buttons and tight display type.
- On small screens the nav becomes a panel, grids collapse to one column, the
  timeline stacks and the volunteer roles table becomes a list.

### Motion

Section reveals use `IntersectionObserver` and a small CSS transition. The
`prefers-reduced-motion` setting turns them off. With JavaScript disabled, the
small-screen menu is shown as a static list under the header, so the site still
navigates.

## Editing

- Every page carries its own copy of the header and footer. If you change the
  nav or the footer links, change all five pages.
- A section is `.section` > `.shell` > `.section-head` plus a grid or list. The
  spacing scale is in `:root` (`--section-y`, `--gutter`, `--page`).
- Keep the copy plain and specific. Short sentences, real numbers, no startup
  vocabulary. Say "robot", not "platform".

## The robot rules

The rule that shapes every robot: it is driven over WiFi from a laptop or tablet
with the AREC driver app, and no other communication link is allowed. That
includes Bluetooth, radio and any cable used for driving or data.

Any off-the-shelf board with WiFi is allowed. The ESP32 family, or an Arduino
Uno, Nano or Mega with a WiFi shield or module.

| Limit | Value |
| --- | --- |
| Maximum size | 18 inches on any side |
| Maximum weight | 30 pounds, ready to compete |
| Maximum voltage | 12 volts |

The optional build bundle is a ready-made robot you add a controller to.
Building from your own parts is just as welcome.

## The game piece model

The viewer loads `assets/game-element.stl`. To update the model, replace that
file with the new one:

```
assets/game-element.stl        <- same path, same filename
```

The viewer fetches the file with the cache disabled, so a new model appears on
the next reload. The mesh is centered and scaled automatically, so units do not
matter, and both binary and ASCII STL work. If the file is missing, the viewer
falls back to a generated placeholder block and says so under the stage.

Three.js and the STL loader load from jsDelivr through the import map in
`league.html`. Nothing is vendored into the repository.

## Accounts and links

| What | Where |
| --- | --- |
| Team dashboard | `tms.arecrobotics.com` |
| Account | `auth.albt.qzz.io` |
| Webmail | `mail.arecrobotics.com` |
| Finances | `hcb.hackclub.com/arec` |

Creating a team on the dashboard is the registration. Accounts live at
`auth.albt.qzz.io`. Any discount announced for the season is applied to the team
automatically.

Season dates live in the timeline on `index.html` and `league.html`. The current
copy has team registration opening October 26, 2026 and event registration on
October 30. Update both pages together when a date changes.

## Assets

`assets/images/logo.svg` is the only image left from the old build. The header
and footer draw the mark inline so it can follow the text color. The old Flare
template files, sliders, service icons and stock graphics were removed with the
rewrite.

If you add photos, put them in `assets/images/` and keep the file names short
and lowercase.
