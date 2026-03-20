---
title: Deploy-on-main CD workflow to Cloud Run
progress: pending
---

# Deploy-on-main CD workflow to Cloud Run

Set up a GitHub Actions workflow that automatically builds the Docker image, pushes it to Artifact Registry, deploys it to Cloud Run, and smoke-tests the live URL on every push to `main`.

## Scope

- `.github/workflows/deploy.yml`
- Authenticate to Google Cloud using Workload Identity Federation (no long-lived JSON keys)
- Steps:
  1. Checkout and set up Node + pnpm
  2. `pnpm install --frozen-lockfile`
  3. `pnpm build`
  4. Authenticate with `google-github-actions/auth` using WIF
  5. Configure Docker for Artifact Registry
  6. Build image with `GIT_SHA=${{ github.sha }}`
  7. Push image to Artifact Registry
  8. Deploy to Cloud Run with `google-github-actions/deploy-cloudrun`
  9. Smoke test: `curl -f $SERVICE_URL/healthz` and `curl -f $SERVICE_URL/version`
- Repository secrets/variables required: `GCP_PROJECT_ID`, `GCP_REGION`, `AR_REPO`, `CLOUD_RUN_SERVICE`, `WIF_PROVIDER`, `WIF_SERVICE_ACCOUNT`
- Cloud Run service configured with min-instances: 0, max-instances: 3, memory: 256Mi

## Acceptance criteria

- [ ] Workflow file is valid YAML
- [ ] Pushing to `main` triggers the workflow and produces a successful run
- [ ] Docker image in Artifact Registry tagged with both `latest` and `$GIT_SHA`
- [ ] `/healthz` on the live Cloud Run URL returns `200` after deployment
- [ ] `/version` on the live URL returns the deployed commit SHA
- [ ] Workflow fails fast if the smoke test fails (does not silently pass)
- [ ] No GCP service account JSON key stored in GitHub secrets
