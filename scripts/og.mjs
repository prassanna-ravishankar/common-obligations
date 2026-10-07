#!/usr/bin/env node
// Renders 1200x630 social cards from the figures' rest-pose snapshots and Geist,
// the fallback (and reference) for cards drawn elsewhere.
// `node scripts/og.mjs <outdir>` writes <slug>.png for home and each obligation.
import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import yaml from "js-yaml";

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const out = process.argv[2] ?? root("public/og");
mkdirSync(out, { recursive: true });
const font = (f) =>
  `url(data:font/woff2;base64,${readFileSync(root(`public/fonts/${f}`)).toString("base64")})`;
const css = readFileSync(root("src/styles/next/hairline.css"), "utf8");
const snap = (name) => {
  try {
    return readFileSync(
      root(`src/hairline/snapshots/${name}.svg`),
      "utf8",
    ).replace(/^<!--.*?-->\n/, "");
  } catch {
    return "";
  }
};
const front = (f) =>
  yaml.load(readFileSync(root(`src/content/${f}`), "utf8").split(/^---$/m)[1]);
const home = front("pages/home.md");
const cards = [
  {
    slug: "home",
    figure: home.figure.name,
    kicker: "Six obligations",
    title: home.claim,
    line: "",
  },
  ...readdirSync(root("src/content/obligations")).map((f) => {
    const o = front(`obligations/${f}`);
    return {
      slug: o.slug,
      figure: o.figure,
      kicker: `Obligation ${String(o.number).padStart(2, "0")} of 06`,
      title: o.title,
      line: o.short,
    };
  }),
];
const page = (c) => `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:G;src:${font("geist-v1.woff2")}}@font-face{font-family:M;src:${font("geist-mono-v1.woff2")}}
${css}
:root{--hairline-hi:#9f3e26}
body{margin:0;width:1200px;height:630px;background:#fff;color:#232327;font-family:G;display:grid;grid-template-columns:560px 600px;align-items:center;gap:20px;padding:0 0 0 64px;box-sizing:border-box}
.k{font:500 22px M;color:#9f3e26}.t{font-weight:500;font-size:${c.title.length > 60 ? 50 : 62}px;line-height:1.06;letter-spacing:-.03em;margin:22px 0 0}
.l{font-size:24px;line-height:1.4;color:#5f5f66;margin-top:22px}.u{position:absolute;left:64px;bottom:44px;font:20px M;color:#5f5f66}
[data-hairline]{width:600px}</style>
<div><div class="k">${c.kicker}</div><h1 class="t">${c.title}</h1>${c.line ? `<p class="l">${c.line}</p>` : ""}</div>
<div data-hairline>${snap(c.figure)}</div><div class="u">commonobligations.org</div>`;
const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const c of cards) {
  await tab.setContent(page(c));
  await tab.screenshot({ path: `${out}/${c.slug}-v1.png` });
}
await browser.close();
console.log(`wrote ${cards.length} cards to ${out}`);
