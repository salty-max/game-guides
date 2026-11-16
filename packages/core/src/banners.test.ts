// @vitest-environment node
// The chapter page's first paint: the fonts preloaded from the head, and the banner's smaller copies a phone takes (banners.ts). A build
// is the only place the copies exist, so one banner of this guide is built here for real.
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { build, type Rollup } from "vite";
import { BANNER_WIDTHS, bannerSizes } from "../banners";
import page from "../index.html?raw";
import { fontPreloads } from "./fonts";
import { brand } from "./guide";

const banner = join(process.env.GUIDE_ROOT ?? "", "src/guide/banners/chapter-1.webp");

describe("the fonts", () => {
  it("are preloaded, each once, in the CORS mode a font is fetched in", () => {
    const links = fontPreloads(brand).split("\n").map((line) => line.trim());
    expect(links).toEqual(
      [brand.fonts.display, brand.fonts.sans].map((font) => `<link rel="preload" href="/fonts/${font.file}" as="font" type="font/woff2" crossorigin>`),
    );
  });

  it("are asked for from the head, ahead of their @font-face rules", () => {
    expect(page.indexOf("%GUIDE_FONT_PRELOADS%")).toBeGreaterThan(page.indexOf("<head>"));
    expect(page.indexOf("%GUIDE_FONT_PRELOADS%")).toBeLessThan(page.indexOf("<style>%GUIDE_FONTS%</style>"));
  });
});

describe("a banner", () => {
  it("is the original alone outside a build", async () => {
    const plugin = bannerSizes();
    const load = plugin.load as (id: string) => Promise<string | undefined>;
    expect(await load(`${banner}?banner`)).toBe(`import src from ${JSON.stringify(`${banner}?url`)};\nexport default { src };`);
    expect(await load(banner)).toBeUndefined();
  });

  it("comes with its smaller copies in a build, as real files the srcset names", async () => {
    const { width = 0 } = await sharp(banner).metadata();
    const folder = mkdtempSync(join(tmpdir(), "hundo-banner-"));
    const entry = join(folder, "entry.js");
    writeFileSync(entry, `import banner from ${JSON.stringify(`${banner}?banner`)};\nconsole.log(banner);\n`);
    const output = (await build({
      configFile: false,
      logLevel: "silent",
      root: folder,
      plugins: [bannerSizes()],
      build: { write: false, rollupOptions: { input: entry } },
    }).finally(() => rmSync(folder, { recursive: true, force: true }))) as Rollup.RolldownOutput;

    const files = output.output.filter((file) => file.type === "asset" && file.fileName.endsWith(".webp"));
    const code = output.output.find((file) => file.type === "chunk")?.code ?? "";
    for (const w of BANNER_WIDTHS) {
      const copy = files.find((file) => new RegExp(`chapter-1-${w}-[\\w-]+\\.webp$`).test(file.fileName));
      expect(copy, `${w}px copy`).toBeDefined();
      expect((await sharp(Buffer.from((copy as Rollup.OutputAsset).source)).metadata()).width).toBe(w);
      expect(code).toContain(`/${copy?.fileName} ${w}w`);
    }
    expect(code).toMatch(new RegExp(`${width}w`));
    expect(code).not.toContain("undefined");
  }, 30_000);
});
