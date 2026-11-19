# Echoes of Wisdom Hundo

A spoiler-aware, unofficial companion for *The Legend of Zelda: Echoes of Wisdom* (Nintendo Switch, 2024): a nine-chapter walkthrough with a checklist for the game's completion list.

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

`src/guide` is what makes this guide Echoes of Wisdom: `brand.ts` (names, storage keys, fonts, corner style), `config.ts` (article layout, categories, completion targets), the chapter data in `src/guide/data` (one module per chapter, plus `sweep-lists.ts`), the banners and `theme.css`, which sets only the palette.

## Deploy

The Vercel project `hundo-echoes` builds this folder as its Root Directory and serves [echoes.hundo.quest](https://echoes.hundo.quest). `vercel.json` here sets the install, build, ignore command, rewrites, CSP and cache rules; [docs/deploying.md](../../docs/deploying.md) explains them.

## Use the guide

- **Guide** walks the story chapter by chapter as one article: a heading per section, each step's opening sentence is its checkbox, and **In this chapter** jumps between sections. Later chapters stay hidden until you reveal them. Gerudo and Jabul can be played in either order, and so can Eldin, Hebra and Faron once they open. The last chapter is a return sweep; it also holds the full Echo, Might Crystal, recipe and Slumber Dojo lists for pickups the routes don't pass, shown as compact checklists rather than prose.
- **Checklist** searches and filters every entry. A check is shared between the walkthrough and the checklist. Each section has **Check all** / **Uncheck all**, and every change shows an **Undo** toast. **Next up** starts at the chapter you're reading and leaves the optional amiibo outfits until last.
- **Progress** counts every target on the board, each item once: 127 Echoes, 40 Pieces of Heart, 7 Heart Containers, 150 Might Crystals, 50 side quests, 25 stamps, 28 accessories, 8 outfits, 69 recipes, 6 automatons and 4 Fairy Bottles. It also counts the guide's own lists, which no game total backs: 57 dungeon chests and 12 mini-dungeon chests (the chests the walkthrough lists, which no page read totals; the two dungeon chests that award an accessory count as that accessory), 38 overworld chests (the others award a bottle, crystals or an accessory and count as those), 4 pieces of equipment, 2 abilities, 11 upgrades, 2 milestones, 22 minigame entries (the others award hearts, crystals, accessories, outfits or side quests the board counts already) and 43 Waypoints (17 overworld, 26 inside dungeons: the game keeps no count of them, so the goal is the guide's rows). Entries that award Might Crystals count by amount. A row that is two things the game counts (a side quest that awards a Piece of Heart) counts under both. Route and story steps never count, and the optional amiibo outfits stay out. The game shows no overall percentage; the bar reads 100% exactly when What's left is empty, shown over the chapters and at the top of Progress.
- Nothing in the game can be permanently missed, so each chapter shows a one-line note saying so. The two sources behind it (Game8 and Console Pulse) are in the data and in [docs/facts-to-verify.md](docs/facts-to-verify.md).
- The sun or moon in the header switches the theme. **Progress saved** opens Sync devices, where a six-digit code links your other devices. Spoiler settings and the backup (export and import) are under **Change settings**, in the chapters menu (beside the page on a wide screen), and Progress has **Export progress** and **Import progress**. Progress is stored in this browser for this site address; an installed PWA can keep separate storage, so export before moving. Backups are written in the format shared by all three guides (version 3); version 1 backups still load.

## Content and accuracy

The chapter text was drafted from community guides, which the data keeps per chapter and group so it can be checked; the guide doesn't show them. It has not been replayed in the game. [docs/facts-to-verify.md](docs/facts-to-verify.md) lists what is still unconfirmed.

## Credits

Fraunces and Nunito are bundled with their SIL OFL licenses in `public/fonts`. The Tri Rod app icon is an original generated illustration, with its master in [scripts/icon-master.webp](scripts/icon-master.webp). Chapter banners use original AI-generated landscape illustrations stored in `src/guide/banners`. *The Legend of Zelda* belongs to Nintendo; this is an unofficial fan guide.
