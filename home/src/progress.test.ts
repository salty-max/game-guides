// @vitest-environment jsdom
import { combine, cookiesOf, fetchGroupSummaries, groupSummaries, parseSummary, summaryCookie, wireGroup, wireProgress, type GroupSummaries } from "./progress";

describe("a guide's summary", () => {
  it("reads the format, the figure and the chapter, as the API writes them", () => {
    expect(parseSummary("1.57.6")).toEqual({ percent: 57, chapter: 6 });
    expect(parseSummary("1.0.1")).toEqual({ percent: 0, chapter: 1 });
    expect(parseSummary("1.100.999")).toEqual({ percent: 100, chapter: 999 });
  });

  it("reads nothing else: no cookie, a later format, a figure past 100, chapter 0, padding or text", () => {
    for (const text of [undefined, "", "2.57.6", "1.101.6", "1.57.0", "1.057.6", "1.57.06", "1.57", "1.57.6.1", "57", "1.-1.6", "1.5a.6", " 1.57.6"]) {
      expect(parseSummary(text), String(text)).toBeNull();
    }
  });

  it("is found by the guide's cookie, among the others", () => {
    const cookies = cookiesOf("hundo_link=abc; hundo_p_silksong=1.23.4;hundo_p_links-awakening=1.57.6");
    expect(cookies.get(summaryCookie("silksong"))).toBe("1.23.4");
    expect(cookies.get(summaryCookie("links-awakening"))).toBe("1.57.6");
    expect(cookies.get(summaryCookie("hollow-knight"))).toBeUndefined();
  });
});

describe("the bands", () => {
  const band = (id: string, goals = true) => `
    <li class="cell" data-guide="x" data-id="${id}"><div class="world"><div class="text">
      <h3><a href="https://x.hundo.quest">X</a></h3>${goals ? '<p class="goals">46 Grubs</p>' : ""}
      <div class="row"><span class="btn" aria-hidden="true">Open X<svg></svg></span><span class="meta">9 chapters · 406 checks</span></div>
    </div></div></li>`;

  it("show a started guide's figure and chapter, a Continue, and a bar as wide as the figure", () => {
    document.body.innerHTML = `<ul>${band("silksong")}${band("hollow-knight")}</ul>`;
    expect(wireProgress(document, "hundo_p_silksong=1.23.4")).toBe(1);
    const [started, other] = document.querySelectorAll<HTMLElement>("[data-id]");
    expect(started.classList.contains("started")).toBe(true);
    expect(started.querySelector(".meta")!.textContent).toBe("23% complete · Chapter 4");
    expect(started.querySelector(".meta strong")!.textContent).toBe("23%");
    expect(started.querySelector(".mine")!.textContent).toBe("23% complete · Chapter 4");
    expect(started.querySelector(".goals + .mine")).not.toBeNull();
    expect(started.querySelector(".btn")!.textContent).toBe("Continue");
    expect(started.querySelector(".btn svg")).not.toBeNull();
    const bar = started.querySelector<HTMLElement>(".world > .mine-bar")!;
    expect(bar.getAttribute("aria-hidden")).toBe("true");
    expect(bar.querySelector("i")!.style.width).toBe("23%");
    expect(other.classList.contains("started")).toBe(false);
    expect(other.querySelector(".meta")!.textContent).toBe("9 chapters · 406 checks");
  });

  it("put the words under the name when the guide has no goals line", () => {
    document.body.innerHTML = `<ul>${band("silksong", false)}</ul>`;
    wireProgress(document, "hundo_p_silksong=1.5.2");
    expect(document.querySelector("h3 + .mine")!.textContent).toBe("5% complete · Chapter 2");
  });

  it("stay as they are with no cookie, or one they can't read", () => {
    document.body.innerHTML = `<ul>${band("silksong")}</ul>`;
    const before = document.body.innerHTML;
    expect(wireProgress(document, "")).toBe(0);
    expect(wireProgress(document, "hundo_p_silksong=2.23.4; hundo_p_silksong-x=1.2.3")).toBe(0);
    expect(document.body.innerHTML).toBe(before);
  });
});

describe("a browser linked by sync", () => {
  const band = (id: string) => `
    <li class="cell" data-guide="x" data-id="${id}"><div class="world"><div class="text">
      <h3><a href="https://x.hundo.quest">X</a></h3><p class="goals">46 Grubs</p>
      <div class="row"><span class="btn" aria-hidden="true">Open X<svg></svg></span><span class="meta">9 chapters · 406 checks</span></div>
    </div></div></li>`;
  const group = (entries: [string, { percent: number; chapter: number } | null][]) => async (): Promise<GroupSummaries> => new Map(entries);
  const LINKED = "hundo_link=AbC-12_xyz";

  it("asks nothing when it isn't linked, or its link cookie isn't one", async () => {
    const read = vi.fn(group([["silksong", { percent: 9, chapter: 1 }]]));
    document.body.innerHTML = `<ul>${band("silksong")}</ul>`;
    for (const cookie of ["", "hundo_p_silksong=1.23.4", "hundo_link=", "hundo_link=a b", `hundo_link=${"a".repeat(33)}`, "hundo_linked=abc"]) {
      expect(await wireGroup(document, cookie, read), cookie).toBe(0);
    }
    expect(read).not.toHaveBeenCalled();
  });

  it("shows the higher figure of the group's and the cookie's, the group's on a tie, and nothing after a reset elsewhere", () => {
    const [low, high] = [{ percent: 12, chapter: 2 }, { percent: 31, chapter: 5 }];
    expect(combine(high, low)).toBe(high);
    expect(combine(low, high)).toBe(high);
    expect(combine(low, null)).toBe(low);
    expect(combine({ percent: 12, chapter: 4 }, low)).toEqual({ percent: 12, chapter: 4 });
    expect(combine(null, high)).toBeNull();
  });

  it("draws what the group holds over the cookies: a higher figure, a guide only another device has, and a reset puts the band back", async () => {
    document.body.innerHTML = `<ul>${band("silksong")}${band("hollow-knight")}${band("links-awakening")}${band("echoes-of-wisdom")}${band("silksong-x")}</ul>`;
    const first = document.body.innerHTML;
    const cookie = `${LINKED}; hundo_p_silksong=1.23.4; hundo_p_hollow-knight=1.40.5; hundo_p_echoes-of-wisdom=1.12.2; hundo_p_silksong-x=1.60.8`;
    expect(wireProgress(document, cookie)).toBe(4);
    const read = group([
      ["silksong", { percent: 31, chapter: 5 }],
      ["links-awakening", { percent: 7, chapter: 1 }],
      ["hollow-knight", null],
      // this browser's own progress, not yet brought to the group, is ahead of it
      ["silksong-x", { percent: 20, chapter: 3 }],
    ]);
    expect(await wireGroup(document, cookie, read)).toBe(4);
    const [silksong, hollow, links, echoes, ahead] = document.querySelectorAll<HTMLElement>("[data-id]");
    expect(ahead.querySelector(".meta")!.textContent).toBe("60% complete · Chapter 8");
    expect(silksong.querySelector(".meta")!.textContent).toBe("31% complete · Chapter 5");
    expect(silksong.querySelectorAll(".mine")).toHaveLength(1);
    expect(silksong.querySelectorAll(".mine-bar")).toHaveLength(1);
    expect(silksong.querySelector<HTMLElement>(".mine-bar i")!.style.width).toBe("31%");
    expect(links.classList.contains("started")).toBe(true);
    expect(links.querySelector(".mine")!.textContent).toBe("7% complete · Chapter 1");
    // a guide the group doesn't know keeps its cookie
    expect(echoes.querySelector(".meta")!.textContent).toBe("12% complete · Chapter 2");
    // reset on another device: as a first visit sees it
    expect(hollow.classList.contains("started")).toBe(false);
    expect(hollow.outerHTML).toBe(new DOMParser().parseFromString(`<ul>${band("hollow-knight")}</ul>`, "text/html").querySelector("li")!.outerHTML);
    // and the group's answer drawn again changes nothing
    const once = document.body.innerHTML;
    await wireGroup(document, cookie, read);
    expect(document.body.innerHTML).toBe(once);
    expect(first).not.toBe(once);
  });

  it("leaves a band the group agrees with as it is, so keyboard focus on its link stays", async () => {
    document.body.innerHTML = `<ul>${band("silksong")}</ul>`;
    const cookie = `${LINKED}; hundo_p_silksong=1.23.4`;
    wireProgress(document, cookie);
    const link = document.querySelector<HTMLAnchorElement>("h3 a")!;
    link.focus();
    await wireGroup(document, cookie, group([["silksong", { percent: 23, chapter: 4 }]]));
    expect(document.activeElement).toBe(link);
    expect(link.isConnected).toBe(true);
  });

  it("keeps the cookies' bands when the group can't say", async () => {
    document.body.innerHTML = `<ul>${band("silksong")}</ul>`;
    wireProgress(document, `${LINKED}; hundo_p_silksong=1.23.4`);
    const before = document.body.innerHTML;
    expect(await wireGroup(document, LINKED, async () => null)).toBe(0);
    expect(document.body.innerHTML).toBe(before);
  });

  it("reads the API's answer, and nothing in it that isn't a summary", () => {
    const read = groupSummaries({
      summaries: {
        silksong: { percent: 31, chapter: 5 },
        "hollow-knight": null,
        a: { percent: 101, chapter: 5 },
        b: { percent: 3.5, chapter: 5 },
        c: { percent: 3, chapter: 0 },
        d: { percent: "3", chapter: 1 },
        e: "1.3.1",
        f: [3, 1],
      },
    });
    expect(read).toEqual(new Map([["silksong", { percent: 31, chapter: 5 }], ["hollow-knight", null]]));
    for (const body of [null, {}, { summaries: null }, { summaries: [] }, { summaries: "x" }, "x"]) expect(groupSummaries(body), JSON.stringify(body)).toBeNull();
  });

  it("asks the page's own /api, with its cookies, and takes only a good answer", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response('{"summaries":{"silksong":{"percent":9,"chapter":1}}}', { status: 200 }));
    expect(await fetchGroupSummaries()).toEqual(new Map([["silksong", { percent: 9, chapter: 1 }]]));
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/summaries");
    expect(init).toMatchObject({ method: "POST", credentials: "same-origin", cache: "no-store", body: '{"p":1}' });
    expect((init!.headers as Record<string, string>)["Content-Type"]).toBe("application/json");
    fetchSpy.mockResolvedValueOnce(new Response('{"error":"unlinked"}', { status: 401 }));
    expect(await fetchGroupSummaries()).toBeNull();
    fetchSpy.mockRejectedValueOnce(new TypeError("offline"));
    expect(await fetchGroupSummaries()).toBeNull();
    fetchSpy.mockResolvedValueOnce(new Response("<html>", { status: 200 }));
    expect(await fetchGroupSummaries()).toBeNull();
    fetchSpy.mockRestore();
  });
});
