import { SearchField } from "@hundo/core/components/SearchField";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ComponentProps } from "react";
import { expect, userEvent } from "storybook/test";

/** Holds the query, as the checklist page does. */
function Holder(args: ComponentProps<typeof SearchField>) {
  const [value, setValue] = useState(args.value);
  return <SearchField {...args} value={value} onChange={setValue} />;
}

// The checklist's search box: a magnifier and the input in one bordered box, the whole box its label.
const meta = {
  title: "Core/SearchField",
  component: SearchField,
  args: { id: "search", label: "Search entries", placeholder: "Search heart pieces, shells, places…", value: "", onChange: () => {} },
  render: (args) => <Holder {...args} />,
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Filled: Story = { args: { value: "heart piece" } };

/** A searchbox named by its hidden label, and only by it: what's typed is kept, and doesn't become part of its name. */
export const Typing: Story = {
  play: async ({ canvas }) => {
    const box = canvas.getByRole("searchbox", { name: "Search entries" });
    await userEvent.type(box, "shell");
    await expect(box).toHaveValue("shell");
    await expect(box).toHaveAccessibleName("Search entries");
  },
};

/** Tab to it: the ring is drawn round the whole box, not the bare input. */
export const Focused: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab();
    const box = canvas.getByRole("searchbox");
    await expect(box).toHaveFocus();
    await expect(getComputedStyle(box.parentElement!).outlineWidth).toBe("2px");
  },
};
