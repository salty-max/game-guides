import { Link } from "react-router";
import { Stat } from "../components/Stats";
import { Breadcrumb, Button, PageHeading, ProgressBar } from "../components/ui";
import { CHAPTER_COUNT, cats, chapterRows, chapters, allRows, targets, two, whatsLeft } from "../lib/guide";
import { exportProgress } from "../lib/backup";
import { isOpen, useProgress } from "../store/progress";
import { useUi } from "../store/ui";

export function DashboardPage() {
  const data = useProgress((s) => s.data);
  const openDialog = useUi((s) => s.openDialog);
  const total = allRows.length;
  const done = allRows.filter((row) => data.checks[row.id] === true).length;
  const visible = chapters.filter((chapter) => isOpen(data, chapter.id));

  return (
    <>
      <Breadcrumb current="Progress" />
      <PageHeading title="Your progress">
        <p>Counts follow the guide’s own completion list. Optional amiibo outfits are tracked separately.</p>
        <span className="inline-stat">
          {done} of {total} entries checked
        </span>
      </PageHeading>
      <div className="dashboard-grid">
        <section className="panel">
          <h2>Chapter progress</h2>
          <p>Open a revealed chapter to resume its route.</p>
          {visible.map((chapter) => {
            const rows = chapterRows(chapter);
            const count = rows.filter((row) => data.checks[row.id] === true).length;
            return (
              <Link key={chapter.id} className="chapter-progress" to={`/guide/${chapter.id}`}>
                <small>{two(chapter.id)}</small>
                <strong>{chapter.title}</strong>
                <ProgressBar done={count} total={rows.length} label={chapter.title} />
                <small>
                  {count} / {rows.length}
                </small>
              </Link>
            );
          })}
          {data.spoilers && data.ceiling < CHAPTER_COUNT && <p>{CHAPTER_COUNT - data.ceiling} chapters hidden by spoiler protection.</p>}
        </section>
        <section className="panel">
          <h2>Progress backup</h2>
          <p>Progress lives in this browser. Export a backup to move it to another device or keep a copy.</p>
          <div className="controls">
            <Button onClick={exportProgress}>Export progress</Button>
            <Button onClick={() => openDialog({ kind: "settings" })}>Import progress</Button>
          </div>
        </section>
      </div>
      <WhatsLeft />
      <section className="panel">
        <div className="subhead">
          <div>
            <h2>Completion targets</h2>
            <p>Might Crystals count by what each entry awards. Accessories count all 28 versions, although two are replaced by upgrades on a finished save.</p>
          </div>
        </div>
        <div className="category-board">
          {targets.map(({ tag, goal }) => (
            <Stat key={tag} tag={tag} goal={goal} />
          ))}
        </div>
      </section>
    </>
  );
}

function WhatsLeft() {
  const checks = useProgress((s) => s.data.checks);
  const items = whatsLeft(checks);
  const max = Math.max(...items.map((item) => item.goal), 1);
  return (
    <section className="panel whats-left" aria-labelledby="whats-left-title">
      <h2 id="whats-left-title">What’s left</h2>
      {items.length ? (
        <>
          <p>Biggest gaps first.</p>
          <ul>
            {items.map((item) => (
              <li key={item.tag}>
                <span className="wl-name">{cats[item.tag][0]}</span>
                <span className="wl-bar" aria-hidden="true">
                  <span className="wl-total" style={{ width: `${(item.goal / max) * 100}%` }}>
                    <span style={{ width: `${((item.goal - item.left) / item.goal) * 100}%` }} />
                  </span>
                </span>
                <span className="wl-pts">
                  {item.left} <small>of {item.goal} left</small>
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Every target in the completion list is met.</p>
      )}
    </section>
  );
}
