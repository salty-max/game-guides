import { ChipGroup } from "@hundo/core/components/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ComponentProps } from "react";
import { expect, userEvent } from "storybook/test";

/** Holds the choice, as a page's filter does. */
function Holder(args: ComponentProps<typeof ChipGroup>) {
  const [value, setValue] = useState(args.value);
  return <ChipGroup {...args} value={value} onChange={setValue} />;
}

// The checklist's category filters, the route's, and Koholint's run mode: one chip pressed at a time.
const meta = {
  title: "Core/ChipGroup",
  component: ChipGroup,
  args: {
    label: "Checklist categories",
    choices: [
      ["all", "All entries"],
      ["heart", "Heart pieces"],
      ["shell", "Secret shells"],
      ["missable", "Missable"],
    ],
    value: "all",
    onChange: () => {},
  },
  render: (args) => <Holder {...args} />,
} satisfies Meta<typeof ChipGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPressed: Story = {};
export const OtherPressed: Story = { args: { value: "shell" } };

/** A value the chips don't offer (a category the page's select chose): none is pressed. */
export const NonePressed: Story = { args: { value: "photo" } };

/** Two chips, as Koholint's run mode shows them, with the room it keeps under a panel's title. */
export const RunMode: Story = {
  args: { label: "Run mode", choices: [["normal", "Normal"], ["hero", "Hero"]], value: "normal", space: "above" },
};

/** A click presses a chip and lets go of the last; clicking the pressed one again keeps it pressed. */
export const Clicking: Story = {
  play: async ({ canvas }) => {
    const all = canvas.getByRole("button", { name: "All entries" });
    const shells = canvas.getByRole("button", { name: "Secret shells" });
    await expect(canvas.getByRole("group", { name: "Checklist categories" })).toBeInTheDocument();
    await userEvent.click(shells);
    await expect(shells).toHaveAttribute("aria-pressed", "true");
    await expect(all).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(shells);
    await expect(shells).toHaveAttribute("aria-pressed", "true");
  },
};

/**
 * Tab reaches the group once, on the chip it was last on (the first, to begin with), not on the pressed one; the arrow keys move
 * between chips without pressing them, and Enter or Space presses the one with the focus.
 */
export const Keyboard: Story = {
  args: { value: "shell" },
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "All entries" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    const hearts = canvas.getByRole("button", { name: "Heart pieces" });
    await expect(hearts).toHaveFocus();
    await expect(hearts).toHaveAttribute("aria-pressed", "false");
    await userEvent.keyboard(" ");
    await expect(hearts).toHaveAttribute("aria-pressed", "true");
    await expect(getComputedStyle(hearts).outlineWidth).toBe("3px");
  },
};
