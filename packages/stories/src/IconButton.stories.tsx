import { IconButton } from "@hundo/core/components/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Core/IconButton", component: IconButton, args: { label: "Close dialog", icon: "x" } } satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Close: Story = {};
export const Settings: Story = { args: { label: "Open guide settings", icon: "gear" } };
export const Disabled: Story = { args: { disabled: true } };

/** Keyboard focus: the 3px focus ring. */
export const Focused: Story = {
  play: async ({ canvas }) => {
    canvas.getByRole("button").focus();
  },
};
