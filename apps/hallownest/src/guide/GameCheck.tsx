import { Panel, PanelHead, PanelText, PanelTitle } from "@hundo/core/components/ui";
import { allRows } from "@hundo/core/guide";
import { useProgress } from "@hundo/core/store/progress";
import { FULL, gamePoints } from "./points";

/**
 * What the save file should read for the reader's ticks, in the game's own terms. It needs no input: the game's count is exact. It is
 * not the overall bar's figure: the bar counts every board target, each item once, and this counts the game's own weights. Worded as
 * the save's number, never as a bare 112% beside the bar's 100%.
 */
export function GameCheck() {
  const checks = useProgress((s) => s.data.checks);
  const points = gamePoints(checks, allRows);
  return (
    <Panel id="game-check" aria-labelledby="game-check-title">
      <PanelHead>
        <PanelTitle id="game-check-title">Check against the game</PanelTitle>
        <PanelText>
          The game keeps its own completion percentage, which the inventory shows once you have World Sense. It counts up to {FULL}% with all
          four free content packs installed.
        </PanelText>
      </PanelHead>
      <PanelText tone="ink">{points === FULL ? `Your save should read ${FULL}%: all the game counts.` : `Your save should read ${points}%.`}</PanelText>
      <PanelText>
        That’s the game’s count, not the bar’s: the bar counts every target on the board, each item once, so the two figures differ.
      </PanelText>
      <PanelText>If the game reads more, something done in the game isn’t ticked here. If it reads less, something ticked here isn’t done yet.</PanelText>
    </Panel>
  );
}
