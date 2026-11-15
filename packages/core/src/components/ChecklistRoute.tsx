import { useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import { RouteGroup } from "./RouteGroup";
import { Select } from "./controls";
import { Chip, Empty } from "./ui";
import { chapterRows, config, hasMissables, statusOptions } from "../guide";
import { useProgress } from "../store/progress";
import { useUi } from "../store/ui";
import type { Chapter } from "../types";

const routeChips: [string, string][] = [["all", "All steps"], ...(config.chips.route ?? []), ...(hasMissables ? [["missable", "Missable"] as [string, string]] : [])];

/** The chapter as collapsible route groups with category chips and a status filter. Re-mounted per target, so filters reset there. */
export function ChecklistRoute({ chapter, target, footer }: { chapter: Chapter; target?: string; footer: ReactNode }) {
  const checks = useProgress((s) => s.data.checks);
  const openGroups = useUi((s) => s.openGroups);
  const setGroupsOpen = useUi((s) => s.setGroupsOpen);
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [highlighted, setHighlighted] = useState(target?.startsWith("entry-") ? target.slice("entry-".length) : "");

  const rows = chapterRows(chapter);
  const done = rows.filter((row) => checks[row.id] === true).length;
  const groups = chapter.groups
    .map((group) => ({
      ...group,
      shown: group.rows.filter(
        (row) => (filter === "all" || row.tags.includes(filter)) && (status === "all" || (status === "done") === (checks[row.id] === true)),
      ),
    }))
    .filter((group) => group.shown.length);
  const labels = routeChips.filter(([key]) => key === "all" || rows.some((row) => row.tags.includes(key)));
  const filtered = filter !== "all" || status !== "all";
  const groupOpen = (key: string, index: number, shownIds: string[]) =>
    filtered || key === target || shownIds.includes(highlighted) || (openGroups[key] ?? index === 0);
  const allOpen = groups.every((group, index) => groupOpen(group.key, index, group.shown.map((row) => row.id)));

  return (
    <section id="route" aria-labelledby="route-title">
      <div className="subhead">
        <div>
          <h2 id="route-title">Chapter route</h2>
          <p>
            {done} of {rows.length} steps complete
          </p>
        </div>
        <button className="text-link" type="button" onClick={() => setGroupsOpen(groups.map((group) => group.key), !allOpen)}>
          <Icon name="down" />
          <span>{allOpen ? "Collapse all" : "Expand all"}</span>
        </button>
      </div>
      <div className="toolbar">
        <div className="chips" aria-label="Route categories">
          {labels.map(([id, label]) => (
            <Chip
              key={id}
              label={label}
              value={id}
              current={filter}
              onSelect={(value) => {
                setFilter(value);
                setHighlighted("");
              }}
            />
          ))}
        </div>
        <Select
          id="route-status"
          label="Route completion status"
          choices={statusOptions}
          value={status}
          bare
          onChange={(value) => {
            setStatus(value);
            setHighlighted("");
          }}
        />
      </div>
      {groups.length ? (
        groups.map((group, index) => (
          <RouteGroup
            key={group.key}
            groupKey={group.key}
            title={group.title}
            location={group.location}
            icon={group.icon}
            note={group.note}
            sources={group.sources}
            rows={group.shown}
            open={groupOpen(group.key, index, group.shown.map((row) => row.id))}
            highlightedId={highlighted}
            fallbackFocusId="route-status"
            rememberToggle={!filtered}
          />
        ))
      ) : (
        <Empty>No steps match these filters.</Empty>
      )}
      {footer}
    </section>
  );
}
