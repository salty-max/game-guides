import { ArticleRoute } from "@hundo/core/components/ArticleRoute";
import { chapters } from "@hundo/core/guide";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect } from "storybook/test";

// A chapter as prose: a section per group, each step's opening words its checkbox, the list of sections beside it (folded above it up
// to 1000px wide). The second group is shown as a compact list, whose text lines up under each step's words, not its box.
const chapter = { ...chapters[0], groups: [chapters[0].groups[0], { ...chapters[0].groups[1], compact: true }] };
const linked = chapter.groups[0].rows[1];

const meta = {
  title: "Core/ArticleRoute",
  component: ArticleRoute,
  args: { chapter, footer: null },
  decorators: [
    (Story) => {
      useProgress.setState({ data: defaultState() });
      return (
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof ArticleRoute>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A section in prose and a compact one. */
export const ProseAndList: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("article")).toBeVisible();
  },
};

/** A step reached by a link: it stands out, with the accent's bar at its start. */
export const LinkedStep: Story = { args: { target: `entry-${linked.id}` } };

/** In a wide column the article stops at its cap, 788px. It's px on purpose: a `ch` would follow each guide's font, a rem the reader's root size. */
export const WidestColumn: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 1500 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("article").getBoundingClientRect().width).toBeCloseTo(788, 1);
  },
};
