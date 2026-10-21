import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
const base = process.env.HOMEPAGE_TEST_URL || "http://127.0.0.1:5190/";
const url = new URL("/contact", base).href;
let browser, axe;
before(async () => {
  browser = await chromium.launch({ channel: "chrome" });
  axe = await readFile("node_modules/axe-core/axe.min.js", "utf8");
  await mkdir("coverage/browser", { recursive: true });
});
after(async () => browser?.close());
async function open(width = 1440, options = {}) {
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
  "Contact: five widths, axe, artwork, wrapping and touch targets",
  { timeout: 120000 },
  async () => {
    const results = [];
    for (const width of [320, 375, 768, 1024, 1440]) {
      const { page, context } = await open(width);
      await page.evaluate(() => document.fonts.ready);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      assert.equal(await page.locator(".contact-detail").count(), 4);
      assert.equal(await page.locator("main form, main input").count(), 0);
      for (const img of await page.locator("img:visible").all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate((el) => el.decode());
      }
      for (const a of await page.locator("main a").all())
        assert.ok((await a.boundingBox()).height >= 44);
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
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: `coverage/browser/contact-${width}.png`,
        fullPage: true,
      });
      results.push({ width, axeViolations: 0, overflow: false });
      await context.close();
    }
    await writeFile(
      "coverage/browser/contact-results.json",
      JSON.stringify(results, null, 2),
    );
  },
);
test("Contact: navigation, anchors, refresh, history and contact destinations", async () => {
  const { page, context } = await open();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.reload({ waitUntil: "networkidle" });
  assert.match(await page.title(), /Contact/);
  assert.equal(
    await page.locator('#main-nav [aria-current="page"]').getAttribute("href"),
    "/contact",
  );
  await page.locator(".contact-actions a").first().click();
  assert.equal(new URL(page.url()).hash, "#contact-details");
  assert.equal(
    await page.locator('main a[href^="mailto:"]').getAttribute("href"),
    "mailto:vugandakumvainitiative@gmail.com",
  );
  assert.equal(await page.locator('main a[href^="tel:"]').count(), 2);
  assert.equal(await page.locator('main a[href*="wa.me"]').count(), 0);
  for (const a of await page.locator(".contact-connect-card a").all()) {
    await a.click();
    if (new URL(page.url()).pathname === "/awareness") {
      await page.goBack({ waitUntil: "networkidle" });
    } else assert.equal(new URL(page.url()).hash, "#contact-details");
  }
  await page.locator(".contact-help a").click();
  await page.waitForURL("**/find-support");
  await page.goBack({ waitUntil: "networkidle" });
  await page.goForward({ waitUntil: "networkidle" });
  await page.goto(url + "/", { waitUntil: "networkidle" });
  assert.equal(await page.locator("h1").innerText(), "Get in touch.");
  assert.deepEqual(errors, []);
  await context.close();
});
test("Contact: keyboard, mobile menu, preferences and enlarged text", async () => {
  const { page, context } = await open(375);
  await page.keyboard.press("Tab");
  assert.equal(
    await page.locator(":focus").getAttribute("href"),
    "#main-content",
  );
  const focus = await page
    .locator(":focus")
    .evaluate((el) => getComputedStyle(el).outlineStyle);
  assert.notEqual(focus, "none");
  await page.getByRole("button", { name: "Open menu" }).click();
  assert.ok(await page.locator("#main-nav").isVisible());
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("button", { name: "RW", exact: true }).click();
  await page.getByRole("button", { name: "Close menu" }).click();
  await page.getByRole("button", { name: "Dismiss for this tab" }).click();
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator("html").getAttribute("lang"), "rw");
  assert.equal(await page.locator(".safety-notice").count(), 0);
  await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await context.close();
});
for (const method of ["button", "keyboard"])
  test(`Contact: intercepted ${method} Quick Exit`, async () => {
    const { page, context } = await open(375);
    await page.getByRole("button", { name: "Dismiss for this tab" }).click();
    await page.route("https://www.google.com/**", (r) =>
      r.fulfill({
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
    await context.close();
  });
test("Contact: JavaScript disabled and missing images retain safety", async () => {
  for (const noJs of [true, false]) {
    const { page, context } = await open(320, { javaScriptEnabled: !noJs });
    if (!noJs) {
      await page.route("**/*.webp", (r) => r.abort());
      await page.reload({ waitUntil: "networkidle" });
    }
    assert.equal(await page.locator("h1").innerText(), "Get in touch.");
    if (noJs) assert.ok(await page.locator(".static-safety").isVisible());
    for (const n of ["112", "3512", "3029", "116"])
      assert.ok(await page.locator(`a[href="tel:${n}"]:visible`).count());
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await context.close();
  }
});
