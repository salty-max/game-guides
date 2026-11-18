import type { Checks, LeftItem, Row } from "@hundo/core/types";

/** The percentage the player read in the game (Stats → General), saved as the progress state's `extra`. */
export interface Reported {
  reported: number | null;
}

declare module "@hundo/core/types" {
  interface Register {
    extra: Reported;
  }
}

/** How much each entry adds to the game's in-game completion percentage. */
export const weights: Record<string, number> = {
  mission: 1,
  stranger: 0.5,
  location: 6 / 94,
  bounty: 0.1,
  outfit: 0.5,
  safehouse: 2 / 13,
  hideout: 0.5,
  weapon: 0.5,
  job: 0.5,
  minigame: 0.5,
};

// Ambient challenge ranks 5 and 10 are the only ones that add credit.
export const weightOf = (row: Row) => (row.tags[0] === "challenge" && /-(5|10)$/.test(row.id) ? 1 : (weights[row.tags[0]] ?? 0));

/** Scraps feed the outfits, optional tasks sit outside the stat, and a Stranger task counts by its last step alone, so none of those counts. */
export const countsTowardStat = (row: Row) => !["optional", "scrap", "stranger-step"].includes(row.tags[0]);

/** The in-game completion estimate, rounded down to a tenth like the game's stat. */
export const estimate = (checks: Checks, rows: Row[]) =>
  Math.min(100, Math.floor((rows.reduce((sum, row) => sum + (checks[row.id] === true ? weightOf(row) : 0), 0) + 1e-8) * 10) / 10);

/** Points left per category, using the estimate's weights. */
export function pointsLeft(checks: Checks, rows: Row[]): LeftItem[] {
  const byTag = new Map<string, LeftItem>();
  for (const row of rows) {
    const item = byTag.get(row.tags[0]) ?? { tag: row.tags[0], left: 0, total: 0 };
    item.total += weightOf(row);
    if (checks[row.id] !== true) item.left += weightOf(row);
    byTag.set(row.tags[0], item);
  }
  return [...byTag.values()].filter((item) => item.total > 0);
}

/** An in-game percentage: a number from 0 to 100, kept to a tenth. Anything else is null. */
export function readPercent(value: unknown): number | null {
  if (value === null || value === undefined || value === "" || typeof value === "boolean") return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 && n <= 100 ? Math.round(n * 10) / 10 : null;
}

export const readReported = (value: unknown): Reported => ({ reported: readPercent((value as Partial<Reported> | undefined)?.reported) });

/** How far the game's own number is from the estimate, in points (positive: the game is ahead). */
export const calibrationDelta = (estimated: number, reported: number) => Math.round((reported - estimated) * 10) / 10;
