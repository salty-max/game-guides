import { CheckBox } from "@hundo/core/components/CheckBox";
import { chapters } from "@hundo/core/guide";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";

// The rows' box, Base UI's Checkbox: it saves the step's check. A row names it with a label of its own (by id), either beside it and
// stretched over the row, or, in the article's prose, wrapped round it with the step's opening words.
const row = chapters[0].groups[0].rows[0];
const ticked = () => useProgress.getState().data.checks[row.id] === true;

const meta = {
  title: "Core/RowCheckBox",
  component: CheckBox,
  args: { id: "story-box", labelId: "story-box-label", row },
  decorators: [
    (Story) => {
      useProgress.setState({ data: defaultState() });
      return (
        <div style={{ maxWidth: 520 }}>
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof CheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Beside its label, as in a route row. A click on the words ticks it once, a second clears it. */
export const Line: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <CheckBox {...args} />
      <label id={args.labelId} htmlFor={args.id}>
        {row.title}
      </label>
    </div>
  ),
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: row.title });
    await userEvent.click(canvas.getByText(row.title));
    await expect(box).toBeChecked();
    await expect(ticked()).toBe(true);
    await userEvent.click(canvas.getByText(row.title));
    await expect(box).not.toBeChecked();
  },
};

/** Wrapped in its words, as in the article. A click on the box ticks it once, a click on the words once more. */
export const Prose: Story = {
  args: { prose: true },
  render: (args) => (
    <p style={{ lineHeight: 1.8 }}>
      <label id={args.labelId}>
        <CheckBox {...args} />
        {row.title}.
      </label>{" "}
      {row.text}
    </p>
  ),
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: `${row.title}.` });
    await userEvent.click(box);
    await expect(box).toBeChecked();
    await userEvent.click(canvas.getByText(`${row.title}.`));
    await expect(box).not.toBeChecked();
    await expect(ticked()).toBe(false);
  },
};

/** Tab to it, Space ticks it, Space again clears it; the 3px focus ring shows while it has the keyboard focus. */
export const Keyboard: Story = {
  render: Line.render,
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: row.title });
    await userEvent.tab();
    await expect(box).toHaveFocus();
    await expect(getComputedStyle(box).outlineWidth).toBe("3px");
    await userEvent.keyboard(" ");
    await expect(box).toBeChecked();
    await userEvent.keyboard(" ");
    await expect(box).not.toBeChecked();
  },
};
