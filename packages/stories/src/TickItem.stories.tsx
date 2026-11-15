import { TickItem } from "@hundo/core/components/TickItem";
import { chapters } from "@hundo/core/guide";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect, fn, userEvent } from "storybook/test";

// A step in a short list (Next up, Don't miss): its box, its title over a quieter line, and a link to it in its chapter. The label
// stretches over the item, so the whole item ticks it; the link sits above the label.
const rows = chapters[0].groups[0].rows.slice(0, 3);

function List({ onToggle }: { onToggle: () => void }) {
  const checks = useProgress((s) => s.data.checks);
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {rows.map((row) => (
        <TickItem
          key={row.id}
          row={row}
          prefix="story"
          ticked={checks[row.id] === true}
          detail={row.group}
          jumpLabel={`Jump to “${row.title}”`}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}

const meta = {
  title: "Core/TickItem",
  component: List,
  args: { onToggle: fn() },
  decorators: [
    (Story) => {
      useProgress.setState({ data: defaultState() });
      return (
        <MemoryRouter>
          <div style={{ maxWidth: 520 }}>
            <Story />
          </div>
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Clear: Story = {};

/** A click on the item's quieter line ticks its box (the list hears of it first), and the title is struck through. */
export const Ticked: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getAllByText(rows[0].group)[0]);
    const box = canvas.getByRole("checkbox", { name: (name) => name.includes(rows[0].title) });
    await expect(box).toBeChecked();
    await expect(args.onToggle).toHaveBeenCalledOnce();
    await expect(getComputedStyle(canvas.getByText(rows[0].title)).textDecorationLine).toBe("line-through");
    await expect(canvas.getByRole("link", { name: `Jump to “${rows[0].title}”` })).toHaveAttribute("href", `/guide/${rows[0].chapter}/${rows[0].id}`);
  },
};
