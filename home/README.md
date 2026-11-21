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

React runs only at build. The browser gets the HTML, two stylesheets and `src/main.ts`, a couple of kB, which shows the Find field and
narrows the guides as a reader types (`src/find.ts`), and draws a returning reader's progress (`src/progress.ts`). Without it the field stays
hidden and every guide shows as it does for a first visit. Light and dark follow the system.

The page keeps nothing in the browser: progress lives on each guide's own address. It reads one cookie per guide, `hundo_p_<brand.id>`, which
the sync API sets on every hundo.quest host when the guide asks it to (core's `summary.ts`, [docs/core.md](../docs/core.md#hundoquests-summary)):
the guide's figure, as its Progress page shows it, and the chapter the reader was last in. A band whose guide has one says "57% complete ·
Chapter 6" beside a Continue button, with a bar in the guide's colour along its foot; in a phone's short band the line takes the goals' place,
on top of them, so no band changes height. Each band carries its guide's `brand.id` as `data-id` for it. Only the chapter's number shows,
never its title.

A browser linked by sync (a well-formed `hundo_link` cookie) also asks its group: one `POST /api/summaries` through the page's own `/api`,
which `vercel.json` sends to the sync API as the guides do, and which is the one route the API takes from `https://hundo.quest`
([its README](../services/sync/README.md#a-guides-summary)). The answer is the latest summary any device of the group sent for each guide,
an installed iPhone app's included, whose cookies never reach this browser, or `null` for a guide reset there. The cookies are drawn
first, at once. For each guide the answer names, the band then shows the higher figure of the group's and this browser's cookie, the
group's on a tie (`combine`), and `null` puts the band back as a first visit sees it (each band's first look is kept for that); a guide
it doesn't name keeps its cookie, and a band whose figure doesn't change isn't drawn again. Not "the newest wins", since the cookie
carries no time; and not the group's alone, since a guide's progress joins the group only when a device opens it after linking, so this
browser's own cookie can be ahead of the group's copy until it opens that guide. A reset on another device, `null`, wins over any cookie, so a reset
shows as one; the API keeps it only in place of a summary the group held, so a device that never had progress in a guide can't blank it
here. Until this browser opens the guide, two cases show the wrong figure: after an untick elsewhere, too high (this browser's older
cookie); and after a reset elsewhere of a guide this browser had progress in but hadn't opened since linking, not started (its progress
joins the group, and mostly comes back, when it opens the guide). Both are rarer than progress made before linking, which the higher
figure gets right. A third lasts until a linked device next opens the guide: a summary whose cookie landed while the group's write
failed (the store down) leaves the group's other browsers on the group's older figure. A browser that isn't linked makes no request, and any failure (offline,
a 401, the store down) leaves the cookies' bands as they are.

A new guide shows up by itself. Its build stops, naming what's missing, if the guide has no `src/guide/banners/chapter-1.webp`, no
`public/icons/tile-{40,80,120}.png`, or no licence beside its display font (`<Family-Name>-OFL.txt`).

## Scripts

From this folder: `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm test`. In the browser pane: `home` (dev) and `home-preview`. The dev
server reads the guides once, when it starts: restart it after changing a guide. Its dev and preview servers send `/api` to the local sync
API (`sync-api`, port 8787, or `SYNC_API`), as a guide's do: start it first to try a linked browser ([docs/testing.md](../docs/testing.md#sync-in-a-browser)). At the root, `pnpm lighthouse home` audits the
production build as CI's `lighthouse-home` job does.

## Tests

- `page.test.ts`: the page as the build makes it. Every guide with a `vercel.json` in `apps/` is on it, linking to its `brand.home`. Its
  pictures and fonts are among the files the build writes. Find narrows the guides. A guide's cookie fills in its band and no other, and
  a linked browser's group draws over them.
- `guides.test.ts`: what's read from each guide, and how the largest goals are picked.
- `find.test.ts`: how Find matches.
- `og.test.ts`: the link preview. Its tags name a picture the build writes, on `https://hundo.quest`, at the size they declare; which
  guides the wall shows; the logo's ring and word; the picture at one guide and at thirty.
- `progress.test.ts`: how a guide's cookie is read, and what a started band shows; a linked browser asks its group and an unlinked one
  asks nothing, the higher figure shows (a reset puts the band back, an unknown guide keeps its cookie, a band that doesn't change keeps
  focus), and only a good answer is read.
- `deploy.test.ts`: `vercel.json` (the guides' headers, the guides' `/api` route ahead of the 404, the cache only on a hit, the 404), the ignore step, the canonical, sitemap and
  robots, no inline script, no browser storage, and the guides' cookies read but never written.
