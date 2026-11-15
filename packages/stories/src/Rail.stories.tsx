import { Rail } from "@hundo/core/components/Rail";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

// The chapter rail: a column beside the page, a drawer under 800px (which a story can't show: the media queries look at the window).
const meta = {
  title: "Core/Rail",
  component: Rail,
  args: { id: "chapter-rail", open: false, activeChapter: 1, view: "guide", railRef: { current: null } },
  decorators: [
    (Story, { parameters }) => {
      // Each story sets the saved progress it needs: the store is shared by every story.
      useProgress.setState({ data: { ...defaultState(), ...(parameters.progress as object) } });
      return (
        <MemoryRouter initialEntries={["/guide/1"]}>
          <div style={{ width: 280, height: 760 }}>
            <Story />
          </div>
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof Rail>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Spoiler protection on, as a new reader has it: the first chapter is open and the rest say what hides them. */
export const Protected: Story = {};

/** Protection off: every chapter is a link with how far through it the reader is. */
export const Revealed: Story = { parameters: { progress: { spoilers: false, ceiling: 9 } } };

/** On a chapter other than the first: its link is marked as the current page. */
export const OnAnotherChapter: Story = { args: { activeChapter: 2 }, parameters: { progress: { spoilers: false, ceiling: 9, chapter: 2 } } };

/** Not on the guide (on the checklist, say): no chapter is the current page. */
export const OnTheChecklist: Story = { args: { view: "checklist" }, parameters: { progress: { spoilers: false, ceiling: 9 } } };
