import {
  ArrowRight,
  Coins,
  Heart,
  HeartPulse,
  Info,
  Landmark,
  MessageCircle,
  TriangleAlert,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const forms = ["physical", "psychological", "economic", "sexual"] as const;
const signs = [
  { key: "control", Icon: UsersRound },
  { key: "money", Icon: Coins },
  { key: "isolation", Icon: UserRound },
  { key: "fear", Icon: TriangleAlert },
  { key: "humiliation", Icon: MessageCircle },
  { key: "injuries", Icon: HeartPulse },
];

export function AwarenessPage() {
  const { t } = useTranslation();
  const text = (key: string) => t("awarenessPage." + key);
  return (
    <main id="main-content" className="awareness-page" tabIndex={-1}>
      <section className="learn-hero" aria-labelledby="learn-title">
        <div className="container learn-hero-inner">
          <div className="learn-hero-copy">
            <h1 id="learn-title">{text("heading")}</h1>
            <p className="learn-subtitle">{text("subtitle")}</p>
            <nav
              className="learn-breadcrumbs"
              aria-label={t("aboutPage.breadcrumbLabel")}
            >
              <a href="/">{t("nav.home")}</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{t("nav.awareness")}</span>
            </nav>
            <a href="/find-support" className="button learn-support">
              {text("support")}
              <ArrowRight size={20} aria-hidden="true" />
            </a>
          </div>
          <img
            className="learn-hero-art"
            src="/assets/learn-hero.webp"
            width="348"
            height="237"
            alt=""
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="learn-intro" aria-labelledby="learn-intro-title">
        <div className="container learn-intro-inner">
          <div>
            <p className="eyebrow">{text("eyebrow")}</p>
            <h2 id="learn-intro-title">{text("introTitle")}</h2>
            <p>{text("intro")}</p>
            <p className="learn-note">
              <Info aria-hidden="true" size={22} />
              {text("privacy")}
            </p>
          </div>
          <div className="learn-dialogue" aria-hidden="true">
            <img
              src="/assets/learn-intro.webp"
              width="332"
              height="198"
              alt=""
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section
        className="learn-forms container"
        id="forms"
        aria-labelledby="forms-title"
        tabIndex={-1}
      >
        <p className="eyebrow">{text("formsEyebrow")}</p>
        <h2 id="forms-title">{text("formsTitle")}</h2>
        <div className="learn-form-grid">
          {forms.map((key) => (
            <article
              className="learn-form"
              id={key}
              key={key}
              aria-labelledby={`${key}-title`}
            >
              <img
                src={`/assets/learn-${key}.webp`}
                width="151"
                height="169"
                alt=""
                loading="lazy"
              />
              <div>
                <h3 id={`${key}-title`}>{text(key)}</h3>
                <p>{text(key + "Body")}</p>
                <p className="learn-examples">
                  <strong>{text("examples")}</strong> {text(key + "Examples")}
                </p>
                <a href="/find-support" className="text-link">
                  {text("explore")}
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="learn-note">
          <Info size={24} aria-hidden="true" />
          {text("nonExhaustive")}
        </p>
      </section>

      <section
        className="learn-signs"
        id="signs"
        aria-labelledby="signs-title"
        tabIndex={-1}
      >
        <div className="container">
          <p className="eyebrow">{text("signsEyebrow")}</p>
          <h2 id="signs-title">{text("signsTitle")}</h2>
          <ul className="learn-sign-grid">
            {signs.map(({ key, Icon }) => (
              <li key={key}>
                <Icon size={48} strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <h3>{text(key)}</h3>
                  <p>{text(key + "Body")}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="learn-note">
            <Heart size={26} aria-hidden="true" />
            <span>
              <strong>{text("dignity")}</strong> {text("dignityBody")}
            </span>
          </p>
        </div>
      </section>

      <section
        className="learn-prevention container"
        id="prevention"
        aria-labelledby="prevention-title"
        tabIndex={-1}
      >
        <p className="eyebrow">{text("preventionEyebrow")}</p>
        <h2 id="prevention-title">{text("preventionTitle")}</h2>
        <div className="learn-prevention-grid">
          {[
            { key: "individuals", Icon: UserRound },
            { key: "communities", Icon: UsersRound },
            { key: "institutions", Icon: Landmark },
          ].map(({ key, Icon }) => (
            <article key={key}>
              <Icon size={48} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3>{text(key)}</h3>
                <p>{text(key + "Body")}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="learn-review">{text("review")}</p>
      </section>

      <section className="learn-cta" aria-labelledby="learn-cta-title">
        <img
          className="learn-leaves learn-leaves-left"
          src="/assets/learn-leaves-left.webp"
          alt=""
          width={135}
          height={114}
          loading="lazy"
          decoding="async"
        />
        <img
          className="learn-leaves learn-leaves-right"
          src="/assets/learn-leaves-right.webp"
          alt=""
          width={138}
          height={114}
          loading="lazy"
          decoding="async"
        />
        <div className="container">
          <h2 id="learn-cta-title">{text("ctaTitle")}</h2>
          <p>{text("ctaBody")}</p>
          <div className="learn-actions">
            <a className="button primary" href="/find-support">
              {t("nav.support")}
              <ArrowRight size={20} aria-hidden="true" />
            </a>
            <a className="button outline" href="/resources">
              {text("resources")}
              <ArrowRight size={20} aria-hidden="true" />
            </a>
          </div>
          <p className="learn-review">{text("resourceNote")}</p>
        </div>
      </section>
    </main>
  );
}
