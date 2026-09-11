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
- `src/layouts/RenewalLayout.astro`: current metadata, fonts, shell and script entry.
- `src/components/chapters/`: independently editable narrative chapters.
- `src/components/Essay.astro`: the complete long-form essay.
- `src/data/`: authored comparisons rendered server-side for progressive scenic reading.
- `src/components/ChapterFrame.astro`, `ScrollComparison.astro`, `renewal/`: current chapter, scene artwork and comparison grammar.
- `src/scripts/`: optional chapter tracking, navigation and scroll-linked artwork.
- `src/styles/renewal.css`, `renewal-world.css`, `src/scripts/renewal.js`: current visual system and optional scroll enhancement; other visual files are earlier iterations.
- `public/assets/`: conceptual illustrations.
- `tests/`: Playwright desktop/mobile browser journeys.
- `deploy/`, `Dockerfile`, `charts/common-obligations/`: production server and deployment.
- `.github/workflows/site.yml`: CI and deployment.

Keep comparisons conditional and authored, not forecasts or simulated estimates. Preserve attribution and distinguish allegations from findings. Images are conceptual illustrations. See [project context](docs/CONTEXT.md) and [artwork provenance](docs/ARTWORK.md).

Every comparison renders in HTML and works without JavaScript. Instrument Serif and DM Sans are self-hosted under `public/fonts/`, with licences and system fallbacks. The abstract redesign is local and awaits approval before publication; see [redesign brief](docs/REDESIGN.md) and [abstract artwork provenance](docs/ABSTRACT-ASSETS.md).

On wide, tall screens, ten comparison sequences use natural scroll to shift attention between fixed halves or thirds, then resolve all perspectives in the same composition before it unpins. Each argument appears once; there is no repeated comparison section. Six distinct scene treatments alternate rich abstract prints, woven texture, transparent paper and minimal linework, with different movement for each. Text has no background panels. A keyboard-focus-only bypass skips to the complete composition; mobile, short viewports, reduced motion, manual pause and no JavaScript show complete static reading. Current artwork and prompt sidecars are in `public/assets/renewal/`; social sharing uses `social-v1.jpg` (1200 × 630). `/prototype/` and `/composition/` redirect to the main site. `/renewal/` is a noindex copy.

## Validate

```sh
npx playwright install chromium
npm run check
```

This checks formatting, builds and runs ten desktop/mobile browser checks, including every authored option without JavaScript, incident origins, source/anchor preservation, layered scroll behavior, keyboard navigation, narrow-screen overflow and social-image validation. `npm run format` formats source files.

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

## Scenario navigation

`src/data/scenarios.js` drives the six-scenario index and chapter navigation, grouped as who may act, who benefits, and who answers. `PolicyComparison.astro` renders surveillance, release, defensive-access, discovery and coordination options with scroll-guided perspectives and static alternatives. The incident origin selector changes stage context and evidence for illustrative supply-chain compromise. Every comparison works without JavaScript; factual claims retain adjacent sources.
