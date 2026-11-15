// How the reader last used the device: a touch, or a key. The dialogs are opened from the store, so Base UI can't say what opened them,
// and a dialog opened by a touch wants a different first focus (DialogFrames.tsx). This is its own small module, imported by DialogHost,
// so the listening starts with the page and not with the dialog's chunk, which a quick first tap can beat.
let last: "touch" | "keyboard" | "pointer" = "pointer";

if (typeof document !== "undefined") {
  document.addEventListener("pointerdown", (event) => (last = event.pointerType === "touch" || event.pointerType === "pen" ? "touch" : "pointer"), true);
  document.addEventListener("keydown", () => (last = "keyboard"), true);
}

export const lastInput = () => last;
