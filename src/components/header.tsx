import { useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUiStore } from "../store/ui-store";
export function Header({
  activePage = "home",
}: {
  activePage?:
    "home" | "about" | "awareness" | "resources" | "support" | "contact";
}) {
  const { t, i18n } = useTranslation();
  const open = useUiStore((state) => state.menuOpen);
  const setMenu = useUiStore((state) => state.setMenu);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const media = matchMedia("(min-width: 1100px)");
    const close = () => {
      if (media.matches) setMenu(false);
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, [setMenu]);
  const links = [
    ["home", "/"],
    ["about", "/about"],
    ["awareness", "/awareness"],
    ["resources", "/resources"],
    ["contact", "/contact"],
    ["support", "/find-support"],
  ] as const;
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setMenu(false);
          trigger.current?.focus();
        }
      }}
    >
      <div className="container header-inner">
        <a
          className="brand"
          href="/"
          onClick={() => setMenu(false)}
          aria-label={t("brand") + " — " + t("nav.home")}
        >
          <img
            className="brand-logo"
            src="/assets/logo-approved.webp"
            alt={t("brand")}
            width="320"
            height="320"
          />
        </a>
        <button
          className="icon-button menu-toggle"
          ref={trigger}
          aria-label={t(open ? "nav.close" : "nav.menu")}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setMenu(!open)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav
          id="main-nav"
          className={"main-nav" + (open ? " is-open" : "")}
          aria-label={t("nav.label")}
        >
          {links.map(([key, id]) => (
            <a
              key={key}
              href={id}
              onClick={() => setMenu(false)}
              aria-current={key === activePage ? "page" : undefined}
            >
              {t("nav." + key)}
            </a>
          ))}
          <span
            className="unavailable-nav"
            aria-disabled="true"
            title={t("nav.donatePending")}
          >
            {t("nav.donate")}
            <small>{t("nav.unavailable")}</small>
            <span className="sr-only"> — {t("nav.donatePending")}</span>
          </span>
          <div className="languages" role="group" aria-label={t("language")}>
            {(["en", "rw"] as const).map((language) => (
              <button
                key={language}
                aria-pressed={i18n.language === language}
                onClick={() => void i18n.changeLanguage(language)}
              >
                {t("language." + language)}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
