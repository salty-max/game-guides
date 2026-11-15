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
- **`deploy.test.ts`**: the app's `vercel.json`, the same in every app, and core's page template, held to the pitfalls in [deploying.md](deploying.md#pitfalls), the `/api` route and its place before the catch-all, and a long cache only after the file was found, among them.
- **`sync/*.test.ts`, `SyncScreen.test.tsx`**: sync, from the ledger's merge to the screen ([core.md](core.md#syncing-devices)). `cycle.test.ts` runs two simulated browsers against the real API handler on an in-memory store, so the guide and the API are tested against each other. `ledger.test.ts` holds core's ledger equal to the API's.

Each guide's own `guide.test.ts` adds its totals, its legacy saves, its extra state (and how that syncs) and its three storage keys.

## Stories

`packages/stories` holds Storybook for core's components. A story is a component in one state; every component gets stories for every state (default, hover or focus where it matters, disabled, invalid, empty, long text). A new component or a new look isn't done without them.

- **See them:** `pnpm --filter hundo-stories storybook` (port 6006), or `preview_start` with `storybook` (port 6600). The toolbar's Guide and Theme switch the palette, fonts and corners, the same things a guide sets. The stories read Koholint's chapter data whichever guide is chosen: only the look changes.
- **Test them:** `pnpm test` in `packages/stories` (and so `pnpm check`) renders every story in Chrome and runs axe on it, once for each of Koholint, Red Dead and Echoes in light and dark: six Vitest projects named `<guide>-<theme>`. A violation fails the run, colour contrast included, because the CSS is really processed. To run one: `pnpm -C packages/stories exec vitest run --project echoes-dark Button`.
- **The guard:** `Foundation/Palette` fails if a project isn't really showing the guide and theme it claims (its `--primary`, the button's fill and text, the corner preset and the font). Without it the axe checks would pass on a page with no CSS.
- **Chrome:** the tests use the system Google Chrome (`channel: "chrome"`, as `shoot.mjs` does) and don't download a browser. CI relies on the runner having one.
- **Exempting a story** from axe takes `parameters: { a11y: { test: "todo" } }` on that story, with a comment saying why. Don't turn the check off for a whole file.
- **The dependency cache.** Vite pre-bundles the dependencies the stories use and keeps them in `packages/stories/node_modules/.cache/storybook`. A run with that cache empty is fine. A run with an old cache, after someone imports a Base UI part core didn't use before, used to fail with "Vite unexpectedly reloaded a test": the new part was found while tests were running, and the six projects (guide x theme) all started at once. `.storybook/main.ts` now lists every `@base-ui/react/...` part core imports (read from core's source, so there's no list to keep), which also changes the cache's key, so a new part is bundled before the first story loads. Tested with a throwaway component importing a new part: without the list, the run fails; with it, it passes.
- **Lazy parts are loaded first.** The dialog and the select load on use ([core.md](core.md#loaded-on-use)), so `.storybook/preview.tsx` has a loader that loads them before each story renders, and `src/test/setup.ts` does the same before a jsdom test; otherwise axe and the tests would be checking the stand-in. A new lazy part goes in `components/chunks.ts`, and both pick it up. `loading.test.tsx` tests what shows while a chunk is on the way, with a mocked `chunks`.
- **No Tailwind classes in a story.** Tailwind only reads core's `.tsx` files, so a `className="flex gap-3"` in a story renders unstyled and raises no error. Lay a story out with inline `style`, as `Button.stories.tsx` does, or use core's own components.
- Nothing in `packages/stories` reaches a guide's bundle, and a change to the stories alone doesn't rebuild a guide on Vercel. A change to the package's dependencies does, because it rewrites `pnpm-lock.yaml`, which each guide's ignore command watches, and so does the sync API's (`hundo-api`, `services/sync/scripts/vercel-ignore.sh`, which also watches the root `package.json`). Every guide's Vercel install and the API's (`pnpm install --frozen-lockfile`) also install the whole workspace, Storybook included; no browser is downloaded.
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

A session the app opened in its own worktree ([CLAUDE.md](../CLAUDE.md#sessions-and-worktrees)) runs its servers there ([which folder](#which-folder-the-pane-serves)), so two of them can preview the same guide at once. Every entry has `"autoPort": true`: when its port is taken, the pane starts the server on the next free one, up to 20 above it, and says so in the result. The dev entries pass `--port` and the pane rewrites it. The preview entries run a shell string, where the pane can't rewrite a flag, so they read `$PORT`, which the pane sets to the port it chose; `${PORT:-<port>}` falls back to the entry's own port where nothing sets it. Each guide's port sits 100 from the next, so a busy port moves a guide up within its own band and never onto another guide's.

That matters because the pane keeps each origin's service worker and caches between sessions. A port that once served another guide, or an older build, can answer in place of the build you just started: the page is the wrong guide, or last week's. Unregister it from the page and reload:

```js
for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister();
for (const k of await caches.keys()) await caches.delete(k);
location.reload();
```

To see what holds a port, `lsof -nP -iTCP:<port> -sTCP:LISTEN`.

### Which folder the pane serves

`preview_start` reads `.claude/launch.json` from the folder the session works in, starts the entry's process with that folder as its working directory, and expands `${workspaceFolder}` to it. For a session the app opened in a worktree, which is what `[session] worktrees = true` gives every child the desktop app opens, that is the worktree, so what it serves is its own code. Checked on 15 Nov 2026 from such a session:

- an entry added only to the worktree's `launch.json` was found and ran, and saw the worktree as `${workspaceFolder}` and as its `pwd`;
- `koholint` (dev) and `koholint-preview` (production build) listened with the worktree's `apps/koholint` as their cwd;
- a file added only to the worktree's `apps/koholint/public` came back 200 from both, and 404 from a `vite` run in the main checkout.

A session the app opened in the main checkout gets main instead (`get_session` shows `cwd: /Users/max/code/hundo` and no `worktreePath`). That holds even when it works in a worktree it made with `git worktree add`: the app's code picks the session's worktree or its own folder, and a hand-made worktree is neither (read in the app's code, not run). A session working in a worktree reported this on 15 Nov 2026: `lsof` put its servers in `/Users/max/code/hundo/apps/koholint`. The page looks fine either way, so it's easy not to notice. Not tried: a session that moves into a worktree with `EnterWorktree`.

Check before trusting a page. `preview_list` prints each server's `cwd`, or ask the process: `lsof -a -p $(lsof -nP -iTCP:<port> -sTCP:LISTEN -t | head -1) -d cwd`. It has to be the worktree you edit in.

When it isn't, serve the worktree yourself from the worktree. Build into a folder of your own, so the worktree's `dist` (and any server on it) stays as it is, then preview that folder on a free port:

```bash
cd <worktree> && pnpm -C apps/<name> exec vite build --outDir <scratchpad>/<name>-dist --emptyOutDir
```

```bash
cd <worktree> && pnpm -C apps/<name> exec vite preview --outDir <scratchpad>/<name>-dist --port <free port> --strictPort
```

Open `http://localhost:<free port>` in the pane with `navigate`. A free port: `node -e 'const s=require("net").createServer().listen(0,()=>{console.log(s.address().port);s.close()})'`. `vite build` skips the `tsc` that `pnpm build` runs, so the typecheck stays with `pnpm check`. Both commands were run this way on 15 Nov 2026, and the marker file from the list above came back 200 on the port, with the worktree's `dist` untouched.

`shoot.mjs` needs none of this: it builds and serves `--root` (the folder you run it from unless told otherwise), so from a worktree it shoots that worktree, and from any other folder `--root <worktree>` points it there.

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

### In the iOS Simulator

The installed iPhone app can be run on the Mac, in a real iOS WebKit, with Xcode (the free app from the Mac App Store, then `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer` and `sudo xcodebuild -license accept`, both needing the user's password) and an iOS runtime. On 15 Nov 2026 that was Xcode 27.2 with iOS 27.2 (`xcrun simctl list devices` lists iPhone 18 Pro, 17, 17e, Air). Xcode 27 lists the iOS 26.3 runtime as unavailable, so an older iOS, such as the owner's 18.7, can't be had this way: check what only 18.x does on a phone.

1. Serve a production build of the guide on the Mac (`pnpm --filter hundo-koholint build`, then `pnpm exec vite preview --port 4220` in the app's folder). The Simulator reaches the Mac at `localhost`, so no Wi-Fi address and no `--host`.
2. `xcrun simctl boot <udid>` (take the id from `simctl list devices`), then the iOS Simulator tool (`mcp__Claude_Code_iOS_Simulator__control`, its `attach` opens a live panel) to tap, swipe, screenshot and `set_appearance`. The first use of a device asks the user for permission.
3. In Mobile Safari open the guide (`xcrun simctl openurl <udid> <url>`, or typing it), then the address bar's menu, Share, View More, Add to Home Screen, leave "Open as Web App" on, Add; Home, find the icon (it lands on the last Home Screen page) and open it: it runs standalone, which is what the installed app is. The first Add to Home Screen sheet takes about ten seconds to enable its Add button.
4. The Simulator is slow: a tap's result shows two to six seconds later, so wait before a screenshot, and read one that shows nothing as "not yet" before calling it a failure. Menus have a different layout in light and dark appearance and between pages, so look before tapping.
5. To read a colour from a screenshot, sample the file (it is 1206×2622 for an iPhone 18 Pro), as `sharp` can: a screenshot of the status strip, the top bar and the page gave `rgb(255,254,249)` (the surface), `rgb(255,254,249)` and `rgb(246,245,238)` (the paper).

What the Simulator showed for the installed app on 15 Nov 2026 (in light; in dark only the page, the top bar and the status strip were looked at, not the dialogs): the frame fixed and only the main area scrolling; the Back button after a move; a dialog centred above the on-screen keyboard with the Back button of the code screen in view and the code field's ring whole; no focus ring after a touch; the toast clear of the home indicator. What it showed that is not as wanted: the status strip (see [core.md](core.md#the-installed-app)). What it did not show: the page bouncing (a pull can't be held and photographed through the tool) and iOS 18.

### Sync in a browser

A guide's dev and preview servers send `/api` to the local sync API, so start it first (`preview_start` with `sync-api`, or `pnpm -C services/sync dev`, port 8787 with an in-memory store that a restart empties). `SYNC_API=http://127.0.0.1:<port>` points a guide's server somewhere else, which is how two sessions each run their own pair.

Two devices need two cookie jars: the pane is one, and a second Chrome profile is the other (a `playwright-core` script with `executablePath` set to the system Chrome and a fresh context). To link them, show a code in one (settings, Sync devices, Show a code), type it in the other (Enter a code), then tick on one and, in the other, bring the page back after 10 seconds or more away (a `visibilitychange` to `hidden` and back) to see the tick arrive. localhost cookies ignore the port, so Koholint's and Red Dead's dev servers in one browser share a link, and the second guide joins by itself on opening. Linked browsers pile up as devices in the group; clear the in-memory store by restarting the API.

### What a local check can't cover

- **The `/api` rewrite on Vercel.** Locally the dev server's proxy stands in for it. Behind the real rewrite the API gets its own host and no `x-forwarded-host` naming the guide's, while `Cookie`, `Origin`, `Set-Cookie` and the visitor's address pass ([deploying.md](deploying.md#the-sync-api)). That was seen on a preview, so a change to the rewrite or to how the API reads who is calling has to be seen on one again.
- **Safari and an installed phone app.** On 15 Nov 2026, on production, Brave on a Mac and the installed Koholint app on an iPhone were linked by a code typed on the phone, and a tick and an untick went each way (Secure cookies over https worked in the installed app). Not yet seen: linking in Safari first and then adding a guide to the Home Screen (the cookie probe's plain-http finding says it should start linked), and a direct test of two installed apps' cookie jars (the Red Dead app wasn't linked by the Koholint app's link and took a code of its own, which fits one jar per app; the Echoes app wasn't installed to try). Linking the Red Dead app on that iPhone by a typed code, and ticks both ways with the Mac, were seen on 15 Nov 2026.
- **The installed app's frame.** The pane isn't an installed app, so the mark and the notch are faked by hand ([core.md](core.md#the-installed-app)): `data-standalone` on the root and `--safe-top: 47px`, `--safe-bottom: 34px`. On 15 Nov 2026 that showed, at 375×812 and on a desktop size, in all three guides (and the top bar with Back at 820, 900, 1040 and 1041px wide in Echoes, which has the longest name), the fixed top bar, only the content area scrolling, the drawer, the toasts and the dialog clear of the faked notch and home indicator, and the Back button. What only a phone shows: iOS's status bar and its colour next to the top bar, the home indicator, the feel of the scroll and whether the frame bounces, the edge swipe, a field's focus not zooming the page, and what the on-screen keyboard does to a fixed frame (a known iOS risk, not tried). The page's `display-mode` path and an installed desktop window weren't exercised either: Chrome's own emulation of the media feature didn't reach `matchMedia`.
- **The service worker's offline mode.** The pane registers the service worker (it once refused to fetch `sw.js`, and an old one answering for a new build is how that shows now), but offline mode hasn't been checked in it. Check it in a regular browser, or on a Vercel preview. The update prompt does work in the pane, though it takes a deploy: on 2026-11-15 it showed on all three live guides, each open in the pane before the deploy, and its Reload brought in the new build.
- **Headers.** The CSP, the security headers and the cache rules come from `vercel.json` and exist only on Vercel. Check them on a preview deployment ([deploying.md](deploying.md#preview-first)).
