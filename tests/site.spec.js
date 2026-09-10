import { test, expect } from "@playwright/test";
import { stages } from "../src/data/surveillance.js";
import { releases } from "../src/data/release.js";
import { pacts } from "../src/data/coordination.js";

test("social metadata points to a usable 1200 × 630 image", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://commonobligations.org/assets/social-card.jpg",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  const response = await page.request.get("/assets/social-card.jpg");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/jpeg");
  expect(
    await page.evaluate(async () => {
      const image = new Image();
      image.src = "/assets/social-card.jpg";
      await image.decode();
      return [image.naturalWidth, image.naturalHeight];
    }),
  ).toEqual([1200, 630]);
});

test("scrolling advances the pinned scene, with a static mobile fallback", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  for (let stage = 0; stage < 3; stage++) {
    await page.locator(`[data-beat="${stage}"]`).evaluate((el) => {
      window.scrollTo({
        top: el.getBoundingClientRect().top + scrollY - 320,
        behavior: "instant",
      });
    });
    await expect(page.locator(".scene")).toHaveAttribute(
      "data-scene",
      String(stage),
    );
    await expect(page.locator(".scene")).toHaveCSS("position", "sticky");
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".scene")).toHaveAttribute("data-scene", "0");
  await expect(page.locator(".scene-network")).toBeHidden();
  await expect(page.locator(".scene")).not.toHaveCSS("position", "sticky");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("body")).toHaveClass(/reduce-motion/);
  for (const beat of await page.locator("[data-beat]").all()) {
    await expect(beat).toBeVisible();
  }
});

test("all comparisons update their outcomes and accessible selection", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  for (const [stage, scene] of stages.entries()) {
    await page.locator('[data-stage="' + stage + '"]').click();
    const beat = page.locator('[data-beat="' + stage + '"]');
    await expect(beat.locator("h3")).toHaveText(scene.question);
    for (const [choice, condition] of scene.conditions.entries()) {
      await page.locator('[data-choice="' + choice + '"]').click();
      const result = beat.locator('[data-condition="' + choice + '"]');
      await expect(result).toBeVisible();
      await expect(result.locator("[data-result-title]")).toHaveText(
        condition.title,
      );
      await expect(result.locator("[data-result-cost]")).toHaveText(
        condition.cost,
      );
      await expect(
        page.locator('[data-choice="' + choice + '"]'),
      ).toHaveAttribute("aria-pressed", "true");
    }
    await page.locator("#compare").click();
    await expect(beat.locator('[data-condition="0"]')).toBeVisible();
    await expect(beat.locator('[data-condition="1"]')).toBeVisible();
    for (const condition of scene.conditions)
      await expect(beat).toContainText(condition.title);
    await page.locator("#compare").click();
    await expect(beat.locator('[data-condition="0"]')).toBeHidden();
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

test("incident comparisons remain independent and usable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL);
  for (const id of ["contain", "investigate", "resume"]) {
    const step = page.locator(`#incident-${id}`);
    await expect(step.locator('[data-option="0"]')).toBeVisible();
    await expect(step.locator('[data-option="1"]')).toBeVisible();
    await step.locator('input[value="0"]').check();
    await expect(step.locator('[data-option="1"]')).toBeHidden();
    await step.locator('input[value="1"]').focus();
    await page.keyboard.press("Space");
    await expect(step.locator('[data-option="0"]')).toBeHidden();
    await expect(step.locator('[data-option="1"]')).toBeVisible();
    await step.locator('input[value="both"]').check();
  }
  await page.locator('#incident-contain input[value="0"]').check();
  await expect(
    page.locator('#incident-investigate [data-option="1"]'),
  ).toBeVisible();
  await expect(
    page.locator('#incident-resume [data-option="1"]'),
  ).toBeVisible();
  await context.close();
});

test("new scenarios and supply-chain variation work without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.locator(".scenario-index-grid > a")).toHaveCount(6);
  for (const [id, count] of [
    ["defense", 3],
    ["discovery", 2],
  ]) {
    const chapter = page.locator(`#${id}`);
    await expect(chapter.locator(".policy-option:visible")).toHaveCount(count);
    for (let i = 0; i < count; i++) {
      await chapter.locator(`input[value="${i}"]`).check();
      await expect(chapter.locator(".policy-option:visible")).toHaveCount(1);
      await expect(
        chapter.locator(`[data-policy-option="${i}"]`),
      ).toBeVisible();
    }
    await chapter.locator('input[value="all"]').focus();
    await page.keyboard.press("Space");
    await expect(chapter.locator(".policy-option:visible")).toHaveCount(count);
  }
  await page.locator('input[name="incident-origin"][value="supply"]').check();
  await expect(
    page.locator("#incident-investigate .incident-step-heading .origin-supply"),
  ).toContainText("distributed package");
  await expect(
    page
      .locator("#incident-resume .incident-option")
      .first()
      .locator(".origin-supply"),
  ).toContainText("rotated exposed credentials");
  await expect(page.locator("#incident .origin-agent:visible")).toHaveCount(0);
  await page.locator('input[name="incident-origin"][value="agent"]').check();
  await expect(page.locator("#incident .origin-supply:visible")).toHaveCount(0);
  await context.close();
});
