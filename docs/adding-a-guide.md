# Adding a guide

A guide is one folder in `apps/`. It holds its data, its look (palette, fonts, corners, icon art, banners) and its deploy settings. Everything else comes from `packages/core`, and core's shared tests then hold the new guide to the same rules as the others.

Start from `apps/echoes`, the plainest of the three: article layout, no panels and no per-guide saved state. Copy Red Dead's `config.ts` instead only if the game suits a mission list with route filters (`layout: "checklist"`).

## 1. Copy the folder

```bash
rsync -a --exclude node_modules --exclude dist apps/echoes/ apps/<name>/
```

Then, in `apps/<name>`:

- **`package.json`**: set `name` to `hundo-<sub>`, after the guide's subdomain (as in `hundo-rdr`), and `version` to `1.0.0`. The Vercel project uses the same name, so there's one name to look up. A new guide uses it as its storage prefix too. The first three guides keep their older prefixes (`koholint-field-guide`, `red-dead-field-guide`, `echoes-of-wisdom-field-guide`), which never change.
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
- `name`: the mark and "Hundo", as in `RDR Hundo`. It's the installed app's name and the header's label.
- `shortName`: the bare mark (`RDR`), without "Hundo", so the label under a home-screen icon isn't cut short.
- `title`: the document and social title. The name, then enough to name the game, so a search for it finds the guide and a newcomer who doesn't know the word still knows what it is: `RDR Hundo · Red Dead Redemption 100% checklist`, or `Echoes of Wisdom Hundo · Zelda completion checklist`, where the name already holds the game's. Use the word its `description` uses for what it covers: "100%", or "completion" as in Echoes.
- `description`.
- `storagePrefix`: the localStorage prefix. Progress is saved under `<prefix>.v1`, the theme under `<prefix>.theme` and a synced device's ledger under `<prefix>.sync`. **Pick it once.** Changing it after launch starts every reader from nothing.
- `backupFile`: the name of the exported JSON file.
- `mark`: the word in the header, above "HUNDO".
- `icon`: any name from `packages/core/src/components/Icon.tsx`.
- `game` (the breadcrumb root) and `publisher` (named in the rail's small print: "Unofficial fan guide, not affiliated with …").
- `corners` and `fonts`: [house-style.md](house-style.md#fonts-and-corners).
- `home`: the guide's address, `https://<sub>.hundo.quest`. The subdomain is chosen per guide, and the folder and package follow it (`apps/rdr`, `hundo-rdr`, `rdr.hundo.quest`). `movedFrom` stays out of a new guide; it's only for a guide that changes address ([deploying.md](deploying.md#pitfalls)).

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
- Pin the storage keys, as every guide does at the bottom of its test. `STORAGE_KEY` comes from `@hundo/core/progress-state`, `THEME_KEY` from `@hundo/core/store/theme` and `SYNC_KEY` from `@hundo/core/sync/local`:

  ```ts
  describe("storage", () => {
    // Readers' progress, theme and sync ledger live under these keys on this domain: new keys start every reader from nothing.
    it("keeps its storage keys", () => {
      expect(STORAGE_KEY).toBe("hundo-<sub>.v1");
      expect(THEME_KEY).toBe("hundo-<sub>.theme");
      expect(SYNC_KEY).toBe("hundo-<sub>.sync");
    });
  });
  ```

- If the guide keeps an `extra` state, pin how it syncs, as Koholint's and Red Dead's tests do: `flatten` from `@hundo/core/sync/fields` names one `x:<path>` key per leaf, and `viewFrom` rebuilds the state from keys through the guide's own `read`. Keep its keys to letters, digits, `_` and `-`, at most 60 leaves of at most 256 bytes each, or the leaf is left out of sync ([core.md](core.md#syncing-devices)).

## 3. Fonts, icons, README

- **Fonts**: put the two `.woff2` files and their licence texts in `public/fonts`, and name them in `brand.fonts`.
- **Icons**: draw the motif in `scripts/icons.mjs`, then run `pnpm icons` from the app folder. Koholint's script is a 24-unit stroke glyph and Echoes' a filled 512px motif; copy whichever is closer. Core's `writeIcons` writes every size, the maskable icon and the square Apple icon ([house-style.md](house-style.md#icon)).
- **`README.md`**: what the guide covers, how to use it, its sources and credits. Copy the shape of Echoes' README.
- **`docs/facts-to-verify.md`**: what isn't confirmed yet ([chapter-data.md](chapter-data.md#facts-to-verify)).

## 4. Wire it into the repository

- Run `pnpm install` at the root. A new workspace package changes `pnpm-lock.yaml`. Commit the lockfile with the app, or CI's and Vercel's `--frozen-lockfile` install fails.
- `services/sync/src/app.ts`: add the guide's `brand.id` to `GUIDES`, or the sync API turns its readers away. `services/sync`'s `project.test.ts` fails until it's there.
- Root `README.md`: add a row to the apps table. It's the one list of guides and their Vercel projects.
- `.claude/launch.json`: copy Echoes's two entries onto the next band, 5500 and 4500 (each guide's ports sit 100 apart, [testing.md](testing.md#start-a-guide) says why). Keep `"autoPort": true`, and `--port ${PORT:-<its port>}` in the preview's shell string.

## 5. Check it

- Run `pnpm check` at the root. Core's shared suites run against the new guide: the data rules, the app flows for its layout, the theme's keys and contrast, the deploy settings.
- Look at it in a browser on desktop and phone, in light and dark ([testing.md](testing.md#in-a-browser)).

## 6. Deploy it

Creating the Vercel project and every deploy need the user's go. The steps are in [deploying.md](deploying.md#a-new-project): root directory `apps/<name>`, a preview first, then production.
