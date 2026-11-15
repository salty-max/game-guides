import { ItemList, ItemRow } from "@hundo/core/components/list";
import { Button } from "@hundo/core/components/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";

const meta = {
  title: "Core/ItemList",
  component: ItemList,
  args: { label: "Linked devices", empty: "No devices linked yet." },
  decorators: [(Story) => <div style={{ maxWidth: 520 }}><Story /></div>],
} satisfies Meta<typeof ItemList>;

export default meta;
type Story = StoryObj<typeof meta>;

const onUnlink = fn();

/** Rows with an action each, named by what they act on. */
export const WithActions: Story = {
  render: (args) => (
    <ItemList {...args}>
      <ItemRow title="Safari on Max's iPhone" detail="Linked 15 Nov 2026">
        <Button size="compact" aria-label="Unlink Safari on Max's iPhone" onClick={() => onUnlink("iphone")}>
          Unlink
        </Button>
      </ItemRow>
      <ItemRow title="Brave on the Mac" detail="This device" />
    </ItemList>
  ),
  play: async ({ canvas }) => {
    const list = canvas.getByRole("list", { name: "Linked devices" });
    await expect(list.querySelectorAll("li")).toHaveLength(2);
    await userEvent.click(canvas.getByRole("button", { name: "Unlink Safari on Max's iPhone" }));
    await expect(onUnlink).toHaveBeenCalledWith("iphone");
  },
};

/** A long name wraps inside its row and keeps the action in place. */
export const LongNames: Story = {
  render: (args) => (
    <ItemList {...args}>
      <ItemRow title="Safari on an iPad that somebody named with far more words than a row has room for on a phone" detail="Linked 3 Jan 2027">
        <Button size="compact" aria-label="Unlink the long-named iPad">
          Unlink
        </Button>
      </ItemRow>
    </ItemList>
  ),
};

/** No rows: a sentence, not an empty list. */
export const Empty: Story = {
  render: (args) => <ItemList {...args} />,
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("list")).toBeNull();
    await expect(canvas.getByText("No devices linked yet.")).toBeVisible();
  },
};
