import { Callout, Empty, PageHeading } from "@hundo/core/components/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

// The top of a page: its title, the line under it, and the dashboard's figure in a pill. Then the two notes a page
// can show above or in place of its content: the spoiler callout and the empty list.
const meta = {
  title: "Core/PageHeading",
  component: PageHeading,
  args: { title: "Completion checklist", intro: "Search by name or place. Checks are shared with the walkthrough." },
} satisfies Meta<typeof PageHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The title and its line: the checklist and the progress page. */
export const WithIntro: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1, name: "Completion checklist" })).toBeVisible();
  },
};

/** The dashboard's, with the overall count in a pill under the line. */
export const WithStat: Story = {
  args: { title: "Your progress", intro: "Track completion across the island.", stat: "42 of 310 entries checked · 14%" },
};

/** A hidden chapter's: the title and what revealing it does. */
export const HiddenChapter: Story = { args: { title: "Chapter 3 is hidden", intro: "Revealing it also reveals every chapter before it." } };

/** The note above the checklist while spoiler protection hides chapters. */
export const SpoilerCallout: Story = {
  render: () => <Callout icon="lock">Showing chapters 1–2 only. Later entries unlock as you reveal chapters.</Callout>,
};

/** What a list says when its filters leave nothing. */
export const EmptyList: Story = {
  render: () => <Empty>Nothing matches. Try changing a filter or search term.</Empty>,
};

/** On a phone: a compact title, as a large title is. */
export const Phone: Story = {
  globals: { viewport: { value: "phone", isRotated: false } },
  play: async ({ canvas }) => {
    const title = canvas.getByRole("heading", { level: 1, name: "Completion checklist" });
    await expect(getComputedStyle(title).fontSize).toBe("30px");
  },
};
