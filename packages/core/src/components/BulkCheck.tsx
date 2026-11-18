import { Button } from "./ui";
import { changeChecks } from "../actions";
import { useProgress } from "../store/progress";
import { useUi } from "../store/ui";
import type { Row } from "../types";

/** Unchecking more than this many at once asks first. */
export const BULK_CONFIRM_THRESHOLD = 10;

/**
 * Check what is left in a section, or uncheck all of it once it is done. Either way the toast can undo it. `ownLine` puts it on a line of
 * its own, for a stack (an article section's header) that would otherwise stretch the button across it. Under two rows it is nothing at all.
 */
export function BulkCheck({ rows, label, ownLine = false }: { rows: Row[]; label: string; ownLine?: boolean }) {
  const checks = useProgress((s) => s.data.checks);
  const openDialog = useUi((s) => s.openDialog);
  if (rows.length < 2) return null;
  const ids = rows.map((row) => row.id);
  const unchecked = ids.filter((id) => checks[id] !== true).length;
  const allDone = unchecked === 0;

  const run = () => {
    if (!allDone) return changeChecks(ids, true, `Checked ${unchecked} in “${label}”.`);
    const uncheck = () => changeChecks(ids, false, `Unchecked ${ids.length} in “${label}”.`);
    if (ids.length <= BULK_CONFIRM_THRESHOLD) return uncheck();
    openDialog({
      kind: "confirm",
      title: `Uncheck ${ids.length} entries?`,
      explanation: `This clears every entry in “${label}”. You can undo it right after.`,
      label: "Uncheck all",
      danger: true,
      onConfirm: uncheck,
    });
  };

  const button = (
    <Button icon="check" size="compact" onClick={run}>
      {allDone ? `Uncheck all (${ids.length})` : `${unchecked < ids.length ? "Check remaining" : "Check all"} (${unchecked})`}
      <span className="sr-only"> in {label}</span>
    </Button>
  );
  return ownLine ? <div>{button}</div> : button;
}
