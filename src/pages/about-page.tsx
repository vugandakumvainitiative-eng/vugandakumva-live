import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Eye,
  Laptop,
  Star,
  Target,
  UsersRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const teamInitials = ["DN", "SN", "AM", "RG", "RI", "AN", "EI", "GU"];

export function AboutPage() {
  const { t } = useTranslation();
  return (
    <main id="main-content" className="about-page" tabIndex={-1}>
      <section
        className="about-hero container"
        aria-labelledby="about-page-title"
      >
        <div className="about-hero-copy">
          <nav
            className="breadcrumbs"
            aria-label={t("aboutPage.breadcrumbLabel")}
          >
            <a href="/">{t("nav.home")}</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{t("aboutPage.breadcrumb")}</span>
          </nav>
          <p className="eyebrow">{t("aboutPage.eyebrow")}</p>
          <h1 id="about-page-title">{t("aboutPage.heading")}</h1>
          <p className="about-lead">{t("aboutPage.intro")}</p>
          <p className="about-tagline">{t("tagline")}.</p>
          <div className="about-actions">
            <a className="button primary" href="#team">
              {t("aboutPage.teamLink")}
              <ArrowDown size={20} aria-hidden="true" />
            </a>
            <a className="button outline" href="#our-story">
              {t("aboutPage.storyLink")}
              <ArrowDown size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="about-hero-art" aria-hidden="true">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/assets/about-dialogue-small.webp"
            />
            <img
              src="/assets/about-dialogue.webp"
              width="800"
              height="800"
              alt=""
              fetchPriority="high"
            />
          </picture>
        </div>
      </section>

      <section className="about-purpose" aria-labelledby="purpose-title">
        <div className="container">
          <div className="about-heading">
            <p className="eyebrow">{t("aboutPage.purposeEyebrow")}</p>
            <h2 id="purpose-title">{t("aboutPage.purposeTitle")}</h2>
            <p>{t("aboutPage.purposeIntro")}</p>
          </div>
          <div className="about-purpose-grid">
            {[
              { key: "mission", Icon: Target },
              { key: "vision", Icon: Eye },
              { key: "values", Icon: Star },
            ].map(({ key, Icon }) => (
              <article key={key}>
                <Icon size={52} strokeWidth={1.5} aria-hidden="true" />
                <h3>{t("aboutPage." + key)}</h3>
                <p>{t("aboutPage." + key + "Body")}</p>
              </article>
            ))}
          </div>
          <p className="about-review">{t("aboutPage.organisationReview")}</p>
        </div>
      </section>

      <section
        className="about-story container"
        id="our-story"
        aria-labelledby="story-title"
        tabIndex={-1}
      >
        <div className="about-story-art" aria-hidden="true">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/assets/about-dialogue-small.webp"
            />
            <img
              src="/assets/about-dialogue.webp"
              width="800"
              height="800"
              loading="lazy"
              alt=""
            />
          </picture>
        </div>
        <div className="about-story-copy">
          <p className="eyebrow">{t("aboutPage.storyEyebrow")}</p>
          <h2 id="story-title">{t("aboutPage.storyTitle")}</h2>
          <p>{t("aboutPage.story1")}</p>
          <p>{t("aboutPage.story2")}</p>
          <p>{t("aboutPage.story3")}</p>
          <div className="about-programmes">
            {[
              { key: "education", Icon: BookOpen },
              { key: "community", Icon: UsersRound },
              { key: "digital", Icon: Laptop },
            ].map(({ key, Icon }) => (
              <div key={key}>
                <Icon size={32} strokeWidth={1.5} aria-hidden="true" />
                <h3>{t("aboutPage." + key)}</h3>
              </div>
            ))}
          </div>
          <p className="about-review">{t("aboutPage.programmeReview")}</p>
          <a className="button primary" href="#contact">
            {t("aboutPage.partner")}
            <ArrowRight size={20} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section
        className="about-team"
        id="team"
        aria-labelledby="team-title"
        tabIndex={-1}
      >
        <div className="container">
          <div className="about-heading">
            <p className="eyebrow">{t("aboutPage.teamEyebrow")}</p>
            <h2 id="team-title">{t("aboutPage.teamTitle")}</h2>
            <p>{t("aboutPage.teamIntro")}</p>
          </div>
          <div className="team-grid">
            {teamInitials.map((initials, i) => (
              <article className="team-card" key={initials}>
                <span className="team-initials" aria-hidden="true">
                  {initials}
                </span>
                <h3>{t(`aboutPage.team.${i}.name`)}</h3>
                <p>{t(`aboutPage.team.${i}.role`)}</p>
              </article>
            ))}
          </div>
          <p className="about-review">{t("aboutPage.portraitReview")}</p>
        </div>
      </section>

      <section className="about-cta" aria-labelledby="about-cta-title">
        <div className="container">
          <h2 id="about-cta-title">{t("aboutPage.ctaTitle")}</h2>
          <p>{t("aboutPage.ctaBody")}</p>
          <div className="about-actions">
            <a className="button primary" href="#contact">
              {t("aboutPage.involved")}
              <ArrowRight size={20} aria-hidden="true" />
            </a>
            <a className="button outline" href="/awareness">
              {t("aboutPage.awareness")}
              <ArrowRight size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
