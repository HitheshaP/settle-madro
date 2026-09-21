# Hosting Information — Settle Madro

This is the single source of truth for how Settle Madro is hosted, end to end.
It is written so that a human **or another AI agent** picking this project up
cold — with zero prior context — can read this file top to bottom and either
(a) complete the hosting setup from scratch, or (b) diagnose and fix a broken
deployment, without needing to ask anyone anything first.

Status as of writing this doc: **nothing is deployed yet.** No Firebase
project exists, no Vercel project exists, and there is no `.env` file in the
repo. The app currently only runs in local "demo mode" (see
[How the app behaves without Firebase](#how-the-app-behaves-without-firebase-demo-mode)).
Everything below is the from-scratch path to take it live.

If you're picking this up later and something looks out of date (a URL
doesn't match, an env var is missing, etc.), trust what you observe in the
Firebase Console / Vercel Dashboard / repo over this document, and update this
file to match reality.

---

## 1. Architecture overview

Settle Madro is a **static single-page app (SPA)** with **no custom backend
server**. There is no API route, no Node server, no container to run. All
"backend" logic is:

- **Firebase Firestore** — the database (real-time sync across devices).
- **Firebase Authentication (Anonymous)** — every user gets a silent,
  passwordless anonymous account so Firestore security rules can tell devices
  apart without a login screen.
- **Firestore Security Rules** (`firestore.rules` in this repo) — the *only*
  access control layer. There is no server-side code enforcing permissions;
  the rules file is the entire security model.

Everything else — routing, UI, animations, the "who owes whom" math — runs
entirely in the browser.

| Layer | Technology | Where it's hosted |
|---|---|---|
| Frontend build/bundler | Vite 8 | — |
| UI framework | React 19 + TypeScript | — |
| Styling | Tailwind CSS v4 | — |
| Routing | React Router v7 (`BrowserRouter`, client-side) | — |
| State | Zustand | — |
| Animations | Framer Motion, Lottie, Rive | — |
| PWA / offline / installability | `vite-plugin-pwa` (Workbox service worker) | — |
| Static hosting / CDN / HTTPS | **Vercel** | vercel.com |
| Database | **Firebase Firestore** | console.firebase.google.com |
| Auth | **Firebase Authentication (Anonymous provider)** | console.firebase.google.com |
| Source control | **GitHub** | `https://github.com/HitheshaP/settle-madro` (already exists) |

Because it's a client-side SPA using `BrowserRouter` (real URL paths, not
`#hash` routes), the host **must** rewrite every path back to `index.html` so
that deep links / page refreshes on routes like `/group/abc123` don't 404.
This repo already ships that config in `vercel.json` — see
[vercel.json explained](#vercelson-explained).

### How the app behaves without Firebase (demo mode)

Look at `src/lib/firebase.ts`. If the six `VITE_FIREBASE_*` environment
variables aren't set, `isFirebaseConfigured` is `false`, and the app silently
falls back to `src/lib/localBackend.ts`, which stores everything in the
browser's `localStorage` on that one device only. This is intentional — it's
why the whole app could be built and tested without any account. **This is
also why, right now, with no `.env` and no Vercel env vars, a deployed build
would technically work but only in single-device demo mode — no real sync
between friends.** Section 3 (Firebase setup) is what turns on real
multi-device sync.

---

## 2. Accounts you need

| Account | Needed for | Already have it? |
|---|---|---|
| GitHub | Source control + triggers Vercel deploys | ✅ Yes — repo exists at `https://github.com/HitheshaP/settle-madro`, remote `origin` already configured locally |
| Google account (for Firebase) | Database + Auth | ❌ Not yet — create a Firebase project (Section 3) |
| Vercel account | Hosting/CDN/HTTPS/deploys | ❌ Not yet — sign up at vercel.com (Section 5) |

**Recommendation:** sign up for Vercel using **"Continue with GitHub"** (not
email). That's what makes the GitHub-integration auto-deploy setup in Section
5 a two-click process instead of a manual token dance.

Cost: both Firebase (Spark/free plan) and Vercel (Hobby/free plan) have free
tiers that are more than enough for a friend-group app. See
[Section 9 — Free tier limits](#9-free-tier-limits--things-to-watch) for the
actual numbers.

---

## 3. Set up Firebase (database + auth)

This only needs to be done once. It requires signing into
`console.firebase.google.com` with a Google account in a real browser — it
cannot be done headlessly/by an AI agent, since Google requires interactive
login approval.

1. Go to **https://console.firebase.google.com** and sign in with a Google
   account (create one first if you don't have one — it's free).
2. Click **"Add project"** (or "Create a project").
   - Name it something recognizable, e.g. `settle-madro`.
   - You can disable Google Analytics for this project (not needed).
   - Click **Create project** and wait for it to finish provisioning.
3. **Enable Anonymous Authentication:**
   - Left sidebar → **Build → Authentication** → **Get started**.
   - Go to the **Sign-in method** tab.
   - Click **Anonymous** in the provider list → toggle **Enable** → **Save**.
4. **Create the Firestore database:**
   - Left sidebar → **Build → Firestore Database** → **Create database**.
   - Choose **"Start in production mode"** (not test mode — production mode
     means "deny everything by default," and step 5 below supplies the real
     rules).
   - Pick a **region** close to where the friend group actually lives (e.g.
     an `asia-south1` region if the group is in India). This cannot be
     changed later without recreating the database, so choose deliberately.
   - Click **Enable**.
5. **Publish the security rules:**
   - Still in Firestore Database, go to the **Rules** tab.
   - Delete whatever default rules are shown.
   - Open `firestore.rules` in this repo, copy its **entire contents**, and
     paste it into the Firebase console editor.
   - Click **Publish**.
   - What these rules actually do (for reference / debugging):
     - `users/{userId}`: anyone signed in (anonymously) can read any user
       profile; a user can only write their own profile document.
     - `groups/{groupId}`: only members listed in that group's `memberIds`
       array can read it; any signed-in user can create a group (as long as
       they add themselves to `memberIds`); updates are allowed for any
       signed-in user (intentionally relaxed so that joining via an invite
       code — which adds your uid to `memberIds` — works); deletes are
       blocked entirely.
     - `groups/{groupId}/expenses/{expenseId}` and `.../settlements/{id}`:
       only group members can read or create; updates/deletes are blocked
       (expenses and settlements are treated as an append-only ledger).
6. **Register a Web App and get the config values:**
   - Click the **gear icon** (top left, next to "Project Overview") →
     **Project settings**.
   - Scroll down to **"Your apps"** → click the **`</>`** (Web) icon.
   - Give it a nickname (e.g. `settle-madro-web`). You do **not** need to
     check "Also set up Firebase Hosting" — Vercel is the host, not Firebase
     Hosting.
   - Click **Register app**. It will show a `firebaseConfig` object that
     looks like this:
     ```js
     const firebaseConfig = {
       apiKey: "AIzaSy...",
       authDomain: "settle-madro-xxxxx.firebaseapp.com",
       projectId: "settle-madro-xxxxx",
       storageBucket: "settle-madro-xxxxx.appspot.com",
       messagingSenderId: "123456789012",
       appId: "1:123456789012:web:abcdef1234567890",
     }
     ```
   - **Copy all six values somewhere safe** (a password manager, a private
     note — not a public chat). You'll paste them into two places: your local
     `.env` (Section 4) and Vercel's Environment Variables (Section 5).
   - These values are **safe to expose in client-side code / a public repo**
     — they are not secrets. Firebase's real access control is entirely the
     security rules from step 5, not these keys. (This is standard Firebase
     behavior, not specific to this project.)

No composite Firestore indexes need to be created manually — every query in
`src/lib/groups.ts` and `src/lib/users.ts` filters/orders on a single field,
which Firestore can serve with automatic single-field indexes.

---

## 4. Configure and test locally

Do this before deploying, to confirm Firebase is wired up correctly while
it's easy to debug.

```bash
npm install
cp .env.example .env
```

Open `.env` and fill in the six values from Section 3, step 6:

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=settle-madro-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=settle-madro-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=settle-madro-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

`.env` is already listed in `.gitignore` — **it must never be committed.**
Double check with `git status` before any commit if you're ever unsure.

Then:

```bash
npm run dev
```

Open the printed `localhost` URL and walk through: onboarding (name +
character) → create a group → add an expense → **Calculate** → **Settled**
(watch the animation). Then open the **same URL in a second browser or an
incognito tab** to simulate a second person, and confirm changes made in one
tab show up in the other in real time — that confirms Firestore sync (not
demo mode) is actually working.

If it's still behaving like single-device demo mode (no sync between tabs),
see [Section 10 — Troubleshooting](#10-troubleshooting).

Other useful local commands:

```bash
npm run build     # type-checks (tsc -b) then produces a production build in dist/
npm run preview   # serves the dist/ build locally, closest thing to prod you can test without deploying
npm run lint      # oxlint
```

Run `npm run build` locally at least once before deploying — it will catch
TypeScript errors that `npm run dev` won't.

---

## 5. Push to GitHub

The repo already has a GitHub remote configured:

```
origin  https://github.com/HitheshaP/settle-madro.git
```

Locally there are three branches: `main`, `Hit_Office`, and `personal`
(check with `git branch -a`). **Vercel's auto-deploy (Section 6) watches
whichever branch you tell it is the "Production Branch," and `main` is the
conventional choice.** Before deploying:

1. Make sure your current work is committed:
   ```bash
   git status
   git add <files>
   git commit -m "your message"
   ```
2. If you're on a branch other than `main` (e.g. `Hit_Office`) and want it
   live, either merge it into `main` or open a PR into `main` and merge it —
   same flow the repo already uses (see recent commits: "Merge pull request
   #3 from HitheshaP/Hit_Office").
3. Push:
   ```bash
   git push origin main
   ```

Vercel deploys **from GitHub directly**, not from your local machine — so
whatever is pushed to `main` is what goes live in production.

---

## 6. Deploy on Vercel (GitHub-integration auto-deploy)

This is the recommended setup: **every push to `main` auto-deploys to
production; every other branch/PR gets its own free preview URL.** This
requires an interactive browser login the first time — cannot be done
headlessly by an agent.

1. Go to **https://vercel.com** and sign up / log in using **"Continue with
   GitHub"**.
2. On the Vercel dashboard, click **"Add New..." → "Project"**.
3. Under **"Import Git Repository,"** find and select
   `HitheshaP/settle-madro`. (If it's not listed, click "Adjust GitHub App
   Permissions" and grant Vercel access to that repo.)
4. Vercel will auto-detect this as a **Vite** project from `package.json`.
   Confirm/leave these settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (the repo root — this is where `package.json`
     lives)
   - **Build Command:** `npm run build` (runs `tsc -b && vite build`)
   - **Output Directory:** `dist`
   - **Install Command:** `npm install` (default)
5. **Before clicking Deploy**, expand **"Environment Variables"** and add all
   six, exactly matching your local `.env` from Section 4:

   | Name | Value |
   |---|---|
   | `VITE_FIREBASE_API_KEY` | (from Firebase config) |
   | `VITE_FIREBASE_AUTH_DOMAIN` | (from Firebase config) |
   | `VITE_FIREBASE_PROJECT_ID` | (from Firebase config) |
   | `VITE_FIREBASE_STORAGE_BUCKET` | (from Firebase config) |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | (from Firebase config) |
   | `VITE_FIREBASE_APP_ID` | (from Firebase config) |

   Apply each to **all three environments** (Production, Preview, and
   Development checkboxes) so preview deployments from PRs also talk to real
   Firebase instead of falling back to demo mode. (If you'd rather keep
   preview deployments isolated from production data, you could instead
   leave preview envs unset — they'll run in local-demo-only mode per device
   — but the simplest and currently-intended setup is to apply to all three.)

   Because Vite only exposes env vars prefixed `VITE_` to client code (see
   `vite.config.ts` / how `import.meta.env` works), any variable added here
   *must* keep the `VITE_` prefix exactly as named above, or the app will
   silently fall back to demo mode again.

6. Click **Deploy**. First build takes 1-2 minutes. Vercel will give you a
   production URL like `https://settle-madro.vercel.app` (or
   `https://settle-madro-<random>.vercel.app` if that exact name is taken).

7. **Confirm auto-deploy is live:** In the Vercel project → **Settings →
   Git**, confirm **"Production Branch"** is set to `main`. From now on:
   - Push/merge to `main` → new **Production** deployment at the main URL.
   - Push to any other branch, or open a PR → a unique **Preview**
     deployment URL is generated automatically, posted as a comment/check on
     the PR/commit in GitHub.

### `vercel.json` explained

```json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/static-build", "config": { "distDir": "dist" } }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

This file already exists in the repo and Vercel will respect it. It does two
things:
- Tells Vercel to build this as a static site (`@vercel/static-build`) and
  serve the `dist/` output directory.
- **Rewrites every path to `/index.html`** — this is required because the
  app uses `react-router-dom`'s `<BrowserRouter>` (real paths like
  `/group/abc123`, not `#/group/abc123`). Without this rewrite, refreshing
  the page on any route other than `/` would 404. If this file is ever
  deleted or its `routes` block removed, deep links/page-refreshes on
  non-root routes will break in production — that's the #1 thing to check
  first if users report "the app 404s when I refresh."

(This uses the older Vercel "Build Output" config schema (`builds`/`routes`)
rather than the newer `rewrites` key or `vercel.json`'s modern equivalents —
it still works correctly and there's no need to migrate it unless it starts
conflicting with Vercel's auto-detected Vite settings.)

### Custom domain (optional)

Not required — the default `*.vercel.app` URL works fine and is what gets
shared over WhatsApp per the original app brief. If a custom domain is
wanted later: Vercel project → **Settings → Domains** → add the domain →
follow the DNS instructions Vercel shows (usually a `CNAME` record).

### Manual CLI deploys (fallback, not the primary method)

Only needed if you want to deploy without pushing to GitHub (e.g. testing a
local-only change). Once you've linked the project once via the dashboard
import above, you can also do:

```bash
npm i -g vercel      # install the CLI once
vercel login         # opens a browser / sends a confirmation link
vercel                # deploys current directory as a PREVIEW
vercel --prod         # promotes to PRODUCTION (same URL as the GitHub-triggered one)
```

Prefer the GitHub push flow (Section 5) as the normal way to ship changes —
it keeps the deployed code, the git history, and PR review in sync. Use the
CLI only as a one-off escape hatch.

---

## 7. Verify the deployment actually works end-to-end

After the first deploy:

1. Open the production URL (`https://settle-madro.vercel.app` or whatever
   Vercel assigned).
2. Walk through the full flow: onboarding (name + character) → create a
   group → add an expense → **Calculate** → **Settled** animation.
3. Open **Firebase Console → Firestore Database → Data** and confirm real
   documents appear under `users/` and `groups/` — this is the definitive
   check that the deployed build is talking to real Firestore and not demo
   mode. (If nothing shows up there, see Troubleshooting.)
4. Open the URL on a phone, or in a second browser/incognito tab, and confirm
   an expense added in one place shows up in the other in real time.
5. **Installability check:** in desktop Chrome, DevTools → **Application**
   tab → **Manifest** — confirm the manifest, icons, and service worker all
   show green/registered with no errors.
6. **Lighthouse PWA audit:** DevTools → **Lighthouse** tab → run an audit
   against the deployed URL with the "Progressive Web App" category checked.

---

## 8. How end users will actually use it (after hosting is live)

This app is deliberately **not** published to the App Store or Play Store —
per the original brief, it's shared as a plain link over WhatsApp and
installed as a PWA ("Add to Home Screen"). Here's the full user-facing flow
once Section 6 is done:

1. **You share the link.** Send `https://settle-madro.vercel.app` (or your
   actual assigned URL) to the friend group over WhatsApp/iMessage/etc. No
   app store, no download, no install file needed — it's just a website.
2. **First open (onboarding):** each person opens the link, sees the
   onboarding screen, picks a name and a character avatar. Behind the scenes
   this creates their anonymous Firebase Auth identity + a `users/{uid}`
   Firestore document — silent, no password, no email.
3. **Install to home screen (optional but recommended)** so it behaves like
   a real app (opens full-screen, no browser address bar, works offline for
   the cached shell):
   - **iPhone (Safari):** open the link in Safari (must be Safari, not
     Chrome, for iOS PWA install) → tap the **Share** icon → **Add to Home
     Screen** → **Add**.
   - **Android (Chrome):** open the link in Chrome → either an **"Install
     app"** banner appears automatically, or tap the **⋮** menu → **Add to
     Home screen** / **Install app**.
   - After installing, the icon on their home screen opens the app in
     standalone mode (no browser chrome), same as a native app.
4. **Create or join a group:** one person creates a group and shares the
   generated invite code with the others (in-app); everyone else joins that
   group using the code.
5. **Add expenses:** anyone in the group logs an expense (what was paid, by
   whom, split between whom).
6. **Calculate:** any member taps **Calculate**, and the app runs the
   debt-simplification math client-side to show the minimal set of
   "X owes Y ₹amount" payments needed to settle the whole group.
7. **Settle up:** the person who owes actually pays the other person
   *outside the app* — via their own UPI app, cash, card, whatever they
   normally use. This app **never touches real money or payment
   integrations** by design (per the original brief). Once paid, they tap the
   **Settled/Paid** button in-app, which triggers the coin/cake settle
   animation and records the settlement in Firestore so everyone's balances
   update in real time.
8. **Offline behavior:** thanks to the service worker (`vite-plugin-pwa`),
   the app shell (UI, icons, cached assets) still opens even with no signal;
   live data requires connectivity to sync (Firestore also has some built-in
   offline queuing/retry).

No one other than you (the person deploying) ever needs a Vercel account, a
Firebase account, a GitHub account, or to run any command — end users only
ever interact with the plain HTTPS link.

---

## 9. Free tier limits — things to watch

| Service | Free plan | Relevant limit |
|---|---|---|
| **Firebase (Spark plan)** | Free, no credit card required | Firestore: 50,000 reads/day, 20,000 writes/day, 1 GiB stored. Anonymous Auth: effectively unlimited for this scale. |
| **Vercel (Hobby plan)** | Free, no credit card required | 100 GB bandwidth/month, unlimited static deploys, unlimited preview deployments. Hobby plan is for personal/non-commercial use, which this qualifies as. |

For a single friend group (a handful to a few dozen people), both limits are
essentially non-issues. If the app is ever shared much more widely (e.g.
posted publicly, used by many separate friend groups), keep an eye on:
**Firebase Console → Usage and billing**, and **Vercel dashboard → Usage**.

---

## 10. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| App works locally but deployed version shows no sync between devices / data resets per-device | Env vars not set (or misspelled) in Vercel | Vercel project → **Settings → Environment Variables** — confirm all 6 `VITE_FIREBASE_*` keys exist, spelled exactly as in `.env.example`, applied to **Production** environment, then **redeploy** (env var changes require a new deploy to take effect — they're baked in at build time, not read at runtime). |
| Refreshing/deep-linking a non-root route (e.g. `/group/abc123`) shows a 404 | `vercel.json`'s rewrite rule is missing/broken, or Vercel's auto-detected Vite settings are overriding it | Confirm `vercel.json` exists at repo root with the `routes` block shown in Section 6, and that it's actually committed to the branch being deployed. |
| Auth fails in the deployed app but works locally | `VITE_FIREBASE_AUTH_DOMAIN` in Vercel doesn't match the Firebase web app config, or Anonymous sign-in isn't enabled | Re-copy the value from Firebase Console → Project settings → Your apps; confirm Authentication → Sign-in method → Anonymous is Enabled. |
| Blank page after visiting the installed home-screen icon | Stale cached service worker from a previous broken build | DevTools → **Application** → **Service Workers** → Unregister → hard refresh (Ctrl+F5 / Cmd+Shift+R). `vite-plugin-pwa` is set to `registerType: 'autoUpdate'`, so this should be rare/self-healing, but a hard refresh forces it. |
| Firestore permission-denied errors in the browser console | Rules not published, or user not authenticated when the read/write happens | Firebase Console → Firestore Database → Rules — confirm the published rules match this repo's `firestore.rules` exactly; confirm Authentication → Users shows anonymous users being created. |
| Build fails on Vercel but `npm run build` succeeds locally | Node version mismatch | `package.json` declares `"engines": { "node": ">=20" }`. Check Vercel project → **Settings → General → Node.js Version** is set to 20.x or newer. |
| New push to `main` doesn't trigger a deploy | GitHub integration disconnected, or "Production Branch" misconfigured | Vercel project → **Settings → Git** — confirm the repo is still connected and Production Branch = `main`. |
| Someone sees `PLACEHOLDER_API_KEY`-style errors, or app is oddly in demo mode | `VITE_FIREBASE_*` vars not actually applied to the environment being viewed (e.g. set only for Production, but user is on a Preview URL) | Check Vercel env vars are applied to all three environments (Production/Preview/Development) as described in Section 6, step 5. |

---

## 11. Security notes

- `.env` is gitignored and must **never** be committed — verify with
  `git status` before committing if ever unsure.
- The six `VITE_FIREBASE_*` values are safe to expose publicly (they're
  compiled into the client bundle by design) — Firestore's real access
  control is entirely `firestore.rules`, not these keys. Do not, however,
  treat this as license to loosen the rules file without thinking it
  through.
- If a Vercel personal access token is ever created for CLI/CI use and is
  meant to be temporary, revoke it afterward: **Vercel Dashboard → Account
  Settings → Tokens**.
- If this project is ever handed off or worked on from a temporary/shared
  machine, revoke any stale sessions/tokens afterward from both the Firebase
  Console (Project Settings → Users and permissions) and Vercel (Account
  Settings → Tokens / Sessions).
- Nothing in this app handles real payment credentials, card numbers, or
  money movement — by design, it only tracks *who owes whom*, so the
  security surface is intentionally small.

---

## 12. Quick reference

**Key files:**

| File | Purpose |
|---|---|
| `vercel.json` | Vercel build + SPA routing config (see Section 6) |
| `firestore.rules` | The entire Firestore access-control model (see Section 3, step 5) |
| `.env.example` | Template for the 6 required env vars — copy to `.env` locally, mirror in Vercel dashboard |
| `src/lib/firebase.ts` | Where env vars are read; defines `isFirebaseConfigured` (demo-mode fallback switch) |
| `src/lib/localBackend.ts` | The localStorage-based demo-mode backend used when Firebase isn't configured |
| `vite.config.ts` | Build config, PWA manifest, service worker caching rules |

**Command cheat sheet:**

```bash
# local dev
npm install
cp .env.example .env      # then fill in 6 VITE_FIREBASE_* values
npm run dev

# pre-deploy check
npm run build              # must pass before pushing
npm run preview            # sanity-check the production build locally

# ship to production
git add <files>
git commit -m "..."
git push origin main       # Vercel auto-deploys this to production

# manual/CLI deploy (fallback only)
vercel login
vercel --prod
```

**Accounts/dashboards you'll come back to:**

- Firebase Console: https://console.firebase.google.com — Firestore data
  browser, Auth users, security rules, usage/quotas.
- Vercel Dashboard: https://vercel.com/dashboard — deployments, env vars,
  domains, build logs, usage.
- GitHub repo: https://github.com/HitheshaP/settle-madro — source of truth
  for what's deployed; `main` branch = what's in production.
