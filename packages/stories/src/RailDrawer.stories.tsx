import { RailDrawer } from "@hundo/core/components/RailDrawer";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

// The chapter rail as a drawer, the way it opens under 800px: from the left edge, under the top bar, over a dimmed page.
const meta = {
  title: "Core/RailDrawer",
  component: RailDrawer,
  args: { open: true, onOpenChange: fn(), activeChapter: 1, view: "guide", returnFocus: () => false as const, onFollowLink: fn() },
  decorators: [
    (Story) => {
      useProgress.setState({ data: { ...defaultState(), spoilers: false, ceiling: 9 } });
      return (
        <MemoryRouter initialEntries={["/guide/1"]}>
          <Story />
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof RailDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The drawer renders in a portal on the page, outside the story's own element. */
const page = (canvasElement: HTMLElement) => within(canvasElement.ownerDocument.body);
const patient = { timeout: 15_000 };

/** Open: a modal named Chapters, as its menu button is, with the chapters and a button that closes it. */
export const Open: Story = {
  play: async ({ canvasElement, args }) => {
    const body = page(canvasElement);
    const drawer = await body.findByRole("dialog", { name: "Chapters" }, patient);
    await expect(within(drawer).getByRole("navigation", { name: "Walkthrough chapters" })).toBeInTheDocument();
    await userEvent.click(within(drawer).getByRole("button", { name: "Close chapters" }));
    await waitFor(() => expect(args.onOpenChange).toHaveBeenCalledWith(false, expect.anything()), patient);
  },
};
