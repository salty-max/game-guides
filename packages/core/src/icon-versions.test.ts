// @vitest-environment node
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import page from "../index.html?raw";
import { iconUrl, iconUrls, versionIconLinks } from "../icon-versions.ts";
import { guideManifest } from "../manifest.ts";
import { guideConfig, pwaOptions } from "../vite.ts";
import { lightPalette } from "../palette.ts";
import { brand } from "./guide.ts";
import { tileSizes, tileSrc, tileSrcSet } from "./icons.ts";

// Every icon URL this guide's page, manifest and top bar name carries its file's content version, so new art is a new URL
// (icon-versions.ts). The version is the start of the file's MD5, the same hash Workbox gives it as its precache revision.
const root = process.env.GUIDE_ROOT!;
const pub = `${root}/public`;
const url = iconUrl(pub);
const md5 = (file: string) => createHash("md5").update(readFileSync(file)).digest("hex");

/** Holds a versioned URL to the file it names: `?v=` and the first 8 digits of that file's MD5, nothing else. */
const expectVersioned = (versioned: string) => {
  const [, path, version] = /^\/?((?:favicon\.ico|icons\/[^?]+))\?v=([0-9a-f]{8})$/.exec(versioned) ?? [];
  expect(path, `${versioned} is an icon path with ?v=<8 hex>`).toBeDefined();
  expect(md5(`${pub}/${path}`).slice(0, 8), versioned).toBe(version);
};

describe("icon versions", () => {
  it("gives a changed file a new URL, and the same bytes the same one", () => {
    const dir = mkdtempSync(`${tmpdir()}/icon-versions-`);
    try {
      mkdirSync(`${dir}/icons`);
      writeFileSync(`${dir}/icons/a.png`, "old art");
      const versioned = iconUrl(dir);
      const before = versioned("/icons/a.png");
      expect(before).toMatch(/^\/icons\/a\.png\?v=[0-9a-f]{8}$/);
      writeFileSync(`${dir}/icons/a.png`, "new art");
      const after = versioned("/icons/a.png");
      expect(after).not.toBe(before);
      // (the manifest's paths have no leading slash, and keep their form)
      expect(versioned("icons/a.png")).toBe(after.slice(1));
      writeFileSync(`${dir}/icons/a.png`, "old art");
      expect(versioned("/icons/a.png")).toBe(before);
    } finally {
      rmSync(dir, { recursive: true });
    }
  });

  it("refuses a path that is no icon, and leaves a file that isn't there yet bare (a new guide before pnpm icons)", () => {
    expect(() => url("/assets/app.js")).toThrow(/only \/favicon\.ico and files under \/icons/);
    expect(url("/icons/nope.png")).toBe("/icons/nope.png");
  });

  it("names only versioned icons in the page: the root favicon, the tab drawing and the Apple icon", () => {
    const served = versionIconLinks(page, url);
    const named = [...served.matchAll(/\b(?:href|src)="([^"]*(?:favicon\.ico|\/icons\/)[^"]*)"/g)].map(([, href]) => href);
    expect(named.map((href) => href.split("?")[0])).toEqual(["/favicon.ico", "/icons/favicon.svg", "/icons/apple-touch-icon.png"]);
    for (const href of named) expectVersioned(href);
    // (every mention of an icon in the template is one the rewrite reached: a link written some other way would be left bare)
    expect(served.match(/favicon\.ico|\/icons\//g)).toHaveLength(named.length);
    expect(served.replace(/\?v=[0-9a-f]{8}/g, "")).toBe(page);
  });

  it("names only versioned pictures in the manifest: its icons, the shortcuts' icons and the screenshots", () => {
    const manifest = guideManifest(brand, lightPalette(root), url);
    expect(pwaOptions(root, brand, lightPalette(root)).manifest, "the manifest the build hands the PWA plugin").toEqual(manifest);
    const pictures = [...manifest.icons!, ...manifest.shortcuts!.flatMap(({ icons }) => icons ?? []), ...manifest.screenshots!];
    expect(pictures).toHaveLength(3 + 3 * 3 + 2);
    for (const { src } of pictures) expectVersioned(src);
  });

  it("is wired into the build: the plugin is in the guide's config, and the worker matches its precache with `v` left out", () => {
    const names = (guideConfig(root, brand).plugins ?? []).flat().map((plugin) => (plugin && "name" in plugin ? plugin.name : undefined));
    expect(names).toContain("icon-urls");
    // (without it a versioned icon misses the precache, which lists the bare file, and the tile breaks offline)
    expect(pwaOptions(root, brand, lightPalette(root)).workbox?.ignoreURLParametersMatching?.map(String)).toEqual(["/^utm_/", "/^fbclid$/", "/^v$/"]);
  });

  it("serves the top bar's tile at versioned URLs to the page's code, and leaves a file the guide lacks bare", async () => {
    const plugin = iconUrls(pub);
    const id = (plugin.resolveId as (id: string) => string)("virtual:icon-urls");
    const source = (plugin.load as (id: string) => string)(id);
    const { default: lookup } = (await import(`data:text/javascript,${encodeURIComponent(source)}`)) as { default: (path: string) => string };
    for (const size of tileSizes) expectVersioned(lookup(tileSrc(size)));
    expect(tileSrcSet(lookup).split(", ").map((entry) => entry.split(" ")[1])).toEqual(["1x", "2x", "3x"]);
    expectVersioned(lookup("/favicon.ico"));
    expect(lookup("/icons/nope.png")).toBe("/icons/nope.png");
  });
});
