/** Set by vitest.config.ts in the stories' test project; undefined when the stories run in Storybook itself. */
declare const __EVERY_LOOK__: boolean | undefined;
/** The guide and theme .storybook/every-look.ts is rendering a story under, while it renders one. */
// eslint-disable-next-line no-var -- only a `var` declares a property of globalThis
declare var __STORY_LOOK__: { guide: string; theme: string } | undefined;

/** Storybook's Vitest plugin's test function, which ships without types: the part every-look.ts uses. */
declare module "@storybook/addon-vitest/internal/test-utils" {
  import type { TestContext } from "vitest";
  type StoryArgs = { story: Record<string, unknown> & { globals?: Record<string, unknown> } } & Record<string, unknown>;
  export const testStory: (args: StoryArgs) => (context: TestContext) => Promise<void>;
  export const convertToFilePath: (url: string) => string;
}
