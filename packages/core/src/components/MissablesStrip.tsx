import { Collapsible } from "@base-ui/react/collapsible";
import { cva } from "class-variance-authority";
import { Icon } from "./Icon";
import { TickItem } from "./TickItem";
import { config, hasMissables, missablesLeft, missableWhy } from "../guide";
import { useHeldRows } from "../useHeldRows";
import { useProgress } from "../store/progress";
import type { Chapter } from "../types";

/**
 * "Don't miss" strip for a chapter: the unchecked entries that can be lost for good. While the guide flags
 * nothing at all, it says so instead, with the sources behind that claim.
 */
export function MissablesStrip({ chapter }: { chapter: Chapter }) {
  if (!hasMissables) return config.reassurance ? <Reassurance {...config.reassurance} /> : null;
  // Re-mount per chapter so a held list never leaks into the next one.
  return <MissablesList key={chapter.id} chapter={chapter} />;
}

// The strip's frame and its header, which opens and closes it.
const frame = cva("mt-4 rounded-card border bg-surface", { variants: { tone: { clear: "border-line", flagged: "border-missable-line" } } });
const caret = cva("size-4 flex-none text-muted group-data-panel-open/trigger:rotate-180", { variants: { at: { top: "mt-1", middle: "" } } });

function Reassurance({ text, sources }: NonNullable<typeof config.reassurance>) {
  return (
    <Collapsible.Root render={<aside />} className={frame({ tone: "clear" })} aria-label="Missable entries">
      <Collapsible.Trigger className="group/trigger flex min-h-12 w-full cursor-pointer items-start justify-between gap-2.5 border-0 bg-transparent px-4 py-2.5 text-left font-sans text-[14px] leading-normal text-muted phone:px-3">
        <span>
          <strong className="font-extrabold text-ink">Nothing is flagged as permanently missable.</strong> {text}
        </span>
        <Icon name="down" className={caret({ at: "top" })} />
      </Collapsible.Trigger>
      <Collapsible.Panel hiddenUntilFound>
        <ul className="m-0 list-none px-4 pb-2.5">
          {sources.map(([label, url]) => (
            <li key={url} className="py-[3px]">
              <a className="text-[14px] text-primary underline underline-offset-[3px]" href={url} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

function MissablesList({ chapter }: { chapter: Chapter }) {
  const checks = useProgress((s) => s.data.checks);
  const { rows, hold } = useHeldRows(missablesLeft(chapter, checks), checks);
  if (!rows.length) return null;
  const left = rows.filter((row) => checks[row.id] !== true).length;
  return (
    <Collapsible.Root render={<aside />} defaultOpen className={frame({ tone: "flagged" })} aria-label="Missable entries">
      <Collapsible.Trigger className="group/trigger flex min-h-12 w-full cursor-pointer items-center justify-between gap-2.5 border-0 bg-transparent px-4 py-3 text-left font-sans text-base text-inherit phone:px-3">
        <strong className="font-display text-[24px] leading-[1.2] font-bold tracking-[-0.015em]">Don’t miss before moving on</strong>
        <span className="ml-auto flex items-center gap-2.5 text-[12px] whitespace-nowrap text-muted tabular-nums">
          {left} left
          <Icon name="down" className={caret({ at: "middle" })} />
        </span>
      </Collapsible.Trigger>
      <Collapsible.Panel hiddenUntilFound>
        <ul className="m-0 list-none px-4 pb-2">
          {rows.map((row) => (
            <TickItem
              key={row.id}
              row={row}
              prefix="missable"
              ticked={checks[row.id] === true}
              detail={missableWhy(row.id) ?? row.group}
              jumpLabel={`Jump to “${row.title}”`}
              onToggle={hold}
            />
          ))}
        </ul>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
