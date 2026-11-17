import { MissablesStrip } from "@hundo/core/components/MissablesStrip";
import { chapters } from "@hundo/core/guide";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

// The strip under a chapter's hero. The stories use Koholint's data, which flags nothing as missable, so this is the reassurance: the
// claim in one line, with nothing to open (its sources stay in the data).
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

/** The claim in one line. */
export const Reassurance: Story = {};
