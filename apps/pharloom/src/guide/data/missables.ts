import type { Missable } from "@hundo/core/types";

/**
 * Entries that can be lost for good, each on two independent hosts that state the same condition (hollowknight.wiki and its copies
 * count as one). Nothing here costs the game's own completion; each costs an entry this guide counts, except Broodfeast's, a one-way choice on no
 * target until core's choice block lands. A line shows in its
 * chapter's strip and on the Questlines page once that chapter is revealed, so before chapter 10 none names the last act.
 */
export const missables: Missable[] = [
  {
    id: "wish-broodfeast",
    why: "Finish it before the story moves on: afterwards it can't be finished, and another Wish gives its rewards instead.",
    sources: ["https://hollowknight.wiki/w/Broodfeast", "https://www.neoseeker.com/hollow-knight-silksong/Broodfeast"],
  },
  {
    id: "wish-shakra-duel",
    why: "Gone once the story moves on: finish Trail's End and duel Shakra before then.",
    sources: [
      "https://hollowknight.wiki/w/Shakra",
      "https://www.nintendolife.com/guides/hollow-knight-silksong-all-bosses-in-order-locations-and-rewards",
    ],
  },
  {
    id: "wish-delivery-bone-bottom",
    why: "Gone once the story moves on: make the delivery before then.",
    sources: ["https://hollowknight.wiki/w/Bone_Bottom_Supplies", "https://www.neoseeker.com/hollow-knight-silksong/Bone_Bottom_Supplies"],
  },
  {
    id: "wish-delivery-pilgrims-rest",
    why: "Gone once the story moves on: make the delivery before then.",
    sources: [
      "https://hollowknight.wiki/w/Pilgrim%27s_Rest_Supplies",
      "https://vandal.elespanol.com/noticia/1350783504/cuidado-si-en-silksong-avanzas-al-acto-3-hay-contenidos-que-perderas-para-siempre/",
    ],
  },
  {
    id: "ending-weaver-queen",
    why: "Closed by Snared Silk: bind Grand Mother Silk for this ending, then reload, before you play the Needolin at the Cradle.",
    sources: ["https://hollowknight.wiki/w/Endings_(Silksong)", "https://www.neoseeker.com/hollow-knight-silksong/Act_2_Ending_%26_How_to_start_Act_3"],
  },
  {
    id: "ending-twisted-child",
    why: "Beat Grand Mother Silk wearing the Cursed Crest before Infestation Operation cures the curse and before you play the Needolin at the Cradle.",
    sources: ["https://hollowknight.wiki/w/Endings_(Silksong)", "https://www.pcgamer.com/games/action/silksong-endings/"],
  },
];
