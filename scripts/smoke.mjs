import assert from "node:assert/strict";

const origin = process.argv[2] || "http://127.0.0.1:8080";
const get = (path) =>
  fetch(new URL(path, origin), {
    redirect: "manual",
    signal: AbortSignal.timeout(15000),
  });
const home = await get("/");
assert.equal(home.status, 200, "homepage status");
assert.match(home.headers.get("content-type"), /text\/html/);
const html = await home.text();
assert.match(html, /Common Obligations/);
assert.match(html, /data-hairline="switchyard"/);
assert.match(
  await (await get("/essay/")).text(),
  /id="economy-essay"/,
  "essay page",
);
assert.match(home.headers.get("cache-control"), /no-cache/);
const paths = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((path) => /^\/(_astro|assets|fonts)\//.test(path));
assert.ok(paths.length >= 4, "compiled CSS, JavaScript and fonts exist");
const obligations = [
  "traceable",
  "evidence",
  "scrutiny",
  "autonomy",
  "failures",
  "recourse",
].map((slug) => `/obligations/${slug}/`);
for (const path of [
  "/",
  "/health",
  "/favicon.svg",
  ...obligations,
  "/record/",
  "/essay/",
  ...new Set(paths),
]) {
  const response = await get(path);
  assert.equal(response.status, 200, path);
  assert.ok(
    response.headers
      .get("content-security-policy")
      ?.includes("script-src 'self'"),
    "CSP: " + path,
  );
  assert.equal(response.headers.get("x-content-type-options"), "nosniff", path);
  assert.equal(response.headers.get("x-frame-options"), "DENY", path);
  if (path.startsWith("/_astro/"))
    assert.match(response.headers.get("cache-control"), /immutable/);
  console.log("OK", path);
}
const missing = await get("/does-not-exist");
assert.equal(missing.status, 404, "unknown pages return 404");
assert.match(await missing.text(), /Not found/, "the site's own 404 page");
for (const old of ["/renewal", "/renewal/", "/prototype/", "/composition"]) {
  const r = await get(old);
  assert.equal(r.status, 301, old);
  assert.equal(
    r.headers.get("location"),
    "/",
    `${old} redirects without host or port`,
  );
}
for (const path of ["/sitemap.xml", "/robots.txt"])
  assert.equal((await get(path)).status, 200, path);
if (process.argv.includes("--www")) {
  const url = new URL("/?source=smoke", origin);
  url.hostname = "www." + url.hostname;
  const response = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(response.status, 301, "www redirects permanently");
  assert.equal(
    response.headers.get("location"),
    new URL("/?source=smoke", origin).href,
  );
  console.log("OK www redirect preserves the query");
}
