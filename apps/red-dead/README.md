# Red Dead Field Guide

A spoiler-aware, unofficial companion for the original *Red Dead Redemption* campaign. The checklist targets the game’s **Redeemed** 100% stat and works with the original and modern releases of that campaign.

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

Routes are real paths (`/guide/3`, `/checklist/location`, `/dashboard/calibration`, `/sources`), so a static host needs a fallback to `index.html`. Old hash links such as `#guide/3` redirect. The app is an installable PWA (vite-plugin-pwa): it precaches the shell, fonts and banners, works offline, and asks before swapping in a new version.

The code is split in two. `src/core` is the app itself and is byte-for-byte the same in the Koholint and Echoes of Wisdom guides. `src/guide` is what makes this guide Red Dead: `brand.ts` (names, colours, storage keys, fonts), `config.ts` (checklist layout, categories, completion rules), `estimate.ts` (the weighted in-game estimate), the chapter data in `src/guide/data`, the calibration panel, the banners and `theme.css`, which only sets colour and shape tokens.

## Deploy

Intended for Vercel from `main`. `vercel.json` sets the build (`pnpm build` → `dist`), a catch-all rewrite to `index.html`, a strict CSP (no inline scripts), security headers and cache rules. Check header changes against a real preview deployment, not just locally.

## Use the guide

- **Guide** starts in New Austin. Reveal chapters as you reach them. Each mission has its own directions and a source link. The order is a practical route through strands that can open in parallel.
- **Checklist** tracks story missions, Stranger tasks, outfits and scraps, challenges, map locations, bounties, hideouts, properties, purchases, jobs and minigames. Each check is shared with the walkthrough. Each route group has a **Check all** button (for example, a whole county after reading its map in-game); every check or bulk change shows an **Undo** toast. **Next up** starts at the chapter you're reading and holds map locations, scraps and optional tasks back until nothing else is left.
- **Progress** lists which categories still cost the most points, lets you enter the game’s own percentage to see how far the estimate is off, and estimates the game’s weighted percentage, with one point at each rank 5 and 10 challenge milestone. Outfit scraps are tracked individually. The completed outfit supplies the in-game credit. Compare your estimate with **Stats → General**.
- The sun or moon in the header switches the theme. Choose **Use device setting** under **Appearance** to follow your system.
- Open **Progress saved** to change spoiler settings or export and import your checklist. Progress is stored for this browser and site address. Backups are written in the format shared by all three guides (version 3, the in-game percentage under `extra`); version 1 and 2 backups still load.

The in-game percentage applies to the base campaign. *Undead Nightmare*, multiplayer, mission medals, platform trophies and optional encounters have separate completion goals. Sources and maps are linked inside the app. Directions and counts were compiled from the community guides linked in the app and have not been replayed or independently audited; see [docs/facts-to-verify.md](docs/facts-to-verify.md) for what is still unconfirmed.

## Artwork and fonts

The chapter banners in `src/guide/banners` are decorative. Barlow Condensed and DM Sans are bundled with their licenses in `public/fonts`. *Red Dead Redemption* belongs to Rockstar Games. This is an unofficial guide.
