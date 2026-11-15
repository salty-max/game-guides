import { CodeField } from "@hundo/core/components/controls";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ComponentProps } from "react";
import { expect, fn, userEvent } from "storybook/test";

/** Holds the value, as a screen does. */
function Holder(args: ComponentProps<typeof CodeField>) {
  const [value, setValue] = useState(args.value);
  return <CodeField {...args} value={value} onChange={setValue} />;
}

const meta = {
  title: "Core/CodeField",
  component: CodeField,
  args: { id: "pairing-code", label: "Pairing code", value: "", onChange: () => {}, onComplete: fn() },
  render: (args) => <Holder {...args} />,
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof CodeField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const PartlyTyped: Story = { args: { value: "123" } };
export const Described: Story = { args: { description: "Six digits, shown on the device you're linking to." } };
export const Invalid: Story = { args: { value: "123456", invalid: true, description: "That code didn't work. Check it and try again." } };
export const Disabled: Story = { args: { value: "123456", disabled: true } };
export const Alphanumeric: Story = { args: { label: "Recovery code", alphanumeric: true, value: "A7C9" } };

/** The first box is named by the label, the others by their place in the code. */
export const Named: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Pairing code" })).toBeVisible();
    await expect(canvas.getByRole("textbox", { name: "Character 6 of 6" })).toBeVisible();
    await expect(canvas.getAllByRole("textbox")).toHaveLength(6);
  },
};

/** Typing moves from box to box by itself, takes digits only, and reports the code once, on the sixth digit. */
export const Typing: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole("textbox", { name: "Pairing code" }));
    await userEvent.keyboard("12x34");
    await expect(args.onComplete).not.toHaveBeenCalled();
    await userEvent.keyboard("56");
    await expect(args.onComplete).toHaveBeenCalledTimes(1);
    await expect(args.onComplete).toHaveBeenCalledWith("123456");
  },
};

/** A pasted code fills every box. */
export const Pasting: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole("textbox", { name: "Pairing code" }));
    await userEvent.paste("654321");
    await expect(canvas.getByRole("textbox", { name: "Character 6 of 6" })).toHaveValue("1");
    await expect(args.onComplete).toHaveBeenCalledWith("654321");
  },
};

/** The box in use has the 3px focus ring, and Backspace steps back a box. */
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab();
    const first = canvas.getByRole("textbox", { name: "Pairing code" });
    await expect(first).toHaveFocus();
    await expect(getComputedStyle(first).outlineWidth).toBe("3px");
    await userEvent.keyboard("12{Backspace}");
    await expect(canvas.getByRole("textbox", { name: "Character 2 of 6" })).toHaveFocus();
  },
};
