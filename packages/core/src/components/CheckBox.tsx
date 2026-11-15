import { Checkbox } from "@base-ui/react/checkbox";
import { changeChecks } from "../actions";
import { useProgress } from "../store/progress";
import type { Row } from "../types";
import { checkBox, checkIcon, checkMark } from "./check-style";
import { Icon } from "./Icon";

interface CheckBoxProps {
  /** Base UI puts this on its stand-in input, so a `<label htmlFor>` with it ticks the box. */
  id: string;
  /** The label's id. Naming it spares Base UI looking the label up in the page after every render, hundreds of times on the checklist. */
  labelId: string;
  row: Row;
  /** In a line of prose, before the words it ticks. */
  prose?: boolean;
  /** Where to send focus if ticking the row filters it out of the list. */
  fallbackFocusId?: string;
  /** Called as the box changes, before the new state lands. */
  onToggle?: () => void;
}

/** The one checkbox every list uses: it saves, and offers Undo for the change. */
export function CheckBox({ id, labelId, row, prose = false, fallbackFocusId, onToggle }: CheckBoxProps) {
  const checked = useProgress((s) => s.data.checks[row.id] === true);
  return (
    <Checkbox.Root
      id={id}
      // With a name, Base UI places its stand-in input in the row's flow instead of pinning it to the viewport: hundreds of pinned inputs
      // in the scrolling page cost the browser a compositing pass on every tick (a click went from 40 to 96 ms at 6x throttle). Nothing submits it.
      name={id}
      aria-labelledby={labelId}
      checked={checked}
      className={checkBox({ at: prose ? "prose" : "line" })}
      onCheckedChange={(next) => {
        onToggle?.();
        changeChecks([row.id], next, `${next ? "Checked" : "Unchecked"} “${row.title}”.`);
        if (fallbackFocusId) {
          requestAnimationFrame(() => {
            if (!document.getElementById(id)) document.getElementById(fallbackFocusId)?.focus({ preventScroll: true });
          });
        }
      }}
    >
      <Checkbox.Indicator className={checkMark}>
        <Icon name="check" className={checkIcon} />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
}
