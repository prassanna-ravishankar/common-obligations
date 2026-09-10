import { test, expect } from "@playwright/test";
import { stages } from "../src/data/surveillance.js";
import { releases } from "../src/data/release.js";
import { pacts } from "../src/data/coordination.js";
import {
  defenseOptions,
  discoveryOptions,
  scenarios,
} from "../src/data/scenarios.js";
import { incidentDecisions } from "../src/data/incident.js";
import sources from "./original-sources.json" with { type: "json" };
const route = "/";
async function progress(page, track, p) {
  await track.evaluate(
    (e, p) =>
      scrollTo(
        0,
        e.getBoundingClientRect().top +
          scrollY -
          64 +
          (e.offsetHeight - (innerHeight - 64)) * p,
      ),
    p,
  );
  await expect
    .poll(() =>
      track.evaluate((e) =>
        Number(e.style.getPropertyValue("--scene-progress")),
      ),
    )
    .toBeCloseTo(p, 2);
}
test("fresh edition preserves every argument, source and essay without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const c = await browser.newContext({ javaScriptEnabled: false });
  const page = await c.newPage();
  await page.goto(baseURL + route);
  for (const [id, options] of [
    ["surveillance", stages.flatMap((s) => s.conditions)],
    ["release", releases],
    ["defense", defenseOptions],
    ["discovery", discoveryOptions],
    ["incident", incidentDecisions.flatMap((s) => s.options)],
    ["race", pacts],
  ])
    for (const o of options)
      for (const [k, v] of Object.entries(o))
        if (typeof v === "string" && !["name", "label", "symbol"].includes(k))
          await expect(page.locator("#" + id)).toContainText(v);
  const hrefs = await page
    .locator("a[href]")
    .evaluateAll((es) => es.map((e) => e.href));
  for (const source of sources) expect(hrefs).toContain(new URL(source).href);
  await expect(page.locator(".settled-reading")).toHaveCount(10);
  await expect(page.locator("[data-staged]")).toHaveCount(0);
  await page.locator(".full-essay summary").click();
  expect(
    (await page.locator("#essay-content").innerText()).length,
  ).toBeGreaterThan(10000);
  await c.close();
});
test("all staged perspectives have reading holds, reverse and lead to complete unbounded comparisons", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1100 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(route);
  await expect(page.locator("[data-staged]")).toHaveCount(10);
  for (const id of [
    "surveillance-0",
    "release-approach",
    "defense-access",
    "discovery-publication",
    "incident-contain",
    "coordination-agreement",
  ]) {
    const track = page.locator(`[data-reading-sequence="${id}"]`);
    const n = Number(await track.getAttribute("data-count"));
    for (const i of [...Array(n).keys(), 0]) {
      await progress(page, track, (i + 0.4) / n);
      await expect(track).toHaveAttribute("data-focused", String(i));
      await expect(track.locator('[data-focus="' + i + '"]')).toHaveCSS(
        "opacity",
        "1",
      );
    }
    await track.locator(".reading-bypass").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#" + id + "-all")).toBeFocused();
    await expect(
      page.locator("#" + id + "-all .settled-columns>section"),
    ).toHaveCount(n);
  }
});
test("scene-specific geometry changes without moving imagery and its embedded thread independently", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1100 });
  await page.goto(route);
  await expect(page.locator("[data-staged]")).toHaveCount(10);
  const measured = [];
  for (const [id, selector] of [
    ["surveillance-0", ".scene-image-plane"],
    ["release-approach", ".scene-image-plane"],
    ["defense-access", ".scene-image-plane"],
    ["discovery-publication", ".scene-cover-plane"],
    ["incident-contain", ".incident-after:not(.incident-gap)"],
    ["coordination-agreement", ".scene-art--race"],
  ]) {
    const track = page.locator(`[data-reading-sequence="${id}"]`);
    const values = [];
    for (const p of [0.1, 0.9]) {
      await progress(page, track, p);
      values.push(
        await track.locator(selector).evaluate((e) => ({
          transform: getComputedStyle(e).transform,
          opacity: getComputedStyle(e).opacity,
          clip: getComputedStyle(e).clipPath,
          mask: getComputedStyle(e).maskImage,
        })),
      );
    }
    expect(values[0]).not.toEqual(values[1]);
    measured.push(JSON.stringify(values));
  }
  expect(new Set(measured).size).toBe(6);
  const discovery = page.locator(
    '[data-reading-sequence="discovery-publication"]',
  );
  await expect(discovery.locator("svg image")).toHaveCount(2);
  const incident = page.locator('[data-reading-sequence="incident-contain"]');
  expect(
    await incident
      .locator(".incident-after")
      .evaluateAll(
        (es) => new Set(es.map((e) => getComputedStyle(e).transform)).size,
      ),
  ).toBe(1);
});
test("fresh mobile, reduced motion, pause, origin changes and chapter navigation retain complete reading", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1100 });
  await page.goto(route);
  await expect(page.locator("[data-staged]")).toHaveCount(10);
  await page.locator("[data-motion-toggle]").click();
  await expect(page.locator("[data-staged]")).toHaveCount(0);
  await page.locator("[data-motion-toggle]").click();
  await expect(page.locator("[data-staged]")).toHaveCount(10);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-staged]")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 700 });
  await expect(page.locator("[data-staged]")).toHaveCount(0);
  await expect(page.locator(".settled-reading")).toHaveCount(10);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("[data-staged]")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.locator(".incident-origin label").last().click();
  await expect(page.locator("#incident .origin-agent:visible")).toHaveCount(0);
  await expect(page.locator("#incident-contain-all")).toContainText(
    "artefact hashes",
  );
  await page.locator(".incident-origin label").first().click();
  await expect(page.locator("#incident .origin-supply:visible")).toHaveCount(0);
  await page.locator(".chapter-chooser summary").click();
  await page.locator('.chapter-chooser a[href="#discovery"]').click();
  await expect(page.locator(".chapter-chooser")).not.toHaveAttribute("open");
  expect(
    await page
      .locator("section.chapter")
      .evaluateAll((es) => es.map((e) => e.id)),
  ).toEqual(scenarios.map((s) => s.id));
  const nested = await page
    .locator(".chapter-body *")
    .evaluateAll(
      (es) =>
        es.filter(
          (e) =>
            ["scroll", "auto"].includes(getComputedStyle(e).overflowY) &&
            e.scrollHeight > e.clientHeight + 2,
        ).length,
    );
  expect(nested).toBe(0);
});
test("fresh assets, anchors and social metadata resolve", async ({
  page,
  request,
}) => {
  await page.goto(route);
  const missing = await page
    .locator('a[href^="#"]')
    .evaluateAll((es) =>
      es
        .map((e) => e.hash)
        .filter((h) => h && h !== "#" && !document.getElementById(h.slice(1))),
    );
  expect(missing).toEqual([]);
  const assets = await page
    .locator("svg image")
    .evaluateAll((es) => [...new Set(es.map((e) => e.getAttribute("href")))]);
  for (const asset of assets)
    expect((await request.get(asset)).status()).toBe(200);
  const image = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect((await request.get(new URL(image).pathname)).status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://commonobligations.org/",
  );
  const dimensions = await page.evaluate(async (path) => {
    const asset = new Image();
    asset.src = path;
    await asset.decode();
    return [asset.naturalWidth, asset.naturalHeight];
  }, new URL(image).pathname);
  expect(dimensions).toEqual([1200, 630]);
});
