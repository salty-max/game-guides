import { cva } from "class-variance-authority";
import type { RefObject } from "react";
import { Link } from "react-router";
import { Icon } from "./Icon";
import { brand, chapterRows, chapters } from "../guide";
import { pct, two } from "../format";
import { isOpen, useProgress } from "../store/progress";
import { useReveal } from "../useReveal";
import { useUi } from "../store/ui";

// A chapter in the rail: a link to it, or, while spoiler protection hides it, a button that reveals it (and says what it's hidden by).
// A locked one keeps its muted colour when it's hovered; an open one darkens.
const chapterLink = cva(
  "group/chapter grid min-h-12 w-full grid-cols-[30px_minmax(0,1fr)_17px] items-center gap-2.5 rounded-small border border-transparent bg-transparent p-2 text-left font-bold hover:bg-rail-hover aria-[current=page]:border-soft-line aria-[current=page]:text-ink [&_.svg-icon]:size-3.5 [&_.svg-icon]:text-muted [&[aria-current=page]:not(:hover)]:bg-soft",
  { variants: { locked: { true: "text-[13px] text-muted", false: "text-[14px] text-inherit hover:text-ink" } } },
);

const number =
  "grid size-7 place-items-center rounded-small border border-soft-line text-[12px] text-muted tabular-nums group-aria-[current=page]/chapter:border-primary group-aria-[current=page]/chapter:bg-primary group-aria-[current=page]/chapter:text-on-primary";

interface RailProps {
  id: string;
  /** Under 800px the rail is a drawer, and this is whether it's out. */
  open: boolean;
  activeChapter: number;
  view: string;
  railRef: RefObject<HTMLElement | null>;
}

/** The chapters, the spoiler protection's state and its settings, and the fine print. A column beside the page; a drawer on a phone. */
export function Rail({ id, open, activeChapter, view, railRef }: RailProps) {
  const data = useProgress((s) => s.data);
  const reveal = useReveal();
  const openDialog = useUi((s) => s.openDialog);
  return (
    <aside
      ref={railRef}
      id={id}
      aria-label="Chapters"
      data-open={open ? "" : undefined}
      className="sticky top-(--bar) flex h-[calc(100dvh-var(--bar))] scrollbar-thin [scrollbar-color:var(--edge)_var(--rail)] flex-col gap-[22px] self-start overflow-auto border-r border-line bg-rail pt-[25px] pr-[15px] pb-[calc(16px+var(--safe-bottom))] pl-[calc(15px+var(--safe-left))] text-ink standalone:select-none standalone:[-webkit-touch-callout:none] standalone:not-drawer:relative standalone:not-drawer:top-auto standalone:not-drawer:h-auto standalone:not-drawer:self-stretch drawer:invisible drawer:fixed drawer:bottom-0 drawer:left-0 drawer:z-8 drawer:h-auto drawer:w-[min(var(--rail-col),calc(100%-30px))] drawer:translate-x-[-102%] drawer:self-auto drawer:transition-[transform,visibility] drawer:duration-180 drawer:ease-[ease] drawer:data-open:visible drawer:data-open:translate-x-0"
    >
      <div>
        <div className="mb-2.5 px-[9px] text-[12px] font-extrabold tracking-[0.16em] text-muted uppercase">Walkthrough</div>
        <nav className="grid gap-[3px]" aria-label="Walkthrough chapters">
          {chapters.map((chapter) => {
            const n = two(chapter.id);
            if (!isOpen(data, chapter.id)) {
              return (
                <button key={chapter.id} className={chapterLink({ locked: true })} type="button" onClick={() => reveal(chapter.id)}>
                  <span className={number}>{n}</span>
                  <span>{chapter.teaser ?? `Chapter ${n}`}</span>
                  <Icon name="lock" />
                  <span className="sr-only"> · hidden by spoiler protection. Reveal chapter {chapter.id}</span>
                </button>
              );
            }
            const current = view === "guide" && activeChapter === chapter.id;
            const rows = chapterRows(chapter);
            const done = rows.filter((row) => data.checks[row.id] === true).length;
            const complete = done === rows.length;
            return (
              <Link key={chapter.id} className={chapterLink({ locked: false })} to={`/guide/${chapter.id}`} aria-current={current ? "page" : undefined}>
                <span className={number}>{n}</span>
                <span className="grid gap-px leading-tight">
                  {chapter.title}
                  <small className="text-[12px] font-semibold text-muted">{complete ? "Complete" : `${pct(done, rows.length)}% done`}</small>
                </span>
                <Icon name={complete ? "check" : "right"} />
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto grid gap-[13px] px-0.5">
        <div className="grid grid-cols-[23px_1fr] gap-[9px] rounded-card border border-line bg-surface px-2.5 pt-[13px] pb-3">
          <Icon name={data.spoilers ? "lock" : "unlock"} className="svg-icon mt-0.5 size-[18px] text-primary" />
          <div>
            <strong className="text-[13px]">Spoiler protection {data.spoilers ? "on" : "off"}</strong>
            <p className="mt-0.5 mb-[5px] text-[12px] leading-[1.46] text-muted">{data.spoilers ? `Chapters past ${data.ceiling} are hidden.` : "All chapters are visible."}</p>
            <button
              className="inline-flex min-h-8 items-center border-0 bg-transparent px-0 py-1 text-left text-[12px] font-bold text-primary underline underline-offset-[3px]"
              type="button"
              onClick={() => openDialog({ kind: "settings" })}
            >
              Change settings
            </button>
          </div>
        </div>
        <small className="grid gap-0.5 px-1 text-[12px] leading-[1.4] text-pretty text-muted">
          <span>© 2026 Hundo</span>
          <span>Unofficial fan guide, not affiliated with {brand.publisher}.</span>
        </small>
      </div>
    </aside>
  );
}
