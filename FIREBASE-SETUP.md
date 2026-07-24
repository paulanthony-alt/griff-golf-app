# Turning on shared live sync (Firebase) — one-time setup

The app is already wired for shared, real-time data. Until you paste a Firebase
config into `index.html`, it runs in **local-only mode** (each phone keeps its
own sheet). Do these steps once to make every phone share one live board.

Takes about 10 minutes. It's free (Firebase "Spark" plan).

## 1. Create a Firebase project
1. Go to https://console.firebase.google.com and sign in with a Google account.
2. Click **Add project** → name it e.g. `griff-cart-tracker` → continue.
3. You can **disable Google Analytics** (not needed) → Create project.

## 2. Create the Realtime Database
1. In the left menu: **Build → Realtime Database** → **Create Database**.
2. Pick a location (US is fine).
3. Start in **locked mode** for now → Enable. (We set the rules in step 4.)

## 3. Register a Web App and copy the config
1. Click the gear icon → **Project settings** → scroll to **Your apps**.
2. Click the **</>** (Web) icon → give it a nickname → **Register app**.
3. You'll see a `firebaseConfig = { ... }` block. Copy those values.
   You need: `apiKey`, `authDomain`, `databaseURL`, `projectId`, `appId`.
   (If `databaseURL` isn't shown, it's
   `https://<projectId>-default-rtdb.firebaseio.com`.)

## 4. Set the database rules
1. Back in **Realtime Database → Rules**, replace the contents with:

   ```json
   {
     "rules": {
       "board":  { ".read": true, ".write": true },
       "chat":   { ".read": true, ".write": true },
       "alerts": { ".read": true, ".write": true }
     }
   }
   ```
2. Click **Publish**.

   (If you set up the database before chat/alerts existed and only had a
   `board` rule, replace it with the block above and Publish again — otherwise
   chat messages and alerts will be silently rejected.)

   NOTE: these rules let anyone who reaches the database read/write the shared
   board. That's the trade-off for a no-login staff tool (same spirit as the
   "203" gate). Fine for cart locations / gas checkmarks. Don't store anything
   sensitive here. If you later want real per-user accounts, that's a bigger
   change — ask and we can do it.

## 5. Paste the config into the app
Easiest: send me the `firebaseConfig` values in our chat and I'll drop them in,
rebuild, and push — then it's live. Or do it yourself: open `index.html`, find
`var FIREBASE_CONFIG = {` near the top of the `<script>`, and replace the
`PASTE_...` placeholders with your real values. Commit and push to `main`.

Once the real `databaseURL` is in, the app auto-connects: every phone that
opens https://www.griffgolfstaff.com shares one board, and changes appear on
the others within about a second.

## How the data is stored
Everything lives under one `board` node:
- `board/parking/<spot>` → cart number (e.g. `board/parking/A1 = "12"`)
- `board/broken/<spot>`  → `true` for unserviceable carts
- `board/gas/<num>`      → `true` when cart N has gas

Writes are per-spot, so two people editing different spots at the same time
don't overwrite each other.
