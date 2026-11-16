// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import page from "../index.html?raw";
import { manifestScreenshots, manifestShortcuts, manifestIcons, tileSizes, tileSrc } from "./icons.ts";

// The icons each guide ships, as `pnpm icons` writes them (icons.mjs) and the page and manifest name them.
const root = process.env.GUIDE_ROOT!;
const publicFile = (path: string) => `${root}/public/${path.replace(/^\//, "")}`;

/** A PNG's size, and whether it can hold transparency: an alpha channel (colour types 4 and 6) or a tRNS chunk. */
const png = (bytes: Buffer) => {
  expect(bytes.subarray(1, 4).toString("latin1"), "a PNG").toBe("PNG");
  let alpha = bytes[25] === 4 || bytes[25] === 6;
  for (let at = 8; at < bytes.length; at += 12 + bytes.readUInt32BE(at)) {
    if (bytes.toString("latin1", at + 4, at + 8) === "tRNS") alpha = true;
  }
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), alpha };
};

/** The frames of an ICO file, each read as the PNG it holds. */
const ico = (bytes: Buffer) => {
  expect(bytes.readUInt16LE(2), "an icon file").toBe(1);
  return Array.from({ length: bytes.readUInt16LE(4) }, (_, i) => {
    const entry = 6 + 16 * i;
    const frame = png(bytes.subarray(bytes.readUInt32LE(entry + 12), bytes.readUInt32LE(entry + 12) + bytes.readUInt32LE(entry + 8)));
    expect([frame.width, frame.height, frame.alpha], "the frame is the entry's size, in 32-bit colour").toEqual([bytes[entry] || 256, bytes[entry + 1] || 256, true]);
    expect(bytes.readUInt16LE(entry + 6), "bits per pixel").toBe(32);
    expect(bytes[25 + bytes.readUInt32LE(entry + 12)], "an RGBA frame").toBe(6);
    return frame;
  });
};

const links = [...page.matchAll(/<link rel="(icon|apple-touch-icon)"([^>]*)>/g)].map(([, rel, attributes]) => ({
  rel,
  href: /href="([^"]+)"/.exec(attributes)![1],
  sizes: /sizes="([^"]+)"/.exec(attributes)?.[1],
}));

describe("icons", () => {
  it("links the root favicon.ico, the tab drawing and the Apple icon, in the order that lets browsers take the SVG", () => {
    // (with sizes="32x32" on the ico Chrome takes the SVG over it, and the ico at the root answers clients that read no page:
    // without the file there, /favicon.ico would come back as the app's page)
    expect(links.map(({ rel, href }) => `${rel} ${href}`)).toEqual(["icon /favicon.ico", "icon /icons/favicon.svg", "apple-touch-icon /icons/apple-touch-icon.png"]);
    for (const { href } of links) expect(existsSync(publicFile(href)), href).toBe(true);
  });

  it("holds 16 and 32px frames in favicon.ico", () => {
    const frames = ico(readFileSync(publicFile("favicon.ico")));
    expect(frames.map(({ width, height }) => `${width}x${height}`)).toEqual(["16x16", "32x32"]);
    expect(links.find(({ href }) => href === "/favicon.ico")?.sizes).toBe("32x32");
  });

  it("serves the guide's own tab drawing, a square SVG with nothing that runs", () => {
    const served = readFileSync(publicFile("icons/favicon.svg"), "utf8");
    // (an edit to the drawing needs `pnpm icons` to reach the ico too)
    expect(served, "public/icons/favicon.svg is scripts/favicon.svg, as pnpm icons copies it").toBe(readFileSync(`${root}/scripts/favicon.svg`, "utf8"));
    const [, width, height] = /viewBox="0 0 (\d+) (\d+)"/.exec(served) ?? [];
    expect(width).toBeDefined();
    expect(width).toBe(height);
    expect(served).not.toMatch(/<script|\son\w+=|href=/i);
  });

  it("ships an opaque square Apple icon at 180px, which iOS rounds itself", () => {
    expect(png(readFileSync(publicFile("icons/apple-touch-icon.png")))).toEqual({ width: 180, height: 180, alpha: false });
  });

  it("ships every manifest icon at the size it declares, the maskable one opaque to its edges", () => {
    for (const { src, sizes, purpose } of manifestIcons) {
      const icon = png(readFileSync(publicFile(src)));
      expect(`${icon.width}x${icon.height}`, src).toBe(sizes);
      if (purpose === "maskable") expect(icon.alpha, src).toBe(false);
    }
    expect(manifestIcons.filter(({ purpose }) => purpose === "maskable"), "one maskable icon").toHaveLength(1);
  });

  it("ships the top bar's brand tile as opaque squares at each size the page asks for", () => {
    for (const size of tileSizes) expect(png(readFileSync(publicFile(tileSrc(size)))), tileSrc(size)).toEqual({ width: size, height: size, alpha: false });
  });

  it("ships every shortcut's icons at the sizes they declare, the full-bleed one opaque, for pages the guide has", () => {
    expect(manifestShortcuts.map(({ name, url }) => `${name} ${url}`)).toEqual(["Guide /guide", "Checklist /checklist", "Progress /dashboard"]);
    for (const { icons } of manifestShortcuts) {
      for (const { src, sizes, purpose } of icons) {
        const icon = png(readFileSync(publicFile(src)));
        expect(`${icon.width}x${icon.height}`, src).toBe(sizes);
        if (purpose === "maskable") expect(icon.alpha, src).toBe(false);
      }
    }
  });

  it("ships the install dialog's screenshots as small JPEGs at the sizes they declare, wide and narrow", () => {
    const shots = manifestScreenshots("Guide");
    expect(shots.map(({ form_factor }) => form_factor)).toEqual(["wide", "narrow"]);
    for (const { src, sizes } of shots) {
      const bytes = readFileSync(publicFile(src));
      expect(bytes.subarray(0, 3).toString("hex"), `${src} is a JPEG`).toBe("ffd8ff");
      // (the size from the first start-of-frame marker)
      let at = 2;
      while (bytes[at + 1] < 0xc0 || bytes[at + 1] > 0xc2) at += 2 + bytes.readUInt16BE(at + 2);
      expect(`${bytes.readUInt16BE(at + 7)}x${bytes.readUInt16BE(at + 5)}`, src).toBe(sizes);
      const [width, height] = sizes.split("x").map(Number);
      // Chromium's install dialog takes 320 to 3840px with the long side at most 2.3 times the short one (web.dev, Richer install UI).
      expect(Math.max(width, height) / Math.min(width, height), src).toBeLessThanOrEqual(2.3);
      expect(bytes.length, `${src} stays small`).toBeLessThan(160_000);
    }
  });

  it("keeps its painting beside the script that exports it", () => {
    expect(existsSync(`${root}/scripts/icon-master.webp`)).toBe(true);
  });
});
