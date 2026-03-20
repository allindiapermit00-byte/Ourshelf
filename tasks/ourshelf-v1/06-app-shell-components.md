---
title: App shell, navigation, and reusable component library
progress: pending
---

# App shell, navigation, and reusable component library

Build the persistent app shell: top navigation bar, mobile-friendly layout, and the small reusable component set that every feature page will use. This is the visual foundation — get it right before building feature pages on top of it.

## UI simplicity principles

These principles apply to this task and **cascade to every feature task that follows**. All feature page implementations must comply.

- **Maximum 2 interactions** to reach any primary action from the app shell (e.g. requesting a book = land on catalog → click Request — two taps).
- **Plain-English labels**: use "Request to borrow", not "Initiate BorrowRequest". No technical jargon visible to users.
- **Always-visible primary actions**: critical actions (request, lend, return) must be visible on the relevant page without hovering or opening a dropdown to discover them.
- **One primary CTA per view**: at most one filled/prominent button per page. Secondary actions use ghost or outline style.
- **Visible interactive states**: every button, link, and input must have a clear hover highlight and focus ring. Disabled elements must be visually distinct.
- **Readable text**: minimum 14 px body copy; 16 px on mobile. Meet WCAG AA contrast ratio (4.5:1 for normal text).
- **Generous whitespace**: cards and list rows must not feel cramped. Use consistent padding and spacing tokens from Tailwind.
- **Mandatory UI states**: every route that loads async data must implement all three states — loading (spinner), empty (friendly message + optional CTA), and error (message + retry). No route may render a blank screen.

## Scope

- `src/app/AppShell.tsx` — layout wrapper with nav bar and main content area
- `src/components/ui/Button.tsx` — primary, secondary, ghost, destructive variants
- `src/components/ui/Badge.tsx` — for item/request/loan status labels with colour-coded variants per enum value
- `src/components/ui/Card.tsx` — clean card container
- `src/components/ui/Spinner.tsx` — loading indicator
- `src/components/ui/EmptyState.tsx` — empty state with icon, heading, and optional CTA
- `src/components/ui/ErrorState.tsx` — error state with message and retry option
- `src/components/ui/Modal.tsx` — accessible dialog wrapper using a focus trap
- `src/components/ui/index.ts` — re-exports
- Vitest + React Testing Library snapshot/render tests for each component
- Storybook is optional; do not add it unless requested

## Acceptance criteria

- [ ] App shell renders correctly on mobile (375 px) and desktop (1280 px) — verified via Chrome DevTools device toolbar
- [ ] Active nav link is visually highlighted
- [ ] All UI components render in each variant without TypeScript or console errors
- [ ] `EmptyState` and `ErrorState` accept descriptive props and render correctly
- [ ] `Modal` traps focus and closes on Escape key
- [ ] Navigation reaches any primary route in at most 2 taps from the home screen
- [ ] No route renders a blank screen — all async states (loading, empty, error) are implemented
- [ ] Component tests pass: `pnpm test`
- [ ] Tests for every component introduced in this task are written here — none are deferred
- [ ] `pnpm build` exits 0 with no TypeScript errors — the app is fully buildable after this task

## Chrome DevTools loop

This task is **not complete** until the loop below passes in full. The agent runs this autonomously.

1. Run `pnpm dev`; open `http://localhost:5173` in Chrome.
2. Connect to the tab via the Chrome DevTools MCP server.
3. Use the Device Toolbar to simulate iPhone 12 (390 × 844) — verify nav bar and layout are usable.
4. Switch to desktop (1280 × 800) — verify layout expands correctly with no overflow.
5. Tab through the nav links using the keyboard — confirm every link has a visible focus ring.
6. Click each nav link and confirm the active link is visually highlighted.
7. Capture full-page screenshot at desktop width → `qa-artifacts/T06/after.png`.
8. Capture Console output (zero uncaught errors) → `qa-artifacts/T06/console.txt`.
9. If any step fails: fix the code, re-run from step 1, replace artifacts.
