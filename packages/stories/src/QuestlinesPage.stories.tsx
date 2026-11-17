import { chapterRows, chapters } from "@hundo/core/guide";
import { QuestlinesPage } from "@hundo/core/pages/QuestlinesPage";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, within } from "storybook/test";

// The Questlines page with Koholint's data: one line, the trading quest, which runs from chapter 1 to chapter 6. At chapter 3 with its
// first trade ticked, it's under way: the revealed trades, the next one tinted, and the line every card ends with while chapters hide.
const trades = chapters.flatMap(chapterRows).filter((row) => row.tags.includes("trade"));

const meta = {
  title: "Core/QuestlinesPage",
  component: QuestlinesPage,
  decorators: [
    (Story, { parameters }) => {
      useProgress.setState({ data: { ...defaultState(), ...(parameters.progress as object) } });
      return (
        <MemoryRouter initialEntries={["/questlines"]}>
          <div style={{ maxWidth: 900 }}>
            <Routes>
              <Route path="/questlines/:line?" element={<Story />} />
            </Routes>
          </div>
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof QuestlinesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Under way at chapter 3: the next trade marked, later chapters' trades left out. */
export const UnderWay: Story = {
  parameters: { progress: { spoilers: true, ceiling: 3, checks: { [trades[0].id]: true } } },
  play: async ({ canvas }) => {
    const card = canvas.getByRole("region", { name: "The trading quest" });
    await expect(within(card).getByText("Next")).toBeVisible();
    await expect(within(card).getByText("Anything past chapter 3 stays hidden.")).toBeVisible();
    await expect(canvas.queryByText(trades.at(-1)!.title)).toBeNull();
  },
};

/** Every chapter showing and nothing ticked: the card closed on the first trade. */
export const NotStarted: Story = {
  parameters: { progress: { spoilers: false } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Starts with")).toBeVisible();
  },
};
