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
assert.match(html, /id="essay-content"/);
assert.match(home.headers.get("cache-control"), /no-cache/);
const paths = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((path) => path.startsWith("/_astro/") || path.startsWith("/assets/"));
assert.ok(
  paths.length >= 6,
  "compiled CSS, JavaScript and chapter images exist",
);
for (const path of ["/", "/health", "/favicon.svg", ...new Set(paths)]) {
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
assert.equal(
  (await get("/does-not-exist")).status,
  404,
  "unknown pages return 404",
);
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
