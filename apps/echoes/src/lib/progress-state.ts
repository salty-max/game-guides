import type { ProgressState } from "../types";
import { byId, readChapter } from "./guide";

export const STORAGE_KEY = "echoes-of-wisdom-field-guide.v1";

export const defaultState = (): ProgressState => ({
  version: 1,
  guide: "echoes-of-wisdom",
  checks: {},
  ceiling: 1,
  spoilers: true,
  chapter: 1,
});

/** Parse untrusted JSON (storage or an imported file) into a safe state. Throws on anything that is not a backup. */
export function validateState(value: unknown): ProgressState {
  const v = value as Partial<Record<keyof ProgressState, unknown>> | null;
  const checks = v?.checks;
  if (!v || v.version !== 1 || v.guide !== "echoes-of-wisdom" || !checks || Array.isArray(checks) || typeof checks !== "object") {
    throw new Error("This file is not an Echoes of Wisdom Field Guide progress backup.");
  }
  const result = defaultState();
  result.checks = Object.fromEntries(Object.entries(checks).filter(([id, checked]) => byId.has(id) && checked === true)) as Record<string, true>;
  result.ceiling = readChapter(v.ceiling);
  result.chapter = readChapter(v.chapter);
  result.spoilers = v.spoilers !== false;
  return result;
}
