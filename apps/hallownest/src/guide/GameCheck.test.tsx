import { render, screen } from "@testing-library/react";
import { allRows, rowsByTag } from "@hundo/core/guide";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Row } from "@hundo/core/types";
import { GameCheck } from "./GameCheck";

const show = (rows: Row[]) => {
  useProgress.setState({ data: { ...defaultState(), checks: Object.fromEntries(rows.map((row) => [row.id, true])) }, storageError: false });
  return render(<GameCheck />);
};

describe("Check against the game", () => {
  it("says what the save should read, in the game's own terms, and asks for nothing", () => {
    show([]);
    expect(screen.getByRole("heading", { name: "Check against the game" })).toBeInTheDocument();
    expect(screen.getByText("Your save should read 0%.")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("counts a piece of equipment twice and a Mask Shard only as a whole mask", () => {
    const { unmount } = show(rowsByTag("equipment").slice(0, 1));
    expect(screen.getByText("Your save should read 2%.")).toBeInTheDocument();
    unmount();
    show(rowsByTag("mask-shard").slice(0, 3));
    expect(screen.getByText("Your save should read 0%.")).toBeInTheDocument();
  });

  it("names the game's 112% as the save's figure, with the content packs it assumes, and says when all the game counts is in", () => {
    show(allRows);
    expect(screen.getByText("Your save should read 112%: all the game counts.")).toBeInTheDocument();
    expect(screen.getByText(/counts up to 112% with all four free content packs installed/)).toBeInTheDocument();
  });

  it("says it is the game's count and not the bar's, and never shows a bare 112%", () => {
    show(allRows);
    expect(screen.getByText(/That’s the game’s count, not the bar’s/)).toBeInTheDocument();
    for (const element of screen.getAllByText(/112%/)) expect(element.textContent, element.textContent ?? "").toMatch(/save|game/);
  });
});
