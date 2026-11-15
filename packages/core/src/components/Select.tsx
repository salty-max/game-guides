import { useEffect, useState } from "react";
import { chunks, loadFailed } from "./chunks";
import { Icon } from "./Icon";
import { selectField, selectTrigger, type SelectProps } from "./select-style";
import { useLoadable, whenIdle } from "../loadable";

/**
 * One choice from a short list. This is the shell pages use: the select itself (select-impl.tsx, and the floating-ui code under its
 * popup) is a chunk of its own, fetched once the page is idle, or sooner when the reader's pointer or focus reaches a select. Until it
 * arrives the closed trigger is drawn by hand, the same size and the same look, so nothing moves when it's swapped in. A tap on it
 * meanwhile is kept and opens the list as soon as it can, the focus it had goes to the real trigger, and if the chunk can't be fetched
 * a toast says so and the next tap tries again.
 */
export function Select(props: SelectProps) {
  const { id, label, choices, value, bare = false, disabled = false } = props;
  const [wanted, setWanted] = useState(false);
  const [focused, setFocused] = useState(false);
  const loaded = useLoadable(chunks.select, false);
  useEffect(() => whenIdle(chunks.select.warm), []);
  if (loaded) return <loaded.SelectImpl {...props} defaultOpen={wanted} autoFocus={focused} />;
  const want = () => {
    setWanted(true);
    chunks.select.load().catch(loadFailed);
  };
  const current = choices.find(([key]) => String(key) === String(value))?.[1];
  return (
    <div className={selectField}>
      <label htmlFor={id} className={bare ? "sr-only" : undefined}>
        {label}
      </label>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        disabled={disabled}
        data-disabled={disabled ? "" : undefined}
        className={selectTrigger}
        onClick={want}
        onKeyDown={(event) => {
          // The real trigger opens on the arrow keys as well.
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            want();
          }
        }}
        onPointerEnter={chunks.select.warm}
        onFocus={() => {
          setFocused(true);
          chunks.select.warm();
        }}
        onBlur={() => setFocused(false)}
      >
        <span>{current}</span>
        <span className="text-muted">
          <Icon name="down" className="svg-icon size-4" />
        </span>
      </button>
    </div>
  );
}
