import { Collapsible } from "@base-ui/react/collapsible";
import { useState } from "react";
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

// The group's header is its heading, and the button inside it opens and closes the steps (a button can't hold a heading).
const trigger =
  "group/trigger grid min-h-[58px] w-full cursor-pointer grid-cols-[36px_minmax(0,1fr)_auto_20px] items-center gap-[11px] border-0 bg-transparent px-3.5 py-3 text-left font-sans text-base leading-[1.58] font-normal text-inherit hover:bg-raised phone:grid-cols-[28px_minmax(0,1fr)_auto_15px] phone:gap-2 phone:p-[9px]";

export function RouteGroup({ groupKey, title, location, icon, note, sources = [], rows, open, highlightedId, origin, fallbackFocusId, rememberToggle }: GroupProps) {
  const setGroupOpen = useUi((s) => s.setGroupOpen);
  const checks = useProgress((s) => s.data.checks);
  // `open` is what the list wants; a reader can still open or close the group by hand, and that holds until the list wants something
  // else (a filter, Expand all), the way <details> behaved. Only an unfiltered list remembers the reader's choice.
  const [override, setOverride] = useState<{ base: boolean; value: boolean } | null>(null);
  if (override && override.base !== open) setOverride(null);
  const isOpen = override?.base === open ? override.value : open;
  const graphic = icon ?? cats[primaryTag(rows[0])][2];
  const kinds = [...new Set(rows.map((row) => cats[primaryTag(row)][0]))].slice(0, 3).join(" · ");
  const done = rows.filter((row) => checks[row.id] === true).length;
  const tools = rows.length > 1;

  return (
    <Collapsible.Root
      className="mb-3 overflow-clip rounded-card border border-line bg-surface"
      id={origin ? undefined : groupKey}
      open={isOpen}
      onOpenChange={(next) => {
        setOverride({ base: open, value: next });
        if (rememberToggle) setGroupOpen(groupKey, next);
      }}
    >
      <h3 className="m-0">
        <Collapsible.Trigger className={trigger}>
          <span className="grid size-[34px] place-items-center rounded-small bg-soft text-soft-ink phone:size-7 [&_.svg-icon]:size-[17px]">
            <Icon name={graphic} />
          </span>
          <span className="grid">
            <span className="text-[15px] leading-[1.2] font-extrabold">{title}</span>
            <small className="text-[12px] text-muted">{location ?? kinds}</small>
          </span>
          <span className="text-[12px] whitespace-nowrap text-muted tabular-nums">
            {done} / {rows.length}
          </span>
          <Icon name="down" className="svg-icon size-4 text-muted group-data-panel-open/trigger:rotate-180" />
        </Collapsible.Trigger>
      </h3>
      {/* Closed, the steps stay in the page, hidden until found: the browser's find-in-page reaches them and opens the group. */}
      <Collapsible.Panel hiddenUntilFound>
        {(note || sources.length > 0 || tools) && (
          <div className="border-t border-line bg-paper px-3.5 py-2.5 text-[13px] text-muted">
            {note && <p>{note}</p>}
            {tools && (
              <div className="flex flex-wrap items-center gap-3 [p+&]:mt-2">
                <BulkCheck rows={rows} label={title} />
              </div>
            )}
            <SourceLine sources={sources} />
          </div>
        )}
        <div className="border-t border-line">
          {rows.map((row) => (
            <RouteRow key={row.id} row={row} prefix={groupKey} highlighted={highlightedId === row.id} origin={origin} fallbackFocusId={fallbackFocusId} />
          ))}
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
