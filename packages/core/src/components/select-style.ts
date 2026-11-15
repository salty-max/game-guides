// What the select's two forms share: its props, and the look of its closed trigger. Plain values, no Base UI, so the shell (Select.tsx),
// which is on every page that has a select, can use them without pulling in the select behind it.

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

export const selectTrigger =
  "flex min-h-11 w-full items-center justify-between gap-2 rounded-control border border-control-line bg-surface px-2.5 py-1.5 text-start text-sm font-bold text-ink select-none not-data-disabled:hover:bg-raised data-popup-open:bg-raised";
