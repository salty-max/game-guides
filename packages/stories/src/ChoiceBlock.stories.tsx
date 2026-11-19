import { ListRow, ProseRow } from "@hundo/core/components/ArticleRoute";
import { ChoiceBlock, ChoiceChip } from "@hundo/core/components/ChoiceBlock";
import { RouteRow } from "@hundo/core/components/RouteGroup";
import { TickItem } from "@hundo/core/components/TickItem";
import { chapters } from "@hundo/core/guide";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Choice } from "@hundo/core/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { expect, userEvent } from "storybook/test";

// A one-way choice: the way recommended for this playthrough (its row, ticked here), and the other ways, each a row in a later
// playthrough's chapter, named and linked. The stories use the guide's real rows: its first, and the last chapter's first as the later way.
const row = chapters[0].groups[0].rows[0];
const later = chapters.at(-1)!.groups[0].rows[0];
const choice: Choice = {
  row: row.id,
  name: "Frampt or Kaathe",
  why: "Whichever serpent takes the Lordvessel, the other leaves for the rest of the cycle.",
  later: [{ row: later.id, on: "NG+" }],
  sources: ["https://a.example/x", "https://b.example/y"],
};

type Kind = "prose" | "list" | "route";
function Block({ kind }: { kind: Kind }) {
  const drawn: Record<Kind, ReactNode> = {
    prose: (
      <div style={{ padding: "0 1rem" }}>
        <ProseRow row={row} inChoice />
      </div>
    ),
    list: (
      <ul style={{ padding: "0 1rem", margin: 0, listStyle: "none" }}>
        <ListRow row={row} inChoice />
      </ul>
    ),
    route: <RouteRow row={row} prefix="story" highlighted={false} fallbackFocusId="story" inChoice />,
  };
  return (
    <ChoiceBlock choice={choice} idPrefix="story" at={kind === "route" ? "route" : "article"}>
      {drawn[kind]}
    </ChoiceBlock>
  );
}

const meta = {
  title: "Core/ChoiceBlock",
  component: Block,
  args: { kind: "prose" },
  decorators: [
    (Story) => {
      useProgress.setState({ data: { ...defaultState(), spoilers: false } });
      return (
        <MemoryRouter>
          <div style={{ maxWidth: 720 }}>
            <Story />
          </div>
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof Block>;

export default meta;
type Story = StoryObj<typeof meta>;

/** In an article's prose, before it's decided: a group named by its legend and described by its why, with one box. */
export const InProse: Story = {
  play: async ({ canvas }) => {
    const block = canvas.getByRole("group", { name: /One-way choice\s*Frampt or Kaathe/ });
    await expect(block).toHaveAccessibleDescription(choice.why);
    await expect(canvas.getAllByRole("checkbox")).toHaveLength(1);
    await expect(canvas.getByRole("link", { name: later.title })).toHaveAttribute("href", `/guide/${later.chapter}/${later.id}`);
  },
};

/** Ticked here, and its later way ticked in its own chapter: the block says Done and the later way carries a tick. */
export const Done: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("checkbox", { name: (name) => name.includes(row.title) }));
    await expect(canvas.getByText("Done")).toBeVisible();
    useProgress.setState({ data: { ...useProgress.getState().data, checks: { [row.id]: true, [later.id]: true } } });
    await expect(await canvas.findByRole("link", { name: (name) => name.endsWith("(done)") })).toBeVisible();
  },
};

/** In a compact list, the row's text lined up under its words. */
export const InList: Story = { args: { kind: "list" } };

/** In a checklist group, a band between the group's rules, the row with its tags beside it. */
export const InRoute: Story = { args: { kind: "route" } };

/** At a phone's width: the why runs under the legend, the full width of the block. */
export const Phone: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 343 }}>
        <Story />
      </div>
    ),
  ],
};

/** The recommended row in a short list (Next up, Don't miss): its One-way tag beside the why. And a later way's link back to its choice. */
export const InShortListAndBack: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
        <TickItem row={row} prefix="story-list" ticked={false} tag="one-way" detail={choice.why} jumpLabel={`Jump to “${row.title}”`} onToggle={() => {}} />
      </ul>
      <p>
        {later.title}.
        <ChoiceChip choice={choice} at="prose" />
      </p>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("One-way")).toBeVisible();
    await expect(canvas.getByRole("link", { name: `Frampt or Kaathe · Chapter ${row.chapter}` })).toHaveAttribute("href", `/guide/${row.chapter}/${row.id}`);
  },
};
