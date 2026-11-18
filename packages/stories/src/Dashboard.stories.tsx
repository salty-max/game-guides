import { Stat } from "@hundo/core/components/Stats";
import { WhatsLeft } from "@hundo/core/components/WhatsLeft";
import { DashboardPage } from "@hundo/core/pages/DashboardPage";
import { allRows, completion } from "@hundo/core/guide";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect } from "storybook/test";

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

// The Progress page's cards under the overall bar, each found by its title: Koholint's own panel is its deathless run.
const section = (canvas: { getByRole: (role: "heading", options: { name: string }) => HTMLElement }, name: string) =>
  canvas.getByRole("heading", { name }).closest("section")!;
const room = (card: Element) => parseFloat(getComputedStyle(card.parentElement!).rowGap);

/**
 * The page where two columns of 22rem fit: the chapters, the backup and the guide's own panel down the left, what's left down the right.
 * Each column is as tall as its own cards, so the backup sits right under the chapters, however long what's left beside them is.
 */
export const PageSideBySide: Story = {
  render: () => <DashboardPage />,
  decorators: [
    (Story) => (
      <div style={{ width: 900 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas }) => {
    const [chapters, backup, run, left] = ["Chapter progress", "Progress backup", "Deathless run", "What’s left"].map((name) => section(canvas, name));
    const box = (card: Element) => card.getBoundingClientRect();
    await expect(box(left).top).toBe(box(chapters).top);
    await expect(box(left).left).toBeGreaterThan(box(chapters).right);
    await expect(box(backup).left).toBe(box(chapters).left);
    await expect(box(backup).top).toBeCloseTo(box(chapters).bottom + room(backup), 1);
    await expect(box(run).top).toBeCloseTo(box(backup).bottom + room(run), 1);
  },
};

/** Where they don't: one column, in the page as on screen, the chapters, the backup, the guide's own panel, then what's left. */
export const PageOneColumn: Story = {
  render: () => <DashboardPage />,
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas }) => {
    const cards = ["Chapter progress", "Progress backup", "Deathless run", "What’s left"].map((name) => section(canvas, name));
    for (const [before, after] of cards.slice(1).map((card, at) => [cards[at], card])) {
      await expect(before.compareDocumentPosition(after) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      await expect(after.getBoundingClientRect().left).toBe(before.getBoundingClientRect().left);
      await expect(after.getBoundingClientRect().top).toBeGreaterThan(before.getBoundingClientRect().bottom);
    }
  },
};
