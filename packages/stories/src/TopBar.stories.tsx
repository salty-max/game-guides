import { TopBar } from "@hundo/core/components/TopBar";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

// The bar across the top of every page. Under 800px its layout changes (the menu button, the pages as icons over words), which a story
// can't show: the media queries look at the window, not at the story. The phone layout is checked in the browser (docs/testing.md).
const meta = {
  title: "Core/TopBar",
  component: TopBar,
  args: { chapter: 1, view: "guide", menuOpen: false, onToggleMenu: () => {}, menuToggle: { current: null } },
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/guide/1"]}>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** On the guide: the page the reader is on is marked. */
export const Guide: Story = {};

export const Checklist: Story = { args: { view: "checklist" } };

export const Progress: Story = { args: { view: "dashboard" } };
