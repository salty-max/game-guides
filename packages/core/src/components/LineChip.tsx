import { Fragment } from "react";
import { Link } from "react-router";
import { Icon } from "./Icon";
import { lineChip } from "./line-chip-style";
import { linesOf } from "../questlines";
import { useProgress } from "../store/progress";
import type { Row } from "../types";

/**
 * Where a row stands in its questlines ("Siegmeyer of Catarina · step 3"), each a link to the line's card. Only once a line has two revealed
 * steps or more: a line of one is the row itself, and counting the hidden steps would tell a reader at chapter 1 that Patches comes back.
 * It's drawn only beside a row whose chapter is revealed, and a line keeps to route order, so every step up to this one is revealed too;
 * "of n" is left out, as it would count the hidden ones.
 */
export function LineChips({ row, at }: { row: Row; /** In a line of prose (a space before each), after a compact list's step (it wraps under the step's box), or in a row's column of tags. */ at: "prose" | "list" | "column" }) {
  // The last revealed chapter alone, so a tick elsewhere doesn't draw every row's chips again (RouteRow is memoised for that).
  const shownTo = useProgress((s) => (s.data.spoilers ? s.data.ceiling : Infinity));
  const lines = linesOf(row.id).filter((line) => line.rows.filter((step) => step.chapter <= shownTo).length > 1);
  return lines.map((line) => (
    <Fragment key={line.id}>
      {at === "prose" && " "}
      <Link className={lineChip({ at })} to={`/questlines/${line.id}`}>
        <Icon name="scroll" />
        {line.name} · step {line.steps.indexOf(row.id) + 1}
      </Link>
    </Fragment>
  ));
}
