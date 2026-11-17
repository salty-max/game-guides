import { Stat } from "@hundo/core/components/Stats";
import { WhatsLeft } from "@hundo/core/components/WhatsLeft";
import { allRows, completion } from "@hundo/core/guide";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect } from "storybook/test";

// The dashboard's two lists of categories: What's left, biggest first with a bar of each one's size, and the board of counts, each card
// opening its category's checklist. A third of the guide is ticked, so the bars and counts are partway.
const ticked = Object.fromEntries(allRows.filter((_, index) => index % 3 === 0).map((row) => [row.id, true as const]));

function Board() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
      {completion.board.map(({ tag, goal }) => (
        <Stat key={tag} tag={tag} goal={goal} />
      ))}
    </div>
  );
}

const meta = {
  title: "Core/Dashboard",
  component: WhatsLeft,
  decorators: [
    (Story) => {
      useProgress.setState({ data: { ...defaultState(), checks: ticked } });
      return (
        <MemoryRouter>
          <div style={{ maxWidth: 900 }}>
            <Story />
          </div>
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof WhatsLeft>;

export default meta;
type Story = StoryObj<typeof meta>;

/** What's left, biggest gap first. */
export const WhatsLeftPartway: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: "What’s left" })).toBeVisible();
  },
};

/** The board: one card per category, its icon in the category's tone. */
export const CategoryBoard: Story = {
  render: () => <Board />,
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("link")).toHaveLength(completion.board.length);
  },
};

/** In a column under 28rem (WhatsLeft's own width, not the screen's), each category's bar goes under its name and figures. */
export const WhatsLeftNarrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector("li")!;
    const [name, bar] = [...row.children].map((part) => part.getBoundingClientRect());
    await expect(getComputedStyle(row).gridTemplateColumns.split(" ")).toHaveLength(2);
    await expect(bar.top).toBeGreaterThanOrEqual(name.bottom);
  },
};

/** In a wide column each category's name, bar and figures share a line. */
export const WhatsLeftWide: Story = {
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector("li")!;
    await expect(getComputedStyle(row).gridTemplateColumns.split(" ")).toHaveLength(3);
  },
};
