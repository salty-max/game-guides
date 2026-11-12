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

Routes are real paths (`/guide/3`, `/checklist/echo`, `/dashboard`, `/sources`), so a static host needs a fallback to `index.html`. The app is an installable PWA (vite-plugin-pwa): it precaches the shell and fonts, works offline, and asks before swapping in a new version. Walkthrough content lives in `src/data` (one module per chapter, plus `sweep-lists.ts`); progress state is in `src/store`.

## Deploy

Meant for Vercel from `main`. `vercel.json` sets the build (`pnpm build` → `dist`), a rewrite to `index.html` that skips `/assets`, `/fonts` and `/icons`, a strict CSP (no inline scripts), security headers and cache rules. Check header changes against a real preview deployment, not just locally.

## Use the guide

- **Guide** walks the story chapter by chapter. Later chapters stay hidden until you reveal them. Gerudo and Jabul can be played in either order, and so can Eldin, Hebra and Faron once they open. The last chapter is a return sweep; it also holds the full Echo, Might Crystal, recipe and Slumber Dojo lists for pickups the routes don't pass.
- **Checklist** searches and filters every entry. A check is shared between the walkthrough and the checklist. Each group has **Check all** / **Uncheck all**, and every change shows an **Undo** toast.
- **Progress** counts against the guide's completion list: 127 Echoes, 40 Pieces of Heart, 7 Heart Containers, 150 Might Crystals, 50 side quests, 25 stamps, 28 accessories, 8 outfits, 69 recipes, 6 automatons, 4 Fairy Bottles and the chests. Entries that award Might Crystals count by amount. The game does not show one overall percentage, so the guide doesn't either.
- Nothing in the game can be permanently missed, so there is no "missable" strip content; see [docs/facts-to-verify.md](docs/facts-to-verify.md).
- The sun or moon in the header switches the theme. **Progress saved** opens spoiler settings and export/import. Progress is stored in this browser for this site address; an installed PWA can keep separate storage, so export before moving.

## Content and accuracy

The chapter text was drafted from community guides, which are linked per group and on the Sources page. It has not been replayed in the game. [docs/facts-to-verify.md](docs/facts-to-verify.md) lists what is still unconfirmed.

## Credits

Fraunces and Nunito are bundled with their SIL OFL licenses in `public/fonts`. The icon and chapter banners are drawn in CSS and SVG. *The Legend of Zelda* belongs to Nintendo; this is an unofficial fan guide.
