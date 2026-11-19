# Facts to verify

What this guide claims that nobody has confirmed in the game. Nothing here was replayed: GPT drafted the route and rows from community pages, and an audit checked them claim by claim against those pages and others on 19 November 2026, with passes that didn't write them. The facts are checked against the game's version 1.0.30000 (Patch 5, 16 March 2026), still the current one on that date.

The Hollow Knight wiki ([hollowknight.wiki](https://hollowknight.wiki)) answers 403 to plain scripted fetches; its raw wikitext (`?action=raw`) was read instead. Fandom's wiki shares its lineage, so the two count as one source. Pharloom Calculator says every value comes from the wiki and scrapes it, so it counts as the wiki too, except for what it documents reading from the installed game's files.

## Counts

Each fixed total in `targets` (`src/guide/config.ts`) and its source are below; `guide.test.ts` pins the totals to the rows. The audit matched the draft's tagged rows to these lists name for name on 19 November 2026, with nothing missing or doubled. The draft's lists came from [silksong-completionist](https://github.com/Br3zzly/silksong-completionist/tree/7f85ff6), a save-file tracker keyed to the game's own flags, which credits a Reddit thread for its rules and not the wiki. So where it is the second source, it confirms the total from the save's flags, but it can't check the draft's names, which came from it: only the wiki (and Neoseeker, where listed) checks those. Two hosts back every total unless the notes say otherwise.

| List | Count | Source 1 | Source 2 | Notes |
| --- | ---: | --- | --- | --- |
| The game's own completion | 100 | [wiki Completion](https://hollowknight.wiki/w/Completion_(Silksong)) | [silksong-completionist categories](https://github.com/Br3zzly/silksong-completionist/tree/7f85ff6/src/dictionary/categories) | 51 tools, 6 Silk Skills, 4 Crafting Kits and 4 Tool Pouches, 3 Silk Hearts, 6 crests, 7 abilities, 5 masks from 20 shards, 9 spools from 18 fragments, 4 Needle upgrades and the key item. Whether the game stops at 100 isn't verified |
| Crests | 6 | wiki Completion | completionist | The starting crest and two others don't count |
| Abilities | 7 | wiki Completion | completionist | The two cloaks and three songs don't count |
| Cloaks | 2 | [wiki Faydown Cloak](https://hollowknight.wiki/w/Faydown_Cloak), [wiki Drifter's Cloak](https://hollowknight.wiki/w/Drifter's_Cloak) | completionist ("Cloak Abilities (these don't contribute)") | Not part of the game's own completion |
| Tools with two forms | 1 each | wiki Completion | completionist (one entry, either save id) | Druid's Eye or Eyes, Claw Mirror or Mirrors, and two more |
| Lost Fleas | 30 | [wiki Flea](https://hollowknight.wiki/w/Flea) | [Neoseeker](https://www.neoseeker.com/hollow-knight-silksong/All_Flea_Locations) | |
| Memory Lockets | 20 | [wiki Memory Locket](https://hollowknight.wiki/w/Memory_Locket) | [Neoseeker](https://www.neoseeker.com/hollow-knight-silksong/All_Memory_Locket_Locations) | Area for area |
| Craftmetal | 8 | [wiki Craftmetal](https://hollowknight.wiki/w/Craftmetal) | completionist (8 save flags) | |
| Pale Oils | 3 | wiki | completionist | |
| Simple Keys | 4 | [wiki Simple Key](https://hollowknight.wiki/w/Simple_Key_(Silksong)) | completionist | |
| Mossberries | 7 | [wiki Mossberry](https://hollowknight.wiki/w/Mossberry) | completionist | |
| Mementos | 8 | wiki Materium | completionist | |
| Relics and cylinders | 21 | wiki Materium | completionist | 15 relics and 6 cylinders |
| Area maps | 28 | [wiki Map and Quill](https://hollowknight.wiki/w/Map_and_Quill_(Silksong)) | completionist (28 flags) | |
| Bellway stops | 12 | [wiki Fast Travel](https://hollowknight.wiki/w/Fast_Travel_(Silksong)) | [Neoseeker](https://www.neoseeker.com/hollow-knight-silksong/All_Bellway_Locations) | |
| Ventrica stops | 7 | wiki Fast Travel | [Neoseeker](https://www.neoseeker.com/hollow-knight-silksong/All_Ventrica_Station_Locations) | |
| Bellshrines | 6 | wiki Bench | [Insider Gaming](https://insider-gaming.com/hollow-knight-silksong-old-bell/) (five) | The sixth rests on the wiki alone |
| Endings | 5 | [wiki Endings](https://hollowknight.wiki/w/Endings_(Silksong)) | [PC Gamer](https://www.pcgamer.com/games/action/silksong-endings/) | |

Wishes, bosses and challenges have no fixed total in `targets`: each counts its tagged rows.

## The overall figure

Every board target counts, one entry each, with nothing optional (the user's ruling, 19 November 2026: "100% means full completion not just a number"). So the bar reads 100 only with every counted entry ticked, and under 100 with any one left; `guide.test.ts` pins both. Route steps and pickups aren't board targets, so they don't count. The bar is not the game's own percentage, and the board note says so without saying where in the game that figure shows.

## The draft as it stands

This commit carries GPT's chapters as drafted. The audit's fixes (rows before their requirement, contradicted rows, the missables' second hosts, spoilers and citations) come in the fix pass that follows.
