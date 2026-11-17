import { ArticleRoute } from "@hundo/core/components/ArticleRoute";
import { chapters } from "@hundo/core/guide";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect } from "storybook/test";

// A chapter as prose: a section per group, each step's opening words its checkbox, the list of sections beside it (folded above it up
// to 1000px wide). The second group is shown as a compact list, whose text lines up under each step's words, not its box.
const chapter = { ...chapters[0], groups: [chapters[0].groups[0], { ...chapters[0].groups[1], compact: true }] };
const linked = chapter.groups[0].rows[1];

const meta = {
  title: "Core/ArticleRoute",
  component: ArticleRoute,
  args: { chapter, footer: null },
  decorators: [
    (Story) => {
      useProgress.setState({ data: defaultState() });
      return (
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof ArticleRoute>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A section in prose and a compact one. */
export const ProseAndList: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("article")).toBeVisible();
  },
};

/** A step reached by a link: it stands out, with the accent's bar at its start. */
export const LinkedStep: Story = { args: { target: `entry-${linked.id}` } };

// The grid ArticleRoute draws its parts in, with its column tracks and the gap between them as the browser worked them out.
function layout(article: HTMLElement) {
  const grid = article.parentElement!;
  const style = getComputedStyle(grid);
  const tracks = style.gridTemplateColumns.split(" ").map(parseFloat);
  return { grid, tracks, gap: parseFloat(style.columnGap) };
}

const inWidth = (width: number): Story["decorators"] => [
  (Story) => (
    <div style={{ width }}>
      <Story />
    </div>
  ),
];

/** The article fills its column, whatever the guide's font: no `ch` or other cap on the card, the text in it, the column or the grid, so on a wide page it always meets the contents beside it. */
export const FillsItsColumn: Story = {
  decorators: inWidth(1500),
  play: async ({ canvas }) => {
    const article = canvas.getByRole("article");
    const { grid, tracks, gap } = layout(article);
    // The contents beside the article, which takes a viewport over 1000px wide (the story's default is 1200): one track would be the folded layout.
    await expect(tracks).toHaveLength(2);
    await expect(article.getBoundingClientRect().width).toBeCloseTo(tracks[0], 1);
    await expect(article.querySelector("section")!.getBoundingClientRect().width).toBeCloseTo(tracks[0], 1);
    await expect(tracks.reduce((sum, track) => sum + track, 0) + gap * (tracks.length - 1)).toBeCloseTo(grid.getBoundingClientRect().width, 1);
    await expect(grid.getBoundingClientRect().width).toBeCloseTo(grid.parentElement!.getBoundingClientRect().width, 1);

    // The text fills the card too: a step's paragraph and a compact row's text are as wide as the card's inside.
    const section = article.querySelector("section")!;
    const padding = getComputedStyle(section);
    const inside = section.clientWidth - parseFloat(padding.paddingLeft) - parseFloat(padding.paddingRight);
    const step = article.querySelector(`#entry-${chapter.groups[0].rows[0].id}`)!;
    const row = chapter.groups[1].rows.find((candidate) => candidate.text)!;
    const text = article.querySelector(`#entry-${row.id}`)!.lastElementChild!;
    await expect(step.getBoundingClientRect().width).toBeCloseTo(inside, 1);
    await expect(text.getBoundingClientRect().width).toBeCloseTo(inside, 1);
  },
};

/** Folded above the article on a narrow screen, the contents box and the article are one column wide, however wide that is (a column wider than a cap would show it). */
export const FoldedFillsItsColumn: Story = {
  decorators: inWidth(900),
  globals: { viewport: { value: "phone", isRotated: false } },
  play: async ({ canvas }) => {
    const article = canvas.getByRole("article");
    const { tracks } = layout(article);
    const contents = canvas.getByRole("button", { name: /In this chapter/ }).parentElement!;
    await expect(tracks).toHaveLength(1);
    await expect(article.getBoundingClientRect().width).toBeCloseTo(tracks[0], 1);
    await expect(contents.getBoundingClientRect().width).toBeCloseTo(tracks[0], 1);
  },
};
