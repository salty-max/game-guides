// Writes a guide's PWA icons to public/icons, run from the app folder.
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

/**
 * @param {(glyph: number, radius: number) => string} art a 512px square SVG: glyph is the share of the canvas the
 *   motif fills, radius the corner radius as a share of the side
 * @param {{ icon: number, maskable: number, apple: number }} glyph the glyph share for each kind of icon
 */
export const writeIcons = async (art, glyph) => {
  const out = "public/icons";
  await mkdir(out, { recursive: true });
  const png = (name, markup, px) => sharp(Buffer.from(markup)).resize(px, px).png().toFile(`${out}/${name}`);
  await Promise.all([
    png("icon-192.png", art(glyph.icon, 0.22), 192),
    png("icon-512.png", art(glyph.icon, 0.22), 512),
    // Maskable: full-bleed background, motif inside the 80% safe zone.
    png("maskable-512.png", art(glyph.maskable, 0), 512),
    // iOS rounds the corners itself, so the background must be opaque and square.
    png("apple-touch-icon.png", art(glyph.apple, 0), 180),
    writeFile(`${out}/favicon.svg`, art(glyph.icon, 0.22)),
  ]);
  console.log("icons written to", out);
};
