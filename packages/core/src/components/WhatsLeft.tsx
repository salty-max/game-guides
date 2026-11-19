import { Link } from "react-router";
import { Panel, PanelHead, PanelText, PanelTitle } from "./ui";
import { cats, checklistOf, whatsLeft } from "../guide";
import { useProgress } from "../store/progress";
import { pressTextClasses } from "./press-style";

/** The dashboard's categories by what is left in them, biggest first, each with a bar of its size and how much of it is done. */
export function WhatsLeft() {
  const checks = useProgress((s) => s.data.checks);
  const items = whatsLeft(checks);
  const max = Math.max(...items.map((item) => item.total), 1);
  return (
    <Panel id="whats-left" aria-labelledby="whats-left-title">
      <PanelHead>
        <PanelTitle id="whats-left-title">What’s left</PanelTitle>
        <PanelText>
          {items.length ? "Biggest gaps first." : "Nothing left. That’s a 100%."}
        </PanelText>
      </PanelHead>
      {items.length > 0 && (
        <>
          {/* Its own width decides (`/left`): under 28rem a category's bar goes under its name and figures, so the bar keeps a length worth reading. */}
          <ul className="@container/left grid list-none gap-2.5 p-0">
            {items.map((item) => (
              <li key={item.tag} className="grid grid-cols-[minmax(7.5rem,11.875rem)_1fr_auto] items-center gap-3 text-14 @max-[28rem]/left:grid-cols-[1fr_auto]">
                {/* At least 24px tall, the smallest target WCAG 2.2's target size allows, where its line alone is 22px. */}
                <Link className={`${pressTextClasses} flex min-h-6 items-center hover:text-primary hover:underline hover:underline-offset-3`} to={checklistOf(item.tag)}>
                  {cats[item.tag][0]}
                </Link>
                {/* Decoration: the numbers beside it say the same. Its length is the category's share of the biggest, and the darker part is what's done. */}
                <span className="block h-2.5 @max-[28rem]/left:order-3 @max-[28rem]/left:col-span-full" aria-hidden="true">
                  <span className="block h-full overflow-hidden rounded-[10px] bg-bar-track" style={{ width: `${(item.total / max) * 100}%` }}>
                    <span className="block h-full bg-primary" style={{ width: `${((item.total - item.left) / item.total) * 100}%` }} />
                  </span>
                </span>
                <span className="font-extrabold whitespace-nowrap tabular-nums">
                  {item.left} <small className="text-12 font-bold text-muted">of {item.total} left</small>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Panel>
  );
}
