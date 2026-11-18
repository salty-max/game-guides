import { globSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import { bannerSizes } from "@hundo/core/banners";
import { iconUrls } from "@hundo/core/icon-versions";
import { GUIDES } from "./ids.ts";

const fromHere = (path: string) => fileURLToPath(new URL(path, import.meta.url));
const app = (path: string) => fromHere(`../../../apps/${path}`);

/**
 * Every Base UI part core imports, as Vite's `optimizeDeps.include` writes a dependency of a linked package. Found one by one while the
 * tests run instead, each new one re-bundles and reloads the page under a running test ("Vite unexpectedly reloaded a test"), and the six
 * test projects (guide x theme) start at once: a run with an empty cache fails now and then. Read from core's source, so a new component
 * needs no list to be kept.
 */
const baseUiParts = () => {
  const core = fromHere("../../core/src");
  const parts = globSync("**/*.{ts,tsx}", { cwd: core }).flatMap((file) =>
    [...readFileSync(join(core, file), "utf8").matchAll(/from "(@base-ui\/react\/[^"]+)"/g)].map((match) => `@hundo/core > ${match[1]}`),
  );
  return [...new Set(parts)];
};

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest"],
  framework: "@storybook/react-vite",
  core: { disableTelemetry: true },
  // The guides' fonts, so a story shows a guide's own type. (Koholint and Red Dead ship the same DM Sans file.)
  staticDirs: [
    ...GUIDES.map((name) => ({ from: app(`${name}/public/fonts`), to: "/fonts" })),
    // The top bar's brand tile, from the guide whose data the stories use: it stays Koholint's painting in every guide's look.
    { from: app("koholint/public/icons"), to: "/icons" },
  ],
  viteFinal: (base) =>
    mergeConfig(base, {
      // The tile's versioned URLs (virtual:icon-urls), for the same guide's icons staticDirs serves, and the banners as the guides import them.
      plugins: [tailwindcss(), iconUrls(app("koholint/public")), bannerSizes()],
      // Core reads a guide's config through virtual:guide/…. Stories use one fixed guide's data; only the look switches. The service
      // worker's hook is a stand-in (pwa-register.ts), for the stories that draw the whole frame.
      resolve: {
        alias: [
          { find: /^virtual:guide\//, replacement: app("koholint/src/guide/") },
          { find: "virtual:pwa-register/react", replacement: fromHere("./pwa-register.ts") },
        ],
      },
      optimizeDeps: { include: baseUiParts() },
    }),
};

export default config;
