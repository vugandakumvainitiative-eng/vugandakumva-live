import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.HOMEPAGE_TEST_URL || "http://127.0.0.1:5190/";
const about = new URL("/about", base).href;
let browser;
let axe;
before(async () => {
  await mkdir("coverage/browser", { recursive: true });
  axe = await readFile("node_modules/axe-core/axe.min.js", "utf8");
  browser = await chromium.launch({ channel: "chrome", headless: true });
});
after(async () => browser?.close());
async function open(width = 1280, options = {}) {
  const context = await browser.newContext({
    viewport: { width, height: 1000 },
    reducedMotion: "reduce",
    ...options,
  });
  const page = await context.newPage();
  await page.goto(about, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return { page, context };
}

test(
  "About: seven responsive widths, source roster, axe and browser evidence",
  { timeout: 120000 },
  async () => {
    const results = [];
    const source = await readFile(
      "designs/about-us/about-us-old-site-redesign-v3-source.txt",
      "utf8",
    );
    const lines = source.split(/\r?\n/);
    const first = lines.indexOf("David Niyomugabo");
    for (const width of [320, 375, 390, 768, 1024, 1280, 1536]) {
      const { context, page } = await open(width);
      assert.equal(await page.locator(".team-card").count(), 8);
      for (let i = 0; i < 8; i++) {
        const card = page.locator(".team-card").nth(i);
        assert.equal(
          await card.locator("h3").innerText(),
          lines[first + 2 * i],
        );
        assert.equal(
          await card.locator("p").innerText(),
          lines[first + 2 * i + 1],
        );
      }
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        `overflow ${width}`,
      );
      const sizes = await page
        .locator(".emergency-bar a, .quick-exit")
        .evaluateAll((els) =>
          els.map((el) => ({
            w: el.getBoundingClientRect().width,
            h: el.getBoundingClientRect().height,
          })),
        );
      for (const size of sizes) assert.ok(size.w >= 44 && size.h >= 44);
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
      results.push({ width, violations });
      assert.deepEqual(
        violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
        [],
      );
      for (const image of await page.locator("img").all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate((el) => el.decode());
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: `coverage/browser/about-page-${width}.png`,
        fullPage: true,
      });
      await context.close();
    }
    await writeFile(
      "coverage/browser/about-accessibility.json",
      JSON.stringify(results, null, 2),
    );
  },
);

test("About: native navigation, refresh, Back/Forward, anchors and saved preferences", async () => {
  const { page, context } = await open();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  assert.match(await page.title(), /About Us/);
  assert.equal(
    await page.locator('#main-nav [aria-current="page"]').innerText(),
    "About",
  );
  await page.getByRole("link", { name: "Our story", exact: true }).click();
  assert.equal(new URL(page.url()).hash, "#our-story");
  assert.ok(
    await page
      .locator("#our-story")
      .evaluate((el) => Math.abs(el.getBoundingClientRect().top) < 300),
  );
  await page.getByRole("link", { name: "Meet the team", exact: true }).click();
  assert.equal(new URL(page.url()).hash, "#team");
  await page
    .locator("#main-nav a")
    .filter({ hasText: /^Awareness$/ })
    .click();
  assert.equal(new URL(page.url()).pathname, "/awareness");
  assert.equal(new URL(page.url()).hash, "");
  assert.ok(
    await page
      .locator("#main-content")
      .evaluate((el) => Math.abs(el.getBoundingClientRect().top) < 300),
  );
  await page.goBack();
  assert.equal(new URL(page.url()).pathname, "/about");
  await page.goForward();
  assert.equal(new URL(page.url()).pathname, "/awareness");
  await page.locator('#main-nav a[href="/about"]').click();
  await page.reload();
  assert.match(await page.title(), /About Us/);
  await page.getByRole("button", { name: "RW", exact: true }).click();
  await page
    .getByRole("button", { name: "Dismiss for this tab", exact: true })
    .click();
  await page.locator('#main-nav a[href="/"]').click();
  await page.goBack();
  assert.match(
    await page.locator(".language-notice").innerText(),
    /TODO-REVIEW/,
  );
  assert.equal(await page.locator(".safety-notice").count(), 0);
  await page.goForward();
  await page.locator('#main-nav a[href="/about"]').click();
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

test("About: keyboard skip link, visible focus, mobile menu and reduced motion", async () => {
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
  await page.locator('#main-nav a[href="/about"]').focus();
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
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page
    .locator("#main-nav")
    .getByRole("link", { name: "Find Support", exact: true })
    .click();
  assert.equal(new URL(page.url()).pathname, "/find-support");
  assert.equal(
    await page
      .getByRole("button", { name: "Open menu", exact: true })
      .getAttribute("aria-expanded"),
    "false",
  );
  await context.close();
});

for (const method of ["button", "keyboard"])
  test(`About: intercepted ${method} Quick Exit clears tab state`, async () => {
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
    await page.goto(about);
    assert.equal(await page.locator(".safety-notice").count(), 1);
    assert.equal(
      await page.evaluate(() =>
        sessionStorage.getItem("vuga-safety-dismissed"),
      ),
      null,
    );
    await context.close();
  });

test("About: static content and reachable navigation without JavaScript", async () => {
  const { page, context } = await open(320, { javaScriptEnabled: false });
  assert.equal(await page.locator(".static-safety").isVisible(), true);
  assert.equal(await page.locator('.static-safety a[href^="tel:"]').count(), 4);
  assert.match(
    await page.locator(".static-safety").innerText(),
    /does not replace this history entry/,
  );
  // Development intentionally has safety-only fallback; production has full static content.
  const homeHtml = await (await fetch(base)).text();
  if (homeHtml.includes('id="main-content"')) {
    assert.equal(await page.locator(".team-card").count(), 8);
    assert.match(await page.title(), /About Us/);
    await page.locator('#main-nav a[href="/"]').click();
    assert.equal(new URL(page.url()).pathname, "/");
    await page.locator('#main-nav a[href="/about"]').click();
    assert.equal(await page.locator(".team-card").count(), 8);
  }
  await context.close();
});

test("About: enlarged text, failed images and no third-party runtime requests", async () => {
  const { page, context } = await open(640);
  await page.addStyleTag({ content: "html { font-size:200% !important }" });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await page.screenshot({
    path: "coverage/browser/about-text-200.png",
    fullPage: true,
  });
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
  await p.goto(about, { waitUntil: "networkidle" });
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
