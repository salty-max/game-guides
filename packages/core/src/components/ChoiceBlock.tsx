import { Fieldset } from "@base-ui/react/fieldset";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { Icon } from "./Icon";
import { lineChip } from "./line-chip-style";
import { byId } from "../guide";
import { useProgress } from "../store/progress";
import type { Choice, Row } from "../types";

// The block's frame. In an article section it's an inset on the page's own colour; in a checklist group it's a band across the group,
// parted from the rows by their own rules, as a row is (a rule above it unless it comes first; the next row's below it).
const frame = cva("flex min-w-0 flex-col bg-paper", {
  variants: { at: { article: "rounded-small border border-choice-line", route: "border-t border-line-soft first:border-t-0" } },
});
const side = cva("", { variants: { at: { article: "px-4 phone:px-3", route: "px-3.5 phone:px-2.5" } } });
const state = cva("rounded-tag px-2 py-1 text-11 font-extrabold tracking-[0.02em] whitespace-nowrap", {
  variants: { done: { false: "bg-amber-bg text-amber-ink", true: "bg-soft text-soft-ink" } },
});
// A caption over a part of the block: the recommended way, then the later ones.
const captionClasses = "text-11 font-extrabold tracking-[0.08em] text-soft-ink uppercase";

interface ChoiceBlockProps {
  choice: Choice;
  /** Unique on the page: the why's id starts with it. */
  idPrefix: string;
  at: "article" | "route";
  /** The way recommended for this playthrough, drawn as its list draws a row. */
  children: ReactNode;
}

/**
 * A one-way choice, as a fieldset named by its legend: its name and why, the way recommended for this playthrough (its row, ticked and
 * counted here), then the other ways, each a row in a later playthrough's chapter, named with its playthrough and linked to where it is.
 * They're ticked there, not here: this playthrough takes one way.
 */
export function ChoiceBlock({ choice, idPrefix, at, children }: ChoiceBlockProps) {
  const done = useProgress((s) => s.data.checks[choice.row] === true);
  const whyId = `${idPrefix}-why`;
  const later = choice.later.flatMap(({ row, on }) => {
    const found = byId.get(row);
    return found ? [{ row: found, on }] : [];
  });
  return (
    <Fieldset.Root className={frame({ at })} aria-describedby={whyId}>
      <div className={`${side({ at })} flex flex-col gap-1 pt-3 pb-2.5`}>
        <div className="flex items-center gap-2">
          <span className="grid size-8 flex-none place-items-center rounded-small bg-amber-bg text-amber-ink [&_svg]:size-4" aria-hidden="true">
            <Icon name="fork" />
          </span>
          <Fieldset.Legend className="min-w-0 flex-1 leading-tight">
            <small className="block text-11 font-extrabold tracking-[0.08em] text-amber-ink uppercase">One-way choice</small>
            <strong className="text-16 font-extrabold">{choice.name}</strong>
          </Fieldset.Legend>
          <span className={state({ done })}>{done ? "Done" : "Decide once"}</span>
        </div>
        <p id={whyId} className="ps-10 text-14/normal text-muted phone:ps-0">
          {choice.why}
        </p>
      </div>
      <p className={`${side({ at })} ${captionClasses} border-t border-line-soft pt-2.5`}>Recommended this playthrough</p>
      {children}
      <p className={`${side({ at })} ${captionClasses} border-t border-line-soft pt-2.5`}>Later playthrough</p>
      {/* A later chapter's titles: kept out of a search result's snippet, as a hidden chapter's teaser is (docs/core.md). */}
      <div data-nosnippet="">
        <ul className={`${side({ at })} m-0 flex list-none flex-col gap-2 pt-2 pb-3`}>
          {later.map(({ row, on }) => (
            <Later key={row.id} row={row} on={on} />
          ))}
        </ul>
      </div>
    </Fieldset.Root>
  );
}

// Another way: a box-sized mark (a tick once it's done in its own chapter), its title linking there, and which playthrough it's on.
function Later({ row, on }: { row: Row; on: string }) {
  const done = useProgress((s) => s.data.checks[row.id] === true);
  return (
    <li className="flex items-start gap-3">
      <span
        className={`grid size-check flex-none place-items-center rounded-check [&_svg]:size-3.5 ${done ? "bg-soft text-soft-ink" : "border-2 border-dashed border-control-line text-muted"}`}
        aria-hidden="true"
      >
        <Icon name={done ? "check" : "right"} />
      </span>
      <span className="grid gap-0.5 leading-[1.3]">
        <Link className="text-15 font-extrabold text-primary underline underline-offset-3" to={`/guide/${row.chapter}/${row.id}`}>
          {row.title}
          {done && <span className="sr-only"> (done)</span>}
        </Link>
        <small className="text-12 text-muted">
          {on} · Chapter {row.chapter}
        </small>
      </span>
    </li>
  );
}

/**
 * Beside a later playthrough's way, in its own chapter: the choice it's the other side of, linked to the block. The choice's chapter comes
 * first, so it's revealed whenever this one is.
 */
export function ChoiceChip({ choice, at }: { choice: Choice; /** In a line of prose (a space before it), after a compact list's step, or in a row's column of tags. */ at: "prose" | "list" | "column" }) {
  const row = byId.get(choice.row);
  if (!row) return null;
  return (
    <>
      {at === "prose" && " "}
      <Link className={lineChip({ at })} to={`/guide/${row.chapter}/${row.id}`}>
        <Icon name="fork" />
        {choice.name} · Chapter {row.chapter}
      </Link>
    </>
  );
}
