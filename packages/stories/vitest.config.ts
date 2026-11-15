import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import { GUIDES, THEMES } from "./.storybook/ids.ts";

// One Vitest project per guide and theme: every story is rendered, and checked with axe, under each palette in light and dark.
// A real browser, because contrast and layout only exist once the CSS is processed: the system Chrome, as guide-check's shoot.mjs does.
export default defineConfig({
  test: {
    projects: GUIDES.flatMap((guide) =>
      THEMES.map((theme) => ({
        // Which guide and theme this project means to test, read by Foundation.stories.tsx as a check on the toolbar globals.
        define: { __PROJECT_GUIDE__: JSON.stringify(guide), __PROJECT_THEME__: JSON.stringify(theme) },
        plugins: [storybookTest({ configDir: ".storybook", initialGlobals: { guide, theme } })],
        test: {
          name: `${guide}-${theme}`,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({ launchOptions: { channel: "chrome" } }),
            instances: [{ browser: "chromium" as const }],
          },
        },
      })),
    ),
  },
});
