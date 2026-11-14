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

CI (`.github/workflows/ci.yml`) runs the same four steps after `pnpm install --frozen-lockfile`, on every pull request and every push to `main`. A red CI and a green `pnpm check` on your machine usually means a lockfile left out of the commit or a file that isn't committed.

## What the tests hold every guide to

Core's suites run against each guide:

- **`data.test.ts`**: chapters in order, unique row ids, known categories, https sources with labels, missables backed by two hosts, Next up and completion behaviour.
- **`progress-state.test.ts`, `store/progress.test.ts`, `actions.test.ts`**: saves round-trip, bad input is refused or cleaned, undo restores exactly, storage failures are survived.
- **`theme.test.ts`**: the palette's keys and contrast in both themes ([house-style.md](house-style.md#the-palette)).
- **`App.test.tsx`**: the main flows in the guide's layout. It ticks and saves, reveals chapters, uses Next up, bulk check and undo, the checklist and the dashboard.
- **`MissablesStrip*.test.tsx`**: the strip with and without flagged rows.
- **`deploy.test.ts`**: the app's `vercel.json`, the same in every app, and core's page template, held to the pitfalls in [deploying.md](deploying.md#pitfalls).

Each guide's own `guide.test.ts` adds its totals, its legacy saves, its extra state and its two storage keys.

## In a browser

The tests don't see layout, fonts, colour or how a page reads. Look at every visible change in a browser before calling it done. The `guide-check` skill (`.claude/skills/guide-check`) scripts what follows. It builds, serves and screenshots each guide at 1280×860 and 390×844 in both themes, and makes a before/after page.

### Start a guide

`.claude/launch.json` has one entry per guide, for Claude's browser pane (`preview_start` with the name):

| Name | What | URL |
| --- | --- | --- |
| `koholint`, `red-dead`, `echoes` | dev server | http://localhost:5173, 5174, 5175 |
| `koholint-preview`, `red-dead-preview`, `echoes-preview` | production build, then `vite preview` | http://localhost:4173, 4174, 4175 |

By hand:

```bash
pnpm --filter hundo-echoes dev
```

```bash
pnpm --filter hundo-echoes build && pnpm --filter hundo-echoes preview
```

Check a release-bound change on the production build. Dev mode skips the service worker and serves unbundled modules.

Every entry uses `--strictPort`, so it fails rather than drifting to another port when its own is taken. If one won't start, `lsof -nP -iTCP:<port> -sTCP:LISTEN` shows what's holding the port. That could be a server another session left running.

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

Testing writes to the guide's localStorage on `localhost`. When you're done, remove what you added (`localStorage.removeItem("<storagePrefix>.v1")`, and `.theme`), so the next check starts blank.

### What a local check can't cover

- **The service worker.** Claude's browser pane refuses to fetch `sw.js` (the request fails with "unknown error", for the old single-repo builds too). Check offline mode and the update prompt in a regular browser, or on a Vercel preview.
- **Headers.** The CSP, the security headers and the cache rules come from `vercel.json` and exist only on Vercel. Check them on a preview deployment ([deploying.md](deploying.md#preview-first)).
