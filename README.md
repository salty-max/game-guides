# Game guides

Spoiler-aware, installable field guides for single-player games: one app per game, all built on one shared core.

| App | Game | Site |
| --- | --- | --- |
| [`apps/koholint`](apps/koholint) | *Link’s Awakening* (Switch, 2019) | [koholint-field-guide.vercel.app](https://koholint-field-guide.vercel.app) |
| [`apps/red-dead`](apps/red-dead) | *Red Dead Redemption* | [red-dead-field-guide.vercel.app](https://red-dead-field-guide.vercel.app) |
| [`apps/echoes`](apps/echoes) | *Echoes of Wisdom* (Switch, 2024) | [echoes-of-wisdom-field-guide.vercel.app](https://echoes-of-wisdom-field-guide.vercel.app) |

Each app's history from its old repository is kept under its folder, so `git log -- apps/koholint` goes back to the first commit.

## Layout

- **`packages/core`** (`@game-guides/core`, used through the workspace, not published) is the app itself. It holds the React 19 pages, components, stores and styles. It also holds the page shell (`index.html`, `theme-init.js`), the shared test suites and `vite.ts`, which builds an app's whole Vite and Vitest config from its brand.
- **`apps/<name>`** is one guide:
  - `src/guide`: brand, config, chapter data, theme tokens, optional panels and banners;
  - `public/fonts` and `public/icons`;
  - `scripts/icons.mjs`, which holds the guide's icon art;
  - `vercel.json`, a README and `docs/facts-to-verify.md`.

  Its `vite.config.ts` is a single call to `guideConfig`.

Core reaches the guide through `virtual:guide/config`, `virtual:guide/panels` and `virtual:guide/theme.css`. `vite.ts` aliases these to the app's `src/guide`, and the app's `tsconfig.json` maps them the same way. A guide's `config.ts` imports only core's `types` and `format`, so the two never import each other in a loop.

Routes are real paths (`/guide/3`, `/checklist/heart`, `/dashboard/<panel>`, `/sources`), and old `#guide/3` hash links redirect. Each app is a PWA. It precaches the shell, fonts and banners, works offline, and asks before swapping in a new version.

## Scripts

You need Node 20+ and pnpm. The root `package.json` pins pnpm 11.

```bash
pnpm install
```

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

```bash
pnpm --filter koholint-field-guide dev
```

The root scripts run in every package (`pnpm -r`). Inside an app folder, `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm test` and `pnpm icons` work on that guide alone.

Typecheck and tests run per app. Each app's typecheck includes core's source, and core's suites run beside the guide's own tests. That way core is always checked against a real guide config, and a guide that breaks one of core's assumptions fails in its own app.

## Add a guide

Start from `apps/echoes`, the plainest of the three: article layout, no panels and no extra saved state. Copy it to `apps/<name>`, rename the package and name its Vercel project to match. Then replace what's in `src/guide`:

1. **`brand.ts`** holds the brand fields:
   - `id`, which is written into backups;
   - `name`, `shortName`, `title` and `description`;
   - `storagePrefix`, the storage key. Never change it once the guide is live, or readers lose their progress;
   - `backupFile`;
   - `mark`, and `icon` (any name from `packages/core/src/components/Icon.tsx`);
   - `game` and `credit`;
   - `hero`: `"overlay"` puts a dark banner under a shade, `"inset"` gives a tinted hero with the art on the right;
   - `colors`: the light and dark theme colours and the manifest background;
   - `fonts`: display and body, each with a family, a file in `public/fonts`, a weight range and a fallback.
2. **`config.ts`** holds the guide's rules:
   - `layout: "article"`, or `"checklist"` for a mission list like Red Dead's;
   - `categories`, as `id → [plural, singular, icon, tone?]`. The tones are rose, violet, amber, clay, sky and mint;
   - `chips.checklist`;
   - `missables`, plus a `reassurance` with two independent sources while nothing is flagged;
   - `banners`, through `byChapter(import.meta.glob("./banners/chapter-*.webp", …))`;
   - `defer`, for optional rows that Next up should hold back;
   - `completion`:
     - `isCore`;
     - `overall`, only if the game shows a percentage;
     - `board`, with a `goal` where the game has a fixed total;
     - `left` and `unit`, only for a weighted model like Red Dead's;
   - `quantity`, if rows award amounts;
   - `state: {}`. Add `extra` only for a real per-guide panel;
   - the ten `text` strings.
3. **`data/chapter-N.ts`**, one module per chapter:

   ```ts
   export default {
     id: 1, title: "…", region: "…", teaser: "place name, no story", intro: "…",
     sources: [["Site · topic", "https://…"]],
     groups: [
       {
         title: "Section heading", location: "…", note: "…", sources: [["…", "https://…"]],
         compact: true, // only for catalogue lists (monsters, recipes…)
         rows: [["stable-kebab-id", ["primary-tag", "other-tag"], "Opening sentence", "Directions.", { quantity: 3, reference: "https://…" }]],
       },
     ],
   } satisfies RawChapter;
   ```

4. **`theme.css`**: copy the closest theme and change the values only.
5. **`panels.ts`**: `export const panels: Panel[] = [];`, unless the game needs its own tracker.
6. **`guide.test.ts`**: pin the game's own totals, as Echoes does with `targets`, so a missing row fails a count.
7. **The rest**:
   - `banners/chapter-N.webp`;
   - `public/fonts`;
   - the art in `scripts/icons.mjs`, then `pnpm icons`;
   - the README and `docs/facts-to-verify.md`.

The shared tests then hold the new guide to the same rules:

- ids are unique, because they're the saved checks;
- the first tag is the label and must be a category;
- every link is https;
- each flagged missable has two sources on different hosts;
- the theme sets every token core uses and nothing but tokens.

## Deploy

Each app is its own Vercel project, and its `vercel.json` lives in its folder:

| Project | Root Directory |
| --- | --- |
| koholint-field-guide | `apps/koholint` |
| red-dead-field-guide | `apps/red-dead` |
| echoes-of-wisdom-field-guide | `apps/echoes` |

Keep "Include files outside the Root Directory" on (the default), so `packages/core` is part of the build.

What each `vercel.json` sets:

- **Install:** `pnpm install --frozen-lockfile`. Run from the app folder, pnpm installs the whole workspace from the root lockfile.
- **Build:** `pnpm build` (typecheck plus `vite build`), output in `dist`.
- **Ignore command:** skips a build unless the app, `packages/core` or the root workspace files changed since the last deployment. It diffs against `VERCEL_GIT_PREVIOUS_SHA`, or the previous commit when Vercel leaves that empty. If that commit isn't in Vercel's shallow clone, `git diff` fails and the build runs anyway.
- **Rewrites:** a catch-all to `index.html` that skips `/assets`, `/fonts` and `/icons`. Don't turn on `cleanUrls`, because it breaks this rewrite.
- **Headers:**
  - a strict CSP with no inline scripts. That's why `theme-init.js` is a separate file;
  - security headers;
  - `no-cache` on `index.html`, `sw.js`, `theme-init.js` and the manifest;
  - one-year `immutable` caching on hashed `/assets`.

Check header changes against a real preview deployment, not just locally.

Storage keys come from each brand's `storagePrefix` and haven't changed, so readers keep their progress as long as each guide stays on its domain.
