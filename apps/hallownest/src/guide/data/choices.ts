import type { Choice } from "@hundo/core/types";

// The first save takes the way the guide recommends; the other way is a row of its own in "A Second Save" (chapter 13), so both count.
// A choice's name, its why and the later rows' titles show in the choice's chapter, so they say only what that chapter says.
export const choices: Choice[] = [
  {
    row: "quest-nailsmith-sheo",
    name: "The Nailsmith’s request",
    why: "Strike him down when he asks, after the Pure Nail, for Purity; spare him, with Great Slash learned, and he moves to Sheo’s hut (Happy Couple).",
    later: [{ row: "quest-nailsmith-purity", on: "A second save" }],
    sources: ["https://hollowknight.wiki/w/Nailsmith", "https://hollowknight.wiki.fextralife.com/Nailsmith"],
  },
];
