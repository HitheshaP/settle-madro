# Settle Madro

A cute, premium-feeling expense-splitting PWA for friend groups. Tracks who owes whom — no payment integration. Installs to the home screen on iPhone and Android via "Add to Home Screen."

## Stack

React + Vite + TypeScript, Tailwind CSS v4, React Router, Zustand, Firebase (Firestore + Anonymous Auth), Framer Motion, Lottie, Rive.

## Getting started

```bash
npm install
cp .env.example .env   # fill in your Firebase project config
npm run dev
```

## Scripts

- `npm run dev` — start the dev server (PWA/service worker enabled in dev too)
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run oxlint

## Checking installability

Open the app in Chrome, then DevTools → Application → Manifest to confirm the manifest, icons, and service worker are all registered correctly.

## Regenerating icons

Icons are generated from `src/assets/logo-source.svg` into `public/icons/`. To regenerate after changing the source art:

```bash
npx pwa-assets-generator --preset minimal -m false src/assets/logo-source.svg
```

Then move the generated files from `src/assets/` into `public/icons/`.
