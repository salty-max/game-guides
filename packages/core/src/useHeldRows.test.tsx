import { renderHook } from "@testing-library/react";
import { allRows } from "./guide";
import { useHeldRows } from "./useHeldRows";
import type { Checks } from "./types";

const [a, b, c, d] = allRows;
const ids = (rows: { id: string }[]) => rows.map((row) => row.id);

describe("useHeldRows", () => {
  it("lets go of a spent hold, so a tick from another device on one of its rows doesn't bring the old list back", () => {
    const { result, rerender } = renderHook(({ fresh, checks }: { fresh: typeof allRows; checks: Checks }) => useHeldRows(fresh, checks), {
      initialProps: { fresh: [a, b, c], checks: {} },
    });
    result.current.hold();
    rerender({ fresh: [b, c], checks: { [a.id]: true } });
    rerender({ fresh: [a, b, c], checks: {} });
    expect(result.current.holding).toBe(false);
    // Another device ticks b: the list moves on, with nothing held.
    rerender({ fresh: [a, c, d], checks: { [b.id]: true } });
    expect(result.current.holding).toBe(false);
    expect(ids(result.current.rows)).toEqual(ids([a, c, d]));
  });

  it("holds the list from the first tick until every held tick is undone, then takes the list as it is now on the next", () => {
    const { result, rerender } = renderHook(({ fresh, checks }: { fresh: typeof allRows; checks: Checks }) => useHeldRows(fresh, checks), {
      initialProps: { fresh: [a, b, c], checks: {} },
    });
    result.current.hold();
    rerender({ fresh: [b, c], checks: { [a.id]: true } });
    expect(ids(result.current.rows)).toEqual(ids([a, b, c]));
    expect(result.current.holding).toBe(true);
    // Untick it: the hold is spent. Meanwhile the list changes without a held row being ticked (a chapter revealed brings d in first).
    rerender({ fresh: [d, a, b], checks: {} });
    expect(result.current.holding).toBe(false);
    expect(ids(result.current.rows)).toEqual(ids([d, a, b]));
    // Ticking d holds the list as it is now, d included. The spent hold ([a, b, c]) has no tick in it, so it would let go and d would
    // drop out from under the pointer.
    result.current.hold();
    rerender({ fresh: [a, b, c], checks: { [d.id]: true } });
    expect(result.current.holding).toBe(true);
    expect(ids(result.current.rows)).toEqual(ids([d, a, b]));
  });
});
