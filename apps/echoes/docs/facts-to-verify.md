# Facts still to verify

Nothing here has been replayed against the game by the author. The content was drafted from the community pages linked in each chapter and group, and is guidance, not an audit.

## Counts

The completion targets (`targets` in `src/guide/config.ts`) are pinned by a test: 127 Echoes, 40 Pieces of Heart, 7 Heart Containers, 150 Might Crystals (by amount), 50 side quests, 25 stamp stands, 28 accessory versions, 8 outfits, 69 recipes, 6 automatons, 4 Fairy Bottles, 59 dungeon chests, 12 mini-dungeon chests, and the guide's own lists below (46 overworld chests, 4 equipment, 2 abilities, 11 upgrades, 2 milestones, 22 minigame entries). The test checks the data against those numbers, not the numbers against the game.

- **Accessories:** 28 versions are listed, but two earlier accessories are replaced by upgraded forms, so a finished save holds 26 distinct ones. The 28 comes from the source list and is not checked in-game.
- **Overworld chests** (`overworld-chest`, a second tag on the `chest` rows that are not dungeon or mini-dungeon ones, so a dungeon chest never counts twice) have no official total: Console Pulse says the game has no counter and Gamer Guides says only "several". Only the chests the routes pass are listed, 46, and 8 of them also count under another target (a Fairy Bottle, a Might Crystal chest and six accessory chests).
- **Waypoints** carry no target. The game treats them as fast-travel unlocks: [Zelda Wiki](https://zeldawiki.wiki/wiki/Waypoint) says they unlock warping from the map, [Siliconera](https://www.siliconera.com/is-there-a-legend-of-zelda-echoes-of-wisdom-post-game/) says the map's progress shows only Stamps, Pieces of Heart and Might Crystals, and Console Pulse says there is no counter, percentage or reward. Nintendo Everything lists "All Waypoints" in its 100% checklist but says nothing in the game shows which are missing. Third-party totals disagree (Game Rant 41 overworld, Gamer Guides 42 overworld plus 7 Still World), none counts dungeon ones, and the guide's 17 overworld rows cover under half. `waypoint-stilled-castle-town` and `waypoint-stilled-faron` have a `waypoint-` id but carry the `dungeon-waypoint` tag.
- **Echoes learned in Slumber Dojo dreams** are temporary, so the Echo entries expect you to learn those monsters again outside.

## What the bar counts beyond the game's own lists

The first thirteen targets come with game totals. The rest are the guide's own lists, whose goals are their rows (`guide.test.ts` pins each to its tag), so no total is claimed for them; what the sources do say:

- **Equipment (4):** the Tri Rod and the Sword, Bow and Bombs of Might. [Zelda Wiki](https://zeldawiki.wiki/wiki/Swordfighter_Form) and [Game8](https://game8.co/games/Zelda-Echoes-of-Wisdom/archives/477095) give the three weapons, and [Zelda Wiki](https://zeldawiki.wiki/wiki/Tri_Rod) the Tri Rod; no source states a total.
- **Abilities (2):** Bind and Reverse Bond, the two Tri teaches in Suthorn Ruins ([Zelda Wiki](https://zeldawiki.wiki/wiki/Echoes_of_wisdom), [Game8](https://game8.co/games/Zelda-Echoes-of-Wisdom/archives/471933)). Zelda Wiki's category of abilities has 21 pages (Jumping, Swimming and Swordfighter Form among them), so there is no wider game total.
- **Upgrades (11):** the nine Lueburry upgrades match two hosts ([Zelda Wiki](https://zeldawiki.wiki/wiki/Lueburry), Game8 477095): energy to level 4 for 5, 10 and 20 Might Crystals, and the Sword, Bow and Bombs to level 3 for 10 and 20, with all upgrades costing 125 crystals and the last 25 giving the free energy refill; levels 3 and 4 only unlock after "Still Missing", which the rows don't say. The other two are four accessory slots (100, 300, 500 and 1,000 rupees on [Zelda Wiki](https://zeldawiki.wiki/wiki/Great_Fairies) and [Game8](https://game8.co/games/Zelda-Echoes-of-Wisdom/archives/476315); Nintendo Life says 200 for the third, an outlier) and `upgrade-energy-recharger`, whose name appears on no page read (Zelda Wiki calls it a Pot, Game8 a statue). The group cites Nintendo Life's upgrade page for prices, which has none; Zelda Wiki and Game8 do.
- **Milestones (2):** Tri level 11 is the maximum ([Zelda Wiki](https://zeldawiki.wiki/wiki/Tri%27s_Power), Nintendo Life, Nintendo Everything, which adds that the optional rifts are needed). The clear star is said by Console Pulse only ("adds a star"); Siliconera says only "a new notation".
- **Minigames (22):** a row count: 39 rows carry `minigame` (15 Slumber Dojo "fast" rows, 8 Dojo reward rows, 5 Acorn, 4 Flag Race, 4 Mango Rush, 3 race and glide quest rows), and the 17 that also award a Piece of Heart, Might Crystals, an accessory, an outfit or a side quest already count under those targets, so `minigame-extra`, a second tag on the other 22, is what counts. Sourced sub-totals: 15 Dojo trials with cumulative rewards at 2, 4, 6, 8, 11 and 14 ([Zelda Wiki](https://zeldawiki.wiki/wiki/Battle_Challenge), Thonky and Nintendo Life), 5 Acorn Gathering courses (Nintendo Life, Game8, Console Pulse), 3 Flag Race courses (Zelda Wiki, Console Pulse) and 3 Mango Rush seeds (Zelda Wiki, Console Pulse). No source gives one minigame total.

Found while counting, none changed:

- Of the 15 Dojo "fast goal" times, 12 differ from Zelda Wiki and Nintendo Life: where the two agree, the guide differs on Caromadillos (0:40 against 0:45), Wind (0:46 against 0:50), Titans (4:00 against 5:00), Floating (1:20 against 1:30) and Flame and Ice (0:15 against 0:40); where they disagree, the guide matches neither (Moblins, Shock, Ice, Skies, Wizzrobe, Titans Again, Final Titans). Only Flow (1:10) and Final Blank (1:30) match. The guide's cited GameFAQs page returned 403.
- Nintendo Life gives 10 acorns at Kakariko and 11 at West Hyrule Field; the guide says eleven and sixteen. Only Nintendo Life gives per-course counts.
- The Castle Town acorn crystal: Game8 says x3, which matches the guide; Zelda Wiki's Might Crystal table appears to say 1 there and 3 for the castle roof (the guide has 1). The table is hard to read, and it feeds the 150.

## Missables

Game8 ([list of missables and one-time events](https://game8.co/games/Zelda-Echoes-of-Wisdom/archives/473539)) says the game has no missables, and Console Pulse ([100% completion hub](https://consolepulse.com/nintendo/zelda/guides/zelda-echoes-of-wisdom-complete-guide-100-percent-hub)) says nothing becomes permanently missable and that a cleared save reloads before the ending. Both pages were read directly on 2026-11-14. That counts as two sources, but neither is an official statement, and a single reader report mentions missing items on a first pass, which is consistent with coming back. Game8 also lists one-time events that are not missables: chests open once, quests can't be replayed, and some rifts close after the story but hold no collectibles.

`src/guide/data/missables.ts` is therefore empty, and each chapter shows a one-line note saying nothing is flagged. If a real point of no return turns up with two independent sources, add it there and the "Don't miss" list replaces the note.

## Wording and spoilers

- Chapters 8 and 9 show "Late game" in the rail while hidden. Their group titles inside the chapters can still name late bosses; they were checked by eye, not by a playtester.
- Directions and puzzle solutions were not replayed. Some tips depend on which echoes you already have.

## Content not carried over

- The original chapter checklists duplicated the guide steps, so they were not ported as separate lists; the same steps are the entries.
- Five minigame bullets in the completion list (Slumber Dojo, Mango Rush, Flag Race, Acorn Gathering, Goron Race and gliding) repeat entries that already exist as route or sweep steps, so they were not added again; those entries are the `minigame` rows; the ones that award nothing the board counts already (`minigame-extra`) count as a target since 19 Nov 2026.
- Completion-list items derivable from other entries (all Echoes, all hearts, waypoints, chests, Fairy Bottles, accessory slots, final 25 crystals) were not duplicated; two upgrade lines matched existing steps.

## Map links

Each stamp row links to its own "Stamp Stand #n" heading on Nintendo Life's stamp page, read from its HTML on 2026-11-18. The page describes each stand in a line and the rows were written from other pages, so six rows were matched to their heading by region and by elimination among that region's stands: Gerudo's northwest plateau (#8), the islet south of Hebra (#9), the southwest corner of Zora River (#13), the snowy ledge west of the Moblin camp (#20), the ledge above the paired torches (#24) and the far east Eldin glide (#4). Check them in the game if a reader reports one that lands on the wrong stand. The page's own numbers move if it is edited.
