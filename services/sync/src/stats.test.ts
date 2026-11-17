import { describe, expect, it } from "vitest";
import { COUNT_BUDGET } from "./app";
import { World, link } from "./harness";
import { formatStats, lastDays, readStats } from "./stats";

describe("pnpm stats", () => {
  it("sums each guide's counts over the days asked for, oldest first, and leaves older days out", async () => {
    expect(lastDays(Date.UTC(2026, 10, 15, 12), 3)).toEqual(["2026-11-13", "2026-11-14", "2026-11-15"]);
    const world = new World();
    const d = world.device();
    await d.count({ "v:app": 1, "p:guide/2": 1 });
    world.advance(86_400_000);
    await d.count({ "v:tab": 1, "p:guide/2": 2, "s:2": 1, "f:1": 1 });
    await d.count({ "v:tab": 1 }, { guide: "red-dead-redemption" });
    const now = world.clock.now;

    const two = await readStats(world.store, { ns: "prod", now, days: 2 });
    expect(two.guides.find((g) => g.guide === "links-awakening")?.totals).toEqual({ "v:app": 1, "v:tab": 1, "p:guide/2": 3, "s:2": 1, "f:1": 1 });
    expect(two.guides.find((g) => g.guide === "red-dead-redemption")?.totals).toEqual({ "v:tab": 1 });
    expect(two.budget).toBeGreaterThan(0);
    const one = await readStats(world.store, { ns: "prod", now, days: 1 });
    expect(one.guides.find((g) => g.guide === "links-awakening")?.totals["v:app"]).toBeUndefined();
    expect((await readStats(world.store, { ns: "test", now, days: 2 })).guides.every((g) => Object.keys(g.totals).length === 0)).toBe(true);
  });

  it("counts groups by size and those with two devices synced in 30 days, and never prints a device's label", async () => {
    const world = new World();
    const { a, b } = await link(world);
    await a.sync({}, {});
    await b.sync({}, {});
    const lone = await link(world);
    world.advance(31 * 86_400_000);
    await lone.a.sync({}, {});
    const stats = await readStats(world.store, { ns: "prod", now: world.clock.now, days: 30 });
    expect(stats.groups).toEqual({ bySize: { 2: 2 }, groups: 2, activePairs: 0 });
    await b.sync({}, {});
    await a.sync({}, {});
    expect((await readStats(world.store, { ns: "prod", now: world.clock.now, days: 30 })).groups.activePairs).toBe(1);

    const text = formatStats(stats, COUNT_BUDGET.prod);
    expect(text).toContain("Sync groups now: 2 (2 of 2 devices)");
    for (const label of ["Test device", "Second device"]) expect(text).not.toContain(label);
  });

  it("prints a block per guide: visits and the app's share, pages, each chapter shown, started and finished, links", async () => {
    const world = new World();
    const d = world.device();
    await d.count({ "v:app": 3, "v:tab": 1, "p:guide/10": 1, "p:guide/2": 4, "s:2": 2, "f:2": 1, "p:checklist": 2 });
    await d.claim((await world.device().show()).code, "x", undefined, { guide: "links-awakening" });
    const text = formatStats(await readStats(world.store, { ns: "prod", now: world.clock.now, days: 30 }), COUNT_BUDGET.prod);
    expect(text).toContain("links-awakening\n  visits 4: installed app 3 (75%), tab 1\n  pages: checklist 2, progress 0, sources 0\n  chapter 2: shown 4, started 2, finished 1\n  chapter 10: shown 1, started 0, finished 0\n  devices linked 1");
    expect(text).toContain("echoes-of-wisdom\n  visits 0: installed app 0 (–), tab 0");
    expect(text).toMatch(/Counting has used \d+ of its 100000 commands this month/);
  });
});
