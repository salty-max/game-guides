// A returning reader's progress on each guide they've started: the guide's figure and their chapter, from the cookie the sync API sets for
// it on every hundo.quest host (`hundo_p_<brand.id>`, core's summary.ts). The page only reads it. Without the cookie, or without this
// script, each band shows what it always does.

/** What a guide's cookie says: its overall figure, as its own Progress page shows it, and the chapter the reader was last in. */
export type Summary = { percent: number; chapter: number };

/** The cookie's name for a guide, as the API names it. */
export const summaryCookie = (id: string) => `hundo_p_${id}`;

/** The cookies a page can read, by name. */
export const cookiesOf = (header: string) =>
  new Map(
    header
      .split(";")
      .map((part) => part.trim())
      .filter((part) => part.includes("="))
      .map((part) => [part.slice(0, part.indexOf("=")), part.slice(part.indexOf("=") + 1)]),
  );

/** A cookie's text read as a summary (`1.<percent>.<chapter>`, the 1 its format), or null for anything else, a later format included. */
export function parseSummary(text: string | undefined): Summary | null {
  const found = /^1\.(0|[1-9]\d?|100)\.([1-9]\d{0,2})$/.exec(text ?? "");
  return found ? { percent: Number(found[1]), chapter: Number(found[2]) } : null;
}

/** The words the band shows, the figure in bold. */
const words = (summary: Summary) => {
  const line = document.createDocumentFragment();
  const figure = document.createElement("strong");
  figure.textContent = `${summary.percent}%`;
  line.append(figure, ` complete · Chapter ${summary.chapter}`);
  return line;
};

/** Draws one guide's progress into its band: the words beside the button (or, in a phone's short band, in the goals' place), and a bar. */
function draw(band: HTMLElement, summary: Summary) {
  const meta = band.querySelector(".meta");
  const goals = band.querySelector(".goals");
  const label = band.querySelector(".btn")?.firstChild;
  const world = band.querySelector(".world");
  if (!meta || !world) return;
  band.classList.add("started");
  meta.replaceChildren(words(summary));
  if (label?.nodeType === Node.TEXT_NODE) label.textContent = "Continue";
  const line = document.createElement("p");
  line.className = "mine";
  line.append(words(summary));
  (goals ?? band.querySelector("h3"))?.after(line);
  const bar = document.createElement("span");
  bar.className = "mine-bar";
  bar.setAttribute("aria-hidden", "true");
  const fill = document.createElement("i");
  // Through CSSOM, which the page's CSP (style-src 'self') allows: a style attribute in markup it would refuse.
  fill.style.width = `${summary.percent}%`;
  bar.append(fill);
  world.append(bar);
}

/** Fills in every band whose guide has a summary in the cookies. Returns how many. */
export function wireProgress(root: ParentNode = document, cookie = document.cookie) {
  const cookies = cookiesOf(cookie);
  let started = 0;
  for (const band of root.querySelectorAll<HTMLElement>("[data-id]")) {
    const summary = parseSummary(cookies.get(summaryCookie(band.dataset.id ?? "")));
    if (!summary) continue;
    draw(band, summary);
    started += 1;
  }
  return started;
}
