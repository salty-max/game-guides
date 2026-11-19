import { Callout, Empty, HeadedPage, PageHeading } from "@hundo/core/components/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

// The top of a page: its title, the line under it, and the Questlines page's figure in a pill. Then the two notes a page
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

/** The Questlines page's, with its count in a pill under the line. */
export const WithStat: Story = {
  args: { title: "Questlines", intro: "Chained side quests, step by step.", stat: "2 under way · 3 done · 7 not started" },
};

/** The note above the checklist while spoiler protection hides chapters. */
export const SpoilerCallout: Story = {
  render: () => <Callout icon="lock">Showing chapters 1–2 only. Later entries unlock as you reveal chapters.</Callout>,
};

/** What a list says when its filters leave nothing. */
export const EmptyList: Story = {
  render: () => <Empty>Nothing matches. Try changing a filter or search term.</Empty>,
};

/**
 * A page under its heading (HeadedPage): the page keeps the room between the heading and its parts, 20px (14px on a phone), and 12px
 * between the parts, which carry no margin of their own.
 */
export const OnAPage: Story = {
  render: (args) => (
    <HeadedPage {...args}>
      <Callout icon="lock">Showing chapters 1–2 only. Later entries unlock as you reveal chapters.</Callout>
      <Empty>Nothing matches. Try changing a filter or search term.</Empty>
    </HeadedPage>
  ),
  play: async ({ canvas }) => {
    const heading = canvas.getByRole("heading", { level: 1 }).closest("header")!;
    const callout = canvas.getByText(/Showing chapters/).parentElement!;
    const empty = canvas.getByText(/Nothing matches/);
    await expect(callout.getBoundingClientRect().top - heading.getBoundingClientRect().bottom).toBe(20);
    await expect(empty.getBoundingClientRect().top - callout.getBoundingClientRect().bottom).toBe(12);
  },
};

/** On a phone: a compact title, as a large title is (30px, the floor of the title's clamp). */
export const Phone: Story = {
  globals: { viewport: { value: "phone", isRotated: false } },
  play: async ({ canvas }) => {
    const title = canvas.getByRole("heading", { level: 1, name: "Completion checklist" });
    await expect(getComputedStyle(title).fontSize).toBe("30px");
  },
};

/** In a page column of 800px: the title is 6% of the column it lives in (`cqi`), whatever the screen, between 30 and 58px. */
export const InAPageColumn: Story = {
  decorators: [
    (Story) => (
      <div style={{ containerType: "inline-size", width: 800 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas }) => {
    const title = canvas.getByRole("heading", { level: 1, name: "Completion checklist" });
    await expect(parseFloat(getComputedStyle(title).fontSize)).toBeCloseTo(48, 0);
  },
};
