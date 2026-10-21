import { create } from "zustand";
import { SAFETY_NOTICE_KEY } from "../lib/i18n";
function dismissed() {
  try {
    return sessionStorage.getItem(SAFETY_NOTICE_KEY) === "true";
  } catch {
    return false;
  }
}
interface UiState {
  menuOpen: boolean;
  safetyDismissed: boolean;
  district: string;
  service: string;
  resultVisible: boolean;
  setMenu: (open: boolean) => void;
  setDistrict: (value: string) => void;
  setService: (value: string) => void;
  showResult: () => void;
  resetFilters: () => void;
  dismissSafety: () => void;
  showSafety: () => void;
  clear: () => void;
}
export const useUiStore = create<UiState>()((set) => ({
  menuOpen: false,
  safetyDismissed: dismissed(),
  district: "",
  service: "all",
  resultVisible: false,
  setMenu: (menuOpen) => set({ menuOpen }),
  setDistrict: (district) => set({ district, resultVisible: false }),
  setService: (service) => set({ service, resultVisible: false }),
  showResult: () => set({ resultVisible: true }),
  resetFilters: () =>
    set({ district: "", service: "all", resultVisible: false }),
  dismissSafety: () => {
    try {
      sessionStorage.setItem(SAFETY_NOTICE_KEY, "true");
    } catch {
      /* Optional storage. */
    }
    set({ safetyDismissed: true });
  },
  showSafety: () => set({ safetyDismissed: false }),
  clear: () => {
    try {
      sessionStorage.removeItem(SAFETY_NOTICE_KEY);
    } catch {
      /* Never block exit. */
    }
    set({
      menuOpen: false,
      safetyDismissed: false,
      district: "",
      service: "all",
      resultVisible: false,
    });
  },
}));
