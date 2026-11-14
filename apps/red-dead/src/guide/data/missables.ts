import type { Missable } from "../../core/types";

/**
 * Entries that can be lost if you move on. A row is listed here only when two independent sources agree;
 * anything weaker lives in docs/facts-to-verify.md.
 */
export const missables: Missable[] = [
  {
    id: "optional-i-know-you-start",
    why: "Time-limited: finish all three parts before the last main mission, or the chain fails.",
    sources: ["https://www.ireddead.com/rdr/guides/i-know-you", "https://www.gamesradar.com/red-dead-redemption-stranger-mission-guide/2/"],
  },
];
