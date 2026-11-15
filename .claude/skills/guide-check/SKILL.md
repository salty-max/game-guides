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
- **A change in `packages/core`:** all three guides. They cover both layouts, both corner presets and three palettes.
- **Pages:** the defaults are `guide=/guide/1,checklist=/checklist,progress=/dashboard,sources=/sources`. `--pages` replaces that list, so name every page you want, such as `--pages guide=/guide/1,c3=/guide/3,run=/dashboard/deathless`.
- **Hidden chapters:** a fresh visit shows only chapter 1, because spoiler protection is on. Add `--reveal` to seed a save with protection off, so `/guide/N` shows every chapter and its banner.

## 3. Shoot the change

```bash
node .claude/skills/guide-check/scripts/shoot.mjs --out <scratchpad>/after --apps echoes
```

What `shoot.mjs` does, so you don't redo it by hand:

- builds each guide and serves the build with `vite preview` on a free port, so nothing clashes with a server someone left running;
- opens it in the system Chrome (`playwright-core` from the workspace, `channel: "chrome"`), so no browser download is needed;
- shoots desktop 1280×860 and phone 390×844, each in light and dark, at 2× scale;
- seeds `<storagePrefix>.theme` in localStorage before the first paint, the way `theme-init.js` reads it, and blocks service workers so every shot is the fresh build;
- writes `<app>-<page>-<size>-<theme>.png` and `report.md`, and exits 1 if any shot had a problem.

Add `--full` for whole-page shots.

## 4. Read it

1. **Open `report.md`.** Sideways scroll or a console error is a bug: fix it and shoot again. The "Fonts loaded" column lists the guide's own `@font-face` families that loaded. If one is missing, that font failed and the page fell back.
2. **Look at every shot.** Check the change itself first. Then check:
   - the banner (art on the right, stacked above the text on a phone);
   - contrast in dark mode;
   - text that wraps badly at 390px;
   - focus rings and checkboxes.
3. **Interactions** (a tick and its undo toast, the settings dialog): drive them in the browser pane, or write a few lines of Playwright in the scratchpad on top of what `shoot.mjs` does. Each new browser context starts with empty storage, so there's nothing to clean up.

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

When the user has to choose between looks, build one page that draws every option in all three guides' palettes, fonts and art, and ask through the question tool (a child sends the options to its opener, which asks). That's how the house style was picked.

## 6. What this can't check

- The service worker, offline mode and the update prompt.
- The CSP and the cache headers.

Both only exist on a Vercel deployment. The `guide-deploy` skill checks them on the preview.
