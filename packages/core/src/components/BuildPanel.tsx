import { useState } from "react";
import { Button, Empty, Panel, PanelActions, PanelHead, PanelText, PanelTitle } from "./ui";
import { TickItem } from "./TickItem";
import { buildGroups, buildServed, byId, forBuild, hasMissables, leaningName } from "../guide";
import { isOpen, useProgress } from "../store/progress";
import { useBuild } from "../store/build";
import { useUi } from "../store/ui";
import type { BuildKind } from "../types";

/** "Dexterity and Faith", "Strength, Dexterity and Faith". */
const inWords = (ids: string[]) => {
  const words = ids.map(leaningName);
  return words.length < 2 ? (words[0] ?? "") : `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
};

/**
 * The Progress page's Next for your build: what serves the reader's pick in the chapters they've revealed, by kind as a build page lays
 * gear out, the upgrade path last. Drawn whenever the guide has builds, so its address (/dashboard/build) means the same with or without
 * a pick; without one it says how to make one. Change build opens Guide settings on Your build.
 */
export function BuildPanel() {
  const picked = useBuild((s) => s.picked);
  const openDialog = useUi((s) => s.openDialog);

  return (
    <Panel id="build" aria-labelledby="build-title">
      <PanelHead>
        <PanelTitle id="build-title">Next for your build</PanelTitle>
        <PanelText>
          {picked.length
            ? `${inWords(picked)}, from the chapters you’ve revealed${hasMissables ? ", missables first" : ""}.`
            : "Choose what you level in Guide settings, and what serves it in the chapters you’ve revealed shows here. It changes no count."}
        </PanelText>
      </PanelHead>
      {/* Keyed on the pick, so a new one lets go of a list held still by a tick. */}
      {picked.length > 0 && <Groups key={picked.join(" ")} picked={picked} />}
      <PanelActions>
        <Button onClick={() => openDialog({ kind: "settings", at: "build" })}>{picked.length ? "Change build" : "Choose your build"}</Button>
      </PanelActions>
    </Panel>
  );
}

/**
 * The groups, held still from the first tick in any of them until Show next ones or until every held tick is undone, as Next up's list
 * is (useHeldRows): the hold is kept here, above the empty check, so ticking a kind's last row keeps its section, its box and the focus
 * on it, rather than dropping the section (or the whole list) from under the pointer. Keyed on the pick by the panel, so a new pick lets go.
 */
function Groups({ picked }: { picked: string[] }) {
  const data = useProgress((s) => s.data);
  const open = (n: number) => isOpen(data, n);
  const fresh = buildGroups(data.checks, open, picked);
  const [held, setHeld] = useState<{ kind: BuildKind; heading: string; ids: string[] }[] | null>(null);
  const holding = held !== null && held.some((group) => group.ids.some((id) => data.checks[id] === true));
  // A spent hold lets go at once, as useHeldRows' does, so another device's tick can't bring an old list back.
  if (held !== null && !holding) setHeld(null);
  const groups = holding ? held.map(({ kind, heading, ids }) => ({ kind, heading, rows: ids.flatMap((id) => byId.get(id) ?? []) })) : fresh;
  const hold = () => setHeld((current) => (holding ? current : fresh.map(({ kind, heading, rows }) => ({ kind, heading, ids: rows.map((row) => row.id) }))));

  if (!groups.length)
    return (
      <Empty>
        {buildServed(open, picked)
          ? "Everything for this build in the chapters you’ve revealed is checked."
          : "Nothing in the chapters you’ve revealed serves this build yet. More shows as you reveal chapters."}
      </Empty>
    );
  return (
    <div className="grid gap-3">
      {groups.map(({ kind, heading, rows }) => (
        <section key={kind} aria-labelledby={`build-${kind}`}>
          <h3 id={`build-${kind}`} className="text-12 font-extrabold tracking-[0.04em] text-muted uppercase">
            {heading}
          </h3>
          <ul className="list-none p-0">
            {rows.map((row) => (
              <TickItem
                key={row.id}
                row={row}
                prefix={`build-${kind}`}
                ticked={data.checks[row.id] === true}
                detail={forBuild(row.id, picked)
                  .filter((entry) => entry.kind === kind)
                  .map((entry) => entry.note)
                  .join(" ")}
                tag={row.tags.includes("missable") ? "missable" : undefined}
                jumpLabel={`Jump to “${row.title}” in chapter ${row.chapter}`}
                onToggle={hold}
              />
            ))}
          </ul>
        </section>
      ))}
      {holding && (
        <div>
          <Button onClick={() => setHeld(null)}>Show next ones</Button>
        </div>
      )}
    </div>
  );
}
