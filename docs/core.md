# Changing core

`packages/core` is the app: its pages, components, stores, styles, the page shell and the build config. Every guide ships it, so a core change reaches all three sites. All three Vercel projects rebuild on it, because their ignore commands watch `packages/core`.

## How core and a guide meet

- **Core reads a guide only through `virtual:guide/…`.** `guide.ts` imports `virtual:guide/config`, `Layout.tsx` and `DashboardPage.tsx` import `virtual:guide/panels`, and `main.tsx` imports `virtual:guide/theme.css`. `vite.ts` aliases `virtual:guide/` to the app's `src/guide/`, and each app's `tsconfig.json` maps the same path for the typechecker. A new file core reads this way must then exist in every guide.
- **A guide reads core only through the subpath exports** in `packages/core/package.json`: `types`, `format`, `guide`, `progress-state`, `store/*`, `components/*`, `vite` and `icons`. To give guides something new, add an export. There's no barrel file, on purpose.
- **`config.ts` stays at the bottom of the import graph.** A guide's `config.ts`, and the helpers it imports (`run-log.ts`, `estimate.ts`), use only `@hundo/core/types` and `/format`. Core's `guide.ts` imports the config, and the stores import `guide.ts`. A config that reached for a store or a component would close the loop. Panels can use core's stores and components, because nothing in the config imports them.
- **Per-guide saved state** goes in `extra`. A guide declares its type by declaration merging on `"@hundo/core/types"`'s `Register`, as `run-log.ts` and `estimate.ts` do. `GuideConfig.state.extra` then reads and initialises it.

## Saved progress

Readers' progress lives in their browser, so a careless change can wipe it.

- The keys are `<storagePrefix>.v1` for progress (`progress-state.ts`) and `<storagePrefix>.theme` for the theme (`store/theme.ts`). `theme-init.js` reads the theme key before the app loads. Don't change how either key is built. Each guide's `guide.test.ts` pins both full keys.
- `boot.ts` runs before any store reads storage. It redirects the old hash routes (`#guide/3`). For a guide that moved address (`brand.home` and `brand.movedFrom`), it also hands each reader's progress over from the old address to the new one, through the URL fragment. `boot.test.ts` covers the handover, and [deploying.md](deploying.md#pitfalls) says when to use it. `main.tsx` imports it first, and renders nothing while it's leaving for the new address. Keep that order.
- Saves and backups use one format, `{ version: 3, guide, checks, ceiling, spoilers, chapter, extra }`. `validateState` reads every save on load and every imported backup, and quietly drops checks for ids the data doesn't have.
- To change the format: bump `version` inside the saved object (not the key's `.v1`, which stays forever), keep reading every older version, and write only the new one. Then extend `progress-state.test.ts` and each guide's legacy cases in `guide.test.ts`, the ones that load real older saves. The three guides still read their saves from before the shared format through `config.state.legacy`.

## The page shell

- `index.html` is core's, filled in per guide by `vite.ts` from the brand: title, description, theme colour, corners, storage prefix and the `@font-face` rules. In dev, core's plugin serves it for any HTML navigation, so deep links like `/guide/3` work under `pnpm dev`.
- **`theme-init.js` stays an external file.** It sets `data-theme` before the first paint, so the page never flashes the wrong theme. The CSP every guide sends has `script-src 'self'`, which blocks inline scripts. `vite.ts` serves the file in dev and emits it in the build, and the service worker precaches it. `deploy.test.ts` fails if core's `index.html` template gains an inline script, or the CSP allows one. It doesn't see the built page, so after a change to the Vite plugins, check `dist/index.html` for injected scripts too.

## Styles

- `styles.css` holds the whole house style ([house-style.md](house-style.md)). A guide only sets the eleven palette colours, and everything else is derived from them or fixed here.
- A colour that the contrast test checks has to be a hex value or exactly `color-mix(in srgb,var(--a) N%,var(--b))`, with no spaces after the commas. Anything else makes the theme test throw "not a colour this test can resolve". The test also fails if `styles.css` uses a `var(--…)` that neither the palette nor core defines.
- After a style change, check all three guides in the browser. They differ in palette, fonts, corners, layout and the length of their text ([testing.md](testing.md#in-a-browser)).

## Tests

- Core has no test script of its own: it can't run without a guide. Each app's Vitest runs its own `src/**/*.test.*` plus every test under `packages/core/src`, against that guide's config. A new shared test goes in `packages/core/src`, and runs three times.
- A test for one layout only: wrap it in `describe.runIf(config.layout === "article")`, as `App.test.tsx` does.
- **Raw CSS loads empty in Vitest unless it's let through.** `vite.ts` sets `test.css.include` to `/\.css\?raw$/`, so `?raw` imports get their text and any other CSS import gets nothing. Read a stylesheet as text with `?raw`. Before that line existed, the theme test had been passing on an empty string.
- `test.env.GUIDE_ROOT` is the app folder. `deploy.test.ts` uses it to read the app's `vercel.json` and compare it with the other apps'.

## Before you commit

- `pnpm check` at the root runs lint, typecheck, tests and build for every package. Each app's typecheck includes core's source, so core is checked against all three real configs. A change to `GuideConfig` or `Brand` fails until every guide follows it.
- Check the change in a browser in at least one article guide (Koholint or Echoes) and Red Dead's checklist layout, on desktop and phone, in light and dark.
- Remember that all three sites deploy from this one change. Check each preview before production ([deploying.md](deploying.md)).
