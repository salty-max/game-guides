import { useState, type FormEvent } from "react";
import { Button } from "../core/components/ui";
import { coreRows } from "../core/guide";
import { useProgress } from "../core/store/progress";
import { useUi } from "../core/store/ui";
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
  const estimated = estimate(checks, coreRows);
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
    <section id="calibration" className="panel" aria-labelledby="calibration-title">
      <h2 id="calibration-title">Check against the game</h2>
      <p>Enter the completion percentage from Stats → General to see how far this guide’s estimate is off.</p>
      <form className="calibration" onSubmit={submit} noValidate>
        <label className="field" htmlFor="reported">
          <span>In-game completion (%)</span>
          <input
            id="reported"
            className="select"
            inputMode="decimal"
            value={draft}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "reported-error" : undefined}
            onChange={(event) => setDraft(event.target.value)}
          />
        </label>
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
      </form>
      {error && (
        <p id="reported-error" className="inline-error" role="alert">
          {error}
        </p>
      )}
      {delta !== null && (
        <p className="delta" role="status">
          Guide {estimated}% · game {reported}% ·{" "}
          {delta === 0
            ? "they match."
            : delta > 0
              ? `the game is ${delta} points ahead. Something is done in the game that isn’t checked here.`
              : `the guide is ${Math.abs(delta)} points ahead. Something checked here may not count in the game yet.`}
        </p>
      )}
    </section>
  );
}
