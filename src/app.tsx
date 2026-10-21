import { ContactPage } from "./pages/contact-page";
import { useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { EmergencyBar } from "./components/emergency-bar";
import { Header } from "./components/header";
import { SafetyNotice } from "./components/safety-notice";
import { Footer } from "./components/footer";
import { AwarenessPage } from "./pages/awareness-page";
import { AboutPage } from "./pages/about-page";
import { ResourcesPage } from "./pages/resources-page";
import { FindSupportPage } from "./pages/find-support-page";
import { HomePage } from "./pages/home-page";
import { listenForQuickExit } from "./lib/quick-exit";
import { LANGUAGE_KEY, SAFETY_NOTICE_KEY } from "./lib/i18n";
import { useUiStore } from "./store/ui-store";
export function App({ path = "/" }: { path?: string }) {
  const isContact = /^\/contact\/?$/.test(path);
  const isSupport = /^\/find-support\/?$/.test(path);
  const isAbout = /^\/about\/?$/.test(path);
  const isAwareness = /^\/awareness\/?$/.test(path);
  const isResources = /^\/resources\/?$/.test(path);
  const activePage = isContact
    ? "contact"
    : isSupport
      ? "support"
      : isAbout
        ? "about"
        : isAwareness
          ? "awareness"
          : isResources
            ? "resources"
            : "home";
  const { t, i18n } = useTranslation();
  useEffect(() => listenForQuickExit(), []);
  useEffect(() => {
    // Native Back/Forward may restore an older document from the browser cache.
    const restorePreferences = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      try {
        const language =
          localStorage.getItem(LANGUAGE_KEY) === "rw" ? "rw" : "en";
        if (i18n.language !== language) void i18n.changeLanguage(language);
        useUiStore.setState({
          safetyDismissed: sessionStorage.getItem(SAFETY_NOTICE_KEY) === "true",
        });
      } catch {
        // Optional storage must never block the page or its safety controls.
      }
    };
    const clearTemporaryChoices = () => {
      useUiStore.getState().resetFilters();
      useUiStore.getState().setMenu(false);
    };
    window.addEventListener("pageshow", restorePreferences);
    window.addEventListener("pagehide", clearTemporaryChoices);
    return () => {
      window.removeEventListener("pageshow", restorePreferences);
      window.removeEventListener("pagehide", clearTemporaryChoices);
    };
  }, [i18n]);
  // Replace the static fallback before the first app paint to avoid shifting the page.
  useLayoutEffect(() => {
    document.title = t(
      isContact
        ? "contactPage.title"
        : isSupport
          ? "findSupport.title"
          : isAbout
            ? "aboutPage.title"
            : isAwareness
              ? "awarenessPage.title"
              : isResources
                ? "resourcesPage.title"
                : "page.title",
    );
    document.documentElement.lang = i18n.language;
    document.documentElement.dataset.ready = "true";
  }, [
    t,
    i18n.language,
    isAbout,
    isAwareness,
    isResources,
    isSupport,
    isContact,
  ]);
  return (
    <div lang="en" id="home">
      <a className="skip-link" href="#main-content">
        {t("skip")}
      </a>
      <EmergencyBar />
      <Header activePage={activePage} />
      <SafetyNotice />
      {isContact ? (
        <ContactPage />
      ) : isSupport ? (
        <FindSupportPage />
      ) : isAbout ? (
        <AboutPage />
      ) : isAwareness ? (
        <AwarenessPage />
      ) : isResources ? (
        <ResourcesPage />
      ) : (
        <HomePage />
      )}
      <Footer
        isInnerPage={
          isContact || isAbout || isAwareness || isResources || isSupport
        }
      />
    </div>
  );
}
