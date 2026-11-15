import { ExternalLink } from "../components/SourceLinks";
import { Breadcrumb, PageHeading, Panel, PanelTitle } from "../components/ui";
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
        <Panel>
          <PanelTitle>{text.sourcesTitle ?? "References"}</PanelTitle>
          <ul className="source-list">
            {config.sources.map(([label, url]) => (
              <li key={url}>
                <ExternalLink label={label} url={url} />
              </li>
            ))}
          </ul>
        </Panel>
      )}
      {revealed.length > 0 && (
        <Panel space="above">
          <PanelTitle>Walkthrough references</PanelTitle>
          {revealed.map((chapter) => (
            <div key={chapter.id}>
              <h3 className="mt-[13px] mb-0 text-[15px] leading-[1.17] font-bold">{chapter.title}</h3>
              <ul className="source-list">
                {chapter.sources.map(([label, url]) => (
                  <li key={url}>
                    <ExternalLink label={label} url={url} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Panel>
      )}
    </>
  );
}
