import {
  ArrowRight,
  FileText,
  HeartPulse,
  Info,
  Mail,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { ResourceCatalog } from "../features/resources/resource-catalog";

export function ResourcesPage() {
  const { t } = useTranslation();
  return (
    <main className="resources-page" id="main-content" tabIndex={-1}>
      <section className="resource-hero" aria-labelledby="resources-title">
        <div className="container resource-hero-inner">
          <div className="resource-hero-copy">
            <p className="eyebrow">{t("resourcesPage.eyebrow")}</p>
            <h1 id="resources-title">{t("resourcesPage.heading")}</h1>
            <p>{t("resourcesPage.intro")}</p>
          </div>
          <img
            className="resource-hero-art"
            src="/assets/resources-hero.webp"
            width={425}
            height={226}
            alt=""
            fetchPriority="high"
          />
        </div>
      </section>
      <aside
        className="resource-safety-strip"
        aria-label={t("resourcesPage.safetyLabel")}
      >
        <div className="container">
          <ShieldCheck size={28} aria-hidden="true" />
          <p>
            <strong>{t("resourcesPage.safetyTitle")}</strong>{" "}
            {t("resourcesPage.safetyBody")}{" "}
            <a href="#safety">{t("resourcesPage.safetyLink")}</a>
          </p>
        </div>
      </aside>
      <ResourceCatalog />
      <section
        className="resource-options"
        aria-labelledby="resource-options-title"
      >
        <div className="container">
          <div className="resource-section-heading">
            <p className="eyebrow">{t("resourcesPage.optionsEyebrow")}</p>
            <h2 id="resource-options-title">
              {t("resourcesPage.optionsTitle")}
            </h2>
            <p>{t("resourcesPage.optionsBody")}</p>
          </div>
          <ol className="resource-options-grid">
            {[
              { key: "safety", Icon: ShieldCheck },
              { key: "medical", Icon: HeartPulse },
              { key: "reporting", Icon: FileText },
              { key: "ongoing", Icon: UsersRound },
            ].map(({ key, Icon }, index) => (
              <li key={key} id={"resource-option-" + key}>
                <span className="resource-step" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <Icon size={32} strokeWidth={1.8} aria-hidden="true" />
                  <h3>{t("resourcesPage.option." + key)}</h3>
                  <p>{t("resourcesPage.option." + key + "Body")}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="resource-review">
            <Info size={18} aria-hidden="true" />
            {t("resourcesPage.review")}
          </p>
        </div>
      </section>
      <section
        className="resource-contact"
        aria-labelledby="resource-contact-title"
      >
        <img
          className="resource-leaves resource-leaves-left"
          src="/assets/resources-leaves-left.webp"
          alt=""
          width={115}
          height={118}
          loading="lazy"
          decoding="async"
        />
        <img
          className="resource-leaves resource-leaves-right"
          src="/assets/resources-leaves-right.webp"
          alt=""
          width={87}
          height={118}
          loading="lazy"
          decoding="async"
        />
        <div className="container resource-contact-inner">
          <div>
            <p className="eyebrow">{t("resourcesPage.contactEyebrow")}</p>
            <h2 id="resource-contact-title">
              {t("resourcesPage.contactTitle")}
            </h2>
            <p>{t("resourcesPage.contactBody")}</p>
          </div>
          <a className="button primary" href="#contact">
            <Mail size={19} aria-hidden="true" />
            {t("resourcesPage.contactLink")}
            <ArrowRight size={19} aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
