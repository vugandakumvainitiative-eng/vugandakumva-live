import { expect, it } from "vitest";
import { en } from "./en";
import { rw } from "./rw";
it("provides matching non-empty EN and review-pending RW keys", () => {
  expect(Object.keys(rw).sort()).toEqual(Object.keys(en).sort());
  expect(Object.values(rw).every((value) => value.length > 0)).toBe(true);
  expect(en["language.pending"]).toContain("TODO-REVIEW");
});
