# The house style

Every guide looks like the same product. A guide chooses five things and nothing else:

| What | Where |
| --- | --- |
| its palette | `src/guide/theme.css` |
| its two fonts | `brand.fonts` in `src/guide/brand.ts`, files in `public/fonts` |
| its corner preset | `brand.corners` in `src/guide/brand.ts` |
| its icon art | `scripts/icons.mjs`, written to `public/icons` |
| its banners | `src/guide/banners/chapter-N.webp` |

Everything else belongs to core (`packages/core/src/styles.css` and the components):

- the topbar and rail, which follow the light or dark theme;
- one banner treatment;
- one 26px checkbox;
- headings in the display font at weight 700, in the case they're written;
- the button looks: primary, outline, accent and danger;
- the category tones, status colours and shadows.

A guide that wants to look different in some other way needs a change to the house style, which is a core change for every guide ([core.md](core.md)).

## The palette

`theme.css` sets the same eleven colours twice, once for `:root` and once for `:root[data-theme="dark"]`:

`paper`, `surface`, `raised`, `ink`, `muted`, `line`, `primary`, `on-primary`, `accent`, `on-accent`, `focus`

```css
:root{
  --paper:#f8f4fc;--surface:#fffefb;--raised:#f3ecfb;--ink:#2a2444;--muted:#5b5576;--line:#e1d8ef;
  --primary:#6648b0;--on-primary:#fff;--accent:#f0bd4a;--on-accent:#3b2a05;--focus:#7a4fd0;
}
:root[data-theme="dark"]{
  --paper:#131025;--surface:#1d1936;--raised:#262046;--ink:#f0ebff;--muted:#c5bde0;--line:#3b3468;
  --primary:#c4b0ff;--on-primary:#1c1438;--accent:#f0bd4a;--on-accent:#3b2a05;--focus:#e5c06a;
}
```

Core derives every other colour from these with `color-mix`: borders, the checkbox edge, hovers, soft fills, the rail, the banner tint and the missable border. `packages/core/src/theme.test.ts` holds each guide's palette to these rules:

- **Exactly the palette.** Those two blocks, those eleven keys, each a plain hex colour, and no other rule. A radius, a font or a banner rule sneaked into `theme.css` fails the test.
- **Text at 4.5:1:**
  - `ink` on `paper`, `surface`, `raised`, the rail and both ends of the banner tint;
  - `muted` on `paper`, `surface`, `raised` and the rail;
  - `primary` on `paper` and `surface`;
  - `on-primary` on `primary`, `on-accent` on `accent`;
  - `paper` on `ink`, for the banner's kicker;
  - the soft fill's text.
- **Controls at 3:1:** the checkbox edge and the ticked fill on `surface`, and the focus ring on `paper` and `surface`.

The test checks both themes and prints the pair and its ratio when one fails. Tune the palette until it passes; don't lower a threshold.

Write the light block's selector as `:root{`, with no space before the brace, as the three guides do. `packages/core/vite.ts` reads the light palette by splitting on exactly that text, to fill the `theme-color` meta tag and the manifest's colours from `surface` and `paper`. With a space, the build and the tests still pass, but the page ships `content="%GUIDE_THEME_COLOR%"` and the manifest has no `theme_color` or `background_color` (tried on Echoes, 2026-11-14).

## Fonts and corners

- **`brand.fonts`**: `display` for headings and `sans` for everything else. Each has:
  - a `family`;
  - a `file` in `public/fonts`, as `.woff2`;
  - a `weight`: the variable range the file covers, such as `"100 900"`, or a single weight;
  - a CSS `fallback` stack.

  The build writes the `@font-face` rules into the page head, and the service worker precaches the files. The display font must have weight 700, because every heading uses it. Red Dead's Barlow Condensed ships only 700, and that's why the house style settled on it. Keep the font's licence text beside the file, as `Fraunces-OFL.txt` is.
- **`brand.corners`**: `"narrow"` gives soft squares (8px buttons, 6px tags, 12px cards). Koholint and Red Dead use it. `"normal"` gives pills (round buttons, chips and tags, 16px cards); Echoes uses it. It changes corners only, not spacing. The value reaches the page as `<html data-corners>` at build time.

## Icon

`scripts/icons.mjs` draws the motif as a 512px SVG and passes it to core's `writeIcons`, which writes `public/icons`:

- `icon-192.png` and `icon-512.png`, with rounded corners;
- `maskable-512.png`: the background bleeds to the edges, and the motif stays inside the 80% safe zone;
- `apple-touch-icon.png` at 180px: opaque and square, because iOS rounds the corners itself;
- `favicon.svg`.

The second argument sets how much of the canvas the motif fills for each kind, such as `{ icon: 0.62, maskable: 0.5, apple: 0.6 }`. Run `pnpm icons` in the app folder and commit the PNGs. Nothing regenerates them in the build.

## Banners

One WebP per chapter, `src/guide/banners/chapter-N.webp`, picked up by `byChapter(import.meta.glob(…))` in `config.ts`.

- The current banners are 1700 to 1800 pixels wide and 567 to 630 tall, about 3:1. Echoes' are 1800×600.
- The art fills the right 68% of the banner, anchored at 76% across. It fades in from the left over the palette tint: fully transparent for the first 9% of the art's width, fully opaque from 66%. At 1050px and narrower, the whole image stacks above the text. Keep the subject right of centre, and keep the left third quiet.
- The page crops any image that isn't 3:1 to fit (`object-fit: cover`), so make them exactly 1800×600.
- The service worker precaches every banner, so its size counts toward a reader's first install. The three guides' sets run from about 0.6 MB to 1.5 MB.
- Credit the art in the guide's README.

## Components

- **`Button` takes no `className` or `style`.** Its props type leaves both out, so passing one fails the typecheck. Pick a `look` (`""` for primary, `"outline"`, `"accent"` or `"danger"`). A `className` would replace the button's own classes and its look with them. A new look is a core change: add it to `ButtonStyle` in `packages/core/src/components/ui.tsx` and give it a rule in `styles.css`.
- A guide's own panel, such as `DeathlessRun.tsx` or `Calibration.tsx`, uses core's components and classes. Its few extra styles live in core's `styles.css` (`.run-mode`, `.calibration`), so `theme.css` stays a palette.
