import { cva } from "class-variance-authority";
import { Link } from "react-router";
import { Icon } from "./Icon";
import { tones } from "./tone";
import { ProgressBar } from "./ui";
import { cats, tally } from "../guide";
import { useProgress } from "../store/progress";
import { press } from "./press-style";

const statIcon = cva("grid size-7 flex-none place-items-center rounded-small [&_svg]:size-3.75", { variants: { tone: tones }, defaultVariants: { tone: "none" } });

/** A category's count on the dashboard's board: its icon and name, done of its goal, and the bar. It opens the category's checklist. */
export function Stat({ tag, goal }: { tag: string; goal?: number }) {
  const checks = useProgress((s) => s.data.checks);
  const { done, total } = tally(tag, checks);
  const [name, , graphic, tone] = cats[tag];
  return (
    <Link
      className={`${press} flex min-w-0 flex-col gap-2 rounded-card border border-line bg-surface px-3 py-2.5 text-left hover:border-control-line hover:bg-raised`}
      to={`/checklist/${tag}`}
    >
      <span className="flex items-center gap-2 text-12 leading-[1.18] font-extrabold">
        <span className={statIcon({ tone })}>
          <Icon name={graphic} />
        </span>
        {name}
      </span>
      <span className="flex items-baseline gap-1.5 text-22 leading-[1.18] font-extrabold tabular-nums">
        {done} <small className="text-12 font-bold text-muted">/ {goal ?? total}</small>
      </span>
      <ProgressBar done={done} total={goal ?? total} label={name} />
    </Link>
  );
}
