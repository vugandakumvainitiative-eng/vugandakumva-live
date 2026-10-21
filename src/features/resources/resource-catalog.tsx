import { useEffect, useState, useSyncExternalStore } from "react";
import {
  BookOpen,
  Check,
  FileText,
  Heart,
  House,
  Info,
  MessageCircle,
  Phone,
  Scale,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { registerExitCleanup } from "../../lib/quick-exit";

const categories = [
  "all",
  "hotlines",
  "legal",
  "shelters",
  "mental",
  "education",
] as const;
type Category = (typeof categories)[number];
const resources = [
  { key: "hotline", categories: ["hotlines"], Icon: Phone },
  { key: "whatsapp", categories: ["hotlines"], Icon: MessageCircle },
  { key: "legalAid", categories: ["legal"], Icon: Scale },
  { key: "rights", categories: ["legal"], Icon: FileText },
  { key: "shelters", categories: ["shelters"], Icon: House },
  { key: "child", categories: ["hotlines", "shelters"], Icon: ShieldCheck },
  { key: "counseling", categories: ["mental"], Icon: Heart },
  { key: "groups", categories: ["mental"], Icon: UsersRound },
  { key: "materials", categories: ["education"], Icon: BookOpen },
] as const;
// The static document keeps filters disabled until React has hydrated them.
const subscribeToClient = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function ResourceCatalog({
  items = resources,
}: {
  items?: readonly (typeof resources)[number][];
}) {
  const { t } = useTranslation();
  const [category, setCategory] = useState<Category>("all");
  const interactive = useSyncExternalStore(
    subscribeToClient,
    clientSnapshot,
    serverSnapshot,
  );
  useEffect(() => {
    const reset = () => setCategory("all");
    window.addEventListener("pagehide", reset);
    const unregister = registerExitCleanup(reset);
    return () => {
      window.removeEventListener("pagehide", reset);
      unregister();
    };
  }, []);
  const visible = items.filter(
    (item) =>
      category === "all" ||
      (item.categories as readonly string[]).includes(category),
  );
  return (
    <section
      className="resource-directory container"
      id="resource-directory"
      aria-labelledby="resource-directory-title"
      tabIndex={-1}
    >
      <div className="resource-section-heading">
        <p className="eyebrow">{t("resourcesPage.servicesEyebrow")}</p>
        <h2 id="resource-directory-title">
          {t("resourcesPage.servicesTitle")}
        </h2>
        <p>{t("resourcesPage.servicesBody")}</p>
      </div>
      <div
        className="resource-filters"
        role="group"
        aria-label={t("resourcesPage.filterLabel")}
      >
        {categories.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={category === value}
            aria-controls="resource-results"
            disabled={!interactive}
            onClick={() => setCategory(value)}
          >
            <Check size={17} aria-hidden="true" />
            {t("resourcesPage.category." + value)}
          </button>
        ))}
      </div>
      <noscript>
        <p className="resource-no-js">{t("resourcesPage.noJs")}</p>
      </noscript>
      <p
        className="resource-result-count"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {t("resourcesPage.resultCount", { count: visible.length })}
      </p>
      <div id="resource-results" className="resource-grid">
        {visible.map(({ key, Icon }) => (
          <article
            className="resource-card"
            key={key}
            aria-labelledby={"resource-" + key}
          >
            <div className="resource-card-heading">
              <span className="resource-icon">
                <Icon size={30} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div>
                <h3 id={"resource-" + key}>{t("resourcesPage.item." + key)}</h3>
                <p>{t("resourcesPage.item." + key + "Body")}</p>
              </div>
            </div>
            <button
              className="resource-pending"
              type="button"
              disabled
              aria-describedby={"resource-" + key}
            >
              <Info size={18} aria-hidden="true" />
              <span>{t("resourcesPage.pending")}</span>
            </button>
          </article>
        ))}
        {visible.length === 0 && (
          <div className="resource-empty">
            <Info size={28} aria-hidden="true" />
            <h3>{t("resourcesPage.emptyTitle")}</h3>
            <p>{t("resourcesPage.emptyBody")}</p>
            <button
              className="button outline"
              type="button"
              onClick={() => setCategory("all")}
            >
              {t("resourcesPage.category.all")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
