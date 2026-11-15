import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { Stat } from "../components/Stats";
import { Breadcrumb, Button, PageHeading, Panel, PanelActions, PanelText, PanelTitle, ProgressBar } from "../components/ui";
import { CHAPTER_COUNT, cats, chapterRows, chapters, completion, overallLine, text, whatsLeft } from "../guide";
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
      <PageHeading title="Your progress">
        <p>{text.dashboardIntro}</p>
        <span className="inline-stat">{overallLine(data.checks)}</span>
      </PageHeading>
      <div className="dashboard-grid">
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
        <div className="dashboard-side">
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
        <div className="category-board mt-[13px]">
          {completion.board.map(({ tag, goal }) => (
            <Stat key={tag} tag={tag} goal={goal} />
          ))}
        </div>
      </Panel>
    </>
  );
}

const points = (value: number) => (Math.round(value * 10) / 10).toFixed(1);

function WhatsLeft() {
  const checks = useProgress((s) => s.data.checks);
  const items = whatsLeft(checks);
  const max = Math.max(...items.map((item) => item.total), 1);
  const inPoints = completion.unit === "points";
  const figure = inPoints ? points : String;
  return (
    <Panel space="below" aria-labelledby="whats-left-title">
      <PanelTitle id="whats-left-title">What’s left</PanelTitle>
      {items.length ? (
        <div className="whats-left">
          <PanelText>
            {inPoints
              ? `About ${points(items.reduce((sum, item) => sum + item.left, 0))} points to go. Biggest remaining first, using the estimate’s weights.`
              : "Biggest gaps first."}
          </PanelText>
          <ul>
            {items.map((item) => (
              <li key={item.tag}>
                <Link className="wl-name" to={`/checklist/${item.tag}`}>
                  {cats[item.tag][0]}
                </Link>
                <span className="wl-bar" aria-hidden="true">
                  <span className="wl-total" style={{ width: `${(item.total / max) * 100}%` }}>
                    <span style={{ width: `${((item.total - item.left) / item.total) * 100}%` }} />
                  </span>
                </span>
                <span className="wl-pts">
                  {figure(item.left)} <small>of {figure(item.total)} {inPoints ? "pts " : ""}left</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <PanelText>Nothing left. That’s a 100%.</PanelText>
      )}
    </Panel>
  );
}
