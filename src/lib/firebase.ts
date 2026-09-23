import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Fill these in with your Firebase project config (Project settings > General > Your apps).
// Safe to expose on the client — Firestore security rules do the real access control.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'PLACEHOLDER_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'PLACEHOLDER.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'PLACEHOLDER_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'PLACEHOLDER.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? 'PLACEHOLDER_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? 'PLACEHOLDER_APP_ID',
}

const hasNonPlaceholderValue = (value: string | undefined) =>
  Boolean(value && value.trim() && !value.includes('PLACEHOLDER_') && !value.includes('PLACEHOLDER.'))

// Until real config is provided, the app runs against src/lib/localBackend.ts instead
// (see groups.ts / users.ts) so the full flow is still usable without a Firebase project.
export const isFirebaseConfigured = Object.values(firebaseConfig).every(hasNonPlaceholderValue)

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
