---
name: guide-new
description: "Start a new hundo guide, the fourth and after, from apps/echoes: the copied folder, brand.ts (with its hundo.quest home), the eleven-colour palette, fonts and corners, icon art, chapter data, banners and tests, then pnpm check, the browser check, and the new Vercel project's first preview. Use when the user decides to add a game to the guides."
---

# A new guide

[docs/adding-a-guide.md](../../../docs/adding-a-guide.md) has every step's detail. This skill runs them in order, with the checks and the user's decisions where they belong.

## 0. Before any file

- Open the card: `bun harness/board.ts add hundo "<Game> guide" --repos hundo …`. Work on a branch.
- Settle with the user, through the question tool:
  - **The subdomain**, `<sub>`: the address is `https://<sub>.hundo.quest` and goes in `brand.home` (Koholint is `koholint`, Red Dead `rdr`, Echoes `echoes`).
  - **The folder**, `apps/<name>`. The package, the Vercel project and the storage prefix are all `hundo-<sub>`, and the prefix can never change once the guide is live.
  - **The layout:** `article` (Koholint, Echoes) or `checklist` (Red Dead).
  - **The corners:** `narrow` (soft squares) or `normal` (pills).
  - **The two fonts,** with a licence that allows bundling (OFL, like the others).
- Find the research. For Dragon Quest it's `~/code/dragon-quest-1-hd2d-guide`, with chapters, checklists, sources and banners.

## 1. Copy

```bash
rsync -a --exclude node_modules --exclude dist apps/echoes/ apps/<name>/
```

Then follow [step 1 of the doc](../../../docs/adding-a-guide.md#1-copy-the-folder): rename the package, keep the shared config files, and delete what's Echoes' own.

## 2. Brand, palette, fonts

- **`brand.ts`:** the fields in [the doc](../../../docs/adding-a-guide.md#brandts). Set `storagePrefix: "hundo-<sub>"` and `home` to the address. A new guide has no `movedFrom`, because nothing lived anywhere before.
- **`theme.css`:** the eleven colours, with `:root{` written without a space ([docs/house-style.md](../../../docs/house-style.md#the-palette)). Start from the guide whose look is closest. Run `pnpm test` in the app folder. The theme test names each failing pair and its ratio in both themes, so adjust the palette until it passes, and never lower a threshold.
- **Fonts:** the `.woff2` files and their licence texts go in `public/fonts`.

## 3. Content

- **`config.ts`**: as [the doc](../../../docs/adding-a-guide.md#configts) says, with `state: {}`.
- **Chapter data, missables, `facts-to-verify.md`**: use the `guide-content` skill.
- **`panels.ts`**: `export const panels: Panel[] = [];`. A panel only for a real per-game tracker, and only with the user's say.
- **`guide.test.ts`**: pin the game's own totals and the two storage keys. The snippet is in the doc.

## 4. Art

- **Icon:** draw the motif in `scripts/icons.mjs`, starting from Koholint's for a stroke glyph or Echoes' for filled art. Run `pnpm icons` in the app folder, look at the PNGs in `public/icons`, and commit them.
- **Banners:** use the `guide-banners` skill. It starts with whatever the research folder already has.

## 5. Wire it in

Do [step 4 of the doc](../../../docs/adding-a-guide.md#4-wire-it-into-the-repository): `pnpm install` and the lockfile, the README's apps table, and `.claude/launch.json`. Write the app's README too.

## 6. Check

- At the root, `bun harness/q.ts check -- bun run check`.
- The `guide-check` skill on the new guide, with `--reveal`, so every chapter is shown.
- Review: run `bun harness/packet.ts hundo`, have the `reviewer` helper read it, fix what it finds, then `bun harness/review.ts hundo "<verdict>"`. Then commit.

## 7. Vercel, up to the first preview

- **The project:** create it only with the user's go, following [docs/deploying.md](../../../docs/deploying.md#a-new-project). That covers the name, Root Directory, outside files, Node, production branch and the hundo.quest subdomain.
- **The first preview:** ask the push go, saying exactly what will be pushed, then check the preview as the `guide-deploy` skill says.
- **Stop there.** The first production deploy, the merge to `main`, is its own go.
