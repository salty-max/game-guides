import { MainNav } from "@hundo/core/components/MainNav";
import { Pages } from "@hundo/core/components/Pages";
import { SearchField } from "@hundo/core/components/SearchField";
import { PageHeading } from "@hundo/core/components/ui";
import { forgetPlaces } from "@hundo/core/store/place";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { MemoryRouter, Route, useLocation } from "react-router";
import { expect, userEvent, within } from "storybook/test";

/** A page with something to keep: what's typed in its field. */
function Stand({ title }: { title: string }) {
  const [query, setQuery] = useState("");
  return (
    <>
      <PageHeading title={title} />
      <SearchField id={`${title}-search`} label={`Search ${title}`} placeholder="Type something" value={query} onChange={setQuery} />
    </>
  );
}

function Frame() {
  const view = useLocation().pathname.split("/")[1] || "guide";
  return (
    <>
      <MainNav chapter={1} view={view} place="top" />
      <main>
        <Pages>
          <Route path="/guide/:chapter?" element={<Stand title="Guide" />} />
          <Route path="/checklist" element={<Stand title="Checklist" />} />
          <Route path="/dashboard" element={<Stand title="Progress" />} />
        </Pages>
      </main>
    </>
  );
}

// The pages the reader moves between, kept as they left them: a tab back to a page shows the page that was there (its field still holds
// what was typed), hidden out of sight while another is on screen; a link to it from another page builds it afresh.
const meta = {
  title: "Core/Pages",
  component: Frame,
  beforeEach: () => forgetPlaces(),
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/checklist"]}>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Frame>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A tab to another page and back: the checklist is the same page, with what was typed in it. */
export const KeptBetweenTabs: Story = {
  play: async ({ canvas }) => {
    const nav = within(canvas.getByRole("navigation", { name: "Main navigation" }));
    const field = canvas.getByRole("searchbox", { name: "Search Checklist" });
    await userEvent.type(field, "heart");
    await userEvent.click(nav.getByRole("link", { name: "Progress" }));
    await expect(canvas.getByRole("heading", { name: "Progress" })).toBeVisible();
    await expect(canvas.queryByRole("searchbox", { name: "Search Checklist" })).toBeNull();
    await userEvent.click(nav.getByRole("link", { name: "Checklist" }));
    await expect(canvas.getByRole("searchbox", { name: "Search Checklist" })).toBe(field);
    await expect(field).toHaveValue("heart");
  },
};
