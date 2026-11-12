import { ExternalLink } from "../components/SourceLinks";
import { Breadcrumb, PageHeading } from "../components/ui";
import { chapters } from "../lib/guide";
import { isOpen, useProgress } from "../store/progress";

export function SourcesPage() {
  const data = useProgress((s) => s.data);
  return (
    <>
      <Breadcrumb current="Sources" />
      <PageHeading title="Sources and maps">
        <p>The community guides behind each chapter. Chapters you have not revealed are left out.</p>
      </PageHeading>
      {chapters.filter((chapter) => isOpen(data, chapter.id)).map((chapter) => (
        <section className="panel source-panel" key={chapter.id}>
          <h2>
            {chapter.id}. {chapter.title}
          </h2>
          <ul className="source-list">
            {chapter.sources.map(([label, url]) => (
              <li key={url}>
                <ExternalLink label={label} url={url} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
