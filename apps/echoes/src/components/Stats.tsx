import { Link } from "react-router";
import { Icon } from "./Icon";
import { ProgressBar } from "./ui";
import { cats, tally, type CategoryId } from "../lib/guide";
import { useProgress } from "../store/progress";

export function Stat({ tag, goal }: { tag: CategoryId; goal?: number }) {
  const checks = useProgress((s) => s.data.checks);
  const { done, total } = tally(tag, checks);
  const [name, , graphic] = cats[tag];
  return (
    <Link className="stat" to={`/checklist/${tag}`}>
      <span className="stat-head">
        <span className={`stat-icon ${tag}`}>
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
