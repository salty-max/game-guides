import { ExternalLink } from "../components/SourceLinks";
import { Breadcrumb, PageHeading, Panel, PanelTitle } from "../components/ui";
import { chapters, config, text } from "../guide";
import { isOpen, useProgress } from "../store/progress";

// The references, bulleted, with their links underlined in the primary colour.
const sourceList = "mt-2 mb-0 list-disc pl-5 text-[14px] [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-3";

export function SourcesPage() {
  const data = useProgress((s) => s.data);
  const revealed = chapters.filter((chapter) => isOpen(data, chapter.id) && chapter.sources.length);
  return (
    <>
      <Breadcrumb current="Sources" />
      <PageHeading title="Sources and maps" intro={text.sourcesIntro} />
      {config.sources.length > 0 && (
        <Panel>
          <PanelTitle>{text.sourcesTitle ?? "References"}</PanelTitle>
          <ul className={sourceList}>
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
              <ul className={sourceList}>
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
