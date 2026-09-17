# Personal laptop handoff checklist

Hand this file to the agent on your personal laptop (e.g. "read
PERSONAL-LAPTOP-CHECKLIST.md and work through it with me"). It's the continuation of
a Settle Madro PWA scaffolded on an office laptop that had no browser-login access.
The full app (onboarding, groups, expenses, debt simplification, settle-up
animations, PWA/offline support) is already built and verified — `npx tsc -b` and
`npm run build` both pass clean. What's left all requires an interactive browser
login, which is why it's happening here instead.

Companion doc: `SETUP-NEXT-STEPS.md` in this same folder has the fuller walkthrough
with explanations. This file is the condensed action checklist.

## Things ONLY you (the human) can do — the agent should pause here and hand off

- [ ] **Sign into vercel.com** when `vercel login` opens a browser tab / prints a
      device code. GitHub login is fastest if you have a GitHub account.
- [ ] **Sign into console.firebase.google.com** with a Google account to create the
      Firebase project.
- [ ] **Approve the Vercel device-auth code** if using `--temporary` deploys.

Everything else below the agent can run directly.

## 1. Install

- [ ] Node.js **v20 or newer LTS** from nodejs.org (`node -v` to confirm — the repo's
      `package.json` now declares `"engines": {"node": ">=20"}` so mismatches show up
      early). npm comes bundled with Node, no separate install needed.
- [ ] `npm install` in the project root.

## 2. Firebase project (one-time, needs your Google login)

- [ ] Create project at console.firebase.google.com.
- [ ] Authentication → Sign-in method → enable **Anonymous**.
- [ ] Firestore Database → Create database → production mode.
- [ ] Firestore → Rules → paste `firestore.rules` (already in this repo) → Publish.
- [ ] Project settings → General → Your apps → add a Web app → copy the config.
- [ ] `cp .env.example .env` → fill in the 6 `VITE_FIREBASE_*` values.

No composite Firestore indexes are needed — every query in `src/lib/groups.ts` and
`src/lib/users.ts` filters/orders on a single field.

## 3. Local test

- [ ] `npm run dev`, walk through: onboarding → create group → add expense →
      Calculate → Settled (watch the animation).
- [ ] Open the same URL in a second browser/incognito tab to confirm real-time
      sync between "two people" now that Firebase is live.

## 4. Deploy (needs your Vercel login)

- [ ] `npx vercel login`
- [ ] `npx vercel` — first deploy; accept defaults (Vite auto-detected, no
      `vercel.json` needed, output dir `dist` is standard).
- [ ] Vercel dashboard → Project → Settings → Environment Variables → add the same
      6 `VITE_FIREBASE_*` values (the local `.env` is gitignored and never uploaded
      automatically).
- [ ] `npx vercel --prod` — redeploy so the production build picks up those env vars.
- [ ] Confirm the live URL actually talks to Firestore (not demo mode) — check
      Firestore console for the `users`/`groups` documents showing up.

## 5. Phone install test

- [ ] Send the `https://….vercel.app` link to yourself on WhatsApp.
- [ ] iPhone Safari: Share → Add to Home Screen → open from home screen, confirm it
      opens standalone (no browser chrome).
- [ ] Android Chrome: install banner should appear, or menu → Install app.
- [ ] Turn on airplane mode after first load, reopen the app, confirm the cached
      shell still opens instead of a blank/broken screen.
- [ ] Chrome DevTools → Lighthouse → PWA audit against the live URL.

## Things worth doing but easy to forget

- [ ] **`git init` + first commit.** The project isn't a git repo yet (it wasn't
      created on the office laptop deliberately, since no git remote/login was
      available). Once on your personal laptop, initializing git gives you real
      version history and lets you switch Vercel from CLI-deploy to
      git-push-to-deploy later if you want. `.gitignore` already excludes
      `node_modules`, `dist`, and `.env`.
- [ ] **Double-check `.env` never gets committed.** It's in `.gitignore`, but worth
      a glance at `git status` before any commit, in case something changes that.
- [ ] **Firestore free-tier limits.** Spark (free) plan gives 50K reads / 20K writes
      per day — plenty for a friend group, but if the app is shared more widely
      later, keep an eye on the Firebase usage dashboard.
- [ ] **Test with 3+ real people**, not just 2 browser tabs — confirms invite codes,
      multiple simultaneous group members, and the debt-simplification math (already
      unit-verified for a 4-person case, but real usage is the real test).
- [ ] **Rebranding later**: if you swap `src/assets/logo-source.svg` for real
      artwork, regenerate icons with
      `npx pwa-assets-generator --preset minimal -m false src/assets/logo-source.svg`
      then move the output from `src/assets/` into `public/icons/` (see README).
- [ ] **Character/animation upgrades** are isolated on purpose — swapping placeholder
      emoji avatars for real Rive files only touches
      `src/components/characters/characterData.ts` + `CharacterAvatar.tsx`; swapping
      the coin/cake settle effect for real Lottie/Rive only touches
      `src/components/animations/SettleAnimation.tsx`. No other files need to change.

## 6. Security & credentials (quick checks)

- [ ] Confirm `.env` contains only the `VITE_FIREBASE_*` values and no private
      keys or passwords. `.env` must remain in `.gitignore`.
- [ ] Revoke any stale Firebase service accounts or browser-saved device sessions
      from the Firebase Console if you used a temporary machine earlier.
- [ ] If you created a Vercel token for CLI deploys and it is temporary, revoke it
      after finishing: Vercel Dashboard → Settings → Tokens.

## 7. Troubleshooting (common fixes)

- [ ] App shows blank page after install: open DevTools → Application → Service
      Workers → unregister the service worker and hard-refresh (Ctrl+F5).
- [ ] Auth failing in browser but works locally: ensure `VITE_FIREBASE_*` in Vercel
      match the web app config from Firebase (including `authDomain`).
- [ ] Real-time sync not appearing between tabs: check Firestore rules in
      console.firebase.google.com → Firestore → Rules; ensure anonymous auth is
      allowed and rules aren't blocking reads/writes.

## 8. Post-deploy checklist

- [ ] Confirm production URL shows real Firestore documents (not demo/sample data).
- [ ] Run a basic Lighthouse audit and check PWA, Accessibility, and Best Practices.
- [ ] Take a short recording or screenshot of onboarding → create group → settle
      flow for future demos or handoff notes.

## 9. Contacts & follow-up

- [ ] Save the Firebase project ID and Vercel project name in a safe note for the
      team (avoid pasting `.env`).
- [ ] If you want, open a PR to add any final README notes or screenshots so the
      next person can reproduce the live demo quickly.

## Done

- [ ] Once all items above are complete, check this box and close the loop.
