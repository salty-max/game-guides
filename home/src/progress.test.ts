// @vitest-environment jsdom
import { cookiesOf, parseSummary, summaryCookie, wireProgress } from "./progress";

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
