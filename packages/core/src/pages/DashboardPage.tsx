import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { Stat } from "../components/Stats";
import { WhatsLeft } from "../components/WhatsLeft";
import { Breadcrumb, Button, PageHeading, Panel, PanelActions, PanelText, PanelTitle, ProgressBar } from "../components/ui";
import { CHAPTER_COUNT, chapterRows, chapters, completion, overallLine, text } from "../guide";
import { two } from "../format";
import { exportProgress } from "../backup";
import { installed, usePersistence } from "../persistence";
import { panels } from "virtual:guide/panels";
import { isOpen, useProgress } from "../store/progress";
import { useUi } from "../store/ui";

export function DashboardPage() {
  const { section } = useParams();
  const data = useProgress((s) => s.data);
  const openDialog = useUi((s) => s.openDialog);
  const persisted = usePersistence((s) => s.persisted);
  const visible = chapters.filter((chapter) => isOpen(data, chapter.id));

  useEffect(() => {
    if (section && panels.some((panel) => panel.id === section)) document.getElementById(section)?.scrollIntoView({ block: "start" });
  }, [section]);

  return (
    <>
      <Breadcrumb current="Progress" />
      <PageHeading title="Your progress" intro={text.dashboardIntro} stat={overallLine(data.checks)} />
      <div className="mb-3.5 grid grid-cols-[1.1fr_1fr] items-start gap-[13px] phone:grid-cols-1">
        <Panel>
          <PanelTitle>Chapter progress</PanelTitle>
          <PanelText>Open a revealed chapter.</PanelText>
          {visible.map((chapter) => {
            const rows = chapterRows(chapter);
            const count = rows.filter((row) => data.checks[row.id] === true).length;
            return (
              <Link key={chapter.id} className="flex items-center gap-[9px] border-b border-line-soft py-[7px] text-[14px] last-of-type:border-b-0" to={`/guide/${chapter.id}`}>
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
        <div className="mt-[13px] grid grid-cols-3 gap-2.5 mid:grid-cols-2">
          {completion.board.map(({ tag, goal }) => (
            <Stat key={tag} tag={tag} goal={goal} />
          ))}
        </div>
      </Panel>
    </>
  );
}
