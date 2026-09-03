# SIXTH-FINAL-SAVE — The Griff Cart Tracker (Sep 3, 2026)

Latest checkpoint. Adds the erase grace-period, the real course logo, and the
split-side "active side" highlight (now on live) on top of FIFTH-FINAL-SAVE.
To resume: open a Claude Code session on this repo and say
"read SIXTH-FINAL-SAVE.md and continue."

## Links

- **LIVE (staff):** https://paulanthony-alt.github.io/griff-golf-app/  · code **203**
- **TEST (safe sandbox):** https://paulanthony-alt.github.io/griff-golf-app/test/  · code **203**

Same app; LIVE and TEST share NOTHING (separate board/chat/alerts/side via a
namespace). TEST has a gold "TEST" chip + "TEST" title.

## Everything the app does

- **Parking Lot** — grid columns **A–M (13 lanes)** × 4 deep + 7×2 overflow row.
  Tap a spot, type the cart number. "Erase a spot" (✕), "Mark Unserviceable"
  (⊘). Live counter.
  - **Erase = 1-minute grace period:** erasing marks the spot with a red **X**
    (number stays readable), then auto-clears after ~60s. Stored shared at
    board/pending/<id> so all devices see the X; a 5s sweeper on any open device
    commits expired pendings (works even if the erasing phone closes). Undo or
    typing over the spot cancels it. (ERASE_DELAY, scheduleErase/cancelPending/
    commitErase/sweepPending.)
  - **Active-side highlight (LIVE + test):** "Taking carts from: Left/Right"
    control above the grid. Shop taps a side → that half (A–G left / H–M right,
    SIDE_HALF=7) highlights gold with a center divider; tap again to clear.
    Shared via board/side; Range is read-only (buttons hidden for role=Range).
    renderSide()/setSide()/updateSideControl(); cells tagged cell.dataset.side.
- **Gas List** — carts 1–65, tap to cross off, remaining count.
- **Undo (↶ bottom bar)** — single-level; last spot edit / erase / unserviceable
  / gas / Clear Sheet (restores whole cleared board). Syncs to shared board.
- **Team Chat (💬 top-left)** — one shared room, live, sender role/name, unread
  badge, ~last 60 msgs.
- **Alerts (🔔 top-left)** — in-app toast + list + unread badge; sender ·
  relative date (today time / "Yesterday" / "N days ago", fmtWhen, refreshed on
  open). Range gasses carts → SHOP (grouped, 4s debounce). Shop "Request a new
  cart list" → RANGE ("<who> is requesting a new cart list"). Routed by team.
- **Phone (OS) notifications** — opt-in in 🔔 panel; service worker (sw.js /
  test/sw.js). SCOPED: push ONLY for **chat** (unless chat open) and
  **cart-list requests**. Gas does NOT push. pushNotify(). "Send a test
  notification" button = TEST only. Limits: works while app open/alive; iOS
  needs Home-Screen install for notifications at all; fully-closed push needs a
  backend.
- **Team picker** — first launch: Shop or Range (+ optional name); per device,
  "change" link in chat. Drives alert routing, chat identity, and who can set
  the active side.
- **Logo** — the course's real logo (chess king + golf club + "1965") in the
  header on a white chip. Source upload kept as `Logo.png.png`; the app uses
  `logo.png` (auto-trimmed + resized, present at repo root and in test/). NOTE:
  the app ICON (home screen / browser tab) and the LOCK-SCREEN graphic are still
  the green golf cart — not yet changed to the logo (offered; user hasn't
  decided).
- Password gate (203), light/dark themes, Live/Local-only connection badge.

## Backend (Firebase Realtime Database) — project griff-golf-staff

Config in `FIREBASE_CONFIG` atop the `<script>` in index.html. `DATA_NS` =
"test/" when the URL path has a "test" segment, else "". All board/chat/alerts
reads+writes are prefixed with DATA_NS.
Data: board/parking/<spot>, board/broken/<spot>, board/gas/<num>,
board/pending/<spot> (erase ts), board/side ("left"|"right"); chat push
{by,role,name,text,ts}; alerts push {by,kind:"gas"|"carts",from,text,ts}.

### REQUIRED database rules (Firebase console → Realtime Database → Rules)
```json
{
  "rules": {
    "board":  { ".read": true, ".write": true },
    "chat":   { ".read": true, ".write": true },
    "alerts": { ".read": true, ".write": true },
    "test":   { ".read": true, ".write": true }
  }
}
```
Additive/safe; never changes stored data or the live site. board/pending and
board/side are children of `board`, so no rules change was needed for them.

## Build (important)

Single source of truth: scratchpad `griff-cart-tracker.html` (app minus the
<head>/<body> wrapper). The scratchpad is EPHEMERAL — if it's gone, rebuild the
source from index.html by slicing between `<body>` and `</body>`. The build
writes BOTH `index.html` (full head: icon + manifest links) and
`test/index.html` (minimal head, gold favicon) via an mkH() shell helper, and
copies `logo.png` into `test/`. Namespace + TEST chip + test-only bits are
auto-detected at runtime, so the two files are byte-identical in the <body>.
Service workers: root `sw.js` and `test/sw.js` (identical).
Grid width: `grid-template-columns: repeat(13, …)` + `min-width: 690px` on
`.lot`/`.col-labels`/`.lot2`; lanes from `var COLS = [A…M]`.
Playwright for tests lives in the scratchpad too (reinstall if cleared:
`npm init -y && npm install playwright`; browser at /opt/pw-browsers/chromium).

## Deployment

- Repo paulanthony-alt/griff-golf-app. Branches: `main` (published via Pages)
  and `claude/griff-golf-cart-tracker-99e7aw` (working, kept in sync).
- Push to `main` → auto-redeploy (~1–2 min); phones cache hard, pull-to-refresh.
- `main`/working sometimes move via the GitHub UI (e.g. the logo upload landed
  on the working branch) — `git fetch` + rebase/merge before pushing; don't
  force-push.

## Custom domain — NOT active

www.griffgolfstaff.com never registered (needs purchase ~$12/yr). CNAME removed
so github.io URL works. To enable later: buy domain, DNS (CNAME www →
paulanthony-alt.github.io, optional apex A 185.199.108-111.153), set custom
domain in Settings → Pages, Enforce HTTPS.

## Ideas discussed, not built

- Change the app icon / lock-screen graphic to the new logo (offered).
- Split the overflow row by side too (currently only the A–M grid splits).
- Fully-closed-app push (service worker + FCM + Cloud Functions on Blaze; iOS
  needs Home-Screen install). Groundwork in sw.js `push` handler.
- Real per-user login; chat channels / clearing chat; multi-level undo/redo;
  auto-update so saved shortcuts always load latest.

## Working notes

- Attribution on commits (current): `Co-Authored-By: Claude Opus 4.8
  <noreply@anthropic.com>` + `Claude-Session: https://claude.ai/code/session_01QjpuTemTTrDjL815Gk8Rzg`.
- Artifact test link (claude.ai/code/artifact/b12dc679-6b14-433a-ba48-04e97c29b4d0)
  can't reach Firebase (sandboxed) — test on the github.io URLs. My exec
  environment is also network-blocked from Firebase.
- In-code test hooks: __griffApplyRemote / __griffOnChat / __griffOnAlert /
  __griffSetReady / __griffSweep.
- SAVE files stay on the working branch only (off `main`).
- Verified with Playwright throughout.
