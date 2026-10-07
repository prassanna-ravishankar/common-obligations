# Developing

    npm ci
    npm run build && npx astro preview --port <free port>
    PLAYWRIGHT_BASE_URL=http://127.0.0.1:<that port> npm test

Always point Playwright at a server you started from this checkout: a preview from another clone can be listening already.

- `npm run check`: formatting, content lint, build, tests.
- `npm run figures`: re-render figure snapshots after a figure changes (`npm run figures:check` in CI).
- `npm run og`: re-render social cards after a figure or title changes; bump the `-v1` suffix.
- `node scripts/smoke.mjs <origin>`: HTTP and header checks against the nginx container (`docker build -t co . && docker run -p 8080:80 co`).

Figures: see DESIGN.md. Content: see docs/CONTENT.md. Pushing `main` deploys to production.
