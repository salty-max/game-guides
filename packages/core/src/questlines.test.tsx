import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { chapterRows, chapters } from "./guide";
import { defaultState } from "./progress-state";
import { allRevealed, lineById, lines, linesOf, viewLine } from "./questlines";
import { ArticleRoute } from "./components/ArticleRoute";
import { LineChips } from "./components/LineChip";
import { RouteGroup } from "./components/RouteGroup";
import { QuestlinesPage } from "./pages/QuestlinesPage";
import { forgetPlaces } from "./store/place";
import { useProgress } from "./store/progress";
import { allowSlowMounts } from "./test/slow";
import type { Checks, Row } from "./types";

allowSlowMounts();

// Two lines from the guide's own rows, whatever the guide: one that starts in chapter 1 and runs on into chapters 2 and 3, and one that
// starts in chapter 2, so a reader at chapter 1 has met the first and not the second.
vi.mock("virtual:guide/config", async (importOriginal) => {
  const { default: real } = await importOriginal<typeof import("virtual:guide/config")>();
  const first = (n: number, at = 0) => real.chapters[n - 1].groups.flatMap((group) => group.rows)[at][0];
  return {
    default: {
      ...real,
      questlines: {
        ...real.questlines,
        cover: [],
        lines: [
          { id: "later", name: "Met later", steps: [first(2, 1)] },
          { id: "pair", name: "Met twice", steps: [first(1, 1), first(2, 2)] },
          { id: "early", name: "Met early", steps: [first(1, 0), first(1, 1), first(2, 0), first(3, 0)] },
        ],
      },
    },
  };
});

const row = (n: number, at = 0) => chapterRows(chapters[n - 1])[at];
const [a, b, c, d] = [row(1, 0), row(1, 1), row(2, 0), row(3, 0)];
const early = lineById("early")!;
const ticked = (...ids: string[]): Checks => Object.fromEntries(ids.map((id) => [id, true]));
const upTo = (ceiling: number) => (chapter: number) => chapter <= ceiling;

// How many columns the page's grid lays out. jsdom lays out nothing (useColumns reads one there), so a test sets it; the stories check the
// real count in a browser (Stacks.stories.tsx).
const layout = vi.hoisted(() => ({ columns: 1 as number | undefined }));
vi.mock("./useColumns", () => ({ useColumns: () => [layout.columns, () => undefined] }));

const routes = (path = "/questlines") => (
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/questlines/:line?" element={<QuestlinesPage />} />
    </Routes>
  </MemoryRouter>
);
const page = (path?: string) => render(routes(path));

beforeEach(() => {
  layout.columns = 1;
  forgetPlaces();
  localStorage.clear();
  useProgress.setState({ data: { ...defaultState(), spoilers: true, ceiling: 1 }, storageError: false });
});

describe("questlines (questlines.ts)", () => {
  it("orders lines by where their first steps come in the route, and knows each row's lines", () => {
    expect(lines.map((line) => line.id)).toEqual(["early", "pair", "later"]);
    expect(linesOf(c.id).map((line) => line.id)).toEqual(["early"]);
    expect(linesOf(row(2, 1).id).map((line) => line.id)).toEqual(["later"]);
  });

  it("hides a line whose first step's chapter is hidden, and shows only the revealed steps of the others", () => {
    expect(viewLine(lineById("later")!, {}, upTo(1))).toBeNull();
    expect(viewLine(early, {}, upTo(1))!.shown).toEqual([a, b]);
    expect(viewLine(early, {}, upTo(2))!.shown).toEqual([a, b, c]);
  });

  it("takes the next step after the last ticked one, never holding an earlier unticked one against the reader", () => {
    expect(viewLine(early, {}, upTo(3))).toMatchObject({ status: "new", done: 0, next: a });
    expect(viewLine(early, ticked(a.id), upTo(3))).toMatchObject({ status: "going", done: 1, next: b });
    expect(viewLine(early, ticked(b.id), upTo(3))).toMatchObject({ status: "going", done: 1, next: c });
    // The last revealed step ticked and an earlier one not: still under way, the earlier one next.
    expect(viewLine(early, ticked(b.id), upTo(1))).toMatchObject({ status: "going", done: 1, next: a });
    // Everything revealed up to chapter 1 ticked: done so far, whatever comes later.
    expect(viewLine(early, ticked(a.id, b.id), upTo(1))).toMatchObject({ status: "done", next: undefined });
  });

  it("calls nothing complete while a chapter is hidden", () => {
    expect(allRevealed({ spoilers: true, ceiling: 1 })).toBe(false);
    expect(allRevealed({ spoilers: true, ceiling: chapters.length })).toBe(true);
    expect(allRevealed({ spoilers: false, ceiling: 1 })).toBe(true);
  });
});

describe("QuestlinesPage", () => {
  it("lists only the lines met so far, their revealed steps, and the same closing line on each, with no hidden step's title", () => {
    page();
    expect(screen.getByText("Met early")).toBeVisible();
    expect(screen.queryByText("Met later")).toBeNull();
    expect(document.body.textContent).not.toContain(c.title);
    expect(document.body.textContent).not.toContain(d.title);
    expect(document.body.textContent).not.toContain(row(2, 1).title);
    expect(screen.getByText(/Showing questlines from chapters 1–1 only/)).toBeVisible();
    expect(screen.getAllByText("Anything past chapter 1 stays hidden.")).toHaveLength(2);
  });

  it("says done through the last revealed chapter, never complete, while chapters are hidden", () => {
    useProgress.setState({ data: { ...defaultState(), spoilers: true, ceiling: 1, checks: ticked(a.id, b.id) } });
    page();
    const card = screen.getByRole("region", { name: "Met early" });
    expect(within(card).getByText("Done through chapter 1")).toBeVisible();
    expect(document.body.textContent).not.toMatch(/Complete/);
  });

  it("says complete, and nothing about hidden chapters, once every chapter shows", () => {
    useProgress.setState({ data: { ...defaultState(), spoilers: false, checks: ticked(a.id, b.id, c.id, d.id) } });
    page();
    expect(within(screen.getByRole("region", { name: "Met early" })).getByText("Complete")).toBeVisible();
    expect(screen.queryByText(/stays hidden/)).toBeNull();
    expect(screen.queryByText(/Showing questlines/)).toBeNull();
  });

  it("opens a line under way, marks its next step, and ticks a step as the guide does", async () => {
    useProgress.setState({ data: { ...defaultState(), spoilers: false, checks: ticked(a.id) } });
    page();
    const card = screen.getByRole("region", { name: "Met early" });
    const steps = within(card).getByRole("list", { name: "Met early: revealed steps" });
    expect(within(steps).getAllByRole("listitem")).toHaveLength(4);
    expect(within(steps).getByText("Next")).toBeVisible();
    await userEvent.click(within(steps).getByRole("checkbox", { name: new RegExp(b.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }));
    expect(useProgress.getState().data.checks[b.id]).toBe(true);
    expect(within(steps).getByRole("link", { name: `Ch 02, ${c.title}` })).toHaveAttribute("href", `/guide/2/${c.id}`);
  });

  it("shows a closed line's first step, and filters by status", async () => {
    useProgress.setState({ data: { ...defaultState(), spoilers: false } });
    page();
    expect(screen.getAllByText("Starts with")).toHaveLength(3);
    await userEvent.click(screen.getByRole("button", { name: /Under way/ }));
    expect(screen.queryByText("Met early")).toBeNull();
    expect(screen.getByText("No questline here yet.")).toBeVisible();
  });

  // The three lines' cards in route order (Met early's first step is chapter 1's first row, Met twice's its second, Met later's in chapter 2).
  const cards = () => ["Met early", "Met twice", "Met later"].map((name) => screen.getByRole("region", { name }));
  const trigger = (name: string) => within(screen.getByRole("region", { name })).getByRole("button");

  it("puts the first and third lines down the left and the second down the right, where two columns fit", () => {
    layout.columns = 2;
    useProgress.setState({ data: { ...defaultState(), spoilers: false } });
    page();
    const [first, second, third] = cards();
    const [left, right] = [first.parentElement!, second.parentElement!];
    expect([...left.children]).toEqual([first, third]);
    expect([...right.children]).toEqual([second]);
    expect(left.nextElementSibling).toBe(right);
  });

  it("is one list in route order, in the page as on screen, where they don't", () => {
    useProgress.setState({ data: { ...defaultState(), spoilers: false } });
    page();
    const [first, second, third] = cards();
    expect([...first.parentElement!.children]).toEqual([first, second, third]);
    expect(first.parentElement!.parentElement!.children).toHaveLength(1);
  });

  it("keeps each card open or closed as the page goes to two columns and back, and as its line moves on", async () => {
    useProgress.setState({ data: { ...defaultState(), spoilers: false, checks: ticked(a.id) } });
    const { rerender } = page();
    // Met early is under way, so it opens; the others haven't started. The reader opens Met twice, which moves to the other stack and back.
    expect(trigger("Met early")).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(trigger("Met twice"));
    layout.columns = 2;
    rerender(routes());
    expect(cards()[1].parentElement).not.toBe(cards()[0].parentElement);
    expect(trigger("Met twice")).toHaveAttribute("aria-expanded", "true");
    layout.columns = 1;
    rerender(routes());
    expect(trigger("Met twice")).toHaveAttribute("aria-expanded", "true");
    expect(trigger("Met later")).toHaveAttribute("aria-expanded", "false");
    // Met early's last steps ticked: done now, and a done line starts closed, but this one stays as the reader had it.
    act(() => useProgress.setState({ data: { ...defaultState(), spoilers: false, checks: ticked(a.id, b.id, c.id, d.id) } }));
    expect(within(screen.getByRole("region", { name: "Met early" })).getByText("Complete")).toBeVisible();
    expect(trigger("Met early")).toHaveAttribute("aria-expanded", "true");
  });

  it("scrolls to the line its address names once the cards are in their columns, and leaves the reader be when the count changes", () => {
    const scrolled = vi.spyOn(Element.prototype, "scrollIntoView");
    layout.columns = undefined;
    useProgress.setState({ data: { ...defaultState(), spoilers: false } });
    const { rerender } = page("/questlines/pair");
    expect(scrolled).not.toHaveBeenCalled();
    layout.columns = 2;
    rerender(routes("/questlines/pair"));
    expect(scrolled).toHaveBeenCalledTimes(1);
    expect(scrolled.mock.contexts[0]).toBe(screen.getByRole("region", { name: "Met twice" }));
    layout.columns = 1;
    rerender(routes("/questlines/pair"));
    expect(scrolled).toHaveBeenCalledTimes(1);
    scrolled.mockRestore();
  });
});

describe("LineChips", () => {
  const chips = (target: Row, ceiling: number) => {
    useProgress.setState({ data: { ...defaultState(), spoilers: true, ceiling } });
    const { unmount } = render(
      <MemoryRouter>
        <LineChips row={target} at="prose" />
      </MemoryRouter>,
    );
    const links = screen.queryAllByRole("link").map((link) => [link.textContent, link.getAttribute("href")]);
    unmount();
    return links;
  };

  it("says which step of each of its lines a row is, without the count, and links to the line's card", () => {
    expect(chips(c, 2)).toEqual([["Met early · step 3", "/questlines/early"]]);
  });

  it("draws nothing for a line until two of its steps are revealed, so it never tells that the line goes on", () => {
    // b is step 2 of the early line (a and b revealed) and step 1 of the pair, whose second step is in chapter 2.
    expect(chips(b, 1)).toEqual([["Met early · step 2", "/questlines/early"]]);
    expect(chips(b, 2)).toEqual([
      ["Met early · step 2", "/questlines/early"],
      ["Met twice · step 1", "/questlines/pair"],
    ]);
  });

  it("draws nothing for a line of one step, which is the row itself", () => {
    expect(chips(row(2, 1), chapters.length)).toEqual([]);
  });

  it("sits in a chapter's prose after the row's words, and in a route group's column, but not on the checklist, where the row links to its chapter", () => {
    useProgress.setState({ data: { ...defaultState(), spoilers: false } });
    const group = chapters[0].groups.find((each) => each.rows.includes(b))!;
    const { unmount } = render(
      <MemoryRouter>
        <ArticleRoute chapter={chapters[0]} footer={null} />
      </MemoryRouter>,
    );
    const entry = document.getElementById(`entry-${b.id}`)!;
    expect(within(entry).getByRole("link", { name: "Met twice · step 1" })).toBeVisible();
    expect(entry.textContent).not.toMatch(/\SMet early/);
    unmount();
    const route = (origin: boolean) =>
      render(
        <MemoryRouter>
          <RouteGroup groupKey={group.key} title={group.title} rows={group.rows} open highlightedId="" origin={origin} fallbackFocusId="x" rememberToggle={false} />
        </MemoryRouter>,
      );
    const guide = route(false);
    expect(screen.getAllByRole("link", { name: /^Met early · step / })).toHaveLength(2);
    guide.unmount();
    route(true);
    expect(screen.queryByRole("link", { name: /· step/ })).toBeNull();
  });
});
