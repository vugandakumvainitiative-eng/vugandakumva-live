import { afterEach, expect, it, vi } from "vitest";
import { useUiStore } from "./ui-store";
afterEach(() => {
  vi.restoreAllMocks();
  useUiStore.getState().clear();
});
it("resets a shown directory state when filters change", () => {
  const store = useUiStore.getState();
  store.showResult();
  store.setDistrict("Huye");
  expect(useUiStore.getState().resultVisible).toBe(false);
  store.setService("legal");
  store.showResult();
  store.resetFilters();
  expect(useUiStore.getState()).toMatchObject({
    district: "",
    service: "all",
    resultVisible: false,
  });
});
it("remains usable with denied browser storage", () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("denied");
  });
  vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
    throw new Error("denied");
  });
  expect(() => useUiStore.getState().dismissSafety()).not.toThrow();
  expect(useUiStore.getState().safetyDismissed).toBe(true);
  expect(() => useUiStore.getState().clear()).not.toThrow();
});
