# hundo.quest

The landing page: what hundo is, then every guide, each drawn as its own chapter hero (its palette in light and dark, its display font,
its corners, its icon tile and its chapter 1 banner), A to Z by game. Vercel project `hundo-home`, for `https://hundo.quest`
([docs/deploying.md](../docs/deploying.md#the-landing-page)).

## How it's made

Nothing about a guide is written here. At build, `src/guides.ts` takes every folder in `apps/` with a `src/guide/brand.ts` and loads its
`config.ts` through Vite's `runnerImport` (each chapter's `?banner` import comes back empty: only chapter 1's banner is read, from the
file). From each guide it takes:

- its brand: name, game, publisher, address, corners and display font;
- its palette, from `theme.css` (core's `palette.ts`);
- its chapters and rows, from the config;
- the three largest goals among the lists the game itself keeps on its board (`completion.board`, labelled from `categories`), the same
  totals its Progress page shows every reader.

`src/plugin.ts` then:

- makes three copies of each chapter 1 banner (480, 960 and up to 1,800px wide);
- copies the icon tiles and the display font, with the font's licence into `fonts/`;
- writes one stylesheet of the guides' palettes, fonts and corners, and the tab's icon (the logo's ring, one arc per guide);
- makes the link preview's picture (`src/og.ts`), a 1200×630 JPEG named by its content: six chapter 1 banners, two across and three
  down, under the logo on a light card, its ring one arc per guide. Past six guides the wall shows six spread evenly across A to Z, and
  the ring gains an arc with each guide, so a new guide changes the picture. The word "hund" is drawn from outlines kept in `og.ts`, since sharp can't set text in the page's woff2;
  the comment above them says how to make them again. Its tags go in `index.html`'s head alone, at `<!--home:og-->`;
- renders `src/page.tsx` to static HTML in `index.html` and `404.html`.

React runs only at build. The browser gets the HTML, two stylesheets and `src/main.ts`, about 1 kB, which shows the Find field and
narrows the guides as a reader types (`src/find.ts`). Without it the field stays hidden and every guide shows. Light and dark follow the
system. The page keeps nothing in the browser: progress lives on each guide's own address.

A new guide shows up by itself. Its build stops, naming what's missing, if the guide has no `src/guide/banners/chapter-1.webp`, no
`public/icons/tile-{40,80,120}.png`, or no licence beside its display font (`<Family-Name>-OFL.txt`).

## Scripts

From this folder: `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm test`. In the browser pane: `home` (dev) and `home-preview`. The dev
server reads the guides once, when it starts: restart it after changing a guide. At the root, `pnpm lighthouse home` audits the
production build as CI's `lighthouse-home` job does.

## Tests

- `page.test.ts`: the page as the build makes it. Every guide with a `vercel.json` in `apps/` is on it, linking to its `brand.home`. Its
  pictures and fonts are among the files the build writes. Find narrows the guides.
- `guides.test.ts`: what's read from each guide, and how the largest goals are picked.
- `find.test.ts`: how Find matches.
- `og.test.ts`: the link preview. Its tags name a picture the build writes, on `https://hundo.quest`, at the size they declare; which
  guides the wall shows; the logo's ring and word; the picture at one guide and at thirty.
- `deploy.test.ts`: `vercel.json` (the guides' headers, the cache only on a hit, the 404), the ignore step, the canonical, sitemap and
  robots, no inline script and no browser storage.
