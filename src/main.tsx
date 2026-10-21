import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { App } from "./app";
import { i18n } from "./lib/i18n";
import { useUiStore } from "./store/ui-store";
import "./styles.css";
// Production gets route-specific styles from its build-time HTML snapshot.
if (import.meta.env.DEV && /^\/about\/?$/.test(window.location.pathname)) {
  void import("./about.css");
}
if (import.meta.env.DEV && /^\/awareness\/?$/.test(window.location.pathname)) {
  void import("./awareness.css");
}
if (import.meta.env.DEV && /^\/resources\/?$/.test(window.location.pathname)) {
  void import("./resources.css");
}
if (
  import.meta.env.DEV &&
  /^\/find-support\/?$/.test(window.location.pathname)
) {
  void import("./find-support.css");
}
const root = document.getElementById("root");
const app = (
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <App path={window.location.pathname} />
    </I18nextProvider>
  </StrictMode>
);
if (root) {
  // The static snapshot uses default preferences; returning visitors may differ.
  if (
    root.hasChildNodes() &&
    i18n.language === "en" &&
    !useUiStore.getState().safetyDismissed
  ) {
    hydrateRoot(root, app);
  } else {
    createRoot(root).render(app);
  }
}

if (import.meta.env.DEV && /^\/contact\/?$/.test(window.location.pathname)) {
  void import("./contact.css");
}
