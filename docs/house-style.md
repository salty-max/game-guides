# The house style

Every guide looks like the same product. A guide chooses five things and nothing else:

| What | Where |
| --- | --- |
| its palette | `src/guide/theme.css` |
| its two fonts | `brand.fonts` in `src/guide/brand.ts`, files in `public/fonts` |
| its corner preset | `brand.corners` in `src/guide/brand.ts` |
| its icon art | `scripts/icon-master.webp` and `scripts/favicon.svg`, exported by `scripts/icons.mjs` to `public/icons` and `public/favicon.ico` |
| its banners | `src/guide/banners/chapter-N.webp` |

Everything else belongs to core (`packages/core/src/tokens.css`, the few global rules in `app.css`, and the components, in Tailwind):

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

A guide's icon is two pieces of art, both in `scripts/`:

- **`icon-master.webp`**, the painting: a 1024px opaque, full-bleed square, its subject inside a centred disk about 81% of the side, the square around it in the guide's dark `--surface`. It's what the home screen, the installed app and the top bar's brand tile show. The [artwork notes](icon-art.md) keep the prompts.
- **`favicon.svg`**, the tab drawing: a 32-unit square SVG, a rounded tile in the guide's light `--primary` with a flat version of the same subject. A painting shrunk to 16px is a smudge, the Red Dead hat worst of all, so the tab gets a drawing made for that size. Its tile carries its own background, so it reads in light and dark browser chrome alike.

`scripts/icons.mjs` hands both to core's `writeIcons`, which also draws the installed app's shortcut icons from core's glyphs in the guide's `--primary` and `--on-primary`. Run `pnpm icons` from the app folder after changing either, or the palette, and commit what it writes. Nothing regenerates them in the build.

- `icon-192.png` and `icon-512.png`: the painting with rounded corners (22% of the side), for the manifest.
- `maskable-512.png`: the painting at 440px on a 512 canvas filled from its own edge, so the disk is 70% of the side and inside the 80% circle a launcher may crop to.
- `apple-touch-icon.png`: the painting as an opaque 180px square, because iOS rounds the corners itself.
- `tile-40.png`, `tile-80.png` and `tile-120.png`: the painting for the brand tile in the top bar, at 1x, 2x and 3x of its 40px, square because the tile clips it to the guide's corners, with a hairline in its `--line`, an outline inset over the edge, that keeps the tile's shape on a dark bar, where the painting's own square is the bar's colour. They come to under 15 kB a guide.
- `favicon.svg`: the tab drawing as it is, which Chrome, Firefox and Safari since version 26 ([its release notes](https://developer.apple.com/documentation/safari-release-notes/safari-26-release-notes)) use in the tab.
- `public/favicon.ico`, at the root: the tab drawing at 16 and 32px, in full colour, for a browser that takes no SVG, and for any client that asks for `/favicon.ico` without reading the page (that path would otherwise get the app's page).

The PNGs are 256 dithered colours: a quarter to a half of the bytes of full colour, with no banding to see in the paintings. The service worker precaches them all, so the home-screen PNGs (125 to 230 kB a guide) reach every reader at install. The page links the ico (`sizes="32x32"`, with which Chrome takes the SVG over it: [Evil Martians' recipe](https://evilmartians.com/chronicles/how-to-favicon-in-six-files-that-fit-most-needs)), then the SVG, then the Apple icon. The manifest lists the three PNGs and no SVG: a scalable icon fits every size, so installed-app surfaces would show the tab drawing instead of the painting. `icons.test.ts` checks each guide's files against the page and the manifest.

## Banners

One WebP per chapter, `src/guide/banners/chapter-N.webp`, picked up by `byChapter(import.meta.glob(…))` in `config.ts`.

- The current banners are 1700 to 1800 pixels wide and 567 to 630 tall, about 3:1. Echoes' are 1800×600.
- The art fills the right 68% of the banner, anchored at 76% across. It fades in from the left over the palette tint: fully transparent for the first 9% of the art's width, fully opaque from 66%. At 1050px and narrower, the whole image stacks above the text. Keep the subject right of centre, and keep the left third quiet.
- The page crops any image that isn't 3:1 to fit (`object-fit: cover`), so make them exactly 1800×600.
- The service worker precaches every banner, so its size counts toward a reader's first install. The three guides' sets run from about 0.6 MB to 1.5 MB.
- Credit the art in the guide's README.

## Components

- **`Button` takes no `className` or `style`.** Its props type leaves both out, so passing one fails the typecheck. Pick a `look` (`""` for primary, `"outline"`, `"accent"`, `"danger"`, or `"link"` for words in the primary colour with no box, as the route's "Expand all") and, where it's needed, a `size` (`"default"` or `"compact"`; a link ignores it). `Button` and `IconButton` are Base UI's `Button` under the looks: a click on a disabled one does nothing, and `focusableWhenDisabled` keeps one that disables itself under the focus (announced as unavailable, still dimmed), as Koholint's "Undo death" at zero and the Sync screen's buttons while it works. The looks and sizes are `cva` variants in `packages/core/src/components/buttonStyle.ts`, written as Tailwind utilities from the house tokens; the link look is a class list of its own, since it shares nothing with the box. A new look is a core change: add it to `ButtonStyle` and to the `look` variants, with its own border colour (a border colour in the base would fight the looks'), and add a story. A container can narrow a button's padding by setting `--button-px` on it, as the chapter hero's actions do on a phone. `LinkButton` is a router link drawn as a button. An `IconButton` with `tooltip` also shows its label in a small box for a pointer or the keyboard (the top bar's theme toggle and Back); the label stays its accessible name.
- **Form controls live in `packages/core/src/components/controls.tsx`** (`Checkbox`, `RadioGroup`, `FileField`, `CodeField` for a short code with a box per character), `TextField.tsx` (a line of text with its description and error, `actions` for buttons on its line, `width="short"` for a value of a few characters, `alertError` for a form checked on submit), `SearchField.tsx` (the checklist's search box) and `Select.tsx`, on Base UI, and follow the same rule: no `className` or `style`, a story for every state. Base UI supplies the keyboard, focus and screen-reader behaviour; the guide's palette and corners come in through the tokens. Controls and the default button are 44px tall so a row of them lines up; the compact button and the chips are 40px. The file field keeps a native `<input type="file">` (Base UI has none) hidden but focusable, with its label drawn as a button. A row of filters or modes is a `ChipGroup` (in `ui.tsx`, Base UI's toggle group: one chip pressed, Tab reaches the group once and the arrows move along it), and a bar of how much is done is a `ProgressBar` (Base UI's progress).
- **A list of rows with actions** is `ItemList` and `ItemRow` in `packages/core/src/components/list.tsx` (a labelled list, each row a title, a quieter detail line and its buttons). Name each row's buttons by what they act on ("Unlink Max's iPhone"): a list has many of them.
- **The dialog is one Base UI dialog**, `DialogFrames.tsx` (loaded by the `DialogHost.tsx` shell: [core.md](core.md#loaded-on-use)), showing a screen from `screen-list.ts`: its title, whether it's an alert (a question that needs an answer, not dismissed by a click outside), its size and its body component. A screen's body is made of the parts in `dialog.tsx` (`DialogBody`, `DialogFooter`, `DialogText`, `DialogDescription`, `DialogStatus`, `DialogSeparator`). Say what happens in a dialog through `DialogStatus`: everything behind a modal is hidden from screen readers, so the page's own announcer can't be heard. To announce something after a dialog closes, close it with `closeDialogThen`. A new screen adds its `kind` to `DialogState` in `store/ui.ts`, its body, and one entry in `screen-list.ts`; the host doesn't change. Mark the element that should take the focus on opening with `data-autofocus`.
- A guide's own panel, such as `DeathlessRun.tsx` or `Calibration.tsx`, is built from core's components only: `Panel` and its parts (`PanelTitle`, `PanelText`, `PanelFigure` for one big number, `PanelForm`, `PanelActions`), `ChipGroup`, `TextField`, `Button`. A guide can't pass a `className` or a `style` at all (an ESLint rule on `apps/*/src`, which fails `pnpm check`), so `theme.css` stays a palette and a look a guide needs becomes a core part or variant.
- **The page's parts are core components too**, each with its looks as `cva` variants and a story: `PageHeading` (a title, an `intro` line and a `stat` pill) at the top of a page (there's no breadcrumb: the top bar names the guide and the nav the page), `Callout` (an icon and a note, the checklist's spoiler line) and `Empty` (a list with nothing in it), `Tag` and `Quantity` (a category's label in its tone, `at` "prose" in an article's text or "column" at the end of a checklist row), `SourceLine` (a group's sources), `ChapterHero`, `NextUp`, `ChapterNav` (the end of a chapter, `in` "route" or "article"), `Stat` and `WhatsLeft` on the dashboard, and `ArticleRoute` for a chapter in prose. `Panel` takes a `pad` ("snug" for a short list between other parts, as Next up) besides its `space`. The category tones are in `tone.ts`, shared by `Tag` and `Stat`. An icon is sized by what holds it (`[&_svg]` in that part's classes) or by its own classes, never by a class on the guide's side. A compact list's text starts under the step's words: its indent is the tick box's width plus its gap (`--spacing-check`, `--spacing-check-gap` in `tokens.css`), so moving either moves both.
