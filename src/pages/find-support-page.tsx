import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  MessageCircle,
  Scale,
  Baby,
  UsersRound,
  Info,
  Phone,
  Check,
  ChevronRight,
  HandHeart,
  CircleHelp,
  LockKeyhole,
  Wallet,
} from "lucide-react";
import { EMERGENCY_NUMBERS } from "../lib/emergency-contacts";
const categories = [
  { key: "safety", Icon: ShieldCheck, href: "#urgent-help" },
  {
    key: "medical",
    Icon: HeartPulse,
    href: "/resources#resource-option-medical",
  },
  {
    key: "emotional",
    Icon: MessageCircle,
    href: "/resources#resource-counseling",
  },
  { key: "legal", Icon: Scale, href: "/resources#resource-rights" },
  { key: "child", Icon: Baby, href: "/resources#resource-child" },
  { key: "someone", Icon: UsersRound, href: "#supporting-others" },
];
function Leaves() {
  return (
    <>
      <img
        className="fs-leaf fs-leaf-left"
        src="/assets/resources-leaves-left.webp"
        width="115"
        height="118"
        alt=""
        loading="lazy"
      />
      <img
        className="fs-leaf fs-leaf-right"
        src="/assets/resources-leaves-right.webp"
        width="87"
        height="118"
        alt=""
        loading="lazy"
      />
    </>
  );
}
export function FindSupportPage() {
  const { t } = useTranslation();
  const text = (key: string) => t("findSupport." + key);
  return (
    <main id="main-content" tabIndex={-1} className="find-support-page">
      <section className="fs-hero" aria-labelledby="find-support-title">
        <div className="fs-wrap fs-hero-grid">
          <div>
            <p className="eyebrow">{text("eyebrow")}</p>
            <h1 id="find-support-title">{text("hero")}</h1>
            <p className="fs-intro">{text("intro")}</p>
            <div className="fs-actions">
              <a href="#support-options" className="button primary">
                {text("viewOptions")}
                <ArrowRight aria-hidden="true" size={19} />
              </a>
              <a href="#urgent-help" className="button outline">
                {text("viewEmergency")}
                <ArrowRight aria-hidden="true" size={19} />
              </a>
            </div>
          </div>
          <img
            className="fs-hero-art"
            src="/assets/learn-intro.webp"
            width="332"
            height="198"
            alt=""
            fetchPriority="high"
          />
        </div>
      </section>
      <section
        className="fs-urgent"
        id="urgent-help"
        aria-labelledby="urgent-title"
      >
        <div className="fs-wrap">
          <div className="fs-urgent-heading">
            <ShieldCheck aria-hidden="true" size={30} />
            <div>
              <h2 id="urgent-title">{text("urgent")}</h2>
              <p>{text("urgentBody")}</p>
            </div>
          </div>
          <div className="fs-phone-grid">
            {EMERGENCY_NUMBERS.map((number) => (
              <a
                key={number}
                href={"tel:" + number}
                aria-label={t("call", { number })}
              >
                <Phone aria-hidden="true" size={23} />
                <span>
                  <strong>{t("findSupport.phone", { number })}</strong>
                  <small>{text("numberReview")}</small>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section
        className="fs-options"
        id="support-options"
        aria-labelledby="options-title"
      >
        <div className="fs-wrap">
          <div className="fs-heading">
            <p className="eyebrow">{text("optionsEyebrow")}</p>
            <h2 id="options-title">{text("options")}</h2>
            <p>{text("optionsBody")}</p>
          </div>
          <div className="fs-category-grid">
            {categories.map(({ key, Icon, href }) => (
              <article className="fs-category" key={key}>
                <Icon size={40} strokeWidth={1.6} aria-hidden="true" />
                <h3>{text(key)}</h3>
                <p>{text(key + "Body")}</p>
                <a className="text-link" href={href}>
                  {text(key + "Link")}
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="fs-expect" aria-labelledby="expect-title">
        <div className="fs-wrap">
          <div className="fs-heading">
            <p className="eyebrow">{text("expectEyebrow")}</p>
            <h2 id="expect-title">{text("expect")}</h2>
            <p>{text("expectBody")}</p>
          </div>
          <ul className="fs-expect-grid">
            {[CircleHelp, LockKeyhole, Wallet, HandHeart].map((Icon, index) => (
              <li key={index}>
                <Icon size={28} aria-hidden="true" />
                <h3>{text("expect" + (index + 1))}</h3>
                <p>{text("expect" + (index + 1) + "Body")}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section
        className="fs-directory fs-wrap"
        id="support-services"
        aria-labelledby="directory-title"
      >
        <Leaves />
        <div className="fs-directory-copy">
          <p className="eyebrow">{text("directoryEyebrow")}</p>
          <h2 id="directory-title">{text("directory")}</h2>
          <p className="fs-directory-status">
            <Info size={21} aria-hidden="true" />
            {text("directoryStatus")}
          </p>
          <p>{text("directoryBody")}</p>
          <a href="#urgent-help" className="button primary">
            {text("viewEmergency")}
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>
      <section
        className="fs-help"
        id="supporting-others"
        aria-labelledby="help-title"
      >
        <div className="fs-wrap fs-help-grid">
          <img
            src="/assets/about-dialogue-small.webp"
            width="600"
            height="600"
            alt=""
            loading="lazy"
          />
          <div>
            <p className="eyebrow">{text("helpEyebrow")}</p>
            <h2 id="help-title">{text("help")}</h2>
            <ul>
              {[1, 2, 3, 4].map((n) => (
                <li key={n}>
                  <Check size={19} aria-hidden="true" />
                  <span>{text("help" + n)}</span>
                </li>
              ))}
            </ul>
            <a className="text-link" href="/awareness#prevention">
              {text("helpLink")}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
      <section className="fs-faq" aria-labelledby="faq-title">
        <div className="fs-wrap">
          <div className="fs-heading">
            <p className="eyebrow">{text("faqEyebrow")}</p>
            <h2 id="faq-title">{text("faq")}</h2>
          </div>
          {[1, 2, 3, 4].map((n) => (
            <details key={n} open={n === 1}>
              <summary>
                <ChevronRight size={22} aria-hidden="true" />
                <span>{text("faq" + n)}</span>
              </summary>
              <p>{text("answer" + n)}</p>
            </details>
          ))}
          <p className="fs-review">{text("review")}</p>
        </div>
      </section>
      <section className="fs-closing" aria-labelledby="closing-title">
        <Leaves />
        <div className="fs-wrap">
          <h2 id="closing-title">{text("closing")}</h2>
          <p>{text("closingBody")}</p>
          <a href="/resources" className="button primary">
            {text("resourcesLink")}
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
