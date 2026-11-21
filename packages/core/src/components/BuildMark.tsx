import { Icon } from "./Icon";
import { Tag } from "./ui";
import { forBuild, hasBuildEntry, servedBy } from "../guide";
import { useBuild } from "../store/build";
import type { Row } from "../types";

type At = "prose" | "list" | "column";

/** A row's entries that serve the reader's pick, and the pick. It reads the pick as one string, so it redraws only when the pick changes. */
function useServing(row: Row) {
  const joined = useBuild((s) => s.picked.join(" "));
  const picked = joined ? joined.split(" ") : [];
  return { entries: forBuild(row.id, picked), picked };
}

/**
 * A row's build tag, beside its other tags: the picked leanings its entries serve ("Dexterity"). Nothing for a row without entries,
 * which never reads the pick, so a guide without builds draws nothing and subscribes to nothing, and a memoised row (RouteRow) redraws
 * for a new pick only when it has entries.
 */
export function BuildBadge({ row, at }: { row: Row; at: At }) {
  return hasBuildEntry(row.id) ? <Badge row={row} at={at} /> : null;
}

function Badge({ row, at }: { row: Row; at: At }) {
  const { entries, picked } = useServing(row);
  if (!entries.length) return null;
  return (
    <>
      <Tag tag="build" at={at === "list" ? "line" : at}>
        {/* A stat's name alone says nothing to a screen reader about why it's there. */}
        <span className="sr-only">For your build: </span>
        {[...new Set(entries.flatMap((entry) => servedBy(entry, picked)))].join(" · ")}
      </Tag>
      {at === "prose" && " "}
    </>
  );
}

/** A row's build notes under its words, one starred line each: what in the row serves the pick, item first. */
export function BuildNote({ row, at }: { row: Row; at: At }) {
  return hasBuildEntry(row.id) ? <Note row={row} at={at} /> : null;
}

function Note({ row, at }: { row: Row; at: At }) {
  const { entries } = useServing(row);
  if (!entries.length) return null;
  // Inside a prose row's <p>, so spans shown as blocks, never a div. In a compact list it wraps under the step's words, not its box.
  return (
    <span className={`${at === "list" ? "basis-full ps-check-indent" : "mt-1.5"} block text-13/normal text-muted`}>
      {entries.map((entry) => (
        <span key={entry.note} className="flex items-start gap-1.5 [&_svg]:mt-0.5 [&_svg]:size-3.5 [&_svg]:flex-none [&_svg]:text-primary">
          <Icon name="star" />
          <span>{entry.note}</span>
        </span>
      ))}
    </span>
  );
}
