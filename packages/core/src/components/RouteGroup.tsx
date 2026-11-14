import { Link } from "react-router";
import { Icon } from "./Icon";
import { BulkCheck } from "./BulkCheck";
import { CheckBox } from "./CheckBox";
import { Quantity, SourceLine, Tag } from "./ui";
import { cats, config, primaryTag } from "../guide";
import { useProgress } from "../store/progress";
import { useUi } from "../store/ui";
import type { IconName } from "./Icon";
import type { Row, SourceLink } from "../types";

interface RowProps {
  row: Row;
  prefix: string;
  highlighted: boolean;
  /** On the checklist page: link back to the row in its chapter. */
  origin?: boolean;
  fallbackFocusId: string;
}

export function RouteRow({ row, prefix, highlighted, origin = false, fallbackFocusId }: RowProps) {
  const checked = useProgress((s) => s.data.checks[row.id] === true);
  const inputId = `${prefix}-${row.id}`;
  const tag = primaryTag(row);
  const badges = row.tags.filter((entry) => entry !== tag && config.badges?.includes(entry));

  return (
    <div className={["route-row", checked && "completed", highlighted && "highlight"].filter(Boolean).join(" ")} id={`entry-${row.id}`}>
      <CheckBox id={inputId} row={row} fallbackFocusId={fallbackFocusId} />
      <div>
        {/* The label stretches over the whole row (see .route-row label::after), so the row is the tap target. */}
        <label htmlFor={inputId}>{row.title}</label>
        {row.text && <p>{row.text}</p>}
      </div>
      <div className="row-meta">
        <Tag tag={tag} />
        {badges.map((entry) => (
          <Tag key={entry} tag={entry} />
        ))}
        {row.quantity > 0 && <Quantity row={row} />}
        {row.tags.includes("missable") && <Tag tag="missable" />}
        {origin ? (
          <Link className="origin" to={`/guide/${row.chapter}/${row.id}`} aria-label={`Open “${row.title}” in chapter ${row.chapter}`}>
            Chapter {row.chapter}
          </Link>
        ) : (
          row.reference && (
            <a className="origin" href={row.reference} target="_blank" rel="noopener noreferrer" aria-label={`Source for ${row.title} (opens in a new tab)`}>
              Source
            </a>
          )
        )}
      </div>
    </div>
  );
}

interface GroupProps {
  groupKey: string;
  title: string;
  location?: string;
  icon?: IconName;
  note?: string;
  sources?: SourceLink[];
  rows: Row[];
  open: boolean;
  highlightedId: string;
  origin?: boolean;
  fallbackFocusId: string;
  /** Persist manual open/close only when the list is unfiltered. */
  rememberToggle: boolean;
}

export function RouteGroup({ groupKey, title, location, icon, note, sources = [], rows, open, highlightedId, origin, fallbackFocusId, rememberToggle }: GroupProps) {
  const setGroupOpen = useUi((s) => s.setGroupOpen);
  const checks = useProgress((s) => s.data.checks);
  const graphic = icon ?? cats[primaryTag(rows[0])][2];
  const kinds = [...new Set(rows.map((row) => cats[primaryTag(row)][0]))].slice(0, 3).join(" · ");
  const done = rows.filter((row) => checks[row.id] === true).length;
  const tools = rows.length > 1;

  return (
    <details
      className="route-group"
      id={origin ? undefined : groupKey}
      open={open}
      onToggle={(event) => {
        if (rememberToggle && event.currentTarget.isConnected) setGroupOpen(groupKey, event.currentTarget.open);
      }}
    >
      <summary>
        <span className="group-icon">
          <Icon name={graphic} />
        </span>
        <span>
          <h3>{title}</h3>
          <small>{location ?? kinds}</small>
        </span>
        <span className="group-count">
          {done} / {rows.length}
        </span>
        <Icon name="down" className="svg-icon caret" />
      </summary>
      {(note || sources.length > 0 || tools) && (
        <div className="group-note">
          {note && <p>{note}</p>}
          {tools && (
            <div className="group-tools">
              <BulkCheck rows={rows} label={title} />
            </div>
          )}
          <SourceLine sources={sources} />
        </div>
      )}
      <div className="route-list">
        {rows.map((row) => (
          <RouteRow key={row.id} row={row} prefix={groupKey} highlighted={highlightedId === row.id} origin={origin} fallbackFocusId={fallbackFocusId} />
        ))}
      </div>
    </details>
  );
}
