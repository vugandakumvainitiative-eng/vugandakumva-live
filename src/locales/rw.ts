import { en } from "./en";
// TODO-REVIEW: retain English source until a native speaker approves every key.
// The rendered content remains lang=en so screen readers pronounce it correctly.
export const rw: Record<keyof typeof en, string> = { ...en };
