// A returning reader's progress on each guide they've started: the guide's figure and their chapter, from the cookie the sync API sets for
// it on every hundo.quest host (`hundo_p_<brand.id>`, core's summary.ts). The page only reads it. Without the cookie, or without this
// script, each band shows what it always does.
//
// A browser linked by sync (the `hundo_link` cookie) also asks the API for what its group holds (/api/summaries): the latest summary any of
// its devices sent, an installed iPhone app's included, whose cookies never reach this browser. The cookies are drawn first, at once. Then,
// for each guide the group knows, the higher figure of the two shows, and a guide reset on another device shows as not started; a guide
// the group doesn't know keeps its cookie. Not linked, the page makes no request.

/** What a guide's cookie says: its overall figure, as its own Progress page shows it, and the chapter the reader was last in. */
export type Summary = { percent: number; chapter: number };

/** The cookie's name for a guide, as the API names it. */
export const summaryCookie = (id: string) => `hundo_p_${id}`;

/** The cookie the sync API sets on a linked browser, readable by script, as core's sync reads it (sync/local.ts, readHint). */
const LINK_COOKIE = "hundo_link";
export const linked = (cookies: Map<string, string>) => /^[A-Za-z0-9_-]{1,32}$/.test(cookies.get(LINK_COOKIE) ?? "");

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

/** Each band as the page first had it, kept the first time a summary is drawn into it, so a later one starts from there. */
const firstLook = new WeakMap<HTMLElement, Node[]>();
/** What each band shows now, so the same summary isn't drawn again (which would take keyboard focus off a link already reached). */
const shown = new WeakMap<HTMLElement, Summary | null>();

/**
 * Draws one guide's progress into its band: the words beside the button (or, in a phone's short band, in the goals' place), and a bar.
 * Null puts the band back as a first visit sees it.
 */
function draw(band: HTMLElement, summary: Summary | null) {
  const now = shown.get(band) ?? null;
  if (now?.percent === summary?.percent && now?.chapter === summary?.chapter) return;
  shown.set(band, summary);
  const kept = firstLook.get(band);
  if (kept) {
    band.replaceChildren(...kept.map((node) => node.cloneNode(true)));
    band.classList.remove("started");
  } else if (summary) firstLook.set(band, [...band.childNodes].map((node) => node.cloneNode(true)));
  if (!summary) return;
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

/** What the group holds, by guide: a summary, or null for a guide whose last word was "nothing checked". */
export type GroupSummaries = Map<string, Summary | null>;

const whole = (value: unknown, min: number, max: number) => Number.isInteger(value) && (value as number) >= min && (value as number) <= max;

/** The API's answer read as the group's summaries, leaving out anything that isn't one; null when the answer isn't one at all. */
export function groupSummaries(body: unknown): GroupSummaries | null {
  const given = (body as { summaries?: unknown } | null)?.summaries;
  if (given === null || typeof given !== "object" || Array.isArray(given)) return null;
  const out: GroupSummaries = new Map();
  for (const [id, value] of Object.entries(given as Record<string, unknown>)) {
    if (value === null) out.set(id, null);
    const { percent, chapter } = (value ?? {}) as Record<string, unknown>;
    if (whole(percent, 0, 100) && whole(chapter, 1, 999)) out.set(id, { percent: percent as number, chapter: chapter as number });
  }
  return out;
}

/** Asks the sync API, through the page's own /api, what the reader's group holds. Null when it can't say: offline, unlinked, an error. */
export async function fetchGroupSummaries(): Promise<GroupSummaries | null> {
  try {
    const response = await fetch("/api/summaries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ p: 1 }),
      credentials: "same-origin",
      cache: "no-store",
    });
    return response.ok ? groupSummaries(await response.json()) : null;
  } catch {
    return null;
  }
}

/**
 * What a band shows for a guide the group knows. The higher figure, the group's on a tie (it may carry a chapter moved to elsewhere): a
 * guide's progress joins the group only when a device opens it after linking, so this browser's own cookie can be ahead of the group's
 * copy. Null, a reset on another device, wins over any cookie (the API keeps it only over a summary the group held), even one ahead for
 * that reason: a reset shows as one.
 */
export const combine = (group: Summary | null, own: Summary | null) => (group === null ? null : own && own.percent > group.percent ? own : group);

/**
 * On a browser linked by sync, draws over the cookies what the group holds, for each guide it knows (combine). Asks nothing of a browser
 * that isn't linked. Returns how many bands the group's answer named.
 */
export async function wireGroup(root: ParentNode = document, cookie = document.cookie, read = fetchGroupSummaries) {
  const cookies = cookiesOf(cookie);
  if (!linked(cookies)) return 0;
  const summaries = await read();
  if (!summaries) return 0;
  let named = 0;
  for (const band of root.querySelectorAll<HTMLElement>("[data-id]")) {
    const id = band.dataset.id ?? "";
    if (!summaries.has(id)) continue;
    draw(band, combine(summaries.get(id)!, parseSummary(cookies.get(summaryCookie(id)))));
    named += 1;
  }
  return named;
}
