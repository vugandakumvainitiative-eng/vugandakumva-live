import { useTranslation } from "react-i18next";
import { EMERGENCY_NUMBERS } from "../lib/emergency-contacts";
import { QuickExit } from "./quick-exit";
export function EmergencyBar() {
  const { t } = useTranslation();
  return (
    <aside className="emergency-bar" aria-label={t("emergency")}>
      <div className="container emergency-inner">
        <div className="emergency-numbers">
          <span>{t("emergency")}:</span>
          {EMERGENCY_NUMBERS.map((number) => (
            <a
              key={number}
              href={"tel:" + number}
              aria-label={t("call", { number })}
            >
              {number}
            </a>
          ))}
        </div>
        <div className="exit-area">
          <QuickExit />
          <span className="exit-limit">{t("exit.short")}</span>
        </div>
      </div>
    </aside>
  );
}
