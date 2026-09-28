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
