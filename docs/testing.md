# Testing and checking

## The checks

| Command | Where | What it runs |
| --- | --- | --- |
| `pnpm check` | root | `pnpm lint && pnpm typecheck && pnpm test && pnpm build` over every package |
| `pnpm test` | an app folder | that guide's tests plus core's shared suites, against that guide |
| `pnpm exec vitest` | an app folder | the same, in watch mode |
| `bun harness/q.ts check -- bun run check` | root | `pnpm check` through the harness: one verdict line, the log in `.cache/logs/`, and the tree stamped so a push is allowed |

- Lint fails on any warning (`--max-warnings 0`). The rule that matters most is `react-hooks/exhaustive-deps`.
- Typecheck runs per app and includes core's source, so core is checked against each real guide config.
- `pnpm build` runs `tsc` and `vite build` per app, which is what Vercel runs.
- `services/sync` is a package too, so `pnpm check` runs its lint, typecheck and tests (`pnpm -C services/sync test` alone). Its store contract also runs against real Upstash when `SYNC_TEST_REDIS_URL` and `SYNC_TEST_REDIS_TOKEN` name a test database ([its README](../services/sync/README.md#run-it)).

CI (`.github/workflows/ci.yml`) runs the same four steps after `pnpm install --frozen-lockfile`, on every pull request and every push to `main`. A red CI and a green `pnpm check` on your machine usually means a lockfile left out of the commit or a file that isn't committed.

## What the tests hold every guide to

Core's suites run against each guide:

- **`data.test.ts`**: chapters in order, unique row ids, known categories, https sources with labels, missables backed by two hosts, Next up and completion behaviour.
- **`progress-state.test.ts`, `store/progress.test.ts`, `actions.test.ts`**: saves round-trip, bad input is refused or cleaned, undo restores exactly, storage failures are survived.
- **`theme.test.ts`**: the palette's keys and contrast in both themes ([house-style.md](house-style.md#the-palette)).
- **`App.test.tsx`**: the main flows in the guide's layout. It ticks and saves, reveals chapters, uses Next up, bulk check and undo, the checklist and the dashboard, and asks the browser to keep progress after a tick, not on load, with the dashboard's line when it hasn't agreed.
- **`MissablesStrip*.test.tsx`**: the strip with and without flagged rows.
- **`persistence.test.ts`**: storage is asked to stay on the first tick in that tab, not for another tab's tick, at most every 30 days, and never with an error ([core.md](core.md#keeping-storage)).
- **`deploy.test.ts`**: the app's `vercel.json`, the same in every app, and core's page template, held to the pitfalls in [deploying.md](deploying.md#pitfalls).

Each guide's own `guide.test.ts` adds its totals, its legacy saves, its extra state and its two storage keys.

## Stories

`packages/stories` holds Storybook for core's components. A story is a component in one state; every component gets stories for every state (default, hover or focus where it matters, disabled, invalid, empty, long text). A new component or a new look isn't done without them.

- **See them:** `pnpm --filter hundo-stories storybook` (port 6006), or `preview_start` with `storybook` (port 6600). The toolbar's Guide and Theme switch the palette, fonts and corners, the same things a guide sets. The stories read Koholint's chapter data whichever guide is chosen: only the look changes.
- **Test them:** `pnpm test` in `packages/stories` (and so `pnpm check`) renders every story in Chrome and runs axe on it, once for each of Koholint, Red Dead and Echoes in light and dark: six Vitest projects named `<guide>-<theme>`. A violation fails the run, colour contrast included, because the CSS is really processed. To run one: `pnpm -C packages/stories exec vitest run --project echoes-dark Button`.
- **The guard:** `Foundation/Palette` fails if a project isn't really showing the guide and theme it claims (its `--primary`, the button's fill and text, the corner preset and the font). Without it the axe checks would pass on a page with no CSS.
- **Chrome:** the tests use the system Google Chrome (`channel: "chrome"`, as `shoot.mjs` does) and don't download a browser. CI relies on the runner having one.
- **Exempting a story** from axe takes `parameters: { a11y: { test: "todo" } }` on that story, with a comment saying why. Don't turn the check off for a whole file.
- **No Tailwind classes in a story.** Tailwind only reads core's `.tsx` files, so a `className="flex gap-3"` in a story renders unstyled and raises no error. Lay a story out with inline `style`, as `Button.stories.tsx` does, or use core's own components.
- Nothing in `packages/stories` reaches a guide's bundle, and a change to the stories alone doesn't rebuild a guide on Vercel. A change to the package's dependencies does, because it rewrites `pnpm-lock.yaml`, which each guide's ignore command watches. Every guide's Vercel install (`pnpm install --frozen-lockfile`) also installs the whole workspace, Storybook included; no browser is downloaded.
- The pnpm workspace's `allowBuilds` records that esbuild's install script isn't run: an unanswered one makes `pnpm install --frozen-lockfile` exit 1.

## In a browser

The tests don't see layout, fonts, colour or how a page reads. Look at every visible change in a browser before calling it done. The `guide-check` skill (`.claude/skills/guide-check`) scripts what follows. It builds, serves and screenshots each guide at 1280×860 and 390×844 in both themes, and makes a before/after page.

### Start a guide

`.claude/launch.json` has one entry per guide, for Claude's browser pane (`preview_start` with the name):

| Name | What | URL |
| --- | --- | --- |
| `koholint`, `rdr`, `echoes` | dev server | http://localhost:5200, 5300, 5400 |
| `koholint-preview`, `rdr-preview`, `echoes-preview` | production build, then `vite preview` | http://localhost:4200, 4300, 4400 |

Those are the ports when nothing holds them. Read the port from `preview_start`'s result.

By hand:

```bash
pnpm --filter hundo-echoes dev
```

```bash
pnpm --filter hundo-echoes build && pnpm --filter hundo-echoes preview
```

Check a release-bound change on the production build. Dev mode skips the service worker and serves unbundled modules.

Sessions work in their own worktrees ([CLAUDE.md](../CLAUDE.md#sessions-and-worktrees)), so two of them can preview the same guide at once. Every entry has `"autoPort": true`: when its port is taken, the pane starts the server on the next free one, up to 20 above it, and says so in the result. The dev entries pass `--port` and the pane rewrites it. The preview entries run a shell string, where the pane can't rewrite a flag, so they read `$PORT`, which the pane sets to the port it chose; `${PORT:-<port>}` falls back to the entry's own port where nothing sets it. Each guide's port sits 100 from the next, so a busy port moves a guide up within its own band and never onto another guide's.

That matters because the pane keeps each origin's service worker and caches between sessions. A port that once served another guide, or an older build, can answer in place of the build you just started: the page is the wrong guide, or last week's. Unregister it from the page and reload:

```js
for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister();
for (const k of await caches.keys()) await caches.delete(k);
location.reload();
```

To see what holds a port, `lsof -nP -iTCP:<port> -sTCP:LISTEN`.

### What to look at

Do each of these on desktop and on a phone-sized viewport, in light and dark. The pane's `mobile` preset in `resize_window` is 375×812, and the browser's device toolbar works too. Any phone width from 375 to 390 will do.

1. **The page you changed**, and the guide, checklist, progress and sources pages if the change is in core.
2. **The theme:** the sun or moon in the header switches it, and the choice is saved under `<storagePrefix>.theme`. With nothing saved, the page follows the system setting.
3. **Fonts and banner:** both fonts load (not the fallback), and the chapter banner shows with its art on the right, or stacked above the text on a phone.
4. **No sideways scroll on the phone.** `document.documentElement.scrollWidth <= innerWidth` in the console should be `true`.
5. **No console errors.**
6. **Progress:** tick a row, reload, and it's still ticked. The undo toast undoes it.

For a core change, do this in an article guide (Koholint or Echoes) and in Red Dead, the checklist layout. For a visual change, take before and after screenshots of the same pages and compare them side by side.

### Clean up

Testing writes to the guide's localStorage on `localhost`. When you're done, remove what you added (`localStorage.removeItem("<storagePrefix>.v1")`, and `.theme` and `.persist`), so the next check starts blank.

### What a local check can't cover

- **The service worker's offline mode and update prompt.** The pane registers the service worker (it once refused to fetch `sw.js`, and an old one answering for a new build is how that shows now), but neither was checked in it. Check them in a regular browser, or on a Vercel preview.
- **Headers.** The CSP, the security headers and the cache rules come from `vercel.json` and exist only on Vercel. Check them on a preview deployment ([deploying.md](deploying.md#preview-first)).
