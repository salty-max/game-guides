import type { Brand, FontFace } from "./types";

const face = (font: FontFace) =>
  `@font-face{font-family:"${font.family}";src:url("/fonts/${font.file}") format("woff2");font-weight:${font.weight};font-display:swap}`;

/** A guide's two @font-face rules and its --display and --sans variables. The build writes them into the page head, and Storybook into each story. */
export const fontCss = ({ fonts }: Pick<Brand, "fonts">) =>
  [
    face(fonts.display),
    face(fonts.sans),
    `:root{--display:"${fonts.display.family}",${fonts.display.fallback};--sans:"${fonts.sans.family}",${fonts.sans.fallback}}`,
  ].join("");
