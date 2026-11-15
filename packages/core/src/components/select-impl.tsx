import { Select as BaseSelect } from "@base-ui/react/select";
import { Icon } from "./Icon";
import { selectField, selectTrigger, type SelectProps } from "./select-style";

// The select itself, on Base UI. Pages never import this: they use the Select shell (Select.tsx), which loads it when it's needed.
// The settings screen is in the dialog's chunk already and uses this directly.

/** One choice from a short list. The popup is the same on a phone and a desktop, and is a real listbox: arrows, Home, End and typing move through it. */
export function SelectImpl({
  id,
  label,
  choices,
  value,
  onChange,
  bare = false,
  disabled = false,
  defaultOpen = false,
  autoFocus = false,
}: SelectProps & { defaultOpen?: boolean; autoFocus?: boolean }) {
  const items = choices.map(([key, text]) => ({ value: String(key), label: text }));
  return (
    <div className={selectField}>
      <label htmlFor={id} className={bare ? "sr-only" : undefined}>
        {label}
      </label>
      <BaseSelect.Root
        items={items}
        value={String(value)}
        disabled={disabled}
        defaultOpen={defaultOpen}
        onValueChange={(next) => next !== null && onChange(next)}
      >
        <BaseSelect.Trigger id={id} autoFocus={autoFocus} className={selectTrigger}>
          <BaseSelect.Value />
          <BaseSelect.Icon className="text-muted">
            <Icon name="down" className="size-4" />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner sideOffset={4} alignItemWithTrigger={false} className="z-50 outline-hidden">
            <BaseSelect.Popup className="min-w-(--anchor-width) origin-(--transform-origin) rounded-control border border-control-line bg-surface text-ink shadow-[0_10px_30px_var(--shadow)] outline-hidden transition-[scale,opacity] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none">
              <BaseSelect.List className="max-h-(--available-height) overflow-y-auto p-1">
                {items.map((item) => (
                  <BaseSelect.Item
                    key={item.value}
                    value={item.value}
                    className="grid min-h-11 cursor-pointer grid-cols-[1rem_1fr] items-center gap-2 rounded-small px-2.5 text-sm font-semibold outline-hidden select-none data-highlighted:bg-soft data-highlighted:text-soft-ink data-selected:font-extrabold"
                  >
                    <BaseSelect.ItemIndicator className="col-start-1">
                      <Icon name="check" className="size-4" />
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
