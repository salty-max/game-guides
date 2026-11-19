import { ListRow, ProseRow } from "@hundo/core/components/ArticleRoute";
import { RouteRow } from "@hundo/core/components/RouteGroup";
import { TickItem } from "@hundo/core/components/TickItem";
import { byId } from "@hundo/core/guide";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Row } from "@hundo/core/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect } from "storybook/test";

// A row's link to its questline ("The trading quest · step 2"), drawn beside the row's words: in a line of prose, wrapped under a compact list's
// step, or in the checklist row's column of tags. It is a small link with a bigger tap area than its words, and that area must stay clear of the
// row's own box and of every other link: WCAG 2.2's target size (24px, or room around it) is what the stories' axe run holds it to. axe leaves
// that rule off unless asked, so these stories ask (Lighthouse asks too).
// The stories use Koholint's trading quest: its first steps are all in chapter 1.
const rows = ["trade-yoshi", "trade-ribbon", "trade-food"].map((id) => byId.get(id)!);
// The same steps with a map each: a second small link beside the chip, so the two can meet.
const mapped = rows.map((row): Row => ({ ...row, map: ["Nintendo Life", "https://www.nintendolife.com/guides/zelda-links-awakening-all-heart-pieces-map-and-locations"] }));

const targetSize = { a11y: { test: "error", config: { rules: [{ id: "target-size", enabled: true }] } } } as const;

interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/** How far two boxes run into each other: 0 when they only touch or are apart. */
const overlap = (a: Rect, b: Rect) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

/** Every box a link's or a box's tap area covers (an inline link that wraps has one for each line). */
const boxes = (element: Element): Rect[] => [...element.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0);

/**
 * Every pair of the page's tap targets (links and the rows' boxes) whose areas overlap. Each is named by what it says, and the overlap by its
 * size, so a failure reads as "box of Yoshi Doll runs 6px into The trading quest · step 1".
 */
function overlaps(canvasElement: HTMLElement) {
  const named = (element: HTMLElement) => {
    const labelledby = element.getAttribute("aria-labelledby");
    return element.getAttribute("aria-label") ?? (labelledby && document.getElementById(labelledby)?.textContent?.trim()) ?? element.textContent?.trim() ?? "";
  };
  const targets = [...canvasElement.querySelectorAll<HTMLElement>("a[href], [role=checkbox]")].map((element) => ({ name: named(element), element }));
  const found: string[] = [];
  for (const [index, one] of targets.entries()) {
    for (const other of targets.slice(index + 1)) {
      const area = boxes(one.element).flatMap((a) => boxes(other.element).map((b) => overlap(a, b))).reduce((sum, next) => sum + next, 0);
      if (area > 0.5) found.push(`${one.name} runs into ${other.name} (${area.toFixed(0)}px²)`);
    }
  }
  return found;
}

const inWidth = (width: number): Story["decorators"] => [
  (Story) => (
    <div style={{ width }}>
      <Story />
    </div>
  ),
];

type Kind = "list" | "prose" | "route" | "origin" | "tick";

/** The steps as the page holds them: a list's rows are one list, a chapter's paragraphs one flex column with the section's gap (ArticleRoute's Section). */
function Rows({ kind, withMap = false }: { kind: Kind; withMap?: boolean }) {
  const checks = useProgress((s) => s.data.checks);
  const shown = withMap ? mapped : rows;
  switch (kind) {
    case "list":
      return (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {shown.map((row) => (
            <ListRow key={row.id} row={row} />
          ))}
        </ul>
      );
    case "prose":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {shown.map((row) => (
            <ProseRow key={row.id} row={row} />
          ))}
        </div>
      );
    case "route":
    case "origin":
      return (
        <div>
          {shown.map((row) => (
            <RouteRow key={row.id} row={row} prefix="story" highlighted={false} origin={kind === "origin"} fallbackFocusId="story" />
          ))}
        </div>
      );
    case "tick":
      return (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {shown.map((row) => (
            <TickItem key={row.id} row={row} prefix="story" ticked={checks[row.id] === true} detail={row.group} jumpLabel={`Jump to “${row.title}”`} onToggle={() => undefined} />
          ))}
        </ul>
      );
  }
}

const meta = {
  title: "Core/LineChip",
  component: Rows,
  args: { kind: "list" },
  parameters: targetSize,
  decorators: [
    (Story) => {
      useProgress.setState({ data: { ...defaultState(), spoilers: false } });
      return (
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof Rows>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Steps of a compact list, the chip on the step's line while it fits. */
export const CompactList: Story = {
  decorators: inWidth(720),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole("link", { name: /step \d/ })).toHaveLength(rows.length);
    await expect(overlaps(canvasElement)).toEqual([]);
  },
};

/** The same steps on a small phone's line: the chip wraps under the step's box, and its tap area keeps clear of it. */
export const CompactListWrapped: Story = {
  decorators: inWidth(260),
  play: async ({ canvas, canvasElement }) => {
    const chip = canvas.getAllByRole("link", { name: /step \d/ })[0];
    const box = canvas.getAllByRole("checkbox")[0];
    // (the chip is under the box, or the story shows nothing)
    await expect(chip.getBoundingClientRect().top).toBeGreaterThan(box.getBoundingClientRect().bottom - 8);
    await expect(chip.getBoundingClientRect().height).toBeGreaterThanOrEqual(24 - 0.5);
    await expect(overlaps(canvasElement)).toEqual([]);
  },
};

/** With a map link too: it wraps under the step with the chip, and the two keep clear of each other as well as of the box. */
export const CompactListWithMap: Story = {
  args: { withMap: true },
  decorators: inWidth(260),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole("link", { name: /^Map for / })).toHaveLength(rows.length);
    await expect(canvas.getAllByRole("link", { name: /step \d/ })).toHaveLength(rows.length);
    await expect(overlaps(canvasElement)).toEqual([]);
  },
};

/** A step in prose: the chip is a link inside the sentence. */
export const InProse: Story = {
  args: { kind: "prose" },
  decorators: inWidth(300),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole("link", { name: /step \d/ })).toHaveLength(rows.length);
    await expect(overlaps(canvasElement)).toEqual([]);
  },
};

/** The checklist's row with a map link and the chip: both in the column of tags, one under the other. */
export const InChecklistRowWithMap: Story = {
  args: { kind: "route", withMap: true },
  decorators: inWidth(375),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole("link", { name: /^Map for / })).toHaveLength(rows.length);
    await expect(canvas.getAllByRole("link", { name: /step \d/ })).toHaveLength(rows.length);
    await expect(overlaps(canvasElement)).toEqual([]);
  },
};

/** A step in prose with a map link inline too: the link is a 24px box, and the lines still keep the paragraph's 1.8 pitch (a taller inline box would stretch one). */
export const InProseWithMap: Story = {
  args: { kind: "prose", withMap: true },
  decorators: inWidth(420),
  play: async ({ canvas, canvasElement }) => {
    const maps = canvas.getAllByRole("link", { name: /^Map for / });
    await expect(maps).toHaveLength(rows.length);
    for (const map of maps) {
      const paragraph = map.closest("p")!;
      const pitch = parseFloat(getComputedStyle(paragraph).lineHeight);
      const lines = paragraph.getBoundingClientRect().height / pitch;
      // (a whole number of lines: a line that grew would leave a fraction)
      await expect(Math.abs(lines - Math.round(lines))).toBeLessThan(0.02);
      await expect(map.getBoundingClientRect().height).toBeGreaterThanOrEqual(24 - 0.5);
    }
    await expect(overlaps(canvasElement)).toEqual([]);
  },
};

/** The checklist page's row, which links back to its chapter: that link alone in the column, under the tag. */
export const ChecklistPageRow: Story = {
  args: { kind: "origin" },
  decorators: inWidth(375),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole("link", { name: /^Open / })).toHaveLength(rows.length);
    await expect(overlaps(canvasElement)).toEqual([]);
  },
};

/** A step in a short list (Next up): the Jump to link at the end of its two lines. */
export const InShortList: Story = {
  args: { kind: "tick" },
  decorators: inWidth(375),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole("link", { name: /^Jump to / })).toHaveLength(rows.length);
    await expect(overlaps(canvasElement)).toEqual([]);
  },
};

/** The checklist's row: the chip in the column of tags at its end. */
export const InChecklistRow: Story = {
  args: { kind: "route" },
  decorators: inWidth(375),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole("link", { name: /step \d/ })).toHaveLength(rows.length);
    await expect(overlaps(canvasElement)).toEqual([]);
  },
};
