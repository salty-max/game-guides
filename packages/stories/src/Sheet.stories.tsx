import { Sheet } from "@hundo/core/components/Sheet";
import { Button } from "@hundo/core/components/ui";
import { Select } from "@hundo/core/components/Select";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ComponentProps } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

// A sheet from the bottom of a phone's screen, over a dimmed page: the checklist's filters. Its fields scroll, its buttons stay at its foot.
const meta = {
  title: "Core/Sheet",
  component: Sheet,
  args: {
    open: true,
    onOpenChange: fn(),
    title: "Filters",
    returnFocus: () => false as const,
    children: (
      <div style={{ display: "grid", gap: 16 }}>
        <Select id="sheet-status" label="Status" choices={[["all", "All statuses"], ["todo", "Unfinished"], ["done", "Completed"]]} value="all" onChange={() => {}} />
      </div>
    ),
    footer: (
      <>
        <Button>Clear</Button>
        <Button look="">Show 40 matches</Button>
      </>
    ),
  },
  globals: { viewport: { value: "phone", isRotated: false } },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The sheet renders in a portal on the page, outside the story's own element. */
const page = (canvasElement: HTMLElement) => within(canvasElement.ownerDocument.body);
const patient = { timeout: 15_000 };

/** Open: a modal named by its title, with its fields, its buttons and one that closes it. */
export const Open: Story = {
  play: async ({ canvasElement, args }) => {
    const sheet = await page(canvasElement).findByRole("dialog", { name: "Filters" }, patient);
    await expect(within(sheet).getByRole("combobox", { name: "Status" })).toBeVisible();
    await expect(within(sheet).getByRole("button", { name: "Show 40 matches" })).toBeVisible();
    await userEvent.click(within(sheet).getByRole("button", { name: "Close" }));
    await waitFor(() => expect(args.onOpenChange).toHaveBeenCalledWith(false), patient);
  },
};

/** Escape closes it too. */
export const Escape: Story = {
  play: async ({ canvasElement, args }) => {
    await page(canvasElement).findByRole("dialog", { name: "Filters" }, patient);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(args.onOpenChange).toHaveBeenCalledWith(false), patient);
  },
};

/** Holds the open state, as the checklist does. */
function Holder(args: ComponentProps<typeof Sheet>) {
  const [open, setOpen] = useState(args.open);
  return <Sheet {...args} open={open} onOpenChange={setOpen} />;
}

/** Back while it's open: gone at once, with no slide, before the page it's on goes out of sight (which would hold the slide until it came back). */
export const GoneOnBack: Story = {
  render: (args) => <Holder {...args} />,
  play: async ({ canvasElement }) => {
    await page(canvasElement).findByRole("dialog", { name: "Filters" }, patient);
    window.dispatchEvent(new PopStateEvent("popstate"));
    await expect(page(canvasElement).queryByRole("dialog", { name: "Filters" })).toBeNull();
  },
};
