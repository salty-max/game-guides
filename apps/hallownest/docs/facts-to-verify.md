# Facts to verify

What this guide claims that nobody has confirmed in the game. Nothing here was replayed: GPT drafted the route and rows from community pages on 18 November 2026, and they were then checked claim by claim against those pages and others by separate passes that didn't write them, the same day. Each open question says what would settle it.

The Hollow Knight wiki ([hollowknight.wiki](https://hollowknight.wiki)) answers 403 to scripted fetches; every check read it in a browser. Fandom's wiki shares its text word for word, so the two count as one source. teemo.dev says it re-derives the wiki's own text, so it isn't independent of it either.

## Counts

Each game count in `targets` (`src/guide/config.ts`) rests on two independent hosts. The audit matched the tagged rows to these lists name for name, with nothing missing or doubled; `guide.test.ts` pins the totals.

| List | Count | Source 1 | Source 2 | Notes |
| --- | ---: | --- | --- | --- |
| In-game completion | 112 | [wiki Completion](https://hollowknight.wiki/w/Completion_(Hollow_Knight)) | [pindrop's 112% checklist](https://pindrop.gg/hollow-knight/guides/112-percent-checklist), and [the game's decompiled `PlayerData`](https://github.com/ayushpaharia/hollow-knight-code/blob/main/Assembly-CSharp/PlayerData.cs) (`CountGameCompletion`) | Every term matches: 14 bosses and the Hive Knight, 7 Warrior Dreams, 3 trials, 40 charms, 7 pieces of equipment at 2 each, 6 spells, 3 nail arts, 4 masks from 16 shards, 3 vessels from 9 fragments, 4 nail upgrades, 3 Dream Nail steps (acquired, 1,800 and 2,400 Essence), 3 Dreamers, Grimm and the Troupe's finale, the Godtuner and Pantheons 1 to 4. It assumes all four free content packs |
| Charms | 40 | wiki Completion | the game's code (39 flags and Kingsoul whole), pindrop | Kingsoul counts only once whole, and Void Heart keeps its point ([wiki Kingsoul](https://hollowknight.wiki/w/Kingsoul)) |
| Mask Shards | 16 | [wiki Mask Shard](https://hollowknight.wiki/w/Mask_Shard_(Hollow_Knight)) | [Steam guide 3005043947](https://steamcommunity.com/sharedfiles/filedetails/?id=3005043947) | |
| Vessel Fragments | 9 | [wiki Vessel Fragment](https://hollowknight.wiki/w/Vessel_Fragment) | Steam guide | |
| Grubs | 46 | [wiki Grub](https://hollowknight.wiki/w/Grub) | Steam guide | The split by area matches the rows |
| Simple Keys | 4 | [wiki Simple Key](https://hollowknight.wiki/w/Simple_Key_(Hollow_Knight)) | [game-checklists keys](https://game-checklists.com/hollow-knight/keys-checklist/) | The Steam guide never buys Sly's |
| Pale Ore | 6 | [wiki Pale Ore](https://hollowknight.wiki/w/Pale_Ore) | Steam guide | The same six places |
| Whispering Roots | 15 | [wiki Whispering Root](https://hollowknight.wiki/w/Whispering_Root) | [pindrop dream bosses](https://pindrop.gg/hollow-knight/guides/dream-bosses) | Each root's Essence (482 in all) is the wiki's alone; see below |
| Stag Stations | 11 | [wiki Stag Station](https://hollowknight.wiki/w/Stag_Station) | Steam guide, and the "Hope" achievement | Ten stations and the Stag Nest, which opens once the rest are open |
| Area maps | 13 | [wiki Map and Quill](https://hollowknight.wiki/w/Map_and_Quill_(Hollow_Knight)) | Steam guide (13 purchases) | Resting Grounds is Iselda's only. Crystal Peak's map is 112 Geo on the wiki and 115 in the Steam guide; the guide follows the wiki |
| Earned charm notches | 8 (11 at most) | [wiki Charms](https://hollowknight.wiki/w/Charms) | [pindrop charm notches](https://pindrop.gg/hollow-knight/guides/charm-notches) | Salubra at 5, 10, 18 and 25 charms for 120, 500, 900 and 1,400 Geo, the Shrumal Ogres, Fog Canyon, Grimm, and the Trial of the Warrior |
| Endings | 5 | [wiki Endings](https://hollowknight.wiki/w/Endings_(Hollow_Knight)) | [pindrop endings](https://pindrop.gg/hollow-knight/guides/endings) (five cinematics in the game's files) | The fifth's name and trigger (the Delicate Flower) rest on the wiki and a weaker site |
| Dream rematches | 5 | [wiki Dream Nail](https://hollowknight.wiki/w/Dream_Nail) | Steam guide | |
| Achievements (not tracked) | 63 | [Steam stats](https://steamcommunity.com/stats/367520/achievements) | [wiki Achievements](https://hollowknight.wiki/w/Achievements_(Hollow_Knight)) | The guide tracks only Pure Completion. The 52 and 11 split is the wiki's |

The Seer's thresholds (500, 700, 900, 1,500, 1,800 and 2,400 Essence), the Grubfather's (10, 31 and 46), every Warrior Dream's Essence, and Salubra's, the Leg Eater's, Sly's, Iselda's and the Stag's prices match the wiki. The 2,400 adds up: the Warrior Dreams give 1,100 and four of the dream rematches 1,300, without Grey Prince Zote's 300.

## The overall figure

The bar reads the game's points over 112, rounded down once (Mask Shards in fours and Vessel Fragments in threes first, then the scale), so it reads 99 with one shard left and 100 only with everything. `guide.test.ts` pins both. The weights are the game's own code: equipment 2, everything else 1. That the figure the inventory shows with World Sense is that same count is the wiki's and the code's, not seen in a save.
