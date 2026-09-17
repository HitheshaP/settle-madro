# What's left to do on your personal laptop

Everything that could be built without an account/login has been built and verified
(type-checks clean, production build succeeds, all screens tested end-to-end in a
local "demo mode" — see below). Here's exactly what's left, and why each step needs
your personal machine.

## Why these steps couldn't be done on the office laptop

- Firebase requires signing into a Google account in a browser.
- Vercel requires either a browser-based device login or an email confirmation link.
- Neither can complete headlessly from here — they need you to click "approve" in a
  real browser session tied to your account.

## 1. Install Node.js (if not already on your personal laptop)

Download the LTS installer from nodejs.org, or use a version manager. Confirm with:

```bash
node -v   # should print v20 or newer
npm -v
```

## 2. Get the project onto your personal laptop and install dependencies

Copy the whole `SplitWise` folder over (zip it, USB drive, OneDrive sync, whatever's
easiest), then:

```bash
cd SplitWise
npm install
```

## 3. Set up Firebase (needed for real multi-device sync)

Right now, with no `.env` file, the app automatically runs in **local demo mode** —
all data is saved to browser localStorage on a single device only (see
`src/lib/localBackend.ts` and `isFirebaseConfigured` in `src/lib/firebase.ts`). This
is why the full app — onboarding, character picker, create/join group, add expense,
calculate, settle-up animation — could already be built and tested without any
account. Once you add real config below, it switches to live Firestore sync across
everyone's phones automatically, with zero code changes.

1. Go to https://console.firebase.google.com and create a new project (free Spark
   plan is enough).
2. **Authentication** → Sign-in method → enable **Anonymous**.
3. **Firestore Database** → Create database → start in production mode → pick any
   region close to your friend group.
4. In Firestore → Rules, paste the contents of `firestore.rules` (already written in
   this project) and publish.
5. Project settings (gear icon) → General → scroll to "Your apps" → click the `</>`
   web icon → register an app (no hosting needed) → copy the `firebaseConfig` object.
6. In the project folder:
   ```bash
   cp .env.example .env
   ```
   Then fill in the six `VITE_FIREBASE_*` values from the config you just copied.
7. Restart the dev server (`npm run dev`) — the app will now use real Firestore.

## 4. Test locally

```bash
npm run dev
```

Open the printed `localhost` URL, walk through onboarding → create a group → add an
expense → Calculate → Settled (watch the coin/cake animation). Open the same URL in
a second browser/incognito tab to simulate a second person and confirm real-time sync
works once Firebase is configured.

## 5. Deploy so it's installable on phones (needs HTTPS)

"Add to Home Screen" only works over HTTPS (localhost is exempt, but a phone hitting
your laptop's IP over plain http won't get it). Easiest free option: Vercel.

```bash
npx vercel login        # opens a browser / sends a confirmation link — needs your account
npx vercel               # first deploy, answer the prompts (defaults are fine, Vite is auto-detected)
npx vercel --prod        # promote to a stable production URL
```

Copy the six `VITE_FIREBASE_*` values into the Vercel project's Environment
Variables (Project → Settings → Environment Variables) so the deployed build also
has real Firebase config, then redeploy (`npx vercel --prod`).

Share the resulting `https://your-app.vercel.app` link over WhatsApp. On iPhone:
Safari → Share → Add to Home Screen. On Android Chrome: the install banner should
appear automatically (or menu → Add to Home Screen / Install app).

## 6. Check installability & performance

Chrome DevTools → Application → Manifest (confirms icons/manifest are valid) and the
Lighthouse tab → run a PWA audit against the deployed URL.

## Later, purely creative steps (no accounts needed, do anytime)

- Swap the placeholder emoji avatars in `src/components/characters/characterData.ts`
  for real Rive character files (idle/walk/pay states) — the `CharacterAvatar`
  component is the single place that would need updating.
- Swap the Framer-Motion coin/cake effect in
  `src/components/animations/SettleAnimation.tsx` for real Lottie/Rive assets.
- Regenerate app icons from new branding art:
  ```bash
  npx pwa-assets-generator --preset minimal -m false src/assets/logo-source.svg
  ```
  then move the generated files from `src/assets/` into `public/icons/`.
