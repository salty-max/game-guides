# Facts still to verify

The "Don't miss" strip (`src/guide/data/missables.ts`) lists an entry only when two independent sources agree on the exact condition. Right now nothing qualifies, and the strip says so. These are the open questions, checked on 2026-11-12:

| Claim | State | What would settle it |
| --- | --- | --- |
| Nothing is permanently missable in the Switch remake | The reassurance says only that after the ending you can load your clear save and keep collecting, and two hosts read directly on 2026-11-19 say that: Gamer Guides (load up your save and continue exploring) and GameFAQs' figurine guide (BowWow is won "after you complete the game (save after completing and reload)"; read in a browser, since GameFAQs refuses plain fetches, so re-reading it needs one too). TheGamer, cited before, says nothing of the kind and was dropped. Zelda Wiki says none of the 50 Secret Seashells is missable (read in a browser); Zelda Dungeon's page blocked both reads, so it rests on a search summary. No host says nothing at all is missable. | A full playthrough with a note of every one-way event, or a source that audits Heart Pieces and figures. |
| Heart Pieces cannot be missed | Unconfirmed. No source I found calls any missable, but none says all are safe either. | Same audit as above. |
| Only 9 of 10 Figures in a first playthrough | Two hosts, 2026-11-19: GameFAQs' figurine guide (BowWow at the Trendy Game "after you complete the game (save after completing and reload)", read in a browser) and [Zelda's Palace](https://zeldaspalace.com/linksawakening/differences_gb_switch.php) ("After completing the game, BowWow", fetched). The BowWow row says to reload the clear save. | Settled. |
| Shop theft: what it costs in the remake | Sources disagree: some say every character calls you THIEF, one says a glitch skips the label, one says a retry trick keeps the item. | Test it on a throwaway save. |
| Fishing pond Blooper and Cheep Cheep | They appear only on sparkly spots and can be retried, so not missable. | n/a, listed so nobody flags them by mistake. |

The ghost-house Secret Seashell already says you can return after the escort, so it is not missable either.

## Counts

Each goal in `targets` (`src/guide/config.ts`) and its source, checked on 2026-11-19 for the Switch remake; `guide.test.ts` pins every goal to its rows. Zelda Wiki (ZW) and Game8 refuse plain fetches, so their pages were read in a browser, and so was GameSkinny; Nintendo Life, Thonky and Nintendo Wire were fetched. Zelda Dungeon answered every read with a bot check or a 403 and is unread.

| List | Goal | Source 1 | Source 2 | Notes |
| --- | ---: | --- | --- | --- |
| Pieces of Heart | 32 | [ZW Piece of Heart](https://zeldawiki.wiki/wiki/Piece_of_Heart) | [Nintendo Life](https://www.nintendolife.com/guides/zelda-links-awakening-all-heart-pieces-map-and-locations) | |
| Secret Seashells | 50 | [ZW Secret Seashell](https://zeldawiki.wiki/wiki/Secret_Seashell) | [Thonky](https://www.thonky.com/zelda-links-awakening/nintendo-switch-secret-seashells) | Nintendo Life agrees |
| Heart Containers | 9 | [ZW Chamber Dungeon](https://zeldawiki.wiki/wiki/Chamber_Dungeon) | [Game8 Pieces of Heart](https://game8.co/games/Zelda-Links-Awakening/archives/270136) | Eight bosses and Dampé's, for clearing the twelfth starter challenge (Ticking Clock in this route); both hosts and ZW Piece of Heart put the most hearts at 20 |
| Instruments | 8 | [ZW Instrument of the Sirens](https://zeldawiki.wiki/wiki/Instrument_of_the_Sirens) | [Game8 Instruments](https://game8.co/games/Zelda-Links-Awakening/archives/270122) | ZW's sentence covers every version; Game8 names the Switch's eight with no number |
| Ocarina songs | 3 | [ZW Ocarina](https://zeldawiki.wiki/wiki/Ocarina) | [GameSkinny](https://www.gameskinny.com/tips/links-awakening-switch-guide-how-to-get-all-songs-and-the-ocarina/) | |
| Fairy Bottles | 3 | [ZW Fairy Bottle](https://zeldawiki.wiki/wiki/Fairy_Bottle) | [Game8 map](https://game8.co/games/Zelda-Links-Awakening/archives/272252) | Game8's is its map's counter, "0/3"; its fishing and Chamber Dungeon pages each name one bottle |
| Figures | 10 | [ZW Chamber Stone](https://zeldawiki.wiki/wiki/Chamber_Stone) ("all 10 Figures") | [Game8 Chamber Stones](https://game8.co/games/Zelda-Links-Awakening/archives/271888) ("the 10th Collectible Figure") | |
| Fishing Lures | 2 | [ZW Lure](https://zeldawiki.wiki/wiki/Lure) (three lures) | [Game8 Fishing Pond](https://game8.co/games/Zelda-Links-Awakening/archives/270368) ("available by default") | Three lures, the Lightweight one the pond's default, so two to win: [Nintendo Wire](https://nintendowire.com/guides/the-legend-of-zelda-links-awakening/fishing/) gives a catch for the other two and none for it. `lure-light` is a route step since 19 Nov 2026 |
| Trading Quest | 14 | [Game8 Trading Sequence](https://game8.co/games/Zelda-Links-Awakening/archives/270657) ("a total of 14 trades") | [ZW Trading Quest](https://zeldawiki.wiki/wiki/Trading_Quest) (14 rows) | The Boomerang is a 15th, under Equipment. The hosts' names differ: Game8 "Canned Food" and "Mermaid Scale", ZW "Dog Food", "Goat's Letter" and "Scale"; which the Switch game uses is open |
| Chamber Challenges | 24 | [ZW Chamber Dungeon](https://zeldawiki.wiki/wiki/Chamber_Dungeon) | [Game8 Chamber Dungeons](https://game8.co/games/Zelda-Links-Awakening/archives/270609) | Twelve in three starter levels, twelve gold; counted from both lists, which no sentence totals. None needs an amiibo |
| Chamber Stones | 14 | ZW Chamber Stone ("a total of 14") | Game8 Chamber Stones ("14 Chamber Stones") | None needs an amiibo (amiibo give chambers, not stones). The second Ol' Baron stone: Nintendo Wire "over 60 inches", ZW 60, Game8 any fish of 60 inches or more |
| Warp Points | 10 | [ZW Warp Point](https://zeldawiki.wiki/wiki/Warp_Point) ("the original four … six additional") | Game8 map ("all 10 Warp Point Locations") | Manbo's Pond is one of the ten, opened by Manbo's Mambo, so `maw-manbo` counts as a song and a warp point |
| Great Fairy Fountains | 4 | [ZW Great Fairy Fountain](https://zeldawiki.wiki/wiki/Great_Fairy_Fountain) | Game8 map ("0/4") | Weaker than the rest: ZW's sentence covers every version and Game8's is a map counter |

The guide's own lists have goals equal to their rows, not a game total: 83 Treasure Chests (no host gives a chest total, and Game8's map has no chest pins), 24 Equipment & Upgrades and 5 Island Sweep checks, with the 6 optional amiibo panels outside the bar. Mini-game Rewards (30) and Chamber Effects (5) are filters, not targets: no host totals either, and every one of their rows is a Heart Piece, Seashell, figure, lure, bottle, Chamber Stone, trade item, challenge or Heart Container another target counts.

Until 19 Nov 2026 the board counted every category with no goals, so 53 rows counted two or three times and 57 of the bar's 348 units were repeats. Now a row counts once per item: only Dampé's four challenges that award a Heart Piece, a Seashell, a Fairy Bottle or a Heart Container, and Manbo's Mambo, count on more than one of the game's lists, six units past their rows (Fill Up Your Hearts awards both a Heart Piece and a Seashell). The bar has 295 units.

## Map links

Each Heart Piece and Secret Seashell row links to its own heading on Nintendo Life's heart piece and seashell pages, matched by place and method and read from the pages' own HTML on 2026-11-18. Open judgement calls:

- "Fill Up Your Hearts" (`chamber-hearts`) carries both the heart and the shell tag but a row has one map, so it links to Heart Piece 14. Shell 22 (any four arrangements) is the same row and has no link of its own. Piece 14's anchor is the page's own garbled id (`…-complete-lfill-up-your-heartsr-challenge-…`): it works, and it breaks if the page is edited.
- The Blooper shell (`shell-large-fish`) links to Shell 44, the page's second Mabe fishing prize, "Catch a Blooper". The row used to say a fish over 40 inches. Read directly on 2026-11-19, three hosts give the Blooper: that heading, Gamepressure ("the Heavyweight Lure and a Secret Seashell") and Gamer Guides (the Blooper and the Cheep Cheep "bag you two Secret Seashells"); Gamepressure and Zelda Wiki's Fishing page put the Blooper after Catfish's Maw. Two give a size instead, and disagree: Nintendo Wire any fish over 40 inches, Game8 one of 45 inches or more, with the Blooper giving only the lure. So the row says to catch a Blooper, and to land a fish of 45 inches or more if that brings no shell, which both size rules allow. Which rule the game uses is open: a catch on a save settles it.
- The first Cheep Cheep shell (`shell-cheep`) opens after Angler's Tunnel: Nintendo Wire, Gamepressure and Zelda Wiki's Fishing page say so, read on 2026-11-19. Nintendo Life's Shell 37 heading says to finish Catfish's Maw first, which reads as where the shell sits in its list, not when the fish appears. Settled; the row is unchanged.
- Anchors move when the page is edited, and a moved one only lands at the top of the page. Reopen the links if a reader says one is off.
