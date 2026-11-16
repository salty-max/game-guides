import { useEffect, useRef } from "react";

// Back and Forward, heard ahead of the router. React draws the page a Back goes to within the router's own listener, hiding the page left
// (Pages), so what must happen while that page is still on screen has to run first. Browsers call a window's listeners in the order they
// were added, so this one is added as the guide loads: main.tsx imports this module before anything that mounts the router.
const waiting = new Set<() => void>();
addEventListener("popstate", () => waiting.forEach((run) => run()));

/** Runs `run` on Back or Forward while `on`, before the page being left goes out of sight. */
export function useBeforeBack(run: () => void, on: boolean) {
  const latest = useRef(run);
  useEffect(() => {
    latest.current = run;
  });
  useEffect(() => {
    if (!on) return;
    const call = () => latest.current();
    waiting.add(call);
    return () => void waiting.delete(call);
  }, [on]);
}
