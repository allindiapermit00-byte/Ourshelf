---
title: Return flow
progress: pending
---

# Return flow

The borrower signals they have returned the item (`return_pending`). The owner then confirms receipt, which completes the loan and marks the item `available` again. Both steps are required; the item does not become available until the owner confirms. State: `lent → return_pending → returned`.

## Scope

- `src/features/loans/loanService.ts` — add `markAsReturned(loanId)` (borrower action: `lent → return_pending`) and `confirmReturn(loanId)` (owner action: `return_pending → returned`, sets item back to `available`, sets `returnedAt` and `returnConfirmedAt`)
- `src/features/loans/BorrowedItemsPage.tsx` — borrower's view of all items they currently have out (`lent` or `return_pending`), with a "I've returned this" button
- `src/features/loans/MarkAsReturnedButton.tsx` — shown to the borrower on `BorrowedItemsPage`
- `src/features/loans/ConfirmReturnButton.tsx` — shown to the owner on `ActiveLoansPage` for loans in `return_pending`
- Route: `/groups/:groupId/loans/borrowed`
- Loading, empty, and error states
- Vitest unit tests for both state transitions
- React Testing Library tests for `BorrowedItemsPage`

## Acceptance criteria

- [ ] Borrower marking as returned transitions loan to `return_pending` and sets `returnedAt`
- [ ] Owner confirming return transitions loan to `returned`, sets `returnConfirmedAt`, and updates item to `available`
- [ ] Item disappears from `ActiveLoansPage` and `BorrowedItemsPage` after return is confirmed
- [ ] Attempting an invalid transition throws a typed error and does not write
- [ ] Borrower cannot see items owned by them in `BorrowedItemsPage`
- [ ] "I've returned this" and "Confirm return" are plain-English, clearly labelled buttons — not icon-only
- [ ] The two-step return process (borrower signals → owner confirms) is communicated to both parties with clear status labels
- [ ] UI follows the simplicity principles from task 06
- [ ] Unit and component tests pass: `pnpm test`
- [ ] Tests for `loanService.markAsReturned`, `loanService.confirmReturn` (including invalid-state rejections), `BorrowedItemsPage`, and both return buttons are written in this task — none are deferred
- [ ] `pnpm build` exits 0 with no TypeScript errors — the app is fully buildable after this task

## Chrome DevTools loop

This task is **not complete** until the loop below passes in full. The agent runs this autonomously.

1. Run `pnpm dev`; open `http://localhost:5173` in Chrome.
2. Connect to the tab via the Chrome DevTools MCP server.
3. Sign in as the borrower. Navigate to "Borrowed items" → confirm the lent item appears.
4. Click "I've returned this" → confirm the item badge updates to "Awaiting confirmation" (return_pending).
5. Sign in as the owner. On the active loans page, confirm the loan now shows a "Confirm return" button.
6. Click "Confirm return" → confirm the loan row disappears from active loans.
7. Navigate to the catalog → confirm the item status is back to "Available".
8. Capture full-page screenshot of `BorrowedItemsPage` showing the `return_pending` badge → `qa-artifacts/T13/after.png`.
9. Capture Console output (zero uncaught errors) → `qa-artifacts/T13/console.txt`.
10. Capture Network log confirming both Firestore writes (markAsReturned + confirmReturn) → `qa-artifacts/T13/network-notes.txt`.
11. If any step fails: fix, re-run from step 1, replace artifacts.
