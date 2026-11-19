import type { Missable, SourceLink } from "@hundo/core/types";

/**
 * Entries that can be lost for good if you move on. A row is listed here only when two independent sources agree on
 * the exact condition; anything weaker belongs in docs/facts-to-verify.md. It is empty on purpose: for the Switch
 * remake the sources below name nothing that is permanently missable, so the strip says that instead.
 */
export const missables: Missable[] = [];

/** What the guide can honestly say while nothing is flagged. */
export const reassurance: { text: string; sources: SourceLink[] } = {
  text: "After the ending you can load your clear save and keep collecting.",
  sources: [
    ["Gamer Guides · loose ends after the ending", "https://gamerguides.com/the-legend-of-zelda-links-awakening/guide/walkthrough/finale/loose-ends"],
    ["GameFAQs · the BowWow figure after the ending (save and reload)", "https://gamefaqs.gamespot.com/switch/258622-the-legend-of-zelda-links-awakening/faqs/77938/nintendo-figurine-quest"],
    ["Zelda Wiki · permanently missable items (none of the 50 seashells)", "https://zeldawiki.wiki/wiki/Permanently_Missable_Items"],
  ],
};
