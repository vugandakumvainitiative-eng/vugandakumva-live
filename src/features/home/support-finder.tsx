import { useRef } from "react";
import {
  ArrowRight,
  HeartPulse,
  House,
  Info,
  MapPin,
  MessageCircle,
  RotateCcw,
  Scale,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUiStore } from "../../store/ui-store";
import { districts } from "../../lib/districts";
const services = [
  { key: "health", Icon: HeartPulse },
  { key: "counselling", Icon: MessageCircle },
  { key: "legal", Icon: Scale },
  { key: "shelter", Icon: House },
];
export function SupportFinder() {
  const { t } = useTranslation();
  const state = useUiStore();
  const result = useRef<HTMLDivElement>(null);
  return (
    <section
      className="support-section section container"
      id="support"
      aria-labelledby="support-title"
    >
      <div className="support-copy">
        <p className="eyebrow">{t("support.eyebrow")}</p>
        <h2 id="support-title">
          {t("support.title")
            .split("\n")
            .map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
        </h2>
        <p>{t("support.body")}</p>
        <p className="privacy-line">
          <Info aria-hidden="true" />
          {t("support.privacy")}
        </p>
        <a href="#safety" className="text-link">
          {t("safety")}
          <ArrowRight size={19} aria-hidden="true" />
        </a>
      </div>
      <form
        className="support-form"
        onSubmit={(event) => {
          event.preventDefault();
          state.showResult();
          requestAnimationFrame(() => result.current?.focus());
        }}
      >
        <h3>{t("support.formTitle")}</h3>
        <p>{t("support.formBody")}</p>
        <label htmlFor="district">{t("support.district")}</label>
        <div className="select-wrap">
          <MapPin size={21} aria-hidden="true" />
          <select
            id="district"
            value={state.district}
            onChange={(event) => state.setDistrict(event.target.value)}
          >
            <option value="">{t("support.choose")}</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        <fieldset>
          <legend>{t("support.type")}</legend>
          <div className="filter-top">
            <label className="all-service">
              <input
                type="radio"
                name="service"
                value="all"
                checked={state.service === "all"}
                onChange={() => state.setService("all")}
              />
              {t("support.allTypes")}
            </label>
            <button
              className="reset-button"
              type="button"
              onClick={state.resetFilters}
            >
              <RotateCcw size={16} aria-hidden="true" />
              {t("support.reset")}
            </button>
          </div>
          <div className="service-grid">
            {services.map(({ key, Icon }) => (
              <label
                className={
                  "service-option" +
                  (state.service === key ? " is-selected" : "")
                }
                key={key}
              >
                <Icon size={30} strokeWidth={1.5} aria-hidden="true" />
                <span>
                  <strong>{t("support." + key)}</strong>
                  <small>{t("support." + key + "Body")}</small>
                </span>
                <input
                  type="radio"
                  name="service"
                  value={key}
                  checked={state.service === key}
                  onChange={() => state.setService(key)}
                />
              </label>
            ))}
          </div>
        </fieldset>
        <button className="button primary browse-button" type="submit">
          {t("browse")}
          <ArrowRight size={20} aria-hidden="true" />
        </button>
        <p className="directory-note">
          <Info size={19} aria-hidden="true" />
          {t("support.pending")}
        </p>
        {state.resultVisible && (
          <div
            className="directory-result"
            role="status"
            ref={result}
            tabIndex={-1}
          >
            <h4>{t("support.resultTitle")}</h4>
            <p>
              {t("support.resultBody", {
                district: state.district || t("support.allDistricts"),
                type: t(
                  state.service === "all"
                    ? "support.allTypes"
                    : "support." + state.service,
                ),
              })}
            </p>
          </div>
        )}
      </form>
    </section>
  );
}
