import { Checkbox } from "@hundo/core/components/controls";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ComponentProps } from "react";
import { expect, userEvent } from "storybook/test";

/** Holds the value, as a form does. */
function Holder(args: ComponentProps<typeof Checkbox>) {
  const [checked, setChecked] = useState(args.checked);
  return <Checkbox {...args} checked={checked} onChange={setChecked} />;
}

const meta = {
  title: "Core/Checkbox",
  component: Checkbox,
  args: { label: "Hide later chapters", checked: false, onChange: () => {} },
  render: (args) => <Holder {...args} />,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { checked: true } };

/** Dimmed, and not clickable. */
export const Disabled: Story = {
  args: { checked: true, disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("checkbox", { name: "Hide later chapters" })).toHaveAttribute("aria-disabled", "true");
  },
};

/** Tab to it, Space ticks it, Space again clears it; the 3px focus ring shows while it has the keyboard focus. */
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: "Hide later chapters" });
    await userEvent.tab();
    await expect(box).toHaveFocus();
    await expect(getComputedStyle(box).outlineWidth).toBe("3px");
    await userEvent.keyboard(" ");
    await expect(box).toBeChecked();
    await userEvent.keyboard(" ");
    await expect(box).not.toBeChecked();
  },
};

/** Clicking the words ticks it too: the whole 44px line is the target. */
export const LabelClick: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("Hide later chapters"));
    await expect(canvas.getByRole("checkbox", { name: "Hide later chapters" })).toBeChecked();
  },
};
