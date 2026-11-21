import { useState } from "react";
import { byId } from "./guide";
import type { Row } from "./types";

/**
 * Keeps a short list steady while the reader ticks things in it. Without this, a ticked step drops out
 * of "Next up" / "Don't miss" and every row below it jumps up under the pointer. The list is held from
 * the first tick until `release` is called or every held tick is undone.
 */
export function useHeldRows(fresh: Row[], checks: Record<string, true>) {
  const [held, setHeld] = useState<string[] | null>(null);
  const holding = held !== null && held.some((id) => checks[id] === true);
  // A hold whose ticks were all undone is spent, so it lets go at once (adjusting state during render, as RouteGroup does). Kept, the next
  // tick would hold the old list and drop a row that came in since from under the pointer, and a tick from another device or tab on one
  // of its rows would bring the old list back. The box's tick and its hold land in the same render, so a fresh hold is never let go early.
  if (held !== null && !holding) setHeld(null);
  const rows = holding ? held.flatMap((id) => byId.get(id) ?? []) : fresh;
  return {
    rows,
    holding,
    /** Call when a checkbox in the list changes (before the new state lands). */
    hold: () => setHeld((current) => (holding ? current : fresh.map((row) => row.id))),
    release: () => setHeld(null),
  };
}
