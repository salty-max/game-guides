import { Link } from "react-router";
import { CheckBox } from "./CheckBox";
import type { Row } from "../types";
import { pressRow, pressText } from "./press-style";

/** A row's small link ("Jump to", "Chapter 3"), raised above the label that stretches over the row. */
export const rowLink = `${pressText} relative z-1 -mx-0.5 -my-2 px-0.5 py-2 text-13 whitespace-nowrap text-primary underline underline-offset-3`;

interface TickItemProps {
  row: Row;
  /** Makes the box's id unique on the page: one row can sit in two short lists at once. */
  prefix: string;
  ticked: boolean;
  /** The quieter second line. */
  detail: string;
  /** The Jump to link's accessible name. */
  jumpLabel: string;
  onToggle: () => void;
}

/** One step in a short list (Next up, Don't miss): its box, its title over a quieter line, and a link to the step in its chapter. */
export function TickItem({ row, prefix, ticked, detail, jumpLabel, onToggle }: TickItemProps) {
  const id = `${prefix}-${row.id}`;
  return (
    <li className="relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-t border-line-soft py-2.5 first:border-t-0 phone:gap-2.5">
      <CheckBox id={id} labelId={`${id}-label`} row={row} onToggle={onToggle} />
      {/* The label stretches over the whole item, so the item is the tap target; the link sits above it. */}
      <label id={`${id}-label`} className={`${pressRow} grid cursor-pointer gap-0.5 leading-[1.3] after:absolute after:inset-0`} htmlFor={id}>
        <strong className={ticked ? "text-15 text-muted line-through decoration-1" : "text-15"}>{row.title}</strong>
        <small className="text-12 text-muted">{detail}</small>
      </label>
      <Link className={rowLink} to={`/guide/${row.chapter}/${row.id}`} aria-label={jumpLabel}>
        Jump to
      </Link>
    </li>
  );
}
