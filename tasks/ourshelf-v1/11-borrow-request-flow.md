---
title: Borrow request flow
progress: pending
---

# Borrow request flow

Let a group member request to borrow an available item. The item owner receives the request and approves or declines it. The requester can cancel a pending request. State transitions must be strictly enforced: `pending → approved | declined | cancelled`.

## Scope

- `src/features/requests/requestService.ts` — `createBorrowRequest`, `approveRequest`, `declineRequest`, `cancelRequest`; each function validates the current state before writing
- `src/features/requests/RequestButton.tsx` — "Request to borrow" button shown on `ItemCard` when the item is `available` and the viewer is not the owner
- `src/features/requests/IncomingRequestsPage.tsx` — owner's view of all `pending` requests for their items, with approve/decline actions
- `src/features/requests/MyRequestsPage.tsx` — requester's view of their own requests with status badge and cancel option
- `src/features/items/ItemDetailPage.tsx` (create or update) — detail view showing item info and request status
- Routes: `/groups/:groupId/requests/incoming`, `/groups/:groupId/requests/mine`
- Loading, empty, and error states for both list pages
- Vitest unit tests for `requestService` state-machine logic
- React Testing Library tests for `IncomingRequestsPage` and `MyRequestsPage`

## Acceptance criteria

- [ ] Requesting an item writes a `borrowRequests` doc with `status: "pending"` and updates the item to `status: "requested"` atomically (Firestore batch or transaction)
- [ ] Owner can approve a pending request — status becomes `approved`
- [ ] Owner can decline a pending request — status becomes `declined`; item reverts to `available`
- [ ] Requester can cancel a pending request — status becomes `cancelled`; item reverts to `available`
- [ ] Attempting an invalid transition (e.g. approve an already-declined request) throws a typed error and does not write to Firestore
- [ ] An owner cannot request their own item (the request button is hidden for them)
- [ ] "Request to borrow" button is visible directly on the item card — reachable in 2 taps from the catalog
- [ ] Approve and decline are labelled clearly on the incoming requests page; no icon-only buttons
- [ ] UI follows the simplicity principles from task 06
- [ ] Service unit tests for all four transitions pass: `pnpm test`
- [ ] Tests for all four `requestService` transitions, `IncomingRequestsPage`, and `MyRequestsPage` are written in this task — none are deferred
- [ ] `pnpm build` exits 0 with no TypeScript errors — the app is fully buildable after this task

## Chrome DevTools loop

This task is **not complete** until the loop below passes in full. The agent runs this autonomously.

1. Run `pnpm dev`; open `http://localhost:5173` in Chrome.
2. Connect to the tab via the Chrome DevTools MCP server.
3. Sign in as user A (item owner). Confirm "Request to borrow" button is NOT visible on user A's own items.
4. Sign in as user B (borrower). Click "Request to borrow" on an available item → confirm the item badge changes to "Requested".
5. Sign in as user A. Navigate to incoming requests → confirm the request from user B is listed.
6. Click "Approve" → confirm the request status updates to "Approved" in the UI.
7. Click "Decline" on a different pending request → confirm item reverts to "Available" and status shows "Declined".
8. Sign in as user B, navigate to "My requests", click "Cancel" on a pending request → confirm status shows "Cancelled" and item is available again.
9. Capture full-page screenshot of the incoming requests page with one approved request → `qa-artifacts/T11/after.png`.
10. Capture Console output (zero uncaught errors) → `qa-artifacts/T11/console.txt`.
11. Capture Network log confirming the batch/transaction writes → `qa-artifacts/T11/network-notes.txt`.
12. If any step fails: fix, re-run from step 1, replace artifacts.
