import { NextUp } from "@hundo/core/components/NextUp";
import { allRows } from "@hundo/core/guide";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect, userEvent, within } from "storybook/test";

// The next few unticked steps, from this chapter on, in a snug panel under the chapter's hero. A step ticked here stays in the list,
// struck through, until "Show next steps".
const meta = {
  title: "Core/NextUp",
  component: NextUp,
  args: { chapter: 1 },
  decorators: [
    (Story, { parameters }) => {
      useProgress.setState({ data: { ...defaultState(), ...(parameters.save ?? {}) } });
      return (
        <MemoryRouter>
          <div style={{ maxWidth: 760 }}>
            <Story />
          </div>
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof NextUp>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three steps to go. */
export const ThreeSteps: Story = {};

/** A step ticked: it stays put, and the button to move on shows. */
export const Holding: Story = {
  play: async ({ canvas }) => {
    const panel = canvas.getByRole("region", { name: "Next up" });
    await userEvent.click(within(panel).getAllByRole("checkbox")[0]);
    await expect(within(panel).getByRole("button", { name: "Show next steps" })).toBeVisible();
  },
};

/** Every step ticked, every chapter shown: the list's empty note. */
export const AllDone: Story = {
  parameters: { save: { spoilers: false, checks: Object.fromEntries(allRows.map((row) => [row.id, true as const])) } },
};
