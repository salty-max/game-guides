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

  it("names the game's 112% as the save's figure, with the content packs it assumes, and says when everything is in", () => {
    show(allRows);
    expect(screen.getByText("Your save should read 112%: everything.")).toBeInTheDocument();
    expect(screen.getByText(/counts up to 112% with all four free content packs installed/)).toBeInTheDocument();
  });
});
