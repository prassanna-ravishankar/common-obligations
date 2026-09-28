import { test, expect } from "@playwright/test";
import { timelineEvents } from "../src/data/timeline.js";
import { obligationSummaries } from "../src/data/obligations.js";

async function completeRecord(page) {
  await expect(page.locator(".timeline-event")).toHaveCount(
    timelineEvents.length,
  );
  for (const event of timelineEvents) {
    const row = page.locator(`#timeline-${event.id}`);
    await expect(row).toContainText(event.summary);
    await expect(row).toContainText(event.limit);
    await expect(row).toContainText(event.dateKind);
    await expect(row.locator("time")).toHaveAttribute("datetime", event.date);
    await expect(row.locator(".timeline-source")).toHaveAttribute(
      "href",
      event.source.url,
    );
    for (const number of event.obligations) {
      await expect(row).toContainText(obligationSummaries[number].explanation);
    }
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
}

test("timeline preserves complete evidence, visible date context and page order", async ({
  page,
}) => {
  await page.goto("/");
  await completeRecord(page);
  await expect(page.locator("#timeline-cyber-assessment")).toContainText(
    "January 2026",
  );
  expect(
    await page
      .locator("#timeline")
      .evaluate((el) => [
        el.previousElementSibling.className,
        el.nextElementSibling.id,
        el.nextElementSibling.nextElementSibling.id,
      ]),
  ).toEqual(["fresh-credit", "introduction", "provision"]);
  await page.locator(".timeline-actions a").focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#introduction$/);
  await expect(page.locator("#introduction")).toBeInViewport();
});

test("no-JS timeline carries its obligation explanation and links to an operable disclosure", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await completeRecord(page);
  await expect(page.locator("#timeline")).not.toHaveClass(/timeline-motion/);
  await expect(page.locator("#timeline [data-motion-toggle]")).toBeHidden();
  const link = page.locator(
    '#timeline-authors-allocation a[href="#obligation-6"]',
  );
  await expect(link.locator("../..")).toContainText(
    obligationSummaries[6].explanation,
  );
  await link.click();
  await expect(page).toHaveURL(/#obligation-6$/);
  const summary = page.locator("#obligation-6 > summary");
  await expect(summary).toBeInViewport();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#obligation-6")).toHaveAttribute("open", "");
  await expect(page.locator("#obligation-6 .obligation-body")).toBeVisible();
  await context.close();
});

test("both motion controls synchronize in both directions and restore static art", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const buttons = page.locator("[data-motion-toggle]");
  await expect(buttons).toHaveCount(2);
  await expect(page.locator("#timeline")).toHaveClass(/timeline-motion/);
  for (const index of [0, 1, 1, 0]) {
    const pausing =
      (await buttons.nth(index).getAttribute("aria-pressed")) === "false";
    await buttons.nth(index).focus();
    await page.keyboard.press("Enter");
    for (const button of await buttons.all()) {
      await expect(button).toHaveAttribute("aria-pressed", String(pausing));
      await expect(button).toHaveText(
        pausing ? "Enable motion" : "Pause motion",
      );
    }
    if (pausing) {
      await expect(page.locator("#timeline")).not.toHaveClass(
        /timeline-motion/,
      );
      expect(
        await page
          .locator("#timeline")
          .evaluate((el) => el.style.getPropertyValue("--timeline-progress")),
      ).toBe("");
    } else
      await expect(page.locator("#timeline")).toHaveClass(/timeline-motion/);
  }
});

test("timeline and comparison gates remain distinct; static modes retain all content", async ({
  page,
}) => {
  await page.goto("/");
  for (const [width, height, timeline, reading] of [
    [1000, 900, false, false],
    [1001, 699, false, false],
    [1001, 700, true, false],
    [1049, 850, true, false],
    [1050, 849, true, false],
    [1050, 850, true, true],
    [390, 844, false, false],
  ]) {
    await page.setViewportSize({ width, height });
    await expect
      .poll(() =>
        page
          .locator("#timeline")
          .evaluate((el) => el.classList.contains("timeline-motion")),
      )
      .toBe(timeline);
    await expect
      .poll(() =>
        page
          .locator("body")
          .evaluate((el) => el.classList.contains("reading-motion")),
      )
      .toBe(reading);
    await completeRecord(page);
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#timeline")).not.toHaveClass(/timeline-motion/);
  await completeRecord(page);
  // Manual enable cannot override the OS reduced-motion preference.
  await page.locator("[data-motion-toggle]").first().click();
  await page.locator("[data-motion-toggle]").first().click();
  await expect(page.locator("#timeline")).not.toHaveClass(/timeline-motion/);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("#timeline")).toHaveClass(/timeline-motion/);
  const before = await page
    .locator("#timeline")
    .evaluate((el) => el.style.getPropertyValue("--timeline-progress"));
  await page.locator("#timeline-california").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator("#timeline")
        .evaluate((el) => el.style.getPropertyValue("--timeline-progress")),
    )
    .not.toBe(before);
  expect(
    await page
      .locator(".timeline-event article")
      .first()
      .evaluate((el) => ({
        transform: getComputedStyle(el).transform,
        opacity: getComputedStyle(el).opacity,
      })),
  ).toEqual({ transform: "none", opacity: "1" });
});

test("the axis draws where the reader is looking, in beats", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(page.locator("#timeline")).toHaveClass(/timeline-motion/);
  const axis = page.locator("[data-timeline-axis]");
  const place = (fraction) =>
    axis.evaluate(
      (e, f) =>
        scrollTo(0, e.getBoundingClientRect().top + scrollY - innerHeight * f),
      fraction,
    );
  // Drawn fraction of a wiped layer, read from its computed clip. The line wipes
  // the full width; the arcs wipe only their own span (--arc-from to --arc-to).
  const drawn = (layer) =>
    page.locator(layer).evaluate((e) => {
      const clip = getComputedStyle(e).clipPath;
      if (clip === "none") return 1;
      const edge = 100 - Number(clip.match(/inset\(\S+ ([\d.]+)%/)[1]);
      if (!e.matches(".axis-layer--arcs")) return edge / 100;
      const figure = getComputedStyle(e.closest("[data-timeline-axis]"));
      const from = Number(figure.getPropertyValue("--arc-from"));
      const to = Number(figure.getPropertyValue("--arc-to"));
      return (edge - from) / (to - from);
    });
  const dot = page.locator(".axis-dot").last();

  // Entering the lower quarter: nothing drawn yet, but marks are never absent.
  await place(0.8);
  await expect.poll(() => drawn(".axis-layer--line")).toBeLessThan(0.05);
  await expect.poll(() => drawn(".axis-layer--arcs")).toBeLessThan(0.05);
  expect(
    Number(await dot.evaluate((e) => getComputedStyle(e).opacity)),
  ).toBeGreaterThanOrEqual(0.3);

  // Mid-screen, where the reader is: visibly in progress, not already done.
  await place(0.5);
  await expect
    .poll(() =>
      page
        .locator("#timeline")
        .evaluate((e) =>
          Number(e.style.getPropertyValue("--timeline-progress")),
        ),
    )
    .toBeGreaterThan(0.2);
  const mid = Number(
    await page
      .locator("#timeline")
      .evaluate((e) => e.style.getPropertyValue("--timeline-progress")),
  );
  expect(mid).toBeLessThan(0.8);
  expect(await drawn(".axis-layer--line")).toBeGreaterThan(0.5);
  expect(await drawn(".axis-layer--arcs")).toBeLessThan(0.95);

  // Upper quarter: complete.
  await place(0.2);
  await expect.poll(() => drawn(".axis-layer--line")).toBe(1);
  await expect.poll(() => drawn(".axis-layer--arcs")).toBeGreaterThan(0.99);
  await expect(dot).toHaveCSS("opacity", "1");
});
