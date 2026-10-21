// @vitest-environment node
import { describe, expect, it } from "vitest";
import { renderHome, renderPage } from "./prerender";

it("renders all nine Resources entries, disabled controls and safety without browser APIs", () => {
  const html = renderPage("/resources");
  expect((html.match(/class="resource-card"/g) || []).length).toBe(9);
  expect(html).toContain("Details pending verification");
  expect(html).toContain("These are choices, not required steps.");
  expect(html).not.toContain("3029 (Police)");
  expect(html).not.toContain("Know the Signs.");
  for (const number of ["112", "3512", "3029", "116"])
    expect(html).toContain(`href="tel:${number}"`);
  expect(renderPage("/resources/")).toBe(html);
});
it("renders Awareness educational content and safety independently", () => {
  const html = renderPage("/awareness");
  expect(html).toContain("GBV Awareness");
  expect(html).toContain("Sexual Violence");
  expect((html.match(/class="learn-form"/g) || []).length).toBe(4);
  expect(html).toContain('id="signs"');
  expect(html).toContain('id="prevention"');
  expect(html).not.toContain("Know the Signs.");
  for (const number of ["112", "3512", "3029", "116"])
    expect(html).toContain(`href="tel:${number}"`);
  expect(renderPage("/awareness/")).toBe(html);
});

describe("static homepage", () => {
  it("renders the page and emergency links without browser APIs", () => {
    const html = renderHome();
    expect(html).toContain("Know the Signs.");
    for (const number of ["112", "3512", "3029", "116"]) {
      expect(html).toContain(`href="tel:${number}"`);
    }
    for (const section of ["about", "awareness", "support"]) {
      expect(html).toContain(`id="${section}"`);
    }
    expect(html).toContain("Quick Exit");
  });
});

it("renders About content and full published roster independently of Home", () => {
  const html = renderPage("/about");
  expect(html).toContain("Born from Silence. Built for Change.");
  expect(html).not.toContain("Know the Signs.");
  expect((html.match(/class="team-card"/g) || []).length).toBe(8);
  expect(html).toContain("Parternership Lead");
  expect(html).toContain("Organizing Events");
  expect(html).toContain("Coordinator");
  for (const number of ["112", "3512", "3029", "116"])
    expect(html).toContain(`href="tel:${number}"`);
  expect(renderPage("/about/")).toBe(html);
});

it("renders Find Support guidance and safety without JavaScript", () => {
  const html = renderPage("/find-support");
  expect(html).toContain(
    "You deserve support. Choose what feels right for you.",
  );
  expect(html).toContain("Service details are being reviewed");
  expect((html.match(/<details/g) || []).length).toBe(4);
  expect(html).not.toContain("<select");
  expect(html).not.toContain("<form");
  expect((html.match(/class="fs-category"/g) || []).length).toBe(6);
  expect(html).not.toContain("Know the Signs.");
  for (const number of ["112", "3512", "3029", "116"])
    expect(html).toContain(`href="tel:${number}"`);
  expect(renderPage("/find-support/")).toBe(html);
});
it("renders Contact details and safety without an intake form", () => {
  const html = renderPage("/contact");
  expect(html).toContain("Get in touch.");
  expect(html).toContain("vugandakumvainitiative@gmail.com");
  expect(html).toContain("+250 781 640 246");
  expect(html).toContain("+250 791 274 264");
  expect(html).toContain("verification pending");
  expect(html).not.toContain("<form");
  expect(html).not.toContain("wa.me");
  for (const number of ["112", "3512", "3029", "116"])
    expect(html).toContain(`href="tel:${number}"`);
  expect(renderPage("/contact/")).toBe(html);
});
