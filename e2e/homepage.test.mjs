import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
const url = process.env.HOMEPAGE_TEST_URL || "http://127.0.0.1:5190/";
const evidence = new URL("../coverage/browser/", import.meta.url);
let browser;
let axe;
before(async () => {
  await mkdir(evidence, { recursive: true });
  axe = await readFile(
    new URL("../node_modules/axe-core/axe.min.js", import.meta.url),
    "utf8",
  );
  browser = await chromium.launch({ channel: "chrome", headless: true });
});
after(async () => {
  await browser?.close();
});
async function pageAt(width = 1536, options = {}) {
  const context = await browser.newContext({
    viewport: { width, height: 1024 },
    reducedMotion: "reduce",
    ...options,
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.locator("h1").waitFor();
  await page.evaluate(() => document.fonts.ready);
  return { context, page };
}
test("responsive layout, safety controls and axe across seven widths", async () => {
  const results = [];
  for (const width of [320, 375, 390, 768, 1024, 1280, 1536]) {
    const { context, page } = await pageAt(width);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      "overflow at " + width,
    );
    for (const number of ["112", "3512", "3029", "116"])
      assert.equal(
        await page
          .locator('.emergency-bar a[href="tel:' + number + '"]')
          .count(),
        1,
      );
    const targets = await page
      .locator(".emergency-bar a, .quick-exit")
      .evaluateAll((elements) =>
        elements.map((element) => ({
          text: element.textContent,
          width: element.getBoundingClientRect().width,
          height: element.getBoundingClientRect().height,
        })),
      );
    for (const target of targets)
      assert.ok(
        target.width >= 44 && target.height >= 44,
        "target " + JSON.stringify({ width, ...target }),
      );
    await page.addScriptTag({ content: axe });
    const audit = await page.evaluate(
      async () =>
        (
          await window.axe.run(document, {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
          })
        ).violations,
    );
    results.push({ width, violations: audit });
    for (const image of await page.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((element) => element.decode());
    }
    // Paint offscreen sections only for the full-page image, after the real-page audit.
    await page.addStyleTag({
      content:
        ".about-section, .awareness-section, .support-section { content-visibility: visible !important; }",
    });
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({
      path: fileURLToPath(new URL("home-" + width + ".png", evidence)),
      fullPage: true,
    });
    assert.deepEqual(
      audit.map((item) => ({
        id: item.id,
        nodes: item.nodes.map((node) => node.target),
      })),
      [],
      "axe at " + width,
    );
    await context.close();
  }
  await writeFile(
    new URL("accessibility.json", evidence),
    JSON.stringify(results, null, 2),
  );
});
test("mobile menu opens, closes with Escape and restores focus", async () => {
  const { context, page } = await pageAt(390);
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.locator("#main-nav a").first().focus();
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "Open menu", exact: true })
      .getAttribute("aria-expanded"),
    "false",
  );
  assert.equal(
    await page
      .getByRole("button", { name: "Open menu", exact: true })
      .evaluate((element) => element === document.activeElement),
    true,
  );
  await context.close();
});
test("support filters show an honest pending state and reset", async () => {
  const { context, page } = await pageAt();
  await page.getByLabel("District", { exact: true }).selectOption("Gasabo");
  await page.locator("input[value=legal]").check();
  await page
    .getByRole("button", { name: "Browse directory", exact: true })
    .click();
  assert.match(
    await page.locator(".directory-result").innerText(),
    /Gasabo · Legal support/,
  );
  assert.match(
    await page.locator(".directory-result").innerText(),
    /does not mean that services do not exist/,
  );
  await page
    .getByRole("button", { name: "Reset selection", exact: true })
    .click();
  assert.equal(
    await page.getByLabel("District", { exact: true }).inputValue(),
    "",
  );
  assert.equal(await page.locator(".directory-result").count(), 0);
  await context.close();
});
test("Escape closes the menu from its toggle and double Escape still exits", async () => {
  const { context, page } = await pageAt(390);
  await page.route("https://www.google.com/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<title>Intercepted exit</title>",
    }),
  );
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.keyboard.press("Escape");
  const toggle = page.getByRole("button", { name: "Open menu", exact: true });
  assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  assert.equal(
    await toggle.evaluate((element) => element === document.activeElement),
    true,
  );
  await page.keyboard.press("Escape");
  await page.waitForURL("https://www.google.com/");
  assert.equal(await page.title(), "Intercepted exit");
  await context.close();
});
test("language review status and storage minimization", async () => {
  const { context, page } = await pageAt();
  await page.getByRole("button", { name: "RW", exact: true }).click();
  assert.match(
    await page.locator(".language-notice").innerText(),
    /TODO-REVIEW/,
  );
  assert.equal(await page.locator("html").getAttribute("lang"), "rw");
  assert.equal(await page.locator("#home").getAttribute("lang"), "en");
  await page
    .getByRole("button", { name: "Dismiss for this tab", exact: true })
    .click();
  assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), [
    "vuga-language",
  ]);
  assert.deepEqual(await page.evaluate(() => Object.keys(sessionStorage)), [
    "vuga-safety-dismissed",
  ]);
  assert.deepEqual(await context.cookies(), []);
  await page.reload({ waitUntil: "networkidle" });
  assert.match(
    await page.locator(".language-notice").innerText(),
    /TODO-REVIEW/,
  );
  assert.equal(await page.locator(".safety-notice").count(), 0);
  await context.close();
});
test("carousel changes manually and reduced motion keeps autoplay off", async () => {
  const { context, page } = await pageAt();
  await page.getByRole("button", { name: "Next topic", exact: true }).click();
  assert.match(await page.locator("h1").innerText(), /Explore support/);
  assert.equal(
    await page
      .getByRole("button", { name: "Play automatic topics", exact: true })
      .isDisabled(),
    true,
  );
  await page
    .getByRole("button", { name: "Previous topic", exact: true })
    .click();
  assert.match(await page.locator("h1").innerText(), /Know the Signs/);
  await context.close();
});
test("automatic carousel stops after manual navigation", async () => {
  const { context, page } = await pageAt(1536, {
    reducedMotion: "no-preference",
  });
  await page.mouse.move(10, 10);
  await page.waitForTimeout(7200);

  assert.match(await page.locator("h1").innerText(), /Explore support/);
  await page.getByRole("button", { name: "Next topic", exact: true }).click();
  const heading = await page.locator("h1").innerText();
  await page.mouse.move(10, 10);
  await page.waitForTimeout(15000);
  assert.equal(await page.locator("h1").innerText(), heading);
  await context.close();
});
for (const method of ["button", "keyboard"])
  test(
    "Quick Exit via " +
      method +
      " replaces current entry without claiming full history erasure",
    async () => {
      const { context, page } = await pageAt();
      await page.getByLabel("District", { exact: true }).selectOption("Huye");
      await page.route("https://www.google.com/**", (route) =>
        route.fulfill({
          status: 200,
          contentType: "text/html",
          body: "<title>Intercepted neutral destination</title>",
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
      assert.equal(await page.title(), "Intercepted neutral destination");
      await context.close();
    },
  );
test("static HTML retains safety links when JavaScript is disabled", async () => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 800 },
  });
  const page = await context.newPage();
  await page.goto(url);
  assert.equal(await page.locator(".static-safety").isVisible(), true);
  assert.equal(await page.locator('.static-safety a[href^="tel:"]').count(), 4);
  assert.match(
    await page.locator(".static-safety").innerText(),
    /does not replace this history entry/,
  );
  await context.close();
});
test("browser capture and requests contain no third-party runtime loads", async () => {
  const context = await browser.newContext({
    viewport: { width: 1536, height: 1024 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const external = [];
  const errors = [];
  page.on("request", (request) => {
    if (
      !request.url().startsWith(new URL(url).origin) &&
      !request.url().startsWith("data:")
    )
      external.push(request.url());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: fileURLToPath(new URL("hero-desktop.png", evidence)),
  });
  for (const [id, name] of [
    ["about", "about-desktop"],
    ["awareness", "awareness-desktop"],
    ["support", "support-desktop"],
  ]) {
    await page.locator("#" + id).scrollIntoViewIfNeeded();
    await page
      .locator("#" + id)
      .screenshot({ path: fileURLToPath(new URL(name + ".png", evidence)) });
  }
  assert.deepEqual(external, []);
  assert.deepEqual(errors, []);
  await context.close();
});
test("enlarged text and failed artwork retain readable safety controls", async () => {
  const { context, page } = await pageAt(640);
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  assert.equal(
    await page
      .getByRole("button", { name: "Quick Exit", exact: true })
      .isVisible(),
    true,
  );
  await context.close();
  const failed = await browser.newContext({
    viewport: { width: 320, height: 800 },
  });
  const failedPage = await failed.newPage();
  await failedPage.route("**/assets/*.webp", (route) => route.abort());
  await failedPage.goto(url);
  assert.equal(
    await failedPage
      .getByRole("button", { name: "Quick Exit", exact: true })
      .isVisible(),
    true,
  );
  assert.equal(
    await failedPage.locator('.emergency-bar a[href^="tel:"]').count(),
    4,
  );
  assert.equal(await failedPage.locator("h1").isVisible(), true);
  await failed.close();
});
