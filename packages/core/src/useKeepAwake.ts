import { useEffect } from "react";
import { canKeepAwake, useAwake } from "./store/awake";

/**
 * Holds the screen on while the guide is showing, if the reader asked for it in Guide settings. The system lets go of the lock whenever the
 * page is hidden, so it is asked for again each time the page comes back. Where the browser refuses (a battery saver, a policy, or one that
 * wants a press first), the next press asks again. iOS home screen apps before 18.4 say yes and don't hold it: nothing can tell.
 */
export function useKeepAwake() {
  const on = useAwake((s) => s.on);
  useEffect(() => {
    if (!on || !canKeepAwake()) return;
    let lock: WakeLockSentinel | null = null;
    let asking = false;
    let stopped = false;
    const acquire = async () => {
      if (stopped || lock || asking || document.visibilityState !== "visible") return;
      asking = true;
      try {
        const sentinel = await navigator.wakeLock.request("screen");
        // Turned off, or hidden, while the browser was answering: not wanted any more.
        if (stopped || document.visibilityState !== "visible") {
          void sentinel.release();
          return;
        }
        lock = sentinel;
        sentinel.addEventListener("release", () => {
          if (lock === sentinel) lock = null;
        });
      } catch {
        /* refused: the next time the page shows or is pressed asks again */
      } finally {
        asking = false;
      }
    };
    const again = () => void acquire();
    document.addEventListener("visibilitychange", again);
    window.addEventListener("pointerdown", again, { passive: true });
    void acquire();
    return () => {
      stopped = true;
      document.removeEventListener("visibilitychange", again);
      window.removeEventListener("pointerdown", again);
      void lock?.release();
      lock = null;
    };
  }, [on]);
}
