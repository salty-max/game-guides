import { MissablesStrip } from "@hundo/core/components/MissablesStrip";
import { chapters } from "@hundo/core/guide";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect, userEvent, within } from "storybook/test";

// The strip under a chapter's hero. The stories use Koholint's data, which flags nothing as missable, so this is the reassurance: Base
// UI's collapsible, closed, with the sources behind the claim inside. (The flagged list is the same parts, open by default.)
const meta = {
  title: "Core/MissablesStrip",
  component: MissablesStrip,
  args: { chapter: chapters[0] },
  decorators: [
    (Story) => {
      useProgress.setState({ data: defaultState() });
      return (
        <MemoryRouter>
          <div style={{ maxWidth: 760 }}>
            <Story />
          </div>
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof MissablesStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Closed: the claim in one line, its sources hidden until found. */
export const Reassurance: Story = {};

/** Opened: the sources behind the claim. */
export const ReassuranceOpened: Story = {
  play: async ({ canvas }) => {
    const strip = canvas.getByRole("complementary", { name: "Missable entries" });
    const button = within(strip).getByRole("button", { name: /Nothing is flagged/ });
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-expanded", "true");
    const links = within(strip).getAllByRole("link");
    await expect(links.length).toBeGreaterThan(0);
    for (const link of links) await expect(link.closest("[hidden]")).toBeNull();
  },
};
