import { changeChecks } from "../actions";
import { useProgress } from "../store/progress";
import type { Row } from "../types";

interface CheckBoxProps {
  id: string;
  row: Row;
  /** Where to send focus if ticking the row filters it out of the list. */
  fallbackFocusId?: string;
}

/** The one checkbox every list uses: it saves, and offers Undo for the change. */
export function CheckBox({ id, row, fallbackFocusId }: CheckBoxProps) {
  const checked = useProgress((s) => s.data.checks[row.id] === true);
  return (
    <input
      id={id}
      className="check"
      type="checkbox"
      checked={checked}
      onChange={(event) => {
        const next = event.currentTarget.checked;
        changeChecks([row.id], next, `${next ? "Checked" : "Unchecked"} “${row.title}”.`);
        if (fallbackFocusId) {
          requestAnimationFrame(() => {
            if (!document.getElementById(id)) document.getElementById(fallbackFocusId)?.focus({ preventScroll: true });
          });
        }
      }}
    />
  );
}
