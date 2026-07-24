# THIRD-FINAL-SAVE — The Griff Cart Tracker (July 24, 2026)

Latest checkpoint. Adds an isolated /test/ site on top of SECOND-FINAL-SAVE.
To resume: open a Claude Code session on this repo and say
"read THIRD-FINAL-SAVE.md and continue."

## Links

- **LIVE (staff):** https://paulanthony-alt.github.io/griff-golf-app/  · code **203**
- **TEST (safe sandbox):** https://paulanthony-alt.github.io/griff-golf-app/test/  · code **203**

Both are the same app. LIVE and TEST share NOTHING — separate carts, chat, and
alerts. Use TEST to try changes before they reach the crew. TEST shows a gold
"TEST" chip + "TEST" browser title so it's never confused with live.

## Everything the app does

- **Parking Lot** — A–L grid (4 deep) + 7×2 overflow. Tap a spot, type the cart
  number. "Erase a spot" (✕) and "Mark Unserviceable" (⊘, red crossed circle).
  Live counter "N carts in the lot · M unserviceable".
- **Gas List** — carts 1–65, tap to cross off gassed, remaining count.
- **Team Chat (💬 top-left)** — one shared team room, live, sender role/name,
  unread badge. Loads ~last 60 messages.
- **Alerts (🔔 top-left)** — toast + beep + vibrate + persistent list, unread
  badge. Range gasses carts → SHOP alerted (grouped, 4s debounce). Shop taps
  "Request carts from range" → RANGE alerted. Routed by team.
- **Team picker** — first launch: Shop or Range (+ optional name). Drives alert
  routing + chat identity. Per device; "change" link in chat.
- Password gate (203), crest, white-cart icon + manifest, light/dark, Live/
  Local-only connection badge.

## Backend (Firebase Realtime Database) — project griff-golf-staff

Config in `FIREBASE_CONFIG` atop the `<script>` in index.html.
Namespacing: `var DATA_NS` = "test/" when the URL path contains a "test"
segment, else "". All reads/writes are prefixed with DATA_NS, so:
- LIVE writes: `board/…`, `chat/…`, `alerts/…`
- TEST writes: `test/board/…`, `test/chat/…`, `test/alerts/…`
Data model per side: parking/<spot>, broken/<spot>, gas/<num>; chat push-ids
{by,role,name,text,ts}; alerts push-ids {by,kind:"gas"|"carts",from,text,ts}.

### REQUIRED database rules (publish in Firebase console → Realtime Database → Rules)
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
Adding rules is additive and safe — it never changes/deletes stored data and
doesn't affect the live site (only grants the `test` branch access). Without the
`test` line, the TEST site's writes are silently rejected; without chat/alerts
lines, those features are rejected on both sites.

## Build (important for future edits)

Single source of truth: the artifact source in the session scratchpad
(`griff-cart-tracker.html` = the app minus the <head>/<body> wrapper). The build
writes BOTH files from it:
- `index.html` (root) — full head with icon + manifest links.
- `test/index.html` — minimal head, gold favicon, inline SVG only.
Always regenerate both together so LIVE and TEST stay identical in behavior.
Namespace + TEST chip are auto-detected at runtime from the URL path, so the two
files are byte-identical in the <body>.

## Deployment

- Repo paulanthony-alt/griff-golf-app. Branches: `main` (published) and
  `claude/griff-golf-cart-tracker-99e7aw` (working, kept in sync).
- Pages deploys from `main`; repo public. Push to main → auto-redeploy.
- `main` sometimes moves via the GitHub UI; fetch + merge before pushing.

## Custom domain — NOT active

www.griffgolfstaff.com never registered (needs purchase ~$12/yr). CNAME removed
so github.io URL works. To enable later: buy domain, DNS (CNAME www →
paulanthony-alt.github.io, optional apex A 185.199.108-111.153), set custom
domain in Settings → Pages, Enforce HTTPS.

## Ideas discussed, not built

- Lock-screen push notifications (service worker + FCM; unreliable on iOS) —
  current alerts are in-app.
- Real per-user login (would replace shared 203 + open rules).
- Chat channels / clearing chat (currently one shared room, ~60 msg history).

## Working notes

- Artifact test link (claude.ai/code/artifact/b12dc679-6b14-433a-ba48-04e97c29b4d0)
  can't reach Firebase (sandboxed) — test on the github.io URLs.
- In-code test hooks: __griffApplyRemote / __griffOnChat / __griffOnAlert /
  __griffSetReady.
- SAVE files stay on the working branch only (off `main`).
- Verified with Playwright (`/opt/pw-browsers/chromium`) throughout.
