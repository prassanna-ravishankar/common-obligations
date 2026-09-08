import { test, expect } from "@playwright/test";
import { stages } from "../src/data/surveillance.js";
import { releases } from "../src/data/release.js";
import { pacts } from "../src/data/coordination.js";

test("all comparisons update their outcomes and accessible selection", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  for (const [stage, scene] of stages.entries()) {
    await page.locator('[data-stage="' + stage + '"]').click();
    await expect(page.locator("#decision-question")).toHaveText(scene.question);
    for (const [choice, condition] of scene.conditions.entries()) {
      await page.locator('[data-choice="' + choice + '"]').click();
      await expect(page.locator("#result-title")).toHaveText(condition.title);
      await expect(page.locator("#result-cost")).toHaveText(condition.cost);
      await expect(
        page.locator('[data-choice="' + choice + '"]'),
      ).toHaveAttribute("aria-pressed", "true");
    }
    await page.locator("#compare").click();
    await expect(page.locator("#comparison")).toBeVisible();
    for (const condition of scene.conditions)
      await expect(page.locator("#comparison")).toContainText(condition.title);
    await page.locator("#compare").click();
    await expect(page.locator("#comparison")).toBeHidden();
  }
  for (const [index, release] of releases.entries()) {
    await page.locator('[data-release="' + index + '"]').click();
    await expect(page.locator("#release-title")).toHaveText(release.title);
    await expect(page.locator("#release-against")).toHaveText(release.against);
  }
  for (const [index, pact] of pacts.entries()) {
    await page.locator('[data-pact="' + index + '"]').click();
    await expect(page.locator("#pact-title")).toHaveText(pact.title);
    await expect(page.locator("#pact-limit")).toHaveText(pact.limit);
  }
  expect(errors).toEqual([]);
});

test("reading links, assets, anchors and narrow layouts work", async ({
  page,
}) => {
  await page.goto("/#obligation-6");
  await expect(page.locator("#obligation-6")).toHaveAttribute("open", "");
  await page.goto("/#reading");
  await expect(page.locator(".full-essay")).toHaveAttribute("open", "");
  await expect(page.locator("#essay-content")).toContainText(
    /the freedom to build/i,
  );
  const integrity = await page.evaluate(() => {
    const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
    return {
      duplicates: ids.filter((id, index) => ids.indexOf(id) !== index),
      brokenAnchors: [...document.querySelectorAll('a[href^="#"]')]
        .map((a) => a.hash)
        .filter(
          (hash) => hash.length > 1 && !document.getElementById(hash.slice(1)),
        ),
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
    };
  });
  expect(integrity).toEqual({
    duplicates: [],
    brokenAnchors: [],
    overflow: false,
  });
  for (const image of await page.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty("complete", true);
    expect(await image.evaluate((el) => el.naturalWidth)).toBeGreaterThan(0);
  }
});

test("keyboard and motion control remain usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("body")).toHaveClass(/reduce-motion/);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to essay" })).toBeFocused();
  const motion = page.locator(".motion");
  await expect(motion).toBeVisible();
  await motion.focus();
  await page.keyboard.press("Enter");
  await expect(motion).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("Enter");
  await expect(motion).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("body")).toHaveClass(/reduce-motion/);
});

test("essay and default comparisons are rendered without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.locator("#result-title")).toHaveText(
    stages[0].conditions[0].title,
  );
  await page.locator(".full-essay > summary").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#essay-content")).toBeVisible();
  await expect(page.locator("#essay-content")).toContainText(
    "Who keeps the rule-makers accountable?",
  );
  await context.close();
});
