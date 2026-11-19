# Facts to verify

What this guide claims that nobody has confirmed in the game. Nothing here was replayed: GPT drafted the route and rows from community pages, an audit checked them claim by claim against those pages and others on 19 November 2026, and the chapters were then fixed and checked again against their sources, each by passes that didn't write them. The facts are checked against the game's version 1.0.30000 (Patch 5, 16 March 2026), still the current one on that date.

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

The guide's own lists have goals equal to their rows, not a game total: 13 pickups (keys, quest items and upgrades), 79 Wish steps (a Wish's parts, the Caravan's moves and the deliveries each count, and both ways of the Huntress's choice, Broodfeast and Runtfeast), 41 bosses and 8 challenges. `guide.test.ts` pins each goal to its rows. A row of two kinds counts once, as its real kind: Crawbug Clearing as its Crafting Kit and Savage Beastfly's Wish as its Mask Shard, the Wishes whose task is a fight (The Terrible Tyrant, The Wailing Mother, Hero's Call, Pain, Anguish and Misery) and the record runs (Seth's records, the final race) as Wishes, and Shakra's duel, which is no Wish, as a boss, like Garmond and Zaza's.

## The overall figure

Every board target counts, one entry each, with nothing optional (the user's ruling, 19 November 2026: "100% means full completion not just a number"). So the bar reads 100 only with every counted entry ticked, and under 100 with any one left; `guide.test.ts` pins both, and that every target's goal equals its rows. Route steps are directions and don't count. The bar is not the game's own percentage, and the board note says so without saying where in the game that figure shows.

What full completion needs beyond one ordinary save, all of it the user's call:

- **Endings.** All five count. One save can see them all with reloads: after Weaver Queen and Twisted Child the game returns to the last save with Grand Mother Silk alive ([wiki Endings](https://hollowknight.wiki/w/Endings_(Silksong)); the Weaver Queen half also [Neoseeker](https://www.neoseeker.com/hollow-knight-silksong/Act_2_Ending_%26_How_to_start_Act_3)). Snared Silk closes the other two on that save.
- **A second save.** Two entries need one, so the user's 100% takes two saves; both sit in chapter 13, A Second Save (the user's rulings, 19 November 2026: mode-locked entries stay counted, and a one-way choice's other way goes to a later playthrough's chapter, as Hallownest's does). `boss-summoned-saviour` exists only on a Steel Soul file ([wiki Summoned Saviour](https://hollowknight.wiki/w/Summoned_Saviour), [Steel Soul Mode](https://hollowknight.wiki/w/Steel_Soul_Mode_(Silksong))), and `wish-runtfeast` only on a save that leaves Broodfeast unfinished into the last act (One-way choices, below). One Steel Soul save played that far covers both. A Steel Soul save can't hold every entry on its own: the Queen's Egg delivery and its Materium entry don't exist there (wiki Steel Soul Mode), so the first save, on Classic, takes the rest. On Steel Soul the Hunter's Memento needs the Saviour's Journal entry too, and the Shell Satchel is the same tool entry as the Dead Bug's Purse. That Steel Soul unlocks once the game is finished, that a death ends the save, and what else the mode changes rest on the wiki alone. Its two achievements (Steel Soul, Steel Heart) are no rows.
- **Entries that close.** Some counted entries close for good when the story moves on: the strip's missables below, and the one-host candidates after them. A reader who reaches the last act without them can't reach 100 on that save.

## Missables

The five in `missables.ts` each rest on two hosts that state the same condition (hollowknight.wiki and anything copying it count as one; guidevault.online is AI-written by its own footer and was dropped; Pharloom Calculator scrapes the wiki). None costs the game's own completion; each costs an entry this guide tracks. Broodfeast was one; it's now the one-way choice below. Before chapter 10 no line names the last act: they say "before the story moves on", or, in chapter 9's last group, "before you play the Needolin at the Cradle".

| Row | Condition | Host 1 | Host 2 |
| --- | --- | --- | --- |
| `wish-shakra-duel` | Gone once the story moves on (that the duel can't be reached while the Caravan is in Greymoor is the wiki's alone, and stays in the row) | [wiki Shakra](https://hollowknight.wiki/w/Shakra) | [Nintendo Life](https://www.nintendolife.com/guides/hollow-knight-silksong-all-bosses-in-order-locations-and-rewards) ("Act 2 only"), and Vandal |
| `wish-delivery-bone-bottom` | Gone once the story moves on | [wiki Bone Bottom Supplies](https://hollowknight.wiki/w/Bone_Bottom_Supplies) | [Neoseeker](https://www.neoseeker.com/hollow-knight-silksong/Bone_Bottom_Supplies), and Vandal |
| `wish-delivery-pilgrims-rest` | Gone once the story moves on | [wiki Pilgrim's Rest Supplies](https://hollowknight.wiki/w/Pilgrim%27s_Rest_Supplies) | Vandal (Neoseeker's page for it doesn't say it closes) |
| `ending-weaver-queen` | Closed by Snared Silk only, not by the curse | wiki Endings and Silk and Soul | Neoseeker's Act 2 ending page (PC Gamer gets the condition wrong) |
| `ending-twisted-child` | Wearing the Cursed Crest, before Infestation Operation cures it and before Snared Silk | wiki Endings | [PC Gamer](https://www.pcgamer.com/games/action/silksong-endings/), and PCGamesN |

Hosts read on 19 November 2026: the wiki as raw wikitext, Neoseeker in a browser (it refuses scripted fetches, and began answering with a bot check partway through), Vandal, Nintendo Life and PC Gamer fetched.

On one host only, so kept off the strip, though each costs a counted entry if true:

- Garmond and Zaza's duel closes once both Fine Pins and the Threefold Melody are done ([wiki Garmond and Zaza](https://hollowknight.wiki/w/Garmond_and_Zaza)); in this route that's always before the story moves on, the cutoff [Vandal](https://vandal.elespanol.com/noticia/1350783504/cuidado-si-en-silksong-avanzas-al-acto-3-hay-contenidos-que-perderas-para-siempre/) and Nintendo Life state. The two don't state the same condition, so it's off the strip; the row warns, and it comes before the last melody.
- Palestag is lost once the Clover Dancers fall ([wiki Palestag](https://hollowknight.wiki/w/Palestag)). [Neoseeker Verdania](https://www.neoseeker.com/hollow-knight-silksong/Verdania) says beating them shuts that Verdania "forever", which implies it without saying it. The row warns.
- Lace's Deep Docks fight never happens if you reach Sinner's Road or the Blasted Steps first; she speaks to you there instead (wiki Lace and Far Fields; a Steam forum thread and a reader comment agree). Her Journal entry still completes from the later fight; the "Pharloom's Welcome" achievement for beating her in the Docks is lost on that save, by inference. The row tells you to fight her on your first visit.
- Garb of the Pilgrims, The Terrible Tyrant and Volatile Flintbeetles drop off the Wish list if unfinished when the story moves on (wiki); An Icon of Hope's statue is destroyed then (wiki). Deltia's Gaming says in general terms that Bone Bottom's Wishwall is gone.
- Roach Guts is removed from the objectives if unfinished then (wiki).
- Loddie's second and third pin games are gone then (wiki; Vandal says so of his first game only, and wrongly implies the pouch is lost).
- Pinmaster's Oil is lost if a Pale Oil reaches Plinney before the Wish is taken (wiki, marked "verification needed"); the second Needle upgrade still gives its point. The row takes the Wish first.
- The Twelfth Architect's own Silkshot is lost once his stock is bought and his melody learnt (wiki; Vandal contradicts it). Any Silkshot counts as the one tool, so nothing counted is lost.

That nothing the game's own completion counts can be missed for good is what the audit's research found on the wiki; no reputable second host says it outright, so the guide doesn't claim it.

## One-way choices

Where one quest has outcomes that exclude each other, `choices.ts` names the way the guide takes on the first save, a counted row where it falls, and puts the other way in chapter 13, A Second Save, as a counted row of its own (the user's ruling, 19 November 2026). Core draws the choice as a block in its chapter and lists it in Don't miss until it's ticked, so its row is no longer in `missables.ts`.

| Choice | First save | Second save | Sources |
| --- | --- | --- | --- |
| The Huntress's Broodfeast (chapter 9) | `wish-broodfeast`: finish it before the story moves on, for the Longclaw | `wish-runtfeast` (a new row): leave it unfinished into the last act, and Runt asks the same 60 organs for the same Longclaw | [wiki Broodfeast](https://hollowknight.wiki/w/Broodfeast) and [Neoseeker Broodfeast](https://www.neoseeker.com/hollow-knight-silksong/Broodfeast) agree on the condition (not finished during Act 2), on Runtfeast taking its place and on the same reward; [wiki Runtfeast](https://hollowknight.wiki/w/Runtfeast) for the row. Game Rant agrees with a looser trigger. Only the wiki says the Huntress dies |

The block shows the choice's name, its why and the later row's title in chapter 9, so none of them names the last act or Runt (`guide.test.ts`); the later row's own text, in chapter 13, does.

Not choices, checked: the Silkshot's three makers (one tool entry whoever repairs it), Druid's Eye or Eyes and Claw Mirror or Mirrors (one entry each), the Dead Bug's Purse or the Shell Satchel (one entry), Curveclaw handed to the Skarr (its point comes back with the Curvesickle, [wiki Completion](https://hollowknight.wiki/w/Completion_(Silksong))), and the endings (counted by the user's choice).

## Route decisions

The audit found rows that sat before what they need, so Next up offered them while they were impossible. Each moved; its id didn't, except where the list says.

- **Chapter 7's Memorium block to chapter 8, after the Faydown Cloak.** The Memorium needs the cloak ([wiki Memorium](https://hollowknight.wiki/w/Memorium); [Nintendo Life](https://www.nintendolife.com/guides/hollow-knight-silksong-progression-guide-recommended-route) also has it open after Mount Fay). With it went the Second Sentinel chain, which needs the Memorium's Cogheart piece (`pickup-cogheart-memorium`, `wish-final-audience`, `boss-second-sentinel`, `tool-reserve-bind`), and `spool-fragment-15`, which needs the cloak and Clawline.
- **The Slab's inner rooms to chapter 9.** `pickup-key-heretic`, `spool-fragment-4` and `flea-the-slab-2` come after `route-slab-return`: the Heretic gauntlet is behind an Indolent lock, and the inner Slab opens with the Key of Apostate from the Ducts ([wiki Slab Keys](https://hollowknight.wiki/w/Slab_Keys), [The Slab](https://hollowknight.wiki/w/The_Slab)).
- **Chapter 9's order.** The Lost Merchant comes before the Ducts, whose way in is the passage found during it ([wiki Putrified Ducts](https://hollowknight.wiki/w/Putrified_Ducts)). Pinmaster's Oil comes before the first Pale Oil is handed over. The Bilewater and Karak maps sit by their areas, ahead of Trail's End, which needs them. The Cradle's map and the Terminus wait for Lace; Liquid Lacquer waits for the Threefold Melody at the Cradle lift; the Shellwood Weaver Effigy waits for Rite of Rebirth, which opens the Chapel of the Witch; the full 30-flea search and the Egg of Flealia come after the last flea rows.
- **Smaller moves.** The Deep Docks flea filed under the Marrow is the wiki's Docks flea #1: it moved to chapter 2 with a new id, `flea-deep-docks-bellway` (it was `flea-the-marrow-2`, before anything was saved). `flea-greymoor-2` and `mossberry-5` wait for Cling Grip in chapter 4; `tool-flintslate` for Clawline in chapter 8; Berry Picking for Silkspear; Needle Strike for the Great Conchflies; Strengthening Songclave for the other Songclave Wishes; the Architect for Clawline; the Vaultkeeper's Melody for Trobbio; Sherma's Spool Fragment sits in the Whiteward.
- **One event, one row.** Crawbug Clearing carries its Crafting Kit (`kit-crawbug-clearing` is gone), Savage Beastfly its Mask Shard (`mask-shard-7` is gone), and the Surface Memento's pickup was its memento row (`route-surface-memento` is gone). The counts still hold.
- **Rows that weren't Wishes.** `wish-garmond-greymoor`, `wish-ruined-chapel` and `wish-chapel-maid` are route steps, `wish-eva-vesticrest` a pickup, and `wish-garmond-zaza-act-two` and `wish-shakra-duel` bosses. Their ids stay.
- **Left as drafted.** `wish-eva-vesticrest` waits for chapter 10 though Atla is open from chapter 4; `relic-rune-harp-weavernest-atla` keeps its misspelt id under the user's rule that surviving ids stay (its title is spelt right).

## From the source-check

Six source-checker passes read every row against its pages after the fix, and a seventh the chapter 9 rows the first didn't reach. What they found is fixed in the rows, except these, which no page settles:

A Map Genie and Neoseeker sitting on 19 November 2026 was meant to open the pins and databases the rows below still wait on. WebFetch can't fetch mapgenie.io (its pin text is JS-only) and answers 403 for Neoseeker's Far_Fields, All_Flea_Locations and the other database pages, so those pins and pages stay unread and the rows that wait on them stay open, as the guide's rule for a page that only a browser pane could read. Some pages were read in the built-in browser pane before the session stopped using it: the wiki's raw pages (WebFetch gets 403 for them), Neoseeker's High_Halls, Berry_Picking and Deep_Docks, a Map Genie pin (478475) and PC Gamer's Quill page; everything after that came through WebFetch and search. Each row below says what it read.

| Row | The guide says | What the sources say | What would settle it |
| --- | --- | --- | --- |
| `route-conductors-melody` and the High Halls rows (ch7) | The High Halls need Clawline; the row adds that a gap needing an ability you don't have yet can wait, without naming the double jump (a chapter 8 ability) | Re-read on 19 Nov 2026, and still split. [wiki High Halls](https://hollowknight.wiki/w/High_Halls): “The Clawline ability is required to access and traverse this area”, and the one double-jump room it names, the Clawmaiden control room (Faydown Cloak, above the Rosary Bank), is optional and has no row. [Gameranx](https://gameranx.com/features/id/553218/article/hollow-knight-silksong-how-to-unlock-double-jump-faydown-cloak-location/): the Conductor's Melody needs only the grapple and wall jump (the same page says elsewhere the double jump is “required to get all three melodies”). [Neoseeker's High Halls walkthrough](https://www.neoseeker.com/hollow-knight-silksong/High_Halls) uses only Clawline, the Drifter's Cloak and Cling Grip to reach Ballador, but its writer already held the double jump. [Nintendo Life's progression page](https://www.nintendolife.com/guides/hollow-knight-silksong-progression-guide-recommended-route): “the High Halls requires both the Clawline and Double Jump”, with Mount Fay before the Architect's and Conductor's melodies; Game8's High Halls page says the same by its search snippet (its page wouldn't load). Nobody reports reaching Ballador without the Faydown Cloak. The data follows the wiki and the row hedges without naming the ability | A playthrough entering the High Halls and reaching the Forum without the Faydown Cloak. If a reader is stranded, the fix is to move `route-conductors-melody`, `route-rosary-storage` and the High Halls collectibles after `mobility-faydown-cloak` in chapter 8 |
| `boss-moorwing` (ch3) | If the Caravan took its arena, Moorwing waits later outside the Greymoor Bellway | [wiki Moorwing](https://hollowknight.wiki/w/Moorwing): that rematch opens only in the next act. The row can't say "Act 2" in chapter 3, so a reader who moved the Caravan first can't tick it until chapter 5 | None needed; noted |
| `pale-oil-1` (ch7) | North-east Choral Chambers | [wiki Pale Oil](https://hollowknight.wiki/w/Pale_Oil): Oil #1 needs Cling Grip, north-east Choral Chambers through the adjoining Vaults room (its caption says north-east too), which the row follows. [wiki Choral Chambers](https://hollowknight.wiki/w/Choral_Chambers) says another oil is “in a room to the west, only accessible via the Whispering Vaults”; read from the Vaults' side, which sit east, that is the same room in other words (a frame, not a contradiction). Map Genie's pin 478668 and Neoseeker (no Pale Oil page) said nothing. One host | A playthrough |
| `spool-fragment-4` (ch9) | From the Slab's Bellway, with the inner Slab open to you (the Apostate door opens it, unless a capture already took you in), two levels north | [wiki Spool Fragment](https://hollowknight.wiki/w/Spool_Fragment) (#6, Act 1): the route from the Bellway two levels north, which the row copies, needs Cling Grip and “a transport to the Slab” (the Wardenfly capture), and never names the Apostate door. [wiki The Slab](https://hollowknight.wiki/w/The_Slab) and [Slab Keys](https://hollowknight.wiki/w/Slab_Keys): the Apostate door is the only way into the rest of the Slab without a capture, but Slab Keys says the door north of the Bellway leads to the “southernmost part”, and no page says the fragment's room is past it, so the row's wording now keeps both ways in. Map Genie's pin 478475 says only “at the top of a frosty area” and Cling Grip, with no key or capture; Neoseeker's page for it is a picture. One host | A playthrough without a capture |
| `route-bilewater` (ch9) | The tall shaft on Sinner's Road's east side | [wiki Bilewater](https://hollowknight.wiki/w/Bilewater): a breakable wall in the vertical passage "east of the area", which area unclear | A playthrough |
| `wish-mushroom-far-fields` (ch12) | In front of Weavenest Cindril's Needolin door | Settled on 19 Nov 2026: wiki Passing of the Age puts the stop at the Far Fields' eastern edge and wiki Far Fields puts Cindril's Needolin door at its far east. Nintendo Life describes the same place (the far right, just before a Needolin door) but calls it Weavenest Atla's, a misnaming, since Atla isn't in the Far Fields. The name is the wiki's alone | None needed |
| `wish-pinmasters-oil` (ch9) | The second Needle upgrade still earns the point if the Wish was missed | [wiki Pinmaster's Oil](https://hollowknight.wiki/w/Pinmaster's_Oil), with an editor's "verification needed" beside it | A playthrough |
| `wish-hunters-memento` (ch12) | 230 entries, 231 on Steel Soul | [wiki Hunter's Memento](https://hollowknight.wiki/w/Hunter's_Memento) (read as raw wikitext) | A second host |

## Achievements

Silksong has its own achievement list: on Switch and Switch 2, which have no system achievements, the game keeps them in-game as "Feats" ([wiki Achievements](https://hollowknight.wiki/w/Achievements_(Silksong)), its disclaimer), recorded in-game and found on the main menu ([Nintendo Life](https://www.nintendolife.com/guides/hollow-knight-silksong-all-achievements)). So under the user's rule (19 November 2026) the guide may name them, as the game's in-game achievements and never by platform, and `config.ts` sets `achievements` with those two sources (core's `data.test.ts` refuses the word to a guide without it). Not verified: whether the other platforms also show the list in the game's own menus. One row does: `challenge-completion-achievement`, the Completion achievement for a 100% finish at an ending ([wiki Completion](https://hollowknight.wiki/w/Completion_(Silksong))). The guide gives no total: Nintendo Life counts 50 and other sites 52, unsettled.

## By chapter

Each fixer's notes: claims the pages leave open, details cut for want of a page, and prices a patch changed. A row named here with no open question is settled; it's kept for the record of how it was read.

### Chapter 1

| Row | The guide says | Open question, and the sources | What would settle it |
| --- | --- | --- | --- |
| `mossberry-5` | Moved to chapter 4, after the Wanderer Crest: Bonegrave needs Cling Grip | Wiki Bone_Bottom (raw wikitext): Bonegrave opens from the Wormways past the Simple Key door, or from above the Ruined Chapel with Cling Grip. Neoseeker Berry_Picking (read in the browser): reachable "after you unlock the door to the Wormways". The berry on an Aknid above the graves: wiki Mossberry | A playthrough |
| `wish-berry-picking` | Moved after Silkspear, which cuts the threads in front of the Druid's cave | Wiki Moss_Druid: the cave is behind silk threads that need Silkspear | None needed |
| `wish-chapel-maid` | Meet the Chapel Maid; the Wishwall goes up after the Bell Beast | Wiki Chapel_Maid gives her no Wish, so the row is a route step (`route`) and doesn't count. Wiki Bone_Bottom and Flick_the_Fixer: Flick finishes the Wishwall after the Bell Beast | None needed |
| `pickup-quill` | Shakra is found by her singing, in the upper left of the room | Neoseeker The_Marrow (read in the browser): "You'll hear someone singing", upper left. Wiki Shakra (raw wikitext) mentions neither singing nor rings. Quill price and use: wiki Map_and_Quill_(Silksong). | A second host on how she's found |
| `tool-straight-pin` | Break the bars of the thief's cell, climb up inside for the pin | Wiki Straight_Pin: "inside of Grindle's cell"; wiki Grindle: bars broken by repeated hits. Neoseeker The_Marrow_Revisited (read in the browser): break the gate, talk to him, "go up and grab" the pin. The audit had flagged "ledge above" against "inside": both pages are compatible with a pin up inside the cell. | A playthrough |
| `tool-shard-pendant` | Small side room off the chamber under the Marrow Bellshrine, past a large skull enemy | Wiki Shard_Pendant gives the position; Neoseeker The_Marrow (read in the browser) takes it before the Bell Beast after a large skull enemy. Neither says the Bellshrine must be rung first; the row doesn't either. | A playthrough |
| `craftmetal-2` | Blow open a rock tunnel in the big northeast room with the glowing orange spots, then strike the ore | Wiki Craftmetal: "exploding a tunnel of rock", large room in the northeast Marrow (west of the Hunter's March entrance). Neoseeker The_Marrow_Revisited (read in the browser): the orange spots and the chain of blasts. The draft's pressure plates and traps had no page and are gone. | A playthrough |
| `flea-the-marrow` | Ring the Bellshrine, go through its gate, up across vanishing platforms, drop on the right to the flea in vines | Wiki Flea: "platforming from the beginning of the room", needs the Bell Beast and the Bellshrine. Directions from Neoseeker The_Marrow_Revisited (read in the browser). | A playthrough |
| `mossberry-3` | In the room below the Moss Druid's cave, break into the hidden space under the ledge: an Aknid flies there carrying this berry | Settled on 19 Nov 2026 as one berry seen two ways: wiki Mossberry (carried by an Aknid in the room below the Druid's home), [PC Gamer](https://www.pcgamer.com/games/action/silksong-mossberry-locations-berry-picking) (a hidden space under the ledge, “a bug flying around with a Mossberry”) and [Nintendo Life](https://www.nintendolife.com/guides/hollow-knight-silksong-all-mossberry-locations-and-what-they-do) (a bug's mouth, a hidden corridor) give the carrier, and Neoseeker Berry_Picking (a breakable wall below the Druid, no carrier named), PC Gamer and Nintendo Life give the hidden way in. Only Neoseeker says outright that a wall breaks; the row says “hidden space”. The Map Genie pin (478141) wasn't readable | A playthrough |
| `mossberry-4` | An Aknid right of the lift above the town, under the floating ledges | Wiki Mossberry: "Carried by an Aknid above the town". Neoseeker Berry_Picking (read in the browser): right of the elevator above Bone Bottom, "when you unlock the elevator"; whether the lift must be unlocked first is unclear. | A playthrough |
| `mossberry-2` | Bounce off a flying bug with a down-strike if the jump is too high | Wiki Mossberry gives only "top of the eastern room"; the bounce is Neoseeker Berry_Picking's (read in the browser). | A second host |
| `map-mosslands`, `map-the-marrow` | Shakra's later post is her ledge above Bone Bottom's Wishwall | Wiki Shakra: "a ledge on the eastern side of Bone Bottom" after the Bell Beast; Neoseeker The_Marrow_Revisited: rings above the notice board. | A playthrough |
| `route-escape` | Bench on the left as you enter the Ruined Chapel; a hit mid-Bind loses the Silk | Wiki Moss_Grotto (Ruined Chapel section) and wiki Bind (fetched as raw wikitext 19 Nov 2026). "Hold Bind" from the draft had no page and is gone. | None needed |

Pages fetched for this pass as raw wikitext on 19 Nov 2026, besides the audit's cache: Chapel_Maid, Silkspear, Flick_the_Fixer, Bone_Bottom_Repairs, Silk_Heart, Moss_Druid, Fleamaster_Mooshka, Pebb, Grindle, Bind, Weaver_Burial_Spire, Bench_(Silksong). Neoseeker pages were read in the browser (plain fetches are refused): The_Marrow, The_Marrow_Revisited, Berry_Picking. Nobody replayed the game.

Left out on purpose:

- Pebb's unsold goods (Simple Key, Magnetite Brooch, Mask Shard, Craftmetal) are sold later by another merchant for more. Chapter 1 is public, so its rows give only Pebb's prices; ch11 carries the fallback.
- `mossberry-4`'s Aknid moving one room east later in the game (wiki Mossberry): a story change, left out.
- Pebb closing her shop once her stock is bought, and where she turns up afterwards (wiki Pebb): spoils her.
- The Lost Fleas' reward and where the Caravan goes next (wiki The_Lost_Fleas): later chapter.
- Bone Bottom Repairs being the prerequisite for Flick's bridge Wish (wiki Bone_Bottom_Repairs): that Wish is in ch4.
- Where Shakra moves after the first boss of a later chapter (wiki Shakra).
- The Moss Druid's Rosaries for spare berries: random amounts (131, 157 or 173 in a random order, wiki Mossberry).

Patch-dated prices: none in this chapter (both Bellways here are free, wiki Fast_Travel_(Silksong)).

### Chapter 2

| Row | The guide says | Open question, and the sources | What would settle it |
| --- | --- | --- | --- |
| `boss-lace-docks` | Fight her on this visit: travel on to the regions beyond the Far Fields first and the Docks duel never happens | **Missable candidate, one reputable host.** Wiki Lace (raw wikitext): if she hasn't been fought in the Docks and Hornet enters Sinner's Road or the Blasted Steps, she talks to Hornet there and the Docks fight no longer occurs (beating her in the Cradle then completes the Journal entry). Wiki Far_Fields: if the Blasted Steps or Sinner's Road were visited through the Wormways first, Lace isn't in the Docks. Not a reputable second host: a Steam forum thread (player reports, steamcommunity.com/app/1030300/discussions/0/595159120097825475) of players who met her on the bridge before the Blasted Steps and never got the Docks fight; a Nintendo Life reader comment that visiting Greymoor or Shellwood first moves her on (a different condition). Nintendo Life's boss list, Neoseeker's Lace and Deep_Docks pages and Fextralife's Lace page don't mention it. Not in missables.ts. | A second independent reputable host, or a playthrough that reaches the Blasted Steps or Sinner's Road before the Docks |
| `tool-flintslate` | Moved to chapter 8, after the Forebrothers: the lower Docks open with Clawline from the Far Fields side | Wiki Flintslate gives the position. Wiki Deep_Docks: the lower Docks open with a Simple Key on the door south of Forge Daughter, or from the Far Fields side with Clawline. Neoseeker's Clawline exploration page (read in the browser) collects it through the Far Fields' bottom-left exit with Clawline | A playthrough |
| `craftmetal-3` | First Far Fields pass: false wall from the Warding Bell's dark tunnel, then the wooden beams, then the chest; two bombers appear; no key needed, the Docks' locked door is the other way into the room | Wiki Craftmetal: “a chest behind the locked door”, southwest corner of the bottom-most Docks room linking to the Far Fields, with no requirement listed. [allthings.how's Far Fields page](https://allthings.how/silksongs-far-fields-how-to-reach-the-drifters-cloak-and-fourth-chorus/) has the same route (a left wall in the Warding Bell room, a loop into the Docks, a chest, bomb-throwing foes) with no key; [its Craftmetal page](https://allthings.how/hollow-knight-silksong-craftmetal-locations-and-smart-uses/) says the chest is past a locked gate in the Docks or reached by a hidden passage from the Far Fields (“you may need a Simple Key depending on your route”); game-checklists lists it under Deep Docks as the Flintflame Flyer Arena, accessible from the southern Far Fields. So the locked door is the Docks-side way in (a frame, not a contradiction), and the row's sentence now says so. Not found on any page read: the wooden beams, “two” flyers and the lower-left corner of the wall, which come from Neoseeker Far_Fields (the row's reference; WebFetch got a 403 for it on 19 Nov 2026, so it wasn't re-read). The Map Genie pin (477937) wasn't readable | A playthrough, or Neoseeker Far_Fields re-read |
| `tool-warding-bell` | Bottom of the windy shaft below Shakra's Far Fields room, the dark tunnel on the left, up toward the light, on a dead Smelt Shoveller | Wiki Warding_Bell: dead Smelt Shoveller in the lower Far Fields beside the lower Docks entrance. Neoseeker Far_Fields (read in the browser) gives the route on the first Far Fields visit. They agree; the audit couldn't show it was reachable in ch2, Neoseeker does. | None needed |
| `flea-deep-docks` | Sprint left from the Swift Step spire, lever at the far wall lowers a weight, jump to the ledge above | Settled on 19 Nov 2026 for the row. Neoseeker Deep_Docks (read in the browser) gives the same steps: the leftmost wall, the lever, the weight, the upper-left ledge. Nintendo Life's Lost Flea page agrees on the direction (cross the room right to left); search summaries of Deltia's Gaming and others say the same (lever at the far end). Only the wiki's Flea page says “the lever in the upper right corner of the room”, with no weight or ledge. PCGamesN, PC Gamer (via inkl) and Insider Gaming say the same by search summary (a lever on the left lowers a block or bell; the pages weren't opened), so the wiki's “upper right corner” most likely places the room, not the lever. The Map Genie pin (477916) wasn't readable | None needed |
| `flea-deep-docks-bellway` | Break the wall left of the Docks Bellway station, cross the lavafalls on the upper platforms | The wiki's Deep Docks flea #1 (wiki Flea: "behind a breakable wall on the left side of the Deep Docks Bellway station"; Map Genie 477907 sits beside the Docks Bellway pin 477905). Neoseeker Deep_Docks (read in the browser) gives the lavafall room. It was filed as `flea-the-marrow-2` in the Marrow; it's a new id now. | None needed |
| `route-docks-enter` | Cross the north of the Marrow to its southeast exit into the Docks | Wiki Deep_Docks. Neoseeker entered the Docks from another side, so the Marrow-side order of rooms (which bench comes first) isn't confirmed; the row stays general. The draft's "wait for the moving lifts" had no page and is gone. | A playthrough from the Marrow side |
| `route-forge-daughter` | Floor lever below Shakra's shaft, the bunker, the arena, the gated bench, then Forge Daughter; 430 Rosaries and two Craftmetals for her three counted items | Wiki Forge_Daughter: the way to her is locked until the enemy gauntlet is done; prices. Route from Neoseeker Deep_Docks (read in the browser). The draft's "permanent once made" had no page and is gone. | None needed |
| `boss-lace-docks` (tactics) | Jump the lunge, don't hit her guard, leave the white circle from halfway | Wiki Lace (Deep Docks attacks); the gate lever from Neoseeker Deep_Docks (read in the browser). | None needed |

Pages fetched for this pass as raw wikitext on 19 Nov 2026, besides the audit's cache: Tool_Pouch_&_Crafting_Kit, Bench_(Silksong). Neoseeker pages read in the browser (plain fetches are refused): Deep_Docks, Far_Fields, Clawline_&_Double_Jump_Exploration, Lace. Nobody replayed the game.

Left out on purpose:

- "The shrine the Grand Gate objective lists" (`route-docks-shrine`): that objective starts only later, outside the Grand Gate, and the name is a later place.
- Skipping Lace with Pebb's Simple Key or the Flea Caravan (wiki Lace, Far_Fields): the route fights her, and the skip names later places.
- Forge Daughter's Shard Bundle (50 Rosaries) and her Silkshot repair: not counted rows here.
- Pebb's haunted form in the easternmost Marrow room (wiki Pebb): spoils her.

Patch-dated prices:

- `bellway-deep-docks`: 40 Rosaries since Patch 1 (1.0.28497); was 50 (wiki Fast_Travel_(Silksong) history). Neoseeker's Deep_Docks walkthrough, written at launch, still says 50.
- `bellway-far-fields` (the row is in ch3): 40 Rosaries since Patch 1 (1.0.28497); was 50 (same page).

### Chapter 3

Every wiki page below was read as raw wikitext (`?action=raw`) on 19 November 2026. Nintendo Life's tools page was read from the audit's saved copy of the same day. Neoseeker's Memory Locket and Lost Flea pages were read in the browser (fetching is refused there): for the Far Fields and Greymoor they show only pictures, so they confirm nothing in this chapter beyond Mort selling a locket.

| Row | The guide says | Open question, and the sources | What would settle it |
| --- | --- | --- | --- |
| `boss-fourth-chorus` | Two ceiling explosives drop a boulder on its head, but that finisher is optional. The fight doesn't lock you in | Wiki Fourth Chorus says both. Wiki Far Fields adds that you can leave "after defeating or skipping" it, so the fight itself is skippable, yet the row is a boss target. Wiki only | A playthrough of the fight, or a second host |
| `boss-moorwing` | Seen three rooms west of the Bellway. Its arena is where the road leaves Greymoor westward. Skipped if the Caravan already sits there or you came into the town from its far side, and then it waits later outside the Greymoor Bellway | Wiki Moorwing gives all of it, and says the later fight comes "once Act 2 begins". The row says only "later", because chapter 3 can't announce Act 2. Wiki Flea Caravan agrees on the Caravan skip. "About two-thirds health" stands for the wiki's 65% | A second host for the skip conditions |
| `wish-garmond-greymoor` | First met on an outcrop up and left of the Greymoor Bellway station. A word with Garmond matters later. After you've seen Moorwing, speak to Garmond again (or enter its arena) and they move above it and offer help | Wiki Garmond and Zaza: talking to him "at any point" keeps the friendly duel open, and the pair can also be met later on the road and in other areas. So the row is neither a Wish nor missable: it's a route step, off the strip | None needed |
| `route-greymoor-shrine` | The great bell somewhere in Greymoor, with no position given | No page read places the Greymoor Bellshrine in words: wiki Bench (Silksong) only has a map image. Ringing it puts the map in Shakra's stock (wiki Shakra's shop table, read from the game's files) | A page that places it in words, or a playthrough |
| `map-greymoor` | Shakra camps where Craw Lake begins, with a bench, and sells the map there | Wiki Greymoor and wiki Shakra place her temporary camp at the Craw Lake entrance and say it goes once you clear the gauntlet. No page says her Greymoor shop is at that camp: that's inferred | A playthrough |
| `tool-threefold-pin` | Reached by balloons after the Craw Lake gauntlet, at the top right of the lake room, in a hidden cave behind a large Craw | Wiki Threefold Pin: a hidden cave above Craw Lake, on Greymoor's eastern edge. Nintendo Life gives the balloons, the upper right and "behind a large craw enemy". The two hosts agree on the place | Settled by two hosts. A playthrough for the Craw |
| `flea-greymoor` | Bounce across the balloons and keep to the right-hand wall. The flea is to the right of the lake | Wiki Flea (balloons, right wall, after the gauntlet) and wiki Greymoor (the flea right of the lake, guarded by a Tallcraw; the row leaves the Tallcraw out). Wiki only | A second host |
| `memory-locket-greymoor`, `relic-bone-scroll-greymoor` | Only the wiki's position: west of the Bellway, east of Halfway Home | The draft's ledge above the Mitemother, and its concealed room with a swim, are on no page read, so they were cut | A page or a playthrough that gives the way in |
| `flea-far-fields`, `mask-shard-3`, `relic-bone-scroll-far-fields` | Positions as the wiki gives them, with no further directions | Wiki Flea, Mask Shard and Bone Scroll. The draft's "lower trap corridor" and "hidden left-side route" were on no page read and were cut. The Map Genie pins carry the rest | A page with directions |
| `map-far-fields` | If you pass Shakra by, she has the map at Bone Bottom once you own the Drifter's Cloak | Wiki Shakra's shop table, which the wiki says it read from the game's `shopitems.bundle`. Wiki only | A playthrough |

Left out on purpose:

- Mort's later fate. Wiki Mort and wiki Grindle: his unsold Tool Pouch and Memory Locket move to Grindle in the Blasted Steps (the pouch at the same 220, the locket at 250), and the Weighted Belt ends up on his body west of Pilgrim's Rest. The chapter can't name any of it, so `pouch-mort` and `tool-weighted-belt` say nothing about it. `memory-locket-far-fields` says only "it costs more later", which rests on the locket's 150 against 250. Chapter 11 carries the fallbacks.
- Fourth Chorus vanishing, and its Journal entry filling in, if you never fight it (wiki Fourth Chorus): it happens only in the third act.
- The draft's tip in `wish-flexile-spines` to leave and re-enter for more Hokers is on no page read and was cut.
- The Reaper Crest's chapel shuts once you leave with the crest (wiki Greymoor and Reaper Crest), so nothing there can be missed.

Prices a patch changed (wiki Fast Travel (Silksong), history):

- `bellway-greymoor`: 60 Rosaries since Patch 1 (1.0.28497). It was 80.
- `bellway-far-fields`: 40 Rosaries since Patch 1 (1.0.28497). It was 50.
- The Bone Scroll's sale value is 90 since Patch 1 (it was 50). No row quotes it.

### Chapter 4

Every wiki page below was read as raw wikitext (`?action=raw`) on 19 November 2026, including the five Wish pages the audit couldn't reach: Silver Bells, Garb of the Pilgrims, The Terrible Tyrant, Volatile Flintbeetles and Crawbug Clearing (plus Wanderer Crest). Nintendo Life's tools and progression pages were read from the audit's saved copies of the same day. Neoseeker's Memory Locket page was read in the browser (fetching is refused there).

| Row | The guide says | Open question, and the sources | What would settle it |
| --- | --- | --- | --- |
| `wish-crawbug-clearing` | After Widow, take the Wish from Bellhart's wall or from Creige at Halfway Home. Bring him 25 Ragpelt from the Craws, Tallcraws and Squatcraws of eastern Greymoor, and he gives you a Crafting Kit and puts a scarecraw on his roof | Wiki Crawbug Clearing gives all of it, including the drops (1 from a Craw, 2 to 5 from the larger two), Creige's tip that the mature ones near the watermound pay better, and farming the roof Craws by resting. "Out by Craw Lake" reads his watermound as Craw Lake's. The draft's "nests at Craw Lake and the towers" were wrong. This row now also stands for the removed `kit-crawbug-clearing`. Wiki only | A second host |
| `ability-needolin` | Binding Widow's power after the fight gives the Needolin, then a memory follows in which you play it at a Weavenest door. There's no traversal section | Wiki Widow (the Bind, then the memory) and wiki Needolin (the Weavenest door in her memory). Wiki only | A playthrough |
| `boss-widow` | Reached from Shellwood's upper right corner, through Bellhart's bellveins | Wiki Widow, Location. Nintendo Life's progression page says you loop back to Bellhart after Cling Grip | Settled by two hosts |
| `ability-cling-grip` | Right of Sister Splinter's arena, past some platforming, at a Weaver Burial Spire. Then the upper paths loop back to Bellhart | Wiki Cling Grip for the spire. The loop is Nintendo Life's progression page plus wiki Widow's Location | Settled |
| `route-shellwood-shrine`, `bellway-shellwood` | The upper west road, up a lift shaft past Winged Pilgrims with Cling Grip, with the Bellway just right of the bell | Wiki Shellwood only. The draft's "lower paths" were wrong | A second host |
| `flea-bellhart` | Right of Sister Splinter's arena, with Cling Grip, in the uppermost bellvein tunnel among the bells | Wiki Flea (table and screenshot caption). The draft's false wall and cage were wrong. Wiki only | A second host |
| `memory-locket-bellhart` | Frey sells it for 330 as soon as Bellhart is freed | Wiki Memory Locket: needs only the town saved. Wiki Frey's goods table lists no requirement. Neoseeker (in the browser) agrees that the Bellhart shopkeeper sells it, without giving the condition. The draft's "after My Missing Courier" was wrong | Settled for the seller. A playthrough for the timing |
| `tool-pimpillo` | Break through the ceiling above Yarnaby's bellhome in north-west Greymoor to a bench, and craft it there for one Craftmetal | Wiki Pimpillo (the bench above her home, one Craftmetal), wiki Yarnaby (north-west Greymoor), Nintendo Life (break the ceiling). The draft said Cling Grip is needed. Search-result summaries of other guides (Deltia's Gaming, Sportskeeda) say so too, but no page read states it, so the row leaves it out. The row sits after Cling Grip either way | A playthrough |
| `tool-weavelight` | Look for it in the Moss Mothers' arena once both are down | Wiki Weavelight says only “found after defeating the Moss Mothers”. The draft's ceiling fixture came from two screenshot captions (“Inside ceiling artifact”, “On the floor”) and was cut from the row | A playthrough |
| `relic-weaver-effigy-bone-bottom` | West of Mosshome, below the locked door on that side | Wiki Weaver Effigy says "below the entrance to Wormways". The row doesn't name the Wormways, which are chapter 5's. That their entrance is the locked door west of Mosshome comes from wiki Shellwood (a Simple Key opens it). The draft's glide down from above, with the Drifter's Cloak, is on no page read and was cut | A playthrough |
| `crest-wanderer` | Bonegrave, past the Ruined Chapel: traps around hanging Rosaries, a gauntlet, then Bind the corpse. The chapel shuts once you leave | Wiki Bone Bottom (Bonegrave and the Chapel of the Wanderer) and wiki Wanderer Crest. No page read says what Bonegrave needs to reach, so the row may belong earlier than chapter 4. It isn't before any requirement | A page or a playthrough that gives its requirement |
| `wish-silver-bells` | Eight Silver Bells from the bell tunnels over and under the town. The tunnels under the Bellway are best. Reward: a Rosary Necklace | Wiki Silver Bells. The bells appear by chance at hidden spots (25% each, 30% with the Magnetite Dice), so the row gives no odds. Wiki only | A second host |
| `wish-terrible-tyrant` | Needs Cling Grip. The Skull Tyrant is in an alcove off the lower Marrow, and hits from above do nothing to it. Reward: a Heavy Rosary Necklace | Wiki The Terrible Tyrant and wiki Skull Tyrant. The draft left the reward out. Wiki only | A second host |
| `wish-garb-of-the-pilgrims` | 12 Pilgrim Shawls from any enemy with "Pilgrim" in its name, none during gauntlets, most easily in Mosshome. Reward: a Rosary Necklace | Wiki Garb of the Pilgrims. Wiki only | A second host |
| `wish-volatiles` | Once you've been to Greymoor or Shellwood. Three Flintbeetles in the Marrow, tracked by their dung, for a Memory Locket | Wiki Volatile Flintbeetles and wiki Memory Locket. The Memory Locket table says "Reach Greymoor", but the Wish page says Greymoor or Shellwood: the row follows the Wish page | A playthrough |
| `spool-fragment-3` | With Cling Grip, the upright planks north-east of Halfway Home, east to a balloon lever, up to the top above Shakra's camp bench | Wiki Spool Fragment. The draft's "north-east of the Greymoor Bellshrine" was on no page read. Wiki only | A second host |
| `flea-far-fields-2` | Through a secret area in the Far Fields Bellway station, because the gate from Pilgrim's Rest stays locked. Needs the Drifter's Cloak and Cling Grip | Wiki Flea. The draft's "to the right of the Bellway" was on no page read | A playthrough |
| `flea-shellwood` | Enter the room from the top. The flea is in vines below the stretch of Gahlias | Wiki Flea (table and screenshot caption). The draft's "pit with Pollenica and Phacia" was on no page read | A second host |
| `tool-longpin` | Above the passage between Shellwood and Bellhart, in a bell behind a Wood Wasp nest, by a dead Pondcatcher. The room shows in Bellhart's colour although it counts as Shellwood | Wiki Longpin, wiki Shellwood's trivia (the map colour). Nintendo Life: "the northeast corner of the first large area of Shellwood", which fits | Settled by two hosts |
| `mask-shard-5` | The passage between the Marrow and Deep Docks, from the Marrow side. Cling Grip makes the climb easier | Wiki Mask Shard says Cling Grip is "recommended", not required, so the shard may be reachable before chapter 4 | A playthrough |
| `route-atla` | Play the Needolin at the door every time, switch on the power room, read the rune tablet for the map, break through the south-east walls to Eva, and meeting her evolves the Hunter Crest | Wiki Weavenest Atla, wiki Eva, wiki Map and Quill. No page read says where the map tablet is. Wiki only | A playthrough |
| `wish-restoration-of-bellhart` | Appears after a Needle upgrade, a relic sold to Scrounge, a talk with Pavo, then a rest at a bench outside Bellhart and a return. 250 Rosaries | Wiki Restoration of Bellhart. The follow-up Wish, Bellhart's Glory, isn't named. Wiki only | A second host |

Left out on purpose:

- What happens to Loddie's game, Bone Bottom and its Wishwall in the third act (wiki Loddie, Garb of the Pilgrims, The Terrible Tyrant, Volatile Flintbeetles). Garb of the Pilgrims and The Terrible Tyrant drop off the Wish list if they're unfinished then. Volatile Flintbeetles drops off the Wish list too if unfinished (wiki), though its locket isn't lost: it turns up on the ground at the Survivor's Camp. The draft's "finish before Act 3" was cut from chapter 4; chapter 9's last group says what won't wait, and chapter 11's note where the locket lies. Loddie's Tool Pouch can then be taken from his desk. None of this can be said before chapter 9: a "before the story moves on" warning for the two Wishes belongs to the missables strip or chapter 11.
- `relic-rune-harp-weavernest-atla` keeps "weavernest" in its id (ids never change). Only the title is corrected to Weavenest.
- The Snare Setter, in the same Atla room as `spool-fragment-5`, needs the Faydown Cloak and belongs to a later chapter.
- The group that held `relic-choral-commandment-bone-bottom` was "Moss Grotto". It's now "Mosshome": the Commandment is reached from Mosshome's western edge, and it lies in the shaft above Bone Bottom (wiki Choral Commandment). Mosshome is a sub-area of Bone Bottom (wiki Bone Bottom).

Prices a patch changed (wiki Fast Travel (Silksong), history):

- `bellway-bellhart`: 60 Rosaries since Patch 1 (1.0.28497). It was 80.
- `bellway-shellwood`: 40 Rosaries since Patch 1 (1.0.28497). It was 60.

### Chapter 5

Every row rests on hollowknight.wiki, read as raw wikitext (`?action=raw`) on 19 Nov 2026; Nintendo Life backs the route order only. Neoseeker answered with a bot check (HTTP 429) on 19 Nov 2026, so nothing was read there and no placement has a second host.

| Row | The guide says | Open question, and the sources | What would settle it |
| --- | --- | --- | --- |
| `route-act-two` | Stepping into the Citadel after the Last Judge starts Act 2; from the hall, the scales lead to a breakable wall into the Choral Chambers, or the lift crashes into the Underworks | Wiki Acts gives the trigger ("entering the Citadel after defeating the Last Judge or Phantom"); wiki Grand Gate and Choral Chambers give both ways up; wiki Underworks calls the lift the common way; Nintendo Life says a Blasted Steps entry "automatically" ends in the Underworks. The row follows the wiki and gives both. Raw wikitext; Nintendo Life from the audit's cached copy | A playthrough from the Last Judge's door |
| `route-march` | The windy shaft at the end of the March needs the Drifter's Cloak | Wiki Hunter's March and Nintendo Life's article agree; a reader comment under the Nintendo Life article says only one bit at the end needs it | A playthrough |
| `route-wormways-keydoor` | Four keys for four locks; the Deep Docks lock only saves a detour | Wiki Simple Key alone | A second host (Neoseeker's Simple Key page) |
| `boss-last-judge` | "The five Bellshrines of lower Pharloom", not listed | Wiki Acts lists the objective's bells as the Marrow, Far Fields, Greymoor, Bellhart, Shellwood; wiki Bench lists the Marrow, Deep Docks, Greymoor, Bellhart, Shellwood. The row names none | The objective screen in a playthrough |
| `tool-magnetite-dice` | Releasing as Hornet turns her wrist, around the 14th shake, wins the roll; Lumble starts with 16 Rosaries | Wiki Lumble the Lucky alone (it cites the game's code for the 16) | A playthrough |
| `tool-curveclaw` | Nothing about its completion point: the row says where Curveclaw is and costs 140 Rosaries; the lost point is `challenge-curvesickle`'s (chapter 10) | Wiki Completion's disclaimer says handing Curveclaw to a Skarr takes its point away until it is upgraded. Wiki Curveclaw says the upgrade isn't needed for 100%, which holds only if the claw is never handed over (Curveclaw itself counts while you hold it), the reading `challenge-curvesickle` takes too | A second host, or a save checked before and after |
| `tool-curveclaw` | Mottled Skarr's camp: a hidden way through the west wall of the room north of the March's bench, then a trap-lined tunnel crossed with Swift Step | Wiki Mottled Skarr alone | A second host |
| `map-sinners-road`, `map-hunters-march`, `map-wormways`, `map-blasted-steps` | Where Shakra waits | Wiki Shakra places her only in map images. Sinner's Road rests on wiki Sinner's Road's gallery caption ("Shakra near broken bench"); the March on wiki Shakra's text (the tunnel east to the Chapel, if she didn't join the ambush); the Wormways and the Steps give no spot | Neoseeker, or a playthrough |
| `memory-locket-blasted-steps` | In the room above "the first bench of the Steps" | Wiki Memory Locket's words; which bench counts as first (the entrance toll bench, probably) isn't said | A playthrough |
| `flea-sinners-road`, `flea-hunters-march`, `flea-wormways`, `flea-blasted-steps`, `memory-locket-hunters-march`, `memory-locket-wormways`, `mask-shard-2`, `tool-dead-bugs-purse`, `tool-barbed-bracelet` | Placements as the wiki's tables give them | Wiki only. The draft's extra details were cut as unbacked: the red-pod column (March flea), "jump the first cage, strike the right side" (Sinner's Road flea), the hidden chamber (Wormways flea), the pool and Swift Step crossing (mask shard), the two Gromlings (purse), "lower side ledge" (Steps flea) | Neoseeker's flea, locket and shard pages in the browser |
| `wish-roach-guts` | Nothing about the Wish closing | Wiki Roach Guts (Wish): the Wish leaves the Objectives if unfinished when Crull and Benjin die at the start of Act 3. One host; no Act 3 talk is allowed before ch10. A candidate for a lost Wish | A second host |
| `ability-needle-strike` | Moved after the Great Conchflies: the Pinstress lives past their arena | Wiki Pinstress and Great_Conchflies | None needed |

Left out on purpose:
- Act 3 fallbacks: the Tacks on Crull and Benjin's bodies, the Magnetite Dice at Grindle for 300, the Curvesickle by name (the row says "until you upgrade it"). The ch11 fixer notes the fallbacks.
- What kills Mottled Skarr and Lumble (the Cogwork Dancers, the First Shrine bell or Clawline, then a bench): later chapters, so the rows say "if he's gone".
- The fourth Simple Key lock (High Halls' Rosary Bank) is "further along the route"; the draft's "High Halls holds a counted Tool" was unbacked and is cut.
- The Sinner's Road road to the Citadel is "a harder road this guide leaves for later": Phantom and the Exhaust Organ are not named.
- The Green Prince's cage opening Lost Verdania in Act 3.
- The draft's unbacked lines: "Bind when the boss is far away", "buy the local map after you reach a safe platform", "Grindle also has them in Act 3".

Patch-dated prices:
- `bellway-blasted-steps`: 60 Rosaries since Patch 1 (1.0.28497); was 80 (wiki Fast Travel, History).
- `route-sinners-road`: the toll bench is 40 Rosaries since Patch 1 (1.0.28497); was 60 (wiki Bench, History).
- `route-blasted-steps`: the entrance toll bench is 60 Rosaries since Patch 1 (1.0.28497); was 80 (wiki Bench, History).

### Chapter 6

Every row rests on hollowknight.wiki, read as raw wikitext (`?action=raw`) on 19 Nov 2026; Nintendo Life backs the Citadel route order only. Neoseeker answered with a bot check (HTTP 429) on 19 Nov 2026, so nothing was read there and no placement has a second host.

| Row | The guide says | Open question, and the sources | What would settle it |
| --- | --- | --- | --- |
| `pickup-white-key` | The key lies on the Surgeon only "before you ring the First Shrine, while Songclave still stands empty" | Wiki White Key: on the body "if Songclave has not yet become a town", else Jubilana sells it for 220. Wiki Choral Chambers: Songclave "becomes active" once the First Shrine rings. The row equates the two | A playthrough |
| `route-first-shrine` | The First Shrine is the sixth Bellshrine | Wiki Bench alone (the audit's second host covers only the five old bells) | A second host |
| `route-underworks` | One of the crematorium's furnaces is the Whiteward's way down into the Underworks, toward the Cauldron | Wiki Whiteward: "entering one of these furnaces leads down to the Underworks". Wiki Underworks and Clawline: the eastern half is reached by a "hidden passage" / "side passage" in the Whiteward. The row treats them as one route | A playthrough |
| `route-architect` | The Architect rebuilds a broken Weaver weapon into its Silkshot; the weapon lies past a breakable wall in eastern Sinner's Road, across the region beyond, behind a Needolin door in its south-east corner; only one version can be made | Wiki Ruined Tool (reachable in Act 1) and Silkshot, one host. The row names neither Bilewater nor Weavenest Murglin (ch9) | A second host |
| `wish-savage-beastfly` | Merged row: the second Beastfly's Wish needs the Chapel Beastfly, the Fourth Chorus and Songclave; the Horn Fragment buys the Mask Shard | Wiki Savage Beastfly (Wish) and Mask Shard agree; one host | A second host |
| `challenge-loddie-three` | Payout per hit (1 / 2 / 3 Rosaries at 1–6 / 7–12 / 13+), a purse of 380 that grows by 25 per paid round | Wiki Loddie alone (it cites the game's code) | A playthrough |
| `flea-choral-chambers-2` | A mechanism behind the lower wall lets the Drifter's Cloak reach the flea; or bounce off the sawblades | Wiki Flea's words. The title's "fan" and the draft's updraft aren't on the page; the title was left as drafted | A playthrough |
| `spool-fragment-9`, `spool-fragment-11` | `-9` is the fragment east of the Cauldron (wiki #12), `-11` the one past the central gauntlet (wiki #8) | Matched by the draft's own descriptions; the Map Genie pins (478704, 478931) are unread: WebFetch can't fetch mapgenie.io and the pin text is JS-only, and neither of Neoseeker's databases was reachable (403 on 19 Nov 2026) | Open the two pins |
| `spool-fragment-12` | From the top, call the lift up, drop into the shaft, duck aside, fall past its usual stop | Wiki Spool Fragment's "call up the lift using the buttons on the top" read as standing at the top | A playthrough |
| `relic-bone-scroll-underworks` | Under the map room in the western Underworks | Wiki Bone Scroll: "Western Underworks" in its table, "Under the map room" in a gallery caption | A playthrough |
| `ventrica-choral-chambers` | No location given | No page read places this stop | Neoseeker's Ventrica page |
| `pouch-nuu` | Filed in ch6 | 100 Journal entries by ch6 wasn't checked; the placement is the draft's | A count of the enemies reachable by ch6 |

Left out on purpose:
- Fine Pins plus the Threefold Melody sends Garmond and Zaza to rest in Songclave, ending their duel (wiki Garmond and Zaza). That belongs to ch7's `wish-garmond-zaza-act-two`; the Fine Pins row would have to name the melody (ch7). The draft's "friendly Garmond duel, with the Threefold Melody" gate on Fine Pins was this condition misread.
- Trobbio's lift into the eastern Underworks (ch7) is not named in `route-underworks` or `ability-clawline`.
- The Architect stops trading once everything but the Silkshot is bought and the Architect's Melody (ch7) is learnt (wiki Twelfth Architect): the row says only "won't be trading forever". The Mount Fay and Forge Daughter variants aren't named.
- Loddie is gone in Act 3 and Flick's statue is destroyed in Act 3 (wiki Loddie, An Icon of Hope); the draft's "before Act 3" and "before the next act" are cut. Neither page says the challenge or the Wish closes, only Loddie's absence (one host).
- Broodfeast's effect on Choir Cloak drops with the Sawtooth Circlet (a later Wish).
- The draft's unbacked lines: "rest before returning" (Building Up), "station signs" (Grand Bellway), the "Undercrank ambush" (craftmetal-5), the false wall and secret corridor (Bone Scroll, Psalm Cylinder), "buy before finishing the order" (Cogwork Wheel), the "memory sequence" wording.
- The audit's possible gaps are already rows elsewhere: Jubilana's 500-Rosary Spool Fragment is ch9's `spool-fragment-18`; the Memory Locket above the Grand Bellway is ch9's `memory-locket-choral-chambers`.

Patch-dated prices:
- `bellway-grand-bellway`: 80 Rosaries since Patch 1 (1.0.28497); was 120 (wiki Fast Travel, History, where it's listed as "Choral Chambers").
- `wish-fine-pins`: 12 pins since Patch 3 (1.0.28891); was 10, and the drop went from a 50% chance to certain (wiki Fine Pins, History).

### Chapter 7

| Row | The guide says | Open question, and the sources | What would settle it |
| --- | --- | --- | --- |
| `route-conductors-melody` | the High Halls need Clawline; a gap needing an ability the reader lacks can wait, the double jump unnamed | See the source-check table above: the sources split, and the data follows the wiki. The one double-jump room the wiki names there, the Clawmaiden control room, is optional and has no row | a playthrough entering the High Halls and reaching the Forum without the Faydown Cloak |
| `route-architects-melody` | the Core's summit needs no double jump | The wiki (Cogwork Core, Threefold Melody) names no ability for the climb or the puzzle, and its Cogwork Core page never mentions a double jump. Nintendo Life says Clawline is needed to reach the top and the double jump is “pretty useful” for the puzzle; intoindiegames' walkthrough names Clawline alone for the climb; Gameranx says the double jump is “required to get all three melodies” and, elsewhere on the page, “only required for third melody” without naming it. The data follows the wiki | a playthrough of the upper Core without the Faydown Cloak |
| `route-conductors-melody` | the Forum gauntlet has eleven waves | The wiki's High Halls page says eleven waves; Nintendo Life calls it a ten-wave trial. The data follows the wiki | a playthrough count |
| `wish-garmond-zaza-act-two` | the duel is on the roof above the Vaults, reached by a shortcut; it closes once the Threefold Melody and Fine Pins are both done | The wiki's Garmond and Zaza page (from the game's code) gives the condition but not where the shortcut is, or whether the roof can be reached before Trobbio. The shortcut and the Threefold-plus-Fine-Pins condition are wiki only; per the audit, Vandal confirms only that the duel closes in Act 3, which the row doesn't mention | a playthrough opening the roof shortcut, then finishing the third melody with Fine Pins done |
| `wish-garmond-zaza-act-two` | won before the Forum, the pair fight in the gauntlet | The wiki's High Halls and Garmond and Zaza pages both say so. The chapter now runs the Vaults before the High Halls so the duel comes first | none needed; wiki only |
| `flea-songclave` | the flea behind the curtains below Cardinius's room, Clawline and Cling Grip | The id says Songclave, but the wiki's Flea page has no Songclave flea: this is its Whispering Vaults flea #29. Neoseeker files the same flea under the Choral Chambers (per the audit's read; Neoseeker refused this fixer with a security check on 19 Nov 2026). game-checklists lists a “Songclave Parkour” flea (its Flea 22) under the Whispering Vaults, “parkour challenge beside Songclave”, which agrees with the wiki's filing and the row's long platforming run, and says nothing of the curtains, Cardinius or Clawline. The Map Genie pin (478404) was kept and is unread | open the pin and compare it with the wiki's mapshot |
| `memory-locket-whispering-vaults` | in the room under the Vaults' way out to the open air | The wiki's Memory Locket page: "below the exit to the outside area", wiki only. Which exit isn't named | a playthrough, or a second host with a map |
| `route-rosary-storage` | once the vault is open, saving outside the High Halls, Choral Chambers and Cogwork Core sends a Snitchfly to take what's left | The wiki's High Halls page, wiki only | a second host, or a playthrough |
| `route-vaultkeepers-melody`, `relic-sacred-cylinder` | the lowest Vaults are reached through the Underworks via Trobbio's lift | The wiki's Psalm Cylinder page ("accessible via the Underworks after beating Trobbio") and Whispering Vaults page (the lift); the route between them isn't described | a playthrough |
| `challenge-architect-shop` | buying everything (repairs aside) plus the Architect's Melody brings the Architect's end | The wiki's Twelfth Architect page. Whether the 50-Rosary Shard Bundle on its list counts toward "everything" isn't said | a playthrough |
| `boss-trobbio` | if you skipped Shakra's Quill, a Quill lies on Trobbio's desk above the Stage | The wiki says it conditionally on two pages: Trobbio's trivia (a red Quill if Hornet has none yet) and Map and Quill (“if a Quill is not already owned”); its Whispering Vaults page lists the desk's Quill with no condition. PC Gamer says the game gives a free red one if you never buy Shakra's, crediting the wiki for where. So the condition is stated (the file once said it wasn't), the place has one host, and a reader who bought the Quill in chapter 1 (`pickup-quill`) never sees the desk's | a playthrough |
| Chapter order | the Vaults and Trobbio come before the Core's summit and the High Halls | Moved within the chapter so Garmond and Zaza's duel precedes the Forum. Nintendo Life recommends the Vaultkeeper's Melody first, as it needs no new skill | none needed |

Every placement in this chapter rests on hollowknight.wiki alone (raw wikitext fetched 19 Nov 2026), apart from the melody order (Nintendo Life). No row was checked in the game.

Left out on purpose:
- Trobbio's later rematch and the Claw Mirrors upgrade (ch11's job), and the Rosary Bank's later cave-in.
- The Twisted Bud room's region: the wiki files it under a later area, so the row only says it's below the eastern Vaults.
- The Architect's Silkshot repair: it needs an item found in ch9, so `challenge-architect-shop` only says "its repair work aside".
- Shakra's help in the Forum: it needs a Wish from ch9.

Patch-dated prices:
- `route-vaultkeepers-melody`: Cardinius pays 320 Rosaries for the Sacred Cylinder since Patch 1 (1.0.28497); was 200 (wiki Psalm Cylinder history).

### Chapter 8

| Row | The guide says | Open question, and the sources | What would settle it |
| --- | --- | --- | --- |
| `route-slab` | the bridge to the Slab is one floor above the Citadel Spa bench | The wiki's Slab page says it's west of the Choral Chambers, one floor above the Spa bench; its Choral Chambers page says the very eastern section leads to the Slab bridge; its Cogheart page puts the tall room to the Slab in the west. The row gives no compass direction (raw wikitext) | a playthrough |
| `memory-locket-deep-docks` | west of the big bell past the Forebrothers' arena | The wiki's Memory Locket page: "west of the diving bell", needing Clawline and the Forebrothers beaten. That the bell lies past their arena is read from the Forebrothers page ("they block the path to the Diving Bell") | a playthrough |
| `mask-shard-13` | south-west Mount Fay, west of the bench | The wiki's Mask Shard page (its #12): "west of the bench", which bench unnamed. The draft's "large hollow cylinder" had no source and was cut | a playthrough |
| `flea-mount-fay` | frozen in ice, freed with the needle, Cling Grip | The wiki's Flea page gives the method, not the room. The draft's "highest ledge of the central room" had no source and was cut; the Map Genie pin carries the position | a playthrough or a second host |
| `flea-underworks` | reached from Wisp Thicket through a breakable ceiling, Cling Grip and double jump | The wiki's Flea and Wisp Thicket pages. The draft's "saw passage" had no source and was cut | a second host |
| `map-mount-fay` | Shakra's camp on the climb sells it for 40 | The wiki's Shakra page (camp, bench, price), wiki only; where on the climb the camp is isn't given | a playthrough |
| `route-fay-climb` | frosting over takes about 15 seconds, then damage every couple of seconds | The wiki's Mount Fay page, read from the game's code (15 s, 1.75 s), wiki only | a playthrough |
| `kit-grindle`, `tool-snitch-pick`, `tool-thiefs-mark`, `spool-fragment-17` | Grindle's hideout needs the double jump; Kit 700, Snitch Pick 740 (with Clawline), Thief's Mark 350, Spool Fragment 680 | The wiki's Grindle page (raw wikitext, cached by the audit, which couldn't fetch it then); the Spool Fragment page agrees on 680 and the double jump. Wiki only | a second host |
| `boss-lugoli` | Lugoli drops the Pickled Muckmaggot | The wiki's Lugoli page. The draft said it was "beyond the room"; the data follows the wiki | none needed |
| `wish-final-audience` | meet the Sentinel twice | The wiki (Second Sentinel, Final Audience) gives two meetings, or one once a late item is held; the row gives two | none needed |

Every placement in this chapter rests on hollowknight.wiki alone (raw wikitext fetched 19 Nov 2026); Nintendo Life independently puts the Memorium after Mount Fay. No row was checked in the game.

High Halls and the double jump: see the ch7 entry. This chapter's `spool-fragment-15` needs the double jump by the wiki's own account, so it sits here either way.

Left out on purpose:
- The Memorium's list of habitats: two of them are areas the reader reaches later.
- The Memorium map room's hidden passage to a bridge outside the Citadel: it leads to a ch9 area.
- The Slab's inner prison, keys and rows: ch9, after `route-slab-return`.
- Mount Fay's Brightvein shard (needs Silk Soar) and its later Pinstress fight.
- The High Halls Clawmaiden control room (double jump; a Journal entry, not counted).
- Lugoli's hidden jar room, and the shortcut that lets one meeting with the Sentinel count after a late item.

Patch-dated prices:
- `bellway-the-slab`: 40 Rosaries since Patch 1 (1.0.28497); was 50 (wiki Fast Travel history).

### Chapter 9

| Row | The guide says | Open question, and the sources | What would settle it |
| --- | --- | --- | --- |
| `route-karak` | The first way in is from the far west of the Blasted Steps, Clawline up the rings from the Pinstress's house; both shortcuts open from inside only | wiki Sands_of_Karak (raw wikitext, 19 Nov 2026) says so; the draft's "above the Bellway, via the Bellway shortcut" contradicted it and was dropped. Wiki only | A second host, or a playthrough entering Karak for the first time |
| `route-ducts` | A bench stands beside Pale Lake since Patch 5 | Team Cherry's Patch 5 notes ("Added a bench beside Pale Lake, before the Flea Caravan's arrival"), read from the cached page; the wiki's Putrified_Ducts page doesn't mention it yet | A playthrough on 1.0.30000 at Pale Lake before the Caravan moves |
| `route-ducts`, `wish-the-lost-merchant` | The Ducts are entered through a hidden ceiling passage in the Memorium's map-machine room, found during The Lost Merchant; the Bilehaven passage reaches only the bottom room | wiki Putrified_Ducts and Memorium (raw wikitext) agree. The Lost Merchant's own page doesn't mention the passage | A second host |
| `route-slab-return`, `pickup-key-heretic` | A reader who escaped the Slab after a Wardenfly capture already holds the Key of Indolent and the Key of Heretic | Inference: wiki The_Slab says the escape ends with a gauntlet of Wardenflies, Guardflies and Scabflies after the north bench; wiki Enemy_Gauntlets_(Silksong)/The_Slab_2 is the north-west gauntlet only a captured Hornet sees, needs the Key of Indolent and drops the Key of Heretic. No page says "you already have both" | A playthrough of the capture route |
| `pickup-apostate-key` … `boss-first-sinner` | Order: Apostate (Ducts) opens the Slab; Indolent hangs in a western room; Heretic drops from the north-west gauntlet behind an Indolent lock; First Sinner's door takes Heretic, past the Apostate door | wiki Slab_Keys, The_Slab, First_Sinner, Enemy_Gauntlets_(Silksong)/The_Slab_3 (raw wikitext) agree. Wiki only | A second host |
| `spool-fragment-4` | Reached from the Bellway through the Apostate door | wiki Spool_Fragment says it "requires … a transport to the Slab" (the capture); wiki Slab_Keys says the Apostate door is the only other way into the rest of the Slab. The data reads the Apostate door as satisfying it | A playthrough without a capture |
| `flea-the-slab` | Behind a mist-covered door you choose to enter | wiki Flea gives no position and no lock; the draft's "Key of Indolent route, outer side room" is on no page and was dropped (also from `route-slab-return`). The row's Map Genie pin is the reader's guide | A second host or a playthrough naming the lock, if any |
| `flea-the-slab-2` | Above one of the Slab's benches, in a chamber up and left; double jump | wiki Flea says "above the rest bench" without naming which; the draft's "lower prison bench" is on no page | A second host naming the bench |
| `flea-bilewater-2`, `flea-exhaust-organ` | `flea-bilewater-2` is wiki Bilewater flea #18 (above the secret bench room, Cling Grip); `flea-exhaust-organ` is #17 (left of the Organ's upper entrance, by a hidden passage out of the Organ) | The match of row ids to wiki entries follows the audit's reading of the Map Genie pins (478408, 478378); the pins stay unread (WebFetch can't fetch mapgenie.io). game-checklists lists a Bilewater “Secret Bench” flea (Break wall near secret bench, Cling Grip), which fits `flea-bilewater-2` apart from the breakable wall the row omits, and a flea “west from Exhaust Organ (north door)”, probably `flea-exhaust-organ`'s “left of the Organ's upper entrance” in other words; it numbers fleas 28 to 30, not the wiki's #17 and #18, so the match is by place and not by number | Open both pins and compare with the wiki's map shots |
| `memory-locket-sands-of-karak` | In the first big room to the left; Clawline | wiki Memory_Locket's wording; its gallery adds "east of Watcher at the Edge". "To the left" of what isn't said | A second host |
| `flea-sands-of-karak` | Behind encrusted coral on the right of its room, at the top | wiki Flea; which room isn't named (the Map Genie pin shows it) | A second host |
| `map-putrified-ducts` | Lying on a desk in the Ducts | wiki Map_and_Quill_(Silksong) says "obtained from a desk", no position | A second host or playthrough |
| `wish-great-taste-crustnut` | Behind breakable walls and floors in the Sands | wiki Great_Taste_of_Pharloom and Crustnut give no closer position; the draft's "hidden coral branch" was dropped | A second host |
| `wish-wailing-mother` | Unlocks after entering the Slab room with the Broodmother's alcove and finishing five Songclave Wishes including Building Up and Strengthening Songclave | wiki The_Wailing_Mother (cached raw page). The draft's "after rescuing Jubilana" was contradicted and dropped. Wiki only | A second host |
| `wish-delivery-liquid-lacquer` | Offered after the Queen's Egg, with the Faydown Cloak, once the Threefold Melody has been played at the Cradle lift | Only wiki Liquid_Lacquer_(Wish) lists "Play the Threefold Melody"; wiki Threefold_Melody says it's played at the Cradle lift. The Wishes page lists no prerequisites. Neoseeker refused fetching (bot check, HTTP 429, 19 Nov 2026); search results gave no second host | A second host, or a playthrough checking the couriers before and after opening the Cradle |
| `relic-choral-commandment-songclave` | Jubilana sells it for 180 Rosaries | The draft said 210. wiki Choral_Commandment and Jubilana (raw wikitext) both say 180, with no patch note | A playthrough at Jubilana's shop |
| `wish-silk-and-soul` | At least 17 of 25 quest points: 22 Wishes at one point, six deliveries at a half on the first run | wiki Silk_and_Soul (raw wikitext) gives the 17, the 25 and the lists; it cites game data (`completetotalgroups.bundle`) for the requirement list, not visibly for the 17. landofgames.ru and cyber.sports.ru say 17 with no cited source and may share a datamine. English guides give no number | A save-file read of the quest-point threshold, or a playthrough unlocking the Wish at exactly 17 |
| `wish-pinmasters-oil` | Missed if Pale Oil is handed over before taking it; the second Needle upgrade still earns the point | wiki Pinmaster's_Oil (cached page) says so but carries a "verification needed" comment on that sentence. Wiki only | A playthrough handing over oil without the Wish, then checking Silk and Soul's count |
| `ending-twisted-child` | No prompt: the vines fire on their own when she falls | wiki Endings_(Silksong) and Grand_Mother_Silk describe it so; the draft's "use the final prompt" is on no page and was dropped | PC Gamer's endings guide (cached) agrees on the condition; a playthrough |
| Last group's note | Before the Needolin at the Cradle: Weaver Queen, Twisted Child, Broodfeast, Shakra's duel, the Bone Bottom and Pilgrim's Rest deliveries, Roach Guts, Loddie's games, Garb of the Pilgrims, The Terrible Tyrant, Volatile Flintbeetles | All from the wiki (Silk_and_Soul, Broodfeast, Shakra, Bone_Bottom_Supplies, Pilgrim's_Rest_Supplies, Roach_Guts_(Wish), Loddie, Garb_of_the_Pilgrims, The_Terrible_Tyrant, Volatile_Flintbeetles). Second hosts per the audit's missables research: deliveries (Neoseeker Bone_Bottom_Supplies, Vandal), Broodfeast (Neoseeker), Shakra's duel (Vandal), the endings (PC Gamer, Neoseeker). Roach Guts, Loddie and the three Wishwall Wishes are wiki only; An Icon of Hope left out (only inferred). None of these loses anything the game's own completion counts; each loses an entry this guide counts | A second host for the wiki-only ones |
| `wish-shakra-duel` | Not offered while the Caravan is in Greymoor | wiki Shakra (raw wikitext). Wiki only | A second host |
| `boss-phantom` | Phantom can still be fought after the act has turned at the Grand Gate | No page says the Mist closes; wiki Songclave_Supplies routes a delivery through the Exhaust Organ in Act 2, and Memory_Locket lets Phantom or Trobbio open the Grand Bellway locket. Inference | A playthrough reaching the Mist after the Grand Gate |

Spoiler checks done by eye, not by a playtester: no row before the last group says what closes or names the act after this one; the last group names it only as "before the story moves on" / "before you play the Needolin at the Cradle". "Grand Bellway" kept in a group title and `memory-locket-choral-chambers`: the reader opens it in chapter 6 (`route-grand-bellway`). `tool-conchcutter` no longer hints at the Coral Tower memory, and no longer names whose throne it is.

Left out on purpose:
- Every later fallback (free Steel Spines later, the free Cradle map later, the Terminus being cut off later): chapter 11's job. Runtfeast, Broodfeast's other way, is chapter 13's.
- Delivery rewards: Patch 1 raised them all and the rows don't need them.
- Songclave Supplies going unavailable once Silk and Soul is done: it comes back later and loses nothing counted.
- The draft's "open the nearest bench before fighting Lace", "the bench on the eastern side of Groal's approach", "two concealed ceilings" (Quick Sling: one), "double-jump into the crevice" (Ducts Craftmetal), the "false wall" (Slab locket) and the Clawline in the Bilewater Mask Shard corridor: on no page.

Patch-dated prices:
- `bellway-putrified-ducts`, `route-ducts`: 80 Rosaries since Patch 1 (1.0.28497); was 120 (wiki Fast_Travel_(Silksong) history).
- `bellway-bilewater`: 80 Rosaries; not in Patch 1's list of cut prices, so unchanged since release per the same history.

### Chapter 10

| Row | The guide says | Open question, and the sources | What would settle it |
| --- | --- | --- | --- |
| `wish-ruined-chapel` | You escape the Cradle and come out in Songclave, then go to the Ruined Chapel | The wiki's Acts page gives the objective order (After the Fall: escape the Cradle, then Awaiting the End: reach the Ruined Chapel, then Beast in the Bells). Its Cradle page says Hornet leaves by a new side path round the ruined Cogwork Core but not where she comes out. Nintendo Life's progression guide says you wake in Songclave. The data follows Nintendo Life for Songclave. The draft had no "escape the Cradle" row, so the escape is folded into this row. Wiki read as raw wikitext; Nintendo Life from the copy cached on 19 Nov 2026 | A playthrough of the start of Act 3 |
| `wish-ruined-chapel`, `boss-bell-eater` | Chapel first, then the Bell Eater | Acts lists Awaiting the End before Beast in the Bells, and Nintendo Life says to go to Moss Grotto first. The Bell Eater page says calling at any Bellway in Act 3 sets it off, so either order works. The rows are swapped into the objective order and the Bell Eater row says "the first time you call at a Bellway" | Nothing: the order is advice |
| `route-diving-bell` | Talk to Ballow by the Forge Daughter's shop, then meet him at the bell | The objective text on Acts has you find the bell before you "find aid". The Diving Bell and Ballow pages have you speak to Ballow first, then meet him at the bell's control panel for the key. Ballow's own line tells you where the bell is, so either order works. The data follows the Diving Bell and Ballow pages | A playthrough |
| `route-abyss-escape` | "Elegy of the Deep" | The wiki calls it Elegy of the Deep (its own page, which quotes the game's prompt). Nintendo Life's progression guide writes "Elegy for the Deep". The data follows the wiki | The in-game ability name |
| `route-abyss-escape` | You meet Lace's projection at the Void sea and learn Silk Soar, then climb out | Acts: reach the source of the black threads, then escape. Lace's page puts her projection on the shore of the Void sea. No page says whether Lace or Weavenest Absolom comes first, so the row doesn't put them in order | A playthrough of the first descent |
| `wish-eva-vesticrest` | Listed with the Silk Soar revisits, though it needs no Silk Soar | Eva (raw wikitext): 12, 20 and 27 slots on Crests other than the Hunter Crest. Weavenest Atla is open from chapter 4, so this can happen much earlier. Left in chapter 10 on the opener's call; the row says it needs nothing from here | Nothing: it's placement, not a fact |
| `ability-sylphsong` | 32 unlocked slots on Crests other than the Hunter | The slot count agrees across sources (wiki Eva, wiki Sylphsong). The number of lockets it takes doesn't: Eva says 12 at least (15 if some go into the Hunter Crest), Sylphsong says 15 or 18 before Act 3, and Nintendo Life's Eva guide says 17. The row gives only the slot count | A slot count on a save |
| `challenge-curvesickle` | The room above the Far Fields Bellway, every target in one throw, the point lost until the Curvesickle | The room is in the Far Fields: wiki Unnamed Skarr and Curveclaw (text), GuruGamer and, by search snippet, Game8 and a Rock Paper Shotgun mirror agree. The Curveclaw page's gallery captions say Hunter's March but its map shot and the Unnamed Skarr page, which reuses the same pictures with neutral captions, say Far Fields, so the captions are a slip. The count: wiki Unnamed Skarr and one snippet say four, another says six, so the row no longer gives one. The lost point comes from the Completion page's disclaimer; the Curveclaw page says the Curvesickle isn't needed for 100%, true only if you never hand the claw over. The Curveclaw page also says the Pollip Pouch makes each target take several hits and the Skarr then doesn't appear; the row doesn't say so. Wiki mostly | A playthrough at the room |
| `boss-plasmified-zango` | Four Needle Phial draws kill him | The Plasmified Zango page alone. It doesn't say whether a kill that way fills his Journal entry, so the row doesn't either | A playthrough |
| `relic-choral-commandment-whiteward-2` | Among corpses on the right side of a Whiteward room, behind a breakable wall; Silk Soar or a precise Faydown Cloak jump | The Choral Commandment page (raw wikitext) says "right side of the room" without naming the room. The Whiteward page has an Act 3 room "filled with corpses" next to the Silk Siphon room, which Silk Soar reaches from near the map machine. Whether they're the same room isn't stated. Since the Faydown Cloak also works, this can be taken from chapter 8 | The Map Genie pin checked in the game, or a page that gives the room (a Gamer Guides database page, seen in a search summary only, says a breakable wall in an area to the east hides it on a ledge, without naming the area, a corpse-filled room, Silk Soar or the Faydown Cloak) |
| `relic-arcane-egg` | At the dead end of a room entered from the west | The Arcane Egg page alone. It doesn't say whether it can be reached on the first descent or only once the bell is reinforced | A playthrough |
| `map-the-abyss` | A rune tablet in the Abyss | Map and Quill says only "obtained from a tablet", with the place shown on a map image. No page gives it in words | A playthrough, or a page that gives the position |

Left out on purpose:

- Damage and health numbers for the Bell Eater and Plasmified Zango, which the wiki gives.
- Relic sale prices. The Arcane Egg's value went from 250 to 600 Rosaries and the Rune Harp's from 110 to 210 in Patch 1 (1.0.28497). No row gives a sale price.

Changed beyond the rows: the chapter's region read "Grand Bellway", a Choral Chambers sub-area the chapter never visits. The Bell Eater comes out at whichever Bellway you call at, so it now reads "Bellways". No patch-dated prices in this chapter's rows.

### Chapter 11

| Row | The guide says | Open question, and the sources | What would settle it |
| --- | --- | --- | --- |
| Group note, "The four Old Hearts" | Grindle sells Pebb's and Mort's unsold stock, mostly for more; the tools left behind lie by their owners | Prices from the stock table on the wiki's Grindle page (raw wikitext), checked against Pebb and Mort: Brooch 120 to 220, Mask Shard 300 to 320, Craftmetal 60 to 120, Simple Key 500 to 600, Memory Locket 150 to 250, Tool Pouch 220 at both (hence "mostly"). The brief had the Magnetite Dice "by Lumble's body", but that's before Act 3: the Lumble the Lucky and Magnetite Dice pages say Grindle loots and sells unpicked dice for 300 once Act 3 starts, and the note follows them. The Weighted Belt page puts Mort's body in the tall room west of the Far Fields Bellway (the Mort page says west of Pilgrim's Rest, which agrees). Crull and Benjin's page adds the Steel Spines to the Tacks. All of it rests on the wiki alone | An Act 3 save with the items unbought, or a second host |
| `route-nyleth-path` | The breakable wall is on the left of the lift shaft | The Seth page says a breakable wall in the lift shaft, with no side. The Grand Gate page says Silk Soar opens the way. Nintendo Life's progression guide says the wall is on the left. The data follows Nintendo Life for the side | A playthrough |
| `boss-seth`, `route-nyleth-path` | The shrine is reached from the Grand Gate, not Shellwood | The Seth, Nyleth and Grand Gate pages all put the "Shellwood Shrine" in the Grand Gate, so the title, the group location and the chapter region now say Grand Gate. Only Silk Soar gates it (Grand Gate page); Patch 4 (1.0.29242) closed a Needle Strike route in before Act 3 | Nothing open |
| `boss-khann` | Fight up through the memory's enemy waves, then Silk Soar into his arena | Nintendo Life: three stages (5, 10 and 15 waves), then a shortcut to a last, shorter trial and the boss. Wiki Crust King Khann: a final gauntlet, then coral fills the room and Silk Soar takes you up. The row keeps it general | A playthrough |
| `wish-green-prince` | In Act 3 he moves to the hallway by the Cogwork Dancers' arena even if you skipped his earlier stops; he must be out of his cage | The Green Prince page, which cites the game's flags, says Act 3 is enough, and gives him caged dialogue for Act 3 (so he can still be caged then). The Verdania page says you must have talked to him west of the Citadel Spa and in the Dancers' room, without an Act 3 fallback: the same wiki disagreeing with itself. Nintendo Life (a Simple Key frees him, then Act 3 with Silk Soar and the Elegy of the Deep) and Gamer Guides (Act 3, Spell Seeker, Craw Lake) name no earlier meetings. The row follows the flag-cited page | A save that freed the Prince but never met him again before Act 3 |
| `boss-palestag` | Fight her before the Clover Dancers, because the memory closes for good | Wiki Verdania and Palestag; Neoseeker's Verdania page implies it (that Verdania shuts "forever") without stating it. Off the missables strip (see Missables). The game's own completion and the Hunter's Memento don't need her entry (wiki Verdania, Hunter's Journal); this guide counts her as a boss. She also gives five orbs toward the extra lore tablet | A second host that states it |
| `boss-pinstress`, `wish-fatal-resolve`, `tool-pin-badge` | Follow her pinned enemies up Mount Fay's stormward side | The Pinstress page says both "the peak" and "the same area as the bench halfway up the mountain"; Fatal Resolve says "stormward side". The rows follow the trail and give no height | A playthrough, or the Map Genie pin checked in the game |
| `wish-heros-call` | Three Act 3 meetings open it; otherwise "it still comes later" | Hero's Call and Garmond and Zaza: three meetings or the Everbloom. The row doesn't name the Everbloom, which comes in chapter 12. Garmond and Zaza lists the Marrow, Mosshome, Far Fields, Greymoor, Sinner's Road, Shellwood and Blasted Steps, and adds Deep Docks in a second list | Nothing open |
| `wish-ecstasy-of-the-end` | Taken in Act 3 | The Festival of the Flea page says the festival is in Act 3. The Wish's infobox also lets Mooshka offer it as soon as you have the Egg of Flealia, without Silk Soar. Whether that can happen before Act 3 isn't stated | A save that has the Egg of Flealia before Act 3 |
| `challenge-flea-juggle`, `-dodge`, `-bounce` | Beat 30, 65 and 42 | The scores come from Ecstasy of the End and Festival of the Flea. The Guardian's Memento page says a tie with Seth doesn't count; whether a tie with the fleas counts isn't stated, so the rows say "beat" | A playthrough |
| `boss-crawfather` | The Craw Summons turns up at certain benches, not every time | The Craw Summons page gives the odds (from 20% up to 50%), read from the game's code. The row leaves the numbers out because they're luck | Nothing open |
| `boss-seth` | He wanders once you have Nyleth's heart and one more | Seth page, from the game's code: Nyleth plus another Old Heart, or the Everbloom. The row doesn't name the Everbloom | Nothing open |

Left out on purpose:

- Boss health and damage numbers, and the festival piñata's random payouts.
- The Craw Summons odds (luck).
- The Fractured Mask and the Curveclaw by Mottled Skarr's body: he dies in Act 2 (wiki Mottled Skarr), so they aren't Act 3 fallbacks and stay with chapters 5 and 6.

Patch-dated prices and scores:

- `wish-flea-seth`: Seth's Flea Dodge record has been 90 since Patch 3 (1.0.28891); it was 95.

### Chapter 12

| Row | The guide says | Open question, and the sources | What would settle it |
| --- | --- | --- | --- |
| `wish-mushroom-riddle` to `wish-mushroom-surface` | Directions to each of Mister Mushroom's seven spots | The wiki gives the riddle, the order and map images, but no directions in words. The directions come from Nintendo Life's Passing of the Age guide (fetched 19 Nov 2026). Nintendo Life calls the Far Fields door "Weavenest Atla", but the wiki's Far Fields page puts Weavenest Cindril's Needolin door at the Far Fields' far east, so the row says Cindril | A playthrough of the seven spots |
| `wish-mushroom-slab` | His patch is “by” First Sinner's arena; the title says “at” it | Wiki Passing of the Age says just outside the arena, though its own map picture for that stop is First Sinner's room; Nintendo Life says inside it, in the bottom-left corner. “By” and “at” hold for both, so the title no longer says “outside” | A playthrough |
| `wish-mushroom-greymoor` | The top of Greymoor's western tower, just above where a lost flea was | Only Nintendo Life gives the tower and the flea; the wiki says only "below Wisp Thicket" | A playthrough |
| `memento-heart-memento`, ch11 `wish-old-hearts` | If you hold all four hearts, the Shamans take the Encrusted, Pollen and Hunter's Hearts and leave you the Conjoined Heart; to keep another, hand in three before you collect the fourth | Wiki Clover Dancers, Conjoined Heart, Red Memory and Materium agree; nothing outside the wiki. "Heart Memento" is the completionist tracker's name, not the game's, so the title now says "Keep a fourth Old Heart as a memento" (the id stays) | A second host, or a save |
| `challenge-completion-achievement` | At 100%, beating Lost Lace earns it; if you were short, reload, finish, and beat her again | The achievement's text is "Achieve 100% game completion and finish the game" (the wiki's achievement data module). The wiki's Completion page says these achievements are awarded only at an ending. Wiki Endings: reloading after Sister of the Void puts you at the last Abyss bench with Lost Lace alive. That a second win gives the achievement is put together from the three, not stated anywhere. Steam's own page wasn't read | The Steam achievement page, or a playthrough |
| `route-percentage`, `ending-sister-of-the-void` | The game's percentage shows in the inventory and on the save file once the Farsight is built, and after the final credits either way | The Farsight page alone | A playthrough |
| `wish-hunters-memento`, `memento-hunters-memento` | 230 required entries (231 on Steel Soul); six don't count | Wiki Hunter's Memento and Hunter's Journal only. The six are Flintbeetle, Palestag, Shakra, Garmond and Zaza, Lost Garmond and Lost Lace | A second host |
| `skill-pale-nails` | Silk Soar from the upper right hallway of the Choral Chambers into the ruined Cogwork Core, then up to the Cradle's peak | Wiki The Cradle and Pale Nails. Nintendo Life's mushroom guide says "the corridor to the right of Cogwork Core", which fits | Nothing open |

Left out on purpose:

- Lost Lace's health, damage and the odds of her follow-up attacks, and Pale Nails' damage.
- Mister Mushroom's riddle verse, which is the game's text; the row only says it hints at seven places.

No patch-dated prices in this chapter's rows.

### Chapter 13

A Second Save, added on 19 November 2026 for the two entries a first save can't hold. Its banner is still to make.

| Row | The guide says | Open question, and the sources | What would settle it |
| --- | --- | --- | --- |
| `boss-summoned-saviour` | Steel Soul only; A Vassal Lost from Steel Seer Zi; behind a broken wall southwest of Bonegrave | Wiki Summoned Saviour, A Vassal Lost and Steel Seer Zi. None of them ties it to Act 3, and the resting sites include Act 2 areas, so on a Steel Soul file it may be done earlier. It moved from chapter 12 to chapter 13, A Second Save, with the user's ruling that Steel Soul's entries go to a later playthrough's chapter. | A Steel Soul playthrough before Act 3 |
| `wish-runtfeast` | Leave Broodfeast unfinished until Act 3; Runt, one of the Huntress's brood, asks for the same 60 organs where she was; organs carry over; Longclaw | Wiki Runtfeast (the prerequisite, the counts, the carry-over, the reward; its location picture is the Huntress's) and Longclaw. Neoseeker Broodfeast: the same objectives and rewards in Act 3. That Runt is one of her brood is the wiki's (Broodfeast: she is devoured by her offspring) | A playthrough |
| Chapter intro | Steel Soul unlocks once the game is finished, and most deaths end the save | Wiki Steel Soul Mode alone. It also gives a code on the Extras page that unlocks the mode, and the fights a death doesn't end it in: First Sinner, Shakra, Garmond and Zaza, and the Elegy of the Deep memories | A second host |
