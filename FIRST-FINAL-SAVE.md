# FIRST-FINAL-SAVE — The Griff Cart Tracker (July 21, 2026)

The app is **built, deployed, and live** for staff. This is the current
checkpoint. To resume: open a Claude Code session on this repo and say
"read FIRST-FINAL-SAVE.md and continue."

## Live link (give this to staff)

**https://paulanthony-alt.github.io/griff-golf-app/**  ·  staff code: **203**

- Public GitHub Pages site — anyone with the link can open it, no account
  needed. The 203 code gates casual access (not a hard secret — source is
  public).
- Tell staff to "Add to Home Screen" for the app icon + full-screen launch.
- Everyone shares ONE live board (see Firebase below). "Clear Sheet" clears
  it for everyone.

## What the app does

Single-file web app (`index.html`), no build step. Two tabs:
- **Parking Lot** — A–L grid, 4 deep, + 7×2 overflow row. Tap a spot, type the
  cart number. "Erase a spot" (✕) and "Mark Unserviceable" (⊘, red crossed
  circle) modes. Live counter: "N carts in the lot · M unserviceable".
- **Gas List** — carts 1–65, tap to cross off gassed carts, with remaining count.
- Password gate (code 203, remembered per device).
- The Griff crest in the header (inline SVG); white-golf-cart app icon + manifest.
- Light + dark themes.
- Header badge shows shared-connection status: "Live" / "Connecting…" /
  "Local only".

## Shared live sync — DONE and confirmed working

Firebase Realtime Database backs a single shared board; every phone sees each
other's changes within ~1s. User confirmed cross-device sync works on the live
site.
- Project: **griff-golf-staff**. Config is in `FIREBASE_CONFIG` at the top of
  the `<script>` in index.html.
- Data model: `board/parking/<spot>`, `board/broken/<spot>`, `board/gas/<num>`.
  Per-path writes so concurrent edits don't clobber.
- Falls back to local-only mode if a device can't reach Firebase.
- Rules: open read/write on `board` (fits a no-login staff tool; don't store
  sensitive data). See FIREBASE-SETUP.md.

## Deployment

- Repo: paulanthony-alt/griff-golf-app. Branches: `main` (published via GitHub
  Pages) and `claude/griff-golf-cart-tracker-99e7aw` (working; kept in sync).
- Pages deploys from `main`, repo is public.

## Custom domain — NOT active (optional, needs purchase)

- Goal was www.griffgolfstaff.com, but the domain was never registered — a
  custom domain must be bought (~$12/yr at Namecheap/Cloudflare/etc.).
- The CNAME file was removed so the github.io URL works directly.
- To enable later: buy the domain, add DNS (CNAME `www` →
  `paulanthony-alt.github.io`, optional apex A records 185.199.108-111.153),
  then set the custom domain in Settings → Pages and Enforce HTTPS.

## Ideas discussed, not built

- Real per-user login (would replace the shared 203 code + open DB rules).

## Working notes for the next session

- Deploys: push to `main` → Pages redeploys automatically.
- `main` sometimes moves via the GitHub UI; `git fetch origin main` and merge
  before pushing — don't force-push over it.
- Artifact source lives in the session scratchpad (`griff-cart-tracker.html` =
  index.html minus the doctype/head/body wrapper). When rebuilding index.html
  from it, KEEP the head's icon + manifest `<link>` tags. The private artifact
  test link (claude.ai/code/artifact/b12dc679-6b14-433a-ba48-04e97c29b4d0)
  can't do Firebase sync (sandboxed) — test on the github.io URL instead.
- SAVE files stay on the working branch only (off `main`) so internal notes
  aren't served on the public site.
- Verified throughout with Playwright (`/opt/pw-browsers/chromium`).
