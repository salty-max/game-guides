import { cva } from "class-variance-authority";
import { pressTextClasses } from "./press-style";

// A row's small link to where it belongs (its questline, or the one-way choice it's the later way at), as `stackedLinkClasses` is, but its words wrap: a long name ("Laurentius of the Great Swamp · step 2") is wider than a small
// phone's line. It has no reach past its words: its box is its tap area, which is why it keeps clear of the box and the links around it wherever it wraps or stacks (axe's `target-size`).
//  - prose: a link in a sentence, inline. Its padding only makes the area it answers to a little taller than the words, the 28.8px line leaves room for it.
//  - list: a flex item of a compact row, which wraps under the step's box when it doesn't fit on its line. 24px tall at least, its words in the middle of it.
//  - column: in a checklist row's column of tags. It keeps to the tags' width on a phone, flush right, as a long tag does.
// (`content-center` centres a block's words in its 24px; where a browser has no align-content for blocks, before Chrome 123 and Safari 17.4, they sit at the top of the same box.)
export const lineChip = cva(
  `${pressTextClasses} relative z-1 text-13 font-semibold text-primary underline underline-offset-3 [&_svg]:me-1 [&_svg]:inline [&_svg]:size-3.75 [&_svg]:align-[-0.1875rem]`,
  {
    variants: {
      at: {
        prose: "py-1",
        list: "block min-h-6 content-center",
        column: "block min-h-6 content-center phone:max-w-21 phone:text-right",
      },
    },
  },
);
