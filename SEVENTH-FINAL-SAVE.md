# SEVENTH-FINAL-SAVE — The Griff Cart Tracker (Oct 21, 2026)

Latest checkpoint. Adds the per-cart gas indicators and the 48-hour gas-list
auto-reset (both now on LIVE) on top of SIXTH-FINAL-SAVE. To resume: open a
Claude Code session on this repo and say "read SEVENTH-FINAL-SAVE.md and continue."

## Links

- **LIVE (staff):** https://paulanthony-alt.github.io/griff-golf-app/  · code **203**
- **TEST (safe sandbox):** https://paulanthony-alt.github.io/griff-golf-app/test/  · code **203**

Same app; LIVE and TEST share NOTHING (separate board/chat/alerts/side/gasStart
via a namespace: DATA_NS = "test/" on the /test/ path, else ""). TEST shows a
gold "TEST" chip + "TEST" title.

## Everything the app does

- **Parking Lot** — grid columns A–M (13 lanes) × 4 deep + 7×2 overflow row.
  Tap a spot, type the cart number. "Erase a spot" (✕), "Mark Unserviceable"
  (⊘). Live counter.
  - **Erase = 1-min grace period:** erasing marks the spot with a red X (number
    stays), auto-clears ~60s later. Shared at board/pending/<id>; 5s sweeper on
    any device commits expired ones. Undo/typing cancels.
  - **Active-side highlight (LIVE):** "Taking carts from: Left/Right" above the
    grid. Shop sets it; that half (A–G / H–M, SIDE_HALF=7) highlights gold with
    a center divider; tap again to clear. Shared via board/side; Range read-only.
  - **Per-cart gas indicator (LIVE):** each parked cart shows a small gas-pump
    icon in the spot's corner — GREEN if that cart is gassed, RED if parked but
    not gassed. Shows ONLY while a gas round is underway (gas list non-empty);
    hidden otherwise. refreshGasIcons(); icon element added per cell in makeSpot
    (spotGasInd map); hooked from updateLotSummary/updateSummary/applyState.
- **Gas List** — carts 1–65, tap to cross off, remaining count.
  - **Auto-reset 48h after a round starts (LIVE):** first mark (empty→non-empty)
    sets board/gasStart = now; 48h later the gas list auto-clears (gas +
    gasStart). Swept on the 5s interval + on load/applyRemote; clears across
    devices. GAS_TTL/checkGasExpiry/clearGasList. PARKING NEVER auto-resets —
    only the gas list has a timer.
- **Undo (↶ bottom bar)** — single-level; last spot edit / erase / unserviceable
  / gas / Clear Sheet (restores whole cleared board). Syncs to shared board.
- **Team Chat (💬 top-left)** — one shared room, live, sender role/name, unread
  badge, ~last 60 msgs.
- **Alerts (🔔 top-left)** — in-app toast + list + unread badge; sender ·
  relative date (today time / "Yesterday" / "N days ago", fmtWhen, refreshed on
  open). Range gasses carts → SHOP (grouped, 4s debounce). Shop "Request a new
  cart list" → RANGE. Routed by team.
- **Phone (OS) notifications** — opt-in in 🔔 panel; service worker (sw.js /
  test/sw.js). SCOPED: push ONLY for chat (unless chat open) and cart-list
  requests. Gas does NOT push. pushNotify(). "Send a test notification" button =
  TEST only. iOS needs Home-Screen install for notifications; fully-closed push
  needs a backend.
- **Team picker** — first launch: Shop or Range (+ optional name); per device,
  "change" link in chat. Drives alert routing, chat identity, and who can set
  the active side.
- **Logo** — real course logo (chess king + golf club + "1965") in the header on
  a white chip. Upload kept as `Logo.png.png`; app uses `logo.png` (trimmed +
  resized, at repo root and in test/). App ICON (home screen / tab) and
  LOCK-SCREEN graphic are still the green golf cart (not changed to logo).
- Password gate (203), light/dark themes, Live/Local-only connection badge.

## Backend (Firebase Realtime Database) — project griff-golf-staff

Config in `FIREBASE_CONFIG` atop the `<script>` in index.html. DATA_NS prefixes
all board/chat/alerts reads+writes.
Data: board/parking/<spot>, board/broken/<spot>, board/gas/<num>,
board/pending/<spot> (erase ts), board/side ("left"|"right"), board/gasStart
(ms, gas-round anchor); chat push {by,role,name,text,ts}; alerts push
{by,kind:"gas"|"carts",from,text,ts}.

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
Additive/safe; never changes stored data or the live site. board/pending,
board/side, board/gasStart are children of `board`, so no rules change needed.

## Build (important)

Single source of truth: scratchpad `griff-cart-tracker.html` (app minus the
<head>/<body> wrapper). The scratchpad is EPHEMERAL and HAS reset between
sessions — if it's gone, rebuild the source from index.html by slicing between
`<body>` and `</body>`, and reinstall Playwright
(`npm init -y && npm install playwright`; browser at /opt/pw-browsers/chromium).
The build writes BOTH `index.html` (full head: icon + manifest links) and
`test/index.html` (minimal head, gold favicon) via an mkH() shell helper, and
copies `logo.png` into `test/`. Namespace (DATA_NS), TEST chip, and the
test-only "Send a test notification" button are the ONLY things auto-detected by
IS_TEST at runtime — so the two files are byte-identical in the <body>. Service
workers: root `sw.js` and `test/sw.js` (identical).
Grid: `grid-template-columns: repeat(13, …)` + `min-width: 690px` on
`.lot`/`.col-labels`/`.lot2`; lanes from `var COLS = [A…M]`.

### Test-first → promote workflow
New features are usually built gated behind `IS_TEST` (runtime), tested on
/test/, then promoted by removing those IS_TEST gates and pushing. When
promoting, un-gate ONLY the feature's gates — leave the namespace def (550-551),
the test-notification button gate, and the TEST chip block gated.

## Deployment

- Repo paulanthony-alt/griff-golf-app. Branches: `main` (published via Pages)
  and `claude/griff-golf-cart-tracker-99e7aw` (working, kept in sync).
- Push to `main` → auto-redeploy (~1–2 min); phones cache hard, pull-to-refresh.
- `main`/working sometimes move via the GitHub UI (e.g. the logo upload landed
  on the working branch) — `git fetch` + rebase/merge before pushing; no force.

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

- Commit attribution (current): `Co-Authored-By: Claude Opus 4.8
  <noreply@anthropic.com>` + `Claude-Session: https://claude.ai/code/session_01QjpuTemTTrDjL815Gk8Rzg`.
- Artifact test link (claude.ai/code/artifact/b12dc679-6b14-433a-ba48-04e97c29b4d0)
  can't reach Firebase (sandboxed) — test on the github.io URLs. My exec env is
  also network-blocked from Firebase.
- In-code test hooks: __griffApplyRemote / __griffOnChat / __griffOnAlert /
  __griffSetReady / __griffSweep.
- SAVE files stay on the working branch only (off `main`).
- Verified with Playwright throughout.
