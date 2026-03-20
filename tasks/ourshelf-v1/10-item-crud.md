---
title: Add, edit, and archive item
progress: pending
---

# Add, edit, and archive item

Allow any group member to add items they own to the group catalog, edit their own items, and archive items to remove them from the active catalog. Only the item owner may edit or archive their own items.

## Scope

- `src/features/items/AddItemPage.tsx` — form: title (required), type (required), author (optional, books only), description (optional), notes (optional), dueDaysDefault (optional)
- `src/features/items/EditItemPage.tsx` — same form pre-populated; shows "Archive" button
- `src/features/items/itemsService.ts` — `addItem`, `updateItem`, `archiveItem` service functions with input validation using Zod or manual validation
- `src/lib/validators/item.validator.ts` — validation schema reusable in tests
- Routes: `/groups/:groupId/items/new`, `/groups/:groupId/items/:itemId/edit`
- Owner-only guard: edit/archive buttons only visible to the item's `ownerUserId`
- Vitest unit tests for validators; React Testing Library tests for both form pages

## Acceptance criteria

- [ ] Adding a valid item creates a Firestore document with `status: "available"`, `ownerUserId`, `groupId`, `titleLower`, and server timestamps
- [ ] Editing an item updates only the changed fields and bumps `updatedAt`
- [ ] Archiving sets `status: "archived"` and hides the item from the catalog
- [ ] A non-owner visiting the edit URL sees a "forbidden" message, not the form
- [ ] `author` field only appears for `book` type
- [ ] Validation errors are shown inline per field
- [ ] Forms are minimal: only required fields are mandatory; optional fields are clearly labelled as optional
- [ ] The "Archive" action is visually distinct (destructive/red) and requires a single confirm step before writing
- [ ] UI follows the simplicity principles from task 06
- [ ] Validator unit tests pass: `pnpm test`
- [ ] Tests for `item.validator`, `itemsService.addItem/updateItem/archiveItem`, `AddItemPage`, and `EditItemPage` are written in this task — none are deferred
- [ ] `pnpm build` exits 0 with no TypeScript errors — the app is fully buildable after this task

## Chrome DevTools loop

This task is **not complete** until the loop below passes in full. The agent runs this autonomously.

1. Run `pnpm dev`; open `http://localhost:5173` in Chrome.
2. Connect to the tab via the Chrome DevTools MCP server.
3. Navigate to the add-item form. Submit with an empty title → confirm inline validation error appears without a page reload.
4. Select type = "Book" → confirm the `author` field appears. Switch to "Board game" → confirm `author` disappears.
5. Fill in a valid book, submit → confirm redirect to catalog and the new item appears with `status: available`.
6. Click the item's edit button → confirm the form is pre-populated. Change the title, save → confirm the updated title shows in the catalog.
7. Open the edit form again, click "Archive" → confirm the item disappears from the catalog.
8. Visit the edit URL as a different (non-owner) user → confirm a "forbidden" message is shown, not the form.
9. Capture full-page screenshot of the filled-in add form → `qa-artifacts/T10/after.png`.
10. Capture Console output (zero uncaught errors) → `qa-artifacts/T10/console.txt`.
11. Capture Network log confirming the Firestore write → `qa-artifacts/T10/network-notes.txt`.
12. If any step fails: fix, re-run from step 1, replace artifacts.
