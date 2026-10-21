import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
export function AwarenessSection() {
  const { t } = useTranslation();
  return (
    <section
      className="awareness-section section"
      id="awareness"
      aria-labelledby="awareness-title"
    >
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">{t("awareness.eyebrow")}</p>
          <h2 id="awareness-title">{t("awareness.title")}</h2>
          <p>{t("awareness.intro")}</p>
        </div>
        <div className="awareness-grid">
          {["physical", "psychological", "economic"].map((key) => (
            <article className="awareness-card" key={key}>
              <img
                src={"/assets/awareness-" + key + ".webp"}
                alt=""
                width="640"
                height="360"
                loading="lazy"
              />
              <div className="awareness-card-body">
                <p className="eyebrow">{t("awareness." + key + "Label")}</p>
                <h3>{t("awareness." + key)}</h3>
                <p>{t("awareness." + key + "Body")}</p>
                <details>
                  <summary>
                    <span className="disclosure-closed">
                      {t("awareness.more")}
                    </span>
                    <span className="disclosure-open">
                      {t("awareness.less")}
                    </span>
                    <ChevronDown size={19} aria-hidden="true" />
                  </summary>
                  <p>{t("awareness.detail")}</p>
                  <a href="#support" className="text-link">
                    {t("nav.support")}
                  </a>
                </details>
              </div>
            </article>
          ))}
        </div>
        <div className="awareness-bottom">
          <a href="/awareness#forms" className="button primary">
            {t("awareness.all")}
            <ArrowRight size={20} aria-hidden="true" />
          </a>
          <p>
            {t("awareness.note")}{" "}
            <a href="#support" className="text-link">
              {t("nav.support")}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
