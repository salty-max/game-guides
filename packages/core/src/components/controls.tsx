import { Select as BaseSelect } from "@base-ui/react/select";
import { Icon } from "./Icon";

// Core's form controls: Base UI's headless parts, styled from the guide's palette through the tokens in tokens.css. Like Button, none of
// them takes a className or a style: a guide gets the look it's given. The parts follow shadcn's Base UI components, adapted to the house tokens.

interface SelectProps {
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

/** One choice from a short list. The popup is the same on a phone and a desktop, and is a real listbox: arrows, Home, End and typing move through it. */
export function Select({ id, label, choices, value, onChange, bare = false, disabled = false }: SelectProps) {
  const items = choices.map(([key, text]) => ({ value: String(key), label: text }));
  return (
    <div className="field">
      <label htmlFor={id} className={bare ? "sr-only" : undefined}>
        {label}
      </label>
      <BaseSelect.Root items={items} value={String(value)} disabled={disabled} onValueChange={(next) => next !== null && onChange(next)}>
        <BaseSelect.Trigger
          id={id}
          className="flex min-h-11 w-full items-center justify-between gap-2 rounded-control border border-control-line bg-surface px-2.5 py-1.5 text-start text-sm font-bold text-ink select-none not-data-disabled:hover:bg-raised data-popup-open:bg-raised"
        >
          <BaseSelect.Value />
          <BaseSelect.Icon className="text-muted">
            <Icon name="down" className="svg-icon size-4" />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner sideOffset={4} alignItemWithTrigger={false} className="z-40 outline-hidden">
            <BaseSelect.Popup className="min-w-(--anchor-width) origin-(--transform-origin) rounded-control border border-control-line bg-surface text-ink shadow-[0_10px_30px_var(--shadow)] outline-hidden transition-[scale,opacity] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none">
              <BaseSelect.List className="max-h-(--available-height) overflow-y-auto p-1">
                {items.map((item) => (
                  <BaseSelect.Item
                    key={item.value}
                    value={item.value}
                    className="grid min-h-11 cursor-pointer grid-cols-[1rem_1fr] items-center gap-2 rounded-small px-2.5 text-sm font-semibold outline-hidden select-none data-highlighted:bg-soft data-highlighted:text-soft-ink data-selected:font-extrabold"
                  >
                    <BaseSelect.ItemIndicator className="col-start-1">
                      <Icon name="check" className="svg-icon size-4" />
                    </BaseSelect.ItemIndicator>
                    <BaseSelect.ItemText className="col-start-2">{item.label}</BaseSelect.ItemText>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </div>
  );
}
