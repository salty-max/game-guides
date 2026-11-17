import { useLayoutEffect } from "react";
import { Link, useParams } from "react-router";
import { Stat } from "../components/Stats";
import { WhatsLeft } from "../components/WhatsLeft";
import { Button, PageHeading, Panel, PanelActions, PanelText, PanelTitle, ProgressBar } from "../components/ui";
import { CHAPTER_COUNT, chapterRows, chapters, completion, overallLine, text } from "../guide";
import { two } from "../format";
import { exportProgress } from "../backup";
import { installed, usePersistence } from "../persistence";
import { panels } from "virtual:guide/panels";
import { isOpen, useProgress } from "../store/progress";
import { useUi } from "../store/ui";
import { press } from "../components/press-style";

export function DashboardPage() {
  const { section } = useParams();
  const data = useProgress((s) => s.data);
  const openDialog = useUi((s) => s.openDialog);
  const persisted = usePersistence((s) => s.persisted);
  const visible = chapters.filter((chapter) => isOpen(data, chapter.id));

  // A layout effect, so the panel is in view before the page is shown (Layout); it runs again as a kept page comes back (Pages).
  useLayoutEffect(() => {
    if (section && panels.some((panel) => panel.id === section)) document.getElementById(section)?.scrollIntoView({ block: "start" });
  }, [section]);

  return (
    <>
      <PageHeading title="Your progress" intro={text.dashboardIntro} stat={overallLine(data.checks)} />
      {/* Two columns where both get 22rem, one where they don't, whatever the screen: the chapter list's bars and the backup's buttons need it. */}
      <div className="mb-3.5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,22rem),1fr))] items-start gap-[13px]">
        <Panel>
          <PanelTitle>Chapter progress</PanelTitle>
          <PanelText>Open a revealed chapter.</PanelText>
          {visible.map((chapter) => {
            const rows = chapterRows(chapter);
            const count = rows.filter((row) => data.checks[row.id] === true).length;
            return (
              <Link key={chapter.id} className={`${press} flex items-center gap-[9px] border-b border-line-soft py-[7px] text-[14px] last-of-type:border-b-0`} to={`/guide/${chapter.id}`}>
                <small className="text-[12px] whitespace-nowrap text-muted tabular-nums">{two(chapter.id)}</small>
                <strong className="flex-1">{chapter.title}</strong>
                <div className="min-w-[30px] flex-[0_0_17%]">
                  <ProgressBar done={count} total={rows.length} label={chapter.title} />
                </div>
                <small className="text-[12px] whitespace-nowrap text-muted tabular-nums">
                  {count} / {rows.length}
                </small>
              </Link>
            );
          })}
          {data.spoilers && data.ceiling < CHAPTER_COUNT && <PanelText>{CHAPTER_COUNT - data.ceiling} chapters hidden by spoiler protection.</PanelText>}
        </Panel>
        <div className="grid gap-[13px]">
          <Panel>
            <PanelTitle>Progress backup</PanelTitle>
            <PanelText>Progress lives in this browser. Export a backup to move it to another device or keep a copy.</PanelText>
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
        </div>
      </div>
      <WhatsLeft />
      <Panel>
        <PanelTitle>{text.boardTitle}</PanelTitle>
        <PanelText>{text.boardNote}</PanelText>
        {/* As many columns of at least 14rem as fit, three at most, as the board has always had on a wide screen: wider stats would only spread a figure and a bar further apart. */}
        <div className="mt-[13px] grid grid-cols-[repeat(auto-fill,minmax(min(100%,max(14rem,calc((100%-2*0.625rem)/3))),1fr))] gap-2.5">
          {completion.board.map(({ tag, goal }) => (
            <Stat key={tag} tag={tag} goal={goal} />
          ))}
        </div>
      </Panel>
    </>
  );
}
