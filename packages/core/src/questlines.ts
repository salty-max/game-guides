import { allRows, byId, cats, CHAPTER_COUNT, config, primaryTag } from "./guide";
import type { Checks, ProgressState, Questline, Row } from "./types";

/*
 * Questlines: chained side quests, each a line of existing rows in route order (a guide's data/questlines.ts). What a reader sees of one
 * follows spoiler protection the way the rail and the checklist do: a line exists only once its first step's chapter is revealed, only
 * revealed steps show, and nothing says how many are still hidden, or whether there are any.
 */

export interface Line extends Questline {
  rows: Row[];
}

const routeIndex = new Map(allRows.map((row, index) => [row.id, index]));
const firstAt = (line: Questline) => routeIndex.get(line.steps[0]) ?? Infinity;

/** The guide's lines, in the order their first steps come in the route. */
export const lines: Line[] = config.questlines.lines
  .map((line) => ({ ...line, rows: line.steps.map((id) => byId.get(id)).filter((row): row is Row => row !== undefined) }))
  .filter((line) => line.rows.length > 0)
  .sort((a, b) => firstAt(a) - firstAt(b));

const byRow = new Map<string, Line[]>();
for (const line of lines) for (const row of line.rows) byRow.set(row.id, [...(byRow.get(row.id) ?? []), line]);

/** The lines a row is a step of (a row can be in two). */
export const linesOf = (rowId: string): Line[] => byRow.get(rowId) ?? [];
export const lineById = (id: string | undefined) => lines.find((line) => line.id === id);

/** "new": nothing ticked. "going": some ticked, some not. "done": every revealed step ticked. */
export type LineStatus = "new" | "going" | "done";

export interface LineView {
  line: Line;
  /** The revealed steps: always the line's first ones, as a line keeps to route order. */
  shown: Row[];
  done: number;
  /**
   * The first unticked step after the last ticked one, or the first unticked one when the last revealed step is ticked. An earlier unticked
   * step isn't called skipped: some are conditional, and one stray tick shouldn't brand the steps before it.
   */
  next?: Row;
  status: LineStatus;
}

/** What a reader may see of a line, or null while its first step's chapter is hidden: then the line isn't listed or counted at all. */
export function viewLine(line: Line, checks: Checks, open: (chapter: number) => boolean): LineView | null {
  if (!open(line.rows[0].chapter)) return null;
  const shown = line.rows.filter((row) => open(row.chapter));
  const done = shown.filter((row) => checks[row.id] === true).length;
  const last = shown.findLastIndex((row) => checks[row.id] === true);
  const next = shown[last + 1] ?? shown.find((row) => checks[row.id] !== true);
  return { line, shown, done, next, status: done === 0 ? "new" : done === shown.length ? "done" : "going" };
}

/** Whether every chapter is showing: only then may a line say it is complete, since otherwise saying so would tell that it ends here. */
export const allRevealed = (data: Pick<ProgressState, "spoilers" | "ceiling">) => !data.spoilers || data.ceiling >= CHAPTER_COUNT;

/** A line's icon and tone: its first step's category's. */
export const lookOf = (line: Line) => {
  const [, , icon, tone] = cats[primaryTag(line.rows[0])];
  return { icon, tone };
};
