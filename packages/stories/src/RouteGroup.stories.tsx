import { RouteGroup } from "@hundo/core/components/RouteGroup";
import { chapters } from "@hundo/core/guide";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import { useUi } from "@hundo/core/store/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect, userEvent, within } from "storybook/test";

// A route group, Base UI's collapsible: its header is a heading holding the button that opens and closes the steps. Closed, the steps
// stay in the page, hidden until found, so the browser's find-in-page can reach them and open the group (which a story can't drive).
const group = chapters[0].groups[0];

const meta = {
  title: "Core/RouteGroup",
  component: RouteGroup,
  args: {
    groupKey: group.key,
    title: group.title,
    location: group.location,
    note: group.note,
    sources: group.sources,
    rows: group.rows,
    open: true,
    highlightedId: "",
    fallbackFocusId: "route-status",
    rememberToggle: false,
  },
  decorators: [
    (Story) => {
      useProgress.setState({ data: { ...defaultState(), spoilers: false, ceiling: 9 } });
      useUi.setState({ openGroups: {} });
      return (
        <MemoryRouter initialEntries={["/guide/1"]}>
          <div style={{ maxWidth: 760 }}>
            <Story />
          </div>
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof RouteGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const header = (canvasElement: HTMLElement) => within(within(canvasElement).getByRole("heading", { level: 3 })).getByRole("button");

/** Open: the note, the bulk check, the sources and the steps. A press on the header closes it. */
export const Open: Story = {
  play: async ({ canvasElement }) => {
    await expect(header(canvasElement)).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(header(canvasElement));
    await expect(header(canvasElement)).toHaveAttribute("aria-expanded", "false");
  },
};

/** Closed: only the header. The steps are still in the page, hidden until found. */
export const Closed: Story = {
  args: { open: false },
  play: async ({ canvasElement }) => {
    await expect(header(canvasElement)).toHaveAttribute("aria-expanded", "false");
    const row = canvasElement.ownerDocument.getElementById(`entry-${group.rows[0].id}`);
    await expect(row?.closest("[hidden]")).toHaveAttribute("hidden", "until-found");
  },
};

/** A click anywhere on a step's row (its label stretches over it) ticks the step's box and tints the row. */
export const TickRow: Story = {
  play: async ({ canvasElement }) => {
    const row = group.rows[0];
    const element = canvasElement.ownerDocument.getElementById(`entry-${row.id}`)!;
    const box = within(element).getByRole("checkbox", { name: row.title });
    await userEvent.click(within(element).getByText(row.title));
    await expect(box).toBeChecked();
    await expect(useProgress.getState().data.checks[row.id]).toBe(true);
    await userEvent.click(box);
    await expect(box).not.toBeChecked();
  },
};

/** On the checklist (`origin`): each step links back to its chapter, and no step has the id a link to it points at, which belongs to the
 * chapter's own page, kept beside the checklist (Pages). */
export const OnTheChecklist: Story = {
  args: { origin: true, groupKey: "index-1", fallbackFocusId: "collection-status" },
  play: async ({ canvasElement }) => {
    const row = group.rows[0];
    await expect(canvasElement.ownerDocument.getElementById(`entry-${row.id}`)).toBeNull();
    await expect(within(canvasElement).getAllByRole("link", { name: new RegExp(`in chapter ${row.chapter}`) })[0]).toHaveAttribute("href", `/guide/${row.chapter}/${row.id}`);
  },
};
