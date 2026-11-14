import type { Missable, SourceLink } from "@game-guides/core/types";

/**
 * Entries that can be lost for good. An entry belongs here only when two independent sources agree on the exact
 * condition. Nothing qualifies: both sources below say nothing in the game is permanently missable.
 */
export const missables: Missable[] = [];

/** What the guide can honestly say while nothing is flagged. */
export const reassurance: { text: string; sources: SourceLink[] } = {
  text: "Collectibles and quests stay reachable, and a cleared save reloads before the ending so you can keep collecting.",
  sources: [
    ["Game8 · list of missables and one-time events", "https://game8.co/games/Zelda-Echoes-of-Wisdom/archives/473539"],
    ["Console Pulse · 100% completion hub", "https://consolepulse.com/nintendo/zelda/guides/zelda-echoes-of-wisdom-complete-guide-100-percent-hub"],
  ],
};
