# Writing and sourcing chapter data

A guide's content is plain TypeScript in `apps/<name>/src/guide/data`: one module per chapter, plus `missables.ts`, `questlines.ts`, and `sources.ts` where the guide has guide-wide references. The types are in `packages/core/src/types.ts`. The rules below that core's tests enforce are marked **(tested)**. The rest is how the three guides are written.

## A chapter

```ts
import type { RawChapter } from "@hundo/core/types";

export default {
  id: 2,
  title: "Gerudo Desert",
  region: "Suthorn Prairie · Gerudo Oasis · Gerudo Sanctum",
  teaser: "Gerudo Desert",
  intro: "Leave Suthorn by the prairie, then follow Dohna's investigation through the Cryptic Cavern and Gerudo Sanctum.",
  sources: [["Cryptic Cavern puzzles", "https://www.nintendolife.com/guides/zelda-echoes-of-wisdom-cryptic-cavern-walkthrough"]],
  groups: [
    {
      title: "Suthorn Prairie on the way west",
      location: "Suthorn Prairie",
      note: "The Heart Piece on the pillar in the prairie pond is easiest on the way back with Platboom.",
      sources: [["Prairie quests", "https://www.nintendolife.com/guides/zelda-echoes-of-wisdom-all-side-quest-locations-and-rewards"]],
      rows: [
        ["quest-up-a-wall", ["side-quest"], "Finish Up a Wall", "Go to the stone pillars northwest of Lueburry's house. Speak to the stranded man from below, clear the monsters around him, then speak again to claim 20 rupees."],
      ],
    },
  ],
} satisfies RawChapter;
```

- **`id`**: chapters are numbered 1, 2, 3… in order, and each has rows **(tested)**. List each new module in `config.ts`'s `chapters`.
- **`title`**, **`region`** and **`intro`** show on the chapter's banner once it's revealed.
- **`teaser`**: what the rail shows while the chapter is still hidden. Use a place name and never story. Where even the title gives the story away, use "Late game", as chapters 8 and 9 of Echoes and 4 and 5 of Red Dead do.
- **`sources`**: the chapter's references, as `[label, url]`.
- **`groups`**: the sections. A group has a `title` and `rows`, plus optional fields:
  - `location`;
  - `icon`;
  - `note`: a tip that covers the whole section;
  - `sources`;
  - `map`: one map for every row in the group (see Maps);
  - `compact: true`, for catalogue lists such as monsters, recipes or crystals. The article layout then shows a tight checklist instead of prose. Echoes' `sweep-lists.ts` is the example.

## A row

`[id, tags, title, text, extra?]`

- **`id`** is the saved check: progress stores `{ [id]: true }`.
  - It must be unique across the guide **(tested)**.
  - Write it in kebab-case, starting with the kind of row, as `quest-up-a-wall`, `echo-aruroda` or `mission-exodus-in-america` do.
  - **Never rename or reuse an id once the guide is live.** On load, a saved check for an id the data no longer has is dropped, so a renamed row comes back unticked for every reader. A reused id ticks the wrong row.
- **`tags`**: every tag must be a category in `config.ts` **(tested)**. The first one is the row's label and decides its icon and tone. A row counts toward every category it carries, so a dungeon chest is `["dungeon-chest", "chest"]`. Never add the `missable` tag by hand: core adds it to the rows listed in `missables.ts`.
- **`title`**: never empty **(tested)**. In the article layout it's the checkbox label, so the guides write it as an action: "Learn Aruroda in the dunes". Red Dead's checklist uses the mission's own name.
- **`text`**: the directions, in the second person, in the order the player meets things. Name the landmark, the action and the reward. Give exact counts and prices where the source gives them.
- **`extra`** (optional):
  - `{ quantity: 3 }`: the row awards that many of the guide's `quantity` category, counted by amount.
  - `{ reference: "https://…" }`: the page this row alone was written from (see Sources: it isn't shown). It must be https **(tested)**.
  - `{ map: ["Site", "https://…"] }`: this row's own map, only where it differs from its group's (see Maps).

## Maps

- A map is a reader's tool, not a citation: `map: [site, url]` on a group shows "Map on <site>" under its title, and on a row "Map" beside its tags or after its text, each opening in a new tab. It's a field of its own so a source never comes back into view.
- Only a page whose main content marks where the thing is qualifies: a map image or an interactive map of those rows (iRedDead's outfit and location maps, Nintendo Life's regional Might Crystal maps). A walkthrough, an area's wiki page or another tracker doesn't.
- Give a group its map; give a row one only when its map differs from the group's. Each has a site name and an https address, and a row never repeats its group's map **(tested)**.
- Link to a heading on the page (`#…`) when the page has one for that region or item, read from the page's own HTML, not guessed. A heading that moves only lands the reader at the top of the page.
- Link, never copy: a map's image is the game's art and the site's work, so it is never saved, embedded or hotlinked.

## Sources

- Sources are provenance: the pages the data was written from, kept so it can be checked (the tests below, the `source-checker` helper, `docs/facts-to-verify.md`). **No guide shows them**: no line under a section or a group, no link on a row, no Sources page. Readers get the directions, not the citations. Keep them complete anyway: they're how "no unverifiable claims" and the two-hosts rule for missables stay checkable.
- Every link is https and has a label **(tested)**. That covers guide, chapter and group sources, the reassurance's sources and row references.
- Label a source by what it settles ("Sanctum interior and roof chest"), not just by the site's name. Red Dead adds the site in front: "iRedDead · story missions".
- Draft from the pages you link, and link the page you actually used. Where two pages disagree, note it in `docs/facts-to-verify.md`, with which one the data follows.
- Before rows are committed, someone who didn't write them checks every claim against the page it cites (the `guide-content` skill, step 5).
- Each guide's README says the content was drafted from community guides and not replayed in the game. Keep that true: anything you did check in the game, say so in `facts-to-verify.md`.

## Missables

`data/missables.ts` exports `missables`: the rows a player can lose for good.

```ts
export const missables: Missable[] = [
  {
    id: "optional-i-know-you-start",
    why: "Time-limited: finish all three parts before the last main mission, or the chain fails.",
    sources: ["https://www.ireddead.com/rdr/guides/i-know-you", "https://www.gamesradar.com/red-dead-redemption-stranger-mission-guide/2/"],
  },
];
```

- An entry needs **two independent sources on different hosts** that agree on the exact condition **(tested: two hosts, https, a real row id, a `why` of more than 10 characters)**. Anything weaker goes in `docs/facts-to-verify.md`, not in the strip.
- `why` is one line: the exact condition for losing it.
- While nothing qualifies, export a `reassurance` instead: one honest sentence and two sources on different hosts **(tested)**. Echoes and Koholint do this. The strip then shows the sentence alone in place of a "Don't miss" list.

## Questlines

`data/questlines.ts` exports `questlines`: the Questlines page's tab word, title and intro, and its lines, each a chained side quest made of rows that already exist.

```ts
export const questlines: Questlines = {
  tab: "Quests",
  title: "NPC questlines",
  intro: "Each character’s story in order, as far as you’ve revealed. Ticking a step here ticks it in the guide.",
  cover: ["quest", "invasion"],
  lines: [{ id: "siegmeyer", name: "Siegmeyer of Catarina", steps: ["quest-sieg-gate", "quest-sieg-sens", …] }],
};
```

- **Steps are row ids in route order, each once** **(tested)**. Order comes from the route alone: the steps a reader has revealed are then always the line's first ones. An arc that truly runs against the route is two lines.
- **`cover`** lists tags whose every row must be in some line **(tested)**. A row may be in two lines, as Logan's and Griggs's farewell is.
- **A line's `id`** is kebab-case and unique **(tested)**, and stays once live: it's the line's address.
- **A name says only what the line's first step's chapter already says**: the character as first met ("Siegmeyer of Catarina", never the daughter met later). It shows as soon as that chapter is revealed, so it follows the same rule as a chapter's `teaser`. There's no blurb, for the same reason. No test can catch a name that spoils.
- A line is a claim that its steps belong together. Group only what the rows' own texts or two sources tie together, and put any doubt in `facts-to-verify.md`.

## Counts

Where the game has a fixed total, put it in `completion.board` with a `goal` and pin it in `guide.test.ts`, as Echoes' `targets` does. A missing or doubled row then fails a count. The test checks the data against the number, not the number against the game, so record where each number came from in `facts-to-verify.md`.

## Facts to verify

Each guide keeps `docs/facts-to-verify.md`: what the guide claims that nobody has confirmed. A reader or a later session can then tell guidance from fact. Update it in the same commit as the data it's about.

What goes in:

- **Counts and weights** taken from sources and not recounted in the game, with where they came from.
- **Missable candidates** with fewer than two sources, and what each source says.
- **Disagreements** between sources, and which one the data follows.
- **How a source was read.** Say "read directly on 2026-11-14", "read in the browser (fetching was refused)" or "search summary only": a page that blocked fetching and was only seen through a search summary is weaker.
- **Spoiler checks** done by eye, not by a playtester.
- **Content left out on purpose**, and why, so nobody adds it back as a "fix".

For each open question, Koholint's table also says what would settle it. Use that shape for anything a playthrough or a second source could close.

## After a data change

- Run `pnpm test` in the app folder for a quick loop, then `pnpm check` at the root.
- Open the changed chapter in a browser, in both layouts if the guide has a checklist page, and read the rows as a player would ([testing.md](testing.md#in-a-browser)).
