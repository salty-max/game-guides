import { brand, byId, config, readChapter } from "./guide";
import type { Checks, Extra, ProgressState } from "./types";

export const STORAGE_KEY = `${brand.storagePrefix}.v1`;

export const defaultState = (): ProgressState => ({
  version: 3,
  guide: brand.id,
  checks: {},
  ceiling: 1,
  spoilers: true,
  chapter: 1,
  extra: config.state.extra?.initial() as Extra,
});

/**
 * Parse untrusted JSON (storage or an imported file) into a safe state. Version 3 is the shared format;
 * older saves go through the guide's `legacy` reader. Throws on anything that is not a backup of this guide.
 */
export function validateState(value: unknown): ProgressState {
  const v = value !== null && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
  const current = v?.version === 3 && v.guide === brand.id;
  const legacy = v && !current ? (config.state.legacy?.(v) ?? null) : null;
  const checks = v?.checks;
  if (!v || (!current && !legacy) || !checks || Array.isArray(checks) || typeof checks !== "object") {
    throw new Error(`This file is not a ${brand.name} progress backup.`);
  }
  const result = defaultState();
  result.checks = Object.fromEntries(Object.entries(checks).filter(([id, checked]) => byId.has(id) && checked === true)) as Checks;
  result.ceiling = readChapter(v.ceiling);
  result.chapter = readChapter(v.chapter);
  result.spoilers = v.spoilers !== false;
  if (config.state.extra) result.extra = config.state.extra.read(current ? v.extra : legacy?.extra);
  return result;
}
