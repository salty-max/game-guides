import { act, render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Head } from "./components/Head";
import { brand, chapters, config } from "./guide";
import { defaultState } from "./progress-state";
import { headFor, INDEXED_PATHS, type HeadContext } from "./search";
import { useProgress } from "./store/progress";
import { allowSlowMounts } from "./test/slow";

allowSlowMounts();

const chapterTitles = chapters.map((chapter) => chapter.title);
const chips = config.chips.checklist.map(([, label]) => label);
/** A first visit, which is what a crawler always is: chapter 1 open, the rest hidden. */
const fresh: HeadContext = { brand, chapterTitles, chips, savedChapter: 1, open: (n) => n <= 1 };
const allOpen: HeadContext = { ...fresh, open: () => true };
const head = (path: string, context = fresh) => headFor(path, context);
const last = chapters.length;
const entry = chapters[0].groups[0].rows[0].id;

describe("what search engines get (search.ts)", () => {
  it("indexes the three pages, each its own canonical on the guide's address", () => {
    for (const path of INDEXED_PATHS) expect(head(path), path).toMatchObject({ canonical: brand.home + path, noindex: false });
    expect(head("/guide/1")).toMatchObject({ title: brand.title, description: brand.description });
  });

  it("names its page as the canonical of every other address", () => {
    const cases: [string, string][] = [
      ["/", "/guide/1"],
      ["/guide", "/guide/1"],
      [`/guide/1/${entry}`, "/guide/1"],
      ["/guide/99", "/guide/1"],
      ["/nope", "/guide/1"],
      ["/sources", "/guide/1"],
      ["/checklist/all/3", "/checklist"],
      [`/checklist/${chips[0]}`, "/checklist"],
      ["/dashboard/left", "/dashboard"],
    ];
    for (const [path, canonical] of cases) expect(head(path).canonical, path).toBe(brand.home + canonical);
    // (the chapter `/` opens at is the reader's own)
    expect(head("/", { ...allOpen, savedChapter: 2 }).canonical).toBe(`${brand.home}/guide/2`);
  });

  it("says noindex on a hidden chapter, and nowhere else", () => {
    for (let n = 2; n <= last; n++) {
      expect(head(`/guide/${n}`), `${n}`).toMatchObject({ title: `Chapter ${n} is hidden · ${brand.name}`, noindex: true });
      expect(head(`/guide/${n}`, allOpen).noindex).toBe(false);
    }
  });

  it("never puts a later chapter's name in a title or description a first visit can reach", () => {
    const paths = [...INDEXED_PATHS, "/", "/nope", "/checklist/all/2", ...chapters.flatMap(({ id }) => [`/guide/${id}`, `/guide/${id}/x`])];
    for (const title of chapterTitles.slice(1)) {
      for (const path of paths) {
        const { title: shown, description } = head(path);
        expect(`${shown} ${description}`, `${path} names "${title}"`).not.toContain(title);
      }
    }
  });

  it("titles a revealed chapter by its name, for the reader who revealed it", () => {
    expect(head(`/guide/${last}`, allOpen).title).toBe(`Chapter ${last}: ${chapterTitles[last - 1]} · ${brand.name}`);
  });

  it("names the game in every indexed page's description, which stays short enough to show whole in a result", () => {
    for (const path of INDEXED_PATHS) {
      const { title, description } = head(path);
      expect(description, path).toContain(brand.game);
      expect(description.length, description).toBeLessThanOrEqual(160);
      expect(title.length, title).toBeLessThanOrEqual(70);
    }
    expect(head("/checklist").description).toContain(chips.slice(0, 3).join(", "));
  });
});

describe("Head", () => {
  beforeEach(() => {
    useProgress.setState({ data: defaultState(), storageError: false });
    document.head.innerHTML = `<title>${brand.title}</title><meta name="description" content="${brand.description}">`;
  });

  const tags = () => ({
    title: document.title,
    titles: document.head.querySelectorAll("title").length,
    descriptions: [...document.head.querySelectorAll('meta[name="description"]')].map((meta) => meta.getAttribute("content")),
    canonicals: [...document.head.querySelectorAll('link[rel="canonical"]')].map((link) => link.getAttribute("href")),
    robots: document.head.querySelector('meta[name="robots"]')?.getAttribute("content") ?? null,
  });

  it("edits the shell's title and description in place and adds one canonical", () => {
    render(
      <MemoryRouter initialEntries={["/checklist/all/1"]}>
        <Head />
      </MemoryRouter>,
    );
    const expected = head("/checklist");
    expect(tags()).toEqual({ title: expected.title, titles: 1, descriptions: [expected.description], canonicals: [expected.canonical], robots: null });
  });

  it("follows the reveal: noindex while a chapter is hidden, gone once it is revealed at the same address", () => {
    render(
      <MemoryRouter initialEntries={["/guide/2"]}>
        <Head />
      </MemoryRouter>,
    );
    expect(tags()).toMatchObject({ title: `Chapter 2 is hidden · ${brand.name}`, robots: "noindex", canonicals: [`${brand.home}/guide/2`] });
    act(() => useProgress.getState().reveal(2));
    expect(tags()).toMatchObject({ title: `Chapter 2: ${chapterTitles[1]} · ${brand.name}`, robots: null, canonicals: [`${brand.home}/guide/2`] });
  });
});
