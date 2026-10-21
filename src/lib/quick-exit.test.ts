import { afterEach, describe, expect, it, vi } from "vitest";
import {
  listenForQuickExit,
  performQuickExit,
  registerExitCleanup,
} from "./quick-exit";
import { useUiStore } from "../store/ui-store";
import { LANGUAGE_KEY, SAFETY_NOTICE_KEY } from "./i18n";
afterEach(() => {
  useUiStore.getState().clear();
  vi.restoreAllMocks();
});
describe("Quick Exit", () => {
  it("clears owned ephemeral selections and notice while retaining language, then replaces", () => {
    localStorage.setItem(LANGUAGE_KEY, "en");
    useUiStore.getState().setDistrict("Gasabo");
    useUiStore.getState().setService("health");
    useUiStore.getState().setMenu(true);
    useUiStore.getState().dismissSafety();
    const replace = vi.fn();
    performQuickExit(replace);
    expect(useUiStore.getState()).toMatchObject({
      district: "",
      service: "all",
      menuOpen: false,
      resultVisible: false,
    });
    expect(sessionStorage.getItem(SAFETY_NOTICE_KEY)).toBeNull();
    expect(localStorage.getItem(LANGUAGE_KEY)).toBe("en");
    expect(replace).toHaveBeenCalledWith("https://www.google.com/");
  });
  it("leaves even when a registered cleanup fails", () => {
    const unregister = registerExitCleanup(() => {
      throw new Error("synthetic");
    });
    const replace = vi.fn();
    performQuickExit(replace);
    unregister();
    expect(replace).toHaveBeenCalledOnce();
  });
  it("requires two distinct unmodified Escape presses and resets on another key", () => {
    const exit = vi.fn();
    const stop = listenForQuickExit(exit);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", repeat: true }),
    );
    expect(exit).not.toHaveBeenCalled();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "x" }));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(exit).not.toHaveBeenCalled();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(exit).toHaveBeenCalledOnce();
    stop();
  });
  it("does not pair presses across focus loss", () => {
    const exit = vi.fn();
    const stop = listenForQuickExit(exit);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    window.dispatchEvent(new Event("blur"));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(exit).not.toHaveBeenCalled();
    stop();
  });
});
