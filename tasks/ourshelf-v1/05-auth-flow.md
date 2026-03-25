---
title: Authentication flow and protected shell
progress: done
---

# Authentication flow and protected shell

Implement Google sign-in via Firebase Authentication. Create an auth context that exposes the current user to the entire app. Add a protected route wrapper so unauthenticated users are always redirected to the sign-in page. Bootstrap a `UserProfile` document in Firestore on first sign-in.

## Scope

- `src/features/auth/AuthProvider.tsx` — React context wrapping `onAuthStateChanged`
- `src/features/auth/useAuth.ts` — typed hook
- `src/features/auth/authService.ts` — `signInWithGoogle`, `signOut`, `bootstrapUserProfile` service functions
- `src/features/auth/SignInPage.tsx` — sign-in page with Google button, loading state, and error state
- `src/app/ProtectedRoute.tsx` — redirects to `/sign-in` when unauthenticated
- `src/app/router.tsx` — React Router setup with `/sign-in` public and all other routes protected
- React Testing Library tests for `SignInPage` (renders button, shows loading, shows error)

## Acceptance criteria

- [ ] Unauthenticated visit to any protected route redirects to `/sign-in`
- [ ] Google sign-in flow completes and redirects to the app shell
- [ ] `UserProfile` document is created in Firestore on first sign-in (verified in emulator UI)
- [ ] Subsequent sign-ins update `lastLoginAt` without overwriting profile data
- [ ] Sign-out clears auth state and redirects to `/sign-in`
- [ ] Auth loading state prevents flash of protected content before auth resolves
- [ ] Component tests pass: `pnpm test`
- [ ] Tests for every service function and component introduced in this task (`authService`, `AuthProvider`, `SignInPage`, `ProtectedRoute`) are written here — none are deferred
- [ ] `pnpm build` exits 0 with no TypeScript errors — the app is fully buildable after this task

## Chrome DevTools loop

This task is **not complete** until the loop below passes in full. The agent runs this autonomously — do not ask the user for screenshots or confirmation.

1. Run `pnpm dev`; open `http://localhost:5173` in Chrome.
2. Connect to the running tab via the Chrome DevTools MCP server.
3. Navigate to a protected route while signed out → confirm redirect to `/sign-in`.
4. Click "Sign in with Google", complete the emulator auth flow → confirm redirect to the app shell.
5. Reload the page → confirm the user remains signed in (no flash of the sign-in page).
6. Click sign-out → confirm redirect back to `/sign-in`.
7. Capture a full-page screenshot of the signed-in app shell → `qa-artifacts/T05/after.png`.
8. Capture Console output (must show zero uncaught errors) → `qa-artifacts/T05/console.txt`.
9. Capture Network log with Preserve log enabled; confirm the Firestore `users` write appears → `qa-artifacts/T05/network-notes.txt`.
10. If any step fails: fix the code, re-run from step 1, and replace artifacts with the latest passing run.
