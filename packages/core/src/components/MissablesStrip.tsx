import { Link } from "react-router";
import { CheckBox } from "./CheckBox";
import { config, hasMissables, missablesLeft, missableWhy } from "../guide";
import { useHeldRows } from "../useHeldRows";
import { useProgress } from "../store/progress";
import type { Chapter } from "../types";

/**
 * "Don't miss" strip for a chapter: the unchecked entries that can be lost for good. While the guide flags
 * nothing at all, it says so instead, with the sources behind that claim.
 */
export function MissablesStrip({ chapter }: { chapter: Chapter }) {
  if (!hasMissables) return config.reassurance ? <Reassurance {...config.reassurance} /> : null;
  // Re-mount per chapter so a held list never leaks into the next one.
  return <MissablesList key={chapter.id} chapter={chapter} />;
}

function Reassurance({ text, sources }: NonNullable<typeof config.reassurance>) {
  return (
    <aside className="missables missables-clear" aria-label="Missable entries">
      <details>
        <summary>
          <strong>Nothing is flagged as permanently missable.</strong> {text}
        </summary>
        <ul>
          {sources.map(([label, url]) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </aside>
  );
}

function MissablesList({ chapter }: { chapter: Chapter }) {
  const checks = useProgress((s) => s.data.checks);
  const { rows, hold } = useHeldRows(missablesLeft(chapter, checks), checks);
  if (!rows.length) return null;
  const left = rows.filter((row) => checks[row.id] !== true).length;
  return (
    <aside className="missables" aria-label="Missable entries">
      <details open>
        <summary>
          <strong>Don’t miss before moving on</strong>
          <span className="group-count">{left} left</span>
        </summary>
        <ul onChangeCapture={hold}>
          {rows.map((row) => (
            <li key={row.id} className={checks[row.id] === true ? "ticked" : undefined}>
              <CheckBox id={`missable-${row.id}`} row={row} />
              <label htmlFor={`missable-${row.id}`}>
                <strong>{row.title}</strong>
                <small>{missableWhy(row.id) ?? row.group}</small>
              </label>
              <Link className="origin" to={`/guide/${row.chapter}/${row.id}`} aria-label={`Jump to “${row.title}”`}>
                Jump to
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </aside>
  );
}
