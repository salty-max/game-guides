import { cva } from "class-variance-authority";

/** `""` is the primary look; `"link"` is words in the primary colour with no box, and ignores the size. */
export type ButtonStyle = "" | "outline" | "accent" | "danger" | "link";
export type ButtonSize = "default" | "compact";

// A button's padding reads --button-px, so what holds it can narrow it (the hero's actions on a phone) without a class on the button.
// Each look names its own border colour: one set in the base would fight the looks' for the same property. A disabled button is
// dimmed and says so to the pointer, whether it is disabled outright or kept focusable (aria-disabled).
const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-button border leading-[1.22] font-extrabold disabled:cursor-not-allowed disabled:opacity-[.46] aria-disabled:cursor-not-allowed aria-disabled:opacity-[.46] [&_svg]:size-4",
  {
    variants: {
      look: {
        primary: "border-transparent bg-primary text-on-primary not-disabled:not-aria-disabled:hover:bg-primary-hover",
        outline: "border-control-line bg-surface text-primary not-disabled:not-aria-disabled:hover:bg-raised",
        accent: "border-accent bg-accent text-on-accent not-disabled:not-aria-disabled:hover:border-accent-hover not-disabled:not-aria-disabled:hover:bg-accent-hover",
        danger: "border-transparent bg-danger text-on-danger",
      },
      size: {
        default: "min-h-11 px-(--button-px,18px) py-2.25 text-sm",
        compact: "min-h-10 px-(--button-px,14px) py-1.5 text-[13px]",
      },
    },
  },
);

// Its own classes, not a look of the box above: it shares none of the box's padding, height, corners or edge.
const link =
  "inline-flex min-h-8 items-center gap-1.5 border-0 bg-transparent px-0 py-1.5 text-[13px] font-extrabold whitespace-nowrap text-primary underline-offset-3 hover:underline disabled:cursor-not-allowed disabled:opacity-[.46] [&_svg]:size-4";

/** The classes of a button of this look and size: for Button and LinkButton, and for a control that has to look like one. */
export const buttonClass = (look: ButtonStyle, size: ButtonSize) => (look === "link" ? link : button({ look: look || "primary", size }));
