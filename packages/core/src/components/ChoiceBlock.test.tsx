import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { ArticleRoute } from "./ArticleRoute";
import { MissablesStrip } from "./MissablesStrip";
import { NextUp } from "./NextUp";
import { RouteGroup } from "./RouteGroup";
import { byId, chapters, choiceAt, choiceOf, tagName } from "../guide";
import { defaultState } from "../progress-state";
import { useProgress } from "../store/progress";
import { allowSlowMounts } from "../test/slow";

allowSlowMounts();

// A choice at the guide's first row, whatever the guide, with its later way at the last chapter's first row, so every guide draws it.
// No missables, so "Don't miss" holds the choice alone, and a chapter without one says the guide's reassurance.
vi.mock("virtual:guide/config", async (importOriginal) => {
  const { default: real } = await importOriginal<typeof import("virtual:guide/config")>();
  const row = real.chapters[0].groups[0].rows[0][0];
  const later = real.chapters.at(-1)!.groups[0].rows[0][0];
  return {
    default: {
      ...real,
      missables: [],
      reassurance: { text: "Test reassurance.", sources: [["First source", "https://a.example/x"], ["Second source", "https://b.example/y"]] },
      choices: [{ row, name: "Test choice", why: "Test reason it is one-way.", later: [{ row: later, on: "A second save" }], sources: ["https://a.example/x", "https://b.example/y"] }],
    },
  };
});

const first = chapters[0];
const last = chapters.at(-1)!;
const row = first.groups[0].rows[0];
const later = last.groups[0].rows[0];
const within_ = (node: React.ReactNode) => render(<MemoryRouter>{node}</MemoryRouter>);

beforeEach(() => {
  localStorage.clear();
  useProgress.setState({ data: { ...defaultState(), spoilers: false }, storageError: false });
});

describe("a one-way choice", () => {
  it("is known by its recommended row and its later way, and tags only the recommended one", () => {
    expect(choiceOf(row.id)?.name).toBe("Test choice");
    expect(choiceAt(later.id)?.name).toBe("Test choice");
    expect(byId.get(row.id)?.tags).toContain("one-way");
    expect(byId.get(later.id)?.tags).not.toContain("one-way");
    expect(tagName("one-way")).toBe("One-way");
  });

  for (const layout of ["article", "route"] as const) {
    it(`draws a group named by its legend and described by its why, in the ${layout} layout`, async () => {
      const user = userEvent.setup();
      within_(
        layout === "article" ? (
          <ArticleRoute chapter={first} footer={null} />
        ) : (
          <RouteGroup groupKey="g" title="Group" rows={first.groups[0].rows} open highlightedId="" fallbackFocusId="x" rememberToggle={false} />
        ),
      );
      const block = screen.getByRole("group", { name: /One-way choice\s*Test choice/ });
      expect(block).toHaveAccessibleDescription("Test reason it is one-way.");
      expect(within(block).getByText("Recommended this playthrough")).toBeInTheDocument();
      expect(within(block).getByText("Decide once")).toBeInTheDocument();
      // Inside its block the row carries no One-way tag: the block says it.
      expect(within(block).queryByText("One-way")).not.toBeInTheDocument();
      // The later way: named, linked to its place, with its playthrough and chapter, and no box of its own here.
      const link = within(block).getByRole("link", { name: later.title });
      expect(link).toHaveAttribute("href", `/guide/${last.id}/${later.id}`);
      expect(within(block).getByText(`A second save · Chapter ${last.id}`)).toBeInTheDocument();
      expect(within(block).getAllByRole("checkbox")).toHaveLength(1);

      await user.click(within(block).getByRole("checkbox", { name: (name) => name.includes(row.title) }));
      expect(useProgress.getState().data.checks[row.id]).toBe(true);
      expect(within(block).getByText("Done")).toBeInTheDocument();
    });
  }

  it("marks the later way done once it's ticked in its own chapter", () => {
    useProgress.setState({ data: { ...defaultState(), spoilers: false, checks: { [later.id]: true } } });
    within_(<ArticleRoute chapter={first} footer={null} />);
    const block = screen.getByRole("group", { name: /Test choice/ });
    expect(within(block).getByRole("link", { name: (name) => name.startsWith(later.title) && name.endsWith("(done)") })).toBeInTheDocument();
  });

  it("links the later way back to its choice, in its own chapter", () => {
    within_(<ArticleRoute chapter={last} footer={null} />);
    const back = screen.getByRole("link", { name: `Test choice · Chapter ${first.id}` });
    expect(back).toHaveAttribute("href", `/guide/${first.id}/${row.id}`);
  });

  it("is listed in Don't miss with its why until the recommended row is ticked", () => {
    within_(<MissablesStrip chapter={first} />);
    const region = screen.getByRole("complementary", { name: "Missable entries" });
    expect(within(region).getByText("Test reason it is one-way.")).toBeInTheDocument();
    expect(within(region).getByText("One-way")).toBeInTheDocument();
    expect(within(region).getByText("1 left")).toBeInTheDocument();
  });

  it("leaves a chapter with nothing to list to the guide's reassurance, while no missable is flagged", () => {
    within_(<MissablesStrip chapter={last} />);
    const region = screen.getByRole("complementary", { name: "Missable entries" });
    expect(within(region).getByText(/Nothing is flagged as permanently missable/)).toBeInTheDocument();
  });

  it("carries its tag and why in Next up when it's next", () => {
    within_(<NextUp chapter={first.id} />);
    const item = screen.getByRole("checkbox", { name: (name) => name.includes(row.title) }).closest("li")!;
    expect(within(item).getByText("One-way")).toBeInTheDocument();
    expect(within(item).getByText(/Test reason it is one-way\./)).toBeInTheDocument();
  });
});
