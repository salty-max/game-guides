import { OverallBar } from "@hundo/core/components/Overall";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

// The guide's one overall figure: the Progress page's hero, and the compact line over the chapters in the rail and the drawer (the Rail and
// RailDrawer stories draw it in place). Base UI's progress, named by its visible label and read as the figure shown.
const meta = {
  title: "Core/Overall",
  component: OverallBar,
  args: { percent: 41, label: "complete", entries: null, place: "page" },
  decorators: [(Story, { args }) => <div style={{ maxWidth: args.place === "rail" ? 250 : 720 }}><Story /></div>],
} satisfies Meta<typeof OverallBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Progress page's hero, for a guide counting its completion list: the figure alone. */
export const Page: Story = {};
export const PageEmpty: Story = { args: { percent: 0 } };
export const PageFull: Story = { args: { percent: 100 } };

/** Red Dead's: the game's own percentage, to a tenth, with the entries it reads beside it. */
export const PageWeighted: Story = { args: { percent: 55.1, label: "estimated in-game completion", entries: { done: 164, total: 274 } } };

/** In the rail and the drawer: the label and the figure over a thin bar. */
export const Rail: Story = { args: { place: "rail" } };
export const RailWeighted: Story = { args: { place: "rail", percent: 55.1, label: "estimated in-game completion" } };

/** A progressbar named "Overall completion", whose value a screen reader hears as shown: 99.9 is never "100%". */
export const Accessible: Story = {
  args: { percent: 99.9, label: "estimated in-game completion" },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar", { name: "Overall completion" });
    await expect(bar).toHaveAttribute("aria-valuenow", "99.9");
    await expect(bar).toHaveAttribute("aria-valuetext", "99.9% estimated in-game completion");
    await expect(canvas.getByText("99.9%")).toBeVisible();
  },
};

/** The fill is the share shown, from the track's start. */
export const FillWidth: Story = {
  args: { place: "rail", percent: 25 },
  play: async ({ canvasElement }) => {
    const track = canvasElement.querySelector<HTMLElement>("[role=progressbar] > div")!;
    const fill = track.firstElementChild as HTMLElement;
    await expect(fill.getBoundingClientRect().width / track.getBoundingClientRect().width).toBeCloseTo(0.25, 2);
  },
};
