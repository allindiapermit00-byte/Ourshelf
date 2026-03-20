---
title: PR CI workflow (GitHub Actions)
progress: pending
---

# PR CI workflow (GitHub Actions)

Set up a GitHub Actions workflow that runs on every pull request. It must lint, type-check, unit test, and build the app. A failing PR check should block merging.

## Scope

- `.github/workflows/ci.yml`
- Jobs (in order, with caching):
  1. `lint` — `pnpm lint`
  2. `typecheck` — `pnpm typecheck`
  3. `test` — `pnpm test --run` (Vitest, no watch)
  4. `test:rules` — starts Firestore emulator, runs rule tests, stops emulator
  5. `build` — `pnpm build`; uploads `dist/` as a workflow artifact
- Use `pnpm` with the store cached between runs (`actions/cache` on `.pnpm-store`)
- Node version: 20
- Trigger: `pull_request` targeting `main`

## Acceptance criteria

- [ ] Workflow file is valid YAML (`actionlint` or manual verification)
- [ ] All five jobs run successfully on a clean push to a test branch
- [ ] A deliberate lint error in a test branch causes the `lint` job to fail
- [ ] A deliberate type error causes `typecheck` to fail
- [ ] A deliberate failing test causes `test` to fail
- [ ] `dist/` artifact is uploaded and downloadable from the Actions run summary
- [ ] Emulator starts and rule tests pass in `test:rules` inside CI
