---
title: Loan creation and active loans page
progress: pending
---

# Loan creation and active loans page

After approving a request, the owner marks the item as physically lent. This creates a `loan` document and transitions the item to `lent`. Show an active loans page where the owner can see everything currently out on loan.

## Scope

- `src/features/loans/loanService.ts` — `markAsLent(requestId)`: validates request is `approved`, creates a `loans` doc with `returnState: "lent"`, updates item to `status: "lent"`, and links `request.loanId`; all in a Firestore transaction
- `src/features/loans/ActiveLoansPage.tsx` — shows all items the user has lent out (loans with `returnState: "lent"` or `"return_pending"`), with borrower name, lent date, and optional due date
- `src/features/loans/MarkAsLentButton.tsx` — shown on `IncomingRequestsPage` for approved requests where no loan exists yet
- Route: `/groups/:groupId/loans/active`
- Loading, empty, and error states
- Vitest unit tests for `loanService.markAsLent` including transaction rollback on invalid input
- React Testing Library tests for `ActiveLoansPage`

## Acceptance criteria

- [ ] Clicking "Mark as lent" creates a `loans` document, updates request `loanId`, and transitions item to `lent` atomically
- [ ] Attempting to mark as lent when the request is not `approved` throws a typed error
- [ ] Active loans page lists all currently lent items for the authenticated owner
- [ ] Each loan row shows borrower name, item title, lent date, and days remaining if `dueAt` is set
- [ ] Empty state shows when the owner has nothing out on loan
- [ ] "Mark as lent" is a clearly labelled button — no icon-only affordance
- [ ] Loan rows show borrower name and item title prominently; dates and optional due date are secondary
- [ ] UI follows the simplicity principles from task 06
- [ ] Unit and component tests pass: `pnpm test`
- [ ] Tests for `loanService.markAsLent` (including invalid-state rejection), `ActiveLoansPage`, and `MarkAsLentButton` are written in this task — none are deferred
- [ ] `pnpm build` exits 0 with no TypeScript errors — the app is fully buildable after this task

## Chrome DevTools loop

This task is **not complete** until the loop below passes in full. The agent runs this autonomously.

1. Run `pnpm dev`; open `http://localhost:5173` in Chrome.
2. Connect to the tab via the Chrome DevTools MCP server.
3. Sign in as the item owner. On the incoming requests page, click "Mark as lent" for an approved request.
4. Confirm the button disappears after clicking and the item badge updates to "Lent".
5. Navigate to the active loans page → confirm the loan appears with borrower name, item title, and lent date.
6. Confirm the empty state renders correctly when there are no active loans.
7. Capture full-page screenshot of the active loans page with one loan row → `qa-artifacts/T12/after.png`.
8. Capture Console output (zero uncaught errors) → `qa-artifacts/T12/console.txt`.
9. Capture Network log confirming the transaction write (loan created, item updated, request linked) → `qa-artifacts/T12/network-notes.txt`.
10. If any step fails: fix, re-run from step 1, replace artifacts.
