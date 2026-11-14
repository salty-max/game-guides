// Regenerates the PWA icons in public/icons from the compass motif. Run: pnpm icons
import { writeIcons } from "@game-guides/core/icons";

const BG = "#231812";
const FG = "#d7ad72";
const compass = '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/>';

/** @param glyph fraction of the canvas the 24-unit compass fills; @param radius corner radius as a fraction */
const svg = (glyph, radius) => {
  const size = 512;
  const scale = (size * glyph) / 24;
  const offset = (size - size * glyph) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<rect width="${size}" height="${size}" rx="${size * radius}" fill="${BG}"/>
<g transform="translate(${offset} ${offset}) scale(${scale})" fill="none" stroke="${FG}" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${compass}</g>
</svg>`;
};

await writeIcons(svg, { icon: 0.62, maskable: 0.5, apple: 0.6 });
