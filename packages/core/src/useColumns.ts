import { useCallback, useState } from "react";
import { flushSync } from "react-dom";

/** The tracks a grid laid out, or 0 where it laid out none: a grid out of the page (display:none) gives back its declaration, as jsdom does. */
const tracksOf = (grid: HTMLElement) => getComputedStyle(grid).gridTemplateColumns.split(" ").filter((track) => track.endsWith("px")).length;

/**
 * How many columns a grid lays out at its own width, and the ref to give it. The count is the grid's tracks as CSS resolved them, so the
 * grid's `grid-template-columns` decides and nothing here repeats its numbers; an `auto-fit` grid lists the tracks it collapsed too (as
 * 0px, in Chrome and WebKit alike), so it is how many columns fit, whatever the grid holds.
 *
 * Undefined until the grid is first read, in its ref, as the page commits: React draws the count before the page is shown, so no frame is
 * laid out for the wrong width. A layout effect of that same commit still sees the render before the count, so one that needs the final
 * layout (a scroll) depends on the count itself.
 *
 * Read again inside the window's `resize` event, before the browser lays the page out, and drawn at once (flushSync), so a resize or a
 * rotation never shows a frame of the old layout. The grid can narrow without one too: a classic scrollbar (Windows, or a Mac set to show
 * them) comes as the page grows. A ResizeObserver on the grid catches that, and leaves the drawing to React's own time, a frame later:
 * drawn inside the observer, the other layout changes the grid's own height there, and the browser reports a loop. A kept page that's
 * hidden (Pages) has its ref detached by React, and the listeners with it, and is read again as it comes back. No layout (jsdom): 1.
 */
export function useColumns(): [number | undefined, (grid: HTMLElement | null) => (() => void) | undefined] {
  const [columns, setColumns] = useState<number>();
  const ref = useCallback((grid: HTMLElement | null) => {
    // (React passes null only to a ref that returns no cleanup, which this one always returns once it has a grid.)
    if (!grid) return;
    const read = () => setColumns((was) => tracksOf(grid) || was || 1);
    const resized = () => flushSync(read);
    const observer = new ResizeObserver(read);
    read();
    window.addEventListener("resize", resized);
    observer.observe(grid);
    return () => {
      window.removeEventListener("resize", resized);
      observer.disconnect();
    };
  }, []);
  return [columns, ref];
}
