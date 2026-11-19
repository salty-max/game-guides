---
name: guide-check
description: Check a hundo change in a real browser before calling it done. Build the production preview of each affected guide, screenshot it with the system Chrome at desktop and phone sizes in light and dark, read the report (sideways scroll, console errors, fonts), and make a before/after page for visual changes. Use after any visible change to a guide or to packages/core, and before asking for a push.
---

# Checking a change in the browser

The tests don't see layout, fonts, colour or how a page reads. [docs/testing.md](../../../docs/testing.md#in-a-browser) says what to look for. This is the procedure and its scripts.

## 1. Pass the checks first

Run `bun harness/q.ts check -- bun run check` at the root.

## 2. Pick the guides and pages

- **A change in one guide:** that guide.
- **A change in `packages/core`:** every guide. The first three cover both layouts, both corner presets and three palettes.
- **Pages:** the defaults are `guide=/guide/1,checklist=/checklist,progress=/dashboard`. `--pages` replaces that list, so name every page you want, such as `--pages guide=/guide/1,c3=/guide/3,run=/dashboard/deathless`.
- **Hidden chapters:** a fresh visit shows only chapter 1, because spoiler protection is on. Add `--reveal` to seed a save with protection off, so `/guide/N` shows every chapter and its banner.

## 3. Shoot the change

```bash
node .claude/skills/guide-check/scripts/shoot.mjs --out <scratchpad>/after --apps echoes
```

Run it in the background. It takes its turn in the machine's queue, behind any `check` or other heavy job, so it can wait for minutes, and its output goes to the log its verdict line names (`.cache/logs/`), the last lines after it. `report.md` in `--out` is still the report to read. The same goes for `tab-switch.mjs`, `tab-trace.mjs`, `reveal-probe.mjs` and `sheet-probe.mjs` below ([docs/testing.md](../../../docs/testing.md#heavy-jobs-share-the-mac)).

What `shoot.mjs` does, so you don't redo it by hand:

- builds each guide from `--root` (the folder you run it from unless you say otherwise) and serves the build with `vite preview` on a free port, so nothing clashes with a server someone left running. From a worktree it shoots that worktree's code, whatever the pane's servers serve. From a session whose own folder is the main checkout, pass `--root <worktree>`;
- opens it in the system Chrome (`playwright-core` from the workspace, `channel: "chrome"`), so no browser download is needed;
- shoots desktop 1280×860, tablet 768×1024 and phone 375×812 (as a touch screen), each in light and dark, at 2× scale;
- seeds `<storagePrefix>.theme` in localStorage before the first paint, the way `theme-init.js` reads it, and blocks service workers so every shot is the fresh build;
- writes `<app>-<page>-<size>-<theme>.png` and `report.md`, and exits 1 if any shot had a problem.

Add `--full` for whole-page shots.

## 4. Read it

1. **Open `report.md`.** Sideways scroll or a console error is a bug: fix it and shoot again. The "Fonts loaded" column lists the guide's own `@font-face` families that loaded. If one is missing, that font failed and the page fell back.
2. **Look at every shot.** Check the change itself first. Then check:
   - the banner (art on the right, stacked above the text on a phone);
   - contrast in dark mode;
   - text that wraps badly at 375px;
   - focus rings and checkboxes.
3. **Interactions** (a tick and its undo toast, the settings dialog): drive them in the browser pane, or write a few lines of Playwright in the scratchpad on top of what `shoot.mjs` does. A sweep of your own that launches several browsers or loops over the guides starts with `import { queueSelf } from "<root>/tools/queued.mjs"; await queueSelf("<name>")`, or runs as `bun harness/q.ts --queue <name> -- node <script>`, so it takes its turn too. Each new browser context starts with empty storage, so there's nothing to clean up.
   - **Which code the pane shows.** `preview_start` serves the folder the session works in: its worktree if the app opened it in one, the main checkout otherwise. Before trusting a page, read the `cwd` in `preview_list` (or `lsof -a -p $(lsof -nP -iTCP:<port> -sTCP:LISTEN -t | head -1) -d cwd`) and make sure it's the worktree you edit in. If it's main, build and `vite preview` from your worktree on a free port, as [docs/testing.md](../../../docs/testing.md#which-folder-the-pane-serves) lists.

## 5. Before and after, for a visual change

Shoot the base too, from a separate checkout of `main`:

```bash
git worktree add <scratchpad>/base origin/main
```

```bash
(cd <scratchpad>/base && pnpm install --frozen-lockfile)
```

```bash
node .claude/skills/guide-check/scripts/shoot.mjs --root <scratchpad>/base --out <scratchpad>/before --apps echoes
```

Put the two side by side. A missing "before" folder counts as empty, which suits a new guide. Capture the page whole if it goes into a report:

```bash
node .claude/skills/guide-check/scripts/compare.mjs <scratchpad>/before <scratchpad>/after <scratchpad>/compare/index.html
```

```bash
node .claude/skills/guide-check/scripts/page.mjs file://<scratchpad>/compare/index.html <scratchpad>/compare.png
```

Remove the base checkout afterwards with `git worktree remove <scratchpad>/base`.

When the user has to choose between looks, build one page that draws every option in every guide's palettes, fonts and art, and ask through the question tool (a child sends the options to its opener, which asks). That's how the house style was picked.

## 6. Speed of a page change

For a change to how pages are drawn or switched (the router, `Pages`, a page's mount), time it before and after, the base from the checkout in section 5:

```bash
node .claude/skills/guide-check/scripts/tab-switch.mjs --root <scratchpad>/base --out <scratchpad>/perf --label before
```

```bash
node .claude/skills/guide-check/scripts/tab-switch.mjs --out <scratchpad>/perf --label after
```

- `tab-switch.mjs` walks the phone tab bar in production builds (Chrome at 4x and 6x CPU, Playwright's WebKit): per switch, the tab lit, the page committed, painted and settled, long tasks, the longest frame gap, a tick on the checklist, and the page's weight. `--video` counts blank frames in WebKit's recording; `--vt off` removes `document.startViewTransition` (only telling on a build that still has a view transition).
- `tab-trace.mjs` traces one warm Guide → Checklist switch in Chrome at 6x and sums the main thread's work, and, given an unminified build (`vite build --minify false`), the JavaScript by function.
- `reveal-probe.mjs` times revealing the checklist in WebKit with one suspect (`:has()`, the hidden inputs, transitions, shadows, rows' `content-visibility`) taken away at a time.
- `sheet-probe.mjs` opens the checklist's filter sheet on a phone, goes Back and Forward, and counts the frames that still draw the sheet on the way back, with where the focus is (Chrome as Android and as desktop, WebKit).
- `sim-tabs.mjs` (not queued: it waits for you to open the page in the Simulator) runs the same walk in the iOS simulator's Safari, behind a proxy that puts the timing script first in the page; record the screen with `xcrun simctl io <device> recordVideo` alongside. Shut down only the simulator you booted.

## 7. What this can't check

- The service worker, offline mode and the update prompt.
- The CSP and the cache headers.

Both only exist on a Vercel deployment. The `guide-deploy` skill checks them on the preview.
