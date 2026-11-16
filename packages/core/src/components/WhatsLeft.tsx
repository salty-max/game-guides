import { Link } from "react-router";
import { Panel, PanelText, PanelTitle } from "./ui";
import { cats, completion, whatsLeft } from "../guide";
import { useProgress } from "../store/progress";
import { pressText } from "./press-style";

const points = (value: number) => (Math.round(value * 10) / 10).toFixed(1);

/** The dashboard's categories by what is left in them, biggest first, each with a bar of its size and how much of it is done. */
export function WhatsLeft() {
  const checks = useProgress((s) => s.data.checks);
  const items = whatsLeft(checks);
  const max = Math.max(...items.map((item) => item.total), 1);
  const inPoints = completion.unit === "points";
  const figure = inPoints ? points : String;
  return (
    <Panel space="below" aria-labelledby="whats-left-title">
      <PanelTitle id="whats-left-title">What’s left</PanelTitle>
      {items.length ? (
        <>
          <PanelText>
            {inPoints
              ? `About ${points(items.reduce((sum, item) => sum + item.left, 0))} points to go. Biggest remaining first, using the estimate’s weights.`
              : "Biggest gaps first."}
          </PanelText>
          <ul className="mt-3 mb-0 grid list-none gap-2.5 p-0">
            {items.map((item) => (
              <li key={item.tag} className="grid grid-cols-[minmax(120px,190px)_1fr_auto] items-center gap-3 text-[14px] phone:grid-cols-[1fr_auto]">
                <Link className={`${pressText} hover:text-primary hover:underline hover:underline-offset-3`} to={`/checklist/${item.tag}`}>
                  {cats[item.tag][0]}
                </Link>
                {/* Decoration: the numbers beside it say the same. Its length is the category's share of the biggest, and the darker part is what's done. */}
                <span className="block h-2.5 phone:order-3 phone:col-span-full" aria-hidden="true">
                  <span className="block h-full overflow-hidden rounded-[10px] bg-bar-track" style={{ width: `${(item.total / max) * 100}%` }}>
                    <span className="block h-full bg-primary" style={{ width: `${((item.total - item.left) / item.total) * 100}%` }} />
                  </span>
                </span>
                <span className="font-extrabold whitespace-nowrap tabular-nums">
                  {figure(item.left)} <small className="text-[12px] font-bold text-muted">of {figure(item.total)} {inPoints ? "pts " : ""}left</small>
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <PanelText>Nothing left. That’s a 100%.</PanelText>
      )}
    </Panel>
  );
}
