# Adding a guide

A guide is one folder in `apps/`. It holds its data, its look (palette, fonts, corners, icon art, banners) and its deploy settings. Everything else comes from `packages/core`, and core's shared tests then hold the new guide to the same rules as the others.

Start from `apps/echoes`, the plainest of the three: article layout, no panels and no per-guide saved state. Copy Red Dead's `config.ts` instead only if the game suits a mission list with route filters (`layout: "checklist"`).

## 1. Copy the folder

```bash
rsync -a --exclude node_modules --exclude dist apps/echoes/ apps/<name>/
```

Then, in `apps/<name>`:

- **`package.json`**: set `name` to `<name>-field-guide` and `version` to `1.0.0`. The package name, the Vercel project, the `.vercel.app` subdomain and the storage prefix all use the same string in the existing guides. Keep that, so there's one name to look up.
- **`vercel.json`**: leave it as copied. `packages/core/src/deploy.test.ts` fails unless every guide's file is the same, and checks the parts that broke before ([deploying.md](deploying.md)).
- **`tsconfig.json`** and **`vite.config.ts`**: leave them. They're identical in every guide.

Delete what's Echoes' own:

- `src/guide/data/*`, apart from `missables.ts`, which you rewrite;
- `src/guide/banners/*`;
- `public/fonts/*` and `public/icons/*`;
- the Echoes cases in `src/guide/guide.test.ts`, such as the crystal counts and the v1 saves.

## 2. Write `src/guide`

| File | What goes in it | Details |
| --- | --- | --- |
| `brand.ts` | names, storage prefix, fonts, corners | below |
| `config.ts` | layout, categories, chips, completion, texts | below |
| `data/chapter-N.ts` | one module per chapter | [chapter-data.md](chapter-data.md) |
| `data/missables.ts` | missables, or a reassurance while there are none | [chapter-data.md](chapter-data.md#missables) |
| `theme.css` | the palette: eleven colours, light and dark | [house-style.md](house-style.md#the-palette) |
| `panels.ts` | `export const panels: Panel[] = [];` | a panel only for a real per-game tracker, as Koholint's deathless run or Red Dead's calibration |
| `banners/chapter-N.webp` | one per chapter | [house-style.md](house-style.md#banners) |
| `guide.test.ts` | the game's own totals, the storage key | below |

### `brand.ts`

- `id`: written into every backup as `guide`, so a backup from another guide is refused. It's short, for example `echoes-of-wisdom`.
- `name`, `shortName` (under the installed icon), `title` (the document and social title), `description`.
- `storagePrefix`: the localStorage prefix. Progress is saved under `<prefix>.v1` and the theme under `<prefix>.theme`. **Pick it once.** Changing it after launch starts every reader from nothing.
- `backupFile`: the name of the exported JSON file.
- `mark`: the word in the header, above "FIELD GUIDE".
- `icon`: any name from `packages/core/src/components/Icon.tsx`.
- `game` (the breadcrumb root) and `credit` (small print under the rail).
- `corners` and `fonts`: [house-style.md](house-style.md#fonts-and-corners).

### `config.ts`

The full type is `GuideConfig` in `packages/core/src/types.ts`, and every field is commented there. What each guide decides:

- **`layout`**: `"article"` for prose sections with inline checks, `"checklist"` for collapsible route groups with filters.
- **`categories`**: `id → [plural, singular, icon, tone?]`. The tones are rose, violet, amber, clay, sky and mint. Every tag a row uses must be a category, and the first tag is the row's label.
- **`chips.checklist`**: the category filters on the checklist page. `chips.route` adds filters above the route in the checklist layout.
- **`badges`** (optional): secondary tags shown as a badge beside the label in route rows.
- **`quantity`** (optional): the category a row's `quantity` counts toward, like Echoes' Might Crystals.
- **`missables`** and **`reassurance`**: from `data/missables.ts`.
- **`banners`**: `byChapter(import.meta.glob<string>("./banners/chapter-*.webp", { eager: true, query: "?url", import: "default" }))`, as Echoes has it.
- **`defer`** (optional): rows Next up holds back until nothing else is left, such as optional amiibo outfits.
- **`completion`**:
  - `board`: the counts on the Progress page. Give a `goal` where the game has a fixed total.
  - `isCore`: which rows count toward the overall figure. The default is every row.
  - `overall`: an overall percentage and the words after it. With only a `label`, it's the share of core rows checked: Koholint shows that as "complete". A `percent` function replaces it with a model, like Red Dead's estimate of the in-game figure. Leave `overall` out and the page shows counts only, as Echoes does.
  - `left` and `unit: "points"`: only for a weighted model like Red Dead's estimate.
- **`state: {}`**: a new guide has no saves from before the shared format, so no `legacy`. Add `extra`, with a `Register` declaration, only for a panel that saves its own state. Koholint's run log is the example.
- **`text`**: the ten strings in `GuideText`.

### `guide.test.ts`

- Pin the game's own totals, as Echoes does with `targets`, so a missing row fails a count.
- Pin the storage keys, as every guide does at the bottom of its test. `STORAGE_KEY` comes from `@game-guides/core/progress-state` and `THEME_KEY` from `@game-guides/core/store/theme`:

  ```ts
  describe("storage", () => {
    // Readers' progress and theme live under these keys on this domain: new keys start every reader from nothing.
    it("keeps its storage keys", () => {
      expect(STORAGE_KEY).toBe("<name>-field-guide.v1");
      expect(THEME_KEY).toBe("<name>-field-guide.theme");
    });
  });
  ```

## 3. Fonts, icons, README

- **Fonts**: put the two `.woff2` files and their licence texts in `public/fonts`, and name them in `brand.fonts`.
- **Icons**: draw the motif in `scripts/icons.mjs`, then run `pnpm icons` from the app folder. Koholint's script is a 24-unit stroke glyph and Echoes' a filled 512px motif; copy whichever is closer. Core's `writeIcons` writes every size, the maskable icon and the square Apple icon ([house-style.md](house-style.md#icon)).
- **`README.md`**: what the guide covers, how to use it, its sources and credits. Copy the shape of Echoes' README.
- **`docs/facts-to-verify.md`**: what isn't confirmed yet ([chapter-data.md](chapter-data.md#facts-to-verify)).

## 4. Wire it into the repository

- Run `pnpm install` at the root. A new workspace package changes `pnpm-lock.yaml`. Commit the lockfile with the app, or CI's and Vercel's `--frozen-lockfile` install fails.
- Root `README.md`: add a row to the apps table. It's the one list of guides and their Vercel projects.
- `.claude/launch.json`: add a dev entry and a preview entry on the next free ports (5176 and 4176 after Echoes).

## 5. Check it

- Run `pnpm check` at the root. Core's shared suites run against the new guide: the data rules, the app flows for its layout, the theme's keys and contrast, the deploy settings.
- Look at it in a browser on desktop and phone, in light and dark ([testing.md](testing.md#in-a-browser)).

## 6. Deploy it

Creating the Vercel project and every deploy need the user's go. The steps are in [deploying.md](deploying.md#a-new-project): root directory `apps/<name>`, a preview first, then production.
