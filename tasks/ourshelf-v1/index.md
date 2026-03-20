# ourshelf-v1: OurShelf — private group sharing tracker for books and board games

## Overview

Build a lightweight web app where families and friend groups can list items they own, request to borrow them, confirm lending and returns, and keep a personal borrowing history. The app uses React + TypeScript + Vite on the frontend, Firebase Auth + Firestore for backend services, and deploys to Cloud Run via GitHub Actions.

## Changes from the rough plan

The following improvements were made to the original T01–T16 task list:

| Original | Change | Reason |
|---|---|---|
| T02 Cloud Run container | Moved to task 17 | The container is not needed during development; building features first is lower-friction |
| T04 Firestore schema + seed | Split into tasks 03 (types), 04 (repository layer), and 16 (seed script) | Types and the repository layer are needed independently by all features; the seed script is a QA aid, not a foundation |
| T14 Security Rules (end) | Kept near end (task 15) but strengthened | Rules logically depend on all data shapes being finalised; placement is correct |
| New: task 06 App shell + components | Added explicitly | The rough plan mentions reusable components but never assigned a dedicated task for them |
| New: task 16 Seed script | Added | A seed script dramatically speeds up manual QA and new-developer onboarding; it was only mentioned implicitly |

## Engineering rules that apply to every task

These rules are non-negotiable. Every task must satisfy all of them before it is marked complete.

1. **App stays runnable after every task.** `pnpm dev` must start without errors and `pnpm build` must exit 0 with zero TypeScript errors once the task is finished. No task may leave the app in a broken or non-buildable state.
2. **Tests ship with the change, not later.** Any service function, validator, component, or state-machine logic introduced in a task must have its tests written and passing in the same task. Tests are never deferred to a future task. If a task has no testable logic, state that explicitly in the task file.
3. **Chrome DevTools loop closes every UI task.** Any task that introduces a user-visible route or interaction must complete the full loop described in its `## Chrome DevTools loop` section — screenshot, console output, network notes — before the task is considered done.
4. **No regressions.** Running `pnpm test` and `pnpm build` at the end of each task must produce the same pass count as the previous task, plus any new tests added by this task.

## Task order

1. [`01-repo-bootstrap.md`](01-repo-bootstrap.md) — Vite + React + TypeScript + Tailwind project; foundational for everything
2. [`02-firebase-wiring.md`](02-firebase-wiring.md) — Firebase SDK init, env vars, emulator config; needed before any Firestore work
3. [`03-data-models-types.md`](03-data-models-types.md) — All TypeScript interfaces and enums; no code should run without these types
4. [`04-repository-layer.md`](04-repository-layer.md) — Firestore access functions; all feature services depend on this
5. [`05-auth-flow.md`](05-auth-flow.md) — Google sign-in, auth context, protected routes; every feature page requires authentication
6. [`06-app-shell-components.md`](06-app-shell-components.md) — Persistent shell, nav, reusable UI components; all feature pages render inside this
7. [`07-group-create-join.md`](07-group-create-join.md) — Create and join a group; prerequisite for everything group-scoped
8. [`08-group-list-switcher.md`](08-group-list-switcher.md) — Group list and active-group context; depends on 07
9. [`09-catalog-browse.md`](09-catalog-browse.md) — Read-only catalog; depends on groups and items types
10. [`10-item-crud.md`](10-item-crud.md) — Add, edit, archive items; depends on catalog (09) and repository (04)
11. [`11-borrow-request-flow.md`](11-borrow-request-flow.md) — Request, approve, decline, cancel; depends on items (10)
12. [`12-loan-creation-active-loans.md`](12-loan-creation-active-loans.md) — Mark as lent, active loans page; depends on requests (11)
13. [`13-return-flow.md`](13-return-flow.md) — Borrower marks returned, owner confirms; depends on loans (12)
14. [`14-history-page.md`](14-history-page.md) — Personal borrow/return history; depends on completed loans (13)
15. [`15-firestore-security-rules.md`](15-firestore-security-rules.md) — Security rules and rule tests; requires all data shapes to be finalised
16. [`16-seed-script.md`](16-seed-script.md) — Emulator seed data; depends on all collections being defined
17. [`17-cloud-run-container.md`](17-cloud-run-container.md) — Dockerfile and static server; requires a working build (tasks 1–16)
18. [`18-ci-workflow.md`](18-ci-workflow.md) — GitHub Actions CI for PRs; requires working tests (tasks 1–16)
19. [`19-cd-workflow.md`](19-cd-workflow.md) — GitHub Actions CD to Cloud Run; depends on CI (18) and container (17)
