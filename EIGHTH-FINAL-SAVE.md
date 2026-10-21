# EIGHTH-FINAL-SAVE — The Griff Cart Tracker (Oct 21, 2026)

Latest checkpoint. Adds auto date-driven seasonal themes (Halloween →
Thanksgiving → normal) on top of SEVENTH-FINAL-SAVE. To resume: open a Claude
Code session on this repo and say "read EIGHTH-FINAL-SAVE.md and continue."

## Links

- **LIVE (staff):** https://paulanthony-alt.github.io/griff-golf-app/  · code **203**
- **TEST (sandbox):** https://paulanthony-alt.github.io/griff-golf-app/test/  · code **203**

Same app; LIVE and TEST share NOTHING (separate board/chat/alerts/side/gasStart
via DATA_NS = "test/" on the /test/ path, else ""). TEST shows a gold "TEST"
chip + "TEST" title.

## Seasonal themes (NEW — temporary, automatic by date)

`getSeason()` picks the theme on every page load (live + test), so transitions
happen automatically with no re-push:
- **Halloween** (Oct 20–31): dark purple + pumpkin-orange; `.halloween` class;
  bats + cobwebs in header; slime-green gassed pumps; "if you dare 🎃" gate;
  🎃 favicon/title; theme-color #2a1442.
- **Thanksgiving** (all of November): warm cream + burnt-sienna/rust; prefers
  `.thanksgiving` class; falling 🍁🍂 leaves in header; 🦃+🍁 title; "Happy
  Thanksgiving!" gate; 🦃 favicon/title; theme-color #8a3b17.
- **Normal** (otherwise, incl. Dec 1+): the regular green app, no class.
Seasonal favicon/title/theme-color are set in JS (heads ship normal/green).
Preview/override (any date): add `?season=thanksgiving` (or `=halloween`, or
`=` for normal) to the URL, or set localStorage `griff-season`.
Themes are a committed single look (ignore light/dark) via `!important` token
overrides in `:root.halloween` / `:root.thanksgiving`, plus `.hw-*` / `.tg-*`
decoration CSS and the IIFE season block near the end of the <script>.
To remove all seasonal theming later: delete the `.halloween` + `.thanksgiving`
CSS blocks, the seasonal IIFE + getSeason/seasonFavicon in JS. (Changing dates
= edit getSeason only.) A 🎄 December theme would be another case in getSeason +
a `.christmas` CSS block.

## Everything else the app does (unchanged)

- **Parking Lot** — A–M (13 lanes) × 4 + 7×2 overflow. Type cart numbers.
  Erase (✕, 1-min red-X grace via board/pending, 5s sweeper). Mark
  Unserviceable (⊘). Active-side highlight "Taking carts from: Left/Right"
  (shop sets, Range read-only, board/side, gold). Per-cart gas pump icon
  (green gassed / red not) that shows ONLY during a gas round.
- **Gas List** — carts 1–65; auto-resets 48h after a round starts
  (board/gasStart; GAS_TTL/checkGasExpiry); PARKING never auto-resets.
- **Undo (↶)** single-level. **Team Chat (💬)** one shared room. **Alerts (🔔)**
  toast + list, relative dates (fmtWhen), routed by team (gas→shop grouped,
  "Request a new cart list"→range). **Phone notifications** opt-in, scoped to
  chat + cart requests (sw.js). **Team picker** Shop/Range. **Logo** = real
  course logo (logo.png, white chip). Gate code 203.

## Backend (Firebase RTDB — project griff-golf-staff)

Config in `FIREBASE_CONFIG` atop the `<script>`. DATA_NS prefixes board/chat/
alerts. Keys: board/parking/<spot>, board/broken/<spot>, board/gas/<num>,
board/pending/<spot>, board/side, board/gasStart; chat & alerts push lists.
Rules (publish once; additive/safe):
```json
{ "rules": {
  "board":  { ".read": true, ".write": true },
  "chat":   { ".read": true, ".write": true },
  "alerts": { ".read": true, ".write": true },
  "test":   { ".read": true, ".write": true } } }
```

## Build (important)

Single source of truth: scratchpad `griff-cart-tracker.html` (app minus the
<head>/<body> wrapper). Scratchpad is EPHEMERAL and HAS reset between sessions —
if gone, rebuild source from index.html by slicing between `<body>` and
`</body>`, and reinstall Playwright (`npm init -y && npm install playwright`;
browser /opt/pw-browsers/chromium). Build writes BOTH index.html (full head:
cart favicon + apple-touch + manifest) and test/index.html (minimal head, gold
cart favicon) via mkH() shell helper, and copies logo.png into test/. HEADS SHIP
NORMAL/GREEN now — seasonal favicon/title/theme-color are applied by JS.
IS_TEST (runtime) still gates only: DATA_NS namespace, the "Send a test
notification" button, and the TEST chip. Service workers: root sw.js + test/sw.js
(identical). `.nojekyll` at repo root (serve files as-is). Grid: repeat(13,…) +
min-width 690px; COLS=[A…M].

### Test-first → promote workflow
Build features gated behind IS_TEST, test on /test/, promote by removing those
IS_TEST gates. When promoting, leave the namespace def, test-notification
button, and TEST chip gated.

## Deployment / caching

- Repo paulanthony-alt/griff-golf-app. Branches: `main` (published via Pages) +
  `claude/griff-golf-cart-tracker-99e7aw` (working, kept in sync). Push to main
  → Pages auto-redeploy (~1–2 min).
- CACHING: GitHub Pages caches HTML ~10 min; phones cache hard. After a push,
  users may see the old version until a hard refresh / reopen, or ~10 min pass.
  Diagnose with a cache-buster query in a private window (e.g. `?v=hw2`). The
  GitHub Pages API and github.io are BLOCKED from this exec environment, so I
  can't inspect the served page or Pages build status from here — verify via the
  user or a cache-buster URL. (Offered an auto-update mechanism; not built.)
- `main`/working occasionally move via the GitHub UI — git fetch + rebase/merge
  before pushing; no force-push.

## Custom domain — NOT active

www.griffgolfstaff.com never registered (~$12/yr). To enable: buy domain, DNS
(CNAME www → paulanthony-alt.github.io, optional apex A 185.199.108-111.153),
set custom domain in Settings → Pages, Enforce HTTPS.

## Ideas discussed, not built

- 🎄 Christmas/December theme (easy: add to getSeason + a `.christmas` block).
- Change app icon / lock-screen cart graphic to the logo.
- Split the overflow row by side; fully-closed-app push (FCM/Cloud Functions);
  per-user login; chat channels; multi-level undo; auto-update for cache.

## Working notes

- Commit attribution (current): `Co-Authored-By: Claude Opus 4.8
  <noreply@anthropic.com>` + `Claude-Session: https://claude.ai/code/session_01QjpuTemTTrDjL815Gk8Rzg`.
- In-code test hooks: __griffApplyRemote / __griffOnChat / __griffOnAlert /
  __griffSetReady / __griffSweep.
- SAVE files stay on the working branch only (off `main` where possible; a few
  older SAVE commits did land on main via working→main pushes — harmless).
- Verified with Playwright throughout.
