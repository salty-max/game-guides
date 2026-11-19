import type { RawChapter } from "@hundo/core/types";

export default {
  id: 13,
  title: "A Second Save",
  region: "Bone Bottom · Putrified Ducts",
  teaser: "Second save",
  intro: "Two entries need a save of their own. The Summoned Saviour fights only in Steel Soul mode, which the game unlocks once you've finished it, and where most deaths end the save. Runt's Wish, the other way of the Huntress's, comes only on a save that leaves Broodfeast unfinished into the last act. So play the second save on Steel Soul, leave Broodfeast alone and go that far: one save covers both.",
  sources: [["Steel Soul mode: how it unlocks, what a death does, what only it has", "https://hollowknight.wiki/w/Steel_Soul_Mode_(Silksong)"], ["Broodfeast, and Runtfeast in its place after Act 2", "https://hollowknight.wiki/w/Broodfeast"], ["Neoseeker · Broodfeast: only during Act 2, and Runtfeast with the same reward", "https://www.neoseeker.com/hollow-knight-silksong/Broodfeast"]],
  groups: [
    {
      title: "On Steel Soul",
      location: "Blasted Steps · Bone Bottom",
      sources: [["A Vassal Lost", "https://hollowknight.wiki/w/A_Vassal_Lost"], ["Summoned Saviour", "https://hollowknight.wiki/w/Summoned_Saviour"], ["Steel Seer Zi", "https://hollowknight.wiki/w/Steel_Seer_Zi"]],
      rows: [
        ["boss-summoned-saviour", ["boss"], "Fight Summoned Saviour on a Steel Soul file", "Steel Soul files only. Steel Seer Zi, hidden at the Blasted Steps' far eastern edge, gives you A Vassal Lost once you own a map. Visit the three resting places she marks and her runaway vassal Sula's spot appears on your map: in Bone Bottom, southwest of Bonegrave, past a broken wall, where Sula has just summoned the Saviour. Beat it, then report to Zi for a Growstone. On a Classic file this fight doesn't exist.", {"reference": "https://hollowknight.wiki/w/Summoned_Saviour"}],
      ],
    },
    {
      title: "The Huntress's other way",
      location: "Putrified Ducts",
      sources: [["Runtfeast", "https://hollowknight.wiki/w/Runtfeast"], ["Longclaw from either Wish", "https://hollowknight.wiki/w/Longclaw"]],
      rows: [
        ["wish-runtfeast", ["wish"], "Grant the Wish that replaces Broodfeast", "On this save, leave Broodfeast unfinished until Act 3. Where the Huntress was, in the south-west of the Ducts, Runt, one of her brood, asks for Runtfeast: the same 60 organs, 15 Seared, 35 Shredded and 10 Skewered, from the same tools. Organs gathered for Broodfeast carry over. Bring all 60 for the Longclaw.", {"reference": "https://hollowknight.wiki/w/Runtfeast"}],
      ],
    },
  ],
} satisfies RawChapter;
