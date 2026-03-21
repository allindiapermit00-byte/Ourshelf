---
title: Repository bootstrap
progress: done
---

# Repository bootstrap

Scaffold the full project using Vite + React + TypeScript. Install and configure Tailwind CSS, ESLint, Prettier, and path aliases. Establish the folder structure described in the architecture plan so every subsequent task has a stable home.

## Scope

- `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`
- `tailwind.config.ts`, `postcss.config.js`
- `.eslintrc.cjs`, `.prettierrc`
- `src/app/`, `src/features/`, `src/components/`, `src/lib/` skeleton folders with placeholder `index.ts` files
- `src/app/main.tsx` and `src/app/App.tsx` shell
- `public/` with a favicon placeholder
- `.gitignore` and root `README.md`

## Acceptance criteria

- [ ] `pnpm dev` (or `npm run dev`) starts the Vite dev server without errors
- [ ] Tailwind utility classes render correctly on a test div in `App.tsx`
- [ ] ESLint and Prettier run clean with `pnpm lint` and `pnpm format --check`
- [ ] TypeScript strict mode is enabled; `pnpm typecheck` exits 0
- [ ] Folder structure matches the layout in the architecture plan exactly
- [ ] No `any` types or lint warnings in the generated scaffold
- [ ] `pnpm build` exits 0 with no TypeScript errors — the app is fully buildable after this task
- [ ] This task introduces no testable service logic; document this explicitly with a comment in `App.tsx` (`// No unit tests in task 01 — scaffold only`) so the absence of tests is intentional, not an oversight
