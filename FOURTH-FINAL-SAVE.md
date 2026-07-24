# FOURTH-FINAL-SAVE — The Griff Cart Tracker (July 24, 2026)

Latest checkpoint. Adds phone notifications (scoped), a Send-test button (test
only), and an Undo button on top of THIRD-FINAL-SAVE. To resume: open a Claude
Code session on this repo and say "read FOURTH-FINAL-SAVE.md and continue."

## Links

- **LIVE (staff):** https://paulanthony-alt.github.io/griff-golf-app/  · code **203**
- **TEST (safe sandbox):** https://paulanthony-alt.github.io/griff-golf-app/test/  · code **203**

Same app; LIVE and TEST share NOTHING (separate carts/chat/alerts, see
namespacing). TEST has a gold "TEST" chip + "TEST" title.

## Everything the app does

- **Parking Lot** — A–L grid (4 deep) + 7×2 overflow. Tap a spot, type the cart
  number. "Erase a spot" (✕) and "Mark Unserviceable" (⊘). Live counter.
- **Gas List** — carts 1–65, tap to cross off, remaining count.
- **Undo (↶, bottom bar)** — single-level; appears only when there's something
  to revert. Undoes the last: spot edit, erase, unserviceable toggle, gas
  cross-off, or Clear Sheet (restores the whole cleared board). Syncs to shared
  board. Impl: `setUndo(fn)` + restoreSpot/restoreGas/restoreParkingAll/
  restoreGasAll helpers near the top of the main IIFE.
- **Team Chat (💬 top-left)** — one shared room, live, sender role/name, unread
  badge. ~last 60 messages.
- **Alerts (🔔 top-left)** — in-app toast + persistent list + unread badge.
  Range gasses carts → SHOP (grouped, 4s debounce). Shop "Request carts" →
  RANGE. Routed by team.
- **Phone (OS) notifications** — opt-in via "Turn on phone notifications" in the
  🔔 panel; uses a service worker (sw.js / test/sw.js).
  SCOPED: push fires ONLY for **chat messages** (unless chat panel open) and
  **cart requests**. Gas updates do NOT push (stay in-app + list). Helper:
  `pushNotify(title, body, tag)`.
  - "Send a test notification" button shows on the TEST site only (once
    permission granted). Hidden on live.
  - Limits: works while app is open/alive; fully-closed push needs a backend
    (FCM/Cloud Functions) and, on iOS, a Home-Screen install. iOS also needs
    Home-Screen install for notifications to work at all.
- **Team picker** — first launch: Shop or Range (+ optional name). Per device;
  "change" link in chat.
- Password gate (203), crest, white-cart icon + manifest, light/dark, Live/
  Local-only connection badge.

## Backend (Firebase Realtime Database) — project griff-golf-staff

Config in `FIREBASE_CONFIG` atop the `<script>` in index.html. Namespacing:
`DATA_NS` = "test/" when URL path contains a "test" segment, else "". All
board/chat/alerts reads+writes are prefixed with DATA_NS.
Data: parking/<spot>, broken/<spot>, gas/<num>; chat push {by,role,name,text,ts};
alerts push {by,kind:"gas"|"carts",from,text,ts}.

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
Additive and safe — never changes stored data or the live site. Notifications
need NO rules change (client-side, triggered by existing alerts/chat).

## Build (important)

Single source of truth: scratchpad `griff-cart-tracker.html` (app minus the
<head>/<body> wrapper). The build writes BOTH `index.html` (full head: icon +
manifest links) and `test/index.html` (minimal head, gold favicon) from it, via
an mkH() shell helper. Namespace + TEST chip + test-only buttons are auto-
detected at runtime, so the two files are byte-identical in the <body>.
Service workers: root `sw.js` and `test/sw.js` (identical content).

## Deployment

- Repo paulanthony-alt/griff-golf-app. Branches: `main` (published via Pages)
  and `claude/griff-golf-cart-tracker-99e7aw` (working, kept in sync).
- Push to `main` → auto-redeploy. `main` sometimes moves via the GitHub UI;
  fetch + merge before pushing (don't force-push).

## Custom domain — NOT active

www.griffgolfstaff.com never registered (needs purchase ~$12/yr). CNAME removed
so github.io URL works. To enable later: buy domain, DNS (CNAME www →
paulanthony-alt.github.io, optional apex A 185.199.108-111.153), set custom
domain in Settings → Pages, Enforce HTTPS.

## Ideas discussed, not built

- Fully-closed-app push (service worker + FCM + Cloud Functions on Blaze plan;
  iOS needs Home-Screen install). Groundwork left in sw.js `push` handler.
- Real per-user login (would replace shared 203 + open rules).
- Chat channels / clearing chat; multi-level undo / redo.
- Auto-update so saved shortcuts always load latest (offered; not built —
  current guidance is pull-to-refresh / re-add home-screen icon).

## Working notes

- Artifact test link (claude.ai/code/artifact/b12dc679-6b14-433a-ba48-04e97c29b4d0)
  can't reach Firebase (sandboxed) — test on the github.io URLs. My exec
  environment is also network-blocked from Firebase (can't push alerts from
  here; use the app's own actions / the test-notification button).
- In-code test hooks: __griffApplyRemote / __griffOnChat / __griffOnAlert /
  __griffSetReady.
- SAVE files stay on the working branch only (off `main`).
- Verified with Playwright (`/opt/pw-browsers/chromium`) throughout.
