# Facts still to verify

Nothing here has been replayed against the game by the author. The content was drafted from the community pages linked in each chapter and group, and is guidance, not an audit.

## Counts

The completion targets (`targets` in `src/lib/guide.ts`) are pinned by a test: 127 Echoes, 40 Pieces of Heart, 7 Heart Containers, 150 Might Crystals (by amount), 50 side quests, 25 stamp stands, 28 accessory versions, 8 outfits, 69 recipes, 6 automatons, 4 Fairy Bottles, 59 dungeon chests, 12 mini-dungeon chests. The test checks the data against those numbers, not the numbers against the game.

- **Accessories:** 28 versions are listed, but two earlier accessories are replaced by upgraded forms, so a finished save holds 26 distinct ones. The 28 comes from the source list and is not checked in-game.
- **Overworld chests** (the `chest` tag minus the dungeon and mini-dungeon ones) have no official total. Only the chests the routes pass are listed.
- **Waypoints** are tracked as route steps; the game's own waypoint total is not listed here.
- **Echoes learned in Slumber Dojo dreams** are temporary, so the Echo entries expect you to learn those monsters again outside.

## Missables

Game8 and Console Pulse both state that nothing in the game is permanently missable, since collectibles and quests can be revisited after the credits. That counts as two sources, but neither is an official statement, and a single reader report mentions missing items on a first pass, which is consistent with coming back. `src/data/missables.ts` is therefore empty and the "Don't miss" strip never appears. If a real point of no return turns up with two independent sources, add it there and the strip lights up.

## Wording and spoilers

- Chapters 8 and 9 show "Late game" in the rail while hidden. Their group titles inside the chapters can still name late bosses; they were checked by eye, not by a playtester.
- The Sources page and the group source lines link to external guides that may spoil later chapters.
- Directions and puzzle solutions were not replayed. Some tips depend on which echoes you already have.

## Content not carried over

- The original chapter checklists duplicated the guide steps, so they were not ported as separate lists; the same steps are the entries.
- Five minigame bullets in the completion list (Slumber Dojo, Mango Rush, Flag Race, Acorn Gathering, Goron Race and gliding) repeat entries that already exist as route or sweep steps, so they were not added again.
- Completion-list items derivable from other entries (all Echoes, all hearts, waypoints, chests, Fairy Bottles, accessory slots, final 25 crystals) were not duplicated; two upgrade lines matched existing steps.
