import { Stat } from "@hundo/core/components/Stats";
import { WhatsLeft } from "@hundo/core/components/WhatsLeft";
import { DashboardPage } from "@hundo/core/pages/DashboardPage";
import { allRows, completion } from "@hundo/core/guide";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect, userEvent, within } from "storybook/test";

// The dashboard's two lists of categories: What's left, biggest first with a bar of each one's size, and the board of counts, each card
// opening its category's checklist. A third of the guide is ticked, so the bars and counts are partway.
const ticked = Object.fromEntries(allRows.filter((_, index) => index % 3 === 0).map((row) => [row.id, true as const]));

function Board() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
      {completion.board.map(({ tag, goal }) => (
        <Stat key={tag} tag={tag} goal={goal} />
      ))}
    </div>
  );
}

const meta = {
  title: "Core/Dashboard",
  component: WhatsLeft,
  decorators: [
    (Story) => {
      useProgress.setState({ data: { ...defaultState(), checks: ticked } });
      return (
        <MemoryRouter>
          <div style={{ maxWidth: 900 }}>
            <Story />
          </div>
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof WhatsLeft>;

export default meta;
type Story = StoryObj<typeof meta>;

/** What's left, biggest gap first. */
export const WhatsLeftPartway: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: "What’s left" })).toBeVisible();
  },
};

/** The board: one card per category, its icon in the category's tone. */
export const CategoryBoard: Story = {
  render: () => <Board />,
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("link")).toHaveLength(completion.board.length);
  },
};

/** In a column under 28rem (WhatsLeft's own width, not the screen's), each category's bar goes under its name and figures. */
export const WhatsLeftNarrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector("li")!;
    const [name, bar] = [...row.children].map((part) => part.getBoundingClientRect());
    await expect(getComputedStyle(row).gridTemplateColumns.split(" ")).toHaveLength(2);
    await expect(bar.top).toBeGreaterThanOrEqual(name.bottom);
  },
};

/** In a wide column each category's name, bar and figures share a line. */
export const WhatsLeftWide: Story = {
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector("li")!;
    await expect(getComputedStyle(row).gridTemplateColumns.split(" ")).toHaveLength(3);
  },
};

// The Progress page's parts under the overall bar, each found by its title: Koholint's own panel is its deathless run.
const titles = ["Chapter progress", "Progress backup", "Deathless run", "What’s left", "By category"];
const section = (canvas: { getByRole: (role: "heading", options: { name: string }) => HTMLElement }, name: string) =>
  canvas.getByRole("heading", { name }).closest("section")!;
const room = (card: Element) => parseFloat(getComputedStyle(card.parentElement!).rowGap);
const box = (element: Element) => element.getBoundingClientRect();

// One column whatever its width: each part full width, right under the one before, in the page as on screen, so none leaves a hole.
async function oneColumn(cards: Element[]) {
  for (const [before, after] of cards.slice(1).map((card, at) => [cards[at], card])) {
    await expect(before.compareDocumentPosition(after) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await expect(box(after).left).toBe(box(before).left);
    await expect(box(after).width).toBe(box(before).width);
    await expect(box(after).top).toBeCloseTo(box(before).bottom + room(after), 1);
  }
}

const inWidth = (width: number): Story["decorators"] => [
  (Story) => (
    <div style={{ width }}>
      <Story />
    </div>
  ),
];

/**
 * A page column of 52rem or more: the parts in one column, What's left wide enough for each bar beside its name, and On this page beside
 * them, a link to each part's address, level with the first.
 */
export const PageWithContentsBeside: Story = {
  render: () => <DashboardPage />,
  decorators: inWidth(900),
  play: async ({ canvas }) => {
    const cards = titles.map((name) => section(canvas, name));
    await oneColumn(cards);
    const list = canvas.getByRole("navigation", { name: "On this page" });
    await expect(list).toBeVisible();
    await expect(box(list).left).toBeGreaterThan(box(cards[0]).right);
    await expect(box(list).top).toBeCloseTo(box(cards[0]).top, 0);
    const links = within(list).getAllByRole("link");
    await expect(links.map((link) => link.textContent)).toEqual(titles);
    await expect(links.map((link) => link.getAttribute("href"))).toEqual(cards.map((card) => `/dashboard/${card.id}`));
    const row = cards[3].querySelector("li")!;
    await expect(getComputedStyle(row).gridTemplateColumns.split(" ")).toHaveLength(3);
  },
};

/** Under 52rem, On this page folds away above the parts, which take the whole width; its toggle opens the same links. */
export const PageWithContentsFolded: Story = {
  render: () => <DashboardPage />,
  decorators: inWidth(600),
  play: async ({ canvas }) => {
    const cards = titles.map((name) => section(canvas, name));
    await oneColumn(cards);
    const toggle = canvas.getByRole("button", { name: "On this page" });
    await expect(box(toggle).bottom).toBeLessThan(box(cards[0]).top);
    await expect(box(toggle.parentElement!).width).toBeCloseTo(box(cards[0]).width, 1);
    await userEvent.click(toggle);
    const [list] = canvas.getAllByRole("navigation", { name: "On this page" });
    await expect(within(list).getAllByRole("link").map((link) => link.textContent)).toEqual(titles);
  },
};

/** On a phone's width too: one column in the same order. */
export const PageOnAPhone: Story = {
  render: () => <DashboardPage />,
  decorators: inWidth(360),
  play: async ({ canvas }) => {
    await oneColumn(titles.map((name) => section(canvas, name)));
  },
};
