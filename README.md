# Common Obligations

An independent proposal by Prassanna Ravishankar: the freedom to build powerful AI should come with obligations to the people it affects. Six obligations, each with its own page, an illustrative case that tests it, the dated record of events that bear on it, and a line drawing you can handle.

Live at https://commonobligations.org.

## Develop

Use Node 24 (`.nvmrc`) and npm:

```sh
npm ci
npm run dev
```

`npm run build` produces static files in `dist/`; production serves them with nginx, no Node server. See [docs/DEVELOPING.md](docs/DEVELOPING.md) for tests and checks, [docs/CONTENT.md](docs/CONTENT.md) for editing content, [PRODUCT.md](PRODUCT.md) for purpose and editorial rules, and [DESIGN.md](DESIGN.md) for the design system, figures and motion.

## Structure

- `src/content/`: all copy (obligations, cases, events, sources, pages), validated by `src/content.config.ts`.
- `src/pages/`: home, the six obligation pages, the record, the essay, 404, sitemap and robots.
- `src/layouts/Base.astro`: the only layout.
- `src/components/`: the shared components every page is built from.
- `src/styles/`: tokens, base styles, the figures' generated CSS, view transitions.
- `hairline/kit/`: the vendored Hairline engine and its check tools (MIT); `hairline/figures/`: the seven figures.
- `src/hairline/`: figure hydration and the build-time rest-pose snapshots.
- `scripts/`: snapshots, social cards, content lint, smoke checks.
- `tests/`: Playwright, desktop and mobile, run against the nginx container in CI.
- `deploy/`, `Dockerfile`, `charts/common-obligations/`: production server and deployment. `.github/workflows/site.yml`: CI and deployment.

## Deploy

Pushes to `main` and manual Site workflow runs on `main` deploy after validation. Pull requests run checks without publishing.

CI builds a Linux amd64 container from the static output, tests it, and pushes that exact image tagged with the full commit SHA. Clusterkit's pinned `deploy-app/v2` workflow performs Helm rollout and load-balancer verification; public HTTP and www redirect checks follow.

| Setting                       | Value                                                             |
| ----------------------------- | ----------------------------------------------------------------- |
| Domain                        | `commonobligations.org`                                           |
| Namespace / release / service | `common-obligations`                                              |
| Image                         | `us-docker.pkg.dev/baldmaninc/gcr.io/common-obligations`          |
| Cluster                       | `clusterkit`, `us-central1`, project `baldmaninc`                 |
| Gateway / HTTPRoute namespace | `clusterkit`                                                      |
| Service account               | `gh-deploy-common-obligations@baldmaninc.iam.gserviceaccount.com` |

Repository secrets `GCP_WIF_PROVIDER` and `GCP_WIF_SERVICE_ACCOUNT` select Workload Identity Federation. No service-account keys are stored here.

Clusterkit owns the namespace, ReferenceGrant, deployment identity, Origin CA certificate, Cloudflare settings, and www DNS record. Its Terraform registration must be applied before the first deployment. This app owns the Deployment, Service, apex HTTPRoute and www → apex 301 redirect HTTPRoute. Only the apex belongs in the GCLB gate because the redirect route has no backend.

Two small Spot replicas run nginx. With an authenticated cluster context, inspect `helm history common-obligations -n common-obligations`, then roll back using `helm rollback common-obligations <revision> -n common-obligations --wait`. Verify using `node scripts/smoke.mjs https://commonobligations.org --www`.
