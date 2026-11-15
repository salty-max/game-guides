import { Collapsible } from "@base-ui/react/collapsible";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { Icon } from "./Icon";
import { BulkCheck } from "./BulkCheck";
import { CheckBox } from "./CheckBox";
import { Quantity, SourceLine, Tag } from "./ui";
import type { Chapter, Group, Row } from "../types";

/** The chapter as prose: one section per group, each step's opening sentence is its checkbox. */
export function ArticleRoute({ chapter, target, footer }: { chapter: Chapter; target?: string; footer: ReactNode }) {
  const current = chapter.groups.find((group) => group.key === target || group.rows.some((row) => `entry-${row.id}` === target))?.key;
  const links = (
    <ul className="m-0 grid list-none gap-[3px] p-0">
      {chapter.groups.map((group) => (
        <li key={group.key}>
          <Link
            className="block rounded-tag px-1.5 py-2 text-[14px] leading-[1.4] text-muted no-underline hover:bg-surface hover:text-primary aria-[current=location]:bg-surface aria-[current=location]:font-bold aria-[current=location]:text-primary"
            to={`/guide/${chapter.id}/${group.key}`}
            aria-current={current === group.key ? "location" : undefined}
          >
            {group.title}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="walkthrough-layout">
      {/* Up to 1000px wide the list of sections folds away above the article; wider, it sits beside it. */}
      <Collapsible.Root className="hidden max-w-[72ch] rounded-small border border-line bg-surface px-3 [@media(max-width:1000px)]:block">
        <Collapsible.Trigger className="group/trigger flex min-h-11 w-full cursor-pointer items-center justify-between border-0 bg-transparent p-0 text-left font-sans text-[14px] leading-tight font-bold text-ink">
          In this chapter <Icon name="down" className="svg-icon size-4 text-muted group-data-panel-open/trigger:rotate-180" />
        </Collapsible.Trigger>
        <Collapsible.Panel hiddenUntilFound>
          <nav className="mb-2" aria-label="In this chapter">
            {links}
          </nav>
        </Collapsible.Panel>
      </Collapsible.Root>
      <article className="walkthrough-article" aria-label={`${chapter.title} walkthrough`}>
        {chapter.groups.map((group) => (
          <Section key={group.key} group={group} target={target} />
        ))}
        {footer}
      </article>
      <nav
        className="sticky top-[calc(var(--bar)+24px)] max-h-[calc(100dvh-var(--bar)-44px)] scrollbar-thin overflow-auto border-s border-line pt-1 pr-1.5 pb-[5px] pl-[17px] standalone:top-6 [@media(max-width:1000px)]:hidden"
        aria-label="In this chapter"
      >
        <h2 className="mt-0 mb-[0.6rem] text-[14px] leading-tight font-bold text-ink">In this chapter</h2>
        {links}
      </nav>
    </div>
  );
}

function Section({ group, target }: { group: Group; target?: string }) {
  return (
    <section className="walkthrough-section" aria-labelledby={group.key}>
      <header className="walkthrough-heading">
        <h2 id={group.key} tabIndex={-1}>
          {group.title}
        </h2>
        {group.location && <p>{group.location}</p>}
        {group.note && <p className="walkthrough-note">{group.note}</p>}
        <BulkCheck rows={group.rows} label={group.title} />
      </header>
      {group.compact ? (
        <ul className="walkthrough-list">
          {group.rows.map((row) => (
            <li key={row.id} id={`entry-${row.id}`} tabIndex={-1} className={target === `entry-${row.id}` ? "linked" : undefined}>
              <label className="walkthrough-check">
                <CheckBox id={`walkthrough-${row.id}`} row={row} />
                {row.title}
              </label>
              <Badges row={row} />
              {row.text && <span className="walkthrough-list-text">{row.text}</span>}
            </li>
          ))}
        </ul>
      ) : (
        group.rows.map((row) => (
          <p key={row.id} id={`entry-${row.id}`} tabIndex={-1} className={target === `entry-${row.id}` ? "walkthrough-paragraph linked" : "walkthrough-paragraph"}>
            <label className="walkthrough-check">
              <CheckBox id={`walkthrough-${row.id}`} row={row} />
              {row.title}
              {/[.!?]$/.test(row.title) ? "" : "."}
            </label>{" "}
            <Badges row={row} />
            {row.text}
          </p>
        ))
      )}
      <SourceLine sources={group.sources} />
    </section>
  );
}

function Badges({ row }: { row: Row }) {
  return (
    <>
      {row.quantity > 0 && (
        <>
          <Quantity row={row} />{" "}
        </>
      )}
      {row.tags.includes("missable") && (
        <>
          <Tag tag="missable" />{" "}
        </>
      )}
    </>
  );
}
