import { Button } from "@hundo/core/components/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Core/Button",
  component: Button,
  args: { children: "Save settings" },
  argTypes: { look: { control: "inline-radio", options: ["", "outline", "accent", "danger"] } },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { look: "" } };
export const Outline: Story = { args: { look: "outline" } };
export const Accent: Story = { args: { look: "accent" } };
export const Danger: Story = { args: { look: "danger", children: "Replace with backup" } };
export const WithIcon: Story = { args: { look: "outline", icon: "gear", children: "Guide settings" } };

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
    </div>
  ),
};
