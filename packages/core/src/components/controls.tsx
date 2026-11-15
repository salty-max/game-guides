import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Field as BaseField } from "@base-ui/react/field";
import { OTPField as BaseOTPField } from "@base-ui/react/otp-field";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { Select as BaseSelect } from "@base-ui/react/select";
import { useId, useState } from "react";
import { buttonClass } from "./buttonStyle";
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

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/** A labelled tick box: the house 26px box, and the whole line (44px tall) is the target. */
export function Checkbox({ label, checked, onChange, disabled = false }: CheckboxProps) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm font-bold has-data-disabled:cursor-not-allowed has-data-disabled:opacity-[.46]">
      <BaseCheckbox.Root
        checked={checked}
        disabled={disabled}
        onCheckedChange={onChange}
        className="flex size-6.5 shrink-0 cursor-pointer items-center justify-center rounded-check border-2 border-edge bg-surface text-on-primary data-checked:border-primary data-checked:bg-primary"
      >
        <BaseCheckbox.Indicator className="flex data-unchecked:hidden">
          <Icon name="check" className="svg-icon size-4" />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label}
    </label>
  );
}

interface RadioGroupProps {
  label: string;
  choices: [key: string, label: string][];
  value: string;
  onChange: (value: string) => void;
}

/** One of a few choices, all showing: a row of segments. Tab enters the group once and the arrow keys move between segments. */
export function RadioGroup({ label, choices, value, onChange }: RadioGroupProps) {
  const labelId = useId();
  return (
    <div className="field">
      <span id={labelId}>{label}</span>
      <BaseRadioGroup aria-labelledby={labelId} value={value} onValueChange={(next) => onChange(String(next))} className="grid auto-cols-fr grid-flow-col gap-2">
        {choices.map(([key, text]) => (
          <label
            key={key}
            className="flex min-h-11 cursor-pointer items-center justify-center rounded-control border border-control-line bg-surface px-3 text-center text-sm font-bold text-muted select-none not-has-data-checked:hover:bg-raised has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-focus has-data-checked:border-soft-line has-data-checked:bg-soft has-data-checked:text-soft-ink"
          >
            <Radio.Root value={key} className="sr-only" />
            {text}
          </label>
        ))}
      </BaseRadioGroup>
    </div>
  );
}

interface FileFieldProps {
  id: string;
  label: string;
  accept?: string;
  /** The chosen file, or undefined when the choice is cleared. */
  onChange: (file: File | undefined) => void;
}

/**
 * A file picker. The browser's own "Choose File" button can't be styled, so the input stays (hidden, still focusable and still what a
 * screen reader finds) and its label is drawn as a button, with the chosen file's name beside it.
 */
export function FileField({ id, label, accept, onChange }: FileFieldProps) {
  const [name, setName] = useState("");
  return (
    <div className="field">
      <span id={`${id}-label`}>{label}</span>
      <div className="flex flex-wrap items-center gap-2.5">
        <label className={`cursor-pointer has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-focus ${buttonClass("outline", "default")}`}>
          <input
            id={id}
            type="file"
            accept={accept}
            aria-labelledby={`${id}-label ${id}-button`}
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setName(file?.name ?? "");
              onChange(file);
            }}
          />
          <span id={`${id}-button`}>Choose file</span>
        </label>
        <span className="text-sm font-semibold text-muted">{name || "No file chosen"}</span>
      </div>
    </div>
  );
}

interface CodeFieldProps {
  id: string;
  label: string;
  /** How many characters; each gets its own box. */
  length?: number;
  value: string;
  onChange: (value: string) => void;
  /** Called once when the last box is filled, also when a whole code is pasted. */
  onComplete?: (value: string) => void;
  /** Supporting text, read with the field. */
  description?: string;
  invalid?: boolean;
  disabled?: boolean;
  /** Letters and digits (a recovery code), where the default is digits only. */
  alphanumeric?: boolean;
  /** Takes the focus when the screen opens. */
  autoFocus?: boolean;
}

/**
 * A short code, one box per character: the sixth digit of a pairing code. Typing moves on by itself, Backspace goes back, a pasted code
 * fills every box, and a phone's one-time-code suggestion fills them too. The first box carries the label's name; the others say which one they are.
 */
export function CodeField({ id, label, length = 6, value, onChange, onComplete, description, invalid = false, disabled = false, alphanumeric = false, autoFocus = false }: CodeFieldProps) {
  const descriptionId = `${id}-description`;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <BaseOTPField.Root
        id={id}
        length={length}
        value={value}
        onValueChange={onChange}
        onValueComplete={(code) => onComplete?.(code)}
        validationType={alphanumeric ? "alphanumeric" : "numeric"}
        disabled={disabled}
        className="flex max-w-xs gap-2"
      >
        {Array.from({ length }, (_, index) => (
          <BaseOTPField.Input
            key={index}
            aria-label={index === 0 ? undefined : `Character ${index + 1} of ${length}`}
            aria-describedby={description ? descriptionId : undefined}
            aria-invalid={(invalid && !disabled) || undefined}
            data-autofocus={autoFocus && index === 0 ? "" : undefined}
            className="h-11 min-w-0 flex-1 rounded-control border border-control-line bg-surface p-0 text-center text-lg font-bold text-ink disabled:cursor-not-allowed disabled:opacity-[.46] aria-invalid:border-2 aria-invalid:border-error"
          />
        ))}
      </BaseOTPField.Root>
      {description && (
        <p id={descriptionId} className="text-[13px] font-semibold text-muted">
          {description}
        </p>
      )}
    </div>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Supporting text under the field, read with it. */
  description?: string;
  /** What is wrong with the value. It is read with the field, and marks it invalid. */
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  name?: string;
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "email" | "url" | "search";
  autoComplete?: string;
  maxLength?: number;
  pattern?: string;
}

/**
 * A line of text with its label, an optional description and an optional error, wired to it for assistive technology. The error is read
 * with the field but isn't announced when it appears: a screen that shows one while the reader is still in the field also says it, in a
 * DialogStatus.
 */
export function TextField({ id, label, value, onChange, description, error, disabled = false, placeholder, name, inputMode, autoComplete, maxLength, pattern }: TextFieldProps) {
  return (
    <BaseField.Root className="field" invalid={Boolean(error)} disabled={disabled}>
      <BaseField.Label htmlFor={id}>{label}</BaseField.Label>
      <BaseField.Control
        id={id}
        name={name}
        value={value}
        onValueChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        pattern={pattern}
        className="min-h-11 w-full rounded-control border border-control-line bg-surface px-2.5 py-1.5 text-sm font-bold text-ink placeholder:font-normal placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-[.46] data-invalid:border-2 data-invalid:border-error"
      />
      {description && <BaseField.Description className="text-[13px] font-semibold text-muted">{description}</BaseField.Description>}
      {error && (
        <BaseField.Error match className="text-[13px] font-bold text-error">
          {error}
        </BaseField.Error>
      )}
    </BaseField.Root>
  );
}
