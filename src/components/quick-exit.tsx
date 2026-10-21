import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { performQuickExit } from "../lib/quick-exit";
export function QuickExit() {
  const { t } = useTranslation();
  return (
    <button className="quick-exit" onClick={() => performQuickExit()}>
      {t("exit")}
      <ArrowUpRight size={18} aria-hidden="true" />
    </button>
  );
}
