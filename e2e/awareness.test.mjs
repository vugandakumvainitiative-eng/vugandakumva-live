import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.HOMEPAGE_TEST_URL || "http://127.0.0.1:5190/";
const url = new URL("/awareness", base).href;
let browser;
let axe;
before(async () => {
  await mkdir("coverage/browser", { recursive: true });
  axe = await readFile("node_modules/axe-core/axe.min.js", "utf8");
  browser = await chromium.launch({ channel: "chrome" });
});
after(async () => browser?.close());
test("Awareness: mobile font swap does not move the hero illustration", async () => {
  const positions = [];
  for (const blockFonts of [true, false]) {
    const context = await browser.newContext({
      viewport: { width: 412, height: 823 },
    });
    const page = await context.newPage();
    if (blockFonts) await page.route("**/*.woff2", (route) => route.abort());
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    positions.push(
      await page
        .locator(".learn-hero-art")
        .evaluate((el) => el.getBoundingClientRect().top),
    );
    await context.close();
  }
  assert.ok(Math.abs(positions[0] - positions[1]) < 2, positions.join(" / "));
});
async function open(width = 1280, options = {}) {
  const context = await browser.newContext({
    viewport: { width, height: 1000 },
    reducedMotion: "reduce",
    ...options,
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return { page, context };
}

test(
  "Awareness: seven widths, all content, axe and image evidence",
  { timeout: 120000 },
  async () => {
    const results = [];
    for (const width of [320, 375, 390, 768, 1024, 1280, 1536]) {
      const { page, context } = await open(width);
      assert.equal(await page.locator(".learn-form").count(), 4);
      assert.equal(await page.locator(".learn-sign-grid li").count(), 6);
      assert.equal(
        await page.locator(".learn-prevention-grid article").count(),
        3,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
      );
      for (const image of await page.locator("img").all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate((el) => el.decode());
      }
      await page.addScriptTag({ content: axe });
      const violations = await page.evaluate(
        async () =>
          (
            await window.axe.run(document, {
              runOnly: {
                type: "tag",
                values: ["wcag2a", "wcag2aa", "wcag21aa"],
              },
            })
          ).violations,
      );
      assert.deepEqual(
        violations.map((v) => v.id),
        [],
      );
      for (const size of await page
        .locator(".emergency-bar a, .quick-exit")
        .evaluateAll((els) =>
          els.map((el) => ({ w: el.offsetWidth, h: el.offsetHeight })),
        )) {
        assert.ok(size.w >= 44 && size.h >= 44);
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: `coverage/browser/awareness-page-${width}.png`,
        fullPage: true,
      });
      results.push({ width, violations });
      await context.close();
    }
    await writeFile(
      "coverage/browser/awareness-accessibility.json",
      JSON.stringify(results, null, 2),
    );
  },
);

test("Awareness: direct load, refresh, native navigation, anchors, preferences and hydration", async () => {
  const { page, context } = await open();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.reload();
  assert.match(await page.title(), /GBV Awareness/);
  assert.equal(
    await page.locator('#main-nav [aria-current="page"]').innerText(),
    "Awareness",
  );
  for (const section of ["forms", "signs", "prevention"]) {
    await page.locator(`footer a[href="/awareness#${section}"]`).click();
    assert.equal(new URL(page.url()).hash, "#" + section);
    assert.ok(
      await page
        .locator("#" + section)
        .evaluate((el) => Math.abs(el.getBoundingClientRect().top) < 200),
    );
  }
  await page
    .getByRole("link", { name: "Explore support options", exact: true })
    .click();
  assert.equal(new URL(page.url()).pathname, "/find-support");
  assert.equal(new URL(page.url()).hash, "");
  await page.goBack();
  assert.equal(new URL(page.url()).pathname, "/awareness");
  await page.goForward();
  assert.equal(new URL(page.url()).pathname, "/find-support");
  await page.locator('#main-nav a[href="/about"]').click();
  await page.locator('#main-nav a[href="/awareness"]').click();
  await page.getByRole("button", { name: "RW", exact: true }).click();
  await page
    .getByRole("button", { name: "Dismiss for this tab", exact: true })
    .click();
  await page.locator('#main-nav a[href="/"]').click();
  await page.goBack();
  await page.reload();
  assert.match(
    await page.locator(".language-notice").innerText(),
    /TODO-REVIEW/,
  );
  assert.equal(await page.locator(".safety-notice").count(), 0);
  assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), [
    "vuga-language",
  ]);
  assert.deepEqual(await page.evaluate(() => Object.keys(sessionStorage)), [
    "vuga-safety-dismissed",
  ]);
  assert.deepEqual(await context.cookies(), []);
  assert.deepEqual(errors, []);
  await context.close();
});

test("Awareness: keyboard, menu, reduced motion and 200% text", async () => {
  const { page, context } = await open(390);
  await page.keyboard.press("Tab");
  assert.equal(
    await page
      .locator(".skip-link")
      .evaluate((el) => el === document.activeElement),
    true,
  );
  assert.notEqual(
    await page
      .locator(".skip-link")
      .evaluate((el) => getComputedStyle(el).outlineStyle),
    "none",
  );
  await page.keyboard.press("Enter");
  assert.equal(
    await page.locator("main").evaluate((el) => el === document.activeElement),
    true,
  );
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.locator('#main-nav a[href="/awareness"]').focus();
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "Open menu", exact: true })
      .evaluate((el) => el === document.activeElement),
    true,
  );
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  await page.setViewportSize({ width: 640, height: 1000 });
  await page.addStyleTag({ content: "html {font-size:200% !important}" });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await page.screenshot({
    path: "coverage/browser/awareness-text-200.png",
    fullPage: true,
  });
  await context.close();
});

for (const method of ["button", "keyboard"])
  test(`Awareness: intercepted ${method} Quick Exit`, async () => {
    const { page, context } = await open(390);
    await page
      .getByRole("button", { name: "Dismiss for this tab", exact: true })
      .click();
    await page.route("https://www.google.com/**", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<title>Intercepted exit</title>",
      }),
    );
    if (method === "button")
      await page
        .getByRole("button", { name: "Quick Exit", exact: true })
        .click();
    else {
      await page
        .getByRole("button", { name: "Open menu", exact: true })
        .click();
      await page.keyboard.press("Escape");
      await page.keyboard.press("Escape");
    }
    await page.waitForURL("https://www.google.com/");
    assert.equal(await page.title(), "Intercepted exit");
    await page.goto(url);
    assert.equal(await page.locator(".safety-notice").count(), 1);
    assert.equal(
      await page.evaluate(() =>
        sessionStorage.getItem("vuga-safety-dismissed"),
      ),
      null,
    );
    await context.close();
  });

test("Awareness: no-JavaScript content/navigation and failed-image safety", async () => {
  const { page, context } = await open(320, { javaScriptEnabled: false });
  assert.equal(await page.locator(".static-safety").isVisible(), true);
  assert.equal(await page.locator('.static-safety a[href^="tel:"]').count(), 4);
  assert.match(
    await page.locator(".static-safety").innerText(),
    /does not replace this history entry/,
  );
  if ((await (await fetch(url)).text()).includes('id="main-content"')) {
    assert.equal(await page.locator(".learn-form").count(), 4);
    await page.locator('#main-nav a[href="/about"]').click();
    await page.locator('#main-nav a[href="/awareness"]').click();
    assert.match(await page.title(), /GBV Awareness/);
    await page.screenshot({
      path: "coverage/browser/awareness-no-js.png",
      fullPage: true,
    });
  }
  await context.close();
  const failed = await browser.newContext({
    viewport: { width: 320, height: 800 },
  });
  const p = await failed.newPage();
  const external = [];
  p.on("request", (r) => {
    if (!r.url().startsWith(new URL(base).origin)) external.push(r.url());
  });
  await p.route("**/assets/*.webp", (route) => route.abort());
  await p.goto(url, { waitUntil: "networkidle" });
  assert.equal(await p.locator("h1").isVisible(), true);
  assert.equal(
    await p
      .getByRole("button", { name: "Quick Exit", exact: true })
      .isVisible(),
    true,
  );
  assert.equal(await p.locator('.emergency-bar a[href^="tel:"]').count(), 4);
  assert.deepEqual(external, []);
  await failed.close();
});
