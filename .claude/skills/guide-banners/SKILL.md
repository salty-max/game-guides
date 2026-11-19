---
name: guide-banners
description: Make or bring in a hundo guide's chapter banners (src/guide/banners/chapter-N.webp, 1800×600). Reuse what the guide's research folder already has, or generate them with Codex's image generation in one consistent style per guide, composed for the inset banner (focal detail right of centre, a quiet left). Then size them, and check them in light and dark and on a phone. Use when a new guide needs banners, a chapter is added, or a banner is redone. The prompt recipe lives here, never in a README.
---

# Chapter banners

[docs/house-style.md](../../../docs/house-style.md#banners) says how the banner is shown and cropped. This is how one gets made.

## 1. Look for banners that exist

A guide's research folder may already have them. `~/code/dragon-quest-1-hd2d-guide/assets/banners/` holds ten 1800×600 WebP files, one per chapter, with a README that lists each scene and the shared prompt. Show them to the user and ask whether to use them. If yes:

- convert each one straight from the research folder to `apps/<name>/src/guide/banners/chapter-<N>.webp`, numbered by the guide's chapters, with step 5's command. Don't copy it there first: `sharp` refuses to read and write the same file. Dragon Quest's files are about 224 KB each, above the budget, so the conversion matters;
- move the style line into the table at the end of this file, so the recipe lives here and not in a README.

Generate only the banners that are missing, or the ones the user wants redone.

## 2. Find Codex

Codex wasn't on this Mac's `PATH` when this skill was written (2026-11-14). Look first:

```bash
which codex || /bin/ls ~/.volta/bin ~/.npm-global/bin /opt/homebrew/bin 2>/dev/null | grep -i codex
```

If it isn't there, ask the user before installing it (a child sends the question to its opener), saying the package and the command (`npm install -g @openai/codex`, or `brew install codex`). Installing software is their call, and so is signing it in. Then run `codex --help`, and check that this version can generate images and how: a tool it uses inside `codex exec`, or a flag. If it can't, stop and tell the user. Don't fall back to another image service without asking.

## 3. Fix the guide's style once

Every banner of one guide shares one style line. Use the guide's row in the table at the end. A new guide gets its row once the user approves its first banner. Banners that drift in style look broken next to each other.

## 4. The prompt

Each prompt is the guide's **shared prompt** plus one **scene**. The shared prompt is this recipe, with the brackets filled in:

> Original environmental illustration for a chapter banner in a fan walkthrough for [game]. [The guide's style line.] No characters, bosses, plot reveals, glyphs, text, logos, borders, UI, watermarks or panels. Full-bleed wide landscape, one scene, ultrawide 3:1 framing. Keep the main silhouette legible when cropped to the central band, with focal detail around 70 percent of the way across and slightly below mid-height. Lower-contrast atmospheric scenery on the left third, where the page fades the art out under the title. Deliberate palette, clear shapes, inviting composition.

A scene names the chapter's place, what's in it, the light, three or four colours, and what sits right of centre. For example:

> Gerudo Desert. A domed sandstone desert settlement and stepped temple ruins amid peach dunes and red-brown cliffs, with a slender turquoise oasis and palms as a crisp accent. Amber dusk, dusty rose, copper and warm gold. Emphasise the sandstone silhouette and oasis right of centre.

Rules for scenes:

- **Places and moods, never story.** No boss, no twist, no late-game reveal. A chapter whose teaser is "Late game" gets a scene that gives nothing away.
- **Original art.** Don't ask for the game's own artwork, characters or logos, and don't name an artist.

Ask Codex for each image, and save the full-size output in the scratchpad, never straight into the repository.

## 5. Size and place

Convert with `sharp`, which is in the workspace, to exactly 1800×600 WebP. The page crops any other size to fit (`object-fit: cover`), so a different shape loses its edges:

```bash
node -e 'require("sharp")(process.argv[1]).resize(1800, 600, { fit: "cover" }).webp({ quality: 80 }).toFile(process.argv[2]).then((i) => console.log(i.size))' <in> apps/<name>/src/guide/banners/chapter-<N>.webp
```

- **Keep each file small.** The service worker precaches every banner on a reader's first visit, with the 800 and 1320px copies the build makes of it, and the existing originals weigh 0.6 to 1.5 MB for five to thirteen banners (1.0 to 2.4 MB with the copies, for the first three guides). Above about 200 KB, lower the quality and convert again.
- `config.ts` picks the banners up through `byChapter(import.meta.glob<Banner>("./banners/chapter-*.webp", { eager: true, query: "?banner", import: "default" }))`, and the build makes the copies (`packages/core/banners.ts`). There's nothing else to wire.

## 6. Check how it reads

- Run the `guide-check` skill on the guide with `--reveal`, and with `--pages` naming every chapter, such as `--pages c1=/guide/1,c2=/guide/2,c3=/guide/3`.
- **On desktop, in light and dark:** the focal detail sits right of centre, nothing important sinks into the fade, and the title stays readable.
- **On a phone:** the whole image shows above the text, and it reads as a picture on its own.
- Show the user the set before committing. `compare.mjs` with an empty "before" gives one page of shots. The look is their call.

## 7. Credit it

The guide's README says the banners are original AI-generated illustrations, as Echoes' does. The prompts stay here, not in the README or in `docs/`.

## Style lines

| Guide | Style line |
| --- | --- |
| Echoes | A cohesive, beautifully lit miniature fantasy diorama with rounded handcrafted shapes, hand-painted wood and stone, touchable moss and vegetation, soft shadows, subtle depth of field, and the warmth of a storybook. |
| Dragon Quest I (research banners) | The art direction of an HD-2D Japanese RPG: a richly layered miniature scene, deliberately pixel-crafted architectural and foliage detail, tactile stone, water and wood, atmospheric volumetric light, gentle tilt-shift depth. Restrained JRPG concept-art composition with clear silhouettes at small sizes, sincere classic medieval fantasy. No pixel-grid overlay. |
| Lordran | Restrained painterly oil realism: hand-painted environmental concept art with subtle brush texture, a muted earthy palette, soft atmospheric light and grounded proportions. Empty places, no characters or bosses. Keep the overall image mid-toned and readable, never near-black. |
| Hallownest | Hand-inked painted environment, layered parallax, dark silhouette edges, graphic 2D shapes, subtle grain; empty places, no characters. |
| Pharloom | Hand-painted 2D environment, inked edges, layered silhouette depth, saturated regional palette, subtle texture; empty places, no characters. |
| Koholint, Red Dead | not recorded when their banners were made |
