import { Link } from "react-router";
import { Icon } from "./Icon";
import { ProgressBar } from "./ui";
import { cats, tally } from "../guide";
import { useProgress } from "../store/progress";

export function Stat({ tag, goal }: { tag: string; goal?: number }) {
  const checks = useProgress((s) => s.data.checks);
  const { done, total } = tally(tag, checks);
  const [name, , graphic, tone] = cats[tag];
  return (
    <Link className="stat" to={`/checklist/${tag}`}>
      <span className="stat-head">
        <span className="stat-icon" data-tone={tone}>
          <Icon name={graphic} />
        </span>
        {name}
      </span>
      <span className="stat-values">
        {done} <small>/ {goal ?? total}</small>
      </span>
      <ProgressBar done={done} total={goal ?? total} label={name} />
    </Link>
  );
}
