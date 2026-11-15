# Hundo

Spoiler-aware, installable completion guides for single-player games: one app per game, all built on one shared core.

| App | Game | Site | Vercel project |
| --- | --- | --- | --- |
| [`apps/koholint`](apps/koholint) | *Link’s Awakening* (Switch, 2019) | [koholint.hundo.quest](https://koholint.hundo.quest) | hundo-koholint |
| [`apps/rdr`](apps/rdr) | *Red Dead Redemption* | [rdr.hundo.quest](https://rdr.hundo.quest) | hundo-rdr |
| [`apps/echoes`](apps/echoes) | *Echoes of Wisdom* (Switch, 2024) | [echoes.hundo.quest](https://echoes.hundo.quest) | hundo-echoes |

Each app's history from its old repository is kept under its folder, so `git log -- apps/koholint` goes back to the first commit.

## Layout

- **`packages/core`** (`@hundo/core`, used through the workspace, not published) is the app itself. It holds the React 19 pages, components, stores and styles. It also holds the page shell (`index.html`, `theme-init.js`), the shared test suites and `vite.ts`, which builds an app's whole Vite and Vitest config from its brand.
- **`packages/stories`** (`hundo-stories`, private, dev tools only) is Storybook for core's components. Each component has stories for every state, shown under any guide's palette, fonts and corners in light and dark (a toolbar switches them). Its tests render every story in Chrome under all six guide and theme combinations and check each with axe. It is no part of a guide's bundle, precache or deploy.
- **`apps/<name>`** is one guide:
  - `src/guide`: brand, config, chapter data, palette, panels (often none) and banners;
  - `public/fonts` and `public/icons`;
  - `scripts/icons.mjs`, which holds the guide's icon art;
  - `vercel.json`, a README and `docs/facts-to-verify.md`.

  Its `vite.config.ts` is a single call to `guideConfig`.
- **`services/sync`** is the sync API, a small server of its own: it lets a reader's devices share a guide's progress through a six-digit code, with no account. It is a separate Vercel project, `hundo-api`, at `api.hundo.quest` ([its README](services/sync/README.md)).
- **`docs/`**: how to do each recurring task (below).
- **`harness/`**, `harness.toml`, `.claude/`: the git hooks, the task board and the review helpers sessions work under. The rules are in [CLAUDE.md](CLAUDE.md).

Every guide shares one house style. A guide chooses only its palette (`theme.css`), its two fonts and corner preset (`brand.ts`), its icon art and its banners ([docs/house-style.md](docs/house-style.md)).

Core reaches the guide through `virtual:guide/config`, `virtual:guide/panels` and `virtual:guide/theme.css`, which `vite.ts` aliases to the app's `src/guide`. A guide reaches core through its subpath exports, such as `@hundo/core/types`.

Routes are real paths (`/guide/3`, `/checklist/heart`, `/dashboard/<panel>`, `/sources`), and old `#guide/3` hash links redirect. Each app is a PWA. It precaches the shell, fonts and banners, works offline, and asks before swapping in a new version.

## Scripts

You need pnpm and Node. The root `package.json` pins pnpm 11. CI and Vercel use Node 26, and Vite needs at least 20.19.

```bash
pnpm install
```

```bash
pnpm check
```

```bash
pnpm --filter hundo-koholint dev
```

`pnpm check` runs `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build`, each across every package (`pnpm -r`). Lint fails on warnings. Inside an app folder, `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm test` and `pnpm icons` work on that guide alone.

```bash
pnpm --filter hundo-stories storybook
```

That opens the component stories on port 6006. Their tests are part of `pnpm test`, and drive the system Google Chrome.

Typecheck and tests run per app. Each app's typecheck includes core's source, and core's suites run beside the guide's own tests. That way core is always checked against a real guide config, and a guide that breaks one of core's assumptions fails in its own app.

[CI](.github/workflows/ci.yml) runs the same four checks, after `pnpm install --frozen-lockfile`, on every pull request and every push to `main`.

The harness's git hooks need [bun](https://bun.sh). Install them once per clone, from the main checkout's root, never from a worktree ([CLAUDE.md](CLAUDE.md) says why):

```bash
bun harness/hooks.ts install .
```

## Docs

| Task | Doc |
| --- | --- |
| Add a guide | [docs/adding-a-guide.md](docs/adding-a-guide.md) |
| Write and source chapter data, missables and `facts-to-verify.md` | [docs/chapter-data.md](docs/chapter-data.md) |
| The house style: what a guide may set | [docs/house-style.md](docs/house-style.md) |
| Change core safely | [docs/core.md](docs/core.md) |
| Run the checks, look at a change in a browser | [docs/testing.md](docs/testing.md) |
| Deploy: Vercel projects, the ignore command, previews | [docs/deploying.md](docs/deploying.md) |

For Claude Code sessions, `.claude/skills/` turns the recurring tasks into procedures: `guide-new`, `guide-content`, `guide-banners`, `guide-check` and `guide-deploy`.

Adding a guide starts from a copy of `apps/echoes`. Each guide deploys as its own Vercel project with its folder as the Root Directory and lives on a hundo.quest subdomain. Every change is checked on a preview deployment before production.
