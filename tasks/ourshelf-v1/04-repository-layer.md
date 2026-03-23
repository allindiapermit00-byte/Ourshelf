---
title: Firestore repository layer
progress: done
---

# Firestore repository layer

Build the thin repository layer that wraps all Firestore SDK calls. No component or service may call Firestore directly — all reads and writes go through these functions. This enforces the data-access boundary stated in the architecture rules.

## Scope

- `src/lib/repositories/users.repo.ts` — `getUser`, `setUser`, `updateUser`
- `src/lib/repositories/groups.repo.ts` — `getGroup`, `createGroup`, `updateGroup`
- `src/lib/repositories/memberships.repo.ts` — `getMembershipsForUser`, `getMembersForGroup`, `createMembership`, `updateMembership`
- `src/lib/repositories/items.repo.ts` — `getItem`, `listItemsForGroup`, `createItem`, `updateItem`
- `src/lib/repositories/requests.repo.ts` — `getRequest`, `listRequestsForOwner`, `listRequestsForRequester`, `createRequest`, `updateRequest`
- `src/lib/repositories/loans.repo.ts` — `getLoan`, `listLoansForBorrower`, `listActiveLoansForGroup`, `createLoan`, `updateLoan`
- `src/lib/repositories/index.ts` — re-exports
- Vitest unit tests using the Firestore emulator for each repository function

## Acceptance criteria

- [ ] Every repository function has explicit TypeScript return types — no `Promise<any>`
- [ ] All functions use the typed interfaces from task 03
- [ ] Repository unit tests run against the Firestore emulator and pass: `pnpm test`
- [ ] Tests for every repository function introduced in this task are written here — none are deferred
- [ ] No Firestore imports exist outside `src/lib/firebase/` and `src/lib/repositories/`
- [ ] Each function handles the "document not found" case explicitly (returns `null` or throws a typed error)
- [ ] `pnpm build` exits 0 with no TypeScript errors after this task
