import { Button, Chip } from "@hundo/core/components/ui";
import { useProgress } from "@hundo/core/store/progress";
import { useUi } from "@hundo/core/store/ui";
import { blankRun, modeNames, type RunMode } from "./run-log";

export function DeathlessRun() {
  const mode = useProgress((s) => s.data.extra.mode);
  const run = useProgress((s) => s.data.extra.runs[s.data.extra.mode]);
  const setExtra = useProgress((s) => s.setExtra);
  const announce = useUi((s) => s.announce);
  const openDialog = useUi((s) => s.openDialog);
  const label = modeNames[mode];
  const setRun = (change: (current: typeof run) => typeof run) =>
    setExtra((log) => ({ ...log, runs: { ...log.runs, [log.mode]: change(log.runs[log.mode]) } }));

  let message = "No deaths logged. Compare this count with the grave icon on your Switch save-select screen.";
  if (run.deaths) message = "A Game Over ends this deathless attempt. Your collection checklist still works for this file.";
  if (run.cleared) message = run.deaths ? "Clear recorded with deaths." : `Zero-death clear recorded for ${label} mode.`;

  const log = (delta: 1 | -1) => {
    setRun((current) => ({ ...current, deaths: delta === 1 ? Math.min(Number.MAX_SAFE_INTEGER, current.deaths + 1) : Math.max(0, current.deaths - 1) }));
    const { deaths } = useProgress.getState().data.extra.runs[mode];
    announce(`${deaths} deaths logged.`);
    // "Undo death" disables at zero; keep keyboard focus somewhere useful.
    if (deaths === 0) document.getElementById("death-plus")?.focus();
  };

  return (
    <section id="deathless" className="panel">
      <h2>Deathless run</h2>
      <div className="run-mode" aria-label="Run mode">
        {(Object.entries(modeNames) as [RunMode, string][]).map(([id, name]) => (
          <Chip key={id} label={name} value={id} current={mode} onSelect={(value) => setExtra((current) => ({ ...current, mode: value as RunMode }))} />
        ))}
      </div>
      <div className="run-number">
        {run.deaths}
        <small>{run.deaths === 1 ? "death" : "deaths"}</small>
      </div>
      <p>{message}</p>
      <div className="controls">
        <Button icon="plus" onClick={() => log(1)} id="death-plus">
          Log death
        </Button>
        <Button icon="minus" onClick={() => log(-1)} disabled={run.deaths === 0}>
          Undo death
        </Button>
        <Button
          onClick={() => {
            setRun((current) => ({ ...current, cleared: !current.cleared }));
            announce(useProgress.getState().data.extra.runs[mode].cleared ? "Run clear recorded." : "Run clear removed.");
          }}
        >
          {run.cleared ? "Undo clear" : "Record clear"}
        </Button>
        <Button
          onClick={() =>
            openDialog({
              kind: "confirm",
              title: `Reset the ${label} run?`,
              explanation: "The death count and clear status for this mode will be reset.",
              label: "Reset run",
              danger: true,
              onConfirm: () => setRun(blankRun),
            })
          }
        >
          Reset this run
        </Button>
      </div>
      <p>Log a Game Over. Secret Medicine can revive you automatically without adding a death. Use bottled fairies before health reaches zero.</p>
      <p>Normal and Hero runs are logged separately. The collection checklist is shared.</p>
    </section>
  );
}
