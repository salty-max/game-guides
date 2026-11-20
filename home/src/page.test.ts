// @vitest-environment jsdom
// The page as the build makes it, from every guide's own files: a guide in apps/ that doesn't show here fails.
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { wireFind } from "./find";
import { wireProgress } from "./progress";
import { APPS, readGuides, type Guide } from "./guides";
import { make, type Made } from "./plugin";

const deployed = readdirSync(APPS).filter((name) => existsSync(join(APPS, name, "vercel.json")));

describe("the landing page", () => {
  let made: Made;
  let guides: Guide[];
  beforeAll(async () => {
    [made, guides] = await Promise.all([make(), readGuides()]);
    document.body.innerHTML = made.home;
  });

  const bands = () => [...document.querySelectorAll<HTMLElement>("[data-guide]")];

  it("shows every guide, linking to its own address", async () => {
    const links = bands().map((band) => band.querySelector<HTMLAnchorElement>("h3 a")!.href.replace(/\/$/, ""));
    expect(links.length).toBe(deployed.length);
    for (const folder of deployed) {
      const guide = guides.find((each) => each.folder === folder)!;
      const link = document.querySelector(`.g-${folder} h3 a`);
      expect(link, `${folder} is on the page`).not.toBeNull();
      expect(link!.getAttribute("href"), folder).toBe(guide.home);
      expect(link!.textContent, folder).toBe(guide.mark);
    }
    expect(new Set(links).size).toBe(links.length);
  });

  it("counts them, and says the order", () => {
    expect(document.querySelector("#guides")!.textContent).toBe(`${deployed.length} guides · A to Z by game`);
  });

  it("gives each band its banner and tile from the build, the first two loaded at once and the rest as they come near", () => {
    for (const [index, band] of bands().entries()) {
      const art = band.querySelector<HTMLImageElement>("img.art")!;
      expect(art.getAttribute("srcset")).toMatch(/^\/assets\/\S+\.webp \d+w(, \/assets\/\S+\.webp \d+w)*$/);
      for (const url of art.getAttribute("srcset")!.split(", ").map((entry) => entry.split(" ")[0].slice(1))) expect(made.files.has(url), url).toBe(true);
      expect(art.getAttribute("alt")).toBe("");
      expect(art.getAttribute("loading"), `band ${index + 1}`).toBe(index < 2 ? null : "lazy");
      expect(made.files.has(band.querySelector("img.tile")!.getAttribute("src")!.slice(1))).toBe(true);
    }
  });

  it("ships each display font with its licence, the palettes, and an icon with one arc per guide", () => {
    const css = [...made.files].find(([path]) => /^assets\/guides-\w+\.css$/.test(path))![1] as string;
    for (const folder of deployed) expect(css, folder).toContain(`.g-${folder}{`);
    expect([...made.files.keys()].filter((path) => path.startsWith("fonts/") && path.endsWith("-OFL.txt")).length).toBeGreaterThan(0);
    for (const [, url] of css.matchAll(/url\(\/([^)]+)\)/g)) expect(made.files.has(url), url).toBe(true);
    expect((made.files.get("favicon.svg") as string).match(/<path /g)?.length).toBe(deployed.length);
    expect(made.head).toContain('rel="preload"');
  });

  it("says nothing it can't stand behind about where progress lives", () => {
    // Ticks leave the browser only through sync. Not "your progress": Count my visits, on by default, sends which chapters a tick started
    // or finished (core's counts.ts), with nothing that names the reader.
    expect(document.body.textContent).toContain("Your ticks stay in your browser unless you link a device to sync them.");
    expect(document.body.textContent).toContain("not affiliated with the games’ publishers");
  });

  it("narrows the guides as a reader types in Find, and shows the field only when its script runs", () => {
    const field = document.querySelector<HTMLElement>("[data-find]")!;
    expect(field.hidden).toBe(true);
    wireFind(document);
    expect(field.hidden).toBe(false);
    const input = field.querySelector("input")!;
    const type = (value: string) => {
      input.value = value;
      input.dispatchEvent(new Event("input"));
    };
    const first = bands()[0];
    type(first.dataset.guide!.split(" ")[0]);
    expect(first.hidden).toBe(false);
    type("no game is called this");
    expect(bands().every((band) => band.hidden)).toBe(true);
    expect(document.querySelector("[data-find-status]")!.textContent).toBe("No guide matches “no game is called this”.");
    type("");
    expect(bands().some((band) => band.hidden)).toBe(false);
    expect(document.querySelector("[data-find-status]")!.textContent).toBe("");
  });

  it("names each band by its guide's brand id, and shows a started guide's progress from its cookie, the others as they were", () => {
    expect(bands().map((band) => band.dataset.id).sort()).toEqual(guides.filter((guide) => deployed.includes(guide.folder)).map((guide) => guide.id).sort());
    const before = document.body.innerHTML;
    expect(wireProgress(document, "")).toBe(0);
    expect(document.body.innerHTML).toBe(before);
    const [first, second] = bands();
    expect(wireProgress(document, `hundo_link=abc; hundo_p_${first.dataset.id}=1.57.6`)).toBe(1);
    expect(first.querySelector(".meta")!.textContent).toBe("57% complete · Chapter 6");
    expect(first.querySelector(".btn")!.textContent).toBe("Continue");
    expect(first.querySelector<HTMLElement>(".mine-bar i")!.style.width).toBe("57%");
    expect(second.querySelector(".mine-bar")).toBeNull();
    expect(second.querySelector(".btn")!.textContent).toMatch(/^Open /);
  });

  it("has a page for an unknown address that leads back", () => {
    document.body.innerHTML = made.notFound;
    expect(document.querySelector("h1")!.textContent).toBe("Nothing here.");
    expect(document.querySelector("a.back")!.getAttribute("href")).toBe("/");
  });
});
