# SECOND-FINAL-SAVE — The Griff Cart Tracker (July 24, 2026)

Latest checkpoint. Adds team chat + shop/range alerts on top of FIRST-FINAL-SAVE.
To resume: open a Claude Code session on this repo and say
"read SECOND-FINAL-SAVE.md and continue."

## Live link (give this to staff)

**https://paulanthony-alt.github.io/griff-golf-app/**  ·  staff code: **203**

- Public GitHub Pages site, no account needed. 203 gates casual access.
- "Add to Home Screen" for the golf-cart icon + full-screen launch.
- Everyone shares ONE live board + one chat + one alerts feed (Firebase).

## Everything the app does

- **Parking Lot** — A–L grid (4 deep) + 7×2 overflow. Tap a spot, type the cart
  number. "Erase a spot" (✕) and "Mark Unserviceable" (⊘, red crossed circle)
  modes. Live counter "N carts in the lot · M unserviceable".
- **Gas List** — carts 1–65, tap to cross off gassed, remaining count.
- **Team Chat (💬 top-left)** — shared live messages, sender role/name, unread
  badge, slide-in drawer.
- **Alerts (🔔 top-left)** — notification center with unread badge; new alerts
  also toast + beep + vibrate.
  - Range gasses carts → SHOP alerted (auto; grouped into one alert per burst,
    e.g. "Range gassed carts 3, 7, 12" — 4s debounce).
  - Shop taps "Request carts from range" (Parking tab) → RANGE alerted.
  - Alerts are routed by team: each side only gets what's for them.
- **Team picker** — first launch asks Shop or Range (+ optional name); drives
  alert routing + chat identity. Remembered per device; "change" link in chat.
- Password gate (203), The Griff crest, white-cart app icon + manifest,
  light/dark themes, Live/Local-only connection badge.

## Backend (Firebase Realtime Database) — project griff-golf-staff

Config is in `FIREBASE_CONFIG` at the top of the `<script>` in index.html.
Nodes:
- `board/parking/<spot>`, `board/broken/<spot>`, `board/gas/<num>` — the sheet.
- `chat/` — push-id → { by, role, name, text, ts }.
- `alerts/` — push-id → { by, kind:"gas"|"carts", from, text, ts }.
Per-path writes; live re-render on remote change; falls back to on-device echo
when offline. Device id in localStorage `griff-device`; role/name in
`griff-role` / `griff-name`.

### REQUIRED: database rules must allow chat + alerts
In Firebase console → Realtime Database → Rules, publish:
```json
{
  "rules": {
    "board":  { ".read": true, ".write": true },
    "chat":   { ".read": true, ".write": true },
    "alerts": { ".read": true, ".write": true }
  }
}
```
Until this is published, chat/alerts are silently rejected on the live site
(cart tracking still works). See FIREBASE-SETUP.md.

## Common questions (answered for the user 2026-07-24)

- **Restart needed?** No server restart — Pages auto-redeploys on push. Just
  publish the rules above, and each phone refreshes to get the new version.
- **Does refreshing wipe carts?** No. Carts live in Firebase (cloud), not the
  page; refresh re-reads the board. Only "Clear Sheet" clears it (for everyone).

## Deployment

- Repo paulanthony-alt/griff-golf-app. Branches: `main` (published) and
  `claude/griff-golf-cart-tracker-99e7aw` (working, kept in sync).
- Pages deploys from `main`; repo public.

## Custom domain — NOT active

- www.griffgolfstaff.com was never registered (needs purchase ~$12/yr). CNAME
  file was removed so the github.io URL works directly. To enable later: buy the
  domain, add DNS (CNAME `www` → paulanthony-alt.github.io, optional apex A
  records 185.199.108-111.153), set custom domain in Settings → Pages, Enforce
  HTTPS.

## Ideas discussed, not built

- Real lock-screen push notifications (needs service worker + FCM + permissions;
  unreliable on iOS) — current alerts are in-app (toast + persistent list).
- Real per-user login (would replace the shared 203 code + open DB rules).

## Working notes for next session

- Deploys: push to `main` → Pages redeploys automatically.
- `main` sometimes moves via the GitHub UI; `git fetch origin main` and merge
  before pushing — don't force-push over it.
- Artifact source in scratchpad: `griff-cart-tracker.html` = index.html minus
  the doctype/head/body wrapper. Rebuild keeps the head icon + manifest links.
  Private artifact test link
  (claude.ai/code/artifact/b12dc679-6b14-433a-ba48-04e97c29b4d0) can't reach
  Firebase (sandboxed) — test sync/chat/alerts on the github.io URL. Test hooks
  in code: window.__griffApplyRemote / __griffOnChat / __griffOnAlert /
  __griffSetReady.
- SAVE files stay on the working branch only (off `main`).
- Verified with Playwright (`/opt/pw-browsers/chromium`) throughout.
