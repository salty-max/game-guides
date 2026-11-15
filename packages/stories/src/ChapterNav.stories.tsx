import { ChapterNav } from "@hundo/core/components/ChapterNav";
import { CHAPTER_COUNT } from "@hundo/core/guide";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect } from "storybook/test";

// The end of a chapter: back to the one before, on to the next or to reveal it, or to the progress page after the last. Under a
// checklist route it follows the groups; at the end of an article a rule sets it off.
const meta = {
  title: "Core/ChapterNav",
  component: ChapterNav,
  args: { chapter: 2, in: "route" },
  decorators: [
    (Story, { parameters }) => {
      useProgress.setState({ data: { ...defaultState(), ...(parameters.save ?? {}) } });
      return (
        <MemoryRouter>
          <div style={{ maxWidth: 720 }}>
            <Story />
          </div>
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof ChapterNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The next chapter is hidden: revealing it is the way on. */
export const NextHidden: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Reveal next chapter" })).toBeVisible();
  },
};

/** Every chapter shown: a link to the next. */
export const NextShown: Story = { parameters: { save: { spoilers: false } } };

/** At the end of an article, under a rule. */
export const InArticle: Story = { args: { in: "article" }, parameters: { save: { spoilers: false } } };

/** The last chapter: on to the progress page. */
export const LastChapter: Story = { args: { chapter: CHAPTER_COUNT }, parameters: { save: { spoilers: false } } };
