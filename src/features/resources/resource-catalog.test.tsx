import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, expect, it } from "vitest";
import { i18n } from "../../lib/i18n";
import { performQuickExit } from "../../lib/quick-exit";
import { ResourceCatalog } from "./resource-catalog";

afterEach(cleanup);
it("provides an accessible empty state for a category with no listed resources", () => {
  render(
    <I18nextProvider i18n={i18n}>
      <ResourceCatalog items={[]} />
    </I18nextProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Shelters" }));
  expect(screen.getByRole("status")).toHaveTextContent("Showing 0 resources.");
  expect(
    screen.getByRole("heading", {
      name: "No resources listed in this category yet",
    }),
  ).toBeVisible();
  fireEvent.click(screen.getAllByRole("button", { name: "All Resources" })[1]!);
  expect(
    screen.getAllByRole("button", { name: "All Resources" })[0],
  ).toHaveAttribute("aria-pressed", "true");
});
it("clears category choices on pagehide and Quick Exit", () => {
  render(
    <I18nextProvider i18n={i18n}>
      <ResourceCatalog />
    </I18nextProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Education" }));
  expect(screen.getByRole("status")).toHaveTextContent("Showing 1 resource.");
  act(() => window.dispatchEvent(new Event("pagehide")));
  expect(screen.getByRole("status")).toHaveTextContent("Showing 9 resources.");
  fireEvent.click(screen.getByRole("button", { name: "Legal Aid" }));
  act(() => performQuickExit(() => {}));
  expect(screen.getByRole("status")).toHaveTextContent("Showing 9 resources.");
});
