import { pressClasses } from "./press-style";

// What the select's two forms share: its props, and the look of its closed trigger. Plain values, no Base UI, so the shell (Select.tsx),
// which is on every page that has a select, can use them without pulling in the select behind it. The field's frame is here too, for
// the same reason: every labelled control (controls.tsx) uses it.

export interface SelectProps {
  /** On the trigger, so a label and a focus call can reach it. */
  id: string;
  label: string;
  choices: [key: string | number, label: string][];
  value: string | number;
  onChange: (value: string) => void;
  /** Keeps the label for screen readers only. */
  bare?: boolean;
  disabled?: boolean;
}

export const selectTriggerClasses = `${pressClasses} flex min-h-11 w-full items-center justify-between gap-2 rounded-control border border-control-line bg-surface px-2.5 py-1.5 text-start text-14/sm font-bold text-ink select-none not-data-disabled:hover:bg-raised data-disabled:cursor-not-allowed data-disabled:opacity-[.46] data-popup-open:bg-raised`;

/** A labelled control's frame: the label over the control, with a line of description or error under it. */
export const fieldClasses = "grid gap-1 text-13 font-bold";

/** The select's frame: a field at least 100px wide, so a row of filters doesn't squeeze one to nothing. */
export const selectFieldClasses = `${fieldClasses} min-w-25`;
