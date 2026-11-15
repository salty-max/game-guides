import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router";
import { buttonClass } from "../components/buttonStyle";
import { Icon } from "../components/Icon";
import { ArticleRoute } from "../components/ArticleRoute";
import { ChecklistRoute } from "../components/ChecklistRoute";
import { MissablesStrip } from "../components/MissablesStrip";
import { NextUp } from "../components/NextUp";
import { SourceLinks } from "../components/SourceLinks";
import { Breadcrumb, Button, LinkButton } from "../components/ui";
import { CHAPTER_COUNT, chapterRows, chapters, completion, config, guideAnchor, overall, readChapter, text } from "../guide";
import { two } from "../format";
import { useReveal } from "../useReveal";
import { isOpen, useProgress } from "../store/progress";
import type { Chapter } from "../types";

export function GuidePage() {
  const { chapter: param, entry } = useParams();
  const savedChapter = useProgress((s) => s.data.chapter);
  const ceiling = useProgress((s) => s.data.ceiling);
  const visitChapter = useProgress((s) => s.visitChapter);
  const reveal = useReveal();
  const chapterId = readChapter(param, savedChapter);
  const open = useProgress((s) => isOpen(s.data, chapterId));
  const target = guideAnchor(chapterId, entry);

  useEffect(() => {
    if (open) visitChapter(chapterId);
  }, [open, chapterId, visitChapter]);

  if (!open) {
    return (
      <>
        <Breadcrumb current={`Chapter ${chapterId}`} />
        <div className="page-heading">
          <h1>Chapter {chapterId} is hidden</h1>
          <p>Revealing it also reveals every chapter before it.</p>
        </div>
        <Button look="" icon="unlock" onClick={() => reveal(chapterId, target ? entry : undefined)}>
          Reveal chapter
        </Button>{" "}
        <LinkButton to={`/guide/${ceiling}`}>Back to your guide</LinkButton>
      </>
    );
  }

  // Re-mount per chapter so held lists and filters never leak into the next one.
  return <GuideView key={chapterId} chapter={chapters[chapterId - 1]} target={target} />;
}

function GuideView({ chapter, target }: { chapter: Chapter; target?: string }) {
  const { key: locationKey } = useLocation();
  const checks = useProgress((s) => s.data.checks);
  const nextOpen = useProgress((s) => isOpen(s.data, chapter.id + 1));
  const reveal = useReveal();
  const path = `/guide/${chapter.id}`;
  const rows = chapterRows(chapter);
  const firstLeft = rows.find((row) => checks[row.id] !== true);
  const started = rows.some((row) => checks[row.id] === true);

  // Arrive at a linked section or entry, focused, every time the link is followed.
  useEffect(() => {
    if (!target) return;
    const element = document.getElementById(target);
    const focusable = element?.hasAttribute("tabindex") ? element : (element?.querySelector<HTMLElement>('[role="checkbox"], button') ?? element);
    focusable?.focus({ preventScroll: true });
    element?.scrollIntoView({ block: "start" });
  }, [target, locationKey]);

  const footer = (
    <>
      <nav className="end-nav" aria-label="Chapter navigation">
        <span>
          {chapter.id > 1 && (
            <LinkButton to={`/guide/${chapter.id - 1}`} icon="left">
              Previous chapter
            </LinkButton>
          )}
        </span>
        {chapter.id === CHAPTER_COUNT ? (
          <LinkButton to="/dashboard" look="" icon="chart">
            View progress
          </LinkButton>
        ) : nextOpen ? (
          <LinkButton to={`/guide/${chapter.id + 1}`} look="" icon="arrow">
            Next chapter
          </LinkButton>
        ) : (
          <Button look="" icon="unlock" onClick={() => reveal(chapter.id + 1)}>
            Reveal next chapter
          </Button>
        )}
      </nav>
      <SourceLinks items={[...chapter.sources, [text.allSourcesLink, "/sources"]]} />
    </>
  );

  return (
    <>
      <Breadcrumb current={chapter.title} />
      <section className="hero">
        {config.banners[chapter.id] && (
          <img className="hero-art" src={config.banners[chapter.id]} alt="" width={1800} height={600} fetchPriority="high" />
        )}
        <div className="hero-content">
          <div className="hero-meta">
            <span className="kicker">
              Chapter {two(chapter.id)} / {two(CHAPTER_COUNT)}
            </span>
            <span>{chapter.region}</span>
          </div>
          <h1>{chapter.title}</h1>
          <p>{chapter.intro}</p>
          <div className="hero-actions">
            {config.layout === "article" ? (
              <LinkButton to={`${path}/${chapter.groups[0].key}`} look="accent" icon="down">
                Read walkthrough
              </LinkButton>
            ) : (
              <LinkButton to={`${path}/${firstLeft?.id ?? chapter.groups[0].key}`} look="accent" icon="play">
                {started ? "Resume route" : "Start walkthrough"}
              </LinkButton>
            )}
            <LinkButton to={`/checklist/all/${chapter.id}`} icon="checkList">
              Chapter checklist
            </LinkButton>
          </div>
        </div>
      </section>
      <NextUp chapter={chapter.id} />
      <MissablesStrip chapter={chapter} />
      <Link className="summary-strip" to="/dashboard">
        <SummaryFigure />
        <span className={buttonClass("link", "default")}>
          Progress <Icon name="right" />
        </span>
      </Link>
      {config.layout === "article" ? (
        <ArticleRoute chapter={chapter} target={target} footer={footer} />
      ) : (
        <ChecklistRoute key={target ?? ""} chapter={chapter} target={target} footer={footer} />
      )}
    </>
  );
}

function SummaryFigure() {
  const checks = useProgress((s) => s.data.checks);
  const { done, total, percent } = overall(checks);
  return percent === null ? (
    <span>
      <strong>{done}</strong> of {total} entries checked
    </span>
  ) : (
    <span>
      <strong>{percent}%</strong> {completion.overall!.label}
    </span>
  );
}
