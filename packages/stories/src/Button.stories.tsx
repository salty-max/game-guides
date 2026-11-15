import { Button } from "@hundo/core/components/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";

const meta = {
  title: "Core/Button",
  component: Button,
  args: { children: "Save settings" },
  argTypes: { look: { control: "inline-radio", options: ["", "outline", "accent", "danger", "link"] } },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { look: "" } };
export const Outline: Story = { args: { look: "outline" } };
export const Accent: Story = { args: { look: "accent" } };
export const Danger: Story = { args: { look: "danger", children: "Replace with backup" } };
export const WithIcon: Story = { args: { look: "outline", icon: "gear", children: "Guide settings" } };

/** Words in the primary colour, no box: the route's "Expand all". Its size is its own. */
export const Link: Story = { args: { look: "link", icon: "down", children: "Expand all" } };

/** The smaller button used beside a group of steps. */
export const Compact: Story = { args: { look: "outline", size: "compact", icon: "check", children: "Check all (7)" } };

/** Every look disabled: the same dimmed button, but its text still has to read. */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {(["", "outline", "accent", "danger"] as const).map((look) => (
        <Button key={look} look={look} disabled>
          {look || "primary"}
        </Button>
      ))}
      <Button look="link" disabled>
        link
      </Button>
    </div>
  ),
};

/** Keyboard focus: the 3px focus ring, on each look. */
export const Focused: Story = {
  args: { look: "outline" },
  play: async ({ canvas }) => {
    canvas.getByRole("button").focus();
  },
};

export const AllLooks: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <Button look="">Primary</Button>
      <Button look="outline">Outline</Button>
      <Button look="accent">Accent</Button>
      <Button look="danger">Danger</Button>
      <Button look="link">Link</Button>
    </div>
  ),
};

/** Disabled outright: out of the Tab order, and a click does nothing. */
export const DisabledIgnoresClicks: Story = {
  args: { disabled: true, onClick: fn() },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button");
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

/** Counts down, and stays where the focus is when it reaches zero: Koholint's "Undo death". */
function Countdown() {
  const [left, setLeft] = useState(1);
  return (
    <Button icon="minus" disabled={left === 0} focusableWhenDisabled onClick={() => setLeft((n) => n - 1)}>
      Undo ({left})
    </Button>
  );
}

/**
 * `focusableWhenDisabled`: the button that disables itself keeps the focus, announced as unavailable (aria-disabled) and still dimmed,
 * and a click on it does nothing. Enabled, it carries no aria-disabled at all.
 */
export const FocusableWhenDisabled: Story = {
  render: () => <Countdown />,
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button");
    await expect(button).not.toHaveAttribute("aria-disabled");
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expect(button).toHaveFocus();
    await expect(button).toHaveAttribute("aria-disabled", "true");
    await expect(button).not.toHaveAttribute("disabled");
    await expect(getComputedStyle(button).opacity).toBe("0.46");
    await userEvent.keyboard("{Enter}");
    await expect(button).toHaveTextContent("Undo (0)");
  },
};
