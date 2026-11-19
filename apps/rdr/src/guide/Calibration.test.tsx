import { fireEvent, render, screen } from "@testing-library/react";
import { allRows, rowsByTag } from "@hundo/core/guide";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Row } from "@hundo/core/types";
import { Calibration } from "./Calibration";
import { estimate } from "./estimate";

const show = (rows: Row[], reported: number | null = null) => {
  useProgress.setState({ data: { ...defaultState(), checks: Object.fromEntries(rows.map((row) => [row.id, true])), extra: { reported } }, storageError: false });
  return render(<Calibration />);
};

describe("Check against the game", () => {
  it("always shows the estimated in-game completion, labelled as the estimate, and says it isn't the bar's", () => {
    show([]);
    expect(screen.getByRole("heading", { name: "Check against the game" })).toBeInTheDocument();
    expect(screen.getByText("Estimated in-game completion: 0%")).toBeInTheDocument();
    expect(screen.getByText(/It is not the overall bar’s figure/)).toBeInTheDocument();
  });

  it("reads the game's weights over every row, so everything ticked is about 100%", () => {
    show(allRows);
    const shown = estimate(Object.fromEntries(allRows.map((row) => [row.id, true])), allRows);
    expect(shown).toBeGreaterThanOrEqual(99);
    expect(screen.getByText(`Estimated in-game completion: ${shown}%`)).toBeInTheDocument();
  });

  it("gives scraps and optional tasks no credit, though the bar counts them", () => {
    show([...rowsByTag("scrap"), ...rowsByTag("optional")]);
    expect(screen.getByText("Estimated in-game completion: 0%")).toBeInTheDocument();
  });

  it("puts the estimate beside the number typed from the game, and how far apart they are", () => {
    show(rowsByTag("mission").slice(0, 10), 12.5);
    expect(screen.getByRole("status")).toHaveTextContent("Estimate 10% · game 12.5% · the game is 2.5 points ahead.");
  });

  it("takes a typed percentage and refuses what isn't one", () => {
    show([]);
    const field = screen.getByLabelText("In-game completion (%)");
    fireEvent.change(field, { target: { value: "140" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("Enter a number from 0 to 100.")).toBeInTheDocument();
    fireEvent.change(field, { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByRole("status")).toHaveTextContent("Estimate 0% · game 3%");
  });
});
