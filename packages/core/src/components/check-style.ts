import { cva } from "class-variance-authority";
import { pressClasses } from "./press-style";

// The house tick box, Base UI's Checkbox root: 26px (tokens.css), the guide's check corners, the primary fill once ticked. Shared by the labelled
// Checkbox in settings and the rows' CheckBox. In prose it sits before the words it ticks.
export const checkBox = cva(
  `${pressClasses} relative z-1 inline-flex size-check shrink-0 cursor-pointer items-center justify-center rounded-check border-2 border-edge bg-surface align-middle text-on-primary data-checked:border-primary data-checked:bg-primary`,
  { variants: { at: { line: "", prose: "me-check-gap" } }, defaultVariants: { at: "line" } },
);

/** The tick inside the box, unmounted while the box is clear. */
export const checkMarkClasses = "flex data-unchecked:hidden";

/** The tick's icon, drawn heavier than the house icons so it reads at 16px on the fill, as the old 2.5px mark did. */
export const checkIconClasses = "size-4 stroke-[3.5]";
