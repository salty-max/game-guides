import { cva } from "class-variance-authority";

// The house tick box, Base UI's Checkbox root: 26px, the guide's check corners, the primary fill once ticked. Shared by the labelled
// Checkbox in settings and the rows' CheckBox. In prose it sits before the words it ticks.
export const checkBox = cva(
  "relative z-1 inline-flex size-6.5 shrink-0 cursor-pointer items-center justify-center rounded-check border-2 border-edge bg-surface align-middle text-on-primary [-webkit-tap-highlight-color:transparent] data-checked:border-primary data-checked:bg-primary",
  { variants: { at: { line: "", prose: "me-[.5em]" } }, defaultVariants: { at: "line" } },
);

/** The tick inside the box, unmounted while the box is clear. */
export const checkMark = "flex data-unchecked:hidden";

/** The tick's icon, drawn heavier than the house icons so it reads at 16px on the fill, as the old 2.5px mark did. */
export const checkIcon = "svg-icon size-4 [stroke-width:3.5]";
