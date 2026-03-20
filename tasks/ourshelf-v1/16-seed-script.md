---
title: Firestore seed script
progress: pending
---

# Firestore seed script

Write a Node.js seed script that populates the Firestore emulator with realistic demo data: two users, one group, several items of both types, one pending request, one active loan, and one completed loan. This makes manual QA and new-developer onboarding instant.

## Scope

- `scripts/seed.ts` — executable with `npx tsx scripts/seed.ts` or `pnpm seed`
- Uses the Admin SDK pointed at the emulator (`FIRESTORE_EMULATOR_HOST`)
- Creates: 2 `users` docs, 1 `groups` doc, 2 `memberships` (one admin, one member), 6 `items` (3 books, 3 board games in various statuses), 1 `borrowRequests` (pending), 1 `loans` (lent), 1 `loans` (returned) with matching request
- All timestamps use `admin.firestore.Timestamp.fromDate()`
- Script is idempotent: running it twice does not duplicate data (use fixed document IDs)
- `package.json` script: `"seed": "FIRESTORE_EMULATOR_HOST=localhost:8080 npx tsx scripts/seed.ts"`

## Acceptance criteria

- [ ] `pnpm seed` completes without errors when the emulator is running
- [ ] Running `pnpm seed` a second time produces no duplicate documents
- [ ] Seeded data is visible in the Emulator UI at `localhost:4000`
- [ ] The app renders the seeded catalog, active loan, and history page correctly when signed in as one of the seed users
- [ ] No Admin SDK credentials are required beyond the emulator host env var
- [ ] The seed script itself has no unit tests (it is a dev-only script); document this with a comment at the top of `scripts/seed.ts` so the absence of tests is intentional, not an oversight
- [ ] `pnpm build` exits 0 with no TypeScript errors after this task
