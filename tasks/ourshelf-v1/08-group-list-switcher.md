---
title: Group list page and active group context
progress: done
---

# Group list page and active group context

Let users see all their groups in one place and switch between them. Persist the last-selected group in `localStorage` so refreshing the page keeps the user in the same group.

## Scope

- `src/features/groups/GroupProvider.tsx` — React context holding the active `Group` and its `Membership`; reads memberships from Firestore; persists selection to `localStorage`
- `src/features/groups/useGroup.ts` — typed hook
- `src/features/groups/GroupListPage.tsx` — list of the user's groups with name, member count, and a "Switch" action per group; "Create group" and "Join group" CTAs
- `src/features/groups/GroupSwitcher.tsx` — compact dropdown in the nav bar showing the active group name with a switch option
- Route: `/groups` (list)
- Empty state when the user has no groups
- Loading state while memberships are fetching
- React Testing Library tests for `GroupListPage` (empty, loading, populated)

## Acceptance criteria

- [ ] All groups for the authenticated user are listed
- [ ] Switching groups updates `GroupProvider` context and persists to `localStorage`
- [ ] Reloading the page restores the previously selected group
- [ ] Empty state shows when user has no groups and links to create/join
- [ ] Group switcher in nav bar is discoverable in one tap; switching takes effect immediately with no full page reload
- [ ] UI follows the simplicity principles from task 06
- [ ] Component tests pass: `pnpm test`
- [ ] Tests for `GroupProvider`, `GroupListPage` (empty, loading, populated), and `GroupSwitcher` are written in this task — none are deferred
- [ ] `pnpm build` exits 0 with no TypeScript errors — the app is fully buildable after this task

## Chrome DevTools loop

This task is **not complete** until the loop below passes in full. The agent runs this autonomously.

1. Run `pnpm dev`; open `http://localhost:5173` in Chrome.
2. Connect to the tab via the Chrome DevTools MCP server.
3. Sign in with a user who belongs to 2+ groups → verify both appear on the group list page.
4. Click the group switcher in the nav bar, select a different group → verify the active group name updates immediately.
5. Reload the page → verify the previously selected group is still active (restored from `localStorage`).
6. Sign in with a user with no groups → verify the empty state renders with create/join CTAs.
7. Capture full-page screenshot of the group list → `qa-artifacts/T08/after.png`.
8. Capture Console output (zero uncaught errors) → `qa-artifacts/T08/console.txt`.
9. Capture Network log confirming the memberships Firestore query → `qa-artifacts/T08/network-notes.txt`.
10. If any step fails: fix, re-run from step 1, replace artifacts.
