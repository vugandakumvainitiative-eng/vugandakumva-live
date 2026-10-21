import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  UsersRound,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { registerExitCleanup } from "../../lib/quick-exit";
export function HeroCarousel() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const [onScreen, setOnScreen] = useState(true);
  const [reduced, setReduced] = useState(false);
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setReduced(media.matches);
    motion();
    const visibility = () => setVisible(!document.hidden);
    media.addEventListener("change", motion);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0.25 },
    );
    if (section.current) observer.observe(section.current);
    const remove = registerExitCleanup(() => {
      setPlaying(false);
      setIndex(0);
    });
    return () => {
      media.removeEventListener("change", motion);
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
      remove();
    };
  }, []);
  const advancing = playing && !hovered && visible && onScreen && !reduced;
  useEffect(() => {
    if (!advancing) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % 5),
      7000,
    );
    return () => window.clearInterval(timer);
  }, [advancing]);
  const go = (next: number) => {
    setPlaying(false);
    setIndex((next + 5) % 5);
  };
  const shortcuts = [
    {
      Icon: UsersRound,
      title: "nav.support",
      body: "shortcut.support",
      link: "browse",
      href: "#support",
    },
    {
      Icon: BookOpen,
      title: "learn",
      body: "shortcut.learn",
      link: "explore",
      href: "#awareness",
    },
    {
      Icon: ShieldCheck,
      title: "safety",
      body: "shortcut.safety",
      link: "guidance",
      href: "#safety",
    },
  ];
  return (
    <section
      ref={section}
      className="hero-section"
      aria-label={t("hero.label")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPlaying(false);
      }}
      onTouchStart={() => setPlaying(false)}
    >
      <div className="hero-main">
        <div className="hero-copy">
          <p className="eyebrow">{t("hero.eyebrow")}</p>
          <h1>
            {t("hero.title." + index)
              .split("\n")
              .map((line, i) => (
                <span key={line}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
          </h1>
          <p className="hero-description">{t("hero.body." + index)}</p>
          <div className="hero-actions">
            <a className="button primary" href="#support">
              {t("nav.support")}
              <ArrowRight aria-hidden="true" />
            </a>
            <a className="button outline" href="#awareness">
              {t("learn")}
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
          <div className="carousel-controls">
            <span className="slide-count">
              {String(index + 1).padStart(2, "0")} / 05
            </span>
            <span className="topic">{t("hero.topic." + index)}</span>
            <div className="topic-dots">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  className={i === index ? "selected" : ""}
                  aria-label={t("hero.slide", {
                    number: i + 1,
                    topic: t("hero.topic." + i),
                  })}
                  aria-pressed={i === index}
                  onClick={() => go(i)}
                >
                  <span />
                </button>
              ))}
            </div>
            <div className="carousel-arrows">
              <button
                className="icon-button"
                aria-label={t("hero.previous")}
                onClick={() => go(index - 1)}
              >
                <ArrowLeft size={19} aria-hidden="true" />
              </button>
              <button
                className="icon-button"
                aria-label={t(playing ? "hero.pause" : "hero.play")}
                onClick={() => setPlaying((current) => !current)}
                disabled={reduced}
                title={reduced ? t("hero.reduced") : undefined}
              >
                {playing && !reduced ? (
                  <Pause size={18} aria-hidden="true" />
                ) : (
                  <Play size={18} aria-hidden="true" />
                )}
              </button>
              <button
                className="icon-button"
                aria-label={t("hero.next")}
                onClick={() => go(index + 1)}
              >
                <ArrowRight size={19} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/assets/hero-courtyard-small.webp"
            />
            <img
              src="/assets/hero-courtyard.webp"
              srcSet="/assets/hero-courtyard-small.webp 600w, /assets/hero-courtyard-medium.webp 800w, /assets/hero-courtyard.webp 1100w"
              sizes="(max-width: 767px) 100vw, 50vw"
              alt=""
              width="1100"
              height="917"
              fetchPriority="low"
            />
          </picture>
        </div>
      </div>
      <div className="container shortcut-grid">
        {shortcuts.map(({ Icon, title, body, link, href }) => (
          <article className="shortcut" key={title}>
            <Icon size={36} strokeWidth={1.6} aria-hidden="true" />
            <div>
              <h2>{t(title)}</h2>
              <p>{t(body)}</p>
              <a className="text-link" href={href}>
                {t(link)}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
