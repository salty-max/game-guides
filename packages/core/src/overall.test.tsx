import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { OverallBar } from "./components/Overall";
import { Rail } from "./components/Rail";
import { allRows, completion, coreRows, overall, overallText, whatsLeft, worth } from "./guide";
import { pct } from "./format";
import { defaultState } from "./progress-state";
import { useProgress } from "./store/progress";
import type { Checks, Row } from "./types";
import { allowSlowMounts } from "./test/slow";

allowSlowMounts();

const tick = (rows: Row[]): Checks => Object.fromEntries(rows.map((row) => [row.id, true]));
const listed = new Set(completion.board.filter((item) => !item.optional).map((item) => item.tag));
const weighted = completion.overall?.percent !== undefined;

// Runs in every guide, against its own config (core's tests run once per app).
describe("the overall figure", () => {
  it("is 0 with nothing ticked, and a whole or tenth-rounded figure from 0 to 100", () => {
    expect(overall({}).percent).toBe(0);
    for (const rows of [allRows.slice(0, Math.floor(allRows.length / 3)), allRows]) {
      const { percent } = overall(tick(rows));
      expect(percent).toBeGreaterThan(0);
      expect(percent).toBeLessThanOrEqual(100);
      // (a whole number, or Red Dead's tenth)
      expect(Math.abs(percent * 10 - Math.round(percent * 10)), String(percent)).toBeLessThan(1e-6);
    }
  });

  it("rounds a share down exactly, never a point under", () => {
    expect(pct(29, 50)).toBe(58);
    expect(pct(57, 100)).toBe(57);
    expect(pct(599, 600)).toBe(99);
    expect(pct(0, 0)).toBe(0);
  });

  describe.runIf(!weighted)("as the guide's completion list", () => {
    it("is 100 with every row ticked, and What's left is empty then", () => {
      expect(overall(tick(allRows)).percent).toBe(100);
      expect(whatsLeft(tick(allRows))).toEqual([]);
    });

    it("is under 100 while any target on the list has a row left, rounded down, and What's left says so", () => {
      for (const tag of listed) {
        // (a row that adds something to it: the quantity category counts by amount)
        const left = allRows.find((row) => row.tags.includes(tag) && worth(row, tag) > 0)!;
        const checks = tick(allRows.filter((row) => row !== left));
        expect(overall(checks).percent, `${tag}: ${left.id}`).toBeLessThan(100);
        expect(whatsLeft(checks).length, tag).toBeGreaterThan(0);
      }
    });

    it("leaves out rows that carry no target on the list (optional targets, route steps)", () => {
      const off = allRows.filter((row) => !row.tags.some((tag) => listed.has(tag)));
      expect(off.length).toBeGreaterThan(0);
      expect(overall(tick(off)).percent).toBe(0);
    });

    it("has no count beside it: the list's total counts amounts and multi-target rows, not entries", () => {
      expect(overall({}).entries).toBeNull();
    });
  });

  describe.runIf(weighted)("as the game's own percentage (Red Dead)", () => {
    it("reads the core rows, counts their entries beside it, and keeps its words", () => {
      const half = coreRows.slice(0, Math.floor(coreRows.length / 2));
      const result = overall(tick(half));
      expect(result.percent).toBe(completion.overall!.percent!(tick(half), coreRows));
      expect(result.entries).toEqual({ done: half.length, total: coreRows.length });
      expect(result.label).toBe(completion.overall!.label);
    });
  });
});

describe("the overall bar", () => {
  it("is a progressbar named by its label and read as the figure shown, never rounded up, with what the hero shows beside it", () => {
    render(<OverallBar percent={99.9} label="estimated in-game completion" entries={null} place="page" />);
    const bar = screen.getByRole("progressbar", { name: "Overall completion" });
    expect(bar).toHaveAttribute("aria-valuenow", "99.9");
    expect(bar).toHaveAttribute("aria-valuetext", "99.9% estimated in-game completion");
    expect(bar).toHaveAttribute("data-nosnippet");
    expect(overallText(99, "complete")).toBe("99% complete");
  });

  it("says a weighted figure's entries in its value text on the Progress page, where they show", () => {
    const { unmount } = render(<OverallBar percent={55.1} label="estimated in-game completion" entries={{ done: 164, total: 274 }} place="page" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "55.1% estimated in-game completion, 164 of 274 entries");
    unmount();
    render(<OverallBar percent={55.1} label="estimated in-game completion" entries={{ done: 164, total: 274 }} place="rail" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "55.1% estimated in-game completion");
  });

  it("shows the entries only where the figure has them", () => {
    const { unmount } = render(<OverallBar percent={41} label="complete" entries={null} place="page" />);
    expect(screen.queryByText(/entries/)).not.toBeInTheDocument();
    unmount();
    render(<OverallBar percent={41} label="estimated in-game completion" entries={{ done: 120, total: 274 }} place="page" />);
    expect(screen.getByText("120 of 274 entries")).toBeInTheDocument();
  });

  it("sits in the rail over the chapters, outside their nav and not a link, with the reader's figure", () => {
    const checks = tick(allRows.slice(0, Math.floor(allRows.length / 2)));
    const { percent, label } = overall(checks);
    expect(percent).toBeGreaterThan(0);
    useProgress.setState({ data: { ...defaultState(), checks }, storageError: false });
    render(
      <MemoryRouter>
        <Rail activeChapter={1} view="guide" />
      </MemoryRouter>,
    );
    const bar = screen.getByRole("progressbar", { name: "Overall completion" });
    expect(bar).toHaveAttribute("aria-valuetext", `${percent}% ${label}`);
    expect(within(screen.getByRole("navigation", { name: "Walkthrough chapters" })).queryByRole("progressbar")).not.toBeInTheDocument();
    expect(bar.closest("a")).toBeNull();
  });
});
