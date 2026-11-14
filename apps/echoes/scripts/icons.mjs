// Regenerates the PWA icons in public/icons from the tri-rod motif. Run: pnpm icons
import { writeIcons } from "@game-guides/core/icons";

const motif = `
<path d="M150 392 316 226" stroke="#ffe9a8" stroke-width="30" stroke-linecap="round"/>
<path d="M352 84 438 232H266Z" fill="#ffe9a8"/>
<path d="M352 140 394 214H310Z" fill="#4a3591"/>
<path d="M150 150 182 206H118Z" fill="#cdbdf5"/>
<path d="M404 372 430 416H378Z" fill="#cdbdf5"/>
<path d="M214 118 232 150H196Z" fill="#a08be0"/>`;

/** @param glyph fraction of the canvas the motif fills; @param radius corner radius as a fraction */
const svg = (glyph, radius) => {
  const size = 512;
  const scale = glyph;
  const offset = (size - size * glyph) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7556c8"/><stop offset="1" stop-color="#352770"/></linearGradient></defs>
<rect width="${size}" height="${size}" rx="${size * radius}" fill="url(#g)"/>
<g transform="translate(${offset} ${offset}) scale(${scale})">${motif}</g>
</svg>`;
};

await writeIcons(svg, { icon: 0.92, maskable: 0.72, apple: 0.9 });
