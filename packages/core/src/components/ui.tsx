import { Button as BaseButton } from "@base-ui/react/button";
import { Progress } from "@base-ui/react/progress";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { Tooltip } from "@base-ui/react/tooltip";
import { cva } from "class-variance-authority";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { Link } from "react-router";
import { buttonClass, type ButtonSize, type ButtonStyle } from "./buttonStyle";
import { Icon, type IconName } from "./Icon";
import { tooltip as tooltipHandle } from "./tooltip-handle";
import { brand, cats, config, tagName } from "../guide";
import type { Row } from "../types";
import { pct } from "../format";

interface ButtonProps extends Omit<ComponentPropsWithRef<"button">, "style" | "className"> {
  look?: ButtonStyle;
  size?: ButtonSize;
  icon?: IconName;
  /**
   * While it's disabled, the button keeps its place in the Tab order and is announced as unavailable (aria-disabled) instead of
   * dropping out: for a button that is disabled for a moment while the focus is on it, so the focus doesn't fall to the page.
   */
  focusableWhenDisabled?: boolean;
}

/** A button, on Base UI's: a `look` and a `size` instead of classes. A click on a disabled one does nothing, focusable or not. */
export function Button({ look = "outline", size = "default", icon, children, type = "button", disabled = false, focusableWhenDisabled = false, ...rest }: ButtonProps) {
  return (
    // Focusable only while disabled: Base UI writes aria-disabled="false" on an enabled button that has the option on.
    <BaseButton type={type} disabled={disabled} focusableWhenDisabled={focusableWhenDisabled && disabled} className={buttonClass(look, size)} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
    </BaseButton>
  );
}

export function LinkButton({ to, look = "outline", size = "default", icon, children }: { to: string; look?: ButtonStyle; size?: ButtonSize; icon?: IconName; children: ReactNode }) {
  return (
    <Link className={buttonClass(look, size)} to={to}>
      {icon && <Icon name={icon} />}
      {children}
    </Link>
  );
}

// The top bar sets --icon-w where its buttons have to be narrower (the narrowest phones), so no class is needed on one.
const iconButton =
  "grid h-10 w-(--icon-w,2.5rem) place-items-center rounded-control border border-control-line bg-transparent p-0 text-inherit not-disabled:hover:bg-raised disabled:cursor-not-allowed disabled:opacity-[.46] [&_.svg-icon]:size-4.5";

type IconButtonProps = { label: string; icon: IconName; tooltip?: boolean } & Omit<ComponentPropsWithRef<"button">, "className" | "style">;

/**
 * A square button with an icon and no words: `label` is what a screen reader says. With `tooltip`, a pointer resting on it or a
 * keyboard reaching it also shows the label (tooltip-handle.ts), for the buttons whose icon alone may not say enough.
 */
export function IconButton({ label, icon, tooltip = false, ...rest }: IconButtonProps) {
  const button = (
    <BaseButton type="button" className={iconButton} aria-label={label} {...rest}>
      <Icon name={icon} />
    </BaseButton>
  );
  return tooltip ? <Tooltip.Trigger handle={tooltipHandle} payload={label} render={button} /> : button;
}

const chipGroup = cva("flex flex-wrap gap-1.5", {
  variants: { space: { none: "", above: "mt-2.5" } },
  defaultVariants: { space: "none" },
});

interface ChipGroupProps {
  /** What the chips choose between, for a screen reader: the group's name. */
  label: string;
  choices: [key: string, label: string][];
  value: string;
  onChange: (value: string) => void;
  /** Room above, for a group under a panel's title. */
  space?: "none" | "above";
}

/**
 * A row of chips, one of them pressed: a filter or a mode. Base UI's toggle group, one choice at a time. Tab reaches the group once and
 * the arrow keys move between chips without pressing them; Enter or Space presses one. Pressing the pressed chip again keeps it pressed,
 * so something is always chosen, and tells the page again. A value that isn't among the chips (a filter the page's select set) leaves none pressed.
 */
export function ChipGroup({ label, choices, value, onChange, space }: ChipGroupProps) {
  return (
    <ToggleGroup
      aria-label={label}
      value={[value]}
      onValueChange={(next) => {
        // Pressing the pressed chip lets go of it in Base UI; here it stays pressed, and the page still hears it (the route clears a highlight).
        onChange(next[0] ?? value);
      }}
      className={chipGroup({ space })}
    >
      {choices.map(([key, text]) => (
        <Toggle
          key={key}
          value={key}
          className="min-h-10 rounded-button border border-line bg-surface px-3.5 py-2 text-[13px] leading-[1.4] font-bold text-muted hover:border-control-line data-pressed:border-soft-line data-pressed:bg-soft data-pressed:text-soft-ink phone:px-[11px]"
        >
          {text}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}

/** How much of something is done, as a thin bar: Base UI's progress, named by `label` and read as a percentage. It is as wide as what holds it. */
export function ProgressBar({ done, total, label }: { done: number; total: number; label: string }) {
  return (
    <Progress.Root value={pct(done, total)} aria-label={label} className="mt-[3px]">
      <Progress.Track className="h-1.5 overflow-hidden rounded-[20px] bg-bar-track">
        <Progress.Indicator className="block h-full rounded-[inherit] bg-primary" />
      </Progress.Track>
    </Progress.Root>
  );
}

export function Breadcrumb({ current }: { current: string }) {
  return (
    <div className="breadcrumb">
      <Icon name={brand.icon} />
      <span>{brand.game}</span>
      <Icon name="right" />
      <strong>{current}</strong>
    </div>
  );
}

// A card on the dashboard and the sources page, and a guide's own panels (Koholint's deathless run, Red Dead's calibration).
const panel = cva("rounded-card border border-line bg-surface px-[18px] py-[17px]", {
  variants: { space: { none: "", above: "mt-[13px]", below: "mb-3.5" } },
  defaultVariants: { space: "none" },
});

type SectionProps = Omit<ComponentPropsWithRef<"section">, "className" | "style">;

/** A panel: its title, its words and its actions are the Panel parts below; `space` is the room it keeps from what's next to it. */
export function Panel({ space, ...rest }: SectionProps & { space?: "none" | "above" | "below" }) {
  return <section className={panel({ space })} {...rest} />;
}

export function PanelTitle({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="m-0 font-display text-[24px] leading-[1.2] font-bold tracking-[-0.015em]">
      {children}
    </h2>
  );
}

// What a panel says: muted as a rule, in ink for a result the reader asked for, in the error colour for what went wrong.
const panelText = cva("mt-[7px] mb-0 text-[14px]", {
  variants: { tone: { muted: "text-muted", ink: "text-ink", error: "text-error" } },
  defaultVariants: { tone: "muted" },
});

export function PanelText({ tone, ...rest }: Omit<ComponentPropsWithRef<"p">, "className" | "style"> & { tone?: "muted" | "ink" | "error" }) {
  return <p className={panelText({ tone })} {...rest} />;
}

/** A form in a panel, under its words: the fields and their buttons. The panel's code checks the values, so the browser's own checks are off. */
export function PanelForm(props: Omit<ComponentPropsWithRef<"form">, "className" | "style">) {
  return <form noValidate className="mt-3" {...props} />;
}

/** A panel's one big number, with what it counts beside it: a run's deaths. */
export function PanelFigure({ value, unit }: { value: number; unit: string }) {
  return (
    <p className="mt-3 mb-0 text-[38px] leading-none font-extrabold tabular-nums">
      {value}
      <small className="ml-1.5 text-[14px] text-muted">{unit}</small>
    </p>
  );
}

/** A row of buttons in a panel. */
export function PanelActions(props: Omit<ComponentPropsWithRef<"div">, "className" | "style">) {
  return <div className="mt-[13px] flex flex-wrap items-center gap-2" {...props} />;
}

export const Empty = ({ children }: { children: ReactNode }) => <div className="empty">{children}</div>;

export function PageHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="page-heading">
      <h1>{title}</h1>
      {children}
    </header>
  );
}

/** A category label, coloured by the category's tone. */
export function Tag({ tag, children }: { tag: string; children?: ReactNode }) {
  return (
    <span className="tag" data-tone={tag === "missable" ? "missable" : cats[tag]?.[3]}>
      {children ?? cats[tag]?.[1] ?? (tag === "missable" ? "Missable" : tag)}
    </span>
  );
}

/** "+3" for a row whose amount counts toward the guide's quantity category. */
export function Quantity({ row }: { row: Row }) {
  const tag = config.quantity ?? "";
  return (
    <Tag tag={tag}>
      +{row.quantity}
      <span className="sr-only"> {tagName(tag)}</span>
    </Tag>
  );
}

export function SourceLine({ sources }: { sources: [label: string, url: string][] }) {
  if (!sources.length) return null;
  return (
    <p className="group-sources">
      Sources:{" "}
      {sources.map(([label, url], index) => (
        <span key={url}>
          {index > 0 && " · "}
          <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`}>
            {label}
          </a>
        </span>
      ))}
    </p>
  );
}
