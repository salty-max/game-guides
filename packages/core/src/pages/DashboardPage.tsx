import { useLayoutEffect, useRef } from "react";
import { Link, useLocation, useParams } from "react-router";
import { BuildPanel } from "../components/BuildPanel";
import { Contents } from "../components/Contents";
import { Stat } from "../components/Stats";
import { WhatsLeft } from "../components/WhatsLeft";
import { Overall } from "../components/Overall";
import { Button, HeadedPage, Panel, PanelActions, PanelHead, PanelText, PanelTitle, ProgressBar } from "../components/ui";
import { CHAPTER_COUNT, chapterRows, chapters, completion, hasBuilds, text } from "../guide";
import { dashboardSections, isDashboardSection } from "../dashboard";
import { two } from "../format";
import { exportProgress } from "../backup";
import { installed, usePersistence } from "../persistence";
import { panels } from "virtual:guide/panels";
import { isOpen, useProgress } from "../store/progress";
import { useUi } from "../store/ui";
import { pressClasses } from "../components/press-style";

export function DashboardPage() {
  const { section } = useParams();
  const { key } = useLocation();
  const data = useProgress((s) => s.data);
  const openDialog = useUi((s) => s.openDialog);
  const persisted = usePersistence((s) => s.persisted);
  const visible = chapters.filter((chapter) => isOpen(data, chapter.id));
  const column = useRef<HTMLDivElement>(null);
  const target = isDashboardSection(section) ? section : undefined;
  const links = dashboardSections.map(({ id, title }) => ({ key: id, title, to: `/dashboard/${id}` }));

  // Arrive at the part the address names, its title focused, every time a link to it is followed (its key). Looked up in this page's own
  // column, not the document: a kept page hidden beside it (Pages) can hold the same id, as a chapter's hand-written section keys are ids.
  // A layout effect, so the part is in view before the page is shown (Layout); it runs again as a kept page comes back (Pages), where
  // Layout's own effect, after it, has the last word.
  useLayoutEffect(() => {
    if (!target) return;
    const part = column.current?.querySelector<HTMLElement>(`[id="${target}"]`);
    part?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
    part?.scrollIntoView({ block: "start" });
  }, [target, key]);

  return (
    <HeadedPage title="Your progress" intro={text.dashboardIntro}>
      <Panel>
        <Overall place="page" />
      </Panel>
      {/* One column, every part full width, so none ends beside a longer one and leaves a hole; the list jumps to each (dashboard.ts). */}
      <Contents label="On this page" links={links} current={target}>
        <div ref={column} className="flex min-w-0 flex-col gap-3">
          <Panel id="chapters" aria-labelledby="chapters-title">
            <PanelHead>
              <PanelTitle id="chapters-title">Chapter progress</PanelTitle>
              <PanelText>Open a revealed chapter.</PanelText>
            </PanelHead>
            {/* One list, its rows parted by rules rather than by the panel's room. */}
            <div>
              {visible.map((chapter) => {
                const rows = chapterRows(chapter);
                const count = rows.filter((row) => data.checks[row.id] === true).length;
                return (
                  <Link key={chapter.id} className={`${pressClasses} flex items-center gap-2 border-b border-line-soft py-2 text-14 last-of-type:border-b-0`} to={`/guide/${chapter.id}`}>
                    <small className="text-12 whitespace-nowrap text-muted tabular-nums">{two(chapter.id)}</small>
                    <strong className="flex-1">{chapter.title}</strong>
                    <div className="min-w-7.5 flex-[0_0_17%]">
                      <ProgressBar done={count} total={rows.length} label={chapter.title} />
                    </div>
                    <small className="text-12 whitespace-nowrap text-muted tabular-nums">
                      {count} / {rows.length}
                    </small>
                  </Link>
                );
              })}
            </div>
            {data.spoilers && data.ceiling < CHAPTER_COUNT && <PanelText>{CHAPTER_COUNT - data.ceiling} chapters hidden by spoiler protection.</PanelText>}
          </Panel>
          {hasBuilds && <BuildPanel />}
          <Panel id="backup" aria-labelledby="backup-title">
            <PanelHead>
              <PanelTitle id="backup-title">Progress backup</PanelTitle>
              <PanelText>Progress lives in this browser. Export a backup to move it to another device or keep a copy.</PanelText>
            </PanelHead>
            {persisted === false && (
              <PanelText>
                This browser hasn’t agreed to keep your progress, so it may clear it when space runs low, or in Safari after
                you stay away a while.{" "}
                {installed()
                  ? "Export a backup now and then."
                  : "Export a backup now and then, or add the guide to your home screen and import the backup there."}
              </PanelText>
            )}
            <PanelActions>
              <Button onClick={exportProgress}>Export progress</Button>
              <Button onClick={() => openDialog({ kind: "settings" })}>Import progress</Button>
              <Button onClick={() => openDialog({ kind: "sync" })}>Sync devices</Button>
            </PanelActions>
          </Panel>
          {panels.map(({ id, Component }) => (
            <Component key={id} />
          ))}
          <WhatsLeft />
          <Panel id="categories" aria-labelledby="categories-title">
            <PanelHead>
              <PanelTitle id="categories-title">{text.boardTitle}</PanelTitle>
              <PanelText>{text.boardNote}</PanelText>
            </PanelHead>
            {/* As many columns of at least 14rem as fit, three at most, as the board has always had on a wide screen: wider stats would only spread a figure and a bar further apart. */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,max(14rem,calc((100%-2*0.625rem)/3))),1fr))] gap-2.5">
              {completion.board.map(({ tag, goal }) => (
                <Stat key={tag} tag={tag} goal={goal} />
              ))}
            </div>
          </Panel>
        </div>
      </Contents>
    </HeadedPage>
  );
}
