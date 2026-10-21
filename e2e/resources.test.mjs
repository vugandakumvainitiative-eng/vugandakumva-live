import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.HOMEPAGE_TEST_URL || "http://127.0.0.1:5190/";
const url = new URL("/resources", base).href;
let browser, axe;
before(async () => {
  await mkdir("coverage/browser", { recursive: true });
  axe = await readFile("node_modules/axe-core/axe.min.js", "utf8");
  browser = await chromium.launch({ channel: "chrome" });
});
after(async () => browser?.close());
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
  "Resources: seven widths, all content, axe and screenshots",
  { timeout: 120000 },
  async () => {
    const results = [];
    for (const width of [320, 375, 390, 768, 1024, 1280, 1536]) {
      const { page, context } = await open(width);
      assert.equal(await page.locator(".resource-card").count(), 9);
      assert.equal(await page.locator(".resource-options-grid li").count(), 4);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
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
        .locator(".emergency-bar a, .quick-exit, .resource-filters button")
        .evaluateAll((els) =>
          els.map((el) => ({ w: el.offsetWidth, h: el.offsetHeight })),
        ))
        assert.ok(size.w >= 44 && size.h >= 44);
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: `coverage/browser/resources-${width}.png`,
        fullPage: true,
      });
      results.push({ width, violations });
      await context.close();
    }
    await writeFile(
      "coverage/browser/resources-accessibility.json",
      JSON.stringify(results, null, 2),
    );
  },
);
test("Resources: keyboard filters are local, correctly grouped, announced and reset", async () => {
  const { page, context } = await open(390);
  const initialUrl = page.url();
  const filterGeometry = () =>
    page.locator(".resource-filters button").evaluateAll((buttons) => {
      const parent = buttons[0].parentElement.getBoundingClientRect();
      return buttons.map((button) => {
        const box = button.getBoundingClientRect();
        return [box.x - parent.x, box.y - parent.y, box.width, box.height];
      });
    });
  const initialGeometry = await filterGeometry();
  for (const [name, count] of [
    ["Hotlines", 3],
    ["Legal Aid", 2],
    ["Shelters", 2],
    ["Mental Health", 2],
    ["Education", 1],
    ["All Resources", 9],
  ]) {
    const button = page.getByRole("button", { name, exact: true });
    await button.focus();
    assert.notEqual(
      await button.evaluate((el) => getComputedStyle(el).outlineStyle),
      "none",
    );
    await page.keyboard.press("Space");
    assert.equal(await button.getAttribute("aria-pressed"), "true");
    assert.equal(await page.locator(".resource-card").count(), count);
    assert.match(
      await page.getByRole("status").innerText(),
      new RegExp(`Showing ${count} resource`),
    );
    assert.equal(
      await page.locator('.resource-filters [aria-pressed="true"]').count(),
      1,
    );
    assert.equal(page.url(), initialUrl);
    assert.deepEqual(
      await filterGeometry(),
      initialGeometry,
      "Selecting a category must not move or resize its controls",
    );
  }
  assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), []);
  assert.deepEqual(await page.evaluate(() => Object.keys(sessionStorage)), []);
  await page.getByRole("button", { name: "Education", exact: true }).click();
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.locator('#main-nav a[href="/about"]').click();
  await page.goBack();
  assert.equal(await page.locator(".resource-card").count(), 9);
  await context.close();
});
test("Resources: navigation, hydration, contact anchor and unavailable actions", async () => {
  const { page, context } = await open();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.reload();
  assert.match(await page.title(), /Resources & Support/);
  assert.equal(
    await page.locator('#main-nav [aria-current="page"]').innerText(),
    "Resources",
  );
  assert.equal(await page.locator(".resource-pending:disabled").count(), 9);
  assert.equal(
    await page
      .locator('.resource-card a, a[href*="wa.me"], a[download]')
      .count(),
    0,
  );
  for (const number of ["112", "3512", "3029", "116"])
    assert.equal(
      await page.locator(`.emergency-bar a[href="tel:${number}"]`).count(),
      1,
    );
  assert.doesNotMatch(
    await page.locator(".emergency-bar").innerText(),
    /Police/,
  );
  await page.getByRole("link", { name: "View contact information" }).click();
  assert.equal(new URL(page.url()).hash, "#contact");
  assert.match(
    await page.locator(".footer-contact").innerText(),
    /awaiting verification/,
  );
  await page.locator(".resource-safety-strip a").click();
  assert.equal(new URL(page.url()).hash, "#safety");
  for (const route of ["/", "/about", "/awareness"]) {
    await page.locator(`#main-nav a[href="${route}"]`).click();
    await page.locator('#main-nav a[href="/resources"]').click();
    assert.match(await page.title(), /Resources & Support/);
  }
  await page.goBack();
  await page.goForward();
  assert.match(await page.title(), /Resources & Support/);
  await page.getByRole("button", { name: "RW", exact: true }).click();
  await page.getByRole("button", { name: "Dismiss for this tab" }).click();
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
  assert.deepEqual(errors, []);
  assert.deepEqual(await context.cookies(), []);
  await context.close();
});
test("Resources: keyboard skip/menu, reduced motion and enlarged text", async () => {
  const { page, context } = await open(320);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  assert.ok(
    await page.locator("main").evaluate((el) => el === document.activeElement),
  );
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.locator('#main-nav a[href="/resources"]').focus();
  await page.keyboard.press("Escape");
  assert.ok(
    await page
      .getByRole("button", { name: "Open menu", exact: true })
      .evaluate((el) => el === document.activeElement),
  );
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  await page.setViewportSize({ width: 640, height: 1000 });
  await page.addStyleTag({ content: "html{font-size:200% !important}" });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({
    path: "coverage/browser/resources-text-200.png",
    fullPage: true,
  });
  await context.close();
});
for (const method of ["button", "keyboard"])
  test(`Resources: intercepted ${method} Quick Exit and cleanup`, async () => {
    const { page, context } = await open(390);
    await page.getByRole("button", { name: "Education", exact: true }).click();
    await page.getByRole("button", { name: "Dismiss for this tab" }).click();
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
      await page.keyboard.press("Escape");
      await page.keyboard.press("Escape");
    }
    await page.waitForURL("https://www.google.com/");
    assert.equal(await page.title(), "Intercepted exit");
    await page.goto(url);
    assert.equal(await page.locator(".safety-notice").count(), 1);
    assert.equal(await page.locator(".resource-card").count(), 9);
    assert.deepEqual(
      await page.evaluate(() => Object.keys(sessionStorage)),
      [],
    );
    await context.close();
  });
test("Resources: no-JavaScript fallback and failed-image safety", async () => {
  const { page, context } = await open(320, { javaScriptEnabled: false });
  assert.ok(await page.locator(".static-safety").isVisible());
  assert.equal(await page.locator('.static-safety a[href^="tel:"]').count(), 4);
  assert.match(
    await page.locator(".static-safety").innerText(),
    /does not replace this history entry/,
  );
  if ((await (await fetch(url)).text()).includes('id="main-content"')) {
    assert.equal(await page.locator(".resource-card").count(), 9);
    assert.equal(
      await page.locator(".resource-filters button:disabled").count(),
      6,
    );
    assert.ok(await page.locator(".resource-no-js").isVisible());
    await page.locator('#main-nav a[href="/about"]').click();
    await page.locator('#main-nav a[href="/resources"]').click();
    assert.match(await page.title(), /Resources & Support/);
    await page.screenshot({
      path: "coverage/browser/resources-no-js.png",
      fullPage: true,
    });
  }
  await context.close();
  const failed = await browser.newContext({
    viewport: { width: 320, height: 800 },
  });
  const p = await failed.newPage(),
    external = [];
  p.on("request", (r) => {
    if (!r.url().startsWith(new URL(base).origin)) external.push(r.url());
  });
  await p.route("**/assets/*.webp", (route) => route.abort());
  await p.goto(url, { waitUntil: "networkidle" });
  assert.ok(
    await p
      .getByRole("button", { name: "Quick Exit", exact: true })
      .isVisible(),
  );
  assert.equal(await p.locator(".resource-card").count(), 9);
  assert.deepEqual(external, []);
  await failed.close();
});
