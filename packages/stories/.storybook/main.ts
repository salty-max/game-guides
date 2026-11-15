import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const app = (path: string) => fileURLToPath(new URL(`../../../apps/${path}`, import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest"],
  framework: "@storybook/react-vite",
  core: { disableTelemetry: true },
  // The guides' fonts, so a story shows a guide's own type. (Koholint and Red Dead ship the same DM Sans file.)
  staticDirs: ["koholint", "rdr", "echoes"].map((name) => ({ from: app(`${name}/public/fonts`), to: "/fonts" })),
  viteFinal: (base) =>
    mergeConfig(base, {
      plugins: [tailwindcss()],
      // Core reads a guide's config through virtual:guide/…. Stories use one fixed guide's data; only the look switches.
      resolve: { alias: [{ find: /^virtual:guide\//, replacement: app("koholint/src/guide/") }] },
    }),
};

export default config;
