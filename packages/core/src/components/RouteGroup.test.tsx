import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { chapters } from "../guide";
import { defaultState } from "../progress-state";
import { useProgress } from "../store/progress";
import { useUi } from "../store/ui";
import { RouteGroup } from "./RouteGroup";
import { allowSlowMounts } from "../test/slow";

allowSlowMounts();

const group = chapters[0].groups[0];

const draw = (open: boolean, rememberToggle: boolean) => (
  <MemoryRouter>
    <RouteGroup
      groupKey={group.key}
      title={group.title}
      rows={group.rows}
      open={open}
      highlightedId=""
      fallbackFocusId="route-status"
      rememberToggle={rememberToggle}
    />
  </MemoryRouter>
);

const header = () => within(screen.getByRole("heading", { level: 3 })).getByRole("button");

beforeEach(() => {
  useProgress.setState({ data: defaultState(), storageError: false });
  useUi.setState({ openGroups: {} });
});

describe("a route group", () => {
  it("is a heading whose button opens and closes the steps, and an unfiltered list remembers it", async () => {
    const user = userEvent.setup();
    render(draw(true, true));
    expect(header()).toHaveAccessibleName(expect.stringContaining(group.title));
    expect(header()).toHaveAttribute("aria-expanded", "true");
    await user.click(header());
    expect(header()).toHaveAttribute("aria-expanded", "false");
    expect(useUi.getState().openGroups[group.key]).toBe(false);
  });

  it("keeps closed steps in the page, hidden until found, so find-in-page reaches them", () => {
    render(draw(false, true));
    const row = document.getElementById(`entry-${group.rows[0].id}`);
    expect(row).not.toBeNull();
    expect(row?.closest("[hidden]")).toHaveAttribute("hidden", "until-found");
  });

  it("can be closed by hand while the list holds it open, without remembering it, until the list asks again", async () => {
    const user = userEvent.setup();
    const { rerender } = render(draw(true, false));
    await user.click(header());
    expect(header()).toHaveAttribute("aria-expanded", "false");
    expect(useUi.getState().openGroups).toEqual({});
    // The list changes its mind (a filter cleared, Expand all): what it asks for wins again.
    rerender(draw(false, false));
    rerender(draw(true, false));
    expect(header()).toHaveAttribute("aria-expanded", "true");
  });
});
