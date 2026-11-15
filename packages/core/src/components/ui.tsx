import { cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";
import { Icon, type IconName } from "./Icon";
import { brand, cats, config, tagName } from "../guide";
import type { Row } from "../types";
import { pct } from "../format";

/** `""` is the primary look. */
export type ButtonStyle = "" | "outline" | "accent" | "danger";
export type ButtonSize = "default" | "compact";

// A button's padding reads --button-px, so a container can narrow it (the hero's actions on a phone) without a class on the button.
// Each look names its own border colour: one set in the base would fight the looks' for the same property.
const button = cva("inline-flex items-center justify-center gap-2 rounded-button border leading-[1.22] font-extrabold [&_.svg-icon]:size-4", {
  variants: {
    look: {
      primary: "border-transparent bg-primary text-on-primary not-disabled:hover:bg-primary-hover",
      outline: "border-control-line bg-surface text-primary not-disabled:hover:bg-raised",
      accent: "border-accent bg-accent text-on-accent not-disabled:hover:border-accent-hover not-disabled:hover:bg-accent-hover",
      danger: "border-transparent bg-danger text-on-danger",
    },
    size: {
      default: "min-h-11 px-(--button-px,18px) py-2.25 text-sm",
      compact: "min-h-10 px-(--button-px,14px) py-1.5 text-[13px]",
    },
  },
});

const buttonClass = (look: ButtonStyle, size: ButtonSize) => button({ look: look || "primary", size });

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

export function IconButton({ label, icon, className = "icon-button", ...rest }: { label: string; icon: IconName } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={className} aria-label={label} {...rest}>
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
