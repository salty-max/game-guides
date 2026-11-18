import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Stat } from "./components/Stats";
import { WhatsLeft } from "./components/WhatsLeft";
import { cats, checklistOf, completion, whatsLeft } from "./guide";
import { defaultState } from "./progress-state";
import { useProgress } from "./store/progress";
import { allowSlowMounts } from "./test/slow";

allowSlowMounts();

/** Where the board sends a target: the category it names to open, else its own. */
const expected = (tag: string) => `/checklist/${completion.board.find((item) => item.tag === tag)?.opens ?? tag}`;

// Runs in every guide, against its own config (core's tests run once per app). Red Dead's Strangers tile is pinned in its guide.test.ts.
describe("the Progress board's links", () => {
  beforeEach(() => useProgress.setState({ data: defaultState(), storageError: false }));

  it("opens each tile's checklist: its own category, unless the target names another", () => {
    for (const { tag, opens } of completion.board) {
      const { container, unmount } = render(
        <MemoryRouter>
          <Stat tag={tag} />
        </MemoryRouter>,
      );
      expect(container.querySelector("a"), tag).toHaveAttribute("href", opens ? `/checklist/${opens}` : `/checklist/${tag}`);
      unmount();
    }
  });

  it("opens What's left's lines where the board's tile for the same target goes", () => {
    render(
      <MemoryRouter>
        <WhatsLeft />
      </MemoryRouter>,
    );
    const lines = whatsLeft({});
    expect(lines.length).toBeGreaterThan(0);
    const list = within(screen.getByRole("list"));
    for (const { tag } of lines) expect(list.getByRole("link", { name: cats[tag][0] }), tag).toHaveAttribute("href", expected(tag));
  });

  it("opens a line's own category when no board target has its tag", () => {
    expect(checklistOf("not-a-board-target")).toBe("/checklist/not-a-board-target");
  });
});
