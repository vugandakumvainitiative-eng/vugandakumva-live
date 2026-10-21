import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
const base = process.env.HOMEPAGE_TEST_URL || "http://127.0.0.1:5190/";
const url = new URL("/find-support", base).href;
let browser, axe;
before(async () => {
  browser = await chromium.launch({ channel: "chrome" });
  axe = await readFile("node_modules/axe-core/axe.min.js", "utf8");
  await mkdir("coverage/browser", { recursive: true });
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
  return { page, context };
}
test(
  "Find Support redesign: seven widths, content, axe and visual evidence",
  { timeout: 120000 },
  async () => {
    const results = [];
    for (const width of [320, 375, 390, 768, 1024, 1280, 1536]) {
      const { page, context } = await open(width);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator(".fs-category").count(), 6);
      assert.equal(await page.locator("main details").count(), 4);
      assert.equal(
        await page.locator("main input,main select,main form").count(),
        0,
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      for (const image of await page.locator("img:visible").all()) {
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
      for (const a of await page
        .locator(".fs-phone-grid a,.fs-category a")
        .all()) {
        assert.ok((await a.boundingBox()).height >= 44);
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: `coverage/browser/find-support-redesign-${width}.png`,
        fullPage: true,
      });
      results.push({ width, axe: 0, overflow: false });
      await context.close();
    }
    await writeFile(
      "coverage/browser/find-support-redesign-results.json",
      JSON.stringify(results, null, 2),
    );
  },
);
test("Find Support redesign: anchors, resources destinations, navigation and hydration", async () => {
  const { page, context } = await open();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.reload({ waitUntil: "networkidle" });
  assert.match(await page.title(), /Find Support/);
  assert.equal(
    await page.locator('#main-nav a[aria-current="page"]').getAttribute("href"),
    "/find-support",
  );
  await page
    .getByRole("link", { name: "View Support Options", exact: true })
    .click();
  assert.equal(new URL(page.url()).hash, "#support-options");
  await page
    .getByRole("link", { name: "View Emergency Contacts", exact: true })
    .first()
    .click();
  assert.equal(new URL(page.url()).hash, "#urgent-help");
  const links = await page
    .locator(".fs-category a")
    .evaluateAll((nodes) =>
      nodes.map((a) => ({ text: a.textContent, href: a.getAttribute("href") })),
    );
  for (const { href } of links) {
    await page.goto(new URL(href, url).href, { waitUntil: "networkidle" });
    assert.ok(await page.locator(new URL(page.url()).hash).isVisible());
  }
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator(".fs-help a").click();
  assert.equal(new URL(page.url()).pathname, "/awareness");
  assert.equal(new URL(page.url()).hash, "#prevention");
  await page.goBack({ waitUntil: "networkidle" });
  await page.goForward({ waitUntil: "networkidle" });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator('#main-nav a[href="/"]').click();
  await page.locator('#main-nav a[href="/find-support"]').click();
  assert.equal(new URL(page.url()).pathname, "/find-support");
  assert.deepEqual(errors, []);
  await context.close();
});
test("Find Support redesign: keyboard, menu, preferences, privacy and 200% text", async () => {
  const { page, context } = await open(390);
  await page.keyboard.press("Tab");
  assert.equal(
    await page
      .locator(".skip-link")
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.keyboard.press("Enter");
  assert.equal(
    await page.locator("main").evaluate((el) => el === document.activeElement),
    true,
  );
  const menu = page.getByRole("button", { name: "Open menu", exact: true });
  await menu.click();
  await page.keyboard.press("Escape");
  assert.equal(
    await menu.evaluate((el) => el === document.activeElement),
    true,
  );
  await page.locator(".fs-faq summary").nth(1).focus();
  await page.keyboard.press("Enter");
  assert.equal(
    await page.locator(".fs-faq details").nth(1).getAttribute("open"),
    "",
  );
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), []);
  assert.deepEqual(await page.evaluate(() => Object.keys(sessionStorage)), []);
  await page.evaluate(() => {
    localStorage.setItem("vuga-language", "rw");
    sessionStorage.setItem("vuga-safety-dismissed", "true");
  });
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator("html").getAttribute("lang"), "rw");
  assert.equal(await page.locator(".safety-notice").count(), 0);
  await page.setViewportSize({ width: 640, height: 1000 });
  await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await context.close();
});
for (const method of ["button", "keyboard"])
  test(`Find Support redesign: intercepted ${method} Quick Exit and cleanup`, async () => {
    const { page, context } = await open(390);
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
    await page.goto(url, { waitUntil: "networkidle" });
    assert.deepEqual(
      await page.evaluate(() => Object.keys(sessionStorage)),
      [],
    );
    assert.equal(await page.locator(".safety-notice").count(), 1);
    await context.close();
  });
test("Find Support redesign: no-JavaScript content, accordions and emergency fallback", async () => {
  const { page, context } = await open(320, { javaScriptEnabled: false });
  assert.equal(
    await page.locator("h1").innerText(),
    "You deserve support. Choose what feels right for you.",
  );
  assert.ok(await page.locator(".static-safety").isVisible());
  for (const number of ["112", "3512", "3029", "116"]) {
    const a = page.locator(`.fs-phone-grid a[href="tel:${number}"]`);
    assert.equal(await a.count(), 1);
    assert.equal(
      await a.getAttribute("aria-label"),
      `Call ${number} \u2014 verification pending`,
    );
  }
  assert.doesNotMatch(
    await page.locator(".fs-phone-grid").innerText(),
    /Police|24\/7|free/i,
  );
  await page.locator(".fs-faq summary").nth(3).click();
  assert.equal(
    await page.locator(".fs-faq details").nth(3).getAttribute("open"),
    "",
  );
  assert.match(
    await page.locator(".fs-faq details").nth(3).innerText(),
    /network traces/,
  );
  await page.locator(".fs-hero a").first().click();
  assert.equal(new URL(page.url()).hash, "#support-options");
  await context.close();
});
test("Find Support redesign: failed images and no third-party runtime requests", async () => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 900 },
  });
  const page = await context.newPage();
  const external = [];
  page.on("request", (r) => {
    if (!r.url().startsWith(new URL(base).origin)) external.push(r.url());
  });
  await page.route("**/assets/*.webp", (route) => route.abort());
  await page.goto(url, { waitUntil: "networkidle" });
  assert.ok(
    await page
      .getByRole("button", { name: "Quick Exit", exact: true })
      .isVisible(),
  );
  assert.ok(await page.locator(".fs-phone-grid a").first().isVisible());
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  assert.deepEqual(external, []);
  await context.close();
});
