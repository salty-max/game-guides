import { Collapsible } from "@base-ui/react/collapsible";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { Icon } from "./Icon";
import { BulkCheck } from "./BulkCheck";
import { CheckBox } from "./CheckBox";
import { LineChips } from "./LineChip";
import { MapLink } from "./MapLink";
import { Quantity, Tag } from "./ui";
import type { Chapter, Group, Row } from "../types";
import { press, pressText } from "./press-style";

/** The chapter as prose: one section per group, each step's opening sentence is its checkbox. */
export function ArticleRoute({ chapter, target, footer }: { chapter: Chapter; target?: string; footer: ReactNode }) {
  const current = chapter.groups.find((group) => group.key === target || group.rows.some((row) => `entry-${row.id}` === target))?.key;
  const links = (
    <ul className="m-0 grid list-none gap-[3px] p-0">
      {chapter.groups.map((group) => (
        <li key={group.key}>
          <Link
            className={`${press} block rounded-tag px-1.5 py-2 text-[14px] leading-[1.4] text-muted no-underline hover:bg-surface hover:text-primary aria-[current=location]:bg-surface aria-[current=location]:font-bold aria-[current=location]:text-primary`}
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
    <div className="mt-[clamp(24px,3vw,40px)] grid grid-cols-[minmax(0,1fr)_minmax(174px,218px)] items-start gap-[clamp(24px,4vw,66px)] fold:grid-cols-[minmax(0,1fr)] fold:gap-6">
      {/* Up to 1000px wide the list of sections folds away above the article; wider, it sits beside it. */}
      <Collapsible.Root className="hidden rounded-small border border-line bg-surface px-3 fold:block">
        <Collapsible.Trigger className={`${press} group/trigger flex min-h-11 w-full cursor-pointer items-center justify-between border-0 bg-transparent p-0 text-left font-sans text-[14px] leading-tight font-bold text-ink`}>
          In this chapter <Icon name="down" className="size-4 text-muted group-data-panel-open/trigger:rotate-180" />
        </Collapsible.Trigger>
        <Collapsible.Panel hiddenUntilFound>
          <nav className="mb-2" aria-label="In this chapter">
            {links}
          </nav>
        </Collapsible.Panel>
      </Collapsible.Root>
      <article className="min-w-0" aria-label={`${chapter.title} walkthrough`}>
        {chapter.groups.map((group) => (
          <Section key={group.key} group={group} target={target} />
        ))}
        {footer}
      </article>
      <nav
        className="sticky top-[calc(var(--bar)+24px)] max-h-[calc(100dvh-var(--bar)-44px)] scrollbar-thin overflow-auto border-s border-line pt-1 pr-1.5 pb-[5px] pl-[17px] standalone:top-6 fold:hidden"
        aria-label="In this chapter"
      >
        <h2 className="mt-0 mb-[0.6rem] text-[14px] leading-tight font-bold text-ink">In this chapter</h2>
        {links}
      </nav>
    </div>
  );
}

// A step's opening words, which hold its box: clicking them ticks it. In prose they run on into the step's text; in a compact list they
// sit on one line with the badges after them.
const check = cva(`${pressText} cursor-pointer font-extrabold hover:text-primary`, { variants: { in: { prose: "py-1.5", list: "flex items-center" } } });

// A step, as a paragraph of prose or a line of a compact list. Linked to (a deep link), it stands out on the page's own colour with a bar of
// the accent at its start.
const entry = cva("scroll-mt-4", {
  variants: {
    in: {
      prose: "leading-[1.8] [&+&]:mt-[.85rem]",
      list: "flex flex-wrap items-center gap-x-2 gap-y-0.5 border-t border-line-soft py-[9px] first:border-t-0",
    },
    linked: { true: "rounded-[3px] bg-paper [box-shadow:-3px_0_var(--accent)]", false: "" },
  },
});

function Section({ group, target }: { group: Group; target?: string }) {
  return (
    <section className="rounded-card border border-line bg-surface p-[clamp(14px,2.2vw,26px)] [&+&]:mt-4" aria-labelledby={group.key}>
      <header className="mb-[.85rem]">
        <h2 id={group.key} tabIndex={-1} className="font-display text-[clamp(25px,3vw,37px)] leading-[1.18] font-bold tracking-[-0.015em]">
          {group.title}
        </h2>
        {group.location && <p className="mt-[.35rem] text-[14px] font-semibold text-muted">{group.location}</p>}
        {group.note && <p className="mt-[.35rem] text-[14px] text-muted">{group.note}</p>}
        {group.map && (
          <p className="mt-[.35rem]">
            <MapLink map={group.map} of={group.title} at="group" />
          </p>
        )}
        <BulkCheck rows={group.rows} label={group.title} space="above" />
      </header>
      {group.compact ? (
        <ul className="m-0 list-none p-0">
          {group.rows.map((row) => (
            <li key={row.id} id={`entry-${row.id}`} tabIndex={-1} className={entry({ in: "list", linked: target === `entry-${row.id}` })}>
              <label id={`walkthrough-${row.id}-label`} className={check({ in: "list" })}>
                <CheckBox id={`walkthrough-${row.id}`} labelId={`walkthrough-${row.id}-label`} row={row} prose />
                {row.title}
              </label>
              <Badges row={row} />
              {row.map && <MapLink map={row.map} of={row.title} at="row" />}
              <LineChips row={row} at="prose" />
              {/* Under the step's words, not under its box. */}
              {row.text && <span className="basis-full ps-check-indent text-[14px] leading-normal text-muted">{row.text}</span>}
            </li>
          ))}
        </ul>
      ) : (
        group.rows.map((row) => (
          <p key={row.id} id={`entry-${row.id}`} tabIndex={-1} className={entry({ in: "prose", linked: target === `entry-${row.id}` })}>
            <label id={`walkthrough-${row.id}-label`} className={check({ in: "prose" })}>
              <CheckBox id={`walkthrough-${row.id}`} labelId={`walkthrough-${row.id}-label`} row={row} prose />
              {row.title}
              {/[.!?]$/.test(row.title) ? "" : "."}
            </label>{" "}
            <Badges row={row} />
            {row.text}
            {row.map && (
              <>
                {" "}
                <MapLink map={row.map} of={row.title} at="row" />
              </>
            )}
            <LineChips row={row} at="prose" />
          </p>
        ))
      )}
    </section>
  );
}

function Badges({ row }: { row: Row }) {
  return (
    <>
      {row.quantity > 0 && (
        <>
          <Quantity row={row} at="prose" />{" "}
        </>
      )}
      {row.tags.includes("missable") && (
        <>
          <Tag tag="missable" at="prose" />{" "}
        </>
      )}
    </>
  );
}
