import { Button, Empty } from "./ui";
import { TickItem } from "./TickItem";
import { cats, nextUp, primaryTag, text } from "../guide";
import { useHeldRows } from "../useHeldRows";
import { isOpen, useProgress } from "../store/progress";

/** The next few unchecked steps from this chapter on. A ticked step stays put until "Show next steps". */
export function NextUp({ chapter }: { chapter: number }) {
  const data = useProgress((s) => s.data);
  const { rows, holding, hold, release } = useHeldRows(
    nextUp(data.checks, (n) => isOpen(data, n), chapter, 3),
    data.checks,
  );

  return (
    <section className="next-up" aria-labelledby="next-up-title">
      <h2 id="next-up-title">Next up</h2>
      {rows.length ? (
        <ul>
          {rows.map((row) => (
            <TickItem
              key={row.id}
              row={row}
              prefix="next"
              ticked={data.checks[row.id] === true}
              detail={`${row.chapter !== chapter ? `Chapter ${row.chapter} · ` : ""}${cats[primaryTag(row)][1]} · ${row.group}`}
              jumpLabel={`Jump to “${row.title}” in chapter ${row.chapter}`}
              onToggle={hold}
            />
          ))}
        </ul>
      ) : (
        <Empty>{text.nextUpDone}</Empty>
      )}
      {holding && (
        <div className="next-up-advance">
          <Button onClick={release}>Show next steps</Button>
        </div>
      )}
    </section>
  );
}
