import type { Choice } from "@hundo/core/types";

// The first save takes the way the guide recommends; the other way is a row of its own in "A Second Save" (chapter 13), so both count.
// A choice's name, its why and the later rows' titles show in the choice's chapter, so they say only what that chapter says.
export const choices: Choice[] = [
  {
    row: "wish-broodfeast",
    name: "The Huntress's Broodfeast",
    why: "Finish it before the story moves on: left unfinished, it closes, and another Wish asks the same for the same Longclaw.",
    later: [{ row: "wish-runtfeast", on: "A second save" }],
    sources: ["https://hollowknight.wiki/w/Broodfeast", "https://www.neoseeker.com/hollow-knight-silksong/Broodfeast"],
  },
];
