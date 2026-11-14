# Echoes of Wisdom Field Guide

A spoiler-aware, unofficial companion for *The Legend of Zelda: Echoes of Wisdom* (Nintendo Switch, 2024): a nine-chapter walkthrough with a checklist for the game's completion list.

## Run it locally

A React 19 + TypeScript single-page app built with Vite. You need Node 20+ and pnpm.

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # typecheck + production build into dist/
pnpm preview    # serve the production build
pnpm test       # Vitest data, state and app-flow tests
pnpm lint
pnpm icons      # regenerate public/icons
```

Routes are real paths (`/guide/3`, `/checklist/echo`, `/dashboard`, `/sources`), so a static host needs a fallback to `index.html`. The app is an installable PWA (vite-plugin-pwa): it precaches the shell, chapter banners and fonts, works offline, and asks before swapping in a new version.

The code is split in two. `src/core` is the app itself and is byte-for-byte the same in the Koholint and Red Dead guides. `src/guide` is what makes this guide Echoes of Wisdom: `brand.ts` (names, colours, storage keys, fonts), `config.ts` (article layout, categories, completion targets), the chapter data in `src/guide/data` (one module per chapter, plus `sweep-lists.ts`), the banners and `theme.css`, which only sets colour and shape tokens.

## Deploy

Meant for Vercel from `main`. `vercel.json` sets the build (`pnpm build` → `dist`), a rewrite to `index.html` that skips `/assets`, `/fonts` and `/icons`, a strict CSP (no inline scripts), security headers and cache rules. Check header changes against a real preview deployment, not just locally.

## Use the guide

- **Guide** walks the story chapter by chapter as one article: a heading per section, each step's opening sentence is its checkbox, and **In this chapter** jumps between sections. Later chapters stay hidden until you reveal them. Gerudo and Jabul can be played in either order, and so can Eldin, Hebra and Faron once they open. The last chapter is a return sweep; it also holds the full Echo, Might Crystal, recipe and Slumber Dojo lists for pickups the routes don't pass, shown as compact checklists rather than prose.
- **Checklist** searches and filters every entry. A check is shared between the walkthrough and the checklist. Each section has **Check all** / **Uncheck all**, and every change shows an **Undo** toast. **Next up** starts at the chapter you're reading and leaves the optional amiibo outfits until last.
- **Progress** counts against the guide's completion list: 127 Echoes, 40 Pieces of Heart, 7 Heart Containers, 150 Might Crystals, 50 side quests, 25 stamps, 28 accessories, 8 outfits, 69 recipes, 6 automatons, 4 Fairy Bottles and the chests. Entries that award Might Crystals count by amount. The game does not show one overall percentage, so the guide doesn't either.
- Nothing in the game can be permanently missed, so each chapter shows a one-line note saying so, linked to the two sources (Game8 and Console Pulse); see [docs/facts-to-verify.md](docs/facts-to-verify.md).
- The sun or moon in the header switches the theme. **Progress saved** opens spoiler settings and export/import. Progress is stored in this browser for this site address; an installed PWA can keep separate storage, so export before moving. Backups are written in the format shared by all three guides (version 3); version 1 backups still load.

## Content and accuracy

The chapter text was drafted from community guides, which are linked per group and on the Sources page. It has not been replayed in the game. [docs/facts-to-verify.md](docs/facts-to-verify.md) lists what is still unconfirmed.

## Credits

Fraunces and Nunito are bundled with their SIL OFL licenses in `public/fonts`. The icon is drawn in SVG. Chapter banners use original AI-generated landscape illustrations stored in `src/guide/banners`. *The Legend of Zelda* belongs to Nintendo; this is an unofficial fan guide.
