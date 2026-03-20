---
title: Firestore Security Rules and rule tests
progress: pending
---

# Firestore Security Rules and rule tests

Write and test production-grade Firestore Security Rules that enforce group membership and ownership for every collection. Rules must be the last line of defence — assume the frontend can be bypassed.

## Scope

- `firestore.rules` — rules for all six collections: `users`, `groups`, `memberships`, `items`, `borrowRequests`, `loans`
- `tests/firestore-rules/` — rule tests using `@firebase/rules-unit-testing`
- Key rules to enforce:
  - Users can only read/write their own `users` document
  - Only group members (`memberships` with `status: "active"`) may read a group's items, requests, and loans
  - Only the item owner may update or archive their own item
  - Only the request requester may cancel; only the item owner may approve/decline
  - Only the loan owner may call `markAsLent`; only the borrower may call `markAsReturned`; only the owner may call `confirmReturn`
  - No client may directly set `createdAt` to an arbitrary value (must use `request.time`)

## Acceptance criteria

- [ ] All rule tests pass against the Firestore emulator: `pnpm test:rules`
- [ ] A non-member attempting to read a group's items is denied (tested)
- [ ] An owner attempting to read another user's profile is denied (tested)
- [ ] A member attempting to approve someone else's request is denied (tested)
- [ ] A borrower attempting to confirm their own return is denied (tested)
- [ ] Rules deploy cleanly: `firebase deploy --only firestore:rules --project demo-local`
- [ ] No rule allows unauthenticated writes to any collection
- [ ] All rule tests are written in this task — none are deferred; every deny scenario listed in the scope has a corresponding test
- [ ] `pnpm build` exits 0 with no TypeScript errors after this task (rule changes do not affect the frontend build, but the check is still required)
