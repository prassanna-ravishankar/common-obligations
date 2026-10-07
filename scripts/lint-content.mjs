#!/usr/bin/env node
// Consistency checks that do not need a browser. Exits 1 with a list of problems.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const problems = [];
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const rel = (p) => relative(root, p);

// 1. The vendored kernel is unchanged: its header names the hash of the rest of the file.
const kernel = readFileSync(join(root, "hairline/kit/kernel.js"), "utf8");
const [head, ...rest] = kernel.split("\n");
const want = /sha256:([0-9a-f]{64})/.exec(head)?.[1];
const got = createHash("sha256").update(rest.join("\n")).digest("hex");
if (
  !want ||
  (want !== got &&
    want !==
      createHash("sha256").update(rest.join("\n").trimEnd()).digest("hex"))
)
  problems.push(
    "hairline/kit/kernel.js does not match the sha256 in its header",
  );

// 2. No em or en dashes in anything a reader sees.
const reader = [
  ...walk(join(root, "src/content")),
  ...walk(join(root, "src")).filter((p) => p.endsWith(".astro")),
];
for (const p of new Set(reader)) {
  readFileSync(p, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (/[–—]/.test(line))
        problems.push(`${rel(p)}:${i + 1} has an em or en dash`);
    });
}

// 3. Colours and fonts come from tokens: no raw values in components, pages or styles.
const allowed = ["src/styles/tokens.css", "src/styles/hairline.css"];
for (const p of walk(join(root, "src")).filter(
  (p) => /\.(astro|css)$/.test(p) && !allowed.includes(rel(p)),
)) {
  const text = readFileSync(p, "utf8");
  const css = p.endsWith(".css")
    ? text
    : [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
        .map((m) => m[1])
        .join("\n");
  if (/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/.test(css))
    problems.push(`${rel(p)} sets a raw colour; use a token`);
  if (/font-family:(?!\s*var\()/.test(css))
    problems.push(
      `${rel(p)} sets a font family; use --font-sans or --font-mono`,
    );
}

// 4. Every source the site has ever cited is still in the registry.
const registry = readFileSync(join(root, "src/content/sources.yaml"), "utf8");
for (const url of JSON.parse(
  readFileSync(join(root, "tests/original-sources.json"), "utf8"),
))
  if (!registry.includes(`url: ${url}`) && url !== "https://prassanna.io")
    problems.push(`source missing from registry: ${url}`);

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("content lint: ok");
