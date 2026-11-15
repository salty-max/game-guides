import { cva } from "class-variance-authority";

/** The rail's "Walkthrough" heading: a plain line beside the page, the drawer's title under 800px. */
export const railHeading = "mb-2.5 px-[9px] text-[12px] font-extrabold tracking-[0.16em] text-muted uppercase";

// The rail's column: beside the page it scrolls on its own under the sticky top bar (in the installed app, the frame's row holds it);
// in the drawer it fills the drawer, which is what scrolls.
export const railPanel = cva(
  "flex flex-col gap-[22px] bg-rail pt-[25px] pr-[15px] pb-[calc(16px+var(--safe-bottom))] pl-[calc(15px+var(--safe-left))] text-ink standalone:select-none standalone:[-webkit-touch-callout:none]",
  {
    variants: {
      frame: {
        column:
          "sticky top-(--bar) h-[calc(100dvh-var(--bar))] scrollbar-thin [scrollbar-color:var(--edge)_var(--rail)] self-start overflow-auto border-r border-line standalone:relative standalone:top-auto standalone:h-auto standalone:self-stretch",
        drawer: "min-h-full",
      },
    },
  },
);
