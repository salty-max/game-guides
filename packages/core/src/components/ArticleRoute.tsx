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
    <ul className="m-0 grid list-none gap-1 p-0">
      {chapter.groups.map((group) => (
        <li key={group.key}>
          <Link
            className={`${press} block rounded-tag px-1.5 py-2 text-14 leading-[1.4] text-muted no-underline hover:bg-surface hover:text-primary aria-[current=location]:bg-surface aria-[current=location]:font-bold aria-[current=location]:text-primary`}
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
    // The route's own width decides (`/chapter`, the wrapper's: a container can't query itself): under 52rem the list of sections folds
    // away above the article, so it stands beside the article only where the prose keeps a column of its own (about 570px at the least).
    <div className="@container/chapter">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(10.875rem,13.625rem)] items-start gap-[clamp(1.5rem,5.4cqi,4rem)] @max-[52rem]/chapter:grid-cols-[minmax(0,1fr)] @max-[52rem]/chapter:gap-6">
        <Collapsible.Root className="hidden rounded-small border border-line bg-surface px-3 @max-[52rem]/chapter:block">
          <Collapsible.Trigger className={`${press} group/trigger flex min-h-11 w-full cursor-pointer items-center justify-between border-0 bg-transparent p-0 text-left font-sans text-14/tight font-bold text-ink`}>
            In this chapter <Icon name="down" className="size-4 text-muted group-data-panel-open/trigger:rotate-180" />
          </Collapsible.Trigger>
          <Collapsible.Panel hiddenUntilFound>
            <nav className="mb-2" aria-label="In this chapter">
              {links}
            </nav>
          </Collapsible.Panel>
        </Collapsible.Root>
        {/* A container too (`/article`), so a section's padding and title follow the column the article has, folded or not. */}
        <article className="@container/article flex min-w-0 flex-col gap-8" aria-label={`${chapter.title} walkthrough`}>
          <div className="flex flex-col gap-4">
            {chapter.groups.map((group) => (
              <Section key={group.key} group={group} target={target} />
            ))}
          </div>
          {footer}
        </article>
        <nav
          className="sticky top-[calc(var(--bar)+var(--sticky-gap))] max-h-[calc(100dvh-var(--bar)-var(--sticky-gap)-1.25rem)] scrollbar-thin overflow-auto border-s border-line py-1 pr-1.5 pl-4 @max-[52rem]/chapter:hidden standalone:top-(--sticky-gap)"
          aria-label="In this chapter"
        >
          <h2 className="mt-0 mb-2.5 text-14/tight font-bold text-ink">In this chapter</h2>
          {links}
        </nav>
      </div>
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
      prose: "leading-[1.8]",
      list: "flex flex-wrap items-center gap-x-2 gap-y-0.5 border-t border-line-soft py-2 first:border-t-0",
    },
    linked: { true: "rounded-[3px] bg-paper [box-shadow:-3px_0_var(--accent)]", false: "" },
  },
});

// Its padding and title are in `cqi`, which is the nearest container's width, whatever its name: the article's, as long as no container
// is put between the two. One room parts the header from the first step and each step from the next.
function Section({ group, target }: { group: Group; target?: string }) {
  return (
    <section className="flex flex-col gap-3.5 rounded-card border border-line bg-surface p-[clamp(0.875rem,3.75cqi,1.5rem)]" aria-labelledby={group.key}>
      <header className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1.5">
          <h2 id={group.key} tabIndex={-1} className="font-display text-[clamp(1.5625rem,5.4cqi,2.3125rem)] leading-[1.18] font-bold tracking-[-0.015em]">
            {group.title}
          </h2>
          {group.location && <p className="text-14 font-semibold text-muted">{group.location}</p>}
          {group.note && <p className="text-14 text-muted">{group.note}</p>}
          {group.map && (
            <p>
              <MapLink map={group.map} of={group.title} at="group" />
            </p>
          )}
        </div>
        <BulkCheck rows={group.rows} label={group.title} ownLine />
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
              {row.text && <span className="basis-full ps-check-indent text-14/normal text-muted">{row.text}</span>}
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
