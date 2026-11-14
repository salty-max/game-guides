# Koholint Field Guide

A responsive companion for *The Legend of Zelda: Link’s Awakening* on Nintendo Switch (2019).

## Work on it

This folder is one app in the [game-guides](../../README.md) monorepo; the app itself is `packages/core`. Install once at the repository root with `pnpm install`, then run these from here:

```bash
pnpm dev        # http://localhost:5173
pnpm build      # typecheck + production build into dist/
pnpm preview    # serve the production build
pnpm test       # this guide's tests plus core's shared suites, run against this guide
pnpm lint
pnpm icons      # regenerate public/icons from the compass motif in scripts/icons.mjs
```

`src/guide` is what makes this guide Koholint: `brand.ts` (names, storage keys, fonts, corner style), `config.ts` (article layout, categories, completion rules), the chapter data in `src/guide/data`, the deathless-run panel (`run-log.ts` and `DeathlessRun.tsx`, at `/dashboard/deathless`), the banners and `theme.css`, which sets only the palette.

## Deploy

The Vercel project `koholint-field-guide` builds this folder as its Root Directory and serves [koholint.hundo.quest](https://koholint.hundo.quest). The old address, koholint-field-guide.vercel.app, still answers and hands each reader's progress over (see [docs/deploying.md](../../docs/deploying.md#pitfalls)). `vercel.json` here sets the install, build, ignore command, rewrites, CSP and cache rules; [docs/deploying.md](../../docs/deploying.md) explains them.

## Use the guide

- **Guide** opens at Tail Cave and remembers the last chapter you viewed. Reveal chapters as you reach them. Read each chapter straight through or jump to a section from **In this chapter**. Click a step’s opening sentence to check it off.
- **Checklist** searches and filters the revealed route by location, chapter, category and completion. Checks sync with the guide and across categories. Open an item’s chapter link to read the directions in context.
- **Progress** shows completion by chapter and category, what's left (biggest gaps first), and separate manual Normal and Hero deathless logs. Check the death count on your Switch save selection screen.
- Use the sun or moon in the header to switch themes. Choose **Use device setting** under **Appearance** to follow your system. The theme is saved in this browser.
- Open **Progress saved** to change spoiler settings or back up your progress as JSON. Your progress belongs to this browser and site address. Export before switching devices or clearing browser data. Backups are written in the format shared by all three guides (version 3, run log under `extra`); older backups and saves still load.

The completion total covers the walkthrough and its checklists. Optional amiibo panels and deathless clears are tracked separately. The chest list includes chests tied to story dungeons, the Color Dungeon, the Dream Shrine and a mountain route chest. Dungeon shells count in both the chest and shell categories. The Island Sweep includes map and statue checks. The site links to external sources for maps and alternate routes.

Directions come from published Switch remake guides and haven't been played through end to end. Open questions are in `docs/facts-to-verify.md`.

## Missable entries

A "Don't miss" strip appears on a chapter when `src/guide/data/missables.ts` flags an unchecked entry there. An entry is flagged only when two independent sources agree on the exact condition. Today nothing qualifies for the Switch remake, since you can reload the clear save after the ending, so the strip says that and links the sources. Open questions are in `docs/facts-to-verify.md`.

## Artwork and fonts

The chapter banners in `src/guide/banners` are decorative. DM Sans and Playfair Display are bundled with their licenses in `public/fonts`. *The Legend of Zelda* and *Link’s Awakening* belong to Nintendo. This is an unofficial guide.
