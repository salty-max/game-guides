# Hundo

Spoiler-aware, installable completion guides for single-player games: one app per game, all built on one shared core.

| App | Game | Site | Vercel project |
| --- | --- | --- | --- |
| [`apps/koholint`](apps/koholint) | *Link’s Awakening* (Switch, 2019) | [koholint.hundo.quest](https://koholint.hundo.quest) | hundo-koholint |
| [`apps/rdr`](apps/rdr) | *Red Dead Redemption* | [rdr.hundo.quest](https://rdr.hundo.quest) | hundo-rdr |
| [`apps/echoes`](apps/echoes) | *Echoes of Wisdom* (Switch, 2024) | [echoes.hundo.quest](https://echoes.hundo.quest) | hundo-echoes |
| [`apps/lordran`](apps/lordran) | *Dark Souls Remastered* | [lordran.hundo.quest](https://lordran.hundo.quest) | hundo-lordran |
| [`apps/hallownest`](apps/hallownest) | *Hollow Knight* | [hallownest.hundo.quest](https://hallownest.hundo.quest) | hundo-hallownest |

Each app's history from its old repository is kept under its folder, so `git log -- apps/koholint` goes back to the first commit.

## Layout

- **`packages/core`** (`@hundo/core`, used through the workspace, not published) is the app itself. It holds the React 19 pages, components, stores and styles. It also holds the page shell (`index.html`, `theme-init.js`), the shared test suites and `vite.ts`, which builds an app's whole Vite and Vitest config from its brand.
- **`packages/stories`** (`hundo-stories`, private, dev tools only) is Storybook for core's components. Each component has stories for every state, shown under any guide's palette, fonts and corners in light and dark (a toolbar switches them). Its tests render every story in Chrome under all six guide and theme combinations and check each with axe. It is no part of a guide's bundle, precache or deploy.
- **`apps/<name>`** is one guide:
  - `src/guide`: brand, config, chapter data, palette, panels (often none) and banners;
  - `public/fonts` and `public/icons`;
  - `scripts/icon-master.webp` and `scripts/favicon.svg`, the guide's icon art, and `scripts/icons.mjs`, which exports them;
  - `vercel.json`, a README and `docs/facts-to-verify.md`.

  Its `vite.config.ts` is a single call to `guideConfig`.
- **`services/sync`** is the sync API, a small server of its own: it lets a reader's devices share a guide's progress through a six-digit code, with no account. It is a separate Vercel project, `hundo-api`, at `api.hundo.quest` ([its README](services/sync/README.md)).
- **`lighthouse/`**: the Lighthouse audit every pull request runs on each guide's production build, its thresholds (`lighthouserc.mjs`) and the script that runs it ([docs/testing.md](docs/testing.md#lighthouse)).
- **`docs/`**: how to do each recurring task (below).
- **`harness/`**, `harness.toml`, `.claude/`: the git hooks, the task board and the review helpers sessions work under. The rules are in [CLAUDE.md](CLAUDE.md).

Every guide shares one house style. A guide chooses only its palette (`theme.css`), its two fonts and corner preset (`brand.ts`), its icon art and its banners ([docs/house-style.md](docs/house-style.md)).

Core reaches the guide through `virtual:guide/config`, `virtual:guide/panels` and `virtual:guide/theme.css`, which `vite.ts` aliases to the app's `src/guide`. A guide reaches core through its subpath exports, such as `@hundo/core/types`.

Routes are real paths (`/guide/3`, `/checklist/heart`, `/dashboard/<panel>`), and old `#guide/3` hash links redirect. The Sources page is gone, so `/sources` opens the reader's chapter. Each app is a PWA. It precaches the shell, fonts and banners, works offline, and asks before swapping in a new version.

## Privacy

### Sync codes

Progress lives in the reader's browser, and that stays true. To keep the same progress on another device (a Mac's browser and an installed phone app, say), a reader opens Sync devices in the guide, shows a six-digit code on one device and types it on the other, with no account. From then on each device sends its changes shortly after making them and picks up the others' when the guide opens or comes back to the front, and every 20 seconds to 2 minutes while it stays open (a short question, answered from one read when nothing has changed). Export and import still work; an import on a synced device replaces progress on every linked device, and the settings say so.

What the server keeps ([services/sync](services/sync/README.md#what-it-keeps) has the detail):

- No email and no name. Per device: a random id, a label like "Safari · iPhone · Koholint app" (the app part only for an installed guide), and the time it last synced. Per guide: the reader's checks and settings, each with the time it was last changed. The theme isn't synced.
- Two cookies, both set by the guide's own host through its `/api` rewrite: `hundo_sync` (a random device id and secret, unreadable by script, sent only to `/api`) and `hundo_link` (a short fingerprint of the group that opens nothing, which lets a guide know it is linked without a request). On hundo.quest they cover every guide in the browser, and last 400 days.
- The API is its own Vercel project, and the data is in an Upstash Redis database in Frankfurt. The server sees IP addresses, as any web server does, and uses them only through counters keyed by a salted hash, kept an hour at most, to limit tries at a code.
- Unlinking a device stops it syncing and leaves its progress. Another device of the group can also remove it (it is unlinked the next time it connects, and its progress stays on it), and one not synced for 60 days is removed by itself and has to be linked again. "Delete synced progress" erases the server's copy and every device record. Anything not synced for 400 days expires by itself.

### Visit counts

Each guide counts visits, with no cookie and no id, to learn which guides and chapters get used, how far readers get, and how much reading happens in the installed app. When the page goes to the background, the guide sends its own `/api` (the sync API) a few numbers:

- whether it ran as the installed app or in a browser tab, once a page load and again after half an hour away;
- which pages it showed: a chapter by its number only, a hidden chapter not at all, and no row, questline, filter or search;
- which chapters a tick on this device started (the first row checked) or finished (the last one), at most once each a page load. Ticks from sync, from another tab or from a backup don't count, though two devices that haven't caught up with each other can each count the same start, so these numbers are indicative.

The request carries no cookie and nothing that names the device. The server adds the numbers to that guide's totals for the day and keeps nothing else: no address, no browser, no time of day. The totals are per day, so on a quiet day with a single visit they are that one visit's numbers. The sync server also adds one to those totals for each new link between devices, and the stats script reads the sync groups' records to count how many hold how many devices; the records hold the device labels, and it prints none.

- The totals are kept 25 months in the same Upstash Redis database in Frankfurt as sync's data. They're sent to no one else and read with the project's own script (`pnpm -C services/sync stats`). Vercel, which runs the API, and Upstash handle the requests the way they handle sync's. Vercel's logs and firewall see the visitor's address, as they do for any page, and the counts never hold it.
- A browser sending Global Privacy Control or Do Not Track sends no counts, and a link it makes isn't counted. Guide settings has a switch, Count my visits, that does the same, and this device keeps it (it isn't synced).
- Counting stops writing for the month once it has used 100,000 of the database's commands, to leave sync its share. A call refused after that can still cost one command, and only the API's rate limit bounds those.

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

`pnpm check` runs `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build`, each across every package (`pnpm -r`). Lint fails on warnings. Inside an app folder, `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm test` and `pnpm icons` work on that guide alone. `pnpm screenshots` at the root retakes every guide's install-dialog pictures from its production build ([docs/core.md](docs/core.md#the-installed-app)). `pnpm lighthouse` runs CI's Lighthouse audit on every guide, or `pnpm lighthouse rdr` on one ([docs/testing.md](docs/testing.md#lighthouse)).

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
