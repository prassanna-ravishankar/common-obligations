import { test, expect } from "@playwright/test";
import { cases, events, home, obligations, sourceById } from "./content.js";

const pages = ["/", ...obligations.map((o) => `/obligations/${o.slug}/`)];
const original = (
  await import("./original-sources.json", { with: { type: "json" } })
).default;
// Essay-only sources return with the essay page (phase 2 of the redesign).
const essayOnly = [
  "https://openai.com/index/an-alien-mind/",
  "https://opensource.org/ai/open-source-ai-definition",
  "https://www.nist.gov/itl/ai-risk-management-framework",
  "https://www.oecd.org/en/topics/sub-issues/ai-principles.html",
];

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("every obligation page carries its whole argument, case and record", async ({
    page,
  }) => {
    for (const o of obligations) {
      await page.goto(`/obligations/${o.slug}/`);
      const main = page.locator("main");
      await expect(page.locator("h1")).toHaveText(o.title);
      for (const text of [
        o.short,
        o.prevents,
        ...o.evidence,
        ...o.failure,
        ...o.objections.flatMap((x) => [x.claim, x.answer]),
      ])
        await expect(main).toContainText(text);
      const c = cases[o.case];
      for (const d of c.decisions) {
        await expect(main).toContainText(d.prompt);
        for (const opt of d.options)
          for (const k of ["name", "summary", "tradeoff", "benefit", "cost"])
            await expect(main).toContainText(opt[k]);
      }
      for (const a of c.accounts) await expect(main).toContainText(a.title);
      for (const e of events.filter((e) => e.obligations.includes(o.number)))
        await expect(main).toContainText(e.limit);
      // The drawing is there before any script runs.
      if (["paddock", "switchyard"].includes(o.figure))
        expect(
          await page.locator("[data-hairline] svg path").count(),
        ).toBeGreaterThan(20);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });

  test("home states the claim, its scope, the six and the ask", async ({
    page,
  }) => {
    await page.goto("/");
    const main = page.locator("main");
    await expect(page.locator("h1")).toHaveText(home.claim);
    for (const text of [
      home.scope,
      ...obligations.map((o) => o.short),
      ...home.objections.items.map((x) => x.answer),
      ...home.ask.groups.flatMap((g) => g.items),
    ])
      await expect(main).toContainText(text);
    await expect(page.locator("#obligations li")).toHaveCount(6);
  });
});

test("date honesty: when it happened and when it was reported stay apart", async ({
  page,
}) => {
  for (const path of pages) {
    await page.goto(path);
    for (const e of events) {
      const entry = page.locator(`article.event#${e.id}`);
      if (!(await entry.count())) continue;
      await expect(entry.locator(`time[datetime="${e.date}"]`)).toBeVisible();
      await expect(entry).toContainText(e.dateKind);
      await expect(entry).toContainText(e.limit);
      if (e.occurredOn) {
        await expect(
          entry.locator(`time[datetime="${e.occurredOn}"]`),
        ).toBeVisible();
        await expect(entry).toContainText(e.occurredLabel);
      }
    }
  }
});

test("figures answer the pointer with an item from the argument", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "hover; touch is checked separately");
  await page.goto("/obligations/autonomy/");
  const host = page.locator("[data-hairline=paddock]");
  await expect(host).toHaveAttribute("data-hydrated", "");
  const read = page.locator(".head [data-readout]");
  const o = obligations.find((x) => x.slug === "autonomy");
  await expect(read).toHaveText(o.parts.rest);
  const box = await host.boundingBox();
  await page.mouse.move(box.x + box.width * 0.95, box.y + box.height * 0.5);
  await expect.poll(() => read.textContent()).not.toBe(o.parts.rest);
  expect(o.parts.items).toContain(await read.textContent());
  expect(await host.locator("path.hi").count()).toBeGreaterThan(0);
  await page.mouse.move(0, 0);
  await expect(read).toHaveText(o.parts.rest);
});

test("a tap chooses on touch, and the page still scrolls", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "touch only");
  await page.goto("/");
  const host = page.locator("[data-hairline=switchyard]");
  await expect(host).toHaveAttribute("data-hydrated", "");
  // On a phone the figure sits below the claim: a tap must land on screen.
  await host.scrollIntoViewIfNeeded();
  const box = await host.boundingBox();
  await page.touchscreen.tap(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await expect
    .poll(() => page.locator(".hero [data-readout]").textContent())
    .not.toBe("six obligations");
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
});

test("the home figure and its obligation page share a transition name", async ({
  page,
}) => {
  await page.goto("/");
  const name = await page
    .locator("#obligations [data-hairline=paddock]")
    .evaluate((e) => getComputedStyle(e).viewTransitionName);
  expect(name).toBe("fig-paddock");
  await page.goto("/obligations/autonomy/");
  expect(
    await page
      .locator("[data-hairline=paddock]")
      .evaluate((e) => getComputedStyle(e).viewTransitionName),
  ).toBe(name);
  const names = await page.evaluate(() =>
    [...document.querySelectorAll("*")]
      .map((e) => getComputedStyle(e).viewTransitionName)
      .filter((n) => n !== "none"),
  );
  expect(new Set(names).size).toBe(names.length);
});

test("pages are CSP-safe, themed and described", async ({ page, browser }) => {
  for (const path of pages) {
    await page.goto(path);
    expect(await page.locator("script:not([src])").count()).toBe(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://commonobligations.org${path}`,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    expect(
      await page.locator('meta[property="og:image"]').getAttribute("content"),
    ).toMatch(/^https:\/\/commonobligations\.org\//);
    expect(await page.title()).not.toMatch(/[–—]/);
  }
  const dark = await (
    await browser.newContext({ colorScheme: "dark" })
  ).newPage();
  await dark.goto("/obligations/autonomy/");
  const [bg, plate] = await dark.evaluate(() => [
    getComputedStyle(document.body).backgroundColor,
    getComputedStyle(document.querySelector("[data-hairline] svg path")).fill,
  ]);
  expect(bg).toBe("rgb(8, 9, 10)");
  expect(plate).toBe(bg);
});

test("every original source is still linked somewhere on the site", async ({
  page,
}) => {
  const hrefs = new Set();
  for (const path of pages) {
    await page.goto(path);
    for (const h of await page
      .locator("a[href^='http']")
      .evaluateAll((as) => as.map((a) => a.href)))
      hrefs.add(h);
  }
  const expected = original.filter((u) => !essayOnly.includes(u));
  for (const url of expected) expect(hrefs, url).toContain(new URL(url).href);
  for (const id of Object.keys(sourceById))
    expect(sourceById[id].url).toMatch(/^https:\/\//);
});

test("figures tour on their own, and the pause control stops them", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "one viewport is enough for the tour");
  await page.goto("/obligations/autonomy/");
  const host = page.locator("[data-hairline=paddock]");
  await expect(host).toHaveAttribute("data-hydrated", "");
  const o = obligations.find((x) => x.slug === "autonomy");
  const read = page.locator(".head [data-readout]");
  // Nobody touches it: within a few steps it names each limit it reaches.
  const seen = new Set();
  await expect
    .poll(async () => (seen.add(await read.textContent()), seen.size), {
      timeout: 12000,
    })
    .toBeGreaterThan(2);
  for (const r of seen) expect([o.parts.rest, ...o.parts.items]).toContain(r);
  const pause = page.locator("[data-pause]");
  await pause.click();
  await expect(pause).toHaveAttribute("aria-pressed", "true");
  await expect(host).toHaveAttribute("data-still", "");
  await page.waitForTimeout(800);
  const held = await read.textContent();
  await page.waitForTimeout(5000);
  expect(await read.textContent()).toBe(held);
  await page.reload();
  await expect(page.locator("[data-pause]")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("reduced motion: no tour, no pause control needed", async ({
  browser,
}) => {
  const page = await (
    await browser.newContext({ reducedMotion: "reduce" })
  ).newPage();
  await page.goto("/obligations/autonomy/");
  await expect(page.locator("[data-hairline=paddock]")).toHaveAttribute(
    "data-hydrated",
    "",
  );
  await expect(page.locator("[data-pause]")).toBeHidden();
  const read = page.locator(".head [data-readout]");
  const first = await read.textContent();
  await page.waitForTimeout(6500);
  expect(await read.textContent()).toBe(first);
});

test("every page's social card exists at 1200x630", async ({
  page,
  request,
}) => {
  for (const path of pages) {
    await page.goto(path);
    const url = new URL(
      await page.locator('meta[property="og:image"]').getAttribute("content"),
    );
    const res = await request.get(url.pathname);
    expect(res.status(), url.pathname).toBe(200);
    const png = await res.body();
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  }
});
