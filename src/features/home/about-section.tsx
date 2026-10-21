import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
export function AboutSection() {
  const { t } = useTranslation();
  return (
    <section
      className="about-section section container"
      id="about"
      aria-labelledby="about-title"
    >
      <div className="about-art">
        <img
          src="/assets/about-dialogue.webp"
          alt=""
          width="800"
          height="800"
          loading="lazy"
        />
        <span className="art-caption caption-one">{t("about.heard")}</span>
        <span className="art-caption caption-two">
          {t("about.understanding")}
        </span>
        <span className="art-caption caption-three">
          {t("about.communityLabel")}
        </span>
      </div>
      <div className="about-copy">
        <p className="eyebrow">{t("about.eyebrow")}</p>
        <h2 id="about-title">{t("about.title")}</h2>
        <p>{t("about.body")}</p>
        <p>{t("about.purpose")}</p>
        <div className="purpose-grid">
          {["education", "advocacy", "community"].map((key) => (
            <div key={key}>
              <h3>{t("about." + key)}</h3>
              <p>{t("about." + key + "Body")}</p>
            </div>
          ))}
        </div>
        <a className="button primary" href="/about#our-story">
          {t("about.story")}
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
