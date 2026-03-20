---
title: Firebase project wiring and local emulators
progress: pending
---

# Firebase project wiring and local emulators

Connect the app to Firebase (Auth + Firestore). Wire environment variables for both local emulator and production. Configure the Firebase Emulator Suite so every developer can run fully offline without touching production data.

## Scope

- `src/lib/firebase/config.ts` — initialize Firebase app from env vars
- `src/lib/firebase/auth.ts` — export the `Auth` instance
- `src/lib/firebase/firestore.ts` — export the `Firestore` instance
- `.env.example` documenting all required `VITE_FIREBASE_*` variables
- `.env.local` (git-ignored) for local dev values
- `firebase.json`, `.firebaserc` for emulator configuration
- `scripts/start-emulators.sh` convenience script
- Emulator UI accessible at `localhost:4000`

## Acceptance criteria

- [ ] `pnpm dev` connects to local emulators when `VITE_USE_EMULATORS=true`
- [ ] Firebase app initialises without console errors in browser
- [ ] Emulator suite starts with a single command (`pnpm emulators`)
- [ ] Switching to production config (env vars only, no code change) works correctly
- [ ] No Firebase API keys or credentials committed to the repo
- [ ] `pnpm build` exits 0 with no TypeScript errors after this task
- [ ] This task introduces no testable service logic beyond wiring; document this explicitly in `src/lib/firebase/config.ts` with a comment (`// No unit tests in task 02 — Firebase wiring is validated by pnpm build and emulator startup`) so the absence of tests is intentional, not an oversight
