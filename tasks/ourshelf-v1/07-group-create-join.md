---
title: Create group and join group flow
progress: done
---

# Create group and join group flow

Let a signed-in user create a new private group and invite others via a shareable link or 6-character code. Let any signed-in user join a group using that link or code. A user who creates a group becomes its first `admin` member.

## Scope

- `src/features/groups/groupService.ts` — `createGroup` (generates invite code, writes `groups` + `memberships` docs), `joinGroupByCode`
- `src/features/groups/CreateGroupPage.tsx` — form with group name, creates group, redirects to new group
- `src/features/groups/JoinGroupPage.tsx` — accepts invite code, calls `joinGroupByCode`, redirects to group
- `src/features/groups/InviteLinkBanner.tsx` — shows shareable URL and copy-to-clipboard button
- Route: `POST /groups/new` (create) and `GET /join/:code` (join)
- Input validation: group name 3–50 chars; invite code must match an active group
- React Testing Library tests for `CreateGroupPage` and `JoinGroupPage`

## Acceptance criteria

- [ ] Creating a group writes a `groups` document and a `memberships` document with `role: "admin"` in Firestore (verified via emulator UI)
- [ ] Invite URL resolves the code and joins the user as a `member`
- [ ] Joining the same group twice is idempotent — no duplicate membership document
- [ ] Joining a non-existent code shows an inline error (not a crash)
- [ ] After creating a group the user is redirected to that group's catalog
- [ ] UI follows the simplicity principles from task 06: plain-English labels, one primary CTA per page, visible error states inline (not modal crashes)
- [ ] Component tests pass: `pnpm test`
- [ ] Tests for `groupService.createGroup`, `groupService.joinGroupByCode`, `CreateGroupPage`, and `JoinGroupPage` are written in this task — none are deferred
- [ ] `pnpm build` exits 0 with no TypeScript errors — the app is fully buildable after this task

## Chrome DevTools loop

This task is **not complete** until the loop below passes in full. The agent runs this autonomously.

1. Run `pnpm dev`; open `http://localhost:5173` in Chrome.
2. Connect to the tab via the Chrome DevTools MCP server.
3. Navigate to the create-group page, fill in a valid name, submit → confirm redirect to the new group's catalog.
4. Copy the invite link/code from `InviteLinkBanner`. Sign in as a second emulator user, navigate to the join page, enter the code → confirm group membership.
5. Try joining with a made-up code → confirm an inline error message appears (no crash or blank screen).
6. Try joining the same group twice with the same user → confirm no duplicate membership.
7. Capture full-page screenshot of the created group's catalog → `qa-artifacts/T07/after.png`.
8. Capture Console output (zero uncaught errors) → `qa-artifacts/T07/console.txt`.
9. Capture Network log confirming the `groups` and `memberships` Firestore writes → `qa-artifacts/T07/network-notes.txt`.
10. If any step fails: fix, re-run from step 1, replace artifacts.
