# Facts still to verify

Nothing in this guide has been replayed against the game by its author. The data was compiled from the community pages listed in `src/guide/data/sources.ts` and on each route group and is shown to the player as guidance. This is what we know is soft. Use **Progress → Check against the game** to measure the estimate against Stats → General.

## The completion estimate

- **Weights** (`src/guide/estimate.ts`): story mission 1, Stranger task 0.5, map location 6/94, bounty 0.1, outfit 0.5, safehouse 2/13, hideout 0.5, rare weapon 0.5, job 0.5, minigame 0.5, and challenge ranks 5 and 10 at 1 each. These come from community 100% checklists. A test only confirms the total is about 100%, not that each weight is right.
- **Counts** (57 story missions, 18 Stranger tasks, 94 map locations, 20 bounties, 13 safehouses, 9 outfits): taken from the same pages, not recounted in the game or against each other.
- **What counts toward the in-game stat** (scraps do not, optional tasks do not, outfits give credit): from guides, not tested.
- The estimate is rounded **down** to a tenth. The game’s own rounding is not confirmed.
- Version differences: the game exists in original and later releases. Guides do not always say which they describe, so unlock conditions may differ between them.

## Missables

Only entries confirmed by two independent sources are flagged (`src/guide/data/missables.ts`):

- **I Know You** (Stranger chain, optional for 100%): must be finished before the last main mission. Sources: ireddead.com and GamesRadar. One minor wiki disagrees about whether it is optional; the 100% rule is consistent either way.

Not flagged because we have fewer than two sources, and so unverified:

- Stranger tasks with timed or day-limited steps (for example the in-game days between California visits).
- Anything that locks once you cross into Mexico or leave a county for good.
- Treasure Hunter, Master Hunter and other challenge sets that depend on region access.
- Any purchase or job that disappears after a story point.

## Stranger task steps

- **Where a task splits.** A Stranger task is several rows only where a part waits on a later story mission or on in-game time: American Appetites, California, Funny Man, Lights, Camera, Action, Deadalus and Son, Eva in Peril, Love is the Opiate and The Wronged Woman, plus the optional I Know You. The parts, what unlocks each and the waits come from iRedDead’s page for each task (fetched on 2026-11-18), which numbers every part. Parts that run straight on are kept in one row. Nothing here was replayed in the game.
- **Kept as one row on purpose:** Flowers for a Lady, Let No Man Put Asunder, Jenny’s Faith, Water and Honesty, Who Are You to Judge?, Poppycock, Aztec Gold, American Lobbyist, The Prohibitionist and Remember My Family. Each runs in one go: the next part opens once you’ve done the errand. Flowers for a Lady’s row asks for about six in-game hours before the delivery if you already carried the flowers, a wait iRedDead’s unlock for that part doesn’t give, so it stays one row too. Don’t split them as a fix.
- **Waits**, from iRedDead alone: about a day between American Appetites’ reports; about two in-game days between California’s meetings and before the last part of Love is the Opiate, The Wronged Woman, Deadalus and Son and Lights, Camera, Action; two or three before Eva in Peril’s last part; at least six in-game hours between Funny Man’s encounters.
- **Lights, Camera, Action’s last part:** iRedDead’s unlock says two in-game days after the deed, its walkthrough “a week later”. The data follows the two days.
- **Deadalus and Son’s materials:** iRedDead says no part needs West Elizabeth open, but advises waiting for it because beavers are easier to find on that side of the river. A SuperCheats hint says the Blackwater area must be open first. The data meets Charles in chapter 2 and hands the materials over in chapter 3. Where the beavers are: iRedDead points to the river between New Austin and West Elizabeth and, in the same paragraph, to the stretch north of the Great Plains buffalo, which may not be the same water. The data follows its first wording. The row used to name the Upper Montana River, which the Red Dead Wiki (read in the browser, fetching was refused) calls West Elizabeth’s northern border, not the border with New Austin.
- **American Appetites’ third report** also needs Wild Horses, Tamed Passions (iRedDead). This route has that mission before the first report, so the wait is the only gate a reader meets.
- **I Know You:** iRedDead numbers five parts. The data groups them into the chain’s three encounters (the canyon and Thieves’ Landing, El Matadero and Las Hermanas, Beecher’s Hope), which are the “three parts” of the missable’s condition.
- **The count stays 18** because only a task’s last step carries the `stranger` tag. The steps before it are `stranger-step`, which the board leaves out and the estimate weighs at nothing. `guide.test.ts` pins both.
- **Ticks from before the split:** each task’s old row is now its last step, so a reader who had ticked a split task sees its earlier steps unticked. No migration, on purpose: the estimate and the count don’t change.

## Chapter text

- Chapter 4 and 5 names are hidden behind “Late game” while locked, because their titles hint at the story. Chapters 1–3 show their region names.
- The chapter intros were checked by eye for story leaks, not by a playtester.
- No Stranger step names a story mission from a later chapter, checked by eye and by the source-checker helper on 2026-11-18. Deadalus and Son’s chapter 2 step names West Elizabeth, which the rail already shows as chapter 3’s region.
