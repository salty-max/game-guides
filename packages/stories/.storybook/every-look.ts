// Runs each story under every guide's look, light and dark, inside its one test, so all the stories' tests share one Vite server and one
// Chrome. They used to be one Vitest project per guide and theme, ten servers and ten browsers for the same stories (docs/testing.md#stories).
//
// Storybook's Vitest plugin turns every story into a test that calls its testStory. vitest.config.ts sends a story file's import of it here
// (and no one else's), and this calls Storybook's own once per guide and theme, with the pair as the story's own globals, which win over every
// other source when Storybook composes a story. Storybook unmounts the render before (runStory runs its cleanups first), axe checks each
// render (the a11y addon's afterEach throws on a violation), and before each the mouse goes back off the page, as before each test, and the
// page's storage is emptied, so a render doesn't start from what the one before saved. A failing look doesn't stop the others: the test fails
// at the end and names each look that failed. A look that never ends stops the test at once, named.
import { testStory as storybookTestStory } from "@storybook/addon-vitest/internal/test-utils";
import { commands } from "vitest/browser";
import { GUIDES, LOOK_LIMIT, THEMES } from "./ids";

// The rest of what a story file imports from it (convertToFilePath), as it is; testStory below takes the place of Storybook's.
export * from "@storybook/addon-vitest/internal/test-utils";

type Args = Parameters<typeof storybookTestStory>[0];
type Context = Parameters<ReturnType<typeof storybookTestStory>>[0];
type Globals = { globals?: Record<string, unknown> } | undefined;

const LOOKS = GUIDES.length * THEMES.length;

/** The command the Storybook plugin adds to keep a hover from lingering (Chromium on Linux applies one without any mouse move). */
const resetMouse = () => (commands as { resetMousePosition?: () => Promise<void> }).resetMousePosition?.();

/** A look that took longer than LOOK_LIMIT. */
class StillRendering extends Error {}

/** Resolves as the render does, or rejects once LOOK_LIMIT passes. */
const withinLimit = async (render: Promise<void>, look: string) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const limit = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new StillRendering(`${look}: still rendering after ${LOOK_LIMIT / 1000} s`)), LOOK_LIMIT);
  });
  try {
    await Promise.race([render, limit]);
  } finally {
    clearTimeout(timer);
  }
};

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

export const testStory = (args: Args) => async (context: Context) => {
  // A CSF factory story (`meta.story()`) keeps its annotations in `input`: spread like this it would lose them. The stories are CSF 3.
  if ("input" in args.story) throw new Error("every-look.ts runs CSF 3 stories (plain objects): pass a CSF factory story's globals in its input");
  // A story that pins a guide or a theme would be overridden here without a word: every story runs in every look.
  for (const globals of [args.story.globals, (args.meta as Globals)?.globals]) {
    if (globals && ("guide" in globals || "theme" in globals)) throw new Error("A story runs under every guide and theme (every-look.ts): it can't set its own");
  }
  const failures: string[] = [];
  const reports: unknown[] = [];
  let first: unknown;
  try {
    for (const guide of GUIDES) {
      for (const theme of THEMES) {
        const look = `${guide}, ${theme}`;
        // Read by Foundation.stories.tsx, which checks that the story got this look and the page shows it.
        globalThis.__STORY_LOOK__ = { guide, theme };
        localStorage.clear();
        sessionStorage.clear();
        // (testStory sets it to the story it composes: unset, a look that fails before that reports nothing rather than the last look's)
        (context as { story?: unknown }).story = undefined;
        try {
          await resetMouse();
          await withinLimit(storybookTestStory({ ...args, story: { ...args.story, globals: { ...args.story.globals, guide, theme } } })(context), look);
        } catch (error) {
          // A story skipped by its tags (context.skip()) is skipped once, not failed ten times.
          if ((error as { code?: string } | null)?.code === "VITEST_PENDING") throw error;
          // A hung render may still be running: the looks after it would start beside it, so the test stops here.
          if (error instanceof StillRendering) throw new Error([...failures, error.message].join("\n\n"), { cause: error });
          first ??= error;
          failures.push(`${look}: ${message(error)}`);
        } finally {
          // This look's reports (axe's among them), read from the story it composed: the plugin copies them to the task only when a render
          // ends without an error.
          reports.push(...((context as { story?: { reporting?: { reports?: unknown[] } } }).story?.reporting?.reports ?? []));
        }
      }
    }
  } finally {
    globalThis.__STORY_LOOK__ = undefined;
    // Every look's reports so far, for Storybook's test panel: the plugin keeps only the last render's.
    (context.task.meta as { reports?: unknown[] }).reports = reports;
  }
  if (failures.length) throw new Error(`${failures.length} of ${LOOKS} looks failed:\n\n${failures.join("\n\n")}`, { cause: first });
};
