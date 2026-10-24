# TENTH-FINAL-SAVE — The Griff Cart Tracker (Oct 24, 2026)

Supersedes NINTH-FINAL-SAVE. Change: the 48-hour gas round is replaced by
LIFECYCLE GAS TAGS + CART AGING (live + test). To resume: open a Claude Code
session on this repo and say "read TENTH-FINAL-SAVE.md and continue."

## Links

- **LIVE (staff):** https://paulanthony-alt.github.io/griff-golf-app/  · code **203**
- **TEST (sandbox):** https://paulanthony-alt.github.io/griff-golf-app/test/  · code **203**

LIVE and TEST share NOTHING (separate board/chat/alerts/side/aging via
DATA_NS = "test/" on the /test/ path, else ""). TEST shows a gold "TEST" chip.

## Seasonal themes (automatic by date; temporary)

`getSeason()` picks the theme on every page load (live + test); switches happen
automatically, no re-push.
- **Halloween — Oct 20–31:** the NORMAL green UI, UNCHANGED, plus four
  gently-bobbing 🎃/👻 in the corners (a fixed `.hw-ghosts` container appended to
  <body>; `.hw-ghost` spans, pointer-events none, z-index 40, reduced-motion
  safe). No color/title/favicon/gate changes. (The old heavy purple reskin was
  removed per user request.)
- **Thanksgiving — Nov 1 through Thanksgiving Day (4th Thu, computed per year):**
  full warm reskin — cream + burnt-sienna/rust `:root.thanksgiving` token
  overrides, falling 🍁🍂 leaves in header, 🦃+🍁 title, "Happy Thanksgiving!"
  gate, 🦃 favicon/title, theme-color #8a3b17. Returns to normal the day after.
- **Normal** otherwise (incl. all of December): regular green app, no class.
Preview/override any date: `?season=halloween` / `?season=thanksgiving` /
`?season=` (normal), or localStorage `griff-season`.
Code locations: `.hw-ghosts`/`.hw-ghost` + `@keyframes hw-bob` CSS; the
`.thanksgiving` + `.tg-*` CSS; `getSeason()`/`thanksgivingDay()`/`seasonFavicon()`
and the season IIFE near the end of the <script> (halloween branch = ghosts
only + early return; thanksgiving branch = full reskin). Heads ship NORMAL/green;
Thanksgiving favicon/title/theme-color are set in JS. To change dates: edit
getSeason only. To add 🎄 December: add a case + a `.christmas` CSS block + a
branch in the IIFE.

## Gas tags + cart aging (NEW — on LIVE and TEST)

Purpose: see which carts are selling vs sitting in the lot.
- **Gas pump icon ALWAYS shows on every parked cart**: green = gassed (on the
  Gas List), red = parked but not gassed. Empty spots show nothing.
- **No 48-hour reset.** Gas marks persist until the cart is sold or the Gas
  List is cleared. Leftover board/gasStart is removed automatically.
- **Sold = erase completes**: when the 1-min red-X grace ends (commitErase),
  that cart number's gas mark clears (board/gas/<num>) and its age entry is
  deleted — UNLESS the same number is still parked in another spot. Clearing a
  number by hand / typing over it is NOT a sale (keeps gas, so moves are safe).
- **Aging**: board/aging/<cart#> = {s: parked-since ms, g: ms it left the lot
  by hand}. Label ("2d", "3d"…, orange, bottom-left of the spot, tooltip
  "Parked since …") only once a cart has been parked 2+ days. Re-parked within
  15 min (MOVE_GRACE) = a move, keeps its age; later = fresh park. Stale "gone"
  entries removed after 15 min. Managed by reconcileAging() on the 5s interval
  (only after the board has loaded — boardLoaded flag), so it self-heals;
  carts already parked at launch started counting Oct 24.
- **Parking Clear Sheet** does NOT touch gas; it clears ages (Undo restores
  them). **Gas List** unchanged: tap mark/unmark, its own Clear Sheet, "Range
  gassed carts…" alerts to shop.
- Switch: `var LIFECYCLE_GAS = true;` (set false to bring back the old
  48h-gas-round behavior — that code is still present: GAS_TTL/checkGasExpiry/
  gasStart). Code: refreshGasIcons, agingKey/isParked/reconcileAging,
  commitErase, `.age-ind` CSS, spotAgeInd map.
- Verified with Playwright (scratchpad lifecycle.mjs, 25 checks).

## Everything else (unchanged from prior saves)

- **Parking Lot** A–M (13 lanes)×4 + 7×2 overflow. Erase = 1-min red-X grace
  (board/pending, 5s sweeper). Mark Unserviceable (⊘). Active-side highlight
  "Taking carts from: Left/Right" (shop sets, Range read-only, board/side).
  Per-cart gas pump icon + age label (see above).
- **Gas List** 1–65; no auto-reset (lifecycle tags). PARKING never auto-resets.
- **Undo (↶)** single-level. **Chat (💬)** one shared room. **Alerts (🔔)** toast
  + list, relative dates, routed by team (gas→shop grouped; "Request a new cart
  list"→range). **Phone notifications** opt-in, scoped to chat + cart requests
  (sw.js). **Team picker** Shop/Range. **Logo** real course logo (logo.png).
  Gate code 203.

## Backend (Firebase RTDB — project griff-golf-staff)

Config in `FIREBASE_CONFIG` atop the `<script>`. DATA_NS prefixes board/chat/
alerts. Keys: board/parking/<spot>, /broken/<spot>, /gas/<num>, /pending/<spot>,
/side, /aging/<cart#> ({s,g}), /gasStart (unused now); chat & alerts push lists. Rules (publish once; additive/safe):
```json
{ "rules": {
  "board":  { ".read": true, ".write": true },
  "chat":   { ".read": true, ".write": true },
  "alerts": { ".read": true, ".write": true },
  "test":   { ".read": true, ".write": true } } }
```

## Build (important)

Single source of truth: scratchpad `griff-cart-tracker.html` (app minus the
<head>/<body> wrapper). Scratchpad is EPHEMERAL and resets between sessions — if
gone, rebuild source by slicing index.html between `<body>` and `</body>`, and
reinstall Playwright (`npm init -y && npm install playwright`; browser
/opt/pw-browsers/chromium). Build writes BOTH index.html (full head: green cart
favicon + apple-touch + manifest) and test/index.html (minimal head, gold cart
favicon) via an mkH-style shell block, and copies logo.png into test/. Heads
ship normal/green; seasonal favicon/title/theme-color applied by JS.
IS_TEST (runtime) gates only: DATA_NS namespace, "Send a test notification"
button, TEST chip. Service workers: root sw.js + test/sw.js (identical).
`.nojekyll` at repo root. Grid: repeat(13,…) + min-width 690px; COLS=[A…M].

### Test-first → promote workflow
Build features gated behind IS_TEST, test on /test/, promote by removing those
IS_TEST gates (leave namespace def, test-notification button, TEST chip gated).

## Deployment / caching

- Repo paulanthony-alt/griff-golf-app. Branches: main (published via Pages) +
  claude/griff-golf-cart-tracker-99e7aw (working, kept in sync). Push to main →
  Pages auto-redeploy ~1–2 min.
- CACHING: Pages caches HTML ~10 min; phones cache hard. After a push users may
  see the old version until hard-refresh/reopen or ~10 min pass. Diagnose with a
  cache-buster query in a private window (e.g. `?v=2`). github.io + the Pages
  API are BLOCKED from this exec environment, so I can't inspect the served page
  or Pages build status from here — verify via the user or a cache-buster URL.
- main/working occasionally move via the GitHub UI — git fetch + rebase/merge
  before pushing; no force-push.

## Custom domain — NOT active

www.griffgolfstaff.com never registered (~$12/yr). To enable: buy domain, DNS
(CNAME www → paulanthony-alt.github.io, optional apex A 185.199.108-111.153),
set custom domain in Settings → Pages, Enforce HTTPS.

## Ideas discussed, not built

- 🎄 Christmas/December theme. Change app icon / lock-screen cart to the logo.
- Split overflow row by side; fully-closed-app push (FCM/Cloud Functions);
  per-user login; chat channels; multi-level undo; auto-update for cache.

## Working notes

- Commit attribution (current): `Co-Authored-By: Claude Opus 5.5
  <noreply@anthropic.com>` + `Claude-Session: https://claude.ai/code/session_01QjpuTemTTrDjL815Gk8Rzg`.
- In-code test hooks: __griffApplyRemote / __griffOnChat / __griffOnAlert /
  __griffSetReady / __griffSweep.
- SAVE files on the working branch (a few older ones also landed on main via
  working→main pushes — harmless).
- Verified with Playwright throughout.
