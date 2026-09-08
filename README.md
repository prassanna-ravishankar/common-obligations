# Common Obligations

An interactive visual essay on AI power and accountability. By Prassanna Ravishankar.

## Develop

Use Node 24 (`.nvmrc`) and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:4321. `npm run build` produces static files in `dist/`; `npm run preview` serves that output. Production runs nginx with no Node server.

## Structure

- `src/pages/index.astro`: chapter composition.
- `src/layouts/PageLayout.astro`: metadata, fonts, shell and script entry.
- `src/components/chapters/`: independently editable narrative chapters.
- `src/components/Essay.astro`: the complete long-form essay.
- `src/data/`: comparison scenarios shared by initial HTML and browser interactions.
- `src/scripts/`: chapter interactions, navigation, motion and transitions.
- `src/styles/`: tokens, chapter styles, responsive rules and motion.
- `public/assets/`: conceptual illustrations.
- `tests/`: Playwright desktop/mobile browser journeys.
- `deploy/`, `Dockerfile`, `charts/common-obligations/`: production server and deployment.
- `.github/workflows/site.yml`: CI and deployment.

Keep comparisons conditional and authored, not forecasts or simulated estimates. Preserve attribution and distinguish allegations from findings. Images are conceptual illustrations. See [project context](docs/CONTEXT.md) and [artwork provenance](docs/ARTWORK.md).

Default comparisons now render from the same data used by interactions, removing duplicate copy edits. Instrument Serif and DM Sans load from Google Fonts with system fallbacks.

## Validate

```sh
npx playwright install chromium
npm run check
```

This checks formatting, builds and runs eight desktop/mobile browser journeys. `npm run format` formats source files.

To test the production container:

```sh
npm run build
docker build --platform linux/amd64 -t common-obligations:local .
docker run --rm --name common-obligations-local -p 8080:80 common-obligations:local
```

In another terminal:

```sh
node scripts/smoke.mjs http://localhost:8080
PLAYWRIGHT_BASE_URL=http://localhost:8080 npm test
```

CI tests nginx's Content Security Policy, assets, cache headers and 404 behavior as well as browser interactions. HTML revalidates, hashed assets are immutable, and unversioned illustrations cache for a day.

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

## Validation scope

The refactor passed the static build, Helm lint, Linux amd64 container build, HTTP smoke checks, eight browser journeys against nginx, and desktop/mobile screenshot inspection. Print rendering and a full accessibility audit remain separate work.
