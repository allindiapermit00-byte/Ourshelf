---
title: History page
progress: pending
---

# History page

Give users a personal record of everything they have borrowed and returned. This is a read-only page. It is the "personal borrowing history" feature required in v1.

## Scope

- `src/features/history/HistoryPage.tsx` — chronological list of the user's completed loans (`returnState: "returned"`), showing item title, owner name, dates borrowed and returned, and group name
- `src/features/history/historyService.ts` — `getHistoryForUser(userId)` querying loans by `borrowerUserId` ordered by `returnedAt DESC`; enriches each loan with item and group metadata
- Route: `/history`
- Loading state, empty state ("Nothing borrowed yet — go find something to read!"), error state
- React Testing Library tests for the page

## Acceptance criteria

- [ ] All completed loans for the authenticated user are listed in reverse-chronological order
- [ ] Each row displays: item title, item type badge, owner display name, group name, borrowed date, returned date
- [ ] Loans still in progress (`lent` or `return_pending`) do not appear on this page
- [ ] Empty state renders correctly when the user has no history
- [ ] Service function fetches only the authenticated user's loans (no cross-user data)
- [ ] History rows are scannable: item title and dates are the most prominent elements; group name and owner are secondary
- [ ] UI follows the simplicity principles from task 06
- [ ] Component tests pass: `pnpm test`
- [ ] Tests for `historyService.getHistoryForUser` and `HistoryPage` (loading, empty, populated) are written in this task — none are deferred
- [ ] `pnpm build` exits 0 with no TypeScript errors — the app is fully buildable after this task

## Chrome DevTools loop

This task is **not complete** until the loop below passes in full. The agent runs this autonomously.

1. Run `pnpm dev`; open `http://localhost:5173` in Chrome.
2. Connect to the tab via the Chrome DevTools MCP server.
3. Sign in as a user with at least one completed loan (use seed data from task 16).
4. Navigate to `/history` → confirm completed loans appear in reverse-chronological order.
5. Verify each row shows: item title, type badge, owner name, group name, borrowed date, returned date.
6. Confirm that in-progress loans (`lent` or `return_pending`) do NOT appear.
7. Sign in as a user with no history → confirm the friendly empty state renders.
8. Capture full-page screenshot of the history page with at least one row → `qa-artifacts/T14/after.png`.
9. Capture Console output (zero uncaught errors) → `qa-artifacts/T14/console.txt`.
10. Capture Network log confirming the loans Firestore query → `qa-artifacts/T14/network-notes.txt`.
11. If any step fails: fix, re-run from step 1, replace artifacts.
