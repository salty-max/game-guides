import { Button as BaseButton } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { Icon } from "./Icon";
import { brand, chapterRows, chapters } from "../guide";
import { pct, two } from "../format";
import { isOpen, useProgress } from "../store/progress";
import { useReveal } from "../useReveal";
import { useUi } from "../store/ui";
import { railHeading, railPanel } from "./rail-style";
import { press, pressPart, pressText } from "./press-style";

// A chapter in the rail: a link to it, or, while spoiler protection hides it, a button that reveals it (and says what it's hidden by).
// A locked one keeps its muted colour when it's hovered; an open one darkens.
const chapterLink = cva(
  `${press} group/chapter grid min-h-12 w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-small border border-transparent bg-transparent p-2 text-left font-sans font-bold no-underline hover:bg-rail-hover aria-[current=page]:border-soft-line aria-[current=page]:text-ink [&_svg]:size-3.5 [&_svg]:text-muted [&[aria-current=page]:not(:hover)]:bg-soft`,
  { variants: { locked: { true: "text-[13px] text-muted", false: "text-[14px] text-inherit hover:text-ink" } } },
);

const number =
  `${pressPart} grid size-7 place-items-center rounded-small border border-soft-line text-[12px] text-muted tabular-nums group-aria-[current=page]/chapter:border-primary group-aria-[current=page]/chapter:bg-primary group-aria-[current=page]/chapter:text-on-primary`;

interface RailProps {
  activeChapter: number;
  view: string;
}

/** The rail beside the page, at 801px and up (Layout); under that it is in the drawer (RailDrawer.tsx). */
export function Rail(props: RailProps) {
  return (
    <aside aria-label="Chapters" className={railPanel({ frame: "column" })}>
      <RailContent {...props} />
    </aside>
  );
}

/** The chapters, the spoiler protection's state and its settings, and the fine print: the rail's content wherever it is. */
export function RailContent({ activeChapter, view, heading }: RailProps & { heading?: ReactNode }) {
  const data = useProgress((s) => s.data);
  const reveal = useReveal();
  const openDialog = useUi((s) => s.openDialog);
  return (
    <>
      <div>
        {heading ?? <div className={railHeading}>Walkthrough</div>}
        <nav className="grid gap-[3px]" aria-label="Walkthrough chapters">
          {chapters.map((chapter) => {
            const n = two(chapter.id);
            if (!isOpen(data, chapter.id)) {
              return (
                <BaseButton key={chapter.id} className={chapterLink({ locked: true })} onClick={() => reveal(chapter.id)}>
                  <span className={number}>{n}</span>
                  {/* A hidden chapter's place name stays out of search snippets (search.ts). */}
                  <span data-nosnippet="">{chapter.teaser ?? `Chapter ${n}`}</span>
                  <Icon name="lock" />
                  <span className="sr-only"> · hidden by spoiler protection. Reveal chapter {chapter.id}</span>
                </BaseButton>
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
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3.5 rounded-card border border-line bg-surface px-2.5 pt-[13px] pb-3">
          <Icon name={data.spoilers ? "lock" : "unlock"} className="mt-0.5 size-[18px] text-primary" />
          <div>
            <strong className="text-[13px]">Spoiler protection {data.spoilers ? "on" : "off"}</strong>
            <p className="mt-0.5 mb-[5px] text-[12px] leading-[1.46] text-muted">{data.spoilers ? `Chapters past ${data.ceiling} are hidden.` : "All chapters are visible."}</p>
            <BaseButton
              className={`${pressText} inline-flex min-h-8 cursor-pointer items-center border-0 bg-transparent px-0 py-1 text-left font-sans text-[12px] font-bold text-primary underline underline-offset-[3px]`}
              onClick={() => openDialog({ kind: "settings" })}
            >
              Change settings
            </BaseButton>
          </div>
        </div>
        <small className="grid gap-0.5 px-1 text-[12px] leading-[1.4] text-pretty text-muted">
          <span>© 2026 Hundo</span>
          <span>Unofficial fan guide, not affiliated with {brand.publisher}.</span>
        </small>
      </div>
    </>
  );
}
