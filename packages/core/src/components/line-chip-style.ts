import { cva } from "class-variance-authority";
import { pressTextClasses } from "./press-style";

// A row's small link to where it belongs (its questline, or the one-way choice it's the later way at), as `rowLinkClasses` is, but its words wrap: a long name ("Laurentius of the Great Swamp · step 2") is wider than a small
// phone's line. In a row's column of tags it keeps to the tags' width on a phone, flush right, as a long tag does.
export const lineChip = cva(
  `${pressTextClasses} relative z-1 -mx-0.5 -my-2 px-0.5 py-2 text-13 font-semibold text-primary underline underline-offset-3 [&_svg]:me-1 [&_svg]:inline [&_svg]:size-3.75 [&_svg]:align-[-0.1875rem]`,
  { variants: { at: { prose: "", column: "phone:max-w-21 phone:text-right" } } },
);
