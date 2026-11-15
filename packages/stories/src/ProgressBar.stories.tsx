import { ProgressBar } from "@hundo/core/components/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

// The thin bar under a stat on the dashboard and beside each chapter: Base UI's progress, as wide as what holds it.
const meta = {
  title: "Core/ProgressBar",
  component: ProgressBar,
  args: { done: 12, total: 32, label: "Heart pieces" },
  decorators: [(Story) => <div style={{ maxWidth: 320 }}><Story /></div>],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Partway: Story = {};
export const Empty: Story = { args: { done: 0 } };
export const Full: Story = { args: { done: 32 } };

/** A progressbar named by its label, read as a whole percentage of 0 to 100 (12 of 32 is 37). */
export const Accessible: Story = {
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar", { name: "Heart pieces" });
    await expect(bar).toHaveAttribute("aria-valuenow", "37");
    await expect(bar).toHaveAttribute("aria-valuemin", "0");
    await expect(bar).toHaveAttribute("aria-valuemax", "100");
  },
};
