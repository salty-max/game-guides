import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import { RouteGroup } from "../components/RouteGroup";
import { Select } from "../components/Select";
import { SearchField } from "../components/SearchField";
import { chunks, loadFailed } from "../components/chunks";
import { ActiveFilter, Button, Callout, ChipGroup, Empty, PageHeading } from "../components/ui";
import { allRows, CHAPTER_COUNT, cats, chapters, config, hasMissables, isCategory, readChapter, statusOptions, tagName, text } from "../guide";
import { two } from "../format";
import { useLoadable, whenIdle } from "../loadable";
import { isOpen, useProgress } from "../store/progress";
import { isPhone, usePhone } from "../useNarrow";

// The Missable filter only exists once something is actually flagged.
const missable: [string, string][] = hasMissables ? [["missable", "Missable"]] : [];
const topFilters: [string, string][] = [["all", "All entries"], ...config.chips.checklist, ...missable];
const categoryChoices: [string, string][] = [["all", "All categories"], ...Object.entries(cats).map(([id, [name]]): [string, string] => [id, name]), ...missable];
const categoryName = new Map(categoryChoices);
const statusName = new Map(statusOptions);
// A category the chips on the page already show pressed isn't repeated among the active filters under the search field.
const quickPicks = new Set(topFilters.map(([key]) => key));

export function ChecklistPage() {
  const { pathname } = useLocation();
  // Re-mount on every route change so URL-driven filters apply fresh.
  return <ChecklistView key={pathname} />;
}

function ChecklistView() {
  const { category, chapter: chapterParam } = useParams();
  const data = useProgress((s) => s.data);
  const [filter, setFilter] = useState(isCategory(category) || (hasMissables && category === "missable") ? category! : "all");
  const [chapterFilter, setChapterFilter] = useState(() =>
    chapterParam && isOpen(data, readChapter(chapterParam)) ? String(readChapter(chapterParam)) : "all",
  );
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  // On a phone the category, chapter and status are in a sheet, behind one button (the chips and the search stay on the page).
  const phone = usePhone();
  const [sheetOpen, setSheetOpen] = useState(false);
  // Widened past a phone's width, the filters are back on the page: the sheet closes, the focus going to the search field.
  if (sheetOpen && !phone) setSheetOpen(false);
  const sheet = useLoadable(chunks.sheet, sheetOpen, () => {
    setSheetOpen(false);
    loadFailed();
  });
  // Fetched ahead only where it can be needed; a window that narrows later loads it when the button is pressed.
  useEffect(
    () =>
      whenIdle(() => {
        if (isPhone()) chunks.sheet.warm();
      }),
    [],
  );
  const filtersButton = useRef<HTMLButtonElement>(null);

  const visible = useMemo(() => allRows.filter((row) => isOpen(data, row.chapter)), [data]);
  const openChapters = chapters.filter((chapter) => isOpen(data, chapter.id));
  // Hiding chapters in settings can strand the chapter filter; fall back to all.
  const effectiveChapter = chapterFilter !== "all" && !isOpen(data, Number(chapterFilter)) ? "all" : chapterFilter;
  const checked = visible.filter((row) => data.checks[row.id] === true).length;

  const needle = query.trim().toLocaleLowerCase();
  const matches = visible.filter(
    (row) =>
      (filter === "all" || row.tags.includes(filter)) &&
      (effectiveChapter === "all" || row.chapter === Number(effectiveChapter)) &&
      (status === "all" || (status === "done") === (data.checks[row.id] === true)) &&
      (!needle ||
        [row.title, row.text, row.location ?? "", row.group, ...row.tags.map(tagName)]
          .join(" ")
          .toLocaleLowerCase()
          .includes(needle)),
  );

  const chapterChoices: [number | string, string][] = [["all", "All revealed"], ...openChapters.map((chapter): [number, string] => [chapter.id, `Chapter ${chapter.id}`])];
  // Removing one takes its chip away, the focus with it: the focus goes to the Filters button, which still says how many are on.
  const active: { key: string; label: string; remove: () => void }[] = [
    ...(filter !== "all" && !quickPicks.has(filter) ? [{ key: "category", label: categoryName.get(filter) ?? filter, remove: () => setFilter("all") }] : []),
    ...(effectiveChapter !== "all" ? [{ key: "chapter", label: `Chapter ${effectiveChapter}`, remove: () => setChapterFilter("all") }] : []),
    ...(status !== "all" ? [{ key: "status", label: statusName.get(status) ?? status, remove: () => setStatus("all") }] : []),
  ];

  // From the page: everything, the search included, and the focus goes to the search field.
  const clear = () => {
    clearFilters();
    setQuery("");
    document.getElementById("search")?.focus();
  };
  // From the sheet: what the sheet sets, and no more (the search behind it stays as typed); the focus stays on the button. A category
  // picked with a chip on the page goes too: the sheet's Category field shows it.
  const clearFilters = () => {
    setFilter("all");
    setChapterFilter("all");
    setStatus("all");
  };
  const matchesLine = `${matches.length} ${matches.length === 1 ? "match" : "matches"}`;
  const search = <SearchField id="search" label="Search entries" placeholder={text.searchPlaceholder} value={query} onChange={setQuery} />;
  const selects = (
    <>
      <Select id="collection-category" label="Category" choices={categoryChoices} value={filter} onChange={setFilter} />
      <Select id="collection-chapter" label="Chapter" choices={chapterChoices} value={effectiveChapter} onChange={setChapterFilter} />
      <Select id="collection-status" label="Status" choices={statusOptions} value={status} onChange={setStatus} />
    </>
  );

  return (
    <>
      <PageHeading title="Completion checklist" intro={text.checklistIntro} />
      {data.spoilers && data.ceiling < CHAPTER_COUNT && (
        <Callout icon="lock">Showing chapters 1–{data.ceiling} only. Later entries unlock as you reveal chapters.</Callout>
      )}
      {phone ? (
        <>
          <ChipGroup label="Checklist categories" choices={topFilters} value={filter} onChange={setFilter} flow="scroll" />
          <div className="mt-2.5 mb-2 flex items-end gap-2">
            <div className="min-w-0 flex-1">{search}</div>
            <Button ref={filtersButton} id="collection-filters" icon="sliders" aria-haspopup="dialog" aria-expanded={sheetOpen}
              aria-label={active.length ? `Filters, ${active.length} on` : undefined}
              onClick={() => setSheetOpen(true)}
            >
              {active.length ? `Filters · ${active.length}` : "Filters"}
            </Button>
          </div>
          {active.length > 0 && (
            <div className="mb-1 flex flex-wrap gap-1.5">
              {active.map(({ key, label, remove }) => (
                <ActiveFilter
                  key={key}
                  label={label}
                  onRemove={() => {
                    remove();
                    filtersButton.current?.focus();
                  }}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <ChipGroup label="Checklist categories" choices={topFilters} value={filter} onChange={setFilter} />
          <div className="my-3 flex flex-wrap items-end gap-[9px]">
            <div className="min-w-[185px] flex-1">{search}</div>
            {selects}
            <Button onClick={() => clear()}>Clear</Button>
          </div>
        </>
      )}
      {/* Stays mounted once loaded, so that it closes the ordinary way (and animates) when the window widens past a phone's. */}
      {sheet && (
        <sheet.Sheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          title="Filters"
          returnFocus={() => (isPhone() ? (filtersButton.current ?? false) : (document.getElementById("search") ?? false))}
          footer={
            <>
              <Button onClick={clearFilters}>Clear</Button>
              <Button look="" onClick={() => setSheetOpen(false)}>{`Show ${matchesLine}`}</Button>
            </>
          }
        >
          {/* Only while on a phone: widened, the same fields are on the page, and the sheet fades out empty. */}
          {phone && <div className="grid gap-4">{selects}</div>}
        </sheet.Sheet>
      )}
      <div className="mb-[13px] flex items-end justify-between gap-[13px] text-[14px] text-muted phone:flex-wrap phone:items-start phone:gap-1">
        <p id="results-count" className="mt-[5px]" role="status">
          {matchesLine}
        </p>
        <p className="mt-[5px]">
          {checked} of {visible.length} revealed entries checked
        </p>
      </div>
      {/* The chapters' groups are third-level headings, as they are under a chapter's route; this is the level between, for a screen reader. */}
      <h2 className="sr-only">Entries</h2>
      <div id="checklist-results">
        {matches.length ? (
          openChapters.map((chapter) => {
            const here = matches.filter((row) => row.chapter === chapter.id);
            return here.length ? (
              <RouteGroup
                key={chapter.id}
                groupKey={`index-${chapter.id}`}
                title={chapter.title}
                location={`Chapter ${two(chapter.id)}`}
                icon="book"
                rows={here}
                open
                highlightedId=""
                origin
                fallbackFocusId={phone ? "collection-filters" : "collection-status"}
                rememberToggle={false}
              />
            ) : null;
          })
        ) : (
          <Empty>Nothing matches. Try changing a filter or search term.</Empty>
        )}
      </div>
    </>
  );
}
