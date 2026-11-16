// A guide's palette as its theme.css sets it, read in Node: by the build (vite.ts) and by the icons' script (icons.mjs).
import { readFileSync } from "node:fs";

/**
 * One palette from the guide's theme.css (the light one opens `:root{`, the dark one `:root[data-theme="dark"]{`, with or without a space
 * before the brace). Without a `--surface` the page would ship a placeholder as its theme colour, so a palette that has none stops the build.
 */
const readPalette = (root: string, opening: RegExp) => {
  const css = readFileSync(`${root}/src/guide/theme.css`, "utf8");
  const block = css.split(opening)[1]?.split("}")[0] ?? "";
  const palette = Object.fromEntries([...block.matchAll(/(--[a-z-]+):([^;]+)/g)].map(([, key, value]) => [key, value.trim()]));
  if (!palette["--surface"]) throw new Error(`${root}/src/guide/theme.css: no --surface after ${opening}, which the theme-color tag is built from`);
  return palette;
};

/** The light palette, for the colours the browser and the installed app show before CSS loads. */
export const lightPalette = (root: string) => readPalette(root, /:root\s*\{/);
/** The dark one, whose surface colour theme-init.js puts in the theme-color tag when the page opens in dark. */
export const darkPalette = (root: string) => readPalette(root, /:root\[data-theme="dark"\]\s*\{/);
