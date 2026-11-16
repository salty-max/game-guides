import type { Brand, FontFace } from "./types";

const face = (font: FontFace) =>
  `@font-face{font-family:"${font.family}";src:url("/fonts/${font.file}") format("woff2");font-weight:${font.weight};font-display:swap}`;

/**
 * A preload for each of a guide's two fonts, which the build writes into the page head. Without them the browser asks for a font only
 * once text set in it is drawn, after the app's script has run, and the page drawn in the fallback moves when the font arrives (the
 * chapter page's layout shift on GitHub's runner). A font is always fetched in CORS mode, so a preload without `crossorigin` would be
 * fetched twice.
 */
export const fontPreloads = ({ fonts }: Pick<Brand, "fonts">) =>
  [fonts.display, fonts.sans]
    .map((font) => `<link rel="preload" href="/fonts/${font.file}" as="font" type="font/woff2" crossorigin>`)
    .join("\n  ");

/** A guide's two @font-face rules and its --display and --sans variables. The build writes them into the page head, and Storybook into each story. */
export const fontCss = ({ fonts }: Pick<Brand, "fonts">) =>
  [
    face(fonts.display),
    face(fonts.sans),
    `:root{--display:"${fonts.display.family}",${fonts.display.fallback};--sans:"${fonts.sans.family}",${fonts.sans.fallback}}`,
  ].join("");
