import { Progress } from "@base-ui/react/progress";
import { cva } from "class-variance-authority";
import { overall, overallText } from "../guide";
import { useProgress } from "../store/progress";

const track = cva("overflow-hidden rounded-[20px] bg-bar-track", { variants: { size: { thin: "h-1.5", thick: "h-2.5" } } });

function Track({ size }: { size: "thin" | "thick" }) {
  return (
    <Progress.Track className={track({ size })}>
      {/* (Base UI sets its width; the change eases, and doesn't move at all for a reader who asks for less motion: app.css) */}
      <Progress.Indicator className="block h-full rounded-[inherit] bg-primary transition-[width] duration-200 ease-out" />
    </Progress.Track>
  );
}

interface OverallBarProps {
  /** The figure, already rounded down (guide.ts's `overall`). */
  percent: number;
  /** The words after it: "complete", "estimated in-game completion". */
  label: string;
  /** The entries a weighted figure counts beside it (Red Dead's), or null. */
  entries: { done: number; total: number } | null;
  /** The rail's (and the chapters drawer's) compact line, or the Progress page's hero. */
  place: "rail" | "page";
}

/**
 * The guide's overall completion: Base UI's progress, named by its visible label and read as the figure shown. One fill and nothing
 * else: no chapter's share and no mark for what's revealed, which would tell how big the hidden chapters are, and nothing that names what's
 * left. Not a link: a progressbar inside one muddles the link's name, and the Progress page is a tab away. `data-nosnippet`, so a search
 * result never quotes a first visit's "0%".
 */
export function OverallBar({ percent, label, entries, place }: OverallBarProps) {
  // A progressbar's children are presentational, so what the hero shows beside the figure is said in its value text too.
  const text = place === "page" && entries ? `${overallText(percent, label)}, ${entries.done} of ${entries.total} entries` : overallText(percent, label);
  if (place === "rail") {
    return (
      <Progress.Root value={percent} getAriaValueText={() => text} data-nosnippet="" className="grid gap-2 rounded-card border border-line bg-surface px-2.5 pt-2.5 pb-3">
        <span className="flex items-baseline justify-between gap-2">
          <Progress.Label className="text-13 font-bold">Overall completion</Progress.Label>
          <Progress.Value className="text-16 font-extrabold tabular-nums">{() => `${percent}%`}</Progress.Value>
        </span>
        <Track size="thin" />
      </Progress.Root>
    );
  }
  return (
    <Progress.Root value={percent} getAriaValueText={() => text} data-nosnippet="" className="grid gap-2.5">
      <Progress.Label className="text-12 font-extrabold tracking-[0.16em] text-muted uppercase">Overall completion</Progress.Label>
      <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1.5">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <Progress.Value className="text-38 leading-none font-extrabold tabular-nums">{() => `${percent}%`}</Progress.Value>
          <span className="text-16 font-bold">{label}</span>
        </span>
        {entries && (
          <span className="text-14 text-muted tabular-nums">
            {entries.done} of {entries.total} entries
          </span>
        )}
      </span>
      <Track size="thick" />
    </Progress.Root>
  );
}

/** The overall bar for the reader's progress: in the rail and the chapters drawer (Rail.tsx), and on the Progress page. */
export function Overall({ place }: { place: "rail" | "page" }) {
  const checks = useProgress((s) => s.data.checks);
  return <OverallBar {...overall(checks)} place={place} />;
}
