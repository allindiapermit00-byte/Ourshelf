---
title: Cloud Run-ready web container
progress: pending
---

# Cloud Run-ready web container

Package the built React app in a minimal Node.js container that serves static files and exposes `/healthz` and `/version` endpoints. The container should be small, start fast, and be ready for Cloud Run deployment.

## Scope

- `server.mjs` — minimal Express (or native Node `http`) static file server: serves `dist/` and adds `/healthz` (returns `{ status: "ok" }`) and `/version` (returns `{ version: "<GIT_SHA>" }`) routes; falls back to `dist/index.html` for client-side routing
- `Dockerfile` — multi-stage: stage 1 builds with Node 20, stage 2 serves with `node:20-slim`; copies only `dist/` and `server.mjs`; runs as non-root user
- `.dockerignore` — excludes `node_modules`, `.env*`, `src/`, `tests/`
- `package.json` — add `"start": "node server.mjs"` script
- Build arg: `GIT_SHA` passed at image build time and embedded in `/version`

## Acceptance criteria

- [ ] `docker build -t ourshelf .` succeeds
- [ ] `docker run -p 8080:8080 ourshelf` serves the app at `localhost:8080`
- [ ] `GET /healthz` returns `200 { status: "ok" }`
- [ ] `GET /version` returns `200 { version: "<sha>" }`
- [ ] Deep-link refresh (e.g. `localhost:8080/groups`) serves `index.html` (client-side routing works)
- [ ] Final image is under 200 MB
- [ ] Container runs as non-root user
- [ ] `pnpm build` exits 0 before the Docker build — the container is only built on top of a passing app build
- [ ] `server.mjs` has no unit tests (it is a minimal static file server); document this with a comment so the absence of tests is intentional, not an oversight
