import { FileField } from "@hundo/core/components/controls";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";

const meta = {
  title: "Core/FileField",
  component: FileField,
  args: { id: "import-file", label: "Import progress backup", accept: ".json,application/json", onChange: fn() },
} satisfies Meta<typeof FileField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("No file chosen")).toBeVisible();
    // The hidden input is still what a screen reader finds, named by the label and the button's own words.
    await expect(canvas.getByLabelText("Import progress backup Choose file")).toHaveAttribute("type", "file");
  },
};

/** After a file is chosen its name shows beside the button, and the page is told. */
export const Chosen: Story = {
  play: async ({ canvas, args }) => {
    const file = new File(["{}"], "koholint-progress.json", { type: "application/json" });
    await userEvent.upload(canvas.getByLabelText(/Import progress backup/), file);
    await expect(canvas.getByText("koholint-progress.json")).toBeVisible();
    await expect(args.onChange).toHaveBeenCalledWith(file);
  },
};

/** Tab reaches the hidden input, and the 3px focus ring is drawn around the button that stands in for it. */
export const Focused: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab();
    const input = canvas.getByLabelText(/Import progress backup/);
    await expect(input).toHaveFocus();
    const button = input.closest("label")!;
    await expect(getComputedStyle(button).outlineWidth).toBe("3px");
  },
};
