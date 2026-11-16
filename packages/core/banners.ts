// A chapter banner imported with `?banner` is `{ src, srcSet }`: the original, about 1,700 to 1,800px wide for a desktop's hero, and in
// a build smaller copies beside it for a phone's card, 800px for a screen of up to 2x and 1,320px for 3x (up to 440px wide). The
// banner is the chapter page's largest paint, so its bytes are what a phone waits for (ChapterHero's `sizes` lets the browser pick).
// The service worker precaches every copy, so whichever one a screen picks is there offline. In dev and in tests it is the original alone.
import { parse } from "node:path";
import sharp from "sharp";
import type { Plugin } from "vite";

/** The smaller copies' widths. */
export const BANNER_WIDTHS = [800, 1320];
const QUERY = "?banner";

export const bannerSizes = (): Plugin => {
  let build = false;
  return {
    name: "banner-sizes",
    // Ahead of Vite's own asset handling, which would otherwise load the file as a plain URL.
    enforce: "pre",
    configResolved(config) {
      build = config.command === "build";
    },
    async load(id) {
      if (!id.endsWith(QUERY)) return;
      const file = id.slice(0, -QUERY.length);
      const original = `import src from ${JSON.stringify(`${file}?url`)};`;
      const { width = 0 } = await sharp(file).metadata();
      const widths = build ? BANNER_WIDTHS.filter((w) => w < width) : [];
      if (!widths.length) return `${original}\nexport default { src };`;
      const copies = await Promise.all(
        widths.map(async (w) => {
          const source = await sharp(file).resize({ width: w }).webp({ quality: 80 }).toBuffer();
          const ref = this.emitFile({ type: "asset", name: `${parse(file).name}-${w}.webp`, source });
          return `import.meta.ROLLUP_FILE_URL_${ref} + " ${w}w, "`;
        }),
      );
      return `${original}\nexport default { src, srcSet: ${copies.join(" + ")} + src + " ${width}w" };`;
    },
  };
};
