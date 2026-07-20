# The Griff — Cart Tracker

A simple one-page web app for staff at The Griff (public golf course, Greenwich)
that replaces the paper cart sheets:

- **Parking Lot** — a grid matching the printed lot sheet (columns A–L, four
  spots deep, plus the overflow row along the bottom). Tap any spot and type
  the number of the cart parked there.
- **Gas List** — carts 1–65. Tap a number to cross it off once the cart has
  gas; tap again to un-cross it. A running count shows how many carts still
  need gas.

Everything is saved automatically on the device (localStorage), so the sheet
survives closing the browser. The **Clear Sheet** button wipes whichever tab
you're on to start a fresh sheet.

## Running it

No build step, no server, no dependencies — it's a single `index.html`.

- Open `index.html` directly in any browser, **or**
- Enable GitHub Pages for this repo (Settings → Pages → deploy from branch)
  and staff can use it from any phone at the published URL. Once opened, add
  it to the home screen for one-tap access — it installs with a white golf
  cart icon on The Griff's green (`apple-touch-icon.png`, `icon-192.png`,
  `icon-512.png`, wired up via `manifest.webmanifest`).
