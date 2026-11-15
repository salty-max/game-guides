import type { ButtonHTMLAttributes, ComponentPropsWithRef, ReactNode } from "react";
import { Link } from "react-router";
import { buttonClass, type ButtonSize, type ButtonStyle } from "./buttonStyle";
import { Icon, type IconName } from "./Icon";
import { brand, cats, config, tagName } from "../guide";
import type { Row } from "../types";
import { pct } from "../format";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "className"> {
  look?: ButtonStyle;
  size?: ButtonSize;
  icon?: IconName;
}

export function Button({ look = "outline", size = "default", icon, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(look, size)} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
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
  "grid h-10 w-(--icon-w,2.5rem) place-items-center rounded-control border border-control-line bg-transparent p-0 text-inherit hover:bg-raised [&_.svg-icon]:size-4.5";

/** A square button with an icon and no words: `label` is what a screen reader says. */
export function IconButton({ label, icon, ...rest }: { label: string; icon: IconName } & Omit<ComponentPropsWithRef<"button">, "className" | "style">) {
  return (
    <button type="button" className={iconButton} aria-label={label} {...rest}>
      <Icon name={icon} />
    </button>
  );
}

export function Chip({ label, value, current, onSelect }: { label: string; value: string; current: string; onSelect: (value: string) => void }) {
  return (
    <button className="chip" type="button" aria-pressed={value === current} onClick={() => onSelect(value)}>
      {label}
    </button>
  );
}

export function ProgressBar({ done, total, label }: { done: number; total: number; label: string }) {
  const value = pct(done, total);
  return (
    <div className="progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <span style={{ width: `${value}%` }} />
    </div>
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
