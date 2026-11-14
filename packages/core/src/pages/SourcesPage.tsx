import { ExternalLink } from "../components/SourceLinks";
import { Breadcrumb, PageHeading } from "../components/ui";
import { chapters, config, text } from "../guide";
import { isOpen, useProgress } from "../store/progress";

export function SourcesPage() {
  const data = useProgress((s) => s.data);
  const revealed = chapters.filter((chapter) => isOpen(data, chapter.id) && chapter.sources.length);
  return (
    <>
      <Breadcrumb current="Sources" />
      <PageHeading title="Sources and maps">
        <p>{text.sourcesIntro}</p>
      </PageHeading>
      {config.sources.length > 0 && (
        <section className="panel">
          <h2>{text.sourcesTitle ?? "References"}</h2>
          <ul className="source-list">
            {config.sources.map(([label, url]) => (
              <li key={url}>
                <ExternalLink label={label} url={url} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {revealed.length > 0 && (
        <section className="panel source-panel">
          <h2>Walkthrough references</h2>
          {revealed.map((chapter) => (
            <div key={chapter.id}>
              <h3>{chapter.title}</h3>
              <ul className="source-list">
                {chapter.sources.map(([label, url]) => (
                  <li key={url}>
                    <ExternalLink label={label} url={url} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
