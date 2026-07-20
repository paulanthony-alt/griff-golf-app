# SAVE-2 — Session checkpoint (July 20, 2026)

Latest checkpoint for The Griff Cart Tracker. Supersedes SAVE-1 (adds the
password gate + deployment progress). To resume: open a Claude Code session on
this repo and say "read SAVE-2.md and continue where we left off."

## What this project is

A single-file web app (`index.html`) replacing The Griff's paper cart sheets.
No build step, no server, no dependencies. Data saves per-device in
localStorage.

## Features built

- **Password gate** — full-screen green lock screen (white golf cart) shown on
  load; staff code **203** unlocks it. Unlock is remembered per-device
  (localStorage key `griff-cart-unlocked`). Enter key and Unlock button both
  submit; wrong code shows an inline message. NOTE: this is a client-side gate
  — good for keeping casual/public visitors out, but the code is technically
  visible in page source. Not real security (no server). Fine for this app's
  non-sensitive data. Real login would need a backend + paid hosting.
- **Parking Lot tab** — grid matching the printed sheet: columns A–L, 4 spots
  deep, plus a 7×2 overflow row. Tap a spot, type the cart number.
- **Erase a spot** (✕) — tap it, then tap a cart to clear that spot.
- **Mark Unserviceable** (⊘) — tap it, then tap a cart to draw a red
  crossed-out circle over its number; repeat to un-mark. (Term deliberately
  "unserviceable", not "broken".)
- **Lot counter** — "N carts in the lot · M unserviceable", live-updating.
- **Gas List tab** — carts 1–65; tap to cross off gassed carts; remaining count.
- **Clear Sheet** — tap-twice-to-confirm (do NOT reintroduce confirm(), it's
  silently blocked in embedded/sandboxed pages).
- **The Griff crest** in the header — inline SVG recreation (couldn't download
  the real logo; network policy blocked thegriffgolf.org).
- **App icon** — white golf cart on green (#1e5631): inline SVG favicon plus
  apple-touch-icon.png / icon-192.png / icon-512.png + manifest.webmanifest.
- **Light + dark themes** via CSS custom properties.

## Deployment state

- **Repo**: paulanthony-alt/griff-golf-app. Branches: `main` (published) and
  `claude/griff-golf-cart-tracker-99e7aw` (working; kept in sync with main).
- **GitHub Pages**: enabled, deploying from `main`.
- **Custom domain**: https://www.griffgolfstaff.com — CNAME file on main holds
  `www.griffgolfstaff.com` (set via GitHub UI). DNS at the registrar is the
  remaining piece (see next steps).
- **Dev test link** (Claude artifact, private to the user's account):
  https://claude.ai/code/artifact/b12dc679-6b14-433a-ba48-04e97c29b4d0
  — republish from the artifact source to update; its favicon must stay ⛳; it
  cannot show the custom cart favicon (artifact limitation).

## Shared live sync (Firebase) — code done, config pending

The app now reads/writes a shared Firebase Realtime Database and re-renders
live when any user changes something (see FIREBASE-SETUP.md). It ships in
LOCAL-ONLY mode until a real config is pasted into `FIREBASE_CONFIG` at the top
of the `<script>` in index.html (placeholders contain "PASTE_PROJECT"). Data
model: `board/parking/<spot>`, `board/broken/<spot>`, `board/gas/<num>`.
Per-path writes so concurrent edits don't clobber. Live-render hook:
`window.__griffApplyRemote`. To finish: user creates a Firebase project + RTDB,
sets rules to allow read/write on `board`, and sends the config to paste in.

## NEXT STEPS (where we stopped)

1. **Firebase config** — get it from the user and paste into FIREBASE_CONFIG,
   then push to main (see FIREBASE-SETUP.md). This is what actually turns on
   cross-user sharing.
2. **DNS at the domain registrar** (user's task):
   - CNAME record: host `www` → `paulanthony-alt.github.io`
   - Optional apex A records on `@`: 185.199.108.153 / 185.199.109.153 /
     185.199.110.153 / 185.199.111.153
2. When the DNS check in Settings → Pages goes green, enable **Enforce HTTPS**.
3. Confirm https://www.griffgolfstaff.com loads the app (repo must be public).

## Ideas discussed, not built

- Shared live sheet (needs a backend) — each phone currently has its own
  localStorage data; staff don't see each other's entries.
- Real authentication (would replace the client-side code gate).

## Working notes for the next session

- Deploys: push to `main` → Pages redeploys the same URLs automatically.
- `main` occasionally moves via the GitHub UI (CNAME edits). Before pushing,
  `git fetch origin main` and merge — don't force-push over it.
- Artifact source lives in the session scratchpad
  (`griff-cart-tracker.html` = index.html minus the doctype/head/body wrapper).
  When rebuilding index.html from it, KEEP the head's icon + manifest `<link>`
  tags (they're only in index.html's wrapper, not the artifact source).
  Republish with the artifact URL above to keep the user's link stable.
- Keep SAVE files on the working branch only (off `main`) so internal notes
  aren't served on the public site.
- Verified throughout with Playwright (`/opt/pw-browsers/chromium`); keep doing
  browser tests before pushing.
