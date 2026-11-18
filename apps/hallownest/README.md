# Hallownest Hundo

A spoiler-aware, unofficial companion for *Hollow Knight*: a twelve-chapter walkthrough to the game's full 112%, with a checklist for every charm, boss, Mask Shard, Vessel Fragment and Grub.

## Work on it

This folder is one app in the [hundo](../../README.md) monorepo; the app itself is `packages/core`. Install once at the repository root with `pnpm install`, then run these from here:

```bash
pnpm dev        # http://localhost:5173
pnpm build      # typecheck + production build into dist/
pnpm preview    # serve the production build
pnpm test       # this guide's tests plus core's shared suites, run against this guide
pnpm lint
pnpm icons      # regenerate public/icons and public/favicon.ico from scripts/icon-master.webp and scripts/favicon.svg
```

`src/guide` is what makes this guide Hollow Knight: `brand.ts` (names, storage keys, fonts, corner style), `config.ts` (article layout, categories, completion targets), `points.ts` (the game's own completion count), `GameCheck.tsx` (the Progress page's "Check against the game"), the chapter data in `src/guide/data` (one module per chapter, plus `missables.ts`, `questlines.ts` and the guide-wide `sources.ts`), the banners and `theme.css`, which sets only the palette.

## Deploy

The Vercel project `hundo-hallownest` builds this folder as its Root Directory and serves [hallownest.hundo.quest](https://hallownest.hundo.quest), a domain it takes only at launch: before the merge, its deployments live on `hundo-hallownest.vercel.app` and the branch addresses, as [a new project](../../docs/deploying.md#a-new-project) says. `vercel.json` here sets the install, build, ignore command, rewrites, CSP and cache rules; [docs/deploying.md](../../docs/deploying.md) explains them.

## Use the guide

- **Guide** walks the route chapter by chapter as one article: a heading per section, each step's opening sentence is its checkbox, and **In this chapter** jumps between sections. Later chapters stay hidden until you reveal them. Chapters 1 to 9 cross Hallownest, taking what the content packs add on the way; chapter 10 is the Black Egg, the Seer and the White Palace, chapter 11 the Colosseum, the Grimm Troupe and the last nail upgrades, and chapter 12 Godhome and the last percent.
- **Checklist** searches and filters every entry. A check is shared between the walkthrough and the checklist. Each section has **Check all** / **Uncheck all**, and every change shows an **Undo** toast.
- **Progress** counts what the game counts toward its own completion: 40 charms, 15 bosses, 7 pieces of equipment, 7 Warrior Dreams, 6 spells, 4 nail upgrades, 16 Mask Shards, 9 Vessel Fragments, 3 nail arts, 3 Dreamers, 3 Dream Nail steps, 3 Colosseum trials, the Grimm Troupe's two, the Godtuner and 4 Pantheons. It also counts the collections a full save holds that the game's figure doesn't: 46 Grubs, 8 earned notches, 6 Pale Ore, 13 maps, 11 Stag Stations, 15 Whispering Roots, 4 Simple Keys, 5 endings and 5 dream rematches. They show on the board and stay out of What's left.
- **The overall figure is full completion.** The game counts to 112% with all four free content packs; the guide's 100% is that same total, so the bar reads the game's points over 112, rounded down, and weighted as the game weighs them: equipment counts twice, and Mask Shards and Vessel Fragments count only as whole masks and vessels. It reads 100% only when everything the game counts is ticked. **Check against the game**, on the Progress page, says what your save should read in the game's own terms, to compare with the inventory once you have World Sense.
- The entries that can be lost are flagged in their chapter and in **Don't miss**.
- The sun or moon in the header switches the theme. **Progress saved** opens Sync devices, where a six-digit code links your other devices. Spoiler settings and the backup (export and import) are under **Change settings**, in the chapters menu (beside the page on a wide screen), and Progress has **Export progress** and **Import progress**. Progress is stored in this browser for this site address; an installed PWA can keep separate storage, so export before moving.

## Content and accuracy

The chapters were drafted with GPT from community sources (the Hollow Knight wiki, a Steam route guide, pindrop.gg and others), which the data keeps per section so it can be checked (the guide doesn't show them). The draft was then audited claim by claim against those pages by passes that didn't write it, and its fixes follow in the next change. It has not been replayed in the game. [docs/facts-to-verify.md](docs/facts-to-verify.md) lists the source conflicts, the one-source claims kept off the missables, and what would settle each.

## Credits

Cormorant Garamond and Nunito Sans are bundled with their SIL OFL licenses in `public/fonts`. The app icon is a generated illustration of the Knight's mask, with its master in [scripts/icon-master.webp](scripts/icon-master.webp). The chapter banners in `src/guide/banners` are original AI-generated illustrations of the game's places, made from text prompts alone. *Hollow Knight* belongs to Team Cherry; this is an unofficial fan guide.
