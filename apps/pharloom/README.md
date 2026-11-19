# Pharloom Hundo

A spoiler-aware, unofficial companion for *Hollow Knight: Silksong*: a twelve-chapter walkthrough to full completion, with a checklist for every tool, crest, Mask Shard, Spool Fragment, flea, Wish and boss.

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

`src/guide` is what makes this guide Silksong: `brand.ts` (names, storage keys, fonts, corner style), `config.ts` (article layout, categories, completion targets), the chapter data in `src/guide/data` (one module per chapter, plus `missables.ts`, `questlines.ts` and the guide-wide `sources.ts`), the banners and `theme.css`, which sets only the palette.

## Deploy

The Vercel project `hundo-pharloom`, created on the user's go, will build this folder as its Root Directory and serve [pharloom.hundo.quest](https://pharloom.hundo.quest), a domain it takes only at launch: before the merge, its deployments live on `hundo-pharloom.vercel.app` and the branch addresses, as [a new project](../../docs/deploying.md#a-new-project) says. `vercel.json` here sets the install, build, ignore command, rewrites, CSP and cache rules; [docs/deploying.md](../../docs/deploying.md) explains them.

## Use the guide

- **Guide** walks the route chapter by chapter as one article: a heading per section, each step's opening sentence is its checkbox, and **In this chapter** jumps between sections. Later chapters stay hidden until you reveal them: the rail names only a hidden chapter's first place, or "Late game" for the last three.
- **Checklist** searches and filters every entry. A check is shared between the walkthrough and the checklist. Each section has **Check all** / **Uncheck all**, and every change shows an **Undo** toast.
- **Progress** counts everything the guide tracks. The first eleven targets are what the game's own completion counts: 51 tools, 6 Silk Skills, 4 Crafting Kits, 4 Tool Pouches, 3 Silk Hearts, 6 crests, 7 abilities, 20 Mask Shards, 18 Spool Fragments, 4 Needle upgrades and one key item. Then the game's own lists (2 cloaks, 30 fleas, 20 Memory Lockets, 8 Craftmetals, 3 Pale Oils, 4 Simple Keys, 7 Mossberries, 21 relics and cylinders, 8 mementos, 28 maps, 6 Bellshrines, 12 Bellway and 7 Ventrica stops, 5 endings) and the guide's own (13 pickups, 77 Wish steps, 41 bosses and 8 challenges).
- **The overall figure is full completion.** Every entry on the board counts once, a flea like a tool, and the figure reads 100% only when What's left is empty. It is not the game's own percentage, which counts only the first eleven targets, with four Mask Shards to a mask and two Spool Fragments to a spool. Route steps don't count, and nor do the two sides of a one-way choice, which wait for a later change.
- **What 100% takes.** All five endings count, and one save sees them all by reloading after two of them. One boss appears only on a Steel Soul save, so the bar reaches 100% only there. Some entries close for good when the story moves on: the Don't miss strip warns where two sources agree on it, and the row itself where only one does.
- Entries that can be lost for good are flagged in their chapter and in **Don't miss**, and each condition rests on two sources on different sites. None of them costs anything the game's own completion counts.
- The sun or moon in the header switches the theme. **Progress saved** opens Sync devices, where a six-digit code links your other devices. Spoiler settings and the backup (export and import) are under **Change settings**, in the chapters menu (beside the page on a wide screen), and Progress has **Export progress** and **Import progress**. Progress is stored in this browser for this site address; an installed PWA can keep separate storage, so export before moving.

## Content and accuracy

The chapters were drafted with GPT from community sources (the Hollow Knight wiki, Nintendo Life, Neoseeker and others), which the data keeps per section so it can be checked (the guide doesn't show them). The collection lists came from the save-file tracker silksong-completionist. An audit checked the draft claim by claim against those pages on 19 November 2026; the chapters were then fixed and checked again against their sources by passes that didn't write them, on the game's version 1.0.30000. It has not been replayed in the game. [docs/facts-to-verify.md](docs/facts-to-verify.md) lists the source conflicts, the one-source claims kept off the missables, and what would settle each.

## Credits

Alegreya and Manrope are bundled with their SIL OFL licenses in `public/fonts`. The app icon is a generated illustration of Hornet's mask and cloak, with its master in [scripts/icon-master.webp](scripts/icon-master.webp). The chapter banners in `src/guide/banners` are original AI-generated illustrations of the game's places, made from text prompts alone. *Hollow Knight: Silksong* belongs to Team Cherry; this is an unofficial fan guide.
