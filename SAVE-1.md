# SAVE-1 — Session checkpoint (July 20, 2026)

Status snapshot for The Griff Cart Tracker. To resume work, open a Claude Code
session on this repo and say: "read SAVE-1.md and continue where we left off."

## What this project is

A single-file web app (`index.html`) replacing The Griff's paper cart sheets.
No build step, no server, no dependencies. Data saves per-device in
localStorage.

## Features built so far

- **Parking Lot tab** — grid matching the printed sheet: columns A–L, 4 spots
  deep, plus a 7×2 overflow row. Tap a spot, type the cart number.
- **Erase a spot** (✕ button) — tap it, then tap a cart to clear that spot.
- **Mark Unserviceable** (⊘ button) — tap it, then tap a cart to draw a red
  crossed-out circle over its number; repeat to un-mark. (Wording was
  deliberately changed from "broken" to "unserviceable".)
- **Lot counter** — "N carts in the lot · M unserviceable", live-updating.
- **Gas List tab** — carts 1–65; tap to cross off gassed carts; counter of
  carts still needing gas.
- **Clear Sheet** — tap-twice-to-confirm (a confirm() popup is silently
  blocked in embedded/sandboxed pages, so don't reintroduce one).
- **The Griff crest** in the header — recreated as inline SVG (couldn't
  download the real logo file; network policy blocked thegriffgolf.org).
- **App icon** — white golf cart on green (#1e5631): SVG favicon inline in
  index.html, plus apple-touch-icon.png / icon-192.png / icon-512.png and
  manifest.webmanifest for home-screen installs.
- **Light + dark themes** via CSS custom properties.

## Deployment state

- **Repo**: paulanthony-alt/griff-golf-app. Branches: `main` (deployed) and
  `claude/griff-golf-cart-tracker-99e7aw` (working branch, kept in sync).
- **GitHub Pages**: user enabled it, deploying from `main`.
- **Custom domain**: goal is https://www.griffgolfstaff.com — the user entered
  it in Pages settings (CNAME file with `www.griffgolfstaff.com` is on main,
  committed via the GitHub UI).
- **Test link during development** (Claude artifact, private to the user's
  account): https://claude.ai/code/artifact/b12dc679-6b14-433a-ba48-04e97c29b4d0
  — republish from the artifact source to update it; its favicon must stay ⛳.

## NEXT STEPS (where we stopped)

1. **DNS records at the domain registrar** (user's task, instructions given):
   - CNAME record: host `www` → `paulanthony-alt.github.io`
   - Optional apex A records on `@`: 185.199.108.153 / 185.199.109.153 /
     185.199.110.153 / 185.199.111.153
2. Wait for the DNS check in Settings → Pages to turn green, then enable
   **Enforce HTTPS**.
3. Verify https://www.griffgolfstaff.com loads the app; repo must be public.

## Ideas discussed but not built

- Shared live sheet (needs a small backend) — currently each phone has its
  own localStorage data; two employees don't see each other's entries.

## Working notes for the next session

- Deploys: push to `main` → Pages redeploys the same URLs automatically.
- The artifact source file lives in the session scratchpad
  (`griff-cart-tracker.html`, same content as index.html minus the
  doctype/head/body wrapper) — regenerate it from index.html if starting
  fresh, and republish with the artifact URL above to keep the user's link.
- Verified with Playwright (`/opt/pw-browsers/chromium`) throughout; keep
  doing browser tests before pushing.
