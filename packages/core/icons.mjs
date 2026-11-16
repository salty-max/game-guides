// Writes a guide's icons to public/, run from the app folder (`pnpm icons`).
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { tileSizes, tileSrc } from "./src/icons.ts";

/** An ICO file holding PNG frames, which every browser reads; sharp writes no ICO itself. */
const ico = (frames) => {
  const header = Buffer.alloc(6 + 16 * frames.length);
  header.writeUInt16LE(1, 2); // type 1: icon
  header.writeUInt16LE(frames.length, 4);
  let offset = header.length;
  frames.forEach(({ size, data }, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size, entry);
    header.writeUInt8(size, entry + 1);
    header.writeUInt16LE(1, entry + 4); // colour planes
    header.writeUInt16LE(32, entry + 6); // bits per pixel
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...frames.map((frame) => frame.data)]);
};

/**
 * @param {{ master: URL, favicon: URL }} art the guide's opaque, full-bleed square painting (its subject inside the
 *   centred disk), and its tab drawing: a square SVG drawn to read at 16 and 32px, which the painting doesn't
 */
export const writeIcons = async ({ master, favicon }) => {
  const out = "public/icons";
  const painting = fileURLToPath(master);
  const drawing = fileURLToPath(favicon);
  await mkdir(out, { recursive: true });
  // 256 dithered colours: a quarter to a half of the bytes, and no banding to see in the paintings' gradients.
  const png = { palette: true, quality: 95 };

  // Rounded at the size it ships, with the corner radius of the old icons, 22% of the side.
  const rounded = (size) => {
    const mask = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#fff"/></svg>`;
    return sharp(painting).resize(size, size).ensureAlpha().composite([{ input: Buffer.from(mask), blend: "dest-in" }]);
  };
  // (truecolour, as the ico's entries say: a strict reader takes a PNG frame for 32-bit RGBA)
  const tab = (size) => sharp(drawing, { density: (72 * size) / 32 }).resize(size, size).png().toBuffer();

  await Promise.all([
    rounded(512).png(png).toFile(`${out}/icon-512.png`),
    rounded(192).png(png).toFile(`${out}/icon-192.png`),
    // iOS rounds the corners itself, so the square stays opaque.
    sharp(painting).resize(180, 180).removeAlpha().png(png).toFile(`${out}/apple-touch-icon.png`),
    // Launchers crop to a circle as small as 80% of the side: the painting shrinks to 440px, its disk to 70% of the
    // canvas, and its own edge pixels fill the margin.
    sharp(painting).resize(440, 440).extend({ top: 36, bottom: 36, left: 36, right: 36, extendWith: "copy" }).png(png).toFile(`${out}/maskable-512.png`),
    // The top bar's brand tile: square, as the tile's own corners clip it.
    ...tileSizes.map((size) => sharp(painting).resize(size, size).removeAlpha().png(png).toFile(`public${tileSrc(size)}`)),
    copyFile(drawing, `${out}/favicon.svg`),
    // At the root, where browsers and other clients look when a page names no icon.
    Promise.all([16, 32].map(async (size) => ({ size, data: await tab(size) }))).then((frames) => writeFile("public/favicon.ico", ico(frames))),
  ]);
  console.log("icons written to public/icons and public/favicon.ico");
};
