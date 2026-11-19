import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import { GUIDES, THEMES } from "./.storybook/ids.ts";

// One Vitest project per guide and theme: every story is rendered, and checked with axe, under each palette in light and dark.
// A real browser, because contrast and layout only exist once the CSS is processed: the system Chrome, as guide-check's shoot.mjs does.
export default defineConfig({
  test: {
    // At most this many browsers open at once, whatever the cores say: Vitest's browser pool counts each project's Chrome as a worker (and the
    // pages they share), keeps no more than this many open and moves one on to the next project when its turn is done, so the guide x theme
    // projects take turns in two Chromes instead of launching one each (up to 74 Chrome processes and 7 GB at once on this Mac, which with other
    // sessions' jobs filled the swap). Inherited by every project below, the Node one too: projects that share a group must agree on it.
    // Nothing is left unrun: each project still runs all its stories. Don't set VITEST_MAX_WORKERS around this: it overrides the number for
    // every package (docs/testing.md#stories).
    maxWorkers: 2,
    projects: [
      // Not a story, and no browser: it holds GUIDES to the guides there are (src/guides.test.ts), so a new guide can't be left out of the axe runs.
      { test: { name: "guides", environment: "node", include: ["src/guides.test.ts"] } },
      ...GUIDES.flatMap((guide) =>
        THEMES.map((theme) => ({
          // Which guide and theme this project means to test, read by Foundation.stories.tsx as a check on the toolbar globals.
          define: { __PROJECT_GUIDE__: JSON.stringify(guide), __PROJECT_THEME__: JSON.stringify(theme) },
          plugins: [storybookTest({ configDir: ".storybook", initialGlobals: { guide, theme } })],
          test: {
            name: `${guide}-${theme}`,
            // These limits only catch a hang. A story is ~0.1 s alone, and many times that when several checks share the machine.
            testTimeout: 60_000,
            hookTimeout: 60_000,
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({ launchOptions: { channel: "chrome" } }),
              instances: [{ browser: "chromium" as const }],
            },
          },
        })),
      ),
    ],
  },
});
