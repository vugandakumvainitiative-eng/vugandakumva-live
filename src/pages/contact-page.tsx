import {
  ArrowDown,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Info,
  LifeBuoy,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
export function ContactPage() {
  const { t } = useTranslation();
  const [emailName, emailDomain] = t("footer.email").split("@");
  return (
    <main id="main-content" className="contact-page" tabIndex={-1}>
      <section className="contact-hero" aria-labelledby="contact-title">
        <div className="container contact-hero-grid">
          <div>
            <nav
              className="breadcrumbs"
              aria-label={t("aboutPage.breadcrumbLabel")}
            >
              <a href="/">{t("nav.home")}</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{t("nav.contact")}</span>
            </nav>
            <p className="eyebrow">{t("contactPage.eyebrow")}</p>
            <h1 id="contact-title">{t("contactPage.heading")}</h1>
            <p className="contact-lead">{t("contactPage.intro")}</p>
            <div className="contact-actions">
              <a className="button primary" href="#contact-details">
                {t("contactPage.detailsLink")}
                <ArrowDown size={20} aria-hidden="true" />
              </a>
              <a className="button outline" href="/find-support">
                {t("nav.support")}
                <ArrowRight size={20} aria-hidden="true" />
              </a>
            </div>
          </div>
          <img
            className="contact-hero-art"
            src="/assets/contact-hero.webp"
            width="370"
            height="288"
            alt=""
            fetchPriority="high"
          />
        </div>
      </section>
      <section
        id="contact-details"
        className="container contact-section"
        aria-labelledby="contact-details-title"
      >
        <div className="contact-section-heading">
          <p className="eyebrow">{t("contactPage.information")}</p>
          <h2 id="contact-details-title">{t("contactPage.details")}</h2>
          <p>{t("contactPage.pending")}</p>
        </div>
        <div className="contact-details-grid">
          <article className="contact-detail">
            <span className="contact-icon">
              <Mail aria-hidden="true" />
            </span>
            <div>
              <h3>{t("contactPage.email")}</h3>
              <a href="mailto:vugandakumvainitiative@gmail.com">
                <span>
                  {emailName}
                  <wbr />@{emailDomain}
                </span>
              </a>
            </div>
          </article>
          <article className="contact-detail">
            <span className="contact-icon">
              <Phone aria-hidden="true" />
            </span>
            <div>
              <h3>{t("contactPage.phone")}</h3>
              <a href="tel:+250781640246">{t("footer.phoneOne")}</a>
              <a href="tel:+250791274264">{t("footer.phoneTwo")}</a>
            </div>
          </article>
          <article className="contact-detail">
            <span className="contact-icon">
              <MapPin aria-hidden="true" />
            </span>
            <div>
              <h3>{t("contactPage.location")}</h3>
              <p>{t("footer.location")}</p>
            </div>
          </article>
          <article className="contact-detail">
            <span className="contact-icon">
              <MessageCircle aria-hidden="true" />
            </span>
            <div>
              <h3>{t("contactPage.whatsapp")}</h3>
              <p>{t("footer.phoneOne")}</p>
              <p className="contact-muted">{t("contactPage.unavailable")}</p>
            </div>
          </article>
        </div>
        <aside className="contact-notice">
          <Info aria-hidden="true" />
          <div>
            <strong>{t("contactPage.online")}</strong>
            <p>{t("contactPage.onlineBody")}</p>
          </div>
        </aside>
      </section>
      <section className="contact-help" aria-labelledby="contact-help-title">
        <div className="container contact-help-inner">
          <LifeBuoy size={54} aria-hidden="true" />
          <div>
            <p className="eyebrow">{t("contactPage.urgent")}</p>
            <h2 id="contact-help-title">{t("contactPage.urgentBody")}</h2>
          </div>
          <a className="button primary" href="/find-support">
            {t("nav.support")}
            <ArrowRight size={20} aria-hidden="true" />
          </a>
        </div>
      </section>
      <section
        className="container contact-section"
        aria-labelledby="contact-connect-title"
      >
        <div className="contact-section-heading">
          <p className="eyebrow">{t("contactPage.involved")}</p>
          <h2 id="contact-connect-title">{t("contactPage.connect")}</h2>
          <p>{t("contactPage.connectBody")}</p>
        </div>
        <div className="contact-connect-grid">
          {(["volunteer", "partnership", "awareness"] as const).map((key) => (
            <article className="contact-connect-card" key={key}>
              <img
                src={`/assets/contact-${key}.webp`}
                width="198"
                height="112"
                alt=""
                loading="lazy"
              />
              <h3>{t(`contactPage.${key}`)}</h3>
              <p>{t(`contactPage.${key}Body`)}</p>
              <a href={key === "awareness" ? "/awareness" : "#contact-details"}>
                {t(
                  key === "awareness"
                    ? "contactPage.awarenessLink"
                    : "contactPage.detailsLink",
                )}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
        <aside className="contact-notice contact-privacy">
          <ShieldCheck size={44} aria-hidden="true" />
          <div>
            <h3>{t("contactPage.privacy")}</h3>
            <p>{t("contactPage.privacyBody")}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
