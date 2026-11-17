import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import { GUIDES, THEMES } from "./.storybook/ids.ts";

// One Vitest project per guide and theme: every story is rendered, and checked with axe, under each palette in light and dark.
// A real browser, because contrast and layout only exist once the CSS is processed: the system Chrome, as guide-check's shoot.mjs does.
export default defineConfig({
  test: {
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
