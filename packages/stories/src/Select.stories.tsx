import { Select } from "@hundo/core/components/Select";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ComponentProps } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

const status: [string, string][] = [
  ["all", "All statuses"],
  ["todo", "Unfinished"],
  ["done", "Completed"],
];
const chapters: [number, string][] = Array.from({ length: 40 }, (_, index) => [index + 1, `Chapter ${index + 1}`]);

/** The popup renders in a portal on the page, outside the story's own element. */
const page = (canvasElement: HTMLElement) => within(canvasElement.ownerDocument.body);

// waitFor's default is 1 s, which a busy machine overruns; this only has to catch a popup that never opens.
const patient = { timeout: 15_000 };

/** The popup is open and has finished fading in. */
const opened = (canvasElement: HTMLElement) => waitFor(() => expect(page(canvasElement).getByRole("listbox")).toBeVisible(), patient);

/** Holds the value, as a page does. */
function Holder(args: ComponentProps<typeof Select>) {
  const [value, setValue] = useState(args.value);
  return <Select {...args} value={value} onChange={setValue} />;
}

const meta = {
  title: "Core/Select",
  component: Select,
  args: { id: "status", label: "Status", choices: status, value: "all", onChange: () => {} },
  render: (args) => <Holder {...args} />,
  decorators: [(Story) => <div style={{ maxWidth: 260, minHeight: 320 }}><Story /></div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Chosen: Story = { args: { value: "done" } };

/** The label can be kept for screen readers only, as it is where a heading already says what the control is for. */
export const BareLabel: Story = { args: { bare: true, label: "Route completion status" } };

/** Dimmed and not clickable: the not-allowed cursor. */
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Status" });
    await expect(trigger).toBeDisabled();
    await expect(getComputedStyle(trigger).cursor).toBe("not-allowed");
    await expect(getComputedStyle(trigger).opacity).toBe("0.46");
  },
};

export const Open: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Status" }));
    await opened(canvasElement);
    await expect(page(canvasElement).getAllByRole("option")).toHaveLength(3);
  },
};

/** More choices than fit: the list scrolls inside the popup and never runs off the screen. */
export const LongList: Story = {
  args: { id: "chapter", label: "Chapter", choices: chapters, value: 3 },
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Chapter" }));
    await opened(canvasElement);
    const list = page(canvasElement).getByRole("listbox");
    const popup = list.closest("[data-side]") ?? list;
    await expect(popup.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight);
    // 40 items of 44px are taller than any window, so the list scrolls instead.
    await expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
  },
};

/** Keyboard focus on the trigger: the 3px focus ring. */
export const Focused: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab();
    const trigger = canvas.getByRole("combobox");
    await expect(trigger).toHaveFocus();
    await expect(getComputedStyle(trigger).outlineWidth).toBe("3px");
  },
};

/** Tab to the trigger, open with the arrow, move with the arrows, pick with Enter. */
export const KeyboardPick: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");
    await opened(canvasElement);
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => expect(page(canvasElement).queryByRole("listbox")).toBeNull(), patient);
    await expect(canvas.getByRole("combobox")).toHaveTextContent("Unfinished");
    // Focus is back on the trigger, so the next Tab moves on from here.
    await expect(canvas.getByRole("combobox")).toHaveFocus();
  },
};

/** Escape closes the popup without changing the value, and returns focus to the trigger. */
export const EscapeCloses: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await opened(canvasElement);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page(canvasElement).queryByRole("listbox")).toBeNull(), patient);
    await expect(canvas.getByRole("combobox")).toHaveTextContent("All statuses");
    await expect(canvas.getByRole("combobox")).toHaveFocus();
  },
};
