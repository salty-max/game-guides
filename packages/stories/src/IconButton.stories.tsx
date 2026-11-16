import { TooltipHost } from "@hundo/core/components/TooltipHost";
import { IconButton } from "@hundo/core/components/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor } from "storybook/test";

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

/**
 * `tooltip`: the label also shows in a small box under the button for a pointer or the keyboard (the theme toggle in the top
 * bar). The page mounts the one tooltip every such button shares (TooltipHost); a screen reader still reads the button's own name.
 */
export const WithTooltip: Story = {
  args: { label: "Switch to dark mode", icon: "moon", tooltip: true },
  render: (args) => (
    <div style={{ padding: "8px 0 48px" }}>
      <IconButton {...args} />
      <TooltipHost />
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Switch to dark mode" })).toHaveFocus();
    await waitFor(() => expect(screen.getByText("Switch to dark mode")).toBeVisible());
  },
};
