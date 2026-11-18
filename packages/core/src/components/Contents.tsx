import { Collapsible } from "@base-ui/react/collapsible";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { Icon } from "./Icon";
import { pressClasses } from "./press-style";

/** One part of a page in its list of contents: its address, and its title as the page shows it. */
export interface ContentsLink {
  key: string;
  title: string;
  to: string;
}

/**
 * A page's parts with a list that jumps to each (the chapter's "In this chapter", the Progress page's "On this page"). The list stands
 * beside the parts, under the top bar as the page scrolls, where the wrapper (`/contents`: a container can't query itself) is 52rem or
 * more, so the parts keep a column of about 570px at the least; under that it folds away above them. Its width decides, not the screen's.
 * `label` names the list, its toggle and its landmark; `current` is the part the address names. `children` is the column of parts, one
 * element, which keeps its own width (`min-w-0`).
 */
export function Contents({ label, links, current, children }: { label: string; links: ContentsLink[]; current?: string; children: ReactNode }) {
  const list = (
    <ul className="m-0 grid list-none gap-1 p-0">
      {links.map((link) => (
        <li key={link.key}>
          <Link
            className={`${pressClasses} block rounded-tag px-1.5 py-2 text-14 leading-[1.4] text-muted no-underline hover:bg-surface hover:text-primary aria-[current=location]:bg-surface aria-[current=location]:font-bold aria-[current=location]:text-primary`}
            to={link.to}
            aria-current={current === link.key ? "location" : undefined}
          >
            {link.title}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="@container/contents">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(10.875rem,13.625rem)] items-start gap-[clamp(1.5rem,5.4cqi,4rem)] @max-[52rem]/contents:grid-cols-[minmax(0,1fr)] @max-[52rem]/contents:gap-6">
        <Collapsible.Root className="hidden rounded-small border border-line bg-surface px-3 @max-[52rem]/contents:block">
          <Collapsible.Trigger className={`${pressClasses} group/trigger flex min-h-11 w-full cursor-pointer items-center justify-between border-0 bg-transparent p-0 text-left font-sans text-14/tight font-bold text-ink`}>
            {label} <Icon name="down" className="size-4 text-muted group-data-panel-open/trigger:rotate-180" />
          </Collapsible.Trigger>
          <Collapsible.Panel hiddenUntilFound>
            <nav className="mb-2" aria-label={label}>
              {list}
            </nav>
          </Collapsible.Panel>
        </Collapsible.Root>
        {children}
        <nav
          className="sticky top-[calc(var(--bar)+var(--sticky-gap))] max-h-[calc(100dvh-var(--bar)-var(--sticky-gap)-1.25rem)] scrollbar-thin overflow-auto border-s border-line py-1 pr-1.5 pl-4 @max-[52rem]/contents:hidden standalone:top-(--sticky-gap)"
          aria-label={label}
        >
          <h2 className="mt-0 mb-2.5 text-14/tight font-bold text-ink">{label}</h2>
          {list}
        </nav>
      </div>
    </div>
  );
}
