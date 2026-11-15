import { Field as BaseField } from "@base-ui/react/field";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import { field } from "./select-style";

// A file of its own, not controls.tsx: a guide's panel on the dashboard (Red Dead's calibration) shows it, and a page that imported
// controls.tsx would take the dialog's controls into the first download with it (docs/core.md, "One file per control").

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
  /** Buttons beside the input (a form's Save), on its line; the description and the error go under both. */
  actions?: ReactNode;
  /** `short` for a value of a few characters (a percentage): 160px instead of the whole width. */
  width?: "full" | "short";
  /** Announces the error when it appears, for a form checked on submit, where the focus may be on its button or still in the field. */
  alertError?: boolean;
}

const textInput = cva(
  "min-h-11 rounded-control border border-control-line bg-surface px-2.5 py-1.5 text-sm font-bold text-ink placeholder:font-normal placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-[.46] data-invalid:border-2 data-invalid:border-error",
  { variants: { width: { full: "w-full", short: "w-40" } }, defaultVariants: { width: "full" } },
);

/**
 * A line of text with its label, an optional description and an optional error, wired to it for assistive technology. The error is read
 * with the field but isn't announced when it appears: a screen that shows one while the reader is still in the field also says it, in a
 * DialogStatus, and a form checked on submit says it with `alertError`.
 */
export function TextField({ id, label, value, onChange, description, error, disabled = false, placeholder, name, inputMode, autoComplete, maxLength, pattern, actions, width, alertError = false }: TextFieldProps) {
  const control = (
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
      className={textInput({ width })}
    />
  );
  return (
    <BaseField.Root className={field} invalid={Boolean(error)} disabled={disabled}>
      <BaseField.Label htmlFor={id}>{label}</BaseField.Label>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">
          {control}
          {actions}
        </div>
      ) : (
        control
      )}
      {description && <BaseField.Description className="text-[13px] font-semibold text-muted">{description}</BaseField.Description>}
      {error && (
        <BaseField.Error match role={alertError ? "alert" : undefined} className="text-[13px] font-bold text-error">
          {error}
        </BaseField.Error>
      )}
    </BaseField.Root>
  );
}
