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

const box = (element: Element) => element.getBoundingClientRect();
const inWidth = (width: number): Story["decorators"] => [
  (Story) => (
    <div style={{ width }}>
      <Story />
    </div>
  ),
];

// The line's card the whole width of the page's column, with no On this page beside it or folded above it: with one line met (Koholint
// has one at all), the list would only name the card beside it. The list itself is Contents, drawn in the Dashboard and article stories.
async function wholeWidthWithNoList(canvas: Parameters<NonNullable<Story["play"]>>[0]["canvas"]) {
  const card = canvas.getByRole("region", { name: "The trading quest" });
  const page = canvas.getByRole("group", { name: "Questlines by status" }).parentElement!;
  await expect(box(card).left).toBe(box(page).left);
  await expect(box(card).width).toBeCloseTo(box(page).width, 1);
  await expect(canvas.queryByRole("navigation", { name: "On this page" })).toBeNull();
  await expect(canvas.queryByRole("button", { name: "On this page" })).toBeNull();
}

/** One line on a wide page: one column, no list. */
export const OneLineWide: Story = {
  parameters: { progress: { spoilers: false } },
  decorators: inWidth(900),
  play: async ({ canvas }) => wholeWidthWithNoList(canvas),
};

/** And on a phone's width. */
export const OneLineOnAPhone: Story = {
  parameters: { progress: { spoilers: false } },
  decorators: inWidth(360),
  play: async ({ canvas }) => wholeWidthWithNoList(canvas),
};
