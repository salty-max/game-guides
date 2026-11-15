import { useMemo, useState } from "react";
import { useLocation, useParams } from "react-router";
import { Icon } from "../components/Icon";
import { RouteGroup } from "../components/RouteGroup";
import { Select } from "../components/Select";
import { Breadcrumb, Button, Chip, Empty, PageHeading } from "../components/ui";
import { allRows, CHAPTER_COUNT, cats, chapters, config, hasMissables, isCategory, readChapter, statusOptions, tagName, text } from "../guide";
import { two } from "../format";
import { isOpen, useProgress } from "../store/progress";

// The Missable filter only exists once something is actually flagged.
const missable: [string, string][] = hasMissables ? [["missable", "Missable"]] : [];
const topFilters: [string, string][] = [["all", "All entries"], ...config.chips.checklist, ...missable];
const categoryChoices: [string, string][] = [["all", "All categories"], ...Object.entries(cats).map(([id, [name]]): [string, string] => [id, name]), ...missable];

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

  const clear = () => {
    setFilter("all");
    setChapterFilter("all");
    setStatus("all");
    setQuery("");
    document.getElementById("search")?.focus();
  };

  return (
    <>
      <Breadcrumb current="Checklist" />
      <PageHeading title="Completion checklist">
        <p>{text.checklistIntro}</p>
      </PageHeading>
      {data.spoilers && data.ceiling < CHAPTER_COUNT && (
        <div className="callout">
          <Icon name="lock" />
          <span>Showing chapters 1–{data.ceiling} only. Later entries unlock as you reveal chapters.</span>
        </div>
      )}
      <div className="chips" aria-label="Checklist categories">
        {topFilters.map(([id, label]) => (
          <Chip key={id} label={label} value={id} current={filter} onSelect={setFilter} />
        ))}
      </div>
      <div className="filters">
        <label className="search" htmlFor="search">
          <Icon name="search" />
          <span className="sr-only">Search entries</span>
          <input type="search" id="search" placeholder={text.searchPlaceholder} value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <Select id="collection-category" label="Category" choices={categoryChoices} value={filter} onChange={setFilter} />
        <Select
          id="collection-chapter"
          label="Chapter"
          choices={[["all", "All revealed"], ...openChapters.map((chapter): [number, string] => [chapter.id, `Chapter ${chapter.id}`])]}
          value={effectiveChapter}
          onChange={setChapterFilter}
        />
        <Select id="collection-status" label="Status" choices={statusOptions} value={status} onChange={setStatus} />
        <Button onClick={clear}>Clear</Button>
      </div>
      <div className="subhead">
        <p id="results-count" role="status">
          {matches.length} {matches.length === 1 ? "match" : "matches"}
        </p>
        <p>
          {checked} of {visible.length} revealed entries checked
        </p>
      </div>
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
                fallbackFocusId="collection-status"
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
