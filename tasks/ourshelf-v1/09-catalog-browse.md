---
title: Catalog browse experience
progress: pending
---

# Catalog browse experience

Build the main catalog page where group members can see all items in the active group. Support filtering by item type and status. Each item card shows enough information to decide whether to request it. This is a read-only page — adding/editing items is task 10.

## Scope

- `src/features/items/CatalogPage.tsx` — lists all non-archived items for the active group
- `src/features/items/ItemCard.tsx` — displays title, type, owner display name, and current status badge
- `src/features/items/CatalogFilters.tsx` — filter bar: type (`All` | `Books` | `Board games`) and status (`All` | `Available` | `Lent`)
- `src/features/items/itemsService.ts` — `listItemsForGroup` (wraps repository, applies client-side filter in v1)
- Route: `/groups/:groupId/catalog`
- Loading state, empty state per filter combination, error state
- React Testing Library tests for `CatalogPage` (loading, empty, populated, filtered)

## Acceptance criteria

- [ ] All available items for the active group are displayed
- [ ] Type and status filters update the displayed list without a page reload
- [ ] Each item card shows correct status badge colour (available = green, lent = amber, requested = blue)
- [ ] Empty state is distinct per filter (e.g. "No board games yet" vs "No items yet")
- [ ] Loading spinner shows while Firestore query is in flight
- [ ] Filter controls are visible above the list (not hidden in a drawer or menu) — discoverable in one glance
- [ ] UI follows the simplicity principles from task 06: plain-language filter labels, generous card spacing, one primary CTA ("Add item") per page
- [ ] Component tests pass: `pnpm test`
- [ ] Tests for `itemsService.listItemsForGroup`, `CatalogPage` (loading, empty, populated, filtered), and `ItemCard` are written in this task — none are deferred
- [ ] `pnpm build` exits 0 with no TypeScript errors — the app is fully buildable after this task

## Chrome DevTools loop

This task is **not complete** until the loop below passes in full. The agent runs this autonomously.

1. Run `pnpm dev`; open `http://localhost:5173` in Chrome.
2. Connect to the tab via the Chrome DevTools MCP server.
3. Sign in; navigate to the catalog for a group seeded with both books and board games.
4. Verify all items appear on first load with correct status badges.
5. Click the "Books" filter → confirm only book items are shown; click "Board games" → only board games.
6. Click the "Lent" status filter → confirm only lent items show; verify empty state shows when filter yields no results.
7. Confirm loading spinner appears briefly on first navigation to the catalog (throttle network in DevTools if needed).
8. Capture full-page screenshot of the populated catalog → `qa-artifacts/T09/after.png`.
9. Capture Console output (zero uncaught errors) → `qa-artifacts/T09/console.txt`.
10. Capture Network log confirming the items Firestore query → `qa-artifacts/T09/network-notes.txt`.
11. If any step fails: fix, re-run from step 1, replace artifacts.
