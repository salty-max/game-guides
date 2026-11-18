import { Field as BaseField } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import { Icon } from "./Icon";

interface SearchFieldProps {
  /** On the input, so a label and a focus call can reach it. */
  id: string;
  /** Said to a screen reader; the box shows the placeholder and a magnifier instead. */
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * A search box: Base UI's input in a field, a `type="search"` input (a searchbox to assistive technology) inside a box
 * with a magnifier. The whole box is its label, so a click anywhere on it puts the caret in the input. It is as wide as what holds it.
 */
export function SearchField({ id, label, placeholder, value, onChange }: SearchFieldProps) {
  return (
    <BaseField.Root>
      <BaseField.Label
        htmlFor={id}
        className="flex min-h-11 items-center gap-1.75 rounded-control border border-control-line bg-surface px-2.5 py-1.5 text-14/sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus"
      >
        <Icon name="search" className="size-4 text-muted" />
        <span className="sr-only">{label}</span>
        <Input
          type="search"
          id={id}
          placeholder={placeholder}
          value={value}
          onValueChange={onChange}
          className="min-w-0 flex-1 border-0 bg-transparent p-0.5 placeholder:text-muted focus-visible:outline-none"
        />
      </BaseField.Label>
    </BaseField.Root>
  );
}
