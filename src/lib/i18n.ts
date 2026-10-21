import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "../locales/en";
import { rw } from "../locales/rw";
export const LANGUAGE_KEY = "vuga-language";
export const SAFETY_NOTICE_KEY = "vuga-safety-dismissed";
function initialLanguage(): string {
  try {
    return localStorage.getItem(LANGUAGE_KEY) === "rw" ? "rw" : "en";
  } catch {
    return "en";
  }
}
export const i18n = i18next.createInstance();
void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, rw: { translation: rw } },
  lng: initialLanguage(),
  fallbackLng: "en",
  keySeparator: false,
  interpolation: { escapeValue: false },
  initAsync: false,
});
i18n.on("languageChanged", (language) => {
  document.documentElement.lang = language === "rw" ? "rw" : "en";
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch {
    /* Memory still works. */
  }
});
