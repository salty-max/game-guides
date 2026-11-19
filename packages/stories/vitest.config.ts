import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";
import { GUIDES, LOOK_LIMIT, THEMES } from "./.storybook/ids.ts";

const everyLook = fileURLToPath(new URL("./.storybook/every-look.ts", import.meta.url));

/**
 * Sends a story file's import of Storybook's testStory to .storybook/every-look.ts, which calls it once per guide and theme. Only a story
 * file's: every-look.ts imports the real one.
 */
const runEveryLook: Plugin = {
  name: "hundo:every-look",
  enforce: "pre",
  resolveId: (id, importer) =>
    id === "@storybook/addon-vitest/internal/test-utils" && importer && /\.stories\.tsx(\?|$)/.test(importer) ? everyLook : undefined,
};

// Every story is rendered, and checked with axe, under each guide's palette in light and dark: one test per story, which renders it ten times
// (every-look.ts). A real browser, because contrast and layout only exist once the CSS is processed: the system Chrome, as guide-check's
// shoot.mjs does. One project and one Chrome for all of it: one project per guide and theme meant ten Vite servers and a Chrome for each, up
// to 74 Chrome processes and 7 GB at once on this Mac (docs/testing.md#stories).
export default defineConfig({
  test: {
    // How many story files run at once, each in its own page of the one Chrome. Inherited by both projects: projects that share a group must
    // agree on it. Don't set VITEST_MAX_WORKERS around this: it overrides the number for every package (docs/testing.md#stories).
    maxWorkers: 2,
    projects: [
      // Not a story, and no browser: it holds GUIDES to the guides there are (src/guides.test.ts), so a new guide can't be left out of the axe runs.
      { test: { name: "guides", environment: "node", include: ["src/guides.test.ts"] } },
      {
        // Tells Foundation.stories.tsx it runs under every-look.ts, which it then checks.
        define: { __EVERY_LOOK__: "true" },
        plugins: [storybookTest({ configDir: ".storybook" }), runEveryLook],
        test: {
          name: "stories",
          // These limits only catch a hang. every-look.ts stops a test at its first look past LOOK_LIMIT and names it, so the test's own limit
          // sits above all its looks'.
          testTimeout: (GUIDES.length * THEMES.length + 1) * LOOK_LIMIT,
          hookTimeout: LOOK_LIMIT,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({ launchOptions: { channel: "chrome" } }),
            instances: [{ browser: "chromium" as const }],
          },
        },
      },
    ],
  },
});
