import { Button, Empty, Panel, PanelTitle } from "./ui";
import { TickItem } from "./TickItem";
import { cats, choiceOf, nextUp, primaryTag, text } from "../guide";
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
    <Panel pad="snug" aria-labelledby="next-up-title">
      <PanelTitle id="next-up-title">Next up</PanelTitle>
      {rows.length ? (
        <ul className="list-none p-0">
          {rows.map((row) => (
            <TickItem
              key={row.id}
              row={row}
              prefix="next"
              ticked={data.checks[row.id] === true}
              detail={`${row.chapter !== chapter ? `Chapter ${row.chapter} · ` : ""}${choiceOf(row.id)?.why ?? `${cats[primaryTag(row)][1]} · ${row.group}`}`}
              tag={choiceOf(row.id) ? "one-way" : undefined}
              jumpLabel={`Jump to “${row.title}” in chapter ${row.chapter}`}
              onToggle={hold}
            />
          ))}
        </ul>
      ) : (
        <Empty>{text.nextUpDone}</Empty>
      )}
      {holding && (
        <div>
          <Button onClick={release}>Show next steps</Button>
        </div>
      )}
    </Panel>
  );
}
