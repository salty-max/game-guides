---
name: guide-content
description: Draft, source or fix a hundo guide chapter's data (apps/<name>/src/guide/data) from community guides or from a research folder such as ~/code/dragon-quest-1-hd2d-guide. Covers turning steps into rows with stable ids, tags and categories, compact catalogue lists, https sources, missables only on two independent sources, summarising instead of copying, every claim checked against its source by the source-checker helper, and recording everything unconfirmed in docs/facts-to-verify.md. Use for a new guide's chapters, a new chapter, or a correction to existing rows.
---

# Writing a guide's content

The rules and the shapes are in [docs/chapter-data.md](../../../docs/chapter-data.md). Read it first, every time: rows, ids, sources, missables, counts and the `facts-to-verify.md` sections. This skill is the procedure, and the judgement calls the doc can't make for you.

## 1. Know what you're starting from

- **A research folder.** `~/code/dragon-quest-1-hd2d-guide` is guide #4's:
  - `guide/NN-*.md`: one walkthrough per chapter. Each step is written `- [ ] **Title.** <!-- id: …; category: … -->` with its directions below, so it's already a row's id, first tag, title and text.
  - `checklists/NN-*.md`: the short per-chapter checklists.
  - **The unnumbered checklists**, such as `mini-medals.md`, `secret-spots.md`, `scrolls-and-sigils.md`, `dungeon-chests.md`, `crafting.md`, `area-clears.md`, `overworld-sparkles.md`, `zalen.md` and `completion.md`. These are the catalogue lists, and they become `compact` groups.
  - `SOURCES.md`: how the route was checked, the disagreements and how each was resolved, and the reference sets.
  - `assets/banners/`: see the `guide-banners` skill.

  The folder's prose is our own, so it can be carried over. Its sources and verification notes go into the data and into `docs/facts-to-verify.md`.
- **Community guides only.** Read several pages for each section, note which page says what, and write the directions yourself.
- **A fix to existing rows.** Find the row by its id. Never change the id.

## 2. Settle the shape before writing rows

- **Chapters:** decide how the research's chapters map onto `data/chapter-N.ts`. A catalogue-only chapter, like Dragon Quest's "Completion and crafting", can carry the compact lists, as Echoes' last chapter does with `sweep-lists.ts`.
- **Categories:** list every kind of row the game has in `config.ts`'s `categories`. Take the research's `category:` values as the starting set.
- **Fixed totals:** the game's own counts, with their source, go into `completion.board` as goals and into `guide.test.ts`. `SOURCES.md` gives Dragon Quest's: 40 Mini Medals, 22 scrolls, 15 Secret Spots, and more.

## 3. Write the rows

Follow [the doc's row rules](../../../docs/chapter-data.md#a-row). The calls it leaves to you:

- **Keep the research's ids.** They were made to be stable, and readers' saved checks will be keyed by them.
- **Directions:** second person, in the order the player meets things. Leave out what depends on the player's level or luck. The Dragon Quest research already drops damage numbers and turn patterns for that reason.
- **Summarise, never copy.** Community guides are someone else's writing. Read them, then write the directions in your own words and shorter. Don't paste a sentence, a table or a list from a source.

## 4. Sources, missables, facts to verify

- **Sources:** per chapter and per group, as [the doc](../../../docs/chapter-data.md#sources) says. Link the page you actually used. They're kept for checking the data and never shown to readers, so a row's directions must stand on their own.
- **Missables:** flag one only on two independent sources on different hosts. Otherwise write a sourced reassurance, or say only what you can source ([the doc](../../../docs/chapter-data.md#missables)).
- **One-way choices:** a decision one playthrough can't take every way of goes in `data/choices.ts`. Recommend one way for this playthrough, make each other way a row in a later playthrough's chapter (NG+, or a "Second save" chapter at the end), and back the choice with two hosts, as a missable needs. The choice's name, its why and the later rows' titles show in the choice's chapter, so they say only what that chapter says. Ways that all fit on one playthrough, and losses with nothing in return, aren't choices ([the doc](../../../docs/chapter-data.md#one-way-choices)).
- **Facts to verify:** update the app's `docs/facts-to-verify.md` in the same commit as the data. Carry over `SOURCES.md`'s disagreements, with which way the data went.
- **Never claim more checking than happened.** No "tested", "verified" or "confirmed in game" unless someone played it and said so. `SOURCES.md` calls the Dragon Quest route "source-checked … with gameplay verification still outstanding". Keep that honesty in the README and the facts file.

## 5. Check every claim against its source

Rewriting directions is where errors creep in: a turn smoothed into the wrong compass point, a chest moved to the other branch. So before the commit, someone who didn't write the rows checks them against the pages they cite.

- **Who:** the `source-checker` helper, one per chapter, run in parallel. Give it the chapter's file, and for a fix, the row ids you touched. Rows carried over from a research folder get checked too: the research was drafted from community guides like everything else.
- **What comes back:** pages the chapter follows without citing them, then the claims a source contradicts, those where the frames differ, those no cited source says, and those on a page it couldn't read. Matches aren't listed.
- **What to do with each:**
  - *An uncited page:* cite it. It often backs several "not on the page" claims at once.
  - *Contradicted:* first make sure it isn't moves against positions. "Head west, then take the second turning north" and "the east side of B2" can both be true. In Dragon Quest's Erdrick's Hollow, one guide gives moves for the chests, the research gives positions, and another guide's chest labels back every position (the entry in its `SOURCES.md`). If it's a real contradiction, fix the row to match the source, keeping its id. Where two sources disagree with each other, follow the more direct one (a map pin or a position label over prose for a position) and record the disagreement in `facts-to-verify.md`.
  - *Frame differs:* settle it with a page that gives positions, or record it in `facts-to-verify.md`.
  - *Not on the page:* find a page that says it and cite it, cut the detail, or record it in `facts-to-verify.md`.
  - *Unread:* record it in `facts-to-verify.md`, with how far the helper got.
  - *Read in the browser:* the helper falls back to the built-in browser when a page refuses fetching, and names those pages. Say so in `facts-to-verify.md`: "read in the browser (fetching was refused)".

## 6. Check it

- In the app folder, `pnpm test` gives the quick loop: ids, categories, links, missables, and the totals pinned in `guide.test.ts`.
- At the root, `bun harness/q.ts check -- bun run check`.
- Read the changed chapters in the browser as a player would: the `guide-check` skill with `--reveal` and `--pages` naming those chapters.
- Spoilers: shoot or open the guide without `--reveal` as well. Read each hidden chapter's teaser in the rail, and every group title a player sees before revealing a chapter.
