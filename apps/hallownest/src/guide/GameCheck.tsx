import { Panel, PanelHead, PanelText, PanelTitle } from "@hundo/core/components/ui";
import { coreRows } from "@hundo/core/guide";
import { useProgress } from "@hundo/core/store/progress";
import { FULL, gamePoints } from "./points";

/**
 * What the save file should read for the reader's ticks, in the game's own terms. It needs no input: the game's count is exact, so
 * this is the overall bar's figure before it is scaled. Worded as the save's number, never as a bare 112% beside the bar's 100%.
 */
export function GameCheck() {
  const checks = useProgress((s) => s.data.checks);
  const points = gamePoints(checks, coreRows);
  return (
    <Panel id="game-check" aria-labelledby="game-check-title">
      <PanelHead>
        <PanelTitle id="game-check-title">Check against the game</PanelTitle>
        <PanelText>
          The game keeps its own completion percentage, which the inventory shows once you have World Sense. It counts up to {FULL}% with all
          four free content packs installed.
        </PanelText>
      </PanelHead>
      <PanelText tone="ink">{points === FULL ? `Your save should read ${FULL}%: everything.` : `Your save should read ${points}%.`}</PanelText>
      <PanelText>If the game reads more, something done in the game isn’t ticked here. If it reads less, something ticked here isn’t done yet.</PanelText>
    </Panel>
  );
}
