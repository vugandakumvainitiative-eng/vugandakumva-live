import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
export function Footer({ isInnerPage = false }: { isInnerPage?: boolean }) {
  const { t } = useTranslation();
  return (
    <>
      {!isInnerPage && (
        <div className="container closing-line">
          <h2>{t("support.closing")}</h2>
        </div>
      )}
      <footer className="site-footer" id="contact">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a
              className="brand"
              href="/"
              aria-label={t("brand") + " — " + t("nav.home")}
            >
              <img
                className="brand-logo"
                src="/assets/logo-approved.webp"
                width="320"
                height="320"
                alt={t("brand")}
              />
            </a>
            <p>“{t("tagline")}”</p>
            <p>{t("footer.mission")}</p>
            <p>{t("footer.founded")}</p>
          </div>
          <nav aria-label={t("footer.quick")}>
            <h2>{t("footer.quick")}</h2>
            <a href="/">{t("nav.home")}</a>
            <a href="/about">{t("nav.about")}</a>
            <a href="/awareness">{t("nav.awareness")}</a>
            <a href="/resources">{t("nav.resources")}</a>
            <a href="/find-support">{t("nav.support")}</a>
            <a href="/contact">{t("nav.contact")}</a>
          </nav>
          <nav aria-label={t("footer.awareness")}>
            <h2>{t("footer.awareness")}</h2>
            <a href="/awareness#forms">{t("awarenessPage.forms")}</a>
            <a href="/awareness#signs">{t("footer.signs")}</a>
            <a href="/resources#resource-directory">{t("footer.hotlines")}</a>
            <a href="/awareness#prevention">{t("awarenessPage.prevention")}</a>
            <span>{t("footer.rights")}</span>
            <span>{t("footer.groups")}</span>
          </nav>
          <div className="footer-contact">
            <h2>{t("footer.contact")}</h2>
            <p>
              <MapPin size={18} aria-hidden="true" />
              {t("footer.location")}
            </p>
            <p>
              <Phone size={18} aria-hidden="true" />
              <span>
                {t("footer.phoneOne")}
                <br />
                {t("footer.phoneTwo")}
              </span>
            </p>
            <p>
              <Mail size={18} aria-hidden="true" />
              <span className="email">{t("footer.email")}</span>
            </p>
            <p className="contact-note">{t("footer.contactPending")}</p>
            <p className="contact-note">{t("footer.whatsapp")}</p>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>{t("footer.copyright")}</p>
          <p>
            {t("footer.credit")} <a href="#safety">{t("footer.privacy")}</a>
          </p>
        </div>
      </footer>
      <section
        className="safety-guidance container"
        id="safety"
        aria-labelledby="safety-title"
      >
        <ShieldCheck size={30} aria-hidden="true" />
        <div>
          <h2 id="safety-title">{t("safety.title")}</h2>
          <p>{t("exit.detail")}</p>
          <p className="preview-note">{t("footer.preview")}</p>
        </div>
      </section>
    </>
  );
}
