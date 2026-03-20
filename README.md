# OurShelf

A lightweight private sharing tracker for families and friend groups to lend books and board games.

## Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Auth**: Firebase Authentication (Google sign-in)
- **Database**: Cloud Firestore
- **Hosting**: Cloud Run (Docker container)

## Getting started

```bash
# Install dependencies
pnpm install

# Start local emulators (Firebase Auth + Firestore)
pnpm emulators

# Start dev server (connects to local emulators)
pnpm dev
```

## Scripts

| Command             | Description                            |
| ------------------- | -------------------------------------- |
| `pnpm dev`          | Start Vite dev server                  |
| `pnpm build`        | TypeScript check + production build    |
| `pnpm typecheck`    | TypeScript type-check only             |
| `pnpm lint`         | ESLint                                 |
| `pnpm format`       | Prettier (write)                       |
| `pnpm format:check` | Prettier (check only)                  |
| `pnpm test`         | Vitest (single run)                    |
| `pnpm test:watch`   | Vitest (watch mode)                    |
| `pnpm emulators`    | Firebase Emulator Suite                |
| `pnpm seed`         | Seed Firestore emulator with demo data |

## Folder structure

```
src/
  app/            # App shell, router, providers
  features/
    auth/         # Sign-in, auth context, protected routes
    groups/       # Create group, join group, group switcher
    items/        # Catalog, add/edit/archive items
    requests/     # Borrow request flow
    loans/        # Loan creation, active loans, return flow
    history/      # Personal borrowing history
  components/     # Shared reusable UI components
  lib/
    firebase/     # Firebase SDK instances
    repositories/ # Firestore data access layer
    validators/   # Input validation schemas
    types/        # TypeScript interfaces and enums
    test-utils/   # Test helpers and setup
  styles/
    globals.css   # Tailwind base styles
```

## Task progress

Implementation follows the task plan in [`tasks/ourshelf-v1/`](tasks/ourshelf-v1/index.md).
