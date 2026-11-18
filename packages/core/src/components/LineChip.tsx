import { cva } from "class-variance-authority";
import { Fragment } from "react";
import { Link } from "react-router";
import { Icon } from "./Icon";
import { pressTextClasses } from "./press-style";
import { linesOf } from "../questlines";
import { useProgress } from "../store/progress";
import type { Row } from "../types";

// A row's small link, as `rowLinkClasses` is, but its words wrap: a long name ("Laurentius of the Great Swamp · step 2") is wider than a small
// phone's line. In a row's column of tags it keeps to the tags' width on a phone, flush right, as a long tag does.
const chip = cva(
  `${pressTextClasses} relative z-1 -mx-0.5 -my-2 px-0.5 py-2 text-13 font-semibold text-primary underline underline-offset-3 [&_svg]:me-1 [&_svg]:inline [&_svg]:size-3.75 [&_svg]:align-[-0.1875rem]`,
  { variants: { at: { prose: "", column: "phone:max-w-21 phone:text-right" } } },
);

/**
 * Where a row stands in its questlines ("Siegmeyer of Catarina · step 3"), each a link to the line's card. Only once a line has two revealed
 * steps or more: a line of one is the row itself, and counting the hidden steps would tell a reader at chapter 1 that Patches comes back.
 * It's drawn only beside a row whose chapter is revealed, and a line keeps to route order, so every step up to this one is revealed too;
 * "of n" is left out, as it would count the hidden ones.
 */
export function LineChips({ row, at }: { row: Row; /** In a line of prose (a space before each), or in a row's column of tags. */ at: "prose" | "column" }) {
  // The last revealed chapter alone, so a tick elsewhere doesn't draw every row's chips again (RouteRow is memoised for that).
  const shownTo = useProgress((s) => (s.data.spoilers ? s.data.ceiling : Infinity));
  const lines = linesOf(row.id).filter((line) => line.rows.filter((step) => step.chapter <= shownTo).length > 1);
  return lines.map((line) => (
    <Fragment key={line.id}>
      {at === "prose" && " "}
      <Link className={chip({ at })} to={`/questlines/${line.id}`}>
        <Icon name="scroll" />
        {line.name} · step {line.steps.indexOf(row.id) + 1}
      </Link>
    </Fragment>
  ));
}
