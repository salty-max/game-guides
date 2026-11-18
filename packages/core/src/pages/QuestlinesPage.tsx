import { Collapsible } from "@base-ui/react/collapsible";
import { cva } from "class-variance-authority";
import { useLayoutEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { CheckBox } from "../components/CheckBox";
import { Icon } from "../components/Icon";
import { rowLinkClasses } from "../components/TickItem";
import { toneClasses } from "../components/tone";
import { pressClasses, pressRowClasses } from "../components/press-style";
import { Callout, ChipGroup, Empty, HeadedPage, ProgressBar, Stacks, Tag } from "../components/ui";
import { config, missableWhy } from "../guide";
import { two } from "../format";
import { allRevealed, lines, lookOf, viewLine, type LineStatus, type LineView } from "../questlines";
import { useKept } from "../store/place";
import { isOpen, useProgress } from "../store/progress";
import type { Row } from "../types";
import { useColumns } from "../useColumns";

const { title, intro } = config.questlines;

type Filter = "all" | LineStatus;
const filters: Filter[] = ["all", "going", "new", "done"];
const isFilter = (value: unknown): value is Filter => filters.includes(value as Filter);

/**
 * The guide's chained side quests, one card per line: its revealed steps in order, the next one to take, and a count of what's ticked.
 * Spoiler protection decides what shows (questlines.ts): a line whose first step is hidden isn't here at all, and while any chapter is
 * hidden every card ends with the same line and none says it's complete, so nothing tells whether a line goes on.
 */
export function QuestlinesPage() {
  const { line: target } = useParams();
  const data = useProgress((s) => s.data);
  const everything = allRevealed(data);
  const views = lines.map((line) => viewLine(line, data.checks, (chapter) => isOpen(data, chapter))).filter((view) => view !== null);
  const targeted = views.some((view) => view.line.id === target) ? target : undefined;
  // A line's own address shows every line, so the line is there to scroll to, whatever filter an earlier visit kept (as ChecklistRoute does).
  const [filter, setFilter] = useKept<Filter>("status", "all", isFilter, !targeted);
  const count = (status: LineStatus) => views.filter((view) => view.status === status).length;
  const doneWord = everything ? "complete" : `done through chapter ${data.ceiling}`;
  const shown = filter === "all" ? views : views.filter((view) => view.status === filter);
  const [columns, grid] = useColumns();

  // Which cards are open, by line. Held here rather than in each card: a card moves between the one list and the two stacks as the page's
  // width changes, and a card that moves is mounted again. Each starts as the page first sees its line, open while it's under way or when
  // the address names it, and after that only the reader opens or closes it, so ticking a card's last step doesn't snap it shut.
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const unseen = views.filter((view) => !Object.hasOwn(open, view.line.id));
  if (unseen.length > 0) setOpen({ ...open, ...Object.fromEntries(unseen.map((view) => [view.line.id, view.status === "going" || view.line.id === targeted])) });

  const stat = [
    count("going") && `${count("going")} under way`,
    count("done") && `${count("done")} ${doneWord}`,
    count("new") && `${count("new")} not started`,
  ]
    .filter(Boolean)
    .join(" · ");

  // A layout effect, so the line is in view before the page is shown (Layout leaves a listed line's address to the page). It waits for the
  // cards to be in their columns (useColumns), but not for a later change in their count (a resize, a scrollbar coming): that would pull
  // the reader back to the line from wherever they had scrolled. A kept page coming back runs it again with the count it had, before
  // useColumns reads the new one; Back and Forward then put the page where it was left (Layout has the last word).
  const laidOut = columns !== undefined;
  useLayoutEffect(() => {
    if (targeted && laidOut) document.getElementById(`line-${targeted}`)?.scrollIntoView({ block: "start" });
  }, [targeted, laidOut]);

  return (
    <HeadedPage title={title} intro={intro} stat={stat || undefined}>
      {!everything && (
        <Callout icon="lock">Showing questlines from chapters 1–{data.ceiling} only. More of them, and later steps, appear as you reveal chapters.</Callout>
      )}
      {views.length === 0 ? (
        <Empty>No questline starts in the chapters you’ve revealed yet.</Empty>
      ) : (
        <>
          <ChipGroup
            label="Questlines by status"
            flow="scroll"
            choices={[
              ["all", `All · ${views.length}`],
              ["going", `Under way · ${count("going")}`],
              ["new", `Not started · ${count("new")}`],
              ["done", `${everything ? "Complete" : "Done so far"} · ${count("done")}`],
            ]}
            value={filter}
            onChange={(next) => setFilter(isFilter(next) ? next : "all")}
          />
          {shown.length === 0 ? (
            <Empty>No questline here yet.</Empty>
          ) : (
            <Stacks ref={grid} columns={columns}>
              {shown.map((view) => (
                <LineCard
                  key={view.line.id}
                  view={view}
                  doneWord={doneWord}
                  hiddenPast={everything ? undefined : data.ceiling}
                  open={open[view.line.id] ?? false}
                  onOpenChange={(next) => setOpen((was) => ({ ...was, [view.line.id]: next }))}
                />
              ))}
            </Stacks>
          )}
        </>
      )}
    </HeadedPage>
  );
}

const tile = cva("grid size-8.5 flex-none place-items-center rounded-small [&_svg]:size-4", { variants: { tone: toneClasses }, defaultVariants: { tone: "none" } });
const caretClasses = "size-4 flex-none text-muted group-data-panel-open/trigger:rotate-180";

interface LineCardProps {
  view: LineView;
  doneWord: string;
  /** The last revealed chapter while spoiler protection hides any. */
  hiddenPast?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** One line: its name and count, which open and close it, then its revealed steps; closed, it shows the step to take next. */
function LineCard({ view, doneWord, hiddenPast, open, onOpenChange }: LineCardProps) {
  const { line, shown, done, next, status } = view;
  const { icon, tone } = lookOf(line);
  const summary = status === "done" ? doneWord[0].toUpperCase() + doneWord.slice(1) : status === "new" ? `Not started · ${shown.length} revealed ${shown.length === 1 ? "step" : "steps"}` : `${done} of ${shown.length} revealed steps`;
  const ahead = next ?? (status === "new" ? shown[0] : undefined);
  return (
    <Collapsible.Root
      open={open}
      onOpenChange={onOpenChange}
      render={<section id={`line-${line.id}`} aria-labelledby={`line-${line.id}-name`} />}
      className="scroll-mt-4 overflow-hidden rounded-card border border-line bg-surface"
    >
      <Collapsible.Trigger className={`${pressClasses} group/trigger grid min-h-12 w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-0 bg-transparent px-4 py-3 text-left font-sans text-inherit phone:px-3`}>
        <span className={tile({ tone })} aria-hidden="true">
          <Icon name={icon} />
        </span>
        <span className="grid gap-1">
          <strong id={`line-${line.id}-name`} className="text-16/tight">
            {line.name}
          </strong>
          <span className="flex items-center gap-2 text-12.5 text-muted">
            {status !== "done" && (
              // The words beside it say the same, and inside the trigger the bar's own name would be said twice over.
              <span className="w-17.5 flex-none" aria-hidden="true">
                <ProgressBar done={done} total={shown.length} label={`${line.name}: ${done} of ${shown.length} revealed steps`} />
              </span>
            )}
            {status === "done" && <Icon name="check" className="size-3.5 flex-none text-ok" />}
            <span className={status === "done" ? "font-bold text-ink" : ""}>{summary}</span>
          </span>
        </span>
        <Icon name="down" className={caretClasses} />
      </Collapsible.Trigger>
      {!open && ahead && (
        <ol className="m-0 list-none border-t border-line-soft p-0">
          <Step line={line.id} row={ahead} prefix="ahead" label={status === "new" ? "Starts with" : "Next"} />
        </ol>
      )}
      <Collapsible.Panel hiddenUntilFound>
        <ol className="m-0 list-none border-t border-line-soft p-0" aria-label={`${line.name}: revealed steps`}>
          {shown.map((row) => (
            <Step key={row.id} line={line.id} row={row} prefix="step" next={row === next} />
          ))}
        </ol>
        {hiddenPast !== undefined && (
          <p className="m-0 flex items-center gap-2 border-t border-line-soft bg-raised px-4 py-2.5 text-12.5 text-muted phone:px-3 [&_svg]:size-3.5">
            <Icon name="lock" />
            Anything past chapter {hiddenPast} stays hidden.
          </p>
        )}
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

const step = cva("relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 border-t border-line-soft px-4 py-2.5 first:border-t-0 phone:gap-2.5 phone:px-3", {
  // The next step: a bar in the accent down its edge, beside its Next tag. Not a tint behind it: the chapter link's colour on the highlight
  // falls short of 4.5:1 in some guides' dark palettes.
  variants: { next: { true: "shadow-[inset_4px_0_0_var(--color-accent)]", false: "" } },
  defaultVariants: { next: false },
});

interface StepProps {
  line: string;
  row: Row;
  /** Keeps the box's id unique: a row can be in two lines, and in a card both as its next step and in its list. */
  prefix: string;
  next?: boolean;
  /** A word over the title: "Next" on a closed card. */
  label?: string;
}

/** A step: its box, its title (and the missable warning it carries), and a link to it in its chapter. */
function Step({ line, row, prefix, next = false, label }: StepProps) {
  const id = `${prefix}-${line}-${row.id}`;
  const why = missableWhy(row.id);
  const checked = useProgress((s) => s.data.checks[row.id] === true);
  return (
    <li className={step({ next })}>
      <CheckBox id={id} labelId={`${id}-label`} row={row} />
      <div className="grid gap-1">
        <label id={`${id}-label`} className={`${pressRowClasses} cursor-pointer leading-[1.3] after:absolute after:inset-0`} htmlFor={id}>
          {label && <small className="mb-0.5 block text-10.5 font-extrabold tracking-widest text-primary uppercase">{label}</small>}
          <strong className={checked ? "text-15 font-semibold text-muted" : "text-15"}>{row.title}</strong>
          {next && (
            <>
              {" "}
              <span className="ml-1 inline-block rounded-tag bg-accent px-2 py-0.5 align-[0.0625rem] text-10.5 font-extrabold tracking-[0.08em] text-on-accent uppercase">Next</span>
            </>
          )}
        </label>
        {why && (
          <p className="m-0 flex items-start gap-2 text-12.5 leading-[1.4] text-muted">
            <Tag tag="missable" />
            <span>{why}</span>
          </p>
        )}
      </div>
      {/* Its name starts with what it shows ("Ch 05"), so a reader who says what they see reaches it. */}
      <Link className={rowLinkClasses} to={`/guide/${row.chapter}/${row.id}`}>
        Ch {two(row.chapter)}
        <span className="sr-only">, {row.title}</span>
      </Link>
    </li>
  );
}
