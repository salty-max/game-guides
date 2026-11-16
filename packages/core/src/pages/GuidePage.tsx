import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router";
import { buttonClass } from "../components/buttonStyle";
import { Icon } from "../components/Icon";
import { ArticleRoute } from "../components/ArticleRoute";
import { ChapterHero } from "../components/ChapterHero";
import { ChapterNav } from "../components/ChapterNav";
import { ChecklistRoute } from "../components/ChecklistRoute";
import { MissablesStrip } from "../components/MissablesStrip";
import { NextUp } from "../components/NextUp";
import { SourceLinks } from "../components/SourceLinks";
import { Breadcrumb, Button, LinkButton, PageHeading } from "../components/ui";
import { chapterRows, chapters, completion, config, guideAnchor, overall, readChapter, text } from "../guide";
import { useReveal } from "../useReveal";
import { isOpen, useProgress } from "../store/progress";
import type { Chapter } from "../types";
import { press } from "../components/press-style";

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
        <PageHeading title={`Chapter ${chapterId} is hidden`} intro="Revealing it also reveals every chapter before it." />
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
      <ChapterNav chapter={chapter.id} in={config.layout === "article" ? "article" : "route"} />
      <SourceLinks items={[...chapter.sources, [text.allSourcesLink, "/sources"]]} />
    </>
  );

  return (
    <>
      <Breadcrumb current={chapter.title} />
      <ChapterHero chapter={chapter} banner={config.banners[chapter.id]}>
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
      </ChapterHero>
      <NextUp chapter={chapter.id} />
      <MissablesStrip chapter={chapter} />
      <Link
        className={`${press} mt-3.5 mb-[26px] flex min-h-11 items-center justify-between gap-3 rounded-card border border-line bg-surface px-4 py-1.5 text-[14px] hover:border-control-line`}
        to="/dashboard"
      >
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

const figure = "text-[18px] tabular-nums";

function SummaryFigure() {
  const checks = useProgress((s) => s.data.checks);
  const { done, total, percent } = overall(checks);
  return percent === null ? (
    <span>
      <strong className={figure}>{done}</strong> of {total} entries checked
    </span>
  ) : (
    <span>
      <strong className={figure}>{percent}%</strong> {completion.overall!.label}
    </span>
  );
}
