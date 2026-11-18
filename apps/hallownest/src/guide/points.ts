import type { Checks, Row } from "@hundo/core/types";

/** What the game counts as everything: its own 112%, with all four free content packs installed. */
export const FULL = 112;

/**
 * The points each tag is worth in the game's own count (`CountGameCompletion` in its `PlayerData`, and the wiki's Completion
 * table): equipment counts double, everything else one. Mask Shards and Vessel Fragments count only as whole masks and vessels.
 */
const pointsByTag: Record<string, number> = {
  charm: 1,
  "percent-boss": 1,
  equipment: 2,
  "warrior-dream": 1,
  spell: 1,
  forge: 1,
  "nail-art": 1,
  dreamer: 1,
  "dream-milestone": 1,
  trial: 1,
  "troupe-boss": 1,
  "troupe-finale": 1,
  godtuner: 1,
  pantheon: 1,
};

const SHARDS_PER_MASK = 4;
const FRAGMENTS_PER_VESSEL = 3;

const counted = new Set([...Object.keys(pointsByTag), "mask-shard", "vessel-fragment"]);

/** The rows the game's count reads. */
export const countsInGame = (row: Row) => row.tags.some((tag) => counted.has(tag));

/** The in-game completion the ticked rows add up to, from 0 to 112, as the save file shows it. */
export function gamePoints(checks: Checks, rows: Row[]): number {
  let points = 0;
  let shards = 0;
  let fragments = 0;
  for (const row of rows) {
    if (checks[row.id] !== true) continue;
    for (const tag of row.tags) {
      points += pointsByTag[tag] ?? 0;
      if (tag === "mask-shard") shards += 1;
      if (tag === "vessel-fragment") fragments += 1;
    }
  }
  // Rounded once, as the game counts: a mask only when its four shards are in, a vessel only with its three fragments.
  return points + Math.floor(shards / SHARDS_PER_MASK) + Math.floor(fragments / FRAGMENTS_PER_VESSEL);
}

/**
 * The guide's overall figure: the game's points over its 112, as a whole percentage rounded down. Full completion is the game's
 * 112%, so the bar reads 100 only then, and every tick moves it by the game's own weights.
 */
export const fullCompletion = (checks: Checks, rows: Row[]) => Math.floor((gamePoints(checks, rows) * 100) / FULL);
