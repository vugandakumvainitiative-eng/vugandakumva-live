import { renderToString } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { App } from "./app";
import { i18n } from "./lib/i18n";
import { en } from "./locales/en";
export const pageTitles = {
  contact: en["contactPage.title"],
  support: en["findSupport.title"],
  home: en["page.title"],
  about: en["aboutPage.title"],
  awareness: en["awarenessPage.title"],
  resources: en["resourcesPage.title"],
};
export function renderPage(path = "/"): string {
  return renderToString(
    <I18nextProvider i18n={i18n}>
      <App path={path} />
    </I18nextProvider>,
  );
}

export const renderHome = () => renderPage("/");
