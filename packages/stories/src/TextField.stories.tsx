import { TextField } from "@hundo/core/components/TextField";
import { Button } from "@hundo/core/components/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ComponentProps } from "react";
import { expect, userEvent } from "storybook/test";

/** Holds the value, as a form does. */
function Holder(args: ComponentProps<typeof TextField>) {
  const [value, setValue] = useState(args.value);
  return <TextField {...args} value={value} onChange={setValue} />;
}

const meta = {
  title: "Core/TextField",
  component: TextField,
  args: { id: "reported", label: "In-game completion (%)", value: "", onChange: () => {} },
  render: (args) => <Holder {...args} />,
  decorators: [(Story) => <div style={{ maxWidth: 320 }}><Story /></div>],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { placeholder: "For example 42.5" } };
export const Filled: Story = { args: { value: "42.5" } };
export const Described: Story = { args: { description: "From Stats, then General, in the game." } };
export const WithError: Story = { args: { value: "142", description: "From Stats, then General, in the game.", error: "Enter a number from 0 to 100." } };
export const Disabled: Story = { args: { value: "42.5", disabled: true } };

/** Named by its label, described by its description and its error, and invalid only while there is an error. */
export const Accessible: Story = {
  args: { value: "142", description: "From Stats, then General, in the game.", error: "Enter a number from 0 to 100." },
  play: async ({ canvas }) => {
    const field = canvas.getByRole("textbox", { name: "In-game completion (%)" });
    await expect(field).toBeInvalid();
    await expect(field).toHaveAccessibleDescription(/From Stats, then General, in the game\./);
    await expect(field).toHaveAccessibleDescription(/Enter a number from 0 to 100\./);
  },
};

/** The on-screen keyboard on a phone is the numeric one, and what's typed is kept. */
export const Numeric: Story = {
  args: { inputMode: "decimal", autoComplete: "off", maxLength: 5 },
  play: async ({ canvas }) => {
    const field = canvas.getByRole("textbox", { name: "In-game completion (%)" });
    await expect(field).toHaveAttribute("inputmode", "decimal");
    await userEvent.type(field, "42.5");
    await expect(field).toHaveValue("42.5");
  },
};

export const Focused: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab();
    const field = canvas.getByRole("textbox");
    await expect(field).toHaveFocus();
    await expect(getComputedStyle(field).outlineWidth).toBe("3px");
  },
};

/** A short field with its form's buttons on the same line, and the error under both, announced when it appears: Red Dead's calibration. */
export const WithActions: Story = {
  args: {
    inputMode: "decimal",
    width: "short",
    value: "142",
    error: "Enter a number from 0 to 100.",
    alertError: true,
    actions: (
      <>
        <Button look="">Save</Button>
        <Button>Clear</Button>
      </>
    ),
  },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("Enter a number from 0 to 100.");
    await expect(canvas.getByRole("textbox", { name: "In-game completion (%)" })).toHaveAccessibleDescription(/Enter a number from 0 to 100\./);
  },
};
