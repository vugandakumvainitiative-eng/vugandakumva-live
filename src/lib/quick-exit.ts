import { useUiStore } from "../store/ui-store";
export const QUICK_EXIT_DESTINATION = "https://www.google.com/";
export const DOUBLE_ESCAPE_INTERVAL_MS = 1000;
const cleanups = new Set<() => void>();
export function registerExitCleanup(cleanup: () => void): () => void {
  cleanups.add(cleanup);
  return () => {
    cleanups.delete(cleanup);
  };
}
export function performQuickExit(
  replace: (url: string) => void = (url) => window.location.replace(url),
): void {
  try {
    useUiStore.getState().clear();
    for (const cleanup of cleanups) {
      try {
        cleanup();
      } catch {
        /* One failing cleanup must not delay leaving. */
      }
    }
  } finally {
    replace(QUICK_EXIT_DESTINATION);
  }
}
export function listenForQuickExit(
  exit: () => void = performQuickExit,
): () => void {
  let firstEscape: number | undefined;
  const reset = () => {
    firstEscape = undefined;
  };
  const keydown = (event: KeyboardEvent) => {
    if (event.repeat || event.isComposing) return;
    if (
      event.key !== "Escape" ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      reset();
      return;
    }
    const now = performance.now();
    if (
      firstEscape !== undefined &&
      now - firstEscape <= DOUBLE_ESCAPE_INTERVAL_MS
    ) {
      reset();
      event.preventDefault();
      exit();
    } else firstEscape = now;
  };
  document.addEventListener("keydown", keydown, true);
  window.addEventListener("blur", reset);
  document.addEventListener("visibilitychange", reset);
  return () => {
    document.removeEventListener("keydown", keydown, true);
    window.removeEventListener("blur", reset);
    document.removeEventListener("visibilitychange", reset);
  };
}
