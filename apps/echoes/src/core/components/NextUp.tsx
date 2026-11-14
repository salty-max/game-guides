import { Link } from "react-router";
import { Button, Empty } from "./ui";
import { CheckBox } from "./CheckBox";
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
        <ul onChangeCapture={hold}>
          {rows.map((row) => (
            <li key={row.id} className={data.checks[row.id] === true ? "ticked" : undefined}>
              <CheckBox id={`next-${row.id}`} row={row} />
              <label htmlFor={`next-${row.id}`}>
                <strong>{row.title}</strong>
                <small>
                  {cats[primaryTag(row)][1]} · {row.group}
                </small>
              </label>
              <Link className="origin" to={`/guide/${row.chapter}/${row.id}`} aria-label={`Jump to “${row.title}” in chapter ${row.chapter}`}>
                Jump to
              </Link>
            </li>
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
