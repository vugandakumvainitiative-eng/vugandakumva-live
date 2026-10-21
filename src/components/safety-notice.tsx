import { Info, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUiStore } from "../store/ui-store";
export function SafetyNotice() {
  const { t, i18n } = useTranslation();
  const dismissed = useUiStore((state) => state.safetyDismissed);
  const dismiss = useUiStore((state) => state.dismissSafety);
  return (
    <div className="notice-wrap">
      {i18n.language === "rw" && (
        <p className="language-notice" role="status">
          {t("language.pending")}
        </p>
      )}
      {!dismissed && (
        <div className="container safety-notice">
          <Info size={17} aria-hidden="true" />
          <p>
            {t("preview")} <a href="#safety">{t("safety.show")}</a>
          </p>
          <button
            className="icon-button"
            onClick={dismiss}
            aria-label={t("safety.dismiss")}
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
