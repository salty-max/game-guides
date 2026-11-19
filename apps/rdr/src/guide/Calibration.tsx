import { useState, type FormEvent } from "react";
import { TextField } from "@hundo/core/components/TextField";
import { Button, Panel, PanelForm, PanelHead, PanelText, PanelTitle } from "@hundo/core/components/ui";
import { allRows } from "@hundo/core/guide";
import { useProgress } from "@hundo/core/store/progress";
import { useUi } from "@hundo/core/store/ui";
import { calibrationDelta, estimate, readPercent } from "./estimate";

export function Calibration() {
  const reported = useProgress((s) => s.data.extra.reported);
  const checks = useProgress((s) => s.data.checks);
  const setExtra = useProgress((s) => s.setExtra);
  const announce = useUi((s) => s.announce);
  const [draft, setDraft] = useState(reported === null ? "" : String(reported));
  const [error, setError] = useState("");
  // An imported backup or another tab can change the saved number; show it instead of a stale draft.
  const [seen, setSeen] = useState(reported);
  if (seen !== reported) {
    setSeen(reported);
    setDraft(reported === null ? "" : String(reported));
  }
  const estimated = estimate(checks, allRows);
  const setReported = (value: number | null) => setExtra((extra) => ({ ...extra, reported: value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = readPercent(draft);
    if (value === null) {
      setError("Enter a number from 0 to 100.");
      return;
    }
    setError("");
    setDraft(String(value));
    setReported(value);
    announce("In-game percentage saved.");
  };

  const delta = reported === null ? null : calibrationDelta(estimated, reported);
  return (
    <Panel id="calibration" aria-labelledby="calibration-title">
      <PanelHead>
        <PanelTitle id="calibration-title">Check against the game</PanelTitle>
        <PanelText>
          The game keeps its own completion percentage in Stats → General. This is the guide’s estimate of it, from the game’s category weights: Ambient
          Challenges add credit at ranks 5 and 10, outfit scraps and optional tasks add none, and a Stranger task counts once its last step is checked.
          It is not the overall bar’s figure, which counts every target on the board, each item once.
        </PanelText>
      </PanelHead>
      <PanelText tone="ink">Estimated in-game completion: {estimated}%</PanelText>
      <PanelText>Enter the completion percentage from Stats → General to see how far the estimate is off.</PanelText>
      <PanelForm onSubmit={submit}>
        <TextField
          id="reported"
          label="In-game completion (%)"
          inputMode="decimal"
          width="short"
          value={draft}
          onChange={setDraft}
          error={error}
          alertError
          actions={
            <>
              <Button type="submit" look="">
                Save
              </Button>
              {reported !== null && (
                <Button
                  onClick={() => {
                    setReported(null);
                    setDraft("");
                    setError("");
                  }}
                >
                  Clear
                </Button>
              )}
            </>
          }
        />
      </PanelForm>
      {delta !== null && (
        <PanelText tone="ink" role="status">
          Estimate {estimated}% · game {reported}% ·{" "}
          {delta === 0
            ? "they match."
            : delta > 0
              ? `the game is ${delta} points ahead. Something is done in the game that isn’t checked here.`
              : `the estimate is ${Math.abs(delta)} points ahead. Something checked here may not count in the game yet.`}
        </PanelText>
      )}
    </Panel>
  );
}
