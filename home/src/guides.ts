// The guides as the landing page shows them, read at build from each guide's own files: every folder in apps/ with a src/guide/brand.ts
// is one, so a new guide shows up with no line written here. Runs in Node (the Vite plugin and the tests), never in the page.
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { darkPalette, lightPalette } from "@hundo/core/palette";
import type { Brand, GuideConfig } from "@hundo/core/types";
import { runnerImport, type Plugin } from "vite";

export type Palette = Record<string, string>;

export type Guide = {
  /** The guide's folder in apps/, which names its assets and its CSS class. */
  folder: string;
  id: string;
  mark: string;
  game: string;
  publisher: string;
  home: string;
  corners: Brand["corners"];
  display: Brand["fonts"]["display"];
  light: Palette;
  dark: Palette;
  chapters: number;
  rows: number;
  /** The game's own lists with the largest goals, largest first: "46 Grubs". At most three. */
  goals: string[];
};

/** The repository's apps/ folder. */
export const APPS = join(import.meta.dirname, "..", "..", "apps");

/** The folders in apps/ that hold a guide. */
export const guideFolders = (apps = APPS) => readdirSync(apps).filter((name) => existsSync(join(apps, name, "src", "guide", "brand.ts"))).sort();

/**
 * A guide's config.ts imports every chapter banner with `?banner` (core's banners.ts makes it `{ src, srcSet }`). The landing page shows only
 * chapter 1's, which it reads from the file itself, so here each one is nothing: no image is read or emitted for a chapter a reader hasn't reached.
 */
const noBanners: Plugin = {
  name: "home:no-banners",
  enforce: "pre",
  load(id) {
    if (id.endsWith("?banner")) return "export default undefined";
  },
};

/** The largest goals among the lists the game itself keeps (not the guide's own lists, the route's directions or what lies outside the game). */
export const largestGoals = (config: Pick<GuideConfig, "categories" | "completion">, count = 3) => {
  const skip = new Set([...(config.completion.directions ?? []), ...(config.completion.outside ?? [])]);
  return config.completion.board
    .filter((item) => item.list === "game" && !skip.has(item.tag) && config.categories[item.tag])
    .map((item, index) => ({ ...item, index }))
    .sort((a, b) => b.goal - a.goal || a.index - b.index)
    .slice(0, count)
    .map((item) => `${item.goal} ${config.categories[item.tag][0]}`);
};

/** One guide, from its folder. */
export const readGuide = async (folder: string, apps = APPS): Promise<Guide> => {
  const root = join(apps, folder);
  const { module } = await runnerImport<{ default: GuideConfig }>(join(root, "src", "guide", "config.ts"), {
    configFile: false,
    logLevel: "silent",
    plugins: [noBanners],
  });
  const config = module.default;
  const { brand } = config;
  return {
    folder,
    id: brand.id,
    mark: brand.mark,
    game: brand.game,
    publisher: brand.publisher,
    home: brand.home,
    corners: brand.corners,
    display: brand.fonts.display,
    light: lightPalette(root),
    dark: darkPalette(root),
    chapters: config.chapters.length,
    rows: config.chapters.reduce((sum, chapter) => sum + chapter.groups.reduce((n, group) => n + group.rows.length, 0), 0),
    goals: largestGoals(config),
  };
};

/** Every guide, A to Z by game, the name a reader looks for. */
export const readGuides = async (apps = APPS) => {
  const guides = await Promise.all(guideFolders(apps).map((folder) => readGuide(folder, apps)));
  return guides.sort((a, b) => a.game.localeCompare(b.game, "en"));
};
