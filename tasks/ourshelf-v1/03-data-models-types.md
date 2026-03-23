---
title: Typed data models, enums, and Firestore index config
progress: done
---

# Typed data models, enums, and Firestore index config

Define every TypeScript interface, type, and enum used across the app. Declare Firestore index configuration. This task has no UI — it is pure types and config that all other features depend on.

## Scope

- `src/lib/types/user.ts` — `UserProfile`
- `src/lib/types/group.ts` — `Group`, `Membership`, `MemberRole` enum
- `src/lib/types/item.ts` — `Item`, `ItemType` enum (`book` | `board_game`), `ItemStatus` enum (`available` | `requested` | `lent` | `archived`)
- `src/lib/types/request.ts` — `BorrowRequest`, `RequestStatus` enum (`pending` | `approved` | `declined` | `cancelled`)
- `src/lib/types/loan.ts` — `Loan`, `LoanReturnState` enum (`lent` | `return_pending` | `returned`)
- `src/lib/types/index.ts` — re-exports everything
- `firestore.indexes.json` — all six indexes listed in the architecture plan
- Vitest unit tests asserting enum values match expected strings

## Acceptance criteria

- [ ] All types import cleanly across the codebase with no TypeScript errors
- [ ] Enum string values exactly match the values specified in the data model (e.g. `ItemStatus.Lent === "lent"`)
- [ ] `firestore.indexes.json` deploys without error against the emulator (`firebase deploy --only firestore:indexes --project demo-local`)
- [ ] Unit tests for enums pass: `pnpm test`
- [ ] Tests for all enums introduced in this task are written here — none are deferred
- [ ] No `any` types introduced
- [ ] `pnpm build` exits 0 with no TypeScript errors after this task
